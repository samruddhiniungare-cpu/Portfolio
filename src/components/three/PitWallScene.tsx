import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { driver, type Project } from "../../data/portfolio";
import { useApp } from "../../context/AppContext";
import { experience } from "../../data/portfolio";

const raceHistory: Project[] = experience.map((item, index) => ({
  round: item.position,
  name: item.role,
  year: item.seasons,
  description: item.points.join(" "),
  stack: item.stack,
  trackId: index,
  status: "ACHIEVEMENT",
}));

/** ─────────────────────────────────────────────────────────────────────────
 *  THE RACE TRACK — a curved circuit of project displays.
 *  Pan LEFT/RIGHT around Samruddhi's project grid, like following a circuit.
 *  ──────────────────────────────────────────────────────────────────────── */

const RADIUS = 7.0;
const COL_STEP = THREE.MathUtils.degToRad(28);
/** A single curved row of large project boards. */
const SCREEN_W = 2.95;
const SCREEN_H = 1.8;

export type WallApi = {
  yawTarget: number;
  maxYaw: number;
};

/** true while the last pointer gesture was a drag — swallows the trailing click */
const dragGuard = { active: false };

/** Slot for index i — project boards placed around the circuit. */
function slotFor(i: number): { angle: number; y: number } {
  const n = Math.max(1, raceHistory.length);
  const angle = (i - (n - 1) / 2) * COL_STEP;
  return { angle, y: 0 };
}

