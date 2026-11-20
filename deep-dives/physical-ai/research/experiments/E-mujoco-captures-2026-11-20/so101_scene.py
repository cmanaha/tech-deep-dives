"""Scene and scripted pick-and-place for the SO-101 MuJoCo model (captures for the Physical AI dive).
The arm model is TheRobotStudio/SO-ARM100 Simulation/SO101 at a pinned commit; table, block, cup,
cameras and lights are added here. The motion is scripted (inverse kinematics), not a learned policy."""
import math
import numpy as np
import mujoco

ARM_JOINTS = ['shoulder_pan', 'shoulder_lift', 'elbow_flex', 'wrist_flex', 'wrist_roll']
HOME = np.array([0.0, -1.2, 1.1, 1.0, 0.0])

def build(model_xml, block_xy=(0.26, -0.07), cup_xy=(0.23, 0.12), block_rgba=(0.82, 0.16, 0.14, 1),
          cup_rgba=(0.16, 0.38, 0.78, 1), floor_rgb=((0.86, 0.84, 0.80), (0.80, 0.78, 0.74)),
          light_pos=(0.3, -0.4, 1.2), light_diffuse=0.5, top_cam_jitter=(0, 0, 0), block_size=0.0125,
          sky=((0.93, 0.95, 0.98), (0.75, 0.80, 0.88)), arm_tint=None, block_yaw=None):
    spec = mujoco.MjSpec.from_file(model_xml)
    spec.visual.global_.offwidth = 1600
    spec.visual.global_.offheight = 1200
    spec.visual.headlight.ambient = [0.32, 0.32, 0.32]
    spec.visual.headlight.diffuse = [0.3, 0.3, 0.3]
    spec.visual.headlight.specular = [0, 0, 0]
    spec.visual.quality.shadowsize = 4096
    spec.visual.map.znear = 0.005
    spec.add_texture(name='sky', type=mujoco.mjtTexture.mjTEXTURE_SKYBOX, builtin=mujoco.mjtBuiltin.mjBUILTIN_GRADIENT,
                     rgb1=list(sky[0]), rgb2=list(sky[1]), width=256, height=1536)
    spec.add_texture(name='desk', type=mujoco.mjtTexture.mjTEXTURE_2D, builtin=mujoco.mjtBuiltin.mjBUILTIN_CHECKER,
                     rgb1=list(floor_rgb[0]), rgb2=list(floor_rgb[1]), width=256, height=256)
    mat = spec.add_material(name='desk', texrepeat=[8, 8], texuniform=True, reflectance=0.0)
    mat.textures[mujoco.mjtTextureRole.mjTEXROLE_RGB] = 'desk'
    w = spec.worldbody
    w.add_geom(name='floor', type=mujoco.mjtGeom.mjGEOM_PLANE, size=[0, 0, 0.05], material='desk', friction=[1.0, 0.005, 0.0001])
    w.add_light(pos=list(light_pos), dir=[-0.2, 0.3, -1], diffuse=[light_diffuse] * 3, specular=[0.2, 0.2, 0.2], castshadow=True)
    # Block: a free body.
    yaw = math.atan2(block_xy[1], block_xy[0] - 0.039) if block_yaw is None else block_yaw
    b = w.add_body(name='block', pos=[block_xy[0], block_xy[1], block_size], quat=[math.cos(yaw / 2), 0, 0, math.sin(yaw / 2)])
    b.add_freejoint(name='block_free')
    b.add_geom(name='block', type=mujoco.mjtGeom.mjGEOM_BOX, size=[block_size] * 3, rgba=list(block_rgba), mass=0.02,
               friction=[3.0, 0.05, 0.001], condim=6, solref=[0.004, 1], solimp=[0.95, 0.99, 0.001, 0.5, 2])
    # Cup: a ring of wall segments and a base, fixed to the table.
    c = w.add_body(name='cup', pos=[cup_xy[0], cup_xy[1], 0])
    r, h, n = 0.034, 0.06, 20
    c.add_geom(name='cup_base', type=mujoco.mjtGeom.mjGEOM_CYLINDER, size=[r, 0.002, 0], pos=[0, 0, 0.002], rgba=list(cup_rgba))
    for i in range(n):
        a = 2 * math.pi * i / n
        c.add_geom(name=f'cup_wall_{i}', type=mujoco.mjtGeom.mjGEOM_BOX, size=[0.002, r * math.pi / n * 1.08, h / 2],
                   pos=[r * math.cos(a), r * math.sin(a), h / 2], quat=[math.cos(a / 2), 0, 0, math.sin(a / 2)], rgba=list(cup_rgba))
    # Cameras: a three-quarter view, the overhead camera a policy sees, and the wrist camera.
    w.add_camera(name='scene', pos=[0.62, -0.42, 0.34], mode=mujoco.mjtCamLight.mjCAMLIGHT_TARGETBODY, targetbody='lookat', fovy=38)
    w.add_body(name='lookat', pos=[0.17, 0.02, 0.09])
    w.add_camera(name='side', pos=[0.24, -0.75, 0.16], mode=mujoco.mjtCamLight.mjCAMLIGHT_TARGETBODY, targetbody='lookat', fovy=36)
    tj = top_cam_jitter
    w.add_body(name='toptarget', pos=[0.22 + tj[0], 0.02 + tj[1], 0])
    w.add_camera(name='top', pos=[0.22 + tj[0], 0.02 + tj[1] - 0.001, 0.62 + tj[2]], mode=mujoco.mjtCamLight.mjCAMLIGHT_TARGETBODY, targetbody='toptarget', fovy=50)
    # Wrist camera: fixed to the gripper body near the model's camera mount, looking past the jaw tips.
    gs = spec.site('gripperframe')
    Rs = np.zeros(9); mujoco.mju_quat2Mat(Rs, np.array(gs.quat, dtype=float)); Rs = Rs.reshape(3, 3)
    p_local = np.array(WRIST_CAM_POS); look = np.array(WRIST_CAM_LOOK) - p_local; look /= np.linalg.norm(look)
    zc = -look; xc = np.cross(np.array([0, 0, -1.0]), zc); xc /= np.linalg.norm(xc); yc = np.cross(zc, xc)
    Rc = Rs @ np.column_stack([xc, yc, zc])
    qc = np.zeros(4); mujoco.mju_mat2Quat(qc, Rc.flatten())
    spec.body('gripper').add_camera(name='wrist', pos=list(np.array(gs.pos) + Rs @ p_local), quat=list(qc), fovy=80)
    if arm_tint is not None:
        for m_ in spec.materials:
            if m_.name.endswith('_material') and m_.rgba[0] > 0.9 and m_.rgba[2] < 0.3:
                m_.rgba = list(arm_tint) + [1]
    spec.option.impratio = 10
    spec.option.cone = mujoco.mjtCone.mjCONE_ELLIPTIC
    spec.option.noslip_iterations = 5
    model = spec.compile()
    return model

