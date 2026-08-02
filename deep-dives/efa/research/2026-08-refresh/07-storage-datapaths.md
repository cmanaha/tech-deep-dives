# Storage Data Paths: S3 + CRT over ENA vs FSx for Lustre vs EFA/SRD — Refresh

**Research date / accessed:** 2026-08-01
**Method:** Code-first. The S3 client behaviour in §1–§3 is read from the actual C source of the AWS Common Runtime at pinned commits. AWS documentation is used only as a secondary cross-check. Where docs and code disagree, **the code wins and the disagreement is reported as a finding.** §4 (FSx for Lustre) is documentation-sourced — no equivalent open-source artifact exists for the service side — and is labelled accordingly throughout.

---

## Headline findings

1. **A premise in the brief is refuted.** *"FSx for Lustre in scratch mode with an S3 data repository link"* is **not** the fabric path. **[T1]** *"EFA is supported on Persistent 2 file systems with a metadata configuration specified."* Scratch 1, Scratch 2, Persistent 1, and HDD get no EFA and no GDS. Choosing scratch forfeits the fabric, permanently, at create time. → §4.0
2. **FSx for Lustre + EFA + GDS is real, and the gap is 7–12×.** Same file system, per client: **100 Gbps over ENA, 700 Gbps over EFA, 1,200 Gbps with GDS** **[T1]**. GDS requires an EFA-enabled Persistent 2 file system *and* a P5 / P5e / P5en / P6-B200 client. → §4.2, §4.3
3. **CRT multi-NIC harvesting is real, but 100% manual.** Connections are round-robined across interfaces via `SO_BINDTODEVICE`, one interface per new connection. **The CRT never discovers NICs** — `getifaddrs`/`if_nameindex` do not appear anywhere in `aws-c-io`, and the CRT's own source says so: *"CRT clients default to using a single NIC unless configured to use multiple NICs by identifying the number of NICs and providing the names in an array."* → §2.2, §2.3
4. **There is no EFA path to S3, at the source level.** A grep for `efa`, `libfabric`, `rdma`, `ibverbs`, `GPUDirect`, `nvidia` across all of `aws-c-s3`, `aws-c-io`, `aws-c-http` at the pinned commits returns **zero hits**. → §2.7
5. **`throughput_target_gbps` is a divisor, not a rate limiter.** `connections = clamp(ceil(target / 0.4), 10, 10000)`, and the same number silently selects a 2–24 GiB memory ceiling. Raising it makes each range request *smaller*. → §1.1–§1.3
6. **The CRT does not back off concurrency on 503 SlowDown.** `ideal_connection_count` is written once at construction and never recomputed. → §1.6
7. **Two doc-vs-code disagreements found**, one of which needs one more check before publication (U-5). → §2.5, §3.2

---

## 0. Source authority key and pinned commits

| Tier | Meaning |
| --- | --- |
| **CODE** | Read directly from source at the pinned commit. Repo + file + line + literal text given. This is the highest authority in this document. |
| **T1** | Official AWS documentation (`docs.aws.amazon.com`) or AWS Price List / What's New. |
| **T2** | AWS-authored blog or marketing page under `aws.amazon.com`. |
| **T3** | Third party. **Not used as a load-bearing source in this report.** |
| **DERIVED** | Arithmetic or logical inference performed by this research pass over CODE or T1. Never presented as sourced. |
| **UNKNOWN** | No source found. Registered in §8. |

### Pinned commits (cloned and read locally on 2026-08-01)

| Repo | Commit SHA | Commit date | Nearest tag |
| --- | --- | --- | --- |
| `awslabs/aws-c-s3` | `469cbd020db52c329631a614e3b8401f3fda7717` | 2026-07-30 | `v0.13.4` |
| `awslabs/aws-c-io` | `fbac3c30fd8c50c05168f41486403a69d91f7600` | 2026-07-29 | `v0.27.5-1` |
| `awslabs/aws-c-http` | `e543240bbd28ce39423bbc470785f2f38ff28ecb` | 2026-07-29 | `v0.11.0-5` |

All line numbers below refer to these exact commits.

**Non-authoritative by rule:** every `/* ... */` comment quoted below is quoted *as evidence of intent*, not as evidence of behaviour. Where a comment and the surrounding code disagree, that is called out (see §1.7, which finds exactly such a case).

---

## 1. The CRT S3 client: what the code actually does

### 1.1 THE HEADLINE: `throughput_target_gbps` is a divisor, not a rate limiter

The single most misunderstood knob in the CRT S3 client. It does **not** shape, pace, or cap traffic. It is fed into one division to pick a connection count, and into one lookup ladder to pick a memory budget. That is the whole of its effect.

**[CODE]** `aws-c-s3` `source/s3_client.c:59-77`:

```c
/* max-requests-in-flight = ideal-num-connections * s_max_requests_multiplier */
static const uint32_t s_max_requests_multiplier = 4;

/* This is used to determine the ideal number of HTTP connections. Algorithm is roughly:
 * num-connections-max = throughput-target-gbps / s_throughput_per_connection_gbps
 *
 * Magic value based on: match results of the previous algorithm,
 * where throughput-target-gpbs of 100 resulted in 250 connections.
 *
 * TODO: Improve this algorithm (expect higher throughput for S3 Express,
 * expect lower throughput for small objects, etc)
 */
static const double s_throughput_per_connection_gbps = 100.0 / 250;

/* After throughput math, clamp the min/max number of connections */
const uint32_t g_min_num_connections = 10; /* Magic value based on: 10 was old behavior */
/* Magic value based on: 10000 is picked randomly to be reasonable. Based on s_throughput_per_connection_gbps, that will
 * be 2500 Gbps. */
const uint32_t g_max_num_connections = 10000;
```

**[CODE]** `source/s3_client.c:163-169` — the entire algorithm:

```c
static uint32_t s_get_ideal_connection_number_from_throughput(double throughput_gps) {
    double ideal_connection_count_double = throughput_gps / s_throughput_per_connection_gbps;
    /* round up and clamp */
    ideal_connection_count_double = ceil(ideal_connection_count_double);
    ideal_connection_count_double = aws_min_double(g_max_num_connections, ideal_connection_count_double);
    return (uint32_t)ideal_connection_count_double;
}
```

**[CODE]** `source/s3_client.c:422-423` — applied once, at construction, with the low clamp:

```c
    *(uint32_t *)&client->ideal_connection_count = aws_max_u32(
        g_min_num_connections, s_get_ideal_connection_number_from_throughput(client->throughput_target_gbps));
```

**[CODE]** `source/s3_util.c:68` — the default when the caller sets nothing:

```c
const double g_default_throughput_target_gbps = 10.0;
```

**[DERIVED]** The real constant is **0.4 Gbps per connection = 50 MB/s per connection**. The connection count is therefore `clamp(ceil(target_gbps / 0.4), 10, 10000)`:

| `throughput_target_gbps` | Connections (`ideal_connection_count`) | Max requests in flight (×4) |
| --- | --- | --- |
| unset → 10.0 (default) | 25 | 100 |
| 25 | 63 | 252 |
| 100 | 250 | 1,000 |
| 200 | 500 | 2,000 |
| 400 | 1,000 | 4,000 |
| 800 | 2,000 | 8,000 |
| ≥ 4,000 | 10,000 (clamped) | 40,000 |

**[CODE]** `source/s3_client.c:210-213` — the ×4 in-flight multiplier:

```c
uint32_t aws_s3_client_get_max_requests_in_flight(struct aws_s3_client *client) {
    AWS_PRECONDITION(client);
    return aws_s3_client_get_max_active_connections(client, NULL) * s_max_requests_multiplier;
}
```

### 1.2 `throughput_target_gbps` also silently picks the memory budget

This is the second, undocumented-in-the-header effect of the same knob.

**[CODE]** `source/s3_client.c:383-411`:

```c
    size_t mem_limit = 0;
    if (mem_limit_configured == 0) {
#if SIZE_BITS == 32
        if (client_config->throughput_target_gbps > 25.0) {
            mem_limit = GB_TO_BYTES(2);
        } else {
            mem_limit = GB_TO_BYTES(1);
        }
#else
        if (client_config->throughput_target_gbps >= 200.0) {
            mem_limit = GB_TO_BYTES(24);
        } else if (client_config->throughput_target_gbps >= 100.0) {
            mem_limit = GB_TO_BYTES(16);
        } else if (client_config->throughput_target_gbps >= 75.0) {
            mem_limit = GB_TO_BYTES(8);
        } else if (client_config->throughput_target_gbps >= 25.0) {
            mem_limit = GB_TO_BYTES(4);
        } else {
            mem_limit = GB_TO_BYTES(2);
        }
#endif
    } else {
```

`GB_TO_BYTES` is binary despite the name — **[CODE]** `include/aws/s3/private/s3_util.h:25-27`:

```c
#define KB_TO_BYTES(kb) ((kb) * 1024)
#define MB_TO_BYTES(mb) ((mb) * 1024 * 1024)
#define GB_TO_BYTES(gb) ((uint64_t)(gb) * 1024 * 1024 * 1024ULL)
```

So the ladder is 2 / 4 / 8 / 16 / 24 **GiB**, and `MB_TO_BYTES(8)` is 8 **MiB**. Overridable by env var — **[CODE]** `source/s3_client.c:99`: `static const char *s_memory_limit_env_var = "AWS_CRT_S3_MEMORY_LIMIT_IN_GIB";`

**[DERIVED, operational]** Setting `throughput_target_gbps = 400` on a host does not merely open more sockets — it commits the process to a **24 GiB** buffer-pool ceiling. On a container with a lower cgroup memory limit this is an OOM waiting to happen, and nothing in the config surface warns about it. The `AWS_CRT_S3_MEMORY_LIMIT_IN_GIB` env var is the escape hatch, and it is documented **[T1]** at `https://docs.aws.amazon.com/cli/latest/topic/s3-config.html`.

### 1.3 Part size / range size: three different numbers, resolved in three stages

There is no single "part size". The code computes a client-level size, then a per-request size, then (for PUT) a service-limit-adjusted size.

**[CODE]** `source/s3_util.c:93-103` — the base constants:

```c
/**
 * TODO: update this default part size 17/16 MiB based on S3 best practice.
 * Default part size is 8 MiB to reach the best performance from the experiments we had.
 * Default max part size is 5GiB as the current server limit.
 **/
const uint64_t g_default_part_size_fallback = MB_TO_BYTES(8);
#define G_DEFAULT_MAX_PART_SIZE 5368709120ULL
const uint64_t g_default_max_part_size = G_DEFAULT_MAX_PART_SIZE;
```

**[CODE]** `source/s3_util.c:65-66`:

```c
const uint32_t g_s3_max_num_upload_parts = 10000;
const size_t g_s3_min_upload_part_size = MB_TO_BYTES(5);
```