/** High contrast project label strip, drawn on canvas. */
function makeLabelTexture(round: string, name: string, status: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 96;
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const draw = () => {
    const x = c.getContext("2d")!;
    x.clearRect(0, 0, 1024, 96);
    x.fillStyle = "rgba(10,10,13,0.92)";
    x.fillRect(0, 0, 1024, 96);
    x.fillStyle = "#e10600";
    x.fillRect(0, 0, 8, 96);
    x.font = "700 34px 'JetBrains Mono', monospace";
    x.fillStyle = "#8d939a";
    x.textBaseline = "middle";
    x.fillText(round, 36, 50);
    x.font = "italic 900 40px 'Titillium Web', sans-serif";
    x.fillStyle = "#f5f5f7";
    x.fillText(name.toUpperCase(), 130, 50);
    x.font = "500 26px 'JetBrains Mono', monospace";
    x.fillStyle = "#2bd354";
    x.textAlign = "right";
    x.fillText(status, 990, 50);
    x.textAlign = "left";
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return tex;
}

/** High-contrast full-screen milestone copy, instead of generic thumbnails. */
function makeBoardTexture(item: Project): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;

  const draw = () => {
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#101014";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const glow = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    glow.addColorStop(0, "rgba(225,6,0,.34)");
    glow.addColorStop(.55, "rgba(225,6,0,.06)");
    glow.addColorStop(1, "rgba(10,10,14,.1)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e10600";
    ctx.fillRect(0, 0, 12, canvas.height);
    ctx.strokeStyle = "rgba(245,245,247,.14)";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 968, 584);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "700 28px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#ff5b50";
    ctx.fillText(`RACE HISTORY  /  ${item.round}`, 60, 78);

    ctx.font = "italic 900 58px 'Titillium Web', sans-serif";
    const words = item.name.toUpperCase().split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > 890 && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    ctx.fillStyle = "#f5f5f7";
    lines.slice(0, 2).forEach((part, i) => ctx.fillText(part, 60, 190 + i * 76));
    ctx.font = "700 26px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#d5d5dc";
    ctx.fillText(`${item.year}  ·  ${item.status ?? "ACHIEVEMENT"}`, 60, 370);

    ctx.font = "400 27px 'Titillium Web', sans-serif";
    const descWords = item.description.split(/\s+/);
    const descLines: string[] = [];
    let descLine = "";
    for (const word of descWords) {
      const candidate = descLine ? `${descLine} ${word}` : word;
      if (ctx.measureText(candidate).width > 890 && descLine) {
        descLines.push(descLine);
        descLine = word;
      } else descLine = candidate;
    }
    if (descLine) descLines.push(descLine);
    ctx.fillStyle = "#c2c2ca";
    descLines.slice(0, 4).forEach((part, i) => ctx.fillText(part, 60, 435 + i * 42));
    texture.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return texture;
}



/** CSP-safe 3D label — canvas texture instead of troika workers (blocked under strict CSP). */
function makeCanvasTextTexture(
  lines: { text: string; size: number; color: string; y: number; font?: string }[],
  width = 1024,
  height = 256
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const tex = new THREE.CanvasTexture(c);
  const draw = () => {
    const x = c.getContext("2d")!;
    x.clearRect(0, 0, width, height);
    for (const line of lines) {
      x.font = `${line.size}px ${line.font ?? "'JetBrains Mono', monospace"}`;
      x.fillStyle = line.color;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(line.text, width / 2, line.y);
    }
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return tex;
}

function CanvasTextPlane({
  lines,
  position,
  rotation = [0, 0, 0],
  plane = [1.9, 0.5],
}: {
  lines: { text: string; size: number; color: string; y: number; font?: string }[];
  position: [number, number, number];
  rotation?: [number, number, number];
  plane?: [number, number];
}) {
  const tex = useMemo(() => makeCanvasTextTexture(lines), [JSON.stringify(lines)]);
  return (
    <mesh position={position} rotation={rotation} raycast={() => null}>
      <planeGeometry args={plane} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

/** thin scanline overlay shared by all screens */
function makeScanlineTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 64;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, 4, 64);
  x.fillStyle = "rgba(0,0,0,0.28)";
  for (let y = 0; y < 64; y += 4) x.fillRect(0, y, 4, 1.4);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 10);
  return tex;
}

function Monitor({
  project,
  angle,
  y,
  accent,
  onSelect,
  scanTex,
}: {
  project: Project;
  angle: number;
  y: number;
  accent: string;
  onSelect: (p: Project) => void;
  scanTex: THREE.CanvasTexture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => makeBoardTexture(project), [project]);
  const labelTex = useMemo(
    () => makeLabelTexture(project.round, project.name, project.status ?? "ONLINE"),
    [project]
  );

  const pos = useMemo<[number, number, number]>(
    () => [Math.sin(angle) * RADIUS, y, -Math.cos(angle) * RADIUS],
    [angle, y]
  );

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const s = hovered ? 1.055 : 1;
    g.scale.x += (s - g.scale.x) * 0.14;
    g.scale.y += (s - g.scale.y) * 0.14;
    g.scale.z += (s - g.scale.z) * 0.14;
  });

  return (
    <group
      ref={groupRef}
      position={pos}
      rotation={[Math.atan2(y, RADIUS) * -0.28, -angle, 0]}
    >
      {/* bezel */}
      <mesh position={[0, -0.06, -0.045]} castShadow>
        <boxGeometry args={[SCREEN_W + 0.14, SCREEN_H + 0.44, 0.08]} />
        <meshStandardMaterial color="#131318" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* screen */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (dragGuard.active) return;
          onSelect(project);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* scanlines + glass tint */}
      <mesh position={[0, 0, 0.004]} raycast={() => null}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={scanTex} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* hover glow frame */}
      <mesh position={[0, 0, 0.006]} raycast={() => null}>
        <planeGeometry args={[SCREEN_W + 0.06, SCREEN_H + 0.06]} />
        <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.16 : 0} depthWrite={false} />
      </mesh>
      {/* label strip */}
      <mesh position={[0, -(SCREEN_H / 2) - 0.16, 0.002]} raycast={() => null}>
        <planeGeometry args={[SCREEN_W, 0.22]} />
        <meshBasicMaterial map={labelTex} transparent toneMapped={false} />
      </mesh>
      {/* cheap "screen glow" halo behind the bezel — no extra lights */}
      <mesh position={[0, -0.06, -0.09]} raycast={() => null}>
        <planeGeometry args={[SCREEN_W + 0.9, SCREEN_H + 0.9]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={hovered ? 0.1 : 0.045}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** decorative arc rails above and below the monitor bank */
function ArcRails({ accent }: { accent: string }) {
  const rail = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const span = COL_STEP * Math.max(1, raceHistory.length - 1) + 0.5;
    for (let i = 0; i <= 40; i++) {
      const a = -span / 2 + (span * i) / 40;
      pts.push(new THREE.Vector3(Math.sin(a) * (RADIUS + 0.12), 0, -Math.cos(a) * (RADIUS + 0.12)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 40, 0.012, 6, false);
  }, []);
  return (
    <group>
      <mesh geometry={rail} position={[0, SCREEN_H / 2 + 0.55, 0]}>
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      <mesh geometry={rail} position={[0, -(SCREEN_H / 2 + 0.7), 0]}>
        <meshBasicMaterial color={accent} transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

/** floating dust motes for depth */
function Dust() {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 140;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (Math.random() - 0.5) * 1.6;
      const r = 2.4 + Math.random() * 4.4;
      pos[i * 3] = Math.sin(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = -Math.cos(a) * r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.02} color="#9ba1a6" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** LEFT-RIGHT pan only: pointer drag rotates the wall's yaw, clamped. */
function PanRig({
  api,
  progressEl,
  wallRef,
}: {
  api: React.RefObject<WallApi>;
  progressEl: React.RefObject<HTMLDivElement | null>;
  wallRef: React.RefObject<THREE.Group | null>;
}) {
  const { gl, camera, size } = useThree();
  const yaw = useRef(0);

  // widen the view on tall/narrow screens so a full column fits, and give
  // narrow screens more pan travel (wide screens see most of the wall already)
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    cam.fov = aspect < 0.9 ? 58 : aspect < 1.35 ? 48 : 40;
    cam.updateProjectionMatrix();
    // 4 large screens span wider — give a bit more pan travel
    api.current.maxYaw = COL_STEP * ((raceHistory.length - 1) / 2) + (aspect < 0.9 ? 0.14 : 0.08);
  }, [camera, size, api]);

  const lastInteract = useRef(0);

  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lastX = 0;

    let travelled = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      travelled = 0;
      dragGuard.active = false;
      lastX = e.clientX;
      lastInteract.current = performance.now();
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      travelled += Math.abs(dx);
      if (travelled > 10) dragGuard.active = true; // it's a pan, not a click
      lastInteract.current = performance.now();
      const a = api.current;
      a.yawTarget = THREE.MathUtils.clamp(a.yawTarget + dx * 0.0042, -a.maxYaw, a.maxYaw);
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      el.releasePointerCapture?.(e.pointerId);
      // let the click event (fired right after pointerup) see the guard first
      setTimeout(() => {
        dragGuard.active = false;
      }, 0);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl, api]);

  const prevTarget = useRef(0);

  useFrame(({ pointer, clock }) => {
    const a = api.current;
    // keep the external nudges clamped too
    a.yawTarget = THREE.MathUtils.clamp(a.yawTarget, -a.maxYaw, a.maxYaw);
    // arrow-button nudges count as interaction too
    if (a.yawTarget !== prevTarget.current) {
      prevTarget.current = a.yawTarget;
      lastInteract.current = performance.now();
    }
    // idle: the wall breathes — a slow sweep hints that it can be panned
    const idleFor = performance.now() - lastInteract.current;
    const idleAmp = THREE.MathUtils.clamp((idleFor - 5000) / 4000, 0, 1);
    const drift = Math.sin(clock.elapsedTime * 0.22) * 0.055 * idleAmp;
    yaw.current += (a.yawTarget + drift - yaw.current) * 0.14;
    if (wallRef.current) wallRef.current.rotation.y = yaw.current;

    // gentle parallax: lean into the pointer, never off the chair
    camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.16 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -RADIUS);

    // drive the HTML progress thumb directly (no React re-render)
    const p = (yaw.current / a.maxYaw + 1) / 2;
    const elp = progressEl.current;
    if (elp) {
      const thumbWidth = 100 / raceHistory.length;
      elp.style.width = `${thumbWidth}%`;
      elp.style.transform = `translateX(${p * (raceHistory.length - 1) * 100}%)`;
    }
  });
  return null;
}

