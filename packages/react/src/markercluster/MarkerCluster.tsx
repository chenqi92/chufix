import { useContext, useMemo, type MouseEvent } from 'react';
import {
  clusterRadius,
  gridCluster,
  type ClusterGroup,
  type MarkerClusterProps,
  type MarkerDatum,
} from './variants';
import { MapTileCtx } from '../maptile/variants';
import { computeExtent, projectFit } from '../choroplethmap/variants';

export function MarkerCluster(props: MarkerClusterProps) {
  const {
    data,
    geojson,
    extent,
    projection,
    width = 480,
    height = 280,
    cellSize = 60,
    minClusterSize = 2,
    clustersOnly = false,
    onClusterClick,
    onMarkerClick,
  } = props;

  const ctx = useContext(MapTileCtx);
  const insideTile = !!ctx;
  const w = insideTile ? ctx!.viewport.width : width;
  const h = insideTile ? ctx!.viewport.height : height;

  const projectFn = useMemo(() => {
    if (projection) return projection;
    if (ctx) return ctx.project;
    const ext =
      extent ??
      (geojson?.features?.length
        ? computeExtent(geojson.features)
        : { north: 85, south: -85, east: 180, west: -180 });
    return (lng: number, lat: number) => projectFit(lng, lat, ext, w, h);
  }, [projection, ctx, extent, geojson, w, h]);

  const result = useMemo(
    () => gridCluster(data, projectFn, cellSize, minClusterSize),
    [data, projectFn, cellSize, minClusterSize],
  );

  function onCluster(c: ClusterGroup, e: MouseEvent) {
    e.stopPropagation();
    onClusterClick?.(c);
  }

  function onMarker(m: MarkerDatum, e: MouseEvent) {
    e.stopPropagation();
    onMarkerClick?.(m);
  }

  const containerClass = `cf-markercluster ${insideTile ? 'cf-markercluster--layer' : 'cf-markercluster--standalone'}`;

  return (
    <div
      className={containerClass}
      style={insideTile ? undefined : { width: `${w}px`, height: `${h}px` }}
    >
      <svg
        className="cf-markercluster__svg"
        viewBox={`0 0 ${w} ${h}`}
        width={insideTile ? undefined : w}
        height={insideTile ? undefined : h}
        role="img"
        aria-label="标记聚合"
      >
        {!clustersOnly && (
          <g className="cf-markercluster__singles">
            {result.singles.map((m) => (
              <circle
                key={String(m.id)}
                className="cf-markercluster__dot"
                cx={m.x}
                cy={m.y}
                r={4}
                onClick={(e) => onMarker(m, e)}
              >
                {m.name && <title>{m.name}</title>}
              </circle>
            ))}
          </g>
        )}
        <g className="cf-markercluster__clusters">
          {result.clusters.map((c) => (
            <g
              key={c.id}
              className="cf-markercluster__cluster"
              transform={`translate(${c.x},${c.y})`}
              onClick={(e) => onCluster(c, e)}
            >
              <circle className="cf-markercluster__cluster-halo" r={clusterRadius(c.count) + 4} />
              <circle className="cf-markercluster__cluster-bg" r={clusterRadius(c.count)} />
              <text
                className="cf-markercluster__cluster-text"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {c.count}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