class Arm:
    def __init__(self, model):
        self.m = model
        self.d = mujoco.MjData(model)
        self.scratch = mujoco.MjData(model)
        self.qadr = [model.joint(j).qposadr[0] for j in ARM_JOINTS]
        self.dadr = [model.joint(j).dofadr[0] for j in ARM_JOINTS]
        self.grip_q = model.joint('gripper').qposadr[0]
        self.site = model.site('gripperframe').id
        self.act = [model.actuator(j).id for j in ARM_JOINTS]
        self.grip_act = model.actuator('gripper').id
        self.q = HOME.copy()
        for a, v in zip(self.qadr, HOME): self.d.qpos[a] = v
        self.d.ctrl[self.act] = HOME
        self.d.ctrl[self.grip_act] = 0.0
        mujoco.mj_forward(model, self.d)

    def fk(self, q):
        s = self.scratch
        s.qpos[:] = self.d.qpos
        for a, v in zip(self.qadr, q): s.qpos[a] = v
        mujoco.mj_kinematics(self.m, s); mujoco.mj_comPos(self.m, s)
        return s.site_xpos[self.site].copy(), s.site_xmat[self.site].reshape(3, 3).copy()

    def ik(self, target, q0, axis_col=None, iters=60):
        """Damped least squares: put the gripper frame at target with its approach axis pointing down."""
        q = q0.copy()
        s = self.scratch
        jp = np.zeros((3, self.m.nv)); jr = np.zeros((3, self.m.nv))
        for _ in range(iters):
            pos, R = self.fk(q)
            a = self.approach(R)
            off = R @ GRASP_LOCAL
            e = np.concatenate([target - (pos + off), 0.25 * np.cross(a, np.array([0, 0, -1.0]))])
            if np.linalg.norm(e) < 1e-4: break
            mujoco.mj_jacSite(self.m, s, jp, jr, self.site)
            sk = np.array([[0, -off[2], off[1]], [off[2], 0, -off[0]], [-off[1], off[0], 0]])
            Jm = np.vstack([(jp - sk @ jr)[:, self.dadr], 0.25 * jr[:, self.dadr]])
            dq = Jm.T @ np.linalg.solve(Jm @ Jm.T + 1e-4 * np.eye(6), e)
            q = q + np.clip(dq, -0.2, 0.2)
            q[4] = 0.0
            for i, j in enumerate(ARM_JOINTS):
                lo, hi = self.m.joint(j).range
                q[i] = min(max(q[i], lo), hi)
        return q

    def approach(self, R):
        return R[:, APPROACH_COL] * APPROACH_SIGN

