/**
 * The thread task, named in one place. The owner has not yet decided between the dive's own
 * story (block into cup) and the task that ships as first-party code (pick the cube up). Every
 * section takes its wording from here so a later switch is a small edit.
 */

/** The arm every section uses. */
export const ARM = 'SO-101';
/** The story the dive follows on the arm, as a verb phrase. */
export const TASK_STORY = 'pick up a block and place it in a cup';
/** The same story as a noun, for headings and labels. */
export const TASK_NAME = 'block-in-cup';
/** The first-party simulated task that covers the pick half (MuJoCo Playground 1.0). */
export const SIM_TASK = 'SO101PickCubeVision';
/** What the shipped simulated task does, in plain words. */
export const SIM_TASK_PLAIN = 'pick the cube up';
/** What the shipped task leaves out of the story. */
export const SIM_TASK_GAP = 'placing the block in the cup';
