"""Build report.html and report.md from results/*.csv. No dependencies."""
import math, pathlib

HERE = pathlib.Path(__file__).parent
CORES = [  # label, file, slots per cycle, colour
    ("Jetson A78AE", "results-jetson-a78ae.csv", 6, "#2a78d6"),
    ("Spark A725", "results-spark-a725.csv", 5, "#eb6834"),
    ("Spark X925", "results-spark-x925.csv", 10, "#1baf7a"),
]
MICRO = [  # key, axis label, higher is better
    ("fma", "FMA", True), ("ray", "Ray/tri (CPU)", True), ("branch", "Branch", True),
    ("frontend", "Front end", True), ("triad_l1", "Triad L1", True), ("triad_l2", "Triad L2", True),
    ("triad_l3", "Triad L3", True), ("triad_mem", "Triad DRAM", True), ("mem_read", "Mem read", True),
    ("mem_write", "Mem write", True), ("chase_l1", "Latency L1", False), ("chase_l2", "Latency L2", False),
    ("chase_l3", "Latency L3", False), ("chase_mem", "Latency DRAM", False),
]
WL = [("wl_sim", "Physics sim step (MuJoCo humanoid)"), ("wl_policy", "Policy inference (6x1024 MLP, CPU)"),
      ("wl_render", "Camera render (MuJoCo offscreen 640x480)")]


def load(fn):
    out = {}
    for line in (HERE / "results" / fn).read_text().splitlines():
        name, metric, ev = line.split("|")
        parts = metric.split()
        c = {}
        for kv in ev.strip(";").split(";"):
            k, v = kv.split("=")
            c[k] = float(v) if v.replace(".", "").isdigit() else float("nan")
        out[name] = {"value": float(parts[1]), "unit": parts[2], "c": c}
    return out


def tma(c, slots_per_cycle):
    slots = c["cpu_cycles"] * slots_per_cycle
    used = 1 - c["stall_slot"] / slots
    r = c["op_retired"] / c["op_spec"]
    return {
        "Front end": c["stall_slot_frontend"] / slots, "Back end": c["stall_slot_backend"] / slots,
        "Retiring": used * r, "Bad spec": used * (1 - r),
        "Mem stall": c["b_stall_backend_mem"] / c["b_cpu_cycles"],
        "IPC": c["b_inst_retired"] / c["b_cpu_cycles"],
        "slots_check": (c["stall_slot"] + c["op_spec"]) / c["cpu_cycles"],
    }


def radar(axes, series, title, size=460):
    cx = cy = size / 2
    R = size / 2 - 78
    n = len(axes)
    pt = lambda i, v: (cx + R * v * math.sin(2 * math.pi * i / n), cy - R * v * math.cos(2 * math.pi * i / n))
    s = [f'<svg viewBox="0 0 {size} {size + 30}" width="{size}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" font-size="11">']
    s.append(f'<text x="{cx}" y="16" text-anchor="middle" font-size="13" font-weight="600" fill="#222">{title}</text><g transform="translate(0,22)">')
    for g in (0.25, 0.5, 0.75, 1):
        s.append('<polygon fill="none" stroke="#ddd" points="' + " ".join("%.1f,%.1f" % pt(i, g) for i in range(n)) + '"/>')
    for i, a in enumerate(axes):
        x, y = pt(i, 1); lx, ly = pt(i, 1.17)
        s.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="#ddd"/>')
        s.append(f'<text x="{lx:.1f}" y="{ly + 4:.1f}" text-anchor="middle" fill="#444">{a}</text>')
    for label, colour, vals in series:
        pts = " ".join("%.1f,%.1f" % pt(i, max(0.0, min(1.0, v))) for i, v in enumerate(vals))
        s.append(f'<polygon points="{pts}" fill="{colour}" fill-opacity="0.12" stroke="{colour}" stroke-width="2"/>')
    s.append("</g>")
    for j, (label, colour, _) in enumerate(series):
        s.append(f'<rect x="{12 + j * 140}" y="{size + 12}" width="10" height="10" fill="{colour}"/><text x="{26 + j * 140}" y="{size + 21}" fill="#222">{label}</text>')
    s.append("</svg>")
    return "".join(s)


data = {label: load(fn) for label, fn, _, _ in CORES}
md, html = [], []
H = lambda t: (md.append(f"\n## {t}\n"), html.append(f"<h2>{t}</h2>"))


