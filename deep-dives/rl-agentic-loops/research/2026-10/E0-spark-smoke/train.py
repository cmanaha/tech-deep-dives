"""E0 smoke test: 20 GRPO steps with TRL's GRPOTrainer, vLLM in colocate mode, one GB10.

Question (RESEARCH-GUIDE section 5, E0): does TRL's GRPO trainer with vLLM in colocate mode
train a small model on the DGX Spark, and where does the step time go?

Task: fresh synthetic arithmetic, "(a + b) * c - d", generated from a fixed seed so no model has
seen the exact items. Reward: 1.0 when the integer inside <answer></answer> equals the target,
else 0.0. Plain Python, no model in the grader.

Stage timing: TRL's own methods are wrapped with wall-clock timers (see STAGES). Training time
per step is the step's wall-clock minus everything measured inside the preparation path.
"""

import functools
import json
import os
import random
import re
import sys
import threading
import time

import torch
from datasets import Dataset
from transformers import TrainerCallback
from trl import GRPOConfig, GRPOTrainer

MODEL = os.environ.get("E0_MODEL", "Qwen/Qwen2.5-0.5B-Instruct")
OUT = os.environ["E0_OUT"]
SEED = 0
STEPS = int(os.environ.get("E0_STEPS", "20"))
USE_VLLM = os.environ.get("E0_USE_VLLM", "1") == "1"

ANSWER = re.compile(r"<answer>\s*(-?\d+)\s*</answer>")


def make_dataset(n: int, seed: int) -> Dataset:
    rng = random.Random(seed)
    rows = []
    for _ in range(n):
        a, b, c, d = (rng.randint(2, 30) for _ in range(4))
        rows.append(
            {
                "prompt": [
                    {
                        "role": "user",
                        "content": (
                            f"Compute ({a} + {b}) * {c} - {d}. Think step by step, briefly, "
                            "then give the final integer inside <answer></answer> tags."
                        ),
                    }
                ],
                "target": (a + b) * c - d,
            }
        )
    return Dataset.from_list(rows)


def correctness(completions, target, **kwargs):
    rewards = []
    for comp, t in zip(completions, target):
        text = comp[-1]["content"] if isinstance(comp, list) else comp
        m = ANSWER.search(text)
        rewards.append(1.0 if (m and int(m.group(1)) == t) else 0.0)
    return rewards


# ---------- timing ----------

TIMES: dict[str, float] = {}
CALLS: dict[str, int] = {}


