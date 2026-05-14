export type MapScalePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type MapScaleUnit = 'metric' | 'imperial';

export interface MapScaleProps {
  /** Latitude where scale is measured. Required when not inside a CfMapTile. */
  lat?: number;
  /** Current map zoom. Required when not inside a CfMapTile. */
  zoom?: number;
  /** Display unit. Default 'metric'. */
  unit?: MapScaleUnit;
  /** Maximum scale bar width (px). The actual bar is clipped to a nice round distance below this. */
  maxWidth?: number;
  /** Corner placement when used as an overlay. */
  position?: MapScalePosition;
  /** Render inline rather than absolutely positioned. */
  inline?: boolean;
}

/** Pick the largest "nice" number (1/2/5 × 10^n) ≤ value. */
export function niceRound(value: number): number {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const rel = value / pow;
  let nice = 1;
  if (rel >= 5) nice = 5;
  else if (rel >= 2) nice = 2;
  return nice * pow;
}

export interface ScaleBar {
  distance: number; // in chosen unit
  pixels: number;
  label: string;
}

export function computeBar(
  metersPerPx: number,
  maxWidthPx: number,
  unit: MapScaleUnit,
): ScaleBar {
  if (unit === 'imperial') {
    const feetPerMeter = 3.28084;
    const milePerFeet = 1 / 5280;
    const maxMeters = metersPerPx * maxWidthPx;
    const maxFeet = maxMeters * feetPerMeter;
    if (maxFeet < 1000) {
      const feet = niceRound(maxFeet);
      return { distance: feet, pixels: feet / feetPerMeter / metersPerPx, label: `${feet} ft` };
    }
    const maxMiles = maxFeet * milePerFeet;
    const mi = niceRound(maxMiles);
    const px = (mi / milePerFeet) / feetPerMeter / metersPerPx;
    return { distance: mi, pixels: px, label: `${mi} mi` };
  }
  const maxMeters = metersPerPx * maxWidthPx;
  if (maxMeters < 1000) {
    const m = niceRound(maxMeters);
    return { distance: m, pixels: m / metersPerPx, label: `${m} m` };
  }
  const maxKm = maxMeters / 1000;
  const km = niceRound(maxKm);
  return { distance: km, pixels: (km * 1000) / metersPerPx, label: `${km} km` };
}
