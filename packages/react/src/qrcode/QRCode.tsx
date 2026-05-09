import { useMemo } from 'react';
import { buildQrSvg, qrcodeClass, type QRCodeProps } from './variants';

export function QRCode({
  value,
  ecc = 'M',
  size = 160,
  margin = 2,
  color = 'currentColor',
  background = 'transparent',
  className,
}: QRCodeProps) {
  const cls = qrcodeClass({ className });
  const svg = useMemo(
    () => buildQrSvg({ value, ecc, size, margin, color, background }),
    [value, ecc, size, margin, color, background],
  );
  return (
    <span className={cls} style={{ width: size, height: size }}>
      <svg
        viewBox={svg.viewBox}
        shapeRendering="crispEdges"
        role="img"
        aria-label={value}
      >
        <rect width="100%" height="100%" fill={background} />
        <path d={svg.path} fill={color} />
      </svg>
    </span>
  );
}
