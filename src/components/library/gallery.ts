// The endless gallery behind the entrance.
//
// One photograph of a library hall holds, in its far room, a smaller copy of
// itself; that copy holds another, and so on. The camera walks slowly toward
// the fixed point of that self-similarity, so after one "level" the picture is
// exactly where it started and the walk loops without a seam. Each copy is
// drawn from the full-resolution photo, so it stays sharp as it grows.

// Photo size in its own pixels, and where the copy of itself sits.
const W = 2400;
const H = 1588;
const COPY_X = 1050;
const COPY_Y = 940;
const K = 260 / W; // scale of each copy
const FX = COPY_X / (1 - K);
const FY = COPY_Y / (1 - K);
const LEVEL_MS = 26_000; // time to walk through one gallery
const DEPTH = 4;

export type Gallery = {
  /** Speeds the walk up, as when stepping into a book. Resolves when done. */
  enter: (ms: number) => Promise<void>;
  dispose: () => void;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  v: number;
  ph: number;
  z: number;
};

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function createGallery(
  canvas: HTMLCanvasElement,
  dust: HTMLCanvasElement,
  options: { reducedMotion: boolean },
): Promise<Gallery> {
  const ctx = canvas.getContext("2d");
  const dctx = dust.getContext("2d");
  if (!ctx || !dctx) throw new Error("Canvas 2D is not available");

  const large =
    Math.max(window.innerWidth, window.innerHeight) *
      (window.devicePixelRatio || 1) >
    1700;
  const [photo, mask] = await Promise.all([
    load(large ? "/library/hall-2400.webp" : "/library/hall-1600.webp"),
    load("/library/far-gallery-mask.png"),
  ]);

  // The copies: the photo with soft edges, so each one melts into the room around it.
  const copy = document.createElement("canvas");
  copy.width = photo.naturalWidth;
  copy.height = photo.naturalHeight;
  const cctx = copy.getContext("2d");
  if (!cctx) throw new Error("Canvas 2D is not available");
  cctx.drawImage(photo, 0, 0);
  cctx.globalCompositeOperation = "destination-in";
  cctx.drawImage(mask, 0, 0, copy.width, copy.height);

  const still = options.reducedMotion;
  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let motes: Mote[] = [];
  let phase = 0.18;
  let boost = 0;
  let last = performance.now();
  let frame = 0;
  let mx = 0;
  let my = 0;
  let px = 0;
  let py = 0;

  function seed() {
    const count = Math.round(Math.min(150, (vw * vh) / 8500));
    motes = Array.from({ length: count }, () => ({
      x: Math.random() * vw,
      y: Math.random() * vh,
      r: Math.random() * 1.5 + 0.4,
      v: Math.random() * 0.25 + 0.05,
      ph: Math.random() * Math.PI * 2,
      z: Math.random(),
    }));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    vw = window.innerWidth;
    vh = window.innerHeight;
    for (const c of [canvas, dust]) {
      c.width = Math.round(vw * dpr);
      c.height = Math.round(vh * dpr);
    }
    seed();
    if (still) draw(performance.now());
  }

  function pointer(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    mx = event.clientX / vw - 0.5;
    my = event.clientY / vh - 0.5;
  }

  function drawHall() {
    // Cover the screen around the fixed point, which sits a little below centre.
    const base =
      Math.max(
        vw / (2 * Math.min(FX, W - FX)),
        vh / (2 * Math.min(FY, H - FY)),
      ) * 1.04;
    const z = Math.pow(1 / K, phase);
    const sx = vw / 2 - px * 26;
    const sy = vh * 0.56 - py * 16;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = "#0c0b0a";
    ctx!.fillRect(0, 0, vw, vh);
    for (let n = 0; n < DEPTH; n++) {
      const s = base * z * Math.pow(K, n);
      const w = W * s;
      const h = H * s;
      if (w < 2) break;
      const x = sx - s * FX;
      const y = sy - s * FY;
      if (x > vw || y > vh || x + w < 0 || y + h < 0) continue;
      ctx!.drawImage(n === 0 ? photo : copy, x, y, w, h);
    }
  }

  function drawDust(now: number) {
    dctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx!.clearRect(0, 0, vw, vh);
    if (still) return;
    const cx = vw / 2;
    const cy = vh * 0.56;
    const out = 0.0008 + boost * 0.01;
    for (const m of motes) {
      // Drifting up, and slowly outward as the walk goes on.
      m.y -= m.v * 0.3;
      m.x += Math.sin(now / 2400 + m.ph) * 0.15;
      m.x += (m.x - cx) * out * m.z;
      m.y += (m.y - cy) * out * m.z;
      if (m.y < -5 || m.x < -5 || m.x > vw + 5 || m.y > vh + 5) {
        m.x = cx + (Math.random() - 0.5) * vw * 0.6;
        m.y = cy + (Math.random() - 0.5) * vh * 0.6;
      }
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(now / 1300 + m.ph));
      dctx!.fillStyle = `rgba(240,244,250,${0.5 * twinkle * (0.35 + m.z * 0.65)})`;
      dctx!.beginPath();
      dctx!.arc(
        m.x - px * 30 * m.z,
        m.y - py * 20 * m.z,
        m.r * (0.6 + m.z),
        0,
        Math.PI * 2,
      );
      dctx!.fill();
    }
  }

  function draw(now: number) {
    const dt = Math.min(64, now - last);
    last = now;
    if (!still) phase = (phase + dt / LEVEL_MS + (boost * dt) / 1000) % 1;
    px += (mx - px) * 0.04;
    py += (my - py) * 0.04;
    drawHall();
    drawDust(now);
  }

  function loop(now: number) {
    draw(now);
    frame = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", pointer);
  if (still) draw(performance.now());
  else frame = requestAnimationFrame(loop);

  return {
    enter(ms) {
      if (still) return Promise.resolve();
      const start = performance.now();
      return new Promise((resolve) => {
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          boost = t * t * 1.4;
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
    },
  };
}