export default function PitWallScene({
  active,
  onSelect,
  api,
  progressEl,
}: {
  active: boolean;
  onSelect: (p: Project) => void;
  api: React.RefObject<WallApi>;
  progressEl: React.RefObject<HTMLDivElement | null>;
}) {
  const { accent } = useApp();
  const wallRef = useRef<THREE.Group>(null);
  const scanTex = useMemo(makeScanlineTexture, []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 0], fov: 44, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
        // R3F forces touch-action:none inline; restore vertical page scrolling
        gl.domElement.style.touchAction = "pan-y";
      }}
    >
      <fog attach="fog" args={["#08080b", 8, 18]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, -2]} intensity={1.1} color={accent} decay={1.2} />
      <pointLight position={[0, -3, -1]} intensity={0.4} color="#7d9bff" decay={1.2} />

      <Suspense fallback={null}>
        <group ref={wallRef}>
          {raceHistory.map((p, i) => {
            const { angle, y } = slotFor(i);
            return (
              <Monitor
                key={p.name}
                project={p}
                angle={angle}
                y={y}
                accent={accent}
                onSelect={onSelect}
                scanTex={scanTex}
              />
            );
          })}
          <ArcRails accent={accent} />
        </group>
        {/* room shell — a big cylinder around the chair catches the screen light */}
        <mesh position={[0, 0, -RADIUS - 1.2]}>
          <cylinderGeometry args={[RADIUS + 2.6, RADIUS + 2.6, 10, 48, 1, true]} />
          <meshStandardMaterial color="#0b0b0f" roughness={0.9} metalness={0.2} side={THREE.BackSide} />
        </mesh>
        <Dust />
      </Suspense>

      <PanRig api={api} progressEl={progressEl} wallRef={wallRef} />
      <CanvasTextPlane
        lines={[
          {
            text: `${driver.fullName} — PROJECT CIRCUIT`,
            size: 42,
            color: "#3a3f45",
            y: 128,
            font: "'JetBrains Mono', monospace",
          },
        ]}
        position={[0, -2.15, -3.2]}
        rotation={[-0.5, 0, 0]}
        plane={[3.2, 0.35]}
      />
    </Canvas>
  );
}