def timed(name, fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if torch.cuda.is_available():
            torch.cuda.synchronize()
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            if torch.cuda.is_available():
                torch.cuda.synchronize()
            TIMES[name] = TIMES.get(name, 0.0) + time.perf_counter() - t0
            CALLS[name] = CALLS.get(name, 0) + 1

    return wrapper


def wrap_if_present(obj, attr, name, found):
    fn = getattr(obj, attr, None)
    if fn is None:
        return
    setattr(obj, attr, timed(name, fn))
    found.append(f"{type(obj).__name__}.{attr} -> {name}")


# ---------- memory sampler (in-process, 1 s) ----------

MEM = {"min_avail_mib": None, "samples": 0}


def mem_sampler(stop: threading.Event):
    while not stop.is_set():
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemAvailable:"):
                    v = int(line.split()[1]) // 1024
                    cur = MEM["min_avail_mib"]
                    MEM["min_avail_mib"] = v if cur is None else min(cur, v)
                    MEM["samples"] += 1
                    break
        stop.wait(1.0)


class StepLog(TrainerCallback):
    def __init__(self, path):
        self.path = path
        self.t0 = None
        self.snap = {}

    def on_step_begin(self, args, state, control, **kw):
        self.t0 = time.perf_counter()
        self.snap = dict(TIMES)

    def on_step_end(self, args, state, control, **kw):
        if torch.cuda.is_available():
            torch.cuda.synchronize()
        wall = time.perf_counter() - self.t0
        delta = {k: TIMES.get(k, 0.0) - self.snap.get(k, 0.0) for k in TIMES}
        rec = {
            "step": state.global_step,
            "wall_s": round(wall, 3),
            "stages_s": {k: round(v, 3) for k, v in delta.items()},
            "torch_max_alloc_gib": round(torch.cuda.max_memory_allocated() / 2**30, 3)
            if torch.cuda.is_available()
            else None,
            "min_avail_mib_so_far": MEM["min_avail_mib"],
        }
        with open(self.path, "a") as f:
            f.write(json.dumps(rec) + "\n")

    def on_log(self, args, state, control, logs=None, **kw):
        with open(self.path.replace("steps.jsonl", "logs.jsonl"), "a") as f:
            f.write(json.dumps({"step": state.global_step, **(logs or {})}) + "\n")


def main():
    os.makedirs(OUT, exist_ok=True)
    stop = threading.Event()
    threading.Thread(target=mem_sampler, args=(stop,), daemon=True).start()

    import importlib.metadata as md

    versions = {
        p: md.version(p)
        for p in ["trl", "vllm", "torch", "transformers", "accelerate", "datasets", "peft"]
        if _installed(md, p)
    }
    versions["python"] = sys.version.split()[0]
    versions["cuda_runtime_torch"] = torch.version.cuda
    versions["gpu"] = torch.cuda.get_device_name(0) if torch.cuda.is_available() else None

    cfg = GRPOConfig(
        output_dir=os.path.join(OUT, "ckpt"),
        max_steps=STEPS,
        learning_rate=1e-6,
        per_device_train_batch_size=16,
        gradient_accumulation_steps=1,
        num_generations=8,
        max_completion_length=256,
        temperature=1.0,
        use_vllm=USE_VLLM,
        vllm_mode="colocate",
        vllm_gpu_memory_utilization=0.12,
        bf16=True,
        logging_steps=1,
        save_strategy="no",
        report_to="none",
        seed=SEED,
        model_init_kwargs={"dtype": "bfloat16"},
    )

    trainer = GRPOTrainer(
        model=MODEL,
        reward_funcs=correctness,
        args=cfg,
        train_dataset=make_dataset(2000, SEED),
    )

    found: list[str] = []
    candidates = [
        (trainer, "_generate_and_score_completions", "prepare_total"),
        (trainer, "_generate", "generate"),
        (trainer, "_generate_single_turn", "generate_single_turn"),
        (trainer, "_calculate_rewards", "score"),
        (trainer, "_move_model_to_vllm", "weight_sync"),
        (trainer, "_get_per_token_logps_and_entropies", "logprob_forward"),
    ]
    vg = getattr(trainer, "vllm_generation", None)
    if vg is not None:
        candidates += [
            (vg, "sync_weights", "weight_sync"),
            (vg, "generate", "vllm_generate"),
        ]
    for obj, attr, name in candidates:
        wrap_if_present(obj, attr, name, found)

    log_path = os.path.join(OUT, "steps.jsonl")
    trainer.add_callback(StepLog(log_path))

    effective = {k: getattr(cfg, k, None) for k in [
        "loss_type", "beta", "num_generations", "per_device_train_batch_size",
        "steps_per_generation", "generation_batch_size", "num_iterations", "epsilon",
        "epsilon_high", "max_completion_length", "vllm_mode", "vllm_gpu_memory_utilization",
        "vllm_enable_sleep_mode", "learning_rate", "temperature", "scale_rewards",
        "importance_sampling_level", "mask_truncated_completions",
    ]}
    meta = {"model": MODEL, "steps": STEPS, "use_vllm": USE_VLLM, "versions": versions,
            "config": effective, "timers_wrapped": found}
    with open(os.path.join(OUT, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2, default=str)
    print(json.dumps(meta, default=str), flush=True)

    t0 = time.perf_counter()
    result = trainer.train()
    total = time.perf_counter() - t0
    stop.set()
    summary = {
        "train_wall_s": round(total, 2),
        "global_step": result.global_step,
        "torch_max_alloc_gib": round(torch.cuda.max_memory_allocated() / 2**30, 3),
        "torch_max_reserved_gib": round(torch.cuda.max_memory_reserved() / 2**30, 3),
        "min_avail_mib": MEM["min_avail_mib"],
        "timer_totals_s": {k: round(v, 2) for k, v in TIMES.items()},
        "timer_calls": CALLS,
        "status": "PASS" if result.global_step >= STEPS else "INCOMPLETE",
    }
    with open(os.path.join(OUT, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    print("E0_SUMMARY " + json.dumps(summary), flush=True)


def _installed(md, p):
    try:
        md.version(p)
        return True
    except md.PackageNotFoundError:
        return False


if __name__ == "__main__":
    main()
