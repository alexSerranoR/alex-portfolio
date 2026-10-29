import * as THREE from "three";

// The Library of Babel, built procedurally: an endless field of hexagonal
// towers, one of them modelled inside as stacked galleries around a central
// shaft. Every texture is drawn on a canvas at load, so nothing is downloaded.

export type Lang = "es" | "en";
export type Rect = { x: number; y: number; w: number; h: number };

export type LibraryController = {
  play(intro: boolean): void;
  // Holds the intro at one moment; used to review individual shots.
  freeze(seconds: number): void;
  skip(): void;
  hover(lang: Lang | null): void;
  open(lang: Lang): Promise<void>;
  dispose(): void;
};

type Options = {
  onFrame?: (rects: Record<Lang, Rect>) => void;
  onIdle?: () => void;
};

const H = 4.2; // level height
const SLAB = 0.35;
const APOTHEM = 5.5; // centre to wall
const R = APOTHEM / Math.cos(Math.PI / 6); // centre to corner = side length
const WELL = 1.8; // shaft corner radius
const LEVELS = { below: 4, above: 3 };
const TOP = (LEVELS.above + 1) * H;
const BAY = { width: 1.7, base: 0.25, top: H - SLAB - 0.45, depth: 0.5 };
const ROWS = [0.3, 0.7, 1.1, 1.5, 1.9, 2.3];
const FEATURE_ROW = 2;
const INTRO = 4.9;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const easeOut = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  color = true,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  amount = 9000,
) {
  const r = rng(seed);
  for (let i = 0; i < 40; i++) {
    const x = r() * w;
    const y = r() * h;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 40 + r() * 120);
    const light = r() > 0.5;
    g.addColorStop(0, light ? "rgba(255,255,250,0.10)" : "rgba(70,62,50,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  for (let i = 0; i < amount; i++) {
    const v = r();
    ctx.fillStyle =
      v > 0.5
        ? `rgba(255,255,255,${0.05 + r() * 0.08})`
        : `rgba(60,52,42,${0.05 + r() * 0.1})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
}

function stoneTexture() {
  return canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = "#c8c1b3";
    ctx.fillRect(0, 0, 512, 512);
    speckle(ctx, 512, 512, 7);
    ctx.strokeStyle = "rgba(96,86,70,0.32)";
    ctx.lineWidth = 2;
    for (let row = 0; row < 4; row++) {
      const y = row * 128;
      ctx.beginPath();
      ctx.moveTo(0, y + 1);
      ctx.lineTo(512, y + 1);
      ctx.stroke();
      const offset = row % 2 ? 128 : 0;
      for (let x = offset; x <= 512; x += 256) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 128);
        ctx.stroke();
      }
    }
  });
}

function floorTexture() {
  return canvasTexture(512, 512, (ctx) => {
    const r = rng(11);
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++) {
        const tone = 168 + Math.floor(r() * 22);
        ctx.fillStyle = `rgb(${tone},${tone - 4},${tone - 12})`;
        ctx.fillRect(i * 256, j * 256, 256, 256);
      }
    speckle(ctx, 512, 512, 13, 12000);
    ctx.strokeStyle = "rgba(80,70,58,0.45)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, 255, 255);
    ctx.strokeRect(257, 1, 254, 255);
    ctx.strokeRect(1, 257, 255, 254);
    ctx.strokeRect(257, 257, 254, 254);
  });
}

function spineTexture() {
  return canvasTexture(64, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, "#6e6e6e");
    g.addColorStop(0.35, "#d8d8d8");
    g.addColorStop(0.65, "#c4c4c4");
    g.addColorStop(1, "#5c5c5c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 256);
    const r = rng(5);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(0,0,0,${r() * 0.12})`;
      ctx.fillRect(r() * 64, r() * 256, 1, 1 + r() * 3);
    }
    ctx.fillStyle = "rgba(255,246,220,0.95)";
    for (const y of [22, 30, 222, 230]) ctx.fillRect(0, y, 64, 3);
    ctx.fillStyle = "rgba(255,246,220,0.55)";
    ctx.fillRect(14, 60, 36, 18);
  });
}

function featureSpine(lang: Lang, base: string) {
  return canvasTexture(160, 900, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 160, 900);
    const g = ctx.createLinearGradient(0, 0, 160, 0);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.38, "rgba(255,255,255,0.16)");
    g.addColorStop(0.62, "rgba(255,255,255,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 160, 900);
    ctx.fillStyle = "#e7cf8e";
    for (const y of [60, 74, 826, 840]) ctx.fillRect(0, y, 160, 5);
    ctx.save();
    ctx.translate(80, 450);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f1e2b8";
    ctx.font = "600 64px Georgia, serif";
    ctx.fillText("PORTFOLIO", 40, 0);
    ctx.font = "italic 52px Georgia, serif";
    ctx.fillText("Alex Serrano", -300, 2);
    ctx.restore();
    ctx.fillStyle = "#e7cf8e";
    ctx.font = "700 54px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(lang.toUpperCase(), 80, 790);
  });
}

