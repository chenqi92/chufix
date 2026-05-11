import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import {
  clampZoom,
  defaultMapViewport,
  toneClass,
  type MapCoord,
  type MapProps,
  type MapViewport,
} from './variants';

export function Map(props: MapProps) {
  const {
    markers = [],
    overlays = [],
    routes = [],
    height = 360,
    center: centerProp = defaultMapViewport.center,
    zoom: zoomProp = defaultMapViewport.zoom,
    minZoom = 0.7,
    maxZoom = 2.4,
    showGrid = true,
    showLabels = true,
    controls = true,
    activeId,
    ariaLabel = '交互地图',
    className,
    onMarkerClick,
    onMarkerEnter,
    onMarkerLeave,
    onOverlayClick,
    onMapClick,
    onViewportChange,
  } = props;

  const [center, setCenter] = useState<MapCoord>(centerProp);
  const [zoom, setZoomState] = useState(() => clampZoom(zoomProp, minZoom, maxZoom));

  useEffect(() => setCenter(centerProp), [centerProp]);
  useEffect(() => setZoomState(clampZoom(zoomProp, minZoom, maxZoom)), [zoomProp, minZoom, maxZoom]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const transform = useMemo(() => {
    const x = 50 - center.x * zoom;
    const y = 50 - center.y * zoom;
    return `translate(${x} ${y}) scale(${zoom})`;
  }, [center, zoom]);

  const notifyViewport = (next: MapViewport) => onViewportChange?.(next);

  const updateZoom = (next: number) => {
    const clamped = clampZoom(next, minZoom, maxZoom);
    if (clamped === zoom) return;
    setZoomState(clamped);
    notifyViewport({ center, zoom: clamped });
  };

  const resetViewport = () => {
    const nextZoom = clampZoom(zoomProp, minZoom, maxZoom);
    setCenter(centerProp);
    setZoomState(nextZoom);
    notifyViewport({ center: centerProp, zoom: nextZoom });
  };

  const pointList = (points: MapCoord[]) => points.map((p) => `${p.x},${p.y}`).join(' ');
  const overlayPath = (points: MapCoord[]) => {
    if (!points.length) return '';
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')} Z`;
  };

  const toMapPoint = (event: MouseEvent<SVGSVGElement>): MapCoord => {
    const svg = event.currentTarget;
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 50, y: 50 };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    return {
      x: (local.x - (50 - center.x * zoom)) / zoom,
      y: (local.y - (50 - center.y * zoom)) / zoom,
    };
  };

  const activate = (event: KeyboardEvent, handler: (event: KeyboardEvent) => void) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handler(event);
  };

  return (
    <section
      className={['cf-map', className].filter(Boolean).join(' ')}
      style={{ '--cf-map-height': heightStyle } as CSSProperties}
      aria-label={ariaLabel}
    >
      <svg
        className="cf-map__canvas"
        viewBox="0 0 100 100"
        role="img"
        aria-label={ariaLabel}
        onClick={(event) => onMapClick?.({ point: toMapPoint(event), nativeEvent: event })}
      >
        <defs>
          <pattern id="cf-map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" className="cf-map__grid-line" fill="none" />
          </pattern>
        </defs>
        <rect className="cf-map__water" x="0" y="0" width="100" height="100" rx="2" />
        {showGrid ? <rect className="cf-map__grid" x="0" y="0" width="100" height="100" fill="url(#cf-map-grid)" /> : null}

        <g transform={transform}>
          <path className="cf-map__land cf-map__land--primary" d="M10 22 C20 8 41 11 53 18 C68 27 83 21 91 36 C99 51 86 75 67 81 C47 88 24 82 14 67 C4 52 0 34 10 22Z" />
          <path className="cf-map__land cf-map__land--secondary" d="M18 66 C26 56 38 59 45 66 C51 74 62 72 69 78 C58 90 27 88 18 66Z" />

          {overlays.map((overlay) => (
            <path
              key={overlay.id}
              className={[
                'cf-map__overlay',
                toneClass(overlay.tone, 'cf-map__overlay'),
                overlay.interactive && 'is-interactive',
                overlay.id === activeId && 'is-active',
              ].filter(Boolean).join(' ')}
              d={overlayPath(overlay.points)}
              tabIndex={overlay.interactive ? 0 : undefined}
              role={overlay.interactive ? 'button' : 'img'}
              aria-label={overlay.label}
              onClick={(event) => {
                if (!overlay.interactive) return;
                event.stopPropagation();
                onOverlayClick?.({ overlay, nativeEvent: event });
              }}
              onKeyDown={(event) => activate(event, (nativeEvent) => {
                if (!overlay.interactive) return;
                nativeEvent.stopPropagation();
                onOverlayClick?.({ overlay, nativeEvent });
              })}
            />
          ))}

          {routes.map((route) => (
            <polyline
              key={route.id}
              className={[
                'cf-map__route',
                toneClass(route.tone, 'cf-map__route'),
                route.dashed && 'is-dashed',
              ].filter(Boolean).join(' ')}
              points={pointList(route.points)}
              fill="none"
            />
          ))}

          {markers.map((marker) => (
            <g
              key={marker.id}
              className={[
                'cf-map__marker',
                toneClass(marker.tone, 'cf-map__marker'),
                marker.id === activeId && 'is-active',
                marker.disabled && 'is-disabled',
              ].filter(Boolean).join(' ')}
              transform={`translate(${marker.x} ${marker.y})`}
              tabIndex={marker.disabled ? undefined : 0}
              role="button"
              aria-label={marker.label}
              onClick={(event) => {
                if (marker.disabled) return;
                event.stopPropagation();
                onMarkerClick?.({ marker, nativeEvent: event });
              }}
              onMouseEnter={(event) => onMarkerEnter?.({ marker, nativeEvent: event })}
              onMouseLeave={(event) => onMarkerLeave?.({ marker, nativeEvent: event })}
              onKeyDown={(event) => activate(event, (nativeEvent) => {
                if (marker.disabled) return;
                nativeEvent.stopPropagation();
                onMarkerClick?.({ marker, nativeEvent });
              })}
            >
              <circle className="cf-map__marker-halo" r="4.8" />
              <circle className="cf-map__marker-dot" r="2.2" />
              {showLabels ? <text className="cf-map__marker-label" x="0" y="-6">{marker.label}</text> : null}
              {marker.value != null ? <text className="cf-map__marker-value" x="0" y="8">{marker.value}</text> : null}
            </g>
          ))}
        </g>
      </svg>

      {controls ? (
        <div className="cf-map__controls" aria-label="地图缩放">
          <button type="button" className="cf-map__control" aria-label="放大" onClick={() => updateZoom(zoom + 0.2)}>+</button>
          <button type="button" className="cf-map__control" aria-label="缩小" onClick={() => updateZoom(zoom - 0.2)}>−</button>
          <button type="button" className="cf-map__control cf-map__control--reset" aria-label="重置视图" onClick={resetViewport}>Reset</button>
        </div>
      ) : null}
    </section>
  );
}