def table(head, rows):
    md.append("| " + " | ".join(head) + " |\n|" + "---|" * len(head))
    md.extend("| " + " | ".join(r) + " |" for r in rows)
    html.append("<table><tr>" + "".join(f"<th>{h}</th>" for h in head) + "</tr>" +
                "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows) + "</table>")


# 1. machine capability
H("1. Machine capability: microbenchmarks, one core each")
rows, series = [], {l: [] for l, *_ in CORES}
for key, label, hib in MICRO:
    vals = [data[l][key]["value"] for l, *_ in CORES]
    best = max(vals) if hib else min(vals)
    for (l, *_), v in zip(CORES, vals):
        series[l].append(v / best if hib else best / v)
    rows.append([label, data[CORES[0][0]][key]["unit"]] + [f"{v:g}" for v in vals])
table(["Kernel", "Unit"] + [l for l, *_ in CORES], rows)
html.append(radar([m[1] for m in MICRO], [(l, c, series[l]) for l, _, _, c in CORES],
                  "Capability, normalised to the best core on each axis"))

# 2. kernel shapes
H("2. What each kernel does to the pipeline (top-down level 1)")
for l, _, spc, _ in CORES:
    md.append(f"\n**{l}** (slots per cycle {spc})\n"); html.append(f"<h3>{l} (slots per cycle {spc})</h3>")
    rows = []
    for key, label, _ in MICRO:
        t = tma(data[l][key]["c"], spc)
        rows.append([label] + [f"{t[k] * 100:.1f}%" for k in ("Front end", "Back end", "Retiring", "Bad spec", "Mem stall")] + [f"{t['IPC']:.2f}"])
    table(["Kernel", "Front end", "Back end", "Retiring", "Bad spec", "Mem stall (cycles)", "IPC"], rows)

# 3. workloads
H("3. Three representative physical AI workloads")
AX = ["Front end", "Back end", "Retiring", "Bad spec", "Mem stall"]
for key, label in WL:
    md.append(f"\n**{label}**\n"); html.append(f"<h3>{label}</h3>")
    rows, ser = [], []
    for l, _, spc, col in CORES:
        w = data[l][key]; t = tma(w["c"], spc); c = w["c"]
        ki = c["b_inst_retired"] / 1000
        rows.append([l, f"{w['value']:g} {w['unit']}"] + [f"{t[k] * 100:.1f}%" for k in AX] +
                    [f"{t['IPC']:.2f}", f"{c['b_br_mis_pred_retired'] / ki:.2f}", f"{c['b_l1d_cache_refill'] / ki:.2f}",
                     f"{c['b_l2d_cache_refill'] / ki:.2f}", f"{c['b_l1i_cache_refill'] / ki:.2f}"])
        ser.append((l, col, [t[k] for k in AX]))
    table(["Core", "Throughput"] + AX + ["IPC", "Br miss/kinst", "L1d refill/kinst", "L2 refill/kinst", "L1i refill/kinst"], rows)
    html.append(radar(AX, ser, label + ": share of pipeline slots", 380))

H("Slots-per-cycle self check")
rows = [[l] + [f"{tma(data[l][k]['c'], spc)['slots_check']:.3f}" for k in ("fma", "chase_mem", "wl_sim")] for l, _, spc, _ in CORES]
table(["Core", "fma", "chase_mem", "wl_sim"], rows)

(HERE / "report.md").write_text("# Physical AI profiling, second pass: DGX Spark and Jetson Orin Nano\n" + "\n".join(md) + "\n")
(HERE / "report.html").write_text(
    "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
    "<title>Physical AI profiling, second pass</title><style>body{font:14px system-ui,sans-serif;max-width:980px;margin:20px auto;padding:0 12px;color:#222}"
    "table{border-collapse:collapse;margin:10px 0;font-size:12px;display:block;overflow-x:auto}td,th{border:1px solid #ddd;padding:3px 7px;text-align:right}"
    "td:first-child,th:first-child{text-align:left}svg{max-width:100%;height:auto}</style>"
    "<h1>Physical AI profiling, second pass: DGX Spark and Jetson Orin Nano</h1>"
    "<p>Second pass, measured 2026-11-19 evening. One thread pinned to one core, perf stat. Still a look-and-feel check. "
    "Changes since the first pass: the FMA kernel uses 24 chains (it was latency-bound with 8); the branch kernel now really branches; "
    "cache-level kernels size themselves to half of each cache level of the core they run on. "
    "Open: MuJoCo is 3.17.0 on the Jetson and 4.0.1 on the Spark; whether the render used the GPU was not checked; perf counts include process start-up.</p>"
    "<p><b>Front-end share on the Spark X925.</b> Short loops show 40 to 83% front-end bound on this 10-wide core. Experiment: the same kernels built with "
    "-funroll-loops. Triad L1 went from 39.6% front end to 1.6% and from 183 to 246 GB/s; memory read went from 83.1% front end to 0.8% (88% back end) at the same 28 to 29 GB/s. "
    "In the plain build, branches retired per cycle were 0.98 (triad L1). Reading: the core takes about one loop branch per cycle, so a 4-operation loop cannot fill 10 slots. "
    "The counters are right; the level 1 split depends on loop shape on a very wide core.</p>" + "".join(html))
print((HERE / "report.md").read_text())