function coverTexture(base: string, lang: Lang) {
  return canvasTexture(512, 720, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 720);
    speckle(ctx, 512, 720, 3, 5000);
    ctx.strokeStyle = "#d9bd76";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 432, 640);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(54, 54, 404, 612);
    ctx.fillStyle = "#ead39a";
    ctx.textAlign = "center";
    ctx.font = "italic 64px Georgia, serif";
    ctx.fillText("Portfolio", 256, 330);
    ctx.font = "26px Georgia, serif";
    ctx.fillText("ALEX SERRANO", 256, 400);
    ctx.font = "22px Georgia, serif";
    ctx.fillText(
      lang === "es" ? "EDICIÓN EN ESPAÑOL" : "ENGLISH EDITION",
      256,
      600,
    );
  });
}

function endpaperTexture(lang: Lang) {
  return canvasTexture(512, 720, (ctx) => {
    ctx.fillStyle = "#f3ecdc";
    ctx.fillRect(0, 0, 512, 720);
    speckle(ctx, 512, 720, 9, 3000);
    ctx.fillStyle = "#6b573d";
    ctx.textAlign = "center";
    ctx.font = "20px Georgia, serif";
    ctx.fillText("E X   L I B R I S", 256, 280);
    ctx.fillStyle = "#241c14";
    ctx.font = "italic 58px Georgia, serif";
    ctx.fillText("Alex Serrano", 256, 360);
    ctx.fillStyle = "#a8843f";
    ctx.fillRect(216, 392, 80, 2);
    ctx.fillStyle = "#7a2a20";
    ctx.font = "italic 30px Georgia, serif";
    ctx.fillText(
      lang === "es" ? "Ingeniero de software" : "Software Engineer",
      256,
      440,
    );
  });
}

function plaqueTexture() {
  return canvasTexture(512, 80, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 80);
    g.addColorStop(0, "#efe0b0");
    g.addColorStop(0.5, "#c6a65e");
    g.addColorStop(1, "#8a6b2e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 80);
    ctx.strokeStyle = "rgba(60,40,10,0.6)";
    ctx.strokeRect(4, 4, 504, 72);
    ctx.fillStyle = "#3a2a12";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 34px Georgia, serif";
    ctx.fillText("ESPAÑOL  ·  ENGLISH", 256, 42);
  });
}

function towerSideTexture() {
  return canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = "#d6d0c3";
    ctx.fillRect(0, 0, 512, 512);
    speckle(ctx, 512, 512, 21, 4000);
    const r = rng(23);
    const cells = 3;
    const cw = 512 / cells;
    for (let c = 0; c < cells; c++) {
      const x = c * cw + 11;
      const w = cw - 22;
      const top = 26;
      const bottom = 478;
      ctx.fillStyle = "#1f1a16";
      ctx.beginPath();
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top + w / 2);
      ctx.arc(x + w / 2, top + w / 2, w / 2, Math.PI, 0);
      ctx.lineTo(x + w, bottom);
      ctx.closePath();
      ctx.fill();
      ctx.save();
      ctx.clip();
      for (let row = top + 18; row < bottom - 8; row += 38) {
        for (let bx = x + 2; bx < x + w - 3;) {
          const bw = 3 + r() * 5;
          const tone = 55 + r() * 85;
          ctx.fillStyle = `rgb(${tone + 28},${tone + 6},${tone - 22})`;
          const bh = 24 + r() * 8;
          ctx.fillRect(bx, row + 34 - bh, bw, bh);
          bx += bw + 1;
        }
        ctx.fillStyle = "#a59c8c";
        ctx.fillRect(x, row + 34, w, 3);
      }
      ctx.restore();
    }
    ctx.fillStyle = "#e9e4d9";
    ctx.fillRect(0, 484, 512, 28);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(0, 482, 512, 3);
  });
}

function towerTopTexture() {
  return canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = "#0d0b0a";
    ctx.fillRect(0, 0, 512, 512);
    const hex = (radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const x = 256 + Math.cos(a) * radius;
        const y = 256 + Math.sin(a) * radius;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.closePath();
    };
    const r = rng(31);
    let outer = 256;
    for (let ring = 0; ring < 7; ring++) {
      const inner = outer * 0.8;
      const fade = 1 - ring * 0.14;
      // Shelves of one floor seen in perspective, spines radiating inward.
      hex(outer);
      ctx.fillStyle = `rgb(${Math.round(42 * fade)},${Math.round(34 * fade)},${Math.round(28 * fade)})`;
      ctx.fill();
      ctx.save();
      hex(outer);
      ctx.clip();
      for (let k = 0; k < 360; k++) {
        const a = (k / 360) * Math.PI * 2;
        const tone = (60 + r() * 80) * fade;
        ctx.strokeStyle = `rgb(${Math.round(tone + 25)},${Math.round(tone + 5)},${Math.round(tone - 18)})`;
        ctx.lineWidth = 1.2 + r() * 1.5;
        ctx.beginPath();
        ctx.moveTo(
          256 + Math.cos(a) * inner * 1.02,
          256 + Math.sin(a) * inner * 1.02,
        );
        ctx.lineTo(
          256 + Math.cos(a) * outer * (0.92 + r() * 0.06),
          256 + Math.sin(a) * outer * (0.92 + r() * 0.06),
        );
        ctx.stroke();
      }
      ctx.restore();
      hex(outer);
      ctx.lineWidth = Math.max(1, 6 * fade);
      ctx.strokeStyle = `rgba(222,216,204,${0.9 * fade})`;
      ctx.stroke();
      outer = inner;
    }
    hex(outer);
    ctx.fillStyle = "#070606";
    ctx.fill();
  });
}