**Stage 1 — client-level `optimal_range_size`.** **[CODE]** `source/s3_util.c:104-111, 828-877`:

```c
/**
 * The most parts in memory will be:
 * - All downloaded parts to deliver them in the right order (download)
 * - All parts read into memory for preparing for the HTTP level (upload)
 * - All transferring parts in HTTP
 * So, it gives us at most 3 × (the max range size) × (concurrency) in memory.
 */
static const uint32_t s_optimal_range_size_memory_divisor = 3;
```

```c
    uint64_t memory_constrained_size = memory_limit_in_bytes / max_connections / s_optimal_range_size_memory_divisor;

    /* Apply minimum constraint first */
    uint64_t optimal_size = memory_constrained_size;
    if (optimal_size < g_default_part_size_fallback) {
        optimal_size = g_default_part_size_fallback;
    }
    /* Apply maximum constraint */
    if (optimal_size > g_default_max_part_size) {
        optimal_size = g_default_max_part_size;
    }
```

**[DERIVED]** `optimal_range_size = clamp(mem_limit / connections / 3, 8 MiB, 5 GiB)`:

| Target Gbps | Mem limit | Conns | `mem/conns/3` | Resulting `optimal_range_size` |
| --- | --- | --- | --- | --- |
| 10 (default) | 2 GiB | 25 | 27.31 MiB | **27.31 MiB** |
| 100 | 16 GiB | 250 | 21.84 MiB | **21.84 MiB** |
| 400 | 24 GiB | 1,000 | 8.19 MiB | **8.19 MiB** |
| 800 | 24 GiB | 2,000 | 4.10 MiB | **8 MiB** (floor binds) |

**[DERIVED, important]** The relationship is *inverted* from intuition: **the higher you set the throughput target, the smaller each range request becomes**, because the fixed memory ladder is divided by a growing connection count. Past roughly 400 Gbps the 8 MiB floor binds and the client is issuing the smallest range it will ever issue, at maximum concurrency. This is the regime where per-request overhead and S3 request-rate limits (§3) start to dominate, and it is reached by configuration alone, with no warning.

**Stage 2 — per-request range size, aligned to the object's stored part boundaries.** This is the most interesting mechanism in the client and it is not described in any AWS doc found in this pass.

**[CODE]** `source/s3_auto_ranged_get.c:824-847` — the client parses the object's **ETag suffix** to learn how many parts the object was originally uploaded in, and derives the server-side stored part size:

```c
            /* Extract number of parts stored in S3 from ETag and calculate estimated part size */
            uint32_t num_parts = 0;
            if (aws_s3_extract_parts_from_etag(etag_header_value, &num_parts) == AWS_OP_SUCCESS && num_parts > 0) {
                auto_ranged_get->estimated_object_stored_part_size = object_size / num_parts;
```

**[CODE]** `source/s3_util.c:960-984` — the parse is literally "split the ETag on `-`, take field 2":

```c
    while (aws_byte_cursor_next_split(&remaining_cursor, '-', &substr)) {
        split_count++;
        if (split_count == 2) {
            /**
             * The ETag should follow the pattern <hash>-<parts_count>, so the second part is the parts count.
             * The S3 ETag will not have `-` in the hash value, as it's a HEX string.
             **/
            parts_count = substr;
        }
```

**[CODE]** `source/s3_util.c:879-922` — the per-request size then takes the min against that stored part size and applies a ceiling:

```c
    uint64_t optimal_size = client_optimal_range_size;
    if (estimated_object_stored_part_size > 0 && estimated_object_stored_part_size < client_optimal_range_size) {
        optimal_size = estimated_object_stored_part_size;
    }
    /* Apply minimum constraint first to avoid excessive alignment */
    if (optimal_size < g_default_part_size_fallback) {
        optimal_size = g_default_part_size_fallback;
    }
    ...
    if (is_express) {
        ...
        optimal_size = aws_min_u64(optimal_size, MB_TO_BYTES(128));
    } else {
        /* As in 2025, each part in S3 general bucket can provide around 10 Gbps throughput.
         * Use 2GiB to below the INT32_MAX. Given the 5GiB max part size */
        optimal_size = aws_min_u64(optimal_size, GB_TO_BYTES(2));
    }
```

**[DERIVED]** `request_range = clamp(min(client_optimal_range_size, object_size / etag_part_count), 8 MiB, 2 GiB)` — or `128 MiB` ceiling on S3 Express. The intent, per the code, is to avoid having many connections hammer a single server-side part, since a single part is throughput-limited server-side (the comment cites ~10 Gbps per part for general-purpose buckets, ~100 Gbps per part for Express — both **comments**, i.e. non-authoritative, but they explain the constants).

**[DERIVED, publishable]** A practical consequence: **how an object was written determines how fast it can be read.** An object uploaded as a single PUT has an ETag with no `-N` suffix, so `num_parts` is 1 and `estimated_object_stored_part_size` equals the whole object size — the min-clause never binds and the client uses its own range size. But an object uploaded in many small parts (say 5 MiB) yields `estimated_object_stored_part_size = 5 MiB`, which is below the 8 MiB floor, so the floor binds at 8 MiB. Object layout at write time is a read-throughput decision.

**Stage 3 — PUT: multipart threshold and service-limit adjustment.**

**[CODE]** `source/s3_client.c:542-547` — the default threshold:

```c
    if (client_config->multipart_upload_threshold != 0) {
        *((uint64_t *)&client->multipart_upload_threshold) = client_config->multipart_upload_threshold;
    } else {
        *((uint64_t *)&client->multipart_upload_threshold) =
            part_size > g_s3_min_upload_part_size ? part_size : g_s3_min_upload_part_size;
    }
```

**[DERIVED]** With everything unset: `part_size = 8 MiB`, so `multipart_upload_threshold = max(8 MiB, 5 MiB) = 8 MiB`. Uploads ≤ 8 MiB go as a single `PutObject`; above that, MPU.

**[CODE]** `source/s3_client.c:1494-1495` — the branch:

```c
                if (content_length_found && content_length <= multipart_upload_threshold) {
                    return aws_s3_meta_request_default_new(
```

**[CODE]** `source/s3_client.c:1431-1440` and `source/s3_util.c:715-729` — the part size is raised until `num_parts <= 10000`, floored at 5 MiB, capped at `min(mem_limit/2, 5 GiB)` (`source/s3_client.c:436`).

**[CODE]** `source/s3_auto_ranged_put.c:43-48` — a separate, env-tunable read-ahead limit on the upload side:

```c
static const uint32_t s_max_parts_pending_read_default = 5;
static const char *s_max_parts_pending_read_env_var = "AWS_CRT_S3_MAX_PARTS_PENDING_READ";
```

Cross-check **[T1]** `https://docs.aws.amazon.com/cli/latest/topic/s3-config.html` documents `AWS_CRT_S3_MAX_PARTS_PENDING_READ` with **Default - 5**. Code and doc agree.

### 1.4 Connection pooling, DNS harvesting, and the request scheduler

**[CODE]** `source/s3_endpoint.c:154-188` — one `aws_http_connection_manager` per endpoint (per host name), created with `max_connections` equal to the client's `ideal_connection_count`:

```c
    struct aws_socket_options socket_options;
    AWS_ZERO_STRUCT(socket_options);
    socket_options.type = AWS_SOCKET_STREAM;
    socket_options.domain = AWS_SOCKET_IPV4;
    socket_options.connect_timeout_ms = connect_timeout_ms == 0 ? s_connection_timeout_ms : connect_timeout_ms;
    /* Disable Nagle's algorithm by default. S3 transfers are latency-sensitive and issue many small writes
     * (request headers, etc.), so we want them sent immediately rather than being buffered by the OS. */
    socket_options.tcp_nodelay = AWS_SOCKET_TCP_NODELAY_ON;
```

**[CODE, finding]** `socket_options.domain = AWS_SOCKET_IPV4;` is **hard-coded** at `source/s3_endpoint.c:158`. A repo-wide grep for `AWS_SOCKET_IPV6` in `aws-c-s3/source` returns nothing. **[DERIVED]** The CRT S3 client is IPv4-only at the socket layer regardless of whether a dual-stack S3 endpoint is used. Relevant to IPv6-only VPC designs.

**DNS harvesting is real and is in `aws-c-io`.** **[CODE]** `aws-c-s3` `source/s3_endpoint.c:81-92` sets a resolver config with `max_ttl = options->dns_host_address_ttl_seconds`, which the client sets to **300 s** (`source/s3_client.c:83`: `static size_t s_dns_host_address_ttl_seconds = 5 * 60;`).

**[CODE]** `aws-c-io` `source/host_resolver.c:1381-1382` — the rotation mechanism is an LRU cache, so successive resolutions vend *different* S3 front-end IPs:

```c
    struct aws_host_address_cache_entry *a_entry = aws_lru_cache_use_lru_element(host_entry->a_records);
    struct aws_host_address *a_record = (a_entry != NULL) ? &a_entry->address : NULL;
```

**[CODE]** `aws-c-io` `source/host_resolver.c:877`: `entry->address.use_count += 1;`, and `source/host_resolver.c:667`: `address_entry_copy->address.connection_failure_count += 1;` — the resolver tracks per-address use and failure counts and demotes failing addresses into a separate failed-records cache.

**Ramp-up gating.** **[CODE]** `aws-c-s3` `source/s3_client.c:1971-1982`:

```c
    /* If this particular endpoint doesn't have any known addresses yet, then we don't want to go full speed in
     * ramping up requests just yet. If there is already enough in the queue for one address (even if those
     * aren't for this particular endpoint) we skip over this meta request for now. */
    struct aws_s3_endpoint *endpoint = meta_request->endpoint;
    AWS_ASSERT(endpoint != NULL);
    AWS_ASSERT(client->vtable->get_host_address_count);
    size_t num_known_vips = client->vtable->get_host_address_count(
        client->client_bootstrap->host_resolver, endpoint->host_name, AWS_GET_HOST_ADDRESS_COUNT_RECORD_TYPE_A);
    if (num_known_vips == 0 && (client->threaded_data.num_requests_being_prepared +
                                client->threaded_data.request_queue_size) >= g_min_num_connections) {
        return false;
    }
```

**[DERIVED]** Cold start is deliberately throttled to 10 in-flight preparations until at least one A record is cached. This is why CRT throughput ramps rather than steps.

**Scheduler loop.** **[CODE]** `source/s3_client.c:2377-2412` — a straightforward two-level cap: fill up to the client-wide `max_active_connections`, and within that, no meta-request may exceed its own `max_active_connections`.

### 1.5 Retry and 503 SlowDown — what the code does

**[CODE]** `source/s3_meta_request.c:1409-1419`:

```c
        case AWS_HTTP_STATUS_CODE_500_INTERNAL_SERVER_ERROR:
            error_code = AWS_ERROR_S3_INTERNAL_ERROR;
            break;
        case AWS_HTTP_STATUS_CODE_503_SERVICE_UNAVAILABLE:
            /* S3 response 503 for throttling, slow down the sending */
            error_code = AWS_ERROR_S3_SLOW_DOWN;
            break;
```

**[CODE]** `source/s3_util.c:732-748` — the same classification from the XML error body, so a 200-with-error-body or a non-503 carrying `SlowDown` is caught too:

```c
int aws_s3_crt_error_code_from_recoverable_server_error_code_string(struct aws_byte_cursor error_code_string) {
    if (aws_byte_cursor_eq_c_str_ignore_case(&error_code_string, "SlowDown")) {
        return AWS_ERROR_S3_SLOW_DOWN;
    }
    if (aws_byte_cursor_eq_c_str_ignore_case(&error_code_string, "InternalError") ||
        aws_byte_cursor_eq_c_str_ignore_case(&error_code_string, "InternalErrors")) {
        return AWS_ERROR_S3_INTERNAL_ERROR;
    }
    if (aws_byte_cursor_eq_c_str_ignore_case(&error_code_string, "RequestTimeTooSkewed")) {
        return AWS_ERROR_S3_REQUEST_TIME_TOO_SKEWED;
    }

    if (aws_byte_cursor_eq_c_str_ignore_case(&error_code_string, "RequestTimeout")) {
        return AWS_ERROR_S3_REQUEST_TIMEOUT;
    }
```

**[CODE]** `source/s3_client.c:2681-2691` — mapped to a retry *type*:

```c
        enum aws_retry_error_type error_type = AWS_RETRY_ERROR_TYPE_TRANSIENT;

        switch (error_code) {
            case AWS_ERROR_S3_INTERNAL_ERROR:
                error_type = AWS_RETRY_ERROR_TYPE_SERVER_ERROR;
                break;

            case AWS_ERROR_S3_SLOW_DOWN:
                error_type = AWS_RETRY_ERROR_TYPE_THROTTLING;
                break;
        }
```

**[CODE]** `source/s3_client.c:697-706` — the default strategy:

```c
        struct aws_exponential_backoff_retry_options backoff_retry_options = {
            .el_group = client_config->client_bootstrap->event_loop_group,
            .max_retries = s_default_max_retries,
        };

        struct aws_standard_retry_options retry_options = {
            .backoff_retry_options = backoff_retry_options,
        };

        client->retry_strategy = aws_retry_strategy_new_standard(allocator, &retry_options);
```

with `source/s3_client.c:82`: `static const uint32_t s_default_max_retries = 5;`

**Token bucket.** **[CODE]** `aws-c-io` `source/standard_retry_strategy.c:18-21`:

```c
static const size_t s_initial_retry_bucket_capacity = 500u;
static const size_t s_standard_retry_cost = 5u;
static const size_t s_standard_transient_cost = 10u;
static const size_t s_standard_no_retry_cost = 1u;
```

**[CODE]** `aws-c-io` `source/standard_retry_strategy.c:314-330` — empty bucket means the retry is *refused*, not delayed:

```c
    if (current_capacity == 0) {
        ...
        AWS_LOGF_INFO(
            AWS_LS_IO_STANDARD_RETRY_STRATEGY,
            "token_id=%p: requested to schedule retry but the bucket capacity is empty. Rejecting retry request.",
            (void *)token);
        return aws_raise_error(AWS_IO_RETRY_PERMISSION_DENIED);
    }

    if (error_type == AWS_RETRY_ERROR_TYPE_TRANSIENT) {
        capacity_consumed = aws_min_size(current_capacity, s_standard_transient_cost);
    } else {
        /* you may be looking for throttling, but if that happened, the service told us to slow down,
         * but is otherwise healthy. Pay a smaller penalty for those. */
        capacity_consumed = aws_min_size(current_capacity, s_standard_retry_cost);
    }
```

**Backoff.** **[CODE]** `aws-c-io` `source/exponential_backoff_retry_strategy.c:376-382`:

```c
    if (!exponential_backoff_strategy->config.backoff_scale_factor_ms) {
        exponential_backoff_strategy->config.backoff_scale_factor_ms = 500;
    }

    if (!exponential_backoff_strategy->config.max_backoff_secs) {
        exponential_backoff_strategy->config.max_backoff_secs = 20;
    }
```

**[CODE]** `aws-c-io` `source/exponential_backoff_retry_strategy.c:189-198, 211` — default jitter mode is full jitter:

```c
static uint64_t s_compute_no_jitter(struct exponential_backoff_retry_token *token) {
    uint64_t retry_count = aws_min_u64(aws_atomic_load_int(&token->current_retry_count), 63);
    uint64_t backoff_ns = aws_mul_u64_saturating((uint64_t)1 << retry_count, token->backoff_scale_factor_ns);
    return aws_min_u64(backoff_ns, token->maximum_backoff_ns);
}

static uint64_t s_compute_full_jitter(struct exponential_backoff_retry_token *token) {
    uint64_t non_jittered = s_compute_no_jitter(token);
    return s_random_in_range(0, non_jittered, token);
}
```
```c
    [AWS_EXPONENTIAL_BACKOFF_JITTER_DEFAULT] = s_compute_full_jitter,
```

**[DERIVED]** On 503, the CRT sleeps `uniform_random(0, min(2^n × 500 ms, 20 s))`, up to 5 retries, and debits 5 units from a 500-unit process-wide bucket that is refunded on success.

### 1.6 FINDING: there is no adaptive concurrency control on SlowDown

**[CODE]** `include/aws/s3/private/s3_client_impl.h:276` declares `const uint32_t ideal_connection_count;`. A repo-wide grep shows it is written exactly once, at `source/s3_client.c:422`, through a `const`-stripping cast during construction. It is never recomputed.

The only runtime concurrency reduction anywhere in the client is a single S3 Express-specific clamp — **[CODE]** `source/s3_auto_ranged_get.c:919-941`, gated on `meta_request->is_express`:

```c
        if (meta_request->is_express &&
            meta_request->part_size < g_s3express_connection_limitation_part_size_threshold &&
            object_size > g_s3express_connection_limitation_object_size_threshold) {
            /**
             * TODO: THIS IS A TEMP WORKAROUND, not the long term solution.
```

with **[CODE]** `source/s3_util.c:113-130`:

```c
/**
 * TODO: THIS IS A TEMP WORKAROUND, not the long term solution.
 * As in Nov 2025, S3Express recommended to have no more than 75 connections to one single part.
 ...
#define G_S3EXPRESS_CONNECTION_LIMITATION 75
const uint32_t g_s3express_connection_limitation = G_S3EXPRESS_CONNECTION_LIMITATION;
```

**[DERIVED, headline]** **The CRT S3 client does not back off its concurrency in response to 503 SlowDown.** It retries individual requests with exponential backoff and debits a token bucket, but the number of connections it will hold open against a throttling prefix is fixed at construction time. Under sustained per-prefix throttling the client keeps `ideal_connection_count` sockets pressed against the hot prefix, drains the 500-unit bucket, and then begins failing requests outright with `AWS_IO_RETRY_PERMISSION_DENIED` rather than converging to a sustainable rate. The operator remedy is to lower `throughput_target_gbps` / `max_active_connections_override`, or to spread keys across prefixes (§3) — the client will not discover either on its own.

### 1.7 FINDING: an arithmetic error in a load-bearing code comment

**[CODE]** `source/s3_client.c:75-77`:

```c
/* Magic value based on: 10000 is picked randomly to be reasonable. Based on s_throughput_per_connection_gbps, that will
 * be 2500 Gbps. */
const uint32_t g_max_num_connections = 10000;
```

**[DERIVED]** `10000 × 0.4 Gbps = 4000 Gbps`, not 2500 Gbps. The comment is wrong by a factor of 1.6. This has no functional effect but it is a clean illustration of the methodology rule: the comment is the design *intent*, the constant is the *behaviour*, and only one of them is authoritative.

---

## 2. Multiple network interfaces: VERDICT — real, but entirely manual

**Carlos's hypothesis is CONFIRMED by the code, with an important qualification: the CRT will spread connections across multiple ENA interfaces, but it will never discover them for you. You must enumerate the NICs yourself and pass their names in.**

### 2.1 The public knob

**[CODE]** `aws-c-s3` `include/aws/s3/s3_client.h:676-688`:

```c
    /**
     * THIS IS AN EXPERIMENTAL AND UNSTABLE API
     * (Optional)
     * An array of network interface names. The client will distribute the
     * connections across network interface names provided in this array. If any interface name is invalid, goes down,
     * or has any issues like network access, you will see connection failures.
     *
     * This option is only supported on Linux, MacOS, and platforms that have either SO_BINDTODEVICE or IP_BOUND_IF. It
     * is not supported on Windows. `AWS_ERROR_PLATFORM_NOT_SUPPORTED` will be raised on unsupported platforms. On
     * Linux, SO_BINDTODEVICE is used and requires kernel version >= 5.7 or root privileges.
     */
    const struct aws_byte_cursor *network_interface_names_array;
    size_t num_network_interface_names;
```

### 2.2 The full call chain, verified end to end

| # | Layer | File:line (pinned commit) | What happens |
| --- | --- | --- | --- |
| 1 | Public config | `aws-c-s3` `include/aws/s3/s3_client.h:687-688` | Caller supplies `network_interface_names_array` + count |
| 2 | Validation | `aws-c-s3` `source/s3_client.c:617-651` | Each name checked via `aws_is_network_interface_name_valid`; invalid names abort client creation |
| 3 | Endpoint | `aws-c-s3` `source/s3_client.c:1177-1178` → `source/s3_endpoint.c:187-188` | Array forwarded into `aws_http_connection_manager_options` |
| 4 | Round-robin | `aws-c-http` `source/connection_manager.c:1102-1119` | Index advanced per *new connection*, name copied into `socket_options.network_interface_name` |
| 5 | Syscall (Linux) | `aws-c-io` `source/posix/socket.c:1376-1392` | `setsockopt(fd, SOL_SOCKET, SO_BINDTODEVICE, name, len)` |
| 5b | Syscall (BSD/macOS) | `aws-c-io` `source/posix/socket.c:1393-1444` | `if_nametoindex()` then `IP_BOUND_IF` / `IPV6_BOUND_IF` |
| 5c | Unsupported | `aws-c-io` `source/posix/socket.c:1445-1452` | `AWS_ERROR_PLATFORM_NOT_SUPPORTED` |

**[CODE]** `aws-c-http` `source/connection_manager.c:1102-1119` — the distribution mechanism itself:

