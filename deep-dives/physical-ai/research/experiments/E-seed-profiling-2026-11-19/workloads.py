"""Physical AI representative physical AI workloads, single thread, about 5 s each.
Usage: python workloads.py sim|policy|render [model.xml]
Prints: <name> <value> <unit>
"""
import os, sys, time

os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
import numpy as np

RUN_SEC = 5.0
mode = sys.argv[1]
xml = sys.argv[2] if len(sys.argv) > 2 else "humanoid.xml"

if mode == "sim":  # physics simulation step, the inner loop of sim and RL rollouts
    import mujoco
    m = mujoco.MjModel.from_xml_path(xml)
    d = mujoco.MjData(m)
    rs = np.random.default_rng(0)
    n, t0 = 0, time.perf_counter()
    while time.perf_counter() - t0 < RUN_SEC:
        d.ctrl[:] = rs.uniform(-1, 1, m.nu)
        for _ in range(100):
            mujoco.mj_step(m, d)
        n += 100
    print(f"sim {n / (time.perf_counter() - t0):.0f} steps/s")

elif mode == "policy":  # CPU policy inference: 6-layer 1024-wide MLP, batch 1, float32
    rs = np.random.default_rng(0)
    W = [rs.standard_normal((1024, 1024), dtype=np.float32) * 0.03 for _ in range(6)]
    x0 = rs.standard_normal(1024, dtype=np.float32)
    n, t0 = 0, time.perf_counter()
    while time.perf_counter() - t0 < RUN_SEC:
        for _ in range(50):
            x = x0
            for w in W:
                x = np.maximum(w @ x, 0)
        n += 50
    print(f"policy {n / (time.perf_counter() - t0):.0f} infer/s")

elif mode == "render":  # offscreen camera render of the sim scene, 640x480
    os.environ.setdefault("MUJOCO_GL", "egl")
    import mujoco
    m = mujoco.MjModel.from_xml_path(xml)
    d = mujoco.MjData(m)
    r = mujoco.Renderer(m, 480, 640)
    n, t0 = 0, time.perf_counter()
    while time.perf_counter() - t0 < RUN_SEC:
        mujoco.mj_step(m, d)
        r.update_scene(d)
        r.render()
        n += 1
    print(f"render {n / (time.perf_counter() - t0):.0f} frames/s")
else:
    sys.exit(f"unknown mode {mode}")