function gradientTexture(stops: [number, string][], vertical = true) {
  return canvasTexture(
    vertical ? 4 : 256,
    vertical ? 256 : 4,
    (ctx) => {
      const g = vertical
        ? ctx.createLinearGradient(0, 0, 0, 256)
        : ctx.createLinearGradient(0, 0, 256, 0);
      for (const [at, color] of stops) g.addColorStop(at, color);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vertical ? 4 : 256, vertical ? 256 : 4);
    },
    false,
  );
}

function glowTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(240,246,255,0.45)");
    g.addColorStop(1, "rgba(240,246,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

function hexShape(radius: number, rotation = Math.PI / 6) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = rotation + (Math.PI / 3) * i;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i) shape.lineTo(x, y);
    else shape.moveTo(x, y);
  }
  shape.closePath();
  return shape;
}

function hexPath(radius: number, rotation = Math.PI / 6) {
  const path = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = rotation + (Math.PI / 3) * i;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i) path.lineTo(x, y);
    else path.moveTo(x, y);
  }
  path.closePath();
  return path;
}

function archPath(x0: number, x1: number, y0: number, y1: number) {
  const r = (x1 - x0) / 2;
  const p = new THREE.Path();
  p.moveTo(x0, y0);
  p.lineTo(x1, y0);
  p.lineTo(x1, y1 - r);
  p.absarc(x0 + r, y1 - r, r, 0, Math.PI, false);
  p.lineTo(x0, y0);
  return p;
}

// Wall angles: wall k faces the room from angle -90° + 60°k (wall 0 is at -z).
const wallAngle = (k: number) => -Math.PI / 2 + (Math.PI / 3) * k;
const OPENINGS = new Set([2, 4]);