```c
    if (aws_array_list_length(&manager->network_interface_names)) {
        struct aws_string *interface_name = NULL;
        aws_array_list_get_at(
            &manager->network_interface_names, &interface_name, manager->network_interface_names_index);
        manager->network_interface_names_index =
            (manager->network_interface_names_index + 1) % aws_array_list_length(&manager->network_interface_names);
...
        /* If the interface_name is too long or not null terminated, it will be caught in the `aws_socket_init` function
         * so we don't need to worry about that here.*/
        strncpy(
            socket_options.network_interface_name, aws_string_c_str(interface_name), AWS_NETWORK_INTERFACE_NAME_MAX);
```

**[CODE]** `aws-c-http` `source/connection_manager.c:305-314` — the strategy is explicitly, only, round-robin:

```c
    /*
     * An aws_array_list<struct aws_string *> of network interface names to distribute the connections using the
     * round-robin algorithm. We picked round-robin because it is trivial to implement and good enough. We can later
     * update to a more complex distribution algorithm if required.
     */
    struct aws_array_list network_interface_names;
```

**[CODE]** `aws-c-io` `source/posix/socket.c:1376-1392` — the actual kernel call:

```c
#if defined(SO_BINDTODEVICE)
        if (setsockopt(
                socket->io_handle.data.fd,
                SOL_SOCKET,
                SO_BINDTODEVICE,
                options->network_interface_name,
                network_interface_length)) {
```

**[CODE]** `aws-c-http` `source/connection_manager.c:899-906` — mutually exclusive with the single-NIC option:

```c
    if (options->socket_options->network_interface_name[0] != '\0' && options->num_network_interface_names > 0) {
        AWS_LOGF_ERROR(
            AWS_LS_HTTP_CONNECTION_MANAGER,
            "Invalid options - socket_options.network_interface_name and network_interface_names_array cannot be both "
            "set.");
```

### 2.3 FINDING: the CRT explicitly does NOT auto-detect NICs, and says so in its own source

This is the single most quotable passage found in this research pass. **[CODE]** `aws-c-s3` `source/s3_platform_info.c:80-90`:

```c
/* For all instances from p5e.48xlarge - p6-b300.48xlarge,
 * the max_throughput_gbps values configured are based on the maximum
 * bandwidth offered from a single NIC in these instances. CRT clients
 * default to using a single NIC unless configured to use multiple NICs
 * by identifying the number of NICs and providing the names in an array
 * (refer s3_client.h - struct aws_s3_client_config). The max_throughput_gbps
 * is only a default we set can be overridden by the user's client config.
 * TODO: Once we are able to auto-detect NICs and add them, default values
 * should be updated with maximum ENA network bandwidth allowed by these
 * instances.
 */
```

Corroborated by absence: a grep for `getifaddrs` and `if_nameindex` across `aws-c-io/source` and `aws-c-io/include` returns **zero hits**. There is no NIC enumeration primitive anywhere in the I/O layer. `if_nametoindex` is used only to resolve a name the *caller already supplied*.

**[CODE]** `source/s3_platform_info.c:21-140` — the per-instance table, with the values the comment above describes:

| Instance type | `max_throughput_gbps` in table | `has_recommended_configuration` |
| --- | --- | --- |
| `c5n.18xlarge`, `c5n.metal` | 100 | false |
| `c5n.9xlarge` | 50 | false |
| `p4d.24xlarge`, `p4de.24xlarge` | 400 | true |
| `p5.48xlarge` | 400 | true |
| `p5e.48xlarge` | 100 | true |
| `p5en.48xlarge` | 100 | true |
| `p6-b200.48xlarge` | 200 | true |
| `p6-b300.48xlarge` | 350 | true |
| `trn1.32xlarge` | 600 | true |
| `trn1n.32xlarge` | 800 | true |

**[DERIVED]** The `p5e`/`p5en` entries at 100 Gbps are the giveaway. These instances have far more aggregate ENA bandwidth than 100 Gbps; the table deliberately records **one NIC's worth**. Multi-NIC harvesting is exactly the gap between that 100 and the instance's aggregate — and closing it is a manual configuration act.

Two further comments in the same file are worth quoting for the deep dive because they document the *CPU-side* ceiling, which is the real reason S3-over-ENA cannot approach EFA numbers:

**[CODE]** `source/s3_platform_info.c:65-72`:

```c
/* note: the p5 is a stunningly massive instance type.
 * While the specs have 3.2 TB/s for the network bandwidth
 * not all of that is accessible from the CPU. From the CPU we'll
 * be able to get around 400 Gbps. Also note, 3.2 TB/s
 * with 2 sockets on a nitro instance inplies 16 NICs
 * per node. However, practically, due to the topology of this instance
 * as far as this client is concerned, there are two NICs per node, similar
 * to the p4d. The rest is for other things on the machine to use. */
```

**[CODE]** `source/s3_platform_info.c:130` and `:137`:

```c
    /* not all of the advertised 1600 Gbps bandwidth can be hit from the cpu in user-space */
```
```c
    /* not all of the advertised 800 Gbps bandwidth can be hit from the cpu in user-space */
```

**[DERIVED]** These are the CRT authors stating, in their own tree, that the EFA-class bandwidth on a P5/Trn1 is *not reachable from userspace TCP*. That is the entire thesis of the S3-vs-EFA trade-off, sourced from the client's own code.

### 2.4 FINDING: the platform-info table is never consulted by the client

**[CODE]** A grep for `platform_info`, `max_throughput_gbps`, `aws_s3_get_platform_info` across `source/s3_client.c`, `source/s3_endpoint.c`, `source/s3_meta_request.c` returns **zero hits**.

The table is exposed only as a standalone query API — **[CODE]** `source/s3.c:210-220`:

```c
const struct aws_s3_platform_info *aws_s3_get_current_platform_info(void) {
    return aws_s3_get_platform_info_for_current_environment(s_loader);
}

struct aws_byte_cursor aws_s3_get_current_platform_ec2_intance_type(bool cached_only) {
    return aws_s3_get_ec2_instance_type(s_loader, cached_only);
}

struct aws_array_list aws_s3_get_platforms_with_recommended_config(void) {
    return aws_s3_get_recommended_platforms(s_loader);
}
```

Instance-type detection goes over IMDSv2 — **[CODE]** `source/s3_platform_info.c:350-353`:

```c
    struct aws_imds_client_options imds_options = {
        ...
        .imds_version = IMDS_PROTOCOL_V2,
```

