import { useContext, useEffect, useMemo, useRef } from 'react';
import { projectAndWeight, renderHeat } from './renderer';
import type { HeatMapProps } from './variants';
import { MapTileCtx } from '../maptile/variants';
import {
  computeExtent,
  polygonToFitPath,
  projectFit,
} from '../choroplethmap/variants';
import type { GeoJsonFeature } from '../mapminimap/variants';

export function HeatMap(props: HeatMapProps) {
  const {
    data,
    geojson,
    extent,
    projection,
    width = 480,
    height = 280,
    radius = 32,
    maxIntensity,
    gradient,
    opacity = 0.7,
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const c = canvas.getContext('2d');
      c?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const projected = projectAndWeight(data, projectFn, w, h);
    renderHeat(canvas, projected, { radius, maxIntensity, gradient, opacity });
  }, [data, projectFn, w, h, radius, maxIntensity, gradient, opacity]);

  const containerClass = `cf-heatmap ${insideTile ? 'cf-heatmap--layer' : 'cf-heatmap--standalone'}`;

  return (
    <div
      className={containerClass}
      style={insideTile ? undefined : { width: `${w}px`, height: `${h}px` }}
    >
      {basePaths.length > 0 && (
        <svg className="cf-heatmap__base" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
          {basePaths.map((bp) => (
            <path key={bp.id} className="cf-heatmap__land" d={bp.d} />
          ))}
        </svg>
      )}
      <canvas ref={canvasRef} className="cf-heatmap__canvas" />
    </div>
  );
}