export function createLibrary(
  canvas: HTMLCanvasElement,
  options: Options = {},
): LibraryController {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2(0x9aa1a6, 0.03);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 900);

  // ---------- Sky ----------
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(800, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { fade: { value: 1 } },
      vertexShader:
        "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec3 vPos; uniform float fade;
        void main(){
          float h = normalize(vPos).y;
          vec3 zenith = vec3(0.25,0.31,0.40);
          vec3 mid = vec3(0.58,0.62,0.66);
          vec3 glow = vec3(0.95,0.80,0.60);
          vec3 col = mix(glow, mid, smoothstep(0.0, 0.16, h));
          col = mix(col, zenith, smoothstep(0.16, 0.75, h));
          col = mix(vec3(0.62,0.64,0.65), col, smoothstep(-0.08, 0.02, h));
          vec3 inside = vec3(0.60,0.63,0.66);
          gl_FragColor = vec4(mix(col, inside, fade), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  scene.add(sky);

  // ---------- Light ----------
  const hemi = new THREE.HemisphereLight(0xdde6ee, 0x48433d, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xf2f6fb, 0.95);
  sun.position.set(0.75, 0.9, 0.4);
  scene.add(sun);

  // ---------- Materials ----------
  const stoneMap = stoneTexture();
  stoneMap.repeat.set(0.5, 0.5);
  const stone = new THREE.MeshStandardMaterial({
    map: stoneMap,
    roughness: 0.92,
    metalness: 0,
    bumpMap: stoneMap,
    bumpScale: 0.6,
  });
  const floorMap = floorTexture();
  floorMap.repeat.set(0.85, 0.85);
  const floor = new THREE.MeshStandardMaterial({
    map: floorMap,
    roughness: 0.55,
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 0x4f3d2f,
    roughness: 0.75,
  });
  const backPanel = new THREE.MeshStandardMaterial({
    color: 0x1d1814,
    roughness: 1,
  });
  const spineMap = spineTexture();
  const bookMaterial = new THREE.MeshStandardMaterial({
    map: spineMap,
    roughness: 0.62,
    metalness: 0.02,
  });
  const dark = new THREE.MeshBasicMaterial({ color: 0x0b0a09 });

  const world = new THREE.Group();
  scene.add(world);

  // ---------- One gallery level, reused for every floor ----------
  const facadeBooks = new THREE.Shape();
  facadeBooks.moveTo(-R / 2, 0);
  facadeBooks.lineTo(R / 2, 0);
  facadeBooks.lineTo(R / 2, H - SLAB);
  facadeBooks.lineTo(-R / 2, H - SLAB);
  facadeBooks.closePath();
  const pilaster = (R - 3 * BAY.width) / 4;
  const bayX = (i: number) => -R / 2 + pilaster + i * (BAY.width + pilaster);
  for (let i = 0; i < 3; i++)
    facadeBooks.holes.push(
      archPath(bayX(i), bayX(i) + BAY.width, BAY.base, BAY.top),
    );
  const facadeGeometry = new THREE.ExtrudeGeometry(facadeBooks, {
    depth: BAY.depth + 0.02,
    bevelEnabled: false,
    curveSegments: 18,
  });
  facadeGeometry.translate(0, 0, -BAY.depth - 0.02);

  const facadeDoor = new THREE.Shape();
  facadeDoor.moveTo(-R / 2, 0);
  facadeDoor.lineTo(R / 2, 0);
  facadeDoor.lineTo(R / 2, H - SLAB);
  facadeDoor.lineTo(-R / 2, H - SLAB);
  facadeDoor.closePath();
  facadeDoor.holes.push(archPath(-0.9, 0.9, 0, 3.0));
  const doorGeometry = new THREE.ExtrudeGeometry(facadeDoor, {
    depth: 0.32,
    bevelEnabled: false,
    curveSegments: 18,
  });
  doorGeometry.translate(0, 0, -0.32);

  const slabShape = hexShape(R + 0.7, 0);
  slabShape.holes.push(hexPath(WELL, 0));
  const slabGeometry = new THREE.ExtrudeGeometry(slabShape, {
    depth: SLAB,
    bevelEnabled: false,
  });
  slabGeometry.rotateX(-Math.PI / 2);

  const railShape = hexShape(WELL + 0.12, 0);
  railShape.holes.push(hexPath(WELL, 0));
  const railGeometry = new THREE.ExtrudeGeometry(railShape, {
    depth: 0.09,
    bevelEnabled: false,
  });
  railGeometry.rotateX(-Math.PI / 2);

  const facade = new THREE.InstancedMesh(facadeGeometry, stone, 6 * 8);
  const doors = new THREE.InstancedMesh(doorGeometry, stone, 2 * 8);
  const slabs = new THREE.InstancedMesh(slabGeometry, floor, 8);
  const rails = new THREE.InstancedMesh(railGeometry, stone, 8 * 2);
  const backs = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    backPanel,
    4 * 3 * 8 + 2 * 8,
  );
  const shelves = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    wood,
    4 * 3 * 7 * 8,
  );
  const cornices = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    stone,
    6 * 8 * 2,
  );
  const balusterGeometry = new THREE.CylinderGeometry(0.035, 0.045, 0.86, 8);
  balusterGeometry.translate(0, 0.43, 0);
  const balusters = new THREE.InstancedMesh(
    balusterGeometry,
    stone,
    6 * 12 * 8,
  );
  const bookGeometry = new THREE.BoxGeometry(1, 1, 1);
  bookGeometry.translate(0, 0.5, 0);
  const books = new THREE.InstancedMesh(
    bookGeometry,
    bookMaterial,
    4 * 3 * 7 * 64 * 8,
  );

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const s = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const counts = {
    facade: 0,
    doors: 0,
    slabs: 0,
    rails: 0,
    backs: 0,
    shelves: 0,
    cornices: 0,
    balusters: 0,
    books: 0,
  };
  const random = rng(42);
  const palette = [
    0x5a3a26, 0x6e4a2c, 0x3b2b22, 0x6a2d24, 0x2e382f, 0x2a3240, 0x6b5a3a,
    0x806440, 0x2a2420, 0x4a2c2a, 0x5b4f3e, 0x3a4236, 0x75634a, 0x8f7958,
    0x4d4036,
  ];
  const color = new THREE.Color();

  // Local wall frame: x along the wall, z out into the room.
  const wallMatrix = (k: number, y: number) => {
    const a = wallAngle(k);
    const pos = new THREE.Vector3(
      Math.cos(a) * APOTHEM,
      y,
      Math.sin(a) * APOTHEM,
    );
    const rot = new THREE.Quaternion().setFromAxisAngle(up, -(a + Math.PI / 2));
    return new THREE.Matrix4().compose(pos, rot, new THREE.Vector3(1, 1, 1));
  };
  const place = (
    mesh: THREE.InstancedMesh,
    key: keyof typeof counts,
    base: THREE.Matrix4,
    x: number,
    y: number,
    z: number,
    sx = 1,
    sy = 1,
    sz = 1,
    rotZ = 0,
  ) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);
    m.compose(v.set(x, y, z), q, s.set(sx, sy, sz)).premultiply(base);
    mesh.setMatrixAt(counts[key]++, m);
  };

  const feature = {
    level: 0,
    wall: 0,
    bay: 1,
    row: FEATURE_ROW,
    gapFrom: -0.11,
    gapTo: 0.11,
  };

  for (let level = -LEVELS.below; level <= LEVELS.above; level++) {
    const y = level * H;
    m.makeTranslation(0, y - SLAB, 0);
    slabs.setMatrixAt(counts.slabs++, m);
    m.makeTranslation(0, y + 0.95, 0);
    rails.setMatrixAt(counts.rails++, m);
    m.makeTranslation(0, y + 0.02, 0);
    rails.setMatrixAt(counts.rails++, m);
    for (let k = 0; k < 6; k++) {
      // Balusters around the well.
      const a0 = (Math.PI / 3) * k;
      const a1 = a0 + Math.PI / 3;
      for (let b = 0; b < 12; b++) {
        const t = (b + 0.5) / 12;
        const r = WELL + 0.06;
        const x = (Math.cos(a0) * (1 - t) + Math.cos(a1) * t) * r;
        const z = (Math.sin(a0) * (1 - t) + Math.sin(a1) * t) * r;
        m.makeTranslation(x, y + 0.09, z);
        balusters.setMatrixAt(counts.balusters++, m);
      }
      const base = wallMatrix(k, y);
      place(
        cornices,
        "cornices",
        base,
        0,
        H - SLAB - 0.32,
        0.06,
        R + 0.2,
        0.14,
        0.2,
      );
      place(cornices, "cornices", base, 0, 0.05, 0.03, R + 0.1, 0.1, 0.12);
      if (OPENINGS.has(k)) {
        doors.setMatrixAt(counts.doors++, base);
        place(backs, "backs", base, 0, 1.5, -0.5, 1.9, 3.1, 0.04);
        continue;
      }
      facade.setMatrixAt(counts.facade++, base);
      for (let bay = 0; bay < 3; bay++) {
        const x0 = bayX(bay);
        const cx = x0 + BAY.width / 2;
        place(
          backs,
          "backs",
          base,
          cx,
          (BAY.base + BAY.top) / 2,
          -BAY.depth,
          BAY.width,
          BAY.top - BAY.base,
          0.04,
        );
        for (let row = 0; row < ROWS.length + 1; row++) {
          // The last row sits inside the arch, so it is narrower.
          const arch = row === ROWS.length;
          const ry = arch ? ROWS[ROWS.length - 1] + 0.4 : ROWS[row];
          const inset = arch ? BAY.width / 2 - 0.66 : 0;
          place(
            shelves,
            "shelves",
            base,
            cx,
            ry - 0.02,
            -BAY.depth / 2 - 0.02,
            BAY.width - inset * 2,
            0.035,
            BAY.depth - 0.02,
          );
          let x = x0 + 0.02 + inset;
          const limit = x0 + BAY.width - 0.05 - inset;
          const isFeature =
            level === feature.level &&
            k === feature.wall &&
            bay === feature.bay &&
            row === feature.row;
          while (x < limit) {
            const w = 0.026 + random() * 0.04;
            if (
              isFeature &&
              x + w > cx + feature.gapFrom &&
              x < cx + feature.gapTo
            ) {
              x = cx + feature.gapTo;
              continue;
            }
            if (random() < 0.025) {
              x += 0.04 + random() * 0.1;
              continue;
            }
            const h = arch ? 0.2 + random() * 0.08 : 0.22 + random() * 0.13;
            const d = 0.18 + random() * 0.08;
            const lean = x > limit - 0.11 && random() < 0.4 ? -0.18 : 0;
            place(
              books,
              "books",
              base,
              x + w / 2,
              ry,
              -BAY.depth + d / 2 + 0.06 + random() * 0.04,
              w,
              h,
              d,
              lean,
            );
            color
              .setHex(palette[Math.floor(random() * palette.length)])
              .multiplyScalar(0.65 + random() * 0.4);
            books.setColorAt(counts.books - 1, color);
            x += w + 0.002;
          }
        }
      }
    }
  }
  for (const [mesh, key] of [
    [facade, "facade"],
    [doors, "doors"],
    [slabs, "slabs"],
    [rails, "rails"],
    [backs, "backs"],
    [shelves, "shelves"],
    [cornices, "cornices"],
    [balusters, "balusters"],
    [books, "books"],
  ] as const) {
    mesh.count = counts[key];
    mesh.instanceMatrix.needsUpdate = true;
    world.add(mesh);
  }
  if (books.instanceColor) books.instanceColor.needsUpdate = true;

  // Corridors behind the two open sides read as darkness.
  for (const k of OPENINGS)
    for (let level = -LEVELS.below; level <= LEVELS.above; level++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3, 0.1), dark);
      box.applyMatrix4(wallMatrix(k, level * H));
      box.translateY(1.5).translateZ(-0.45);
      world.add(box);
    }

  // Exterior shell of the modelled tower and its rim.
  const sideMap = towerSideTexture();
  const shellHeight = TOP + LEVELS.below * H + 220;
  const shellGeometry = new THREE.CylinderGeometry(
    R + 0.7,
    R + 0.7,
    shellHeight,
    6,
    1,
    true,
    Math.PI / 2,
  );
  const shellMap = sideMap.clone();
  shellMap.repeat.set(6, shellHeight / H);
  shellMap.needsUpdate = true;
  const shell = new THREE.Mesh(
    shellGeometry,
    new THREE.MeshStandardMaterial({
      map: shellMap,
      roughness: 0.9,
      side: THREE.FrontSide,
    }),
  );
  shell.position.y = TOP - shellHeight / 2;
  world.add(shell);
  const rimShape = hexShape(R + 0.75, 0);
  rimShape.holes.push(hexPath(R - 0.05, 0));
  const rimGeometry = new THREE.ExtrudeGeometry(rimShape, {
    depth: 0.4,
    bevelEnabled: false,
  });
  rimGeometry.rotateX(-Math.PI / 2);
  const rim = new THREE.Mesh(rimGeometry, stone);
  rim.position.y = TOP - 0.4;
  world.add(rim);

  // ---------- The endless field of towers ----------
  const field = new THREE.Group();
  const fieldPositions: THREE.Vector3[] = [];
  const spacing = 16.5;
  const fr = rng(77);
  for (let i = -18; i <= 18; i++)
    for (let j = -18; j <= 18; j++) {
      if (i === 0 && j === 0) continue;
      const x = (i + (j % 2 ? 0.5 : 0)) * spacing;
      const z = j * spacing * 0.866;
      if (Math.hypot(x, z) > 300) continue;
      const top =
        TOP - 22 + fr() ** 1.6 * 52 + (Math.hypot(x, z) < 40 ? -8 : 0);
      fieldPositions.push(
        new THREE.Vector3(x + (fr() - 0.5) * 1.5, top, z + (fr() - 0.5) * 1.5),
      );
    }
  const towerHeight = 260;
  const towerGeometry = new THREE.CylinderGeometry(
    R + 0.7,
    R + 0.7,
    towerHeight,
    6,
    1,
    true,
    Math.PI / 2,
  );
  towerGeometry.translate(0, -towerHeight / 2, 0);
  const towerMap = sideMap.clone();
  towerMap.repeat.set(6, towerHeight / H);
  towerMap.needsUpdate = true;
  const towers = new THREE.InstancedMesh(
    towerGeometry,
    new THREE.MeshStandardMaterial({ map: towerMap, roughness: 0.9 }),
    fieldPositions.length,
  );
  const capGeometry = new THREE.CircleGeometry(R + 0.2, 6, 0);
  capGeometry.rotateX(-Math.PI / 2);
  const caps = new THREE.InstancedMesh(
    capGeometry,
    new THREE.MeshStandardMaterial({ map: towerTopTexture(), roughness: 1 }),
    fieldPositions.length,
  );
  const rims = new THREE.InstancedMesh(
    rimGeometry,
    stone,
    fieldPositions.length,
  );
  fieldPositions.forEach((p, index) => {
    const turn = new THREE.Quaternion();
    m.compose(p, turn, s.set(1, 1, 1));
    towers.setMatrixAt(index, m);
    m.compose(v.set(p.x, p.y - 0.4, p.z), turn, s.set(1, 1, 1));
    rims.setMatrixAt(index, m);
    m.compose(v.set(p.x, p.y - 0.9, p.z), turn, s.set(1, 1, 1));
    caps.setMatrixAt(index, m);
  });
  field.add(towers, caps, rims);
  scene.add(field);

  // ---------- Lamps ----------
  const glow = glowTexture();
  const lampMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9dee2,
    emissive: 0xdfe7ef,
    emissiveIntensity: 0.7,
    roughness: 0.35,
  });
  const cable = new THREE.MeshBasicMaterial({ color: 0x3a3632 });
  const lampLights: THREE.PointLight[] = [];
  // Two spherical lamps per hexagon, hung in front of the shelves.
  for (let level = -LEVELS.below; level <= LEVELS.above; level++)
    for (const side of [-1, 1]) {
      const x = side * 2.05;
      const z = -APOTHEM + 1.1;
      const y = level * H + 3.0;
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 32, 20),
        lampMaterial,
      );
      lamp.position.set(x, y, z);
      world.add(lamp);
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.75),
        cable,
      );
      wire.position.set(x, y + 0.48, z);
      world.add(wire);
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: 0xdfe8f2,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      halo.scale.setScalar(0.9);
      halo.position.copy(lamp.position);
      world.add(halo);
      if (level === 0) {
        const light = new THREE.PointLight(0xeef3f8, 5, 9, 1.6);
        light.position.copy(lamp.position);
        world.add(light);
        lampLights.push(light);
      }
    }

  // Cool daylight falling down the shaft.
  const beamMap = gradientTexture([
    [0, "#ffffff"],
    [0.55, "#7a7a7a"],
    [1, "#000000"],
  ]);
  const shaftBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(
      WELL * 0.82,
      WELL * 0.9,
      TOP + LEVELS.below * H,
      6,
      1,
      true,
      Math.PI / 2,
    ),
    new THREE.MeshBasicMaterial({
      color: 0xdfe9f2,
      alphaMap: beamMap,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    }),
  );
  shaftBeam.position.y = (TOP - LEVELS.below * H) / 2;
  world.add(shaftBeam);

  // ---------- The two portfolios ----------
  const featureBase = wallMatrix(feature.wall, 0);
  const featureCenter = bayX(feature.bay) + BAY.width / 2;
  const rowY = ROWS[feature.row];
  type Book = {
    lang: Lang;
    group: THREE.Group;
    cover: THREE.Group;
    rest: THREE.Matrix4;
    out: number;
    target: number;
    spine: THREE.MeshStandardMaterial;
  };
  const featureBooks: Book[] = [];
  const bookSize = { w: 0.08, h: 0.37, d: 0.25 };
  (["es", "en"] as const).forEach((lang, i) => {
    const base = lang === "es" ? "#5e2119" : "#22382d";
    const group = new THREE.Group();
    const leather = new THREE.MeshStandardMaterial({
      color: base,
      roughness: 0.55,
    });
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(
        bookSize.w - 0.012,
        bookSize.h - 0.012,
        bookSize.d - 0.01,
      ),
      [
        new THREE.MeshStandardMaterial({
          map: endpaperTexture(lang),
          roughness: 0.9,
        }),
        new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.9 }),
      ],
    );
    pages.position.set(0, bookSize.h / 2, -0.004);
    group.add(pages);
    const spineMap = featureSpine(lang, base);
    const spineMaterial = new THREE.MeshStandardMaterial({
      map: spineMap,
      emissiveMap: spineMap,
      emissive: 0xffffff,
      emissiveIntensity: 0,
      roughness: 0.5,
    });
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(bookSize.w, bookSize.h, 0.012),
      [leather, leather, leather, leather, spineMaterial, leather],
    );
    spine.position.set(0, bookSize.h / 2, bookSize.d / 2 - 0.006);
    group.add(spine);
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, bookSize.h, bookSize.d),
      leather,
    );
    back.position.set(-bookSize.w / 2 + 0.003, bookSize.h / 2, 0);
    group.add(back);
    const cover = new THREE.Group();
    cover.position.set(bookSize.w / 2 - 0.003, 0, bookSize.d / 2);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, bookSize.h, bookSize.d),
      [
        new THREE.MeshStandardMaterial({
          map: coverTexture(base, lang),
          roughness: 0.55,
        }),
        leather,
        leather,
        leather,
        leather,
        leather,
      ],
    );
    board.position.set(0, bookSize.h / 2, -bookSize.d / 2);
    cover.add(board);
    group.add(cover);
    const x = featureCenter + (i === 0 ? -0.045 : 0.045);
    const rest = new THREE.Matrix4()
      .compose(
        new THREE.Vector3(x, rowY, -BAY.depth + bookSize.d / 2 + 0.07),
        new THREE.Quaternion(),
        new THREE.Vector3(1, 1, 1),
      )
      .premultiply(featureBase);
    rest.decompose(group.position, group.quaternion, group.scale);
    world.add(group);
    featureBooks.push({
      lang,
      group,
      cover,
      rest,
      out: 0,
      target: 0,
      spine: spineMaterial,
    });
  });

  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.053),
    new THREE.MeshStandardMaterial({
      map: plaqueTexture(),
      roughness: 0.35,
      metalness: 0.65,
    }),
  );
  plaque.applyMatrix4(
    new THREE.Matrix4()
      .makeTranslation(featureCenter, rowY - 0.026, -0.03)
      .premultiply(featureBase),
  );
  world.add(plaque);

  // A beam of light finds the two books.
  const wallNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(
    new THREE.Quaternion().setFromRotationMatrix(featureBase),
  );
  const bookTarget = new THREE.Vector3(
    featureCenter,
    rowY + 0.18,
    -BAY.depth + 0.2,
  ).applyMatrix4(featureBase);
  const spot = new THREE.SpotLight(0xf4f7ff, 0, 8, 0.17, 0.75, 1.3);
  spot.position
    .copy(bookTarget)
    .addScaledVector(wallNormal, 1.6)
    .add(new THREE.Vector3(0, 2.0, 0));
  spot.target.position.copy(bookTarget);
  world.add(spot, spot.target);
  const coneLength = spot.position.distanceTo(bookTarget);
  const coneGeometry = new THREE.CylinderGeometry(
    0.03,
    0.34,
    coneLength,
    32,
    1,
    true,
  );
  coneGeometry.translate(0, -coneLength / 2, 0);
  const cone = new THREE.Mesh(
    coneGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xeef4ff,
      alphaMap: gradientTexture([
        [0, "#000"],
        [0.25, "#666"],
        [1, "#222"],
      ]),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    }),
  );
  cone.position.copy(spot.position);
  cone.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    bookTarget.clone().sub(spot.position).normalize(),
  );
  world.add(cone);

  // Dust drifting in the light.
  const dustCount = 260;
  const dustPositions = new Float32Array(dustCount * 3);
  const dr = rng(99);
  for (let i = 0; i < dustCount; i++) {
    const t = dr();
    const p = spot.position.clone().lerp(bookTarget, t);
    const spread = 0.05 + t * 0.3;
    dustPositions.set(
      [
        p.x + (dr() - 0.5) * spread * 2,
        p.y + (dr() - 0.5) * spread,
        p.z + (dr() - 0.5) * spread * 2,
      ],
      i * 3,
    );
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3),
  );
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.008,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    }),
  );
  world.add(dust);

  // ---------- Camera path ----------
  const lookFinal = bookTarget.clone().add(new THREE.Vector3(-0.15, 0.5, 0));
  const finalPose = () => {
    const portrait = camera.aspect < 0.9;
    const distance = portrait ? 3.6 : 4.0;
    camera.fov = portrait ? 60 : 55;
    camera.updateProjectionMatrix();
    return {
      // A little off-axis so the side walls and the floor give depth.
      pos: bookTarget
        .clone()
        .addScaledVector(wallNormal, distance)
        .add(new THREE.Vector3(portrait ? 0.35 : 1.05, 0.42, 0)),
      look: lookFinal,
    };
  };
  const aerialStart = new THREE.Vector3(70, TOP + 85, 120);
  const aerialEnd = new THREE.Vector3(0.4, TOP + 16, 3.5);
  const shaftBottom = new THREE.Vector3(0, 2.1, 0.6);
  const look = new THREE.Vector3();
  const pos = new THREE.Vector3();

  const pose = (t: number) => {
    const fin = finalPose();
    if (t < 1.6) {
      const k = ease(t / 1.6);
      pos.lerpVectors(aerialStart, aerialEnd, k);
      pos.y += Math.sin(k * Math.PI) * 6;
      look
        .set(0, TOP - 30 * k, -6 * (1 - k))
        .lerp(new THREE.Vector3(0, TOP - 20, 0.5), k);
    } else if (t < 3.35) {
      const k = ease((t - 1.6) / 1.75);
      pos.lerpVectors(aerialEnd, shaftBottom, k);
      // Keep looking down the shaft until we are inside, then lift the gaze.
      const depth = clamp01((TOP + 1 - pos.y) / (TOP - shaftBottom.y + 1));
      const pitch = THREE.MathUtils.lerp(-1.48, -0.35, ease(depth ** 0.85));
      look.set(
        pos.x,
        pos.y + Math.sin(pitch) * 10,
        pos.z + Math.cos(pitch) * -10 * (wallNormal.z > 0 ? 1 : -1),
      );
      // Turn a little as we fall, like a slow spiral.
      const yaw = (1 - k) * 0.9;
      const dx = look.x - pos.x;
      const dz = look.z - pos.z;
      look.x = pos.x + dx * Math.cos(yaw) - dz * Math.sin(yaw);
      look.z = pos.z + dx * Math.sin(yaw) + dz * Math.cos(yaw);
    } else {
      const k = ease(span(t, 3.35, 4.3));
      pos.lerpVectors(shaftBottom, fin.pos, k);
      const lookFrom = new THREE.Vector3(
        shaftBottom.x,
        shaftBottom.y - 3.4,
        shaftBottom.z - 9.4,
      );
      look.lerpVectors(lookFrom, fin.look, k);
    }
    camera.position.copy(pos);
    camera.lookAt(look);
    // Atmosphere: thin outside, a cool haze inside the galleries.
    const inside = t < 1.6 ? 0 : clamp01((TOP + 6 - camera.position.y) / 9);
    fog.density = THREE.MathUtils.lerp(0.0032, 0.045, inside);
    fog.color.setRGB(
      THREE.MathUtils.lerp(0.74, 0.56, inside),
      THREE.MathUtils.lerp(0.71, 0.6, inside),
      THREE.MathUtils.lerp(0.66, 0.63, inside),
    );
    (sky.material as THREE.ShaderMaterial).uniforms.fade.value = inside;
    field.visible = inside < 1;
    const light = easeOut(span(t, 4.15, INTRO));
    spot.intensity = 30 * light;
    for (const book of featureBooks)
      book.spine.emissiveIntensity = 0.22 * light + book.out * 2;
    (cone.material as THREE.MeshBasicMaterial).opacity = 0.14 * light;
    (dust.material as THREE.PointsMaterial).opacity = 0.7 * light;
  };

  // ---------- Loop ----------
  let clock = INTRO;
  let playing = false;
  let last = performance.now();
  let frame = 0;
  let opening: { lang: Lang; start: number; resolve: () => void } | null = null;
  let disposed = false;
  let idleSent = false;
  const corner = new THREE.Vector3();

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const rectFor = (book: Book): Rect => {
    book.group.updateMatrixWorld();
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const [x, y] of [
      [-1, 0],
      [1, 0],
      [-1, 1],
      [1, 1],
    ]) {
      corner
        .set((x * bookSize.w) / 2, y * bookSize.h, bookSize.d / 2)
        .applyMatrix4(book.group.matrixWorld)
        .project(camera);
      const sx = ((corner.x + 1) / 2) * canvas.clientWidth;
      const sy = ((1 - corner.y) / 2) * canvas.clientHeight;
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
      minY = Math.min(minY, sy);
      maxY = Math.max(maxY, sy);
    }
    const pad = 6;
    return {
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    };
  };

  const tick = (now: number) => {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing) {
      clock += dt;
      if (clock >= INTRO) {
        clock = INTRO;
        playing = false;
      }
    }
    pose(clock);
    if (!playing && !idleSent && clock >= INTRO) {
      idleSent = true;
      options.onIdle?.();
    }
    // Dust drifts slowly upward and loops.
    const arr = dustGeometry.attributes.position.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3)
      arr[i] += Math.sin(now * 0.0003 + i) * 0.00008;
    dustGeometry.attributes.position.needsUpdate = true;

    for (const book of featureBooks) {
      book.out += (book.target - book.out) * Math.min(1, dt * 10);
      if (!opening || opening.lang !== book.lang) {
        book.rest.decompose(
          book.group.position,
          book.group.quaternion,
          book.group.scale,
        );
        book.group.position.addScaledVector(wallNormal, book.out);
      }
    }
    if (opening) {
      const book = featureBooks.find((b) => b.lang === opening!.lang)!;
      const t = (now - opening.start) / 1000;
      const restPos = new THREE.Vector3();
      const restQuat = new THREE.Quaternion();
      book.rest.decompose(restPos, restQuat, new THREE.Vector3());
      const pulled = restPos.clone().addScaledVector(wallNormal, 0.3);
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      const hold = camera.position
        .clone()
        .addScaledVector(forward, 0.62)
        .add(new THREE.Vector3(0, -bookSize.h / 2, 0));
      const facing = restQuat
        .clone()
        .multiply(new THREE.Quaternion().setFromAxisAngle(up, -Math.PI / 2));
      const a = easeOut(span(t, 0, 0.35));
      const b = ease(span(t, 0.3, 0.9));
      book.group.position
        .lerpVectors(
          restPos.clone().addScaledVector(wallNormal, book.out),
          pulled,
          a,
        )
        .lerp(hold, b);
      book.group.quaternion.slerpQuaternions(restQuat, facing, b);
      book.cover.rotation.y = -ease(span(t, 0.85, 1.45)) * 2.5;
      if (t > 1.5) {
        const done = opening.resolve;
        opening = null;
        done();
      }
    }
    if (options.onFrame && clock >= INTRO) {
      options.onFrame({
        es: rectFor(featureBooks[0]),
        en: rectFor(featureBooks[1]),
      });
    }
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(tick);

  return {
    play(intro) {
      clock = intro ? 0 : INTRO;
      playing = intro;
      idleSent = false;
    },
    freeze(seconds) {
      clock = Math.min(INTRO, Math.max(0, seconds));
      playing = false;
      idleSent = true;
    },
    skip() {
      clock = INTRO;
      playing = false;
    },
    hover(lang) {
      for (const book of featureBooks)
        book.target = book.lang === lang ? 0.06 : 0;
    },
    open(lang) {
      return new Promise<void>((resolve) => {
        opening = { lang, start: performance.now(), resolve };
      });
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
      });
    },
  };
}
