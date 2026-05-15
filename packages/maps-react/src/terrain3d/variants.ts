export interface Terrain3DBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type Terrain3DColorScale = 'depth' | 'elevation' | 'delta' | 'viridis';

export interface Terrain3DCamera {
  pitch?: number;
  yaw?: number;
  zoom?: number;
}

export const COLOR_SCALES: Record<Terrain3DColorScale, (t: number) => { r: number; g: number; b: number }> = {
  depth(t) {
    const v = Math.max(0, Math.min(1, t));
    if (v < 0.25) return { r: 0.06, g: 0.18 + v * 0.4, b: 0.45 + v * 0.7 };
    if (v < 0.5) {
      const tt = (v - 0.25) / 0.25;
      return { r: 0.06 + tt * 0.1, g: 0.28 + tt * 0.32, b: 0.62 + tt * 0.2 };
    }
    if (v < 0.75) {
      const tt = (v - 0.5) / 0.25;
      return { r: 0.16 + tt * 0.45, g: 0.6 + tt * 0.25, b: 0.82 + tt * 0.1 };
    }
    const tt = (v - 0.75) / 0.25;
    return { r: 0.61 + tt * 0.3, g: 0.85 + tt * 0.1, b: 0.92 + tt * 0.05 };
  },
  elevation(t) {
    const v = Math.max(0, Math.min(1, t));
    if (v < 0.3) return { r: 0.12, g: 0.4 + v * 0.4, b: 0.18 };
    if (v < 0.6) {
      const tt = (v - 0.3) / 0.3;
      return { r: 0.4 + tt * 0.3, g: 0.55 + tt * 0.2, b: 0.18 + tt * 0.1 };
    }
    if (v < 0.85) {
      const tt = (v - 0.6) / 0.25;
      return { r: 0.7 + tt * 0.18, g: 0.65 - tt * 0.1, b: 0.4 + tt * 0.18 };
    }
    const tt = (v - 0.85) / 0.15;
    return { r: 0.88 + tt * 0.08, g: 0.85 + tt * 0.1, b: 0.88 + tt * 0.1 };
  },
  delta(t) {
    const v = Math.max(0, Math.min(1, t));
    if (v < 0.5) {
      const tt = v / 0.5;
      return { r: 0.95 - tt * 0.3, g: 0.45 + tt * 0.5, b: 0.18 + tt * 0.7 };
    }
    const tt = (v - 0.5) / 0.5;
    return { r: 0.95 - tt * 0.3, g: 0.95 - tt * 0.4, b: 0.88 - tt * 0.55 };
  },
  viridis(t) {
    const v = Math.max(0, Math.min(1, t));
    const r = 0.267 + v * (0.993 - 0.267);
    const g = 0.005 + v * (0.906 - 0.005);
    const b = 0.329 + Math.sin(v * Math.PI) * 0.3;
    return { r, g, b };
  },
};

export function resolveColorScale(
  scale: Terrain3DColorScale | ((t: number) => { r: number; g: number; b: number }) | undefined,
): (t: number) => { r: number; g: number; b: number } {
  if (typeof scale === 'function') return scale;
  return COLOR_SCALES[scale ?? 'depth'];
}

export function normalizeHeights(
  heightData: number[] | Float32Array,
  minHeight?: number,
  maxHeight?: number,
): { min: number; max: number; range: number } {
  let mn = minHeight ?? Infinity;
  let mx = maxHeight ?? -Infinity;
  if (minHeight === undefined || maxHeight === undefined) {
    for (let i = 0; i < heightData.length; i++) {
      const v = heightData[i];
      if (!Number.isFinite(v)) continue;
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
  }
  if (!Number.isFinite(mn)) mn = 0;
  if (!Number.isFinite(mx)) mx = 1;
  const range = mx - mn || 1;
  return { min: mn, max: mx, range };
}
