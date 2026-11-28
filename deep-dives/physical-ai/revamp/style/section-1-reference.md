# Section 1, opening and second block: the style reference

Written with Carlos on 2026-11-27 over three passes, with his own rewrites of the header line, the opening, the
hardware paragraph and the two questions. It is the model for every other section of this dive. The rules it
follows are in `docs/standards/plain-technical-english.md`.

Status: applied to `src/sections/OneLoop.tsx` on 2026-11-27. The two facts that were new here are sourced:
what Savings Plans are (F09-134) and that a Capacity Block starts on a date you choose in advance (F09-90).

## Terms: from the dive's coined words to the standard ones

The coined words below run through sections 1, 20 and 24 to 29. Every rewritten section uses the right-hand column.

| Coined (do not use) | Standard term |
|---|---|
| the part (of the machine) a job fills / exhausts first | the bottleneck; the resource it runs out of first |
| shape, the five shapes | workload type, the five workload types |
| market; the way the capacity is bought | purchase option (On-Demand, Spot Instances, Savings Plans, Capacity Blocks) |
| capacity that can be taken back; a taken machine | Spot Instances; an instance that AWS reclaims |
| the computer beside the arm / robot | the onboard computer; the computer next to the arm; by name (Jetson Orin Nano, Jetson Thor) |
| Nodes that talk | Multi-node training |
| Always on | Always-on streams |
| On the robot's clock | Real-time on the robot |
| Independent units | Independent tasks |
| One long run | Long single-machine runs |
| teacher arm | leader arm (LeRobot's term); "teacher arm" may follow in brackets once |
| Spot is open / Spot is closed | the job can run on Spot Instances / Spot is not an option |

---

## 1. Fifteen Computing Jobs Behind One Robot Arm: Where Each One Should Run

*Header line:* Teaching a robot arm a single task involves up to fifteen different computing jobs. To find which
instance and compute each job needs, you first need to understand which resource becomes its bottleneck. Based on
that, you can select the instance type, the scheduler or orchestrator, and the purchase option: On-Demand, Savings
Plans, Capacity Blocks or Spot.

Teaching a robot arm to do one task takes much more than training a model. The example used throughout is an
SO-101, a small desktop arm with six motors and two cameras, one on the wrist and one overhead. The task is to pick
up a block and place it in a cup without a person controlling the arm.

To get there, a person first shows the arm how to do the task. They move a second arm by hand, the leader arm (or
teacher arm), and the SO-101 copies its movements. The positions of both arms' joints and the video from both
cameras are recorded during each demonstration with LeRobot, an open-source library for recording robot data and
training robot models. These recordings are the data for supervised training: real-world examples of what the arm
should do in each situation. After that, you process the video, simulate the arm, train a model, test it and deploy
it to the arm. When broken down, those steps add up to fifteen separate computing jobs, listed in the table further
down.

To run these jobs efficiently, you have to consider which hardware makes sense for each one. With LeRobot's default
settings, video compression runs on CPU cores. Rendering simulated camera images with a ray-tracing renderer, such
as the one in NVIDIA Isaac Sim, needs GPUs that have ray-tracing (RT) cores, and the A100 and H100 training GPUs do
not have them. Model training uses GPUs and keeps them busy for hours. Deploying the model is different, because
there latency matters. The model that controls the arm runs under a strict time limit and often under a power
budget too. So a small computer next to the robot, such as an NVIDIA Jetson Orin Nano or Jetson Thor, is usually
the better choice. For each of these fifteen jobs, you want to know what it has to achieve and which resource lets
it do that efficiently.

Two questions help you set up your pipeline with the right type of instance, the right orchestrator and the right
purchase option:

1. For each step in the pipeline, which resource saturates first and becomes the bottleneck when the step runs at
   full load, and what price-performance does each instance give you for that resource? The answer tells you which
   instance to use.
2. How much work is lost if the instance fails or disappears, and is the instance used steadily or in bursts? The
   answer tells you which scheduler or orchestrator to use and which purchase option fits: Spot Instances,
   On-Demand, Capacity Blocks or Savings Plans. Each option is explained further down.

A bottleneck is the resource that is fully used while the rest of the machine is partly idle. A machine has several
resources that can run out independently of each other, such as its CPU cores, its memory and each kind of unit
inside a GPU. You can often estimate the bottleneck with simple arithmetic before running anything. Take what one
unit of work needs from a resource, multiply it by the number of units per second, and compare the result with what
the resource can deliver.

Here is how that works on a simple example. The model that controls the arm is called a policy. It reads the camera
images and the joint angles and decides how the motors move next. A real policy is too large to work through by
hand, so the example uses a small test program in its place. The numbers below describe the test program, not the
real policy.

The test program holds six weight matrices of 1024 x 1024 float32 values and multiplies a vector by each matrix in
turn. A matrix-vector multiplication reads every value in the matrix once, so one pass through the program reads
all 25.2 MB of weights. The processor's caches cannot hold 25.2 MB, so every pass has to read the weights from main
memory.

The next number you need is how fast memory can deliver data. We measured it in a single run on one Cortex-A78AE
CPU core of an NVIDIA Jetson Orin Nano Super, using a memory test that streams through arrays larger than the
caches. It reached 11.71 GB/s. At that rate, memory can deliver the 25.2 MB of weights 465 times per second
(11.71 GB/s / 25.2 MB). So before running the program, you can predict that it will not go above about 465 passes
per second on this core, however fast the core does arithmetic. That prediction assumes 11.71 GB/s is the most
memory bandwidth this core can get.

We then ran the program once, in NumPy, on the same core. It reached 390 passes per second, 84% of the predicted
limit, which means it read 390 x 25.2 MB = 9.8 GB/s from memory. The calculation alone cannot tell you whether
memory or computation held it at 390. The core's hardware performance counters can. These counters are built into
the processor and record events such as clock cycles spent waiting. They showed that 62.3% of the core's clock
cycles were stalled, waiting for memory. So the bottleneck is memory bandwidth. Faster arithmetic does not shorten
those waits, so when you compare machines for this kind of job, compare their memory bandwidth in GB/s.

The same method applies to the real policy on the robot's own computer. You need three numbers: how much data one
call of the model reads and how much it computes, how many calls it makes per second, and how much memory bandwidth
and compute that computer provides.

### Choosing the scheduler and the purchase option

*Header line:* Some jobs can run on Spot Instances that AWS can take back at short notice; others need a machine
that stays up until they finish. Three properties of each job, and how steadily it uses its machines, tell you which
scheduler and purchase option fit.

When a job loses its machine, what happens next depends on three properties of the job:

- **Duration:** how long one unit of its work runs.
- **Coupling:** whether its parts exchange data with each other while they run.
- **Interruptibility:** whether it can stop and restart without losing more than one unit of work.

Together, these three properties define the job's workload type. The workload type tells you which kind of
scheduler or orchestrator fits the job and whether it can run on Spot Instances. To see the difference, compare two
jobs for the same arm that sit at opposite extremes.

The first job is the policy that controls the arm. It runs on the computer next to the arm, and it has to keep up
with a fixed clock. By default, the arm accepts a new target for its motors 30 times per second, which is one every
33.3 ms, and it does not wait for a late answer. NVIDIA reports that one call of its GR00T N1.7 robot model takes a
median of 149.0 ms on a Jetson Orin when compiled with TensorRT, the fastest option in NVIDIA's table for that
device. That is 4.5 times longer than the 33.3 ms period.

The arm can still work with calls that slow, because each call returns a chunk of future actions instead of a single
action. In NVIDIA's benchmark, one chunk holds 40 actions. The arm plays one action from the chunk every 33.3 ms
while the next call runs. This works as long as the remaining actions last longer than the next call takes.

The delay still has a cost, because every action the arm plays was chosen from camera images that are at least one
call old. At an illustrative arm speed of 0.25 m/s, a delay of 149.0 ms means the arm moves 37 mm based on old
information. Section 3, The Robot as a Computer, covers this delay in detail. This is why the computer next to the
arm is sized by latency, the time one call takes. The other jobs have no such deadline, so they are sized by
throughput, the amount of work they finish in a given time.

The second job tests a new policy before it is allowed to drive the real motors. The policy controls a simulated arm
that attempts the task 500 times, each time from a different random seed, and the job counts how many attempts
succeed. One attempt at the task, real or simulated, is called an episode. The episodes do not exchange data and
none of them has a deadline. So the job is 500 short, independent pieces of work that can run on any machine, in any
order.

On AWS, this fits an array job in AWS Batch, the AWS service for queuing and running batch jobs. You submit one
array job, Batch creates 500 child jobs from it, and each child uses its index number as its random seed. Because
each piece is short and independent, the job is a good fit for Spot Instances. AWS sends a warning two minutes
before it takes a Spot Instance back, on a best-effort basis. If an instance is taken back, only the episodes
running on it are lost, and a retry rule on the job puts them back at the front of the queue.

So the two jobs need opposite things. The policy needs one dedicated machine next to the arm that is never
interrupted. The evaluation can spread across many small machines and can afford to lose some of them.

The purchase option depends on the same properties, and also on whether the job uses its machines steadily or in
bursts. AWS sells EC2 capacity in four ways that matter here:

- **On-Demand:** you pay by the second with no commitment, and AWS does not take the instance back.
- **Spot Instances:** spare capacity that AWS can take back after a two-minute warning.
- **Capacity Blocks for ML:** GPU instances reserved in advance for a fixed period, so a large run can start on a
  known date.
- **Savings Plans:** a lower price in exchange for committing to a steady amount of use. They lower the cost of
  capacity you run anyway, but they do not reserve it.

Each of the fifteen jobs falls into one of five workload types:

- **Independent tasks.** The work splits into many short pieces that do not depend on each other, such as the 500
  evaluation episodes or the decoding of each recorded episode. If a machine is lost, you lose only the piece it was
  running. Run these jobs in a queue that starts machines when work arrives and retries failed pieces, such as an
  AWS Batch array job, on Spot Instances.
- **Long single-machine runs.** Fine-tuning the arm's policy keeps one machine busy for hours, and if the machine is
  lost, you lose the work done since the last checkpoint. Spot is an option only if the job saves checkpoints often:
  the AWS Batch guide advises splitting or checkpointing Spot work into parts of 30 minutes or less.
- **Multi-node training.** Training the large pretrained models that the arm's policy starts from runs across many
  machines for days, and the machines exchange data at every training step. If one machine is lost, the current step
  is lost on all of them. These runs need a dedicated cluster on reserved capacity, such as Capacity Blocks. Spot is
  not an option: AWS Batch does not run multi-node jobs on Spot, and the EC2 guide lists work that is "tightly
  coupled between instance nodes" as not suitable for Spot.
- **Always-on streams.** Some work never ends, such as decoding video that arrives all day. This work does not go
  through a job queue; it runs on a group of CPU machines that stays up all the time, and a lost machine costs only
  the item it was processing. Because the use is steady, Savings Plans fit it. Decoding one arm's 50 episodes takes a
  few minutes on a laptop, but a company that ingests video all day needs a permanent group of machines, with CPU
  cores as the bottleneck in both cases.
- **Real-time on the robot.** Recording the arm and running its policy happen on the computer next to the arm and
  cannot be interrupted, so no cloud scheduler is involved. On AWS, new versions of the model reach that computer
  through AWS IoT Greengrass, software that runs on the device and receives deployments from the cloud.
