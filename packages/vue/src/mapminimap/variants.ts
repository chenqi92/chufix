export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMiniMapProps {
  /** World / region bounds rendered as the base box. Default = world (-180..180, -85..85). */
  extent?: MapBounds;
  /** Visible viewport rectangle to draw on top of the base. */
  visibleRect?: MapBounds;
  /** Width in px. Default 160. */
  width?: number;
  /** Height in px. Default 90. */
  height?: number;
  /** GeoJSON FeatureCollection for the base map outline. */
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown };
  properties?: Record<string, unknown>;
}

export const WORLD_BOUNDS: MapBounds = { north: 85, south: -85, east: 180, west: -180 };

/** Project lng/lat into a unit square within the given bounds. Equirectangular (simple). */
export function projectToBox(
  lng: number,
  lat: number,
  bounds: MapBounds,
  width: number,
  height: number,
): { x: number; y: number } {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * width;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * height;
  return { x, y };
}

/** Convert GeoJSON polygon coordinates into an SVG path string. */
export function polygonToPath(
  coords: number[][][] | number[][][][],
  multi: boolean,
  bounds: MapBounds,
  width: number,
  height: number,
): string {
  const rings = (multi ? (coords as number[][][][]).flat() : (coords as number[][][])) as number[][][];
  return rings
    .map((ring) => {
      let d = '';
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i];
        const p = projectToBox(lng, lat, bounds, width, height);
        d += (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ',' + p.y.toFixed(2);
      }
      return d + 'Z';
    })
    .join(' ');
}
