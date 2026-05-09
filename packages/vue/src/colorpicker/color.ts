/* Color math helpers shared by Vue + React ColorPicker. */

export interface RGB { r: number; g: number; b: number }
export interface HSV { h: number; s: number; v: number }
export interface HSL { h: number; s: number; l: number }
export interface RGBA extends RGB { a: number }

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function rgbToHex({ r, g, b }: RGB, a = 1): string {
  const hex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  if (a < 1) {
    const ah = Math.round(clamp(a, 0, 1) * 255).toString(16).padStart(2, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}${ah}`;
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function hexToRgb(hex: string): RGBA | null {
  const v = hex.replace('#', '').trim();
  if (![3, 4, 6, 8].includes(v.length)) return null;
  if (!/^[0-9a-fA-F]+$/.test(v)) return null;
  const exp = v.length <= 4
    ? v.split('').map((c) => c + c).join('')
    : v;
  const r = parseInt(exp.slice(0, 2), 16);
  const g = parseInt(exp.slice(2, 4), 16);
  const b = parseInt(exp.slice(4, 6), 16);
  const a = exp.length === 8 ? parseInt(exp.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h = (h * 60 + 360) % 360;
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const hh = (h % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = v - c;
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0));
    else if (max === gn) h = ((bn - rn) / d + 2);
    else h = ((rn - gn) / d + 4);
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hh = (h % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

export function parseColor(input: string): RGBA | null {
  const v = input.trim();
  if (!v) return null;
  if (v.startsWith('#')) return hexToRgb(v);
  const rgb = v.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/i);
  if (rgb) {
    return {
      r: clamp(+rgb[1], 0, 255),
      g: clamp(+rgb[2], 0, 255),
      b: clamp(+rgb[3], 0, 255),
      a: rgb[4] != null ? clamp(+rgb[4], 0, 1) : 1,
    };
  }
  const hsl = v.match(/^hsla?\(\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)%\s*,?\s*(\d+(?:\.\d+)?)%\s*(?:[,/]\s*(\d+(?:\.\d+)?)\s*)?\)$/i);
  if (hsl) {
    const rgbObj = hslToRgb({ h: +hsl[1], s: +hsl[2], l: +hsl[3] });
    return { ...rgbObj, a: hsl[4] != null ? clamp(+hsl[4], 0, 1) : 1 };
  }
  return null;
}

export function formatColor(rgba: RGBA, format: ColorFormat): string {
  const { r, g, b, a } = rgba;
  if (format === 'hex') return rgbToHex({ r, g, b }, a);
  if (format === 'rgb') {
    const rn = Math.round(r), gn = Math.round(g), bn = Math.round(b);
    if (a < 1) return `rgba(${rn}, ${gn}, ${bn}, ${+a.toFixed(2)})`;
    return `rgb(${rn}, ${gn}, ${bn})`;
  }
  const { h, s, l } = rgbToHsl({ r, g, b });
  const hr = Math.round(h), sr = Math.round(s), lr = Math.round(l);
  if (a < 1) return `hsla(${hr}, ${sr}%, ${lr}%, ${+a.toFixed(2)})`;
  return `hsl(${hr}, ${sr}%, ${lr}%)`;
}
