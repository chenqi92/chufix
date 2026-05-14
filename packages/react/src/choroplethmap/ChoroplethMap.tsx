import { useContext, useMemo, useState, type PointerEvent } from 'react';
import {
  computeDomain,
  computeExtent,
  polygonToFitPath,
  polygonToProjectedPath,
  resolveColorScale,
  type ChoroplethDatum,
  type ChoroplethMapProps,
} from './variants';
import type { GeoJsonFeature } from '../mapminimap/variants';
import { MapTileCtx } from '../maptile/variants';

export function ChoroplethMap(props: ChoroplethMapProps) {
  const {
    geojson,
    data,
    idField = 'id',
    nameField = 'name',
    domain: domainProp,
    colorScale,
    extent: extentProp,
    projection,
    width = 480,
    height = 280,
    tooltip = true,
    legend = true,
    unit,
  } = props;

  const ctx = useContext(MapTileCtx);
  const insideTile = !!ctx;
  const w = insideTile ? ctx!.viewport.width : width;
  const h = insideTile ? ctx!.viewport.height : height;

  const features = geojson?.features ?? [];
  const extent = useMemo(() => extentProp ?? computeExtent(features), [extentProp, geojson]);
  const domain = useMemo(() => domainProp ?? computeDomain(data), [domainProp, data]);
  const scaleFn = useMemo(() => resolveColorScale(colorScale), [colorScale]);

  const customProject = useMemo(() => {
    if (projection) return projection;
    if (ctx) return ctx.project;
    return null;
  }, [projection, ctx]);

  const dataIndex = useMemo(() => {
    const m = new Map<string, ChoroplethDatum>();
    for (const d of data) m.set(String(d.id), d);
    return m;
  }, [data]);

  const regions = useMemo(() => {
    return features.map((f, i) => {
      const geom = (f as GeoJsonFeature).geometry;
      const multi = geom.type === 'MultiPolygon';
      const d = customProject
        ? polygonToProjectedPath(geom.coordinates as never, multi, customProject)
        : polygonToFitPath(
            geom.coordinates as never,
            multi,
            extent,
            w,
            h,
          );
      const propsObj = (f as GeoJsonFeature).properties ?? {};
      const idVal = propsObj[idField];
      const datum = idVal != null ? dataIndex.get(String(idVal)) : undefined;
      const fill = datum
        ? scaleFn(datum.value, domain)
        : 'oklch(from var(--bg-2) l c h / 0.6)';
      const name = (datum?.name ?? propsObj[nameField] ?? idVal ?? '') as string | number;
      return { id: i, d, fill, name: String(name), value: datum?.value };
    });
  }, [features, extent, w, h, customProject, idField, nameField, dataIndex, scaleFn, domain]);

  const [hover, setHover] = useState<{ x: number; y: number; name: string; value?: number } | null>(null);

  function onEnter(e: PointerEvent<SVGPathElement>, r: { name: string; value?: number }) {
    if (!tooltip) return;
    const svg = (e.currentTarget as SVGElement).ownerSVGElement;
    const rect = svg?.getBoundingClientRect();
    setHover({
      x: rect ? e.clientX - rect.left : e.nativeEvent.offsetX,
      y: rect ? e.clientY - rect.top : e.nativeEvent.offsetY,
      name: r.name,
      value: r.value,
    });
  }

  function onMove(e: PointerEvent<SVGPathElement>) {
    setHover((prev) => {
      if (!prev) return prev;
      const svg = (e.currentTarget as SVGElement).ownerSVGElement;
      const rect = svg?.getBoundingClientRect();
      if (!rect) return prev;
      return { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
  }

  function fmt(v: number | undefined) {
    if (v == null || !Number.isFinite(v)) return '—';
    return `${v}${unit ?? ''}`;
  }

  const legendStops = useMemo(() => {
    const steps = 12;
    const [min, max] = domain;
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      return { offset: `${(t * 100).toFixed(2)}%`, color: scaleFn(min + (max - min) * t, [min, max]) };
    });
  }, [scaleFn, domain]);

  return (
    <div className={`cf-choroplethmap ${insideTile ? 'cf-choroplethmap--layer' : 'cf-choroplethmap--standalone'}`}>
      <svg
        className="cf-choroplethmap__svg"
        viewBox={`0 0 ${w} ${h}`}
        width={insideTile ? undefined : w}
        height={insideTile ? undefined : h}
        role="img"
        aria-label="分级填色地图"
        onPointerLeave={() => setHover(null)}
      >
        {regions.map((r) => (
          <path
            key={r.id}
            className="cf-choroplethmap__region"
            d={r.d}
            fill={r.fill}
            data-name={r.name}
            onPointerEnter={(e) => onEnter(e, r)}
            onPointerMove={onMove}
          />
        ))}
      </svg>
      {tooltip && hover && (
        <div
          className="cf-choroplethmap__tooltip"
          style={{ left: hover.x + 'px', top: hover.y + 'px' }}
          role="tooltip"
        >
          <span className="cf-choroplethmap__tooltip-name">{hover.name}</span>
          <span className="cf-choroplethmap__tooltip-value">{fmt(hover.value)}</span>
        </div>
      )}
      {legend && (
        <div className="cf-choroplethmap__legend">
          <span className="cf-choroplethmap__legend-min">{fmt(domain[0])}</span>
          <span className="cf-choroplethmap__legend-bar" aria-hidden="true">
            {legendStops.map((s, i) => (
              <span
                key={i}
                className="cf-choroplethmap__legend-stop"
                style={{ background: s.color }}
              />
            ))}
          </span>
          <span className="cf-choroplethmap__legend-max">{fmt(domain[1])}</span>
        </div>
      )}
    </div>
  );
}
