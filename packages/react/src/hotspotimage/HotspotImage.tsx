import { useState } from 'react';
import { type HotspotItem, toneStroke, toneFill } from './variants';

export interface HotspotImageProps {
  src: string;
  alt?: string;
  hotspots: HotspotItem[];
  showOutlines?: boolean;
  className?: string;
  onHotspotClick?: (hotspot: HotspotItem, ev: React.MouseEvent) => void;
  onHotspotHover?: (hotspot: HotspotItem | null) => void;
}

function labelLeft(h: HotspotItem): number {
  if (h.shape === 'rect' && h.rect) return h.rect.x + h.rect.w / 2;
  if (h.shape === 'circle' && h.circle) return h.circle.cx;
  return 0.5;
}
function labelTop(h: HotspotItem): number {
  if (h.shape === 'rect' && h.rect) return h.rect.y;
  if (h.shape === 'circle' && h.circle) return h.circle.cy - h.circle.r;
  return 0;
}

export function HotspotImage({
  src,
  alt = '',
  hotspots,
  showOutlines,
  className,
  onHotspotClick,
  onHotspotHover,
}: HotspotImageProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={['cf-hotspot', className].filter(Boolean).join(' ')}>
      <img src={src} alt={alt} className="cf-hotspot__img" draggable={false} />
      <svg
        className="cf-hotspot__overlay"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {hotspots.map((h) => (
          <g
            key={h.id}
            className={[
              'cf-hotspot__group',
              hovered === h.id && 'is-hovered',
              showOutlines && 'is-outlined',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={(e) => onHotspotClick?.(h, e)}
            onPointerEnter={() => {
              setHovered(h.id);
              onHotspotHover?.(h);
            }}
            onPointerLeave={() => {
              setHovered(null);
              onHotspotHover?.(null);
            }}
          >
            {h.shape === 'rect' && h.rect && (
              <rect
                x={h.rect.x * 100}
                y={h.rect.y * 100}
                width={h.rect.w * 100}
                height={h.rect.h * 100}
                stroke={toneStroke(h.tone)}
                fill={toneFill(h.tone)}
                rx={0.5}
              />
            )}
            {h.shape === 'circle' && h.circle && (
              <circle
                cx={h.circle.cx * 100}
                cy={h.circle.cy * 100}
                r={h.circle.r * 100}
                stroke={toneStroke(h.tone)}
                fill={toneFill(h.tone)}
              />
            )}
          </g>
        ))}
      </svg>
      {hotspots.map(
        (h) =>
          hovered === h.id &&
          h.label && (
            <div
              key={`label-${h.id}`}
              className="cf-hotspot__label"
              style={{
                left: `${labelLeft(h) * 100}%`,
                top: `${labelTop(h) * 100}%`,
              }}
            >
              {h.label}
            </div>
          ),
      )}
    </div>
  );
}
