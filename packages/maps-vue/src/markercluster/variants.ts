import type { MapBounds, GeoJsonFeature } from '../mapminimap/variants';

export interface MarkerDatum {
  id: string | number;
  lng: number;
  lat: number;
  name?: string;
  /** Optional weight when contributing to a cluster (defaults 1). */
  weight?: number;
  /** Optional payload. */
  data?: unknown;
}

export interface MarkerClusterProps {
  data: MarkerDatum[];
  /** Optional GeoJSON outline for standalone use. */
  geojson?: { type: 'FeatureCollection'; features: GeoJsonFeature[] };
  /** Geographic extent for standalone projection. */
  extent?: MapBounds;
  /** Override projection (used inside CfMapTile). */
  projection?: (lng: number, lat: number) => { x: number; y: number };
  /** Container size for standalone use. */
  width?: number;
  height?: number;
  /** Grid bucket size in px. Default 60. Smaller = finer clusters. */
  cellSize?: number;
  /** Don't cluster below this count — show points directly. Default 2. */
  minClusterSize?: number;
  /** Hide individual markers (only render clusters). Default false. */
  clustersOnly?: boolean;
  /** Click handler when a cluster bubble is tapped. */
  onClusterClick?: (cluster: ClusterGroup) => void;
  /** Click handler for an individual marker. */
  onMarkerClick?: (marker: MarkerDatum) => void;
}

export interface ClusterGroup {
  id: string;
  /** Sum of weights of members. */
  count: number;
  /** Average member position in projected px. */
  x: number;
  y: number;
  /** Original members. */
  members: MarkerDatum[];
}

export interface ClusterResult {
  clusters: ClusterGroup[];
  singles: Array<MarkerDatum & { x: number; y: number }>;
}

export function gridCluster(
  data: MarkerDatum[],
  project: (lng: number, lat: number) => { x: number; y: number },
  cellSize: number,
  minClusterSize: number,
): ClusterResult {
  const buckets = new Map<string, MarkerDatum[]>();
  const positions = new Map<string | number, { x: number; y: number }>();
  for (const d of data) {
    const p = project(d.lng, d.lat);
    positions.set(d.id, p);
    const gx = Math.floor(p.x / cellSize);
    const gy = Math.floor(p.y / cellSize);
    const k = `${gx},${gy}`;
    let arr = buckets.get(k);
    if (!arr) {
      arr = [];
      buckets.set(k, arr);
    }
    arr.push(d);
  }
  const clusters: ClusterGroup[] = [];
  const singles: Array<MarkerDatum & { x: number; y: number }> = [];
  for (const [key, members] of buckets) {
    if (members.length < minClusterSize) {
      for (const m of members) {
        const p = positions.get(m.id)!;
        singles.push({ ...m, x: p.x, y: p.y });
      }
      continue;
    }
    let sx = 0;
    let sy = 0;
    let count = 0;
    for (const m of members) {
      const p = positions.get(m.id)!;
      const w = m.weight ?? 1;
      sx += p.x * w;
      sy += p.y * w;
      count += w;
    }
    clusters.push({
      id: `c-${key}`,
      count,
      x: sx / count,
      y: sy / count,
      members,
    });
  }
  return { clusters, singles };
}

export function clusterRadius(count: number): number {
  // Logarithmic so counts 5 / 50 / 500 differ visibly without exploding.
  return 14 + Math.min(28, Math.log10(Math.max(1, count)) * 12);
}
