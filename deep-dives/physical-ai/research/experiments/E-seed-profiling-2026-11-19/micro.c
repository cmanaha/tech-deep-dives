// Physical AI radar microbenchmarks. One kernel per run, single thread.
// Build: gcc -O3 -mcpu=native -o micro micro.c -lm
// Usage: ./micro <name>   prints: <name> <value> <unit>
// Each kernel runs for about RUN_SEC seconds so perf stat sees mostly the kernel.
#define _GNU_SOURCE
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define RUN_SEC 2.0
static double now(void) {
  struct timespec t;
  clock_gettime(CLOCK_MONOTONIC, &t);
  return t.tv_sec + t.tv_nsec * 1e-9;
}
static uint64_t rng = 88172645463325252ULL;
static inline uint64_t xr(void) {
  rng ^= rng << 13; rng ^= rng >> 7; rng ^= rng << 17;
  return rng;
}
static void *alloc(size_t n) {
  void *p;
  if (posix_memalign(&p, 64, n)) { perror("alloc"); exit(1); }
  memset(p, 1, n);
  return p;
}
// Cache size in bytes for the CPU this thread runs on (sysfs index 0 = L1d, 2 = L2, 3 = L3).
#include <sched.h>
static size_t cache_bytes(int index, size_t fallback) {
  char p[128], buf[32];
  snprintf(p, sizeof p, "/sys/devices/system/cpu/cpu%d/cache/index%d/size", sched_getcpu(), index);
  FILE *f = fopen(p, "r");
  if (!f || !fgets(buf, sizeof buf, f)) { if (f) fclose(f); return fallback; }
  fclose(f);
  size_t v = strtoul(buf, NULL, 10);
  return strchr(buf, 'M') ? v << 20 : v << 10;
}
static volatile double sinkd;
static volatile uint64_t sinku;

// --- FMA: 24 independent scalar chains held in registers. With 8 chains the loop was
// bound by FMA latency (IPC 2.5 on every core). 24 chains cover latency 4 x up to 6
// FP pipes, so this measures multiply-add throughput, not latency.
static void b_fma(void) {
  volatile double vm = 0.9999991, vc = 1.3e-6;  // volatile so the loop cannot be folded away
  const double m = vm, c = vc;
  double a0 = 1, a1 = 2, a2 = 3, a3 = 4, a4 = 5, a5 = 6, a6 = 7, a7 = 8, a8 = 9, a9 = 10, a10 = 11, a11 = 12, a12 = 13, a13 = 14, a14 = 15, a15 = 16, a16 = 17, a17 = 18, a18 = 19, a19 = 20, a20 = 21, a21 = 22, a22 = 23, a23 = 24;
  uint64_t n = 0;
  double t0 = now(), t;
  do {
    for (int i = 0; i < 5000000; i++) {
      a0 = __builtin_fma(a0, m, c);
      a1 = __builtin_fma(a1, m, c);
      a2 = __builtin_fma(a2, m, c);
      a3 = __builtin_fma(a3, m, c);
      a4 = __builtin_fma(a4, m, c);
      a5 = __builtin_fma(a5, m, c);
      a6 = __builtin_fma(a6, m, c);
      a7 = __builtin_fma(a7, m, c);
      a8 = __builtin_fma(a8, m, c);
      a9 = __builtin_fma(a9, m, c);
      a10 = __builtin_fma(a10, m, c);
      a11 = __builtin_fma(a11, m, c);
      a12 = __builtin_fma(a12, m, c);
      a13 = __builtin_fma(a13, m, c);
      a14 = __builtin_fma(a14, m, c);
      a15 = __builtin_fma(a15, m, c);
      a16 = __builtin_fma(a16, m, c);
      a17 = __builtin_fma(a17, m, c);
      a18 = __builtin_fma(a18, m, c);
      a19 = __builtin_fma(a19, m, c);
      a20 = __builtin_fma(a20, m, c);
      a21 = __builtin_fma(a21, m, c);
      a22 = __builtin_fma(a22, m, c);
      a23 = __builtin_fma(a23, m, c);
    }
    n += 5000000ULL * 24;
  } while ((t = now()) - t0 < RUN_SEC);
  sinkd = a0 + a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8 + a9 + a10 + a11 + a12 + a13 + a14 + a15 + a16 + a17 + a18 + a19 + a20 + a21 + a22 + a23;
  printf("fma %.3f Gfma/s\n", n / (t - t0) / 1e9);
}

