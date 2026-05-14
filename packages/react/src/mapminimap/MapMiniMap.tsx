import { useMemo } from 'react';
import {
  polygonToPath,
  projectToBox,
  WORLD_BOUNDS,
  type GeoJsonFeature,
  type MapMiniMapProps,
} from './variants';

export function MapMiniMap(props: MapMiniMapProps) {
  const { extent = WORLD_BOUNDS, visibleRect, width = 160, height = 90, geojson } = props;

  const paths = useMemo(() => {
    const features = geojson?.features ?? [];
    return features.map((f, i) => {
      const geom = (f as GeoJsonFeature).geometry;
      const multi = geom.type === 'MultiPolygon';
      return { id: i, d: polygonToPath(geom.coordinates as never, multi, extent, width, height) };
    });
  }, [geojson, extent, width, height]);

  const rect = useMemo(() => {
    if (!visibleRect) return null;
    const tl = projectToBox(visibleRect.west, visibleRect.north, extent, width, height);
    const br = projectToBox(visibleRect.east, visibleRect.south, extent, width, height);
    return {
      x: Math.min(tl.x, br.x),
      y: Math.min(tl.y, br.y),
      width: Math.abs(br.x - tl.x),
      height: Math.abs(br.y - tl.y),
    };
  }, [visibleRect, extent, width, height]);

  return (
    <svg
      className="cf-mapminimap"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label="缩略地图"
    >
      <rect className="cf-mapminimap__bg" x={0} y={0} width={width} height={height} />
      {paths.map((p) => (
        <path key={p.id} className="cf-mapminimap__land" d={p.d} />
      ))}
      {rect && (
        <rect
          className="cf-mapminimap__viewport"
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
        />
      )}
    </svg>
  );
}
