import { useContext, useMemo } from 'react';
import {
  computeExtent,
  curvedArc,
  pointBoundsExtent,
  polygonToFitPath,
  polygonToProjectedPath,
  projectFit,
  valueToWidth,
  type FlowMapProps,
} from './variants';
import type { GeoJsonFeature } from '../mapminimap/variants';
import { MapTileCtx } from '../maptile/variants';

export function FlowMap(props: FlowMapProps) {
  const {
    geojson,
    points,
    edges,
    extent: extentProp,
    projection,
    width = 480,
    height = 280,
    widthRange,
    curvature = 0.22,
    showArrow = true,
    showNodes = true,
    showLabels = false,
  } = props;

  const ctx = useContext(MapTileCtx);
  const insideTile = !!ctx;
  const w = insideTile ? ctx!.viewport.width : width;
  const h = insideTile ? ctx!.viewport.height : height;

  const customProject = useMemo(() => {
    if (projection) return projection;
    if (ctx) return ctx.project;
    return null;
  }, [projection, ctx]);

  const extent = useMemo(
    () =>
      extentProp ??
      (geojson?.features?.length ? computeExtent(geojson.features) : pointBoundsExtent(points)),
    [extentProp, geojson, points],
  );

  const range: [number, number] = widthRange ?? [0.6, 3];

  const pointIndex = useMemo(() => {
    const m = new Map<string, { x: number; y: number; name: string }>();
    for (const p of points) {
      const xy = customProject ? customProject(p.lng, p.lat) : projectFit(p.lng, p.lat, extent, w, h);
      m.set(String(p.id), { x: xy.x, y: xy.y, name: p.name ?? String(p.id) });
    }
    return m;
  }, [points, extent, w, h, customProject]);

  const valueRange = useMemo<[number, number]>(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const e of edges) {
      if (e.value == null || !Number.isFinite(e.value)) continue;
      if (e.value < min) min = e.value;
      if (e.value > max) max = e.value;
    }
    if (!Number.isFinite(min)) return [0, 1];
    if (min === max) return [min, min + 1];
    return [min, max];
  }, [edges]);

  const basePaths = useMemo(() => {
    const features = geojson?.features ?? [];
    if (insideTile) return [];
    return features.map((f, i) => {
      const geom = (f as GeoJsonFeature).geometry;
      const multi = geom.type === 'MultiPolygon';
      return {
        id: i,
        d: customProject
          ? polygonToProjectedPath(geom.coordinates as never, multi, customProject)
          : polygonToFitPath(geom.coordinates as never, multi, extent, w, h),
      };
    });
  }, [geojson, extent, w, h, customProject, insideTile]);

  const arcs = useMemo(() => {
    const out: { id: number; d: string; width: number; label?: string }[] = [];
    const [vmin, vmax] = valueRange;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const a = pointIndex.get(String(e.from));
      const b = pointIndex.get(String(e.to));
      if (!a || !b) continue;
      const aw = valueToWidth(e.value, vmin, vmax, range);
      out.push({ id: i, d: curvedArc(a.x, a.y, b.x, b.y, curvature), width: aw, label: e.label });
    }
    return out;
  }, [edges, pointIndex, valueRange, range, curvature]);

  const nodes = useMemo(
    () => Array.from(pointIndex.entries()).map(([id, p]) => ({ id, ...p })),
    [pointIndex],
  );

  return (
    <svg
      className={`cf-flowmap ${insideTile ? 'cf-flowmap--layer' : 'cf-flowmap--standalone'}`}
      viewBox={`0 0 ${w} ${h}`}
      width={insideTile ? undefined : w}
      height={insideTile ? undefined : h}
      role="img"
      aria-label="迁徙地图"
    >
      <defs>
        {showArrow && (
          <marker
            id="cf-flowmap-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path className="cf-flowmap__arrow-head" d="M0,0 L10,5 L0,10 z" />
          </marker>
        )}
      </defs>
      {!insideTile && <rect className="cf-flowmap__bg" x={0} y={0} width={w} height={h} />}
      {basePaths.map((bp) => (
        <path key={`base-${bp.id}`} className="cf-flowmap__land" d={bp.d} />
      ))}
      <g className="cf-flowmap__arcs">
        {arcs.map((a) => (
          <path
            key={`arc-${a.id}`}
            className="cf-flowmap__arc"
            d={a.d}
            strokeWidth={a.width}
            markerEnd={showArrow ? 'url(#cf-flowmap-arrow)' : undefined}
          >
            {a.label && <title>{a.label}</title>}
          </path>
        ))}
      </g>
      {showNodes && (
        <g className="cf-flowmap__nodes">
          {nodes.map((n) => (
            <g key={`n-${n.id}`} className="cf-flowmap__node">
              <circle className="cf-flowmap__dot" cx={n.x} cy={n.y} r={2.6} />
              {showLabels && (
                <text className="cf-flowmap__label" x={n.x + 5} y={n.y - 5}>
                  {n.name}
                </text>
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