// --- STREAM triad a = b + s*c with a total footprint of `bytes`.
static void b_triad(const char *name, size_t bytes) {
  size_t n = bytes / 3 / sizeof(double);
  double *a = alloc(n * 8), *b = alloc(n * 8), *c = alloc(n * 8);
  uint64_t moved = 0;
  double t0 = now(), t;
  size_t reps = (64u << 20) / (n * 24) + 1;
  do {
    for (size_t r = 0; r < reps; r++) {
      for (size_t i = 0; i < n; i++) a[i] = b[i] + 3.0 * c[i];
      __asm__ volatile("" : : "r"(a) : "memory");
    }
    moved += (uint64_t)reps * n * 24;
  } while ((t = now()) - t0 < RUN_SEC);
  sinkd = a[n / 2];
  printf("%s %.2f GB/s\n", name, moved / (t - t0) / 1e9);
}

// --- Memory read (sum) and write (fill) over 256 MB.
static void b_read(void) {
  size_t n = (256u << 20) / 8;
  uint64_t *a = alloc(n * 8), s = 0, moved = 0;
  double t0 = now(), t;
  do {
    for (size_t i = 0; i < n; i++) s += a[i];
    __asm__ volatile("" : : "r"(a) : "memory");
    moved += n * 8;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = s;
  printf("mem_read %.2f GB/s\n", moved / (t - t0) / 1e9);
}
static void b_write(void) {
  size_t n = (256u << 20) / 8;
  uint64_t *a = alloc(n * 8), moved = 0, v = 0;
  double t0 = now(), t;
  do {
    v++;
    for (size_t i = 0; i < n; i++) a[i] = v;
    __asm__ volatile("" : : "r"(a) : "memory");
    moved += n * 8;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = a[n / 3];
  printf("mem_write %.2f GB/s\n", moved / (t - t0) / 1e9);
}

// --- Pointer chase: dependent loads through a full-period LCG permutation.
// One 64-byte node per cache line; footprint = `bytes`.
static void b_chase(const char *name, size_t bytes) {
  size_t n = 1;
  while (n * 64 * 2 <= bytes) n *= 2;
  uint64_t *a = alloc(n * 64);
  for (size_t i = 0; i < n; i++)
    a[i * 8] = ((i * 1664525ULL + 1013904223ULL) & (n - 1)) * 8;
  uint64_t p = 0, loads = 0;
  double t0 = now(), t;
  do {
    for (int i = 0; i < 2000000; i++) p = a[p];
    loads += 2000000;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = p;
  printf("%s %.2f ns/load\n", name, (t - t0) / loads * 1e9);
}

// --- Unpredictable branches: tests the predictor and the flush cost.
// Each arm calls a different noinline function, so the compiler cannot replace the
// branch with a conditional select (the first version did, and showed 0% bad speculation).
__attribute__((noinline)) static uint64_t arm_a(uint64_t s, uint64_t i) { return s + i * 3; }
__attribute__((noinline)) static uint64_t arm_b(uint64_t s, uint64_t i) { return (s ^ i) + 1; }
static void b_branch(void) {
  size_t n = 1 << 14;
  uint8_t *d = alloc(n);
  uint64_t s = 0, it = 0;
  double t0 = now(), t;
  do {
    for (size_t i = 0; i < n; i++) d[i] = xr() & 1;  // fresh random data every pass
    for (size_t i = 0; i < n; i++) {
      if (d[i]) s = arm_a(s, i); else s = arm_b(s, i);
    }
    it += n;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = s;
  printf("branch %.1f Mbranch/s\n", it / (t - t0) / 1e6);
}

// --- Front end: 4096 distinct 64-byte-aligned functions called indirectly in
// pseudo-random order. Code footprint is about 256 KB, larger than L1i.
#define F1(n) __attribute__((noinline, aligned(64))) static uint64_t f##n(uint64_t x) { return x * (2 * n + 3) + n; }
#define F4(n) F1(n##0) F1(n##1) F1(n##2) F1(n##3)
#define F16(n) F4(n##0) F4(n##1) F4(n##2) F4(n##3)
#define F64(n) F16(n##0) F16(n##1) F16(n##2) F16(n##3)
#define F256(n) F64(n##0) F64(n##1) F64(n##2) F64(n##3)
#define F1024(n) F256(n##0) F256(n##1) F256(n##2) F256(n##3)
F1024(1) F1024(2) F1024(3) F1024(4)
#define P1(n) f##n,
#define P4(n) P1(n##0) P1(n##1) P1(n##2) P1(n##3)
#define P16(n) P4(n##0) P4(n##1) P4(n##2) P4(n##3)
#define P64(n) P16(n##0) P16(n##1) P16(n##2) P16(n##3)
#define P256(n) P64(n##0) P64(n##1) P64(n##2) P64(n##3)
#define P1024(n) P256(n##0) P256(n##1) P256(n##2) P256(n##3)
typedef uint64_t (*fn_t)(uint64_t);
static fn_t ftab[4096] = {P1024(1) P1024(2) P1024(3) P1024(4)};
static void b_frontend(void) {
  uint64_t x = 1, calls = 0;
  uint32_t idx = 1;
  double t0 = now(), t;
  do {
    for (int i = 0; i < 2000000; i++) {
      idx = idx * 1664525u + 1013904223u;
      x = ftab[idx >> 20](x);
    }
    calls += 2000000;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = x;
  printf("frontend %.1f Mcall/s\n", calls / (t - t0) / 1e6);
}

// --- Ray tracing on the CPU: Moller-Trumbore ray/triangle tests, 256 triangles
// (fits L1), single precision. A proxy for BVH leaf work, not GPU ray tracing.
static void b_ray(void) {
  enum { NT = 256 };
  static float v0[NT][3], e1[NT][3], e2[NT][3];
  for (int i = 0; i < NT; i++)
    for (int k = 0; k < 3; k++) {
      v0[i][k] = (xr() % 2000) / 100.0f - 10.0f;
      e1[i][k] = (xr() % 200) / 100.0f - 1.0f;
      e2[i][k] = (xr() % 200) / 100.0f - 1.0f;
    }
  uint64_t tests = 0, hits = 0;
  double t0 = now(), t;
  do {
    for (int r = 0; r < 20000; r++) {
      float o[3] = {0, 0, -30}, d[3];
      d[0] = (xr() % 2000) / 3000.0f - 0.33f;
      d[1] = (xr() % 2000) / 3000.0f - 0.33f;
      d[2] = 1.0f;
      float best = 1e30f;
      for (int i = 0; i < NT; i++) {
        float *a = e1[i], *b = e2[i];
        float px = d[1] * b[2] - d[2] * b[1], py = d[2] * b[0] - d[0] * b[2], pz = d[0] * b[1] - d[1] * b[0];
        float det = a[0] * px + a[1] * py + a[2] * pz;
        float inv = 1.0f / det;
        float tx = o[0] - v0[i][0], ty = o[1] - v0[i][1], tz = o[2] - v0[i][2];
        float u = (tx * px + ty * py + tz * pz) * inv;
        float qx = ty * a[2] - tz * a[1], qy = tz * a[0] - tx * a[2], qz = tx * a[1] - ty * a[0];
        float v = (d[0] * qx + d[1] * qy + d[2] * qz) * inv;
        float tt = (b[0] * qx + b[1] * qy + b[2] * qz) * inv;
        if (u >= 0 && v >= 0 && u + v <= 1 && tt > 0 && tt < best) best = tt;
      }
      hits += best < 1e30f;
    }
    tests += 20000ULL * NT;
  } while ((t = now()) - t0 < RUN_SEC);
  sinku = hits;
  printf("ray %.1f Mtest/s\n", tests / (t - t0) / 1e6);
}

int main(int argc, char **argv) {
  const char *n = argc > 1 ? argv[1] : "";
  // Footprints are half of each cache level of the core we run on, so every kernel
  // lands in the level its name says on every machine.
  size_t L1 = cache_bytes(0, 64u << 10), L2 = cache_bytes(2, 256u << 10), L3 = cache_bytes(3, 2u << 20);
  if (!strcmp(n, "sizes")) { printf("sizes L1d=%zuK L2=%zuK L3=%zuK cpu=%d\n", L1 >> 10, L2 >> 10, L3 >> 10, sched_getcpu()); return 0; }
  if (!strcmp(n, "fma")) b_fma();
  else if (!strcmp(n, "triad_l1")) b_triad(n, L1 / 2);
  else if (!strcmp(n, "triad_l2")) b_triad(n, L2 / 2);
  else if (!strcmp(n, "triad_l3")) b_triad(n, L3 / 2);
  else if (!strcmp(n, "triad_mem")) b_triad(n, 384u << 20);
  else if (!strcmp(n, "mem_read")) b_read();
  else if (!strcmp(n, "mem_write")) b_write();
  else if (!strcmp(n, "chase_l1")) b_chase(n, L1 / 2);
  else if (!strcmp(n, "chase_l2")) b_chase(n, L2 / 2);
  else if (!strcmp(n, "chase_l3")) b_chase(n, L3 / 2);
  else if (!strcmp(n, "chase_mem")) b_chase(n, 256u << 20);
  else if (!strcmp(n, "branch")) b_branch();
  else if (!strcmp(n, "frontend")) b_frontend();
  else if (!strcmp(n, "ray")) b_ray();
  else { fprintf(stderr, "unknown kernel '%s'\n", n); return 2; }
  return 0;
}
