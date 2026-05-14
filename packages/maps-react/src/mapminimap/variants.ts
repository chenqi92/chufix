export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMiniMapProps {
  extent?: MapBounds;
  visibleRect?: MapBounds;
  width?: number;
  height?: number;
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown };
  properties?: Record<string, unknown>;
}

export const WORLD_BOUNDS: MapBounds = { north: 85, south: -85, east: 180, west: -180 };

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
