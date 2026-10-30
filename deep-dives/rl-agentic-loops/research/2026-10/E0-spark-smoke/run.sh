#!/bin/bash
# E0 runner. Launched as: setsid nohup nice -n 10 ./run.sh > logs/run.out 2>&1 < /dev/null &
# setsid gives this script its own session and process group, so the watchdog below can stop
# the run (and only the run) with one signal to that group.
B="${E0_DIR:?set E0_DIR to the run directory}"
export HOME=$B/home TMPDIR=$B/tmp PIP_CACHE_DIR=$B/pipcache XDG_CACHE_HOME=$B/home/.cache HF_HOME=$B/hf
export E0_OUT=$B/out RANK=0 LOCAL_RANK=0 WORLD_SIZE=1 MASTER_ADDR=127.0.0.1 MASTER_PORT=29517
export VLLM_LOGGING_LEVEL=INFO TOKENIZERS_PARALLELISM=false VLLM_NO_USAGE_STATS=1 DO_NOT_TRACK=1 HF_HUB_DISABLE_TELEMETRY=1
mkdir -p "$E0_OUT"
PGID=$(ps -o pgid= -p $$ | tr -d ' ')
echo "pgid=$PGID" > $B/logs/pgid
date -u +%FT%TZ > $B/logs/start
nice -n 10 timeout 2h $B/venv/bin/python $B/train.py "$@" > $B/logs/train.log 2>&1 &
TP=$!
echo "train_pid=$TP" >> $B/logs/pgid
# Watchdog: sample every 10 s (stricter than the 30 s the brief requires).
while kill -0 $TP 2>/dev/null; do
  AVAIL=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
  # Sum the GPU memory of every compute process in this run's process group.
  GPU=$(nvidia-smi --query-compute-apps=pid,used_memory --format=csv,noheader,nounits 2>/dev/null |
    while IFS=', ' read -r p m; do
      [ "$(ps -o pgid= -p "$p" 2>/dev/null | tr -d ' ')" = "$PGID" ] && echo "$m"
    done | awk '{s+=$1} END {print s+0}')
  echo "$(date -u +%FT%TZ) avail_mib=$AVAIL train_gpu_mib=${GPU:-0}" >> $B/logs/mem.log
  if [ "$AVAIL" -lt 15360 ]; then
    echo "$(date -u +%FT%TZ) WATCHDOG: MemAvailable ${AVAIL} MiB under 15 GiB, stopping own process group $PGID" >> $B/logs/mem.log
    kill -TERM -- -"$PGID"
    sleep 5
    kill -KILL -- -"$PGID"
  fi
  sleep 10
done
wait $TP
echo "$(date -u +%FT%TZ) train_exit=$?" >> $B/logs/mem.log
