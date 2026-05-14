import { useContext, useMemo, useState, type PointerEvent } from 'react';
import { autoDomain, valueToRadius, type BubbleMapProps } from './variants';
import { MapTileCtx } from '../maptile/variants';
import {
  computeExtent,
  polygonToFitPath,
  projectFit,
} from '../choroplethmap/variants';
import type { GeoJsonFeature } from '../mapminimap/variants';

export function BubbleMap(props: BubbleMapProps) {
  const {
    data,
    geojson,
    extent,
    projection,
    width = 480,
    height = 280,
    radiusRange = [3, 24],
    domain: domainProp,
    fill,
    stroke,
    opacity = 0.55,
    tooltip = true,
    unit,
  } = props;

  const ctx = useContext(MapTileCtx);
  const insideTile = !!ctx;
  const w = insideTile ? ctx!.viewport.width : width;
  const h = insideTile ? ctx!.viewport.height : height;

  const projectFn = useMemo(() => {
    if (projection) return projection;
    if (ctx) return ctx.project;
    const resolvedExtent =
      extent ??
      (geojson?.features?.length
        ? computeExtent(geojson.features)
        : { north: 85, south: -85, east: 180, west: -180 });
    return (lng: number, lat: number) => projectFit(lng, lat, resolvedExtent, w, h);
  }, [projection, ctx, extent, geojson, w, h]);

  const domain = useMemo(() => domainProp ?? autoDomain(data), [domainProp, data]);

  const basePaths = useMemo(() => {
    const features = geojson?.features ?? [];
    if (insideTile) return [];
    const ext = extent ?? (features.length ? computeExtent(features) : null);
    if (!ext) return [];
    return features.map((f, i) => {
      const geom = (f as GeoJsonFeature).geometry;
      const multi = geom.type === 'MultiPolygon';
      return { id: i, d: polygonToFitPath(geom.coordinates as never, multi, ext, w, h) };
    });
  }, [geojson, extent, insideTile, w, h]);

  const bubbles = useMemo(
    () =>
      data.map((d) => {
        const p = projectFn(d.lng, d.lat);
        return { ...d, x: p.x, y: p.y, r: valueToRadius(d.value, domain, radiusRange) };
      }),
    [data, projectFn, domain, radiusRange],
  );

  const [hover, setHover] = useState<{ x: number; y: number; name: string; value: number } | null>(null);

  function onEnter(e: PointerEvent<SVGCircleElement>, b: { name?: string; id: string | number; value: number }) {
    if (!tooltip) return;
    const svg = (e.currentTarget as SVGElement).ownerSVGElement;
    const rect = svg?.getBoundingClientRect();
    setHover({
      x: rect ? e.clientX - rect.left : e.nativeEvent.offsetX,
      y: rect ? e.clientY - rect.top : e.nativeEvent.offsetY,
      name: String(b.name ?? b.id),
      value: b.value,
    });
  }
  function onMove(e: PointerEvent<SVGCircleElement>) {
    setHover((prev) => {
      if (!prev) return prev;
      const svg = (e.currentTarget as SVGElement).ownerSVGElement;
      const rect = svg?.getBoundingClientRect();
      if (!rect) return prev;
      return { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
  }

  const resolvedFill = fill ?? `oklch(from var(--accent-1) l c h / ${opacity})`;
  const resolvedStroke = stroke ?? 'var(--accent-1)';
  const containerClass = `cf-bubblemap ${insideTile ? 'cf-bubblemap--layer' : 'cf-bubblemap--standalone'}`;

  return (
    <div
      className={containerClass}
      style={insideTile ? undefined : { width: `${w}px`, height: `${h}px` }}
    >
      <svg
        className="cf-bubblemap__svg"
        viewBox={`0 0 ${w} ${h}`}
        width={insideTile ? undefined : w}
        height={insideTile ? undefined : h}
        role="img"
        aria-label="气泡地图"
        onPointerLeave={() => setHover(null)}
      >
        {basePaths.map((bp) => (
          <path key={bp.id} className="cf-bubblemap__land" d={bp.d} />
        ))}
        {bubbles.map((b) => (
          <circle
            key={String(b.id)}
            className="cf-bubblemap__bubble"
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={b.tone ?? resolvedFill}
            stroke={resolvedStroke}
            onPointerEnter={(e) => onEnter(e, b)}
            onPointerMove={onMove}
          />
        ))}
      </svg>
      {tooltip && hover && (
        <div
          className="cf-bubblemap__tooltip"
          style={{ left: `${hover.x}px`, top: `${hover.y}px` }}
          role="tooltip"
        >
          <span className="cf-bubblemap__tooltip-name">{hover.name}</span>
          <span className="cf-bubblemap__tooltip-value">{hover.value}{unit ?? ''}</span>
        </div>
      )}
    </div>
  );
}
