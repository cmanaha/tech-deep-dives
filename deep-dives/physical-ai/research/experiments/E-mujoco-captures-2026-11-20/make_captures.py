"""Render the stills and clips for the Physical AI dive. Usage: make_captures.py <model.xml> <scripts dir> <out dir>"""
import sys, json, math, subprocess, os
import numpy as np, mujoco
sys.path.insert(0, sys.argv[2])
import so101_scene as S
from PIL import Image, ImageDraw
import imageio_ffmpeg
XML, OUT = sys.argv[1], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
FF = imageio_ffmpeg.get_ffmpeg_exe()
B, C = (0.26, -0.07), (0.23, 0.12)
meta = {}

def jpg(arr, name, q=86):
    Image.fromarray(arr).save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)

def video(frames, name, fps=25):
    h, w = frames[0].shape[:2]
    for ext, codec in (('webm', ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1']),
                       ('mp4', ['-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'])):
        p = subprocess.Popen([FF, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(fps), '-i', '-', '-an'] + codec + [os.path.join(OUT, f'{name}.{ext}')], stdin=subprocess.PIPE)
        for f in frames: p.stdin.write(np.ascontiguousarray(f).tobytes())
        p.stdin.close(); p.wait()

# 1. Pick and place: scene clip, policy-view clip, stills.
m = S.build(XML, block_xy=B, cup_xy=C)
r_scene = mujoco.Renderer(m, 480, 720); r_small = mujoco.Renderer(m, 360, 480); r_big = mujoco.Renderer(m, 800, 1200)
scene_frames, view_frames, stills, log = [], [], {}, []
def on(arm, label, t):
    r_scene.update_scene(arm.d, camera='scene'); scene_frames.append(r_scene.render().copy())
    r_small.update_scene(arm.d, camera='top'); a = r_small.render().copy()
    r_small.update_scene(arm.d, camera='wrist'); b = r_small.render().copy()
    view_frames.append(np.hstack([a, b]))
    log.append({'t': round(t, 2), 'phase': label, 'q': [round(float(arm.d.qpos[x]), 4) for x in arm.qadr] + [round(float(arm.d.qpos[arm.grip_q]), 4)]})
    if label not in stills or label in ('descend', 'grasp', 'carry'):
        r_big.update_scene(arm.d, camera='scene'); s1 = r_big.render().copy()
        r_big.update_scene(arm.d, camera='top'); s2 = r_big.render().copy()
        r_big.update_scene(arm.d, camera='wrist'); s3 = r_big.render().copy()
        stills[label] = (s1, s2, s3, arm.d.qpos.copy(), arm.d.qvel.copy(), arm.d.ctrl.copy())
arm, ok = S.run_episode(m, B, C, on_frame=on)
print('episode success', ok, 'frames', len(scene_frames))
meta['pick_place'] = {'success': ok, 'frames': len(scene_frames), 'fps': 25, 'seconds': round(len(scene_frames) / 25, 1), 'timestep_s': m.opt.timestep, 'control_hz': 50}
video(scene_frames, 'so101-pick-place'); jpg(stills['carry'][0][::1, ::1], 'so101-pick-place-poster.jpg')
video(view_frames, 'so101-policy-views'); jpg(np.hstack([stills['descend'][1], stills['descend'][2]])[::2, ::2] if False else np.hstack([np.array(Image.fromarray(stills['descend'][1]).resize((600, 400))), np.array(Image.fromarray(stills['descend'][2]).resize((600, 400)))]), 'so101-policy-views-poster.jpg')
jpg(stills['descend'][0], 'so101-scene.jpg')
json.dump(log, open(os.path.join(OUT, 'so101-pick-place-joints.json'), 'w'))
# film strip: six moments of the episode from the scene camera
idx = [int(len(scene_frames) * f) for f in (0.02, 0.17, 0.31, 0.45, 0.6, 0.8)]
strip = np.hstack([np.array(Image.fromarray(scene_frames[i]).crop((150, 40, 570, 460)).resize((300, 300))) for i in idx])
jpg(strip, 'so101-episode-strip.jpg')
meta['strip_times_s'] = [round(i / 25, 1) for i in idx]

# 2. Contact: the grasp, close up, with contact points and force arrows drawn by the simulator.
d = arm.d; qpos, qvel, ctrl = stills['grasp'][3:6]
d.qpos[:] = qpos; d.qvel[:] = qvel; d.ctrl[:] = ctrl; mujoco.mj_forward(m, d)
for _ in range(50): mujoco.mj_step(m, d)
opt = mujoco.MjvOption(); opt.flags[mujoco.mjtVisFlag.mjVIS_CONTACTPOINT] = True; opt.flags[mujoco.mjtVisFlag.mjVIS_CONTACTFORCE] = True; opt.flags[mujoco.mjtVisFlag.mjVIS_TRANSPARENT] = True
m.vis.scale.contactwidth = 0.012; m.vis.scale.contactheight = 0.004; m.vis.scale.forcewidth = 0.006; m.vis.map.force = 0.004
cam = mujoco.MjvCamera(); cam.lookat[:] = [B[0], B[1], 0.03]; cam.distance = 0.22; cam.elevation = -12; cam.azimuth = 60
r_big.update_scene(d, camera=cam, scene_option=opt); jpg(r_big.render().copy(), 'so101-contact.jpg')
cons = []
f6 = np.zeros(6)
for i in range(d.ncon):
    c = d.contact[i]; mujoco.mj_contactForce(m, d, i, f6)
    n1 = m.geom(c.geom1).name or m.body(m.geom_bodyid[c.geom1]).name; n2 = m.geom(c.geom2).name or m.body(m.geom_bodyid[c.geom2]).name
    cons.append({'a': n1, 'b': n2, 'normal_force_N': round(float(f6[0]), 3), 'penetration_mm': round(float(-c.dist * 1000), 3)})
meta['contact'] = {'count': d.ncon, 'contacts': cons, 'constraints_nefc': int(d.nefc)}
print('contacts', d.ncon)

# 3. Render passes of one frame: colour, depth, segmentation (what a rasteriser gives a training pipeline).
d.qpos[:] = stills['descend'][3]; mujoco.mj_forward(m, d)
rp = mujoco.Renderer(m, 400, 600)
rp.update_scene(d, camera='top'); rgb = rp.render().copy()
rp.enable_depth_rendering(); rp.update_scene(d, camera='top'); dep = rp.render().copy(); rp.disable_depth_rendering()
far = 0.64; dn = np.clip((dep - dep.min()) / (far - dep.min()), 0, 1); dimg = (255 * (1 - dn)).astype(np.uint8); dimg = np.stack([dimg] * 3, -1)
rp.enable_segmentation_rendering(); rp.update_scene(d, camera='top'); seg = rp.render().copy(); rp.disable_segmentation_rendering()
gid = seg[:, :, 0]; body = np.where(gid >= 0, m.geom_bodyid[np.clip(gid, 0, m.ngeom - 1)], -1)
pal = np.array([[235, 235, 235], [225, 225, 228], [255, 187, 51], [66, 133, 244], [219, 68, 55], [15, 157, 88], [171, 71, 188], [0, 172, 193], [255, 112, 67], [124, 179, 66], [141, 110, 99], [92, 107, 192], [240, 98, 146], [38, 166, 154]])
simg = pal[(body + 1) % len(pal)].astype(np.uint8); simg[gid < 0] = [250, 250, 250]
jpg(np.hstack([rgb, dimg, simg]), 'so101-render-passes.jpg')
meta['render_passes'] = {'depth_min_m': round(float(dep.min()), 3), 'depth_max_m': round(float(dep.max()), 3), 'width': 600, 'height': 400}

# 4. Domain randomisation: six variants of the scene as the overhead camera sees them.
rng = np.random.default_rng(7)
tiles = []; variants = []
for k in range(6):
    hue = rng.uniform(0, 1, 3)
    floor = tuple(0.45 + 0.5 * rng.uniform(0, 1, 3)); floor2 = tuple(np.clip(np.array(floor) - rng.uniform(0.03, 0.25), 0, 1))
    bxy = (B[0] + rng.uniform(-0.04, 0.04), B[1] + rng.uniform(-0.05, 0.05)); cxy = (C[0] + rng.uniform(-0.03, 0.03), C[1] + rng.uniform(-0.03, 0.03))
    lp = (rng.uniform(-0.3, 0.7), rng.uniform(-0.7, 0.5), rng.uniform(0.7, 1.5)); ld = rng.uniform(0.25, 0.75)
    tj = (rng.uniform(-0.03, 0.03), rng.uniform(-0.03, 0.03), rng.uniform(-0.06, 0.06))
    brgb = tuple(np.clip(np.array([0.82, 0.16, 0.14]) + rng.uniform(-0.15, 0.15, 3), 0, 1)) + (1,)
    crgb = tuple(rng.uniform(0.1, 0.9, 3)) + (1,)
    tint = tuple(np.clip(np.array([1, 0.82, 0.12]) * rng.uniform(0.6, 1.0) + rng.uniform(-0.1, 0.1, 3), 0, 1))
    mv = S.build(XML, block_xy=bxy, cup_xy=cxy, block_rgba=brgb, cup_rgba=crgb, floor_rgb=(floor, floor2), light_pos=lp, light_diffuse=ld, top_cam_jitter=tj, arm_tint=tint)
    av = S.Arm(mv); q = S.HOME
    for a, v in zip(av.qadr, q): av.d.qpos[a] = v
    av.d.qpos[av.grip_q] = 0.7; mujoco.mj_forward(mv, av.d)
    rv = mujoco.Renderer(mv, 300, 400); rv.update_scene(av.d, camera='top'); tiles.append(rv.render().copy()); rv.close()
    variants.append({'block_xy': [round(x, 3) for x in bxy], 'cup_xy': [round(x, 3) for x in cxy], 'light_diffuse': round(float(ld), 2), 'camera_offset_m': [round(x, 3) for x in tj]})
jpg(np.vstack([np.hstack(tiles[:3]), np.hstack(tiles[3:])]), 'so101-domain-randomisation.jpg')
meta['domain_randomisation'] = variants

# 5. Evaluation: the same scripted motion replayed open-loop on 12 starts with the block moved.
rng = np.random.default_rng(11)
tiles = []; results = []
for k in range(12):
    off = rng.uniform(-0.012, 0.012, 2) if k else np.zeros(2)
    bxy = (B[0] + off[0], B[1] + off[1])
    me = S.build(XML, block_xy=bxy, cup_xy=C, block_yaw=math.atan2(B[1], B[0] - 0.039))
    ae, oke = S.run_episode(me, bxy, C, plan_block_xy=B)
    re = mujoco.Renderer(me, 240, 320); re.update_scene(ae.d, camera='top'); im = Image.fromarray(re.render().copy()); re.close()
    dr = ImageDraw.Draw(im); col = (20, 140, 60) if oke else (200, 40, 40)
    dr.rectangle([0, 0, 319, 239], outline=col, width=8)
    tiles.append(np.array(im)); results.append({'offset_mm': [round(float(o) * 1000, 1) for o in off], 'success': oke})
    print('eval', k, np.round(off * 1000, 1), oke)
jpg(np.vstack([np.hstack(tiles[i:i + 4]) for i in (0, 4, 8)]), 'so101-eval-grid.jpg')
meta['evaluation'] = {'episodes': 12, 'successes': sum(r['success'] for r in results), 'jitter_mm': 12, 'results': results}
meta['software'] = {'mujoco': mujoco.__version__, 'numpy': np.__version__, 'renderer': 'mujoco.Renderer (OpenGL, offscreen)'}
json.dump(meta, open(os.path.join(OUT, 'captures.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in meta.items() if k in ('pick_place', 'evaluation', 'software')}, indent=1)[:900])
