export interface WatermarkProps {
  content?: string | string[];
  fontSize?: number;
  color?: string;
  rotate?: number;
  gap?: [number, number];
  zIndex?: number;
  className?: string;
}

export function watermarkClass(p: { className?: string }): string {
  return ['cf-watermark', p.className].filter(Boolean).join(' ');
}

export function buildWatermarkSvg(p: {
  content: string[];
  fontSize: number;
  color: string;
  rotate: number;
  gap: [number, number];
}): string {
  const lines = p.content;
  const lineHeight = p.fontSize * 1.4;
  const blockWidth = p.gap[0];
  const blockHeight = p.gap[1] + lineHeight * lines.length;
  const cx = blockWidth / 2;
  const cy = blockHeight / 2;
  const tspans = lines
    .map(
      (text, i) =>
        `<tspan x="${cx}" dy="${i === 0 ? 0 : lineHeight}">${escape(text)}</tspan>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${blockWidth}" height="${blockHeight}">
    <text
      x="${cx}"
      y="${cy - ((lines.length - 1) * lineHeight) / 2}"
      fill="${p.color}"
      font-size="${p.fontSize}"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      text-anchor="middle"
      transform="rotate(${p.rotate}, ${cx}, ${cy})"
    >${tspans}</text>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function escape(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] as string));
}