APPROACH_COL, APPROACH_SIGN = 0, 1.0
WRIST_QUAT = (0, 1, 0, 0)
WRIST_CAM_POS = (-0.07, 0.0, -0.07)
WRIST_CAM_LOOK = (0.04, 0.0, 0.02)
GRASP_LOCAL = np.array([-0.014, 0.0, 0.019])
CUP_AIM = np.array([-0.022, -0.015])


def smooth(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)

def run_episode(model, block_xy, cup_xy, on_frame=None, fps=25, plan_block_xy=None, grip_z=0.018, speed=1.0):
    """Scripted pick and place. plan_block_xy lets the script aim at a different place than the block
    really is (an open-loop motion replayed on a perturbed scene). Returns (arm, success)."""
    arm = Arm(model)
    m, d = model, arm.d
    pb = np.array(plan_block_xy if plan_block_xy is not None else block_xy, dtype=float)
    cup = np.array(cup_xy, dtype=float) + CUP_AIM
    OPEN, CLOSED = 0.95, -0.1
    start, R0 = arm.fk(HOME); start = start + R0 @ GRASP_LOCAL
    way = [  # (target xyz, gripper, seconds, label)
        (np.array([pb[0], pb[1], 0.10]), OPEN, 1.2, 'reach'),
        (np.array([pb[0], pb[1], grip_z]), OPEN, 0.9, 'descend'),
        (np.array([pb[0], pb[1], grip_z]), CLOSED, 0.7, 'grasp'),
        (np.array([pb[0], pb[1], 0.14]), CLOSED, 0.9, 'lift'),
        (np.array([cup[0], cup[1], 0.14]), CLOSED, 1.2, 'carry'),
        (np.array([cup[0], cup[1], 0.105]), CLOSED, 0.8, 'lower'),
        (np.array([cup[0], cup[1], 0.105]), OPEN, 0.6, 'release'),
        (np.array([cup[0] - 0.05, cup[1] * 0.5, 0.17]), OPEN, 0.9, 'retreat'),
    ]
    steps_per_ctrl = int(round(0.02 / m.opt.timestep))
    frame_every = max(1, int(round(1.0 / fps / 0.02)))
    q = HOME.copy(); pos = start.copy(); grip = 0.0; k = 0
    for target, g, secs, label in way:
        n = max(1, int(secs / speed / 0.02))
        p0, g0 = pos.copy(), grip
        for i in range(n):
            a = smooth((i + 1) / n)
            pos = p0 + a * (target - p0); grip = g0 + a * (g - g0)
            q = arm.ik(pos, q)
            d.ctrl[arm.act] = q; d.ctrl[arm.grip_act] = grip
            for _ in range(steps_per_ctrl): mujoco.mj_step(m, d)
            if on_frame is not None and k % frame_every == 0: on_frame(arm, label, k * 0.02)
            k += 1
    q0 = q.copy()
    for i in range(50):
        a = smooth((i + 1) / 40)
        d.ctrl[arm.act] = q0 + a * (HOME - q0); d.ctrl[arm.grip_act] = grip * (1 - a)
        for _ in range(steps_per_ctrl): mujoco.mj_step(m, d)
        if on_frame is not None and k % frame_every == 0: on_frame(arm, 'home', k * 0.02)
        k += 1
    bp = d.xpos[m.body('block').id]
    ok = bool(np.hypot(bp[0] - cup_xy[0], bp[1] - cup_xy[1]) < 0.03 and bp[2] < 0.05)
    return arm, ok
