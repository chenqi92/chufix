/** Canvas-based KDE heat renderer (greyscale blobs → gradient colorization). */

import type { HeatPoint } from './variants';
import { DEFAULT_HEAT_GRADIENT } from './variants';

export function buildGradientLut(
  stops: Array<{ stop: number; color: string }>,
): Uint8ClampedArray {
  if (typeof document === 'undefined') return new Uint8ClampedArray(256 * 4);
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 1;
  const ctx = c.getContext('2d');
  if (!ctx) return new Uint8ClampedArray(256 * 4);
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  for (const s of stops) grad.addColorStop(Math.max(0, Math.min(1, s.stop)), s.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
}

export function makeBlob(radius: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  const r2 = radius * 2;
  c.width = r2;
  c.height = r2;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, r2, r2);
  return c;
}

export function renderHeat(
  canvas: HTMLCanvasElement,
  points: Array<{ x: number; y: number; weight: number }>,
  options: {
    radius: number;
    maxIntensity?: number;
    gradient?: Array<{ stop: number; color: string }>;
    opacity?: number;
  },
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  const radius = options.radius;
  const blob = makeBlob(radius);
  if (!blob) return;

  // 1. Greyscale density pass.
  for (const p of points) {
    ctx.globalAlpha = Math.max(0.05, Math.min(1, p.weight));
    ctx.drawImage(blob, p.x - radius, p.y - radius);
  }
  ctx.globalAlpha = 1;

  // 2. Colorize via gradient LUT.
  const image = ctx.getImageData(0, 0, width, height);
  const pixels = image.data;
  const lut = buildGradientLut(options.gradient ?? DEFAULT_HEAT_GRADIENT);
  const opacity = options.opacity ?? 0.7;
  const maxA = options.maxIntensity ?? 255;
  const inv = 255 / maxA;

  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a === 0) continue;
    const lutIdx = Math.min(255, Math.max(0, Math.round(a * inv))) * 4;
    pixels[i] = lut[lutIdx];
    pixels[i + 1] = lut[lutIdx + 1];
    pixels[i + 2] = lut[lutIdx + 2];
    pixels[i + 3] = Math.round(a * opacity);
  }

  ctx.putImageData(image, 0, 0);
}

export function projectAndWeight(
  data: HeatPoint[],
  project: (lng: number, lat: number) => { x: number; y: number },
  width: number,
  height: number,
): Array<{ x: number; y: number; weight: number }> {
  const out: Array<{ x: number; y: number; weight: number }> = [];
  for (const p of data) {
    const pos = project(p.lng, p.lat);
    if (pos.x < -100 || pos.y < -100 || pos.x > width + 100 || pos.y > height + 100) continue;
    out.push({ x: pos.x, y: pos.y, weight: p.weight ?? 1 });
  }
  return out;
}