**[DERIVED]** `aws_s3_client_new()` never calls any of this. If a higher-level binding (the AWS CLI's `s3transfer.crt`, the Java/Python SDK transfer managers) wants instance-aware defaults, *it* must call `aws_s3_get_current_platform_info()` and pass the result down as `throughput_target_gbps`. The C client left to itself always uses the flat 10.0 default.

### 2.5 DOC vs CODE DISAGREEMENT — the CRT does not auto-tune to ENA layout

**[T2]** AWS Storage Blog, *"Accelerate Amazon S3 throughput with the AWS Common Runtime"*, `https://aws.amazon.com/blogs/storage/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/`, accessed 2026-08-01, states verbatim:

> "These defaults automatically configure the CRT based on the specifics of the instance type it is running on, including CPU topology, amount of memory, and the number and layout of Elastic Network Adapter (ENA) interfaces. Based on these details, the CRT chooses a parallelization strategy for S3 requests, including the number of parallel connections, the size of each request, and the number of requests per S3 IP address."

**[CODE] contradicts this on three of the four claims**, at `aws-c-s3@469cbd0`:

| Blog claim | Code reality |
| --- | --- |
| "based on … the number and layout of ENA interfaces" | **False for the C client.** No NIC enumeration exists (`getifaddrs`/`if_nameindex` absent from `aws-c-io`). `s3_platform_info.c:83` states the opposite in the source: *"CRT clients default to using a single NIC unless configured to use multiple NICs by identifying the number of NICs and providing the names in an array"* |
| "based on … CPU topology" | **Not found.** No CPU-topology input to connection count or part size. `ideal_connection_count` is a pure function of `throughput_target_gbps` (`s3_client.c:422-423`) |
| "based on … amount of memory" | **Inverted.** Memory is not an *input* to tuning; it is an *output* of `throughput_target_gbps` via the ladder at `s3_client.c:392-402`. Host RAM is never read |
| "the number of requests per S3 IP address" | **Not present as a knob.** DNS spreading is emergent from the `aws-c-io` LRU resolver cache (`host_resolver.c:1381`), not a strategy the S3 client chooses |

Partial corroboration that the auto-tuning does not fire in practice comes from AWS's own troubleshooting doc — **[T1]** `https://repost.aws/knowledge-center/s3-upload-large-files` shows the CLI's actual debug output:

```
s3transfer.crt - DEBUG - Recommended CRT throughput target in gbps: None
s3transfer.crt - DEBUG - Using CRT throughput target in gbps: 10.0
```

**[DERIVED]** "Recommended … None" is the platform-info lookup returning nothing for that host, and the client falling back to `g_default_throughput_target_gbps = 10.0` — exactly the code path at `s3_client.c:413-417`. This is a **publishable doc-vs-code finding** and the strongest single item in this research pass.

### 2.6 Practical multi-NIC recipe (all DERIVED from the call chain in §2.2)

1. Attach multiple ENA interfaces / network cards to the instance and confirm the kernel device names (`ens5`, `ens6`, …).
2. Pass those names in `aws_s3_client_config.network_interface_names_array` with `num_network_interface_names` set.
3. Raise `throughput_target_gbps` to the *aggregate* you intend to reach — connections are round-robined across NICs, so the per-NIC connection count is `ideal_connection_count / num_nics`.
4. Budget memory accordingly: the ladder at `s3_client.c:392-402` will commit up to 24 GiB, or pin it with `AWS_CRT_S3_MEMORY_LIMIT_IN_GIB`.
5. Linux requires **kernel ≥ 5.7 or root** for `SO_BINDTODEVICE` (stated in the header at `s3_client.h:685`, mechanism at `posix/socket.c:1377`).
6. Ensure routing/source-address selection is coherent per NIC. `SO_BINDTODEVICE` binds egress device only; asymmetric-routing and rp_filter misconfiguration will show up as connection failures, which the header warns about at `s3_client.h:680-681`.
7. **Caveat:** the API is labelled `THIS IS AN EXPERIMENTAL AND UNSTABLE API` in the header. Treat as such for production guidance.

### 2.7 And, decisively: there is no EFA path to S3 in the CRT

**[CODE]** A case-insensitive grep for `efa`, `libfabric`, `rdma`, `ibverbs`, `GPUDirect`, `nvidia` across **all** of `aws-c-s3/source`, `aws-c-s3/include`, `aws-c-io/source`, `aws-c-io/include`, `aws-c-http/source`, `aws-c-http/include` at the pinned commits returns **zero hits**.

**[DERIVED]** The CRT S3 client's only transport is TCP sockets over whatever the OS routes, i.e. ENA. It has no RDMA, no libfabric, no kernel-bypass path, and no GPU-memory awareness. This is not a gap to be configured around — it is absent from the architecture. Carlos's framing is confirmed at the source level.

---

## 3. S3 request-rate guidance (documented) vs client behaviour (code)

### 3.1 What AWS documents

**[T1]** `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html` — *"Best practices design patterns: optimizing Amazon S3 performance"*, accessed 2026-08-01, verbatim:

> "your application can achieve at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second per partitioned Amazon S3 prefix. There are no limits to the number of prefixes in a bucket. You can increase your read or write performance by using parallelization. For example, if you create 10 prefixes in an Amazon S3 bucket to parallelize reads, you could scale your read performance to 55,000 read requests per second. … The scaling, in the case of both read and write operations, happens gradually and is not instantaneous … While Amazon S3 is scaling to your new higher request rate, you may see some 503 (Slow Down) errors. These errors will dissipate when the scaling is complete."

**[T1]** `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html`, accessed 2026-08-01, verbatim:

> "Amazon S3 automatically scales to accommodate higher request rates, but this scaling happens gradually. During the scaling process, you might receive HTTP 503 (Slow Down) responses."

and its recommended mitigations: distribute across prefixes, exponential backoff, monitor 5xx, **gradually ramp up request rates**, use multiple connections.

**[T1]** `https://docs.aws.amazon.com/whitepapers/latest/s3-optimizing-performance-best-practices/horizontal-scaling-and-request-parallelization-for-high-throughput.html`, accessed 2026-08-01, verbatim:

> "when you download large objects within a Region from Amazon S3 to Amazon EC2, we suggest making concurrent requests for byte ranges of an object at the granularity of 8–16 MB. Make one concurrent request for each 85–90 MB/s of desired network throughput. To saturate a 10 Gb/s network interface card (NIC), you might use about 15 concurrent requests over separate connections."

### 3.2 DOC vs CODE: the whitepaper's per-connection assumption is 1.7–1.8× more optimistic than the client's

| Quantity | **[T1]** whitepaper | **[CODE]** `aws-c-s3@469cbd0` | Ratio |
| --- | --- | --- | --- |
| Throughput assumed per connection | 85–90 MB/s | **50 MB/s** (`s_throughput_per_connection_gbps = 100.0/250` = 0.4 Gbps, `s3_client.c:71`) | 1.7–1.8× |
| Connections to saturate 10 Gb/s | "about 15" | **25** (`ceil(10/0.4)`, `s3_client.c:163-169, 422`) | 1.67× |
| Recommended range granularity | 8–16 MB | **27.31 MiB** at default settings (§1.3), floor 8 MiB | — |

**[DERIVED]** These are not contradictory *guidance* so much as two different safety margins: the whitepaper describes what a connection *can* do under good conditions; the CRT provisions for what a connection *reliably* does, and over-provisions connections by ~67% to hit the same target. For the deep dive this is worth stating plainly, because a reader who sizes from the whitepaper and then measures the CRT's socket count will think something is wrong.

### 3.3 The gap the code does not close

**[DERIVED]** Cross-referencing §1.6 with the **[T1]** guidance above: AWS documents five mitigations for 503s, and the CRT S3 client implements **two** of them.

| **[T1]** documented mitigation | Implemented in `aws-c-s3@469cbd0`? |
| --- | --- |
| Implement exponential backoff for 503 errors | **Yes** — `s3_client.c:2688-2689` → full jitter, 500 ms base, 20 s cap, 5 retries |
| Use multiple connections | **Yes** — that is the client's entire design |
| Gradually ramp up request rates | **Partially** — only the cold-start VIP gate at `s3_client.c:1971-1982`; no sustained ramp |
| Distribute requests across multiple prefixes | **No** — key layout is the caller's problem |
| Monitor request patterns / react to 5xx | **No** — no feedback loop from 503 rate to concurrency (§1.6) |

**[DERIVED, operational]** A single CRT client configured at `throughput_target_gbps = 400` will open up to 1,000 connections and allow 4,000 requests in flight. At the default 8.19 MiB range size that is a request rate far above the documented 5,500 GET/s per prefix if the keys share a prefix. The client will absorb the resulting 503s with backoff, drain its 500-unit retry bucket, and then start hard-failing — without ever reducing its connection count. **Prefix design, not client configuration, is the binding constraint at high target throughput.** That is the single most useful operational takeaway from the code for a reader.

---

## 4. FSx for Lustre: EFA and GPUDirect Storage — VERIFIED

All FSx material below is **[T1]**, fetched from `docs.aws.amazon.com/fsx/latest/LustreGuide/` on 2026-08-01. Verbatim quotes are marked as such. This section is documentation-sourced, not code-sourced — the code-authority rule applies to the S3 client, and there is no equivalent open-source artifact for the FSx service side.

### 4.0 CORRECTION TO THE BRIEF'S PREMISE

The research brief framed the high-performance path as *"FSx for Lustre in scratch mode with an S3 data repository link."* **The scratch part of that is wrong, and it is wrong in the direction that matters.**

**[T1]** `https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html`, verbatim:

> "**Deployment type:** EFA is supported on Persistent 2 file systems with a metadata configuration specified, including file systems using the Intelligent-Tiering storage class."

**[DERIVED]** EFA on FSx for Lustre requires **Persistent 2 with an explicitly specified metadata configuration**. Scratch 1, Scratch 2, Persistent 1, and HDD are all outside that scope. This is a *positively scoped* statement — AWS names the supported configuration rather than omitting others from an open list — so the exclusion is evidence of absence, not absence of evidence.

**[DERIVED, consequence for the deep dive]** "Scratch + S3 DRA" is a real and reasonable pattern, but it is the **ENA-only, 100 Gbps-per-client** pattern. It is not the fabric pattern. Choosing scratch for cost/ephemerality *forfeits EFA and GDS entirely*. If the dive repeats the brief's framing it will tell readers the opposite of what the docs say. This correction should be stated explicitly in the published text, because "scratch mode for HPC" is common folklore.

### 4.1 EFA support — exact scope

| Dimension | **[T1]** requirement |
| --- | --- |
| Deployment type | **Persistent 2 only**, with metadata configuration specified |
| Storage class | SSD **or** Intelligent-Tiering. Not HDD |
| Excluded | Scratch 1, Scratch 2, Persistent 1, HDD |
| Client instances | *"Nitro v4 (or higher) EC2 instances that support EFA, excluding the trn2 instance family"* (verbatim, `efa-file-systems.html` and `configure-efa-clients.html`) |
| Client OS | *"Amazon Linux 2023 (AL2023); Red Hat Enterprise Linux (RHEL) 9.5 or newer; Ubuntu 22.04 or newer with kernel version 6.8+"* (verbatim, `configure-efa-clients.html`) |
| Intelligent-Tiering caveat | *"On Intelligent-Tiering file systems, EFA is only supported with a throughput capacity of 4,000 MBps or increments of 4,000 MBps."* (verbatim) |
| Hard limit | *"Each FSx for Lustre file system has a maximum limit of 1024 EFA connections across all client instances."* (verbatim) |
| Mutability | *"You cannot enable or disable EFA on an existing file system"* (verbatim). Storage capacity can be scaled; **throughput tier cannot be changed** |
| Co-location | *"Use the same Availability Zone and /16 CIDR as your EFA-enabled client instances within your Amazon VPC."* (verbatim) |
| Launched | **2024-11-27**, per the User Guide's dated changelog `doc-history.html` |

**Client setup** **[T1]** `configure-efa-clients.html`: AWS ships `install-fsx-lustre-client.sh --install-lustre --install-efa` and a `setup.sh` that imports Lustre modules, configures TCP and EFA interfaces, and installs a systemd unit. Manual LNet configuration is `lnetctl net add --net efa --if {{device_name}} --peer-credits 32`. Deep Learning AMIs pre-install the Lustre client, EFA driver, and GDS driver.

**Creation is API-time only** **[T1]** `efa-file-systems.html`, verbatim CLI:

```
aws fsx create-file-system --storage-capacity 4800 --storage-type SSD --file-system-type LUSTRE \
  --file-system-type-version 2.15 --subnet-ids subnet-01234567890 \
  --security-group-ids sg-0123456789abcdefg \
  --lustre-configuration '{"DeploymentType": "PERSISTENT_2", "EfaEnabled": true}'
```

**OPERATIONAL TRAP worth calling out in the dive** — **[T1]** `limit-access-security-groups.html`, verbatim:

> "For EFA-enabled FSx for Lustre file systems, the file system and client security groups must allow all traffic to and from each other, and the file system security group must also allow all traffic to and from itself... **CIDR-based rules, including 0.0.0.0/0, do not satisfy EFA requirements even if they allow all traffic on all ports. You must explicitly specify a security group ID as the source or destination for all EFA traffic rules.**"

**[DERIVED]** This is the same self-referencing security-group requirement EFA has for EC2-to-EC2 traffic, and it is the single most likely cause of a "my EFA-enabled file system falls back to TCP" support case. It belongs in the dive.

### 4.2 GPUDirect Storage — real, and narrower than EFA

**[T1]** `efa-file-systems.html`, verbatim:

> "EFA-enabled file systems support two additional performance features: GPUDirect Storage (GDS) and ENA Express. GDS support builds on EFA to further enhance performance by enabling direct data transfer between the file system and the GPU memory, bypassing the CPU."

**[T1]** same page, verbatim — an exhaustive, named instance list:

> "**To access your file system using GPUDirect Storage (GDS):** Use an Amazon EC2 P5, P5e, P5en, or P6-B200 client instance. Install the NVIDIA Compute Unified Device Architecture (CUDA) package, the open source NVIDIA driver, and the NVIDIA GPUDirect Storage Driver on your client instance."

| Dimension | **[T1]** requirement |
| --- | --- |
| Prerequisite | **EFA-enabled Persistent 2 file system.** No GDS-only path exists |
| Client instances | **P5, P5e, P5en, P6-B200 — exactly these four.** Notably absent: P4d, P4de, Trn1, Trn2 (Trn2 is excluded from EFA outright) |
| Driver | *"NVIDIA GDS driver version 2.24.2 or higher"* (verbatim, `configure-efa-clients.html`); CUDA + open-source NVIDIA driver; `NVIDIA/gds-nvidia-fs` built and `insmod nvidia-fs.ko` |
| Client config | `sudo ./setup.sh --optimized-for-gds` |

**[DERIVED]** The named list is closed, so P4d/P4de and Trainium are *not* GDS-capable against FSx for Lustre. For the EFA dive this matters: the instance matrix in `05-instances-pricing.md` includes many EFA-capable instances that are **not** GDS-capable here, and the dive should not let readers infer "EFA-capable ⇒ GDS-capable".

### 4.3 The number the comparison table needs: per-client throughput ceiling

**[T1]** `https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html`, transcribed verbatim:

| File system type | Client instance network interface | Maximum throughput per client, Gbps |
| --- | --- | --- |
| Non EFA-enabled | Any | 100 Gbps\* |
| EFA-enabled | ENA | 100 Gbps\* |
| EFA-enabled | ENA Express | 100 Gbps |
| EFA-enabled | EFA | **700 Gbps** |
| EFA-enabled | EFA with GDS | **1200 Gbps** |

**[T1]** footnote, verbatim: *"\* The traffic between an individual client instance and an individual FSx for Lustre object storage server is limited to 5 Gbps."*

**[T1]** `performance.html`, the enablement recommendation, verbatim:

> "If you are creating a file system with over 10 GBps of throughput capacity, we recommend enabling Elastic Fabric Adapter (EFA) to optimize throughput per client instance. To further optimize throughput per client instance, EFA-enabled file systems also support GPUDirect Storage for EFA-enabled NVIDIA GPU-based client instances and ENA Express for ENA Express-enabled client instances."

**[DERIVED, headline for §5]** This is the cleanest quantitative statement of the whole trade-off, and it is first-party: **the same file system delivers 100 Gbps per client over ENA and 700 Gbps over EFA — 7× — and 1,200 Gbps with GDS, 12×.** The 5 Gbps per-client-per-OSS cap on the ENA rows also explains *why* the ENA path needs wide OSS fan-out to reach even 100 Gbps.

### 4.4 Deployment types and throughput scaling per TiB

**[T1]** `using-fsx-lustre.html` and `ssd-storage.html`. Note the EFA-enabled rows: enabling EFA changes the **storage-per-OSS ratio**, and therefore the capacity increments.

| Deployment type | Storage class | Throughput MBps/TiB | Storage per OSS |
| --- | --- | --- | --- |
| **Persistent 2, EFA-enabled** | SSD | 125 | **38.4 TiB/OSS** |
| | | 250 | **19.2 TiB/OSS** |
| | | 500 | **9.6 TiB/OSS** |
| | | 1000 | **4.8 TiB/OSS** |
| Persistent 2, non-EFA | SSD | 125 / 250 / 500 / 1000 | 2.4 TiB/OSS |
| Persistent 1 | SSD | 50 / 100 / 200 | 2.4 TiB/OSS |
| Persistent 1 | HDD | 12 | 6 TiB/OSS |
| | | 40 | 1.8 TiB/OSS |
| Persistent 2, Intelligent-Tiering | Intelligent-Tiering | 4,000 MBps per OSS (**independent of storage**) | up to 512 TiB/OSS |
| Scratch 2 | SSD | 200 | 2.4 TiB/OSS |
| Scratch 1 | SSD | 200 | 3.6 TiB/OSS |

**[T1]** baseline vs burst, `ssd-storage.html`:

| Deployment type | Network baseline (MBps/TiB) | Network burst (MBps/TiB) | Disk baseline (MBps/TiB) | Disk burst (MBps/TiB) |
| --- | --- | --- | --- | --- |
| SCRATCH_2 | 200 | 1,300 | 200 read / 100 write | – |
| PERSISTENT-125 | 320 | 1,300 | 125 | 500 |
| PERSISTENT-250 | 640 | 1,300 | 250 | 500 |
| PERSISTENT-500 | 1,300 | – | 500 | – |
| PERSISTENT-1000 | 2,600 | – | 1,000 | – |

**[T1]** burst mechanism, verbatim (`ssd-storage.html`): *"FSx for Lustre file systems provide burst read throughput using a network I/O credit mechanism to allocate network bandwidth based on average bandwidth utilization. The file systems accrue credits when their network bandwidth usage is below their baseline limits."*

**[T1]** capacity increments (`getting-started.html`), verbatim: *"For an EFA-enabled, Persistent, SSD deployment type, set this value in increments of 4.8 TiB, 9.6 TiB, 19.2 TiB, and 38.4 TiB for 1000, 500, 250, and 125 MBps/TiB throughput tiers, respectively."* Non-EFA Persistent SSD uses 1.2 TiB / 2.4 TiB / increments of 2.4 TiB. Minimums **[T1]** `limits.html`: 1.2 TiB SSD, 6 TiB HDD.

**[T1]** Intelligent-Tiering exists as a **storage class on Persistent 2**, not a fourth deployment type — added **2025-05-29** per `doc-history.html`. Verbatim (`intelligent-tiering-file-systems.html`): *"The throughput that an FSx for Lustre file system with Intelligent-Tiering storage class supports is independent to its storage. Intelligent-Tiering file systems scale to multiple TBps of throughput and millions of IOPS."* Tiers: Frequent Access (<30 d), Infrequent Access (30–90 d), Archive Instant Access (90+ d). Per 4,000 MBps increment: 12,500 MBps baseline network throughput, 76.8 GB in-memory cache, 4,000 MBps max SSD cache disk throughput, 160,000 max SSD cache disk IOPS.

### 4.5 S3 data repository association and lazy loading

**[T1]** `overview-dra-data-repo.html`, verbatim — metadata is eager, data is lazy:

> "In order to access objects in the Amazon S3 data repository as files and directories on the file system, **file and directory metadata must be loaded into the file system**. You can load metadata from a linked data repository when you create a data repository association."

**[T1]** `importing-files-dra.html`, verbatim:

> "FSx for Lustre automatically copies the content of a file from your data repository and loads it into the file system when your application first accesses the file in the file system. This data movement is managed by FSx for Lustre and is transparent to your applications. **Subsequent reads of these files are served directly from the file system with sub-millisecond latencies.**"

**[T1]** `preload-file-contents-hsm-dra.html`, verbatim — the preload escape hatch:

> "Amazon FSx copies data from your Amazon S3 data repository when a file is first accessed. Because of this approach, the initial read or write to a file incurs a small amount of latency. If your application is sensitive to this latency, and you know which files or directories your application needs to access, you can optionally preload contents of individual files or directories. You do so using the `hsm_restore` command... **If a file has already been loaded to the file system, the `hsm_restore` command doesn't reload it.**"

Bulk preload pattern, verbatim: `nohup find {{local/directory}} -type f -print0 | xargs -0 -n 1 -P 8 sudo lfs hsm_restore &`. Completion is polled with `sudo lfs hsm_action {{path}}` returning `NOOP`. Export is `sudo lfs hsm_archive {{file_name}}`.

**[T1]** `preload-file-contents-hsm-dra.html`, verbatim — the capacity trap:

> "If your linked S3 bucket is larger than your file system, you should be able to import all the file metadata into your file system. However, you can load only as much actual file data as will fit into the file system's remaining storage space. You'll receive an error if you attempt to access file data when there is no more storage left on the file system."

**[T1]** `data-repository-tasks.html`: three task types — **Export**, **Import**, **Release**. `file-release.html`, verbatim: *"Releasing a file retains the file listing and metadata, but removes the local copy of that file's contents. If a user or application accesses a released file, the data is automatically and transparently loaded back onto your file system from your linked Amazon S3 bucket."*

**[T1]** `create-dra-linked-data-repo.html`: a DRA is a 1:1 mapping between FSx paths and S3 object keys; **max 8 DRAs per file system**; one queued DRA operation processed at a time; not available on Lustre 2.10 file systems or Scratch 1.

### 4.6 FINDING: EFA/GDS and S3 lazy loading are mutually exclusive on Intelligent-Tiering

**[T1]** `fsx-data-repositories.html`, verbatim: *"Intelligent-Tiering file systems don't support linking to Amazon S3 data repositories."*

**[DERIVED]** Cross-referencing §4.1 and §4.5 produces a constraint that appears on no single AWS page:

| Want | Storage class that delivers it |
| --- | --- |
| EFA + GDS **and** S3 DRA lazy loading | **Persistent 2, SSD, EFA-enabled, metadata configuration specified** — the only combination that satisfies both |
| EFA + GDS, elastic capacity, no S3 link | Persistent 2, Intelligent-Tiering (≥ 4,000 MBps increments) |
| S3 DRA lazy loading, cheapest, no fabric | Scratch 2 — **ENA only, 100 Gbps/client ceiling** |

**[DERIVED]** This table is the single most decision-useful artifact in §4 and should survive into the published dive. It also isolates precisely where the brief's premise went wrong: the bottom row is what "scratch + S3 DRA" buys, and it is the non-fabric row.

---

## 5. The comparison the deep dive needs

### 5.1 Data path comparison

FSx for Lustre is split into two columns, because §4.0 established that the deployment type — not the service — decides whether you are on the fabric.

| Axis | **EFA / SRD** (inter-node collectives) | **FSx for Lustre, Persistent 2 + EFA** | **FSx for Lustre, Scratch 2** | **S3 + CRT over ENA** (object) |
| --- | --- | --- | --- | --- |
| **Semantics** | Message passing. No filesystem, no objects. Tag-matched send/recv and RDMA read/write via libfabric | POSIX filesystem: byte ranges, `open`/`seek`/`write`, hard links, permissions, partial in-place overwrite | Same POSIX semantics | Object: whole-key PUT/GET, ranged GET, MPU. No partial in-place update, no rename |
| **Transport** | SRD over EFA device, OS-bypass via userspace libfabric | **LNet over EFA** **[T1 §4.1]** | **LNet over TCP/ENA only** | **TCP over ENA only.** Zero EFA/RDMA/libfabric code in `aws-c-s3`, `aws-c-io`, `aws-c-http` **[CODE §2.7]** |
| **Max throughput per client** | Full EFA line rate, up to 6,400 Gbps on `p6-b300.48xlarge` (see `05-instances-pricing.md`) | **700 Gbps**; **1,200 Gbps with GDS** **[T1 §4.3]** | **100 Gbps**, and ≤ 5 Gbps to any single OSS **[T1 §4.3]** | Bounded by userspace TCP. The CRT's own table caps `p5.48xlarge` at **400 Gbps**: *"not all of the advertised 1600 Gbps bandwidth can be hit from the cpu in user-space"* **[CODE `s3_platform_info.c:130`]** |
| **How throughput is obtained** | One low-latency fabric, hardware multipath | Fan-out across OSSes; EFA changes storage-per-OSS to 4.8–38.4 TiB **[T1 §4.4]** | 200 MBps/TiB baseline, burst to 1,300 MBps/TiB **[T1 §4.4]** | **Many parallel TCP connections:** `clamp(ceil(target_gbps/0.4), 10, 10000)` **[CODE §1.1]** |
| **GPU path** | GPUDirect RDMA between nodes | **GDS — direct to GPU memory, bypassing CPU.** P5/P5e/P5en/P6-B200 only **[T1 §4.2]** | **None** | **None.** No GPU-memory awareness in the CRT **[CODE §2.7]** |
| **Multi-NIC** | Native — multiple network cards are the design point | Up to 16 EFA interfaces on `p6-b300.48xlarge` **[T1 §4.1]** | n/a | **Supported but 100% manual.** Round-robin per connection via `SO_BINDTODEVICE`; no auto-detection **[CODE §2.2–2.4]** |
| **Latency** | Single-digit µs class; SRD tolerates out-of-order delivery | *"sub-millisecond latencies"* on cache-resident data **[T1 §4.5]**; first access to an S3-linked file pays a lazy-load penalty | Same, minus the fabric | **~100–200 ms** first-byte **[T1]** `optimizing-performance.html` |
| **CPU cost** | Very low — kernel and CPU largely bypassed | Low with GDS (CPU bypassed for data); Lustre client kernel module otherwise | Moderate — Lustre client kernel module | **Highest of the four.** Userspace TLS + HTTP parsing + checksums across up to 10,000 sockets; memory ladder commits 2–24 GiB **[CODE §1.2]** |
| **S3 linkage** | n/a | **DRA supported on SSD; NOT on Intelligent-Tiering** **[T1 §4.6]** | DRA supported (not on Scratch 1) **[T1 §4.5]** | Native — it *is* S3 |
| **Cost model** | No charge for EFA itself; you pay for the instances | Provisioned $/TiB-month, persistent, replicated. Capacity in 4.8–38.4 TiB increments **[T1 §4.4]** | Provisioned $/TiB-month, ephemeral, unreplicated | $/GB-month + **per-request** charges. Smaller ranges × high concurrency multiplies request cost |
| **Failure mode under load** | Congestion handled in the SRD hardware path | 1,024 EFA connections per file system, fleet-wide **[T1 §4.1]** | Burst credits exhaust → baseline | 503 SlowDown → backoff + 500-unit token bucket → hard failure. **No adaptive concurrency reduction** **[CODE §1.6]** |
| **The binding constraint** | Placement / instance availability | **Chosen at create time and immutable** — EFA cannot be enabled later, throughput tier cannot change **[T1 §4.1]** | The 100 Gbps ENA ceiling | **Prefix design and CPU**, not client configuration **[DERIVED §3.3]** |

### 5.2 The one-sentence version for the reader

**[DERIVED]** EFA buys *latency and CPU bypass on a fabric*; FSx for Lustre buys *POSIX semantics*, and — **only on Persistent 2 with EFA enabled at create time** — puts that filesystem on the same fabric, worth 7× per client over ENA and 12× with GDS **[T1 §4.3]**; S3 + CRT buys *durability and object semantics* and pays for throughput in **connections, CPU cycles, memory, and request charges** rather than in fabric. There is no configuration that moves S3 onto the fabric — §2.7 settles that at the source level.

### 5.3 The decision that actually matters

**[DERIVED]** Both of the interesting choices are made *before* any data is written, and neither is reversible:

1. **FSx deployment type is immutable.** *"You cannot enable or disable EFA on an existing file system"* **[T1 §4.1]**. Picking scratch for cost forfeits the fabric permanently for that file system.
2. **S3 object layout is effectively immutable.** The CRT reads the ETag `-N` suffix to derive its range size **[CODE §1.3]**, so the part size chosen at upload time constrains download parallelism forever after — short of rewriting the object.

Everything else in this document — connection counts, part sizes, memory ladders, retry buckets — is runtime tuning that can be changed with a config edit. These two cannot.

---

## 6. Proposed subsection outline

Sized for a reader who arrives from the EFA material and needs the storage contrast without a full storage tutorial.

0. **The correction up front: scratch mode has no fabric** — §4.0. Lead with it. It is the highest-value sentence in the whole section because it contradicts widespread folklore, it is backed by a verbatim first-party quote, and every subsequent recommendation depends on it.
1. **Why there is no EFA path to S3** — the §2.7 grep result. Short, decisive, and it reframes the section. Establishes that the question is not "how do I make S3 fast over EFA" but "what are the two different fast paths".
2. **The CRT S3 client is a parallelism engine, not a transport** — `throughput_target_gbps` as a divisor (§1.1); the connection table; the ×4 in-flight multiplier.
3. **What the knob actually costs you** — the memory ladder (§1.2), and the inverted range-size relationship (§1.3): higher target ⇒ *smaller* ranges.
4. **How an object's write layout determines its read speed** — the ETag `-N` parse (§1.3, stage 2). Concrete, surprising, actionable, and nowhere in the docs.
5. **Multi-NIC harvesting: real, manual, experimental** — §2. Include the call-chain table and the `s3_platform_info.c:80-90` quote. This is the section Carlos specifically wanted.
6. **Where the docs and the code disagree** — §2.5 (auto-tuning claim) and §3.2 (85–90 MB/s vs 50 MB/s). Present as a short table, not prose.
7. **Throttling: what the client does and what it does not do** — §1.5 and §1.6. Land on §3.3: prefix design is the binding constraint.
8. **The other fast path: FSx for Lustre on the fabric** — §4. Persistent 2 + EFA scope, the 100 / 700 / 1,200 Gbps per-client table (§4.3), GDS's four-instance list (§4.2), the DRA lazy-load model (§4.5), and the Intelligent-Tiering ⊕ DRA exclusion (§4.6). Include the security-group trap (§4.1).
9. **Choosing a path** — the §5.1 four-column table, the §5.2 one-liner, and §5.3 (the two irreversible decisions).
10. **Getting started journey** — per the project's `tech-deep-dive-outline` skill, a short connective path for a reader new to the topic: *what are my access semantics?* (object vs POSIX) → *is my throughput target above ~100 Gbps per client?* (if yes, the ENA paths are already excluded — §4.3) → *can I commit to Persistent 2 at create time?* (§5.3) → only then tune `throughput_target_gbps`, prefix layout, and multi-NIC.

**[DERIVED]** All ten items are publishable. Items 0, 8 are **[T1]**-sourced; items 1–7 are **[CODE]**-sourced. Item 6 carries one open caveat — see U-5 in §8.

## 7. Diagram ideas

1. **"Where the bytes actually go" — three-lane transport diagram.** Three horizontal lanes from a GPU instance: (a) EFA/SRD lane, drawn *around* the kernel with an OS-bypass arrow, to a peer node; (b) FSx for Lustre lane through the Lustre client kernel module to OSTs; (c) S3 lane through the userspace TCP/TLS/HTTP stack, fanning into N sockets to many S3 IPs. The visual payload is that lane (c) is the only one that traverses the full CPU network stack, and lane (a) is the only one that skips it. Annotate lane (c) with `SO_BINDTODEVICE` round-robin across two ENA devices.

2. **`throughput_target_gbps` fan-out — one input, four outputs.** A single input box feeding four derived quantities with the actual code paths as edge labels: `→ ÷0.4 → connections` (`s3_client.c:164`), `→ ladder → memory limit` (`s3_client.c:392-402`), `→ mem/conns/3 → range size` (`s3_util.c:854`), `→ ×4 → max requests in flight` (`s3_client.c:213`). Overlay the derived table from §1.1/§1.3 to show the *inversion*: as connections rise, range size falls. This single diagram carries most of §1.

3. **The FSx create-time decision tree — one-way doors.** A decision tree whose *edges* are labelled with what each choice forfeits permanently. Root: "deployment type?" → Scratch 2 (cheap, ephemeral, **ENA only, 100 Gbps/client ceiling**, S3 DRA yes) vs Persistent 2 (replicated, **EFA available**, metadata configuration required). Then under Persistent 2: SSD (EFA + GDS + **S3 DRA**) vs Intelligent-Tiering (EFA + GDS, elastic, **no S3 DRA**, ≥4,000 MBps increments). Terminal nodes carry the per-client ceilings from §4.3: 100 / 700 / 1,200 Gbps. Annotate the root edge with the verbatim *"You cannot enable or disable EFA on an existing file system"*. This one diagram carries §4.0, §4.3, and §4.6 simultaneously, and it is the artifact most likely to be screenshotted and reused.

4. **The 503 feedback loop that isn't.** A control-loop drawing with the feedback edge explicitly drawn as a dashed, crossed-out line from "503 SlowDown" back to "connection count", annotated *"no such path — `ideal_connection_count` is `const`, written once at `s3_client.c:422`"*. The solid paths show what *does* happen: per-request exponential backoff and the 500-unit token bucket draining to hard failure. Strong companion to §1.6 and §3.3.

## 8. UNKNOWN register

| ID | Question | Status | Why it matters |
| --- | --- | --- | --- |
| **U-1** | Does FSx for Lustre support EFA, and on which deployment types? | **RESOLVED — YES**, Persistent 2 with metadata configuration specified, SSD or Intelligent-Tiering. Not scratch, not Persistent 1, not HDD. §4.1 | Was the highest-risk claim in the brief. **The brief's "scratch mode" premise is refuted** (§4.0) |
| **U-2** | Does FSx for Lustre support GPUDirect Storage, in which configs, and does it require EFA? | **RESOLVED — YES**, requires an EFA-enabled Persistent 2 file system, client limited to **P5 / P5e / P5en / P6-B200**, NVIDIA GDS driver ≥ 2.24.2. §4.2 | Confirms a genuine CPU-bypass storage path exists — the one thing S3 + CRT can never offer |
| **U-3** | Per-tier throughput per TiB for current deployment types | **RESOLVED.** §4.4 | Feeds the §5.1 table |
| **U-4** | Does an "Intelligent-Tiering" type exist as of 2026-08? | **RESOLVED — YES**, but it is a *storage class on Persistent 2*, not a fourth deployment type. Added 2025-05-29. §4.4 | Terminology precision; also surfaces the DRA exclusion (§4.6) |
| **U-5** | Do the higher-level SDK transfer managers (Java v2, Python `s3transfer.crt`, Rust) call `aws_s3_get_current_platform_info()` and pass the result as `throughput_target_gbps`? | **OPEN.** The C client does not (§2.4). **[T1]** CLI debug output at `repost.aws/knowledge-center/s3-upload-large-files` shows `Recommended … None` → `10.0`, i.e. the CLI path *attempts* a lookup and falls back | Determines whether §2.5 reads as "the blog is wrong" or "the blog describes a layer above the C client". **Materially changes the wording. Resolve before publishing §2.5 in a public artifact.** |
| **U-6** | Does any language binding auto-populate `network_interface_names_array`? | **OPEN.** Not in `aws-c-s3`. `aws-crt-java`, `aws-crt-python`, `aws-crt-cpp` not searched | If a binding does NIC discovery, "100% manual" must be narrowed to "manual in the C client" |
| **U-7** | Real measured throughput per TCP connection to S3 from a modern instance | **OPEN.** Code assumes 50 MB/s; **[T1]** whitepaper says 85–90 MB/s (§3.2). No first-party measurement reconciles them | Drives a 1.67× difference in provisioned connections |
| **U-8** | Is the `g_max_num_connections` comment arithmetic error (§1.7) longstanding or a refactor artifact? | **OPEN.** Git history not examined | Cosmetic. Use only as a methodology illustration |
| **U-9** | Is the `AWS_SOCKET_IPV4` hard-coding (§1.4) deliberate, and are dual-stack S3 endpoints reachable via the CRT? | **OPEN.** No override path exists in `aws-c-s3` at the pinned commit | Would block CRT use in IPv6-only VPCs. Worth one sentence if confirmed |
| **U-10** | Exhaustive list of EFA-eligible client instance types for FSx | **OPEN.** FSx docs defer to `AWSEC2/latest/UserGuide/efa.html`, which `05-instances-pricing.md` in this same research set already covers | Cross-reference rather than re-research — the sibling file has the matrix |
| **U-11** | Is NVIDIA MOFED required for GDS, as distinct from the `nvidia-fs` module? | **OPEN.** FSx docs mention only CUDA, the open-source NVIDIA driver, and `NVIDIA/gds-nvidia-fs`. MOFED not mentioned on any page fetched | Affects the client build recipe if the dive gives one |
| **U-12** | Original AWS What's New announcement URL/wording for FSx + EFA/GDS | **OPEN.** The dated User Guide changelog `doc-history.html` (2024-11-27) was used instead. Guessed What's New URLs returned 404 and are not cited | The changelog is first-party and dated, so this is a completeness gap, not a correctness risk |

**Provenance note:** §4 is **[T1]** documentation-sourced, not code-sourced. The code-authority methodology applies to the S3 client, where an open-source artifact exists. There is no equivalent for the FSx service side, so §4 claims carry the epistemic weight of AWS documentation — strong, but a different kind of evidence than §1–§3. The published dive should not blur the two.

## 9. Scope recommendation: SPLIT, but the split line moved once §4 was verified

**Recommendation: one tab in the EFA deep dive covering the fabric-adjacent storage material; a separate storage deep dive for the CRT internals.**

The §4 verification changed this recommendation from where it stood before the FSx facts were in. The pre-verification assumption was that all of FSx belonged in a storage dive. That is now wrong: **FSx for Lustre + EFA is an EFA topic.** It is the same fabric, the same Nitro-v4+ instance requirement, the same self-referencing security-group rule, and the same per-instance EFA interface counts already tabulated in `05-instances-pricing.md`. An EFA dive that omits the one AWS storage service that runs on EFA has a hole in it.

**Belongs in the EFA deep dive — one tab, outline items 0, 1, 5, 8, 9:**

- **§4.0 — the scratch-mode correction.** Highest-value sentence available. Verbatim first-party quote, contradicts common folklore, and everything else depends on it.
- **§4.1–§4.3 — FSx for Lustre on EFA.** Deployment-type scope, the GDS four-instance list, and the 100 / 700 / 1,200 Gbps per-client table. This is fabric material, sourced **[T1]**, and it directly extends the existing instance matrix.
- **§2.7 — there is no EFA path to S3.** An EFA question, not a storage question. A reader of an EFA dive will ask it; the zero-hit grep across three pinned repos answers it definitively. Cheap to give, expensive to omit.
- **§2 — multi-NIC harvesting**, compressed. The `s3_platform_info.c:65-72` p5 comment (*"two NICs per node"*, *"not all of that is accessible from the CPU"*) is a direct continuation of the EFA/ENA bandwidth-split material already in `05-instances-pricing.md`.
- **§5.1 / §5.2 / §5.3 — the comparison table and the two irreversible decisions**, as the closing "so which path do I use" artifact.

**Belongs in a separate storage deep dive — outline items 2, 3, 4, 6, 7:**

- The CRT internals (§1.1–§1.5): three-stage part sizing, the memory ladder, the ETag mechanism, retry and token buckets. At the project's tab quality bar this is 3–4 tabs on its own and contains no fabric content.
- The doc-vs-code findings (§2.5, §3.2) and the throttling analysis (§1.6, §3.3). Strong material, but *S3 client* material — it would unbalance an EFA dive and deserves top billing in a storage one.
- §4.4–§4.6 in full depth: throughput tiers, DRA mechanics, `hsm_restore`/`hsm_archive`, release tasks, the Intelligent-Tiering ⊕ DRA exclusion.

**Rationale.** The EFA dive's spine is the fabric. The test for inclusion is therefore *"does this claim change with the fabric?"* — and it cleanly partitions the material. FSx deployment type, GDS, per-client ceilings, and multi-NIC binding all change with the fabric. TCP connection counts, HTTP range sizing, retry token buckets, and S3 prefix partitioning do not. Folding the latter in roughly doubles the dive's surface area while diluting its thesis; folding the former in closes a genuine gap.

**Concrete proposal:** one EFA-dive tab, *"Storage on and off the fabric"*, carrying outline items 0, 1, 5, 8, 9 (~1 tab at the project's density), ending with an explicit forward reference to the storage deep dive. Register the storage dive as a sibling app per the project's landing-page pattern.

**Publication gates:**

1. **Resolve U-5 before publishing §2.5** in any public artifact. If the higher-level bindings do the platform-aware tuning the AWS Storage Blog describes, the finding is "the blog describes a layer above the C client", not "the blog is wrong" — a materially different and much weaker claim. This is the one item in the document where getting the wording wrong would be publicly embarrassing.
2. **Keep the §4 provenance distinction visible.** §1–§3 are code-verified at pinned SHAs; §4 is documentation-verified. Both are strong, but the dive should not present them as the same class of evidence.
3. **§4.0 is safe to publish as-is** and should lead. It is a verbatim first-party quote against a widely held misconception, which is the highest-value shape a finding can take.

---

## Sources, grouped by tier

### CODE (highest authority — read at pinned commits on 2026-08-01)

- `awslabs/aws-c-s3` @ `469cbd020db52c329631a614e3b8401f3fda7717` (tag `v0.13.4`): `source/s3_client.c`, `source/s3_util.c`, `source/s3_endpoint.c`, `source/s3_meta_request.c`, `source/s3_auto_ranged_get.c`, `source/s3_auto_ranged_put.c`, `source/s3_platform_info.c`, `source/s3.c`, `include/aws/s3/s3_client.h`, `include/aws/s3/s3.h`, `include/aws/s3/private/s3_util.h`, `include/aws/s3/private/s3_client_impl.h`
- `awslabs/aws-c-io` @ `fbac3c30fd8c50c05168f41486403a69d91f7600` (tag `v0.27.5-1`): `source/posix/socket.c`, `source/host_resolver.c`, `source/standard_retry_strategy.c`, `source/exponential_backoff_retry_strategy.c`, `include/aws/io/socket.h`
- `awslabs/aws-c-http` @ `e543240bbd28ce39423bbc470785f2f38ff28ecb` (tag `v0.11.0-5`): `source/connection_manager.c`, `include/aws/http/connection_manager.h`

### T1 — Official AWS documentation, FSx for Lustre (all accessed 2026-08-01)

- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/efa-file-systems.html` — **the core scope statement.** EFA on Persistent 2 with metadata configuration; GDS instance list; `EfaEnabled` CLI example; immutability of EFA and throughput tier
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/configure-efa-clients.html` — client OS/kernel matrix, installer scripts, `lnetctl` LNet config, per-instance EFA interface counts, GDS driver ≥ 2.24.2, 1,024-connection limit
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html` — **the per-client throughput table** (100 / 100 / 100 / 700 / 1,200 Gbps) and the 5 Gbps per-client-per-OSS footnote; the ">10 GBps ⇒ enable EFA" recommendation
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/limit-access-security-groups.html` — the security-group-ID-not-CIDR requirement
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html` — deployment types, storage classes, throughput per TiB, storage per OSS, scratch durability table, regional caveats
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html` — baseline vs burst network and disk throughput tables; the network I/O credit mechanism
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/intelligent-tiering-file-systems.html` — Intelligent-Tiering tiers and per-increment performance
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/getting-started.html` — EFA-enabled capacity increments (4.8 / 9.6 / 19.2 / 38.4 TiB); `lfs hsm_archive`
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/limits.html` — service quotas, storage minimums, throughput-per-TiB bounds
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/overview-dra-data-repo.html` — metadata-must-be-loaded statement
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/importing-files-dra.html` — lazy-load-on-first-access; sub-millisecond subsequent reads
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/preload-file-contents-hsm-dra.html` — `lfs hsm_restore` / `hsm_action`; bulk preload; the capacity-exhaustion error
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/file-release.html` — release tasks and transparent reload
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/data-repository-tasks.html` — Export / Import / Release task types
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/create-dra-linked-data-repo.html` — 1:1 path↔key mapping; max 8 DRAs; Scratch 1 and Lustre 2.10 exclusions; immutable-attribute caveat
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html` — **"Intelligent-Tiering file systems don't support linking to Amazon S3 data repositories"** (§4.6)
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/doc-history.html` — dated changelog: EFA + GDS **2024-11-27**; Intelligent-Tiering **2025-05-29**
- `https://docs.aws.amazon.com/fsx/latest/LustreGuide/install-lustre-client.html`, `.../lustre-client-matrix.html`, `.../performance-tips.html`, `.../create-linked-dra.html` — supporting detail

### T1 — Official AWS documentation, S3 and CRT (all accessed 2026-08-01)

- `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html` — 3,500/5,500 per-prefix request rates; 503 during scaling; ~100–200 ms latencies
- `https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html` — 503 mitigations
- `https://docs.aws.amazon.com/whitepapers/latest/s3-optimizing-performance-best-practices/horizontal-scaling-and-request-parallelization-for-high-throughput.html` — 8–16 MB ranges, 85–90 MB/s per request, ~15 connections for 10 Gb/s
- `https://docs.aws.amazon.com/cli/latest/topic/s3-config.html` — `AWS_CRT_S3_MEMORY_LIMIT_IN_GIB`, `AWS_CRT_S3_MAX_PARTS_PENDING_READ` (default 5)
- `https://repost.aws/knowledge-center/s3-upload-large-files` — CLI CRT debug output showing `Recommended … None` → `10.0`
- `https://docs.aws.amazon.com/datatransferterminal/latest/userguide/tech-requirements.html` — AWS's own CRT tuning recommendation (`target_bandwidth = 100Gb/s`, `multipart_chunksize = 16MB`)

### T2 — AWS-authored blog (accessed 2026-08-01)

- `https://aws.amazon.com/blogs/storage/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/` — *"Accelerate Amazon S3 throughput with the AWS Common Runtime"*. **Quoted in §2.5 specifically because the code contradicts it.** Not used as a supporting source anywhere else in this document.

### T3 — Third party

None used.

### Repo documentation (orientation only, explicitly NON-authoritative per the methodology rule)

- `aws-c-s3` `README.md`, `docs/GetObject.md`, `docs/memory_aware_request_execution.md`. Read for orientation. The README's "DNS Load Balancing" and "Automatic Request Splitting" claims were each independently re-verified against code before being used (`host_resolver.c:1381`, `s3_auto_ranged_get.c:200-390`), and are cited to the code, not the README.
