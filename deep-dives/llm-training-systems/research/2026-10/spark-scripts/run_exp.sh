#!/bin/bash
# usage: run_exp.sh <name> <cmd...>   (runs under nice 10, timeout 2h, own process group, memory watchdog)
E=$HOME/train-exp-20261031
name=$1; shift
export HOME=$E/home CUDA_CACHE_PATH=$E/cache/nv TMPDIR=$E/tmp XDG_CACHE_HOME=$E/cache PIP_CACHE_DIR=$E/pip HF_HOME=$E/hf TORCHINDUCTOR_CACHE_DIR=$E/cache/inductor TRITON_CACHE_DIR=$E/cache/triton
cd $E
setsid nice -n 10 timeout 2h "$@" > logs/$name.log 2>&1 &
pid=$!
sleep 1
pgid=$(ps -o pgid= -p $pid | tr -d ' ')
echo "start $(date -u +%FT%TZ) pid=$pid pgid=$pgid" > logs/$name.mem
while kill -0 $pid 2>/dev/null; do
  avail=$(awk '/MemAvailable/{printf "%d", $2/1048576}' /proc/meminfo)
  echo "$(date -u +%T) avail_gb=$avail" >> logs/$name.mem
  if [ "$avail" -lt 15 ]; then
    echo "KILL avail_gb=$avail" >> logs/$name.mem
    kill -TERM -- -$pgid; sleep 5; kill -KILL -- -$pgid 2>/dev/null
  fi
  sleep 30
done
wait $pid; echo "exit=$? end $(date -u +%FT%TZ)" >> logs/$name.mem
