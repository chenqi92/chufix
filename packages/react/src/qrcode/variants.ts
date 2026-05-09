import { encodeQr, type QrEcc } from './qr';

export type { QrEcc };

export interface QRCodeProps {
  value: string;
  ecc?: QrEcc;
  size?: number;
  margin?: number;
  color?: string;
  background?: string;
  className?: string;
}

export function qrcodeClass(p: { className?: string }): string {
  return ['cf-qrcode', p.className].filter(Boolean).join(' ');
}

export function buildQrSvg(p: {
  value: string;
  ecc: QrEcc;
  size: number;
  margin: number;
  color: string;
  background: string;
}): { viewBox: string; path: string; size: number; margin: number } {
  const { modules, size: cells } = encodeQr(p.value, p.ecc);
  const total = cells + p.margin * 2;
  let path = '';
  for (let y = 0; y < cells; y++) {
    let x = 0;
    while (x < cells) {
      if (!modules[y][x]) { x++; continue; }
      let runEnd = x;
      while (runEnd < cells && modules[y][runEnd]) runEnd++;
      path += `M${x + p.margin} ${y + p.margin}h${runEnd - x}v1h-${runEnd - x}z`;
      x = runEnd;
    }
  }
  return { viewBox: `0 0 ${total} ${total}`, path, size: cells, margin: p.margin };
}
