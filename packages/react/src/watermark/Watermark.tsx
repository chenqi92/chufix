import { buildWatermarkSvg, watermarkClass, type WatermarkProps } from './variants';

export function Watermark(props: WatermarkProps) {
  const {
    content = 'ChuFix',
    fontSize = 14,
    color = 'oklch(60% 0.01 264 / 0.18)',
    rotate = -22,
    gap = [160, 80],
    zIndex = 9,
    className,
    children,
  } = props;

  const lines = Array.isArray(content) ? content : [content];
  const bg = buildWatermarkSvg({ content: lines, fontSize, color, rotate, gap });

  return (
    <div className={watermarkClass({ className })}>
      {children}
      <div
        className="cf-watermark__overlay"
        style={{ backgroundImage: bg, zIndex }}
        aria-hidden
      />
    </div>
  );
}
