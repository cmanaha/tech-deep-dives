#!/usr/bin/env bash
# Physical AI bench: run every kernel and workload under perf stat on one core.
# Usage: run.sh <perf-binary> <pmu-name> <cpu> <label>
# Output: results-<label>.csv with lines  bench|metric line|event=count;...
set -u
PERF=$1; PMU=$2; CPU=$3; LABEL=$4
cd "$(dirname "$0")"
OUT=results-$LABEL.csv; : > "$OUT"
TD="stall_slot,stall_slot_frontend,stall_slot_backend,op_retired,op_spec,cpu_cycles"
L2="inst_retired,cpu_cycles,stall_backend_mem,br_mis_pred_retired,l1d_cache_refill,l2d_cache_refill,l1i_cache_refill,ll_cache_miss_rd"
ev() { local o=""; for e in ${1//,/ }; do o="$o,$PMU/$e/"; done; echo "${o#,}"; }
one() { # name, command...
  local name=$1; shift
  local m a b
  m=$(sudo -n taskset -c "$CPU" "$PERF" stat -x, -o /tmp/pai-bench.a -e "$(ev $TD)" -- "$@" 2>/tmp/pai-bench.err | tail -1)
  sudo -n taskset -c "$CPU" "$PERF" stat -x, -o /tmp/pai-bench.b -e "$(ev $L2)" -- "$@" >/dev/null 2>>/tmp/pai-bench.err
  a=$(grep -v '^#' /tmp/pai-bench.a | awk -F, 'NF>2{split($3,p,"/"); printf "%s=%s;", p[2], $1}')
  b=$(grep -v '^#' /tmp/pai-bench.b | awk -F, 'NF>2{split($3,p,"/"); printf "b_%s=%s;", p[2], $1}')
  echo "$name|${m:-FAILED $(tail -1 /tmp/pai-bench.err)}|$a$b" | tee -a "$OUT"
}
for k in fma triad_l1 triad_l2 triad_l3 triad_mem mem_read mem_write chase_l1 chase_l2 chase_l3 chase_mem branch frontend ray; do
  one "$k" ./micro "$k"
done
if [ -x venv/bin/python ]; then
  for w in sim policy render; do
    one "wl_$w" env OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 MUJOCO_GL=egl venv/bin/python workloads.py "$w" humanoid.xml
  done
fi
