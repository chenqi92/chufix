import { useContext, useMemo } from 'react';
import { computeBar, type MapScaleProps } from './variants';
import { MapTileCtx } from '../maptile/variants';
import { metersPerPixel } from '../maptile/mercator';

export function MapScale(props: MapScaleProps) {
  const {
    lat: latProp,
    zoom: zoomProp,
    unit = 'metric',
    maxWidth = 120,
    position = 'bottom-left',
    inline = false,
  } = props;

  const ctx = useContext(MapTileCtx);
  const lat = ctx?.viewport.center.lat ?? latProp ?? 0;
  const zoom = ctx?.viewport.zoom ?? zoomProp ?? 0;

  const bar = useMemo(() => {
    const mpp = metersPerPixel(lat, zoom);
    return computeBar(mpp, maxWidth, unit);
  }, [lat, zoom, maxWidth, unit]);

  const cls = `cf-mapscale ${inline ? 'cf-mapscale--inline' : `cf-mapscale--corner cf-mapscale--${position}`}`;

  return (
    <div className={cls}>
      <div className="cf-mapscale__bar" style={{ width: `${bar.pixels}px` }} />
      <div className="cf-mapscale__label">{bar.label}</div>
    </div>
  );
}
