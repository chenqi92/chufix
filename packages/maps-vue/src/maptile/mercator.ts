/** Web Mercator helpers shared by CfMapTile and its layer companions. */

export const TILE_SIZE = 256;

export interface LngLat {
  lng: number;
  lat: number;
}

export interface Viewport {
  center: LngLat;
  zoom: number;
  width: number;
  height: number;
}

/** Convert lng/lat → fractional tile coords at a given zoom level. */
export function lngLatToTile(lng: number, lat: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

/** Convert fractional tile coords → lng/lat. */
export function tileToLngLat(x: number, y: number, zoom: number): LngLat {
  const n = Math.pow(2, zoom);
  const lng = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat = (latRad * 180) / Math.PI;
  return { lng, lat };
}

/** Build a screen-projection function for the given viewport. */
export function makeProjection(v: Viewport): (lng: number, lat: number) => { x: number; y: number } {
  const center = lngLatToTile(v.center.lng, v.center.lat, v.zoom);
  return (lng: number, lat: number) => {
    const p = lngLatToTile(lng, lat, v.zoom);
    return {
      x: (p.x - center.x) * TILE_SIZE + v.width / 2,
      y: (p.y - center.y) * TILE_SIZE + v.height / 2,
    };
  };
}

/** Inverse: screen px → lng/lat. */
export function makeUnproject(v: Viewport): (x: number, y: number) => LngLat {
  const center = lngLatToTile(v.center.lng, v.center.lat, v.zoom);
  return (x: number, y: number) => {
    const tx = center.x + (x - v.width / 2) / TILE_SIZE;
    const ty = center.y + (y - v.height / 2) / TILE_SIZE;
    return tileToLngLat(tx, ty, v.zoom);
  };
}

/** Clamp helpers for Web Mercator. */
export function clampLat(lat: number): number {
  return Math.max(-85.05112878, Math.min(85.05112878, lat));
}

export function clampZoom(z: number, min = 0, max = 19): number {
  return Math.max(min, Math.min(max, z));
}

/** Meters per pixel at given lat / zoom (for scale bar). */
export function metersPerPixel(lat: number, zoom: number): number {
  const earthCircumference = 40075016.686;
  return (earthCircumference * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom + 8);
}

/** List of integer tiles intersecting a viewport (with optional buffer rings). */
export function tilesForViewport(v: Viewport, buffer = 1): Array<{ z: number; x: number; y: number }> {
  const z = Math.floor(v.zoom);
  const n = Math.pow(2, z);
  const c = lngLatToTile(v.center.lng, v.center.lat, z);
  const scale = Math.pow(2, v.zoom - z);
  const halfW = v.width / 2 / (TILE_SIZE * scale);
  const halfH = v.height / 2 / (TILE_SIZE * scale);
  const xMin = Math.floor(c.x - halfW) - buffer;
  const xMax = Math.floor(c.x + halfW) + buffer;
  const yMin = Math.floor(c.y - halfH) - buffer;
  const yMax = Math.floor(c.y + halfH) + buffer;
  const tiles: Array<{ z: number; x: number; y: number }> = [];
  for (let y = yMin; y <= yMax; y++) {
    if (y < 0 || y >= n) continue;
    for (let x = xMin; x <= xMax; x++) {
      const wx = ((x % n) + n) % n;
      tiles.push({ z, x: wx, y });
    }
  }
  return tiles;
}

/** Screen px rectangle (top-left + size) for an integer tile at the current viewport. */
export function tileScreenRect(
  v: Viewport,
  tile: { z: number; x: number; y: number },
): { x: number; y: number; size: number } {
  const c = lngLatToTile(v.center.lng, v.center.lat, v.zoom);
  const scale = Math.pow(2, v.zoom - tile.z);
  const size = TILE_SIZE * scale;
  // The tile's NW corner expressed in zoom-v.zoom tile space:
  const tx = tile.x * scale;
  const ty = tile.y * scale;
  return {
    x: (tx - c.x) * TILE_SIZE + v.width / 2,
    y: (ty - c.y) * TILE_SIZE + v.height / 2,
    size,
  };
}
