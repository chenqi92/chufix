import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import {
  clampLat,
  clampZoom,
  lngLatToTile,
  makeProjection,
  makeUnproject,
  tilesForViewport,
  tileScreenRect,
  TILE_SIZE,
} from './mercator';
import {
  fillTileUrl,
  MapTileCtx,
  OSM_TILES,
  type LngLat,
  type MapTileProps,
  type Viewport,
} from './variants';

export interface MapTileHandle {
  panTo(c: LngLat): void;
  zoomTo(z: number): void;
  getViewport(): Viewport;
}

export const MapTile = forwardRef<MapTileHandle, MapTileProps>(function MapTile(props, ref) {
  const {
    center: centerProp,
    zoom: zoomProp = 2,
    minZoom = 0,
    maxZoom = 19,
    tileSource = OSM_TILES,
    width = 480,
    height = 320,
    showZoomControl = true,
    showAttribution = true,
    staticView = false,
    onCenterChange,
    onZoomChange,
    onMove,
    children,
  } = props;

  const effectiveMax = Math.min(maxZoom, tileSource.maxZoom ?? maxZoom);

  const [center, setCenter] = useState<LngLat>({
    lng: centerProp?.lng ?? 0,
    lat: clampLat(centerProp?.lat ?? 20),
  });
  const [zoom, setZoom] = useState(() => clampZoom(zoomProp, minZoom, effectiveMax));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; startCenter: LngLat } | null>(null);

  const viewport = useMemo<Viewport>(
    () => ({ center, zoom, width, height }),
    [center, zoom, width, height],
  );

  const tiles = useMemo(() => tilesForViewport(viewport, 1), [viewport]);
  const tileRects = useMemo(
    () =>
      tiles.map((t) => {
        const rect = tileScreenRect(viewport, t);
        return {
          key: `${t.z}/${t.x}/${t.y}`,
          url: fillTileUrl(tileSource.url, t.z, t.x, t.y, tileSource.subdomains),
          x: rect.x,
          y: rect.y,
          size: rect.size,
        };
      }),
    [tiles, viewport, tileSource],
  );

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (staticView) return;
      if (e.button !== 0) return;
      containerRef.current?.setPointerCapture(e.pointerId);
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startCenter: { ...center },
      };
    },
    [center, staticView],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const startTile = lngLatToTile(d.startCenter.lng, d.startCenter.lat, zoom);
      const newTileX = startTile.x - dx / TILE_SIZE;
      const newTileY = startTile.y - dy / TILE_SIZE;
      const n = Math.pow(2, zoom);
      const lng = ((newTileX / n) * 360 - 180 + 540) % 360 - 180;
      const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * newTileY) / n)));
      const lat = clampLat((latRad * 180) / Math.PI);
      const next = { lng, lat };
      setCenter(next);
      onCenterChange?.(next);
      onMove?.({ center: next, zoom });
    },
    [zoom, onCenterChange, onMove],
  );

  const onPointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.pointerId === e.pointerId) {
      try {
        containerRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragRef.current = null;
    }
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (staticView) return;
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ll = makeUnproject(viewport)(x, y);
      const dz = -Math.sign(e.deltaY) * 0.5;
      const newZoom = clampZoom(zoom + dz, minZoom, effectiveMax);
      if (newZoom === zoom) return;
      const newViewport = { ...viewport, zoom: newZoom };
      const after = makeProjection(newViewport)(ll.lng, ll.lat);
      const offX = after.x - x;
      const offY = after.y - y;
      const newCenter = makeUnproject(newViewport)(width / 2 + offX, height / 2 + offY);
      const clampedCenter = { lng: newCenter.lng, lat: clampLat(newCenter.lat) };
      setZoom(newZoom);
      setCenter(clampedCenter);
      onZoomChange?.(newZoom);
      onCenterChange?.(clampedCenter);
      onMove?.({ center: clampedCenter, zoom: newZoom });
    },
    [viewport, zoom, minZoom, effectiveMax, width, height, staticView, onZoomChange, onCenterChange, onMove],
  );

  function zoomBy(delta: number) {
    const newZoom = clampZoom(zoom + delta, minZoom, effectiveMax);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
    onMove?.({ center, zoom: newZoom });
  }

  useImperativeHandle(
    ref,
    () => ({
      panTo(c: LngLat) {
        const next = { lng: c.lng, lat: clampLat(c.lat) };
        setCenter(next);
        onCenterChange?.(next);
      },
      zoomTo(z: number) {
        const nz = clampZoom(z, minZoom, effectiveMax);
        setZoom(nz);
        onZoomChange?.(nz);
      },
      getViewport() {
        return viewport;
      },
    }),
    [viewport, minZoom, effectiveMax, onCenterChange, onZoomChange],
  );

  const ctxValue = useMemo(
    () => ({
      viewport,
      project: makeProjection(viewport),
      unproject: makeUnproject(viewport),
    }),
    [viewport],
  );

  return (
    <MapTileCtx.Provider value={ctxValue}>
      <div
        ref={containerRef}
        className={`cf-maptile${staticView ? ' is-static' : ''}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        role="region"
        aria-label="交互地图"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="cf-maptile__tiles">
          {tileRects.map((t) => (
            <img
              key={t.key}
              className="cf-maptile__tile"
              src={t.url}
              style={{ left: `${t.x}px`, top: `${t.y}px`, width: `${t.size}px`, height: `${t.size}px` }}
              draggable={false}
              alt=""
            />
          ))}
        </div>
        <div className="cf-maptile__overlay">{children}</div>
        {showZoomControl && !staticView && (
          <div className="cf-maptile__zoom" role="group" aria-label="缩放控件">
            <button type="button" className="cf-maptile__zoom-btn" aria-label="放大" onClick={() => zoomBy(1)}>+</button>
            <button type="button" className="cf-maptile__zoom-btn" aria-label="缩小" onClick={() => zoomBy(-1)}>−</button>
          </div>
        )}
        {showAttribution && tileSource.attribution && (
          <div
            className="cf-maptile__attribution"
            dangerouslySetInnerHTML={{ __html: tileSource.attribution }}
          />
        )}
      </div>
    </MapTileCtx.Provider>
  );
});
