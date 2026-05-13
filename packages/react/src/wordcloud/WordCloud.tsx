import { useMemo, useState } from 'react';
import type {
  WordCloudHoverPayload,
  WordCloudItem,
  WordCloudProps as BaseProps,
} from './variants';

export type WordCloudComponentProps = BaseProps & {
  onHover?: (p: WordCloudHoverPayload | null) => void;
  onSelect?: (p: WordCloudHoverPayload) => void;
};

const DEFAULT_PALETTE = [
  'var(--viz-1, oklch(64% 0.16 263))',
  'var(--viz-2, oklch(70% 0.13 175))',
  'var(--viz-3, oklch(74% 0.16 80))',
  'var(--viz-4, oklch(64% 0.18 30))',
  'var(--viz-5, oklch(68% 0.18 320))',
  'var(--viz-6, oklch(72% 0.14 220))',
  'var(--viz-7, oklch(70% 0.13 140))',
  'var(--viz-8, oklch(68% 0.18 0))',
];

interface Placed {
  index: number;
  item: WordCloudItem;
  x: number;
  y: number;
  rotate: number;
  font: number;
  color: string;
  hw: number;
  hh: number;
}

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 8) / 0x1000000;
  };
}

function estimateBox(text: string, font: number, rotate: number) {
  const w = Math.max(font, text.length * font * 0.55) + 6;
  const h = font + 6;
  if (rotate === 90 || rotate === -90) return { hw: h / 2, hh: w / 2 };
  return { hw: w / 2, hh: h / 2 };
}

function intersects(a: Placed, b: Placed): boolean {
  return !(
    a.x + a.hw < b.x - b.hw ||
    a.x - a.hw > b.x + b.hw ||
    a.y + a.hh < b.y - b.hh ||
    a.y - a.hh > b.y + b.hh
  );
}

export function WordCloud(props: WordCloudComponentProps) {
  const {
    items,
    width = 480,
    height = 280,
    minFont = 12,
    maxFont = 48,
    rotateRatio = 0.3,
    spiralStep = 4,
    palette = DEFAULT_PALETTE,
    seed = 1,
    ariaLabel,
    size = 'md',
    onHover,
    onSelect,
  } = props;

  const placed = useMemo<Placed[]>(() => {
    const rng = makeRng(seed);
    const sorted = [...items].sort((a, b) => b.weight - a.weight);
    const wMin = Math.min(...sorted.map((i) => i.weight));
    const wMax = Math.max(...sorted.map((i) => i.weight));
    const span = wMax - wMin || 1;
    const out: Placed[] = [];
    const cx = width / 2;
    const cy = height / 2;

    sorted.forEach((item, i) => {
      const t = (item.weight - wMin) / span;
      const font = minFont + t * (maxFont - minFont);
      const rotate = item.rotate ?? (rng() < rotateRatio ? 90 : 0);
      const color = item.color ?? palette[i % palette.length];
      const { hw, hh } = estimateBox(item.text, font, rotate);
      let angle = rng() * Math.PI * 2;
      let radius = 0;
      const step = spiralStep;
      const maxAttempts = 800;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const cand: Placed = { index: i, item, x, y, rotate, font, color, hw, hh };
        const clipped = x - hw < 4 || x + hw > width - 4 || y - hh < 4 || y + hh > height - 4;
        if (!clipped && !out.some((p) => intersects(cand, p))) {
          out.push(cand);
          return;
        }
        angle += 0.35;
        radius += step * 0.05;
      }
    });
    return out;
  }, [items, seed, width, height, minFont, maxFont, rotateRatio, spiralStep, palette]);

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <figure className={`cf-wordcloud cf-wordcloud--${size}`}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-label={ariaLabel ?? '词云'} role="img">
        <g className="cf-wordcloud__words">
          {placed.map((p) => (
            <text
              key={p.index}
              x={p.x}
              y={p.y}
              fontSize={p.font}
              fill={p.color}
              opacity={hovered === null || hovered === p.index ? 1 : 0.35}
              transform={p.rotate ? `rotate(${p.rotate} ${p.x} ${p.y})` : undefined}
              textAnchor="middle"
              dominantBaseline="middle"
              className="cf-wordcloud__word"
              tabIndex={0}
              aria-label={`${p.item.text}: ${p.item.weight}`}
              onMouseEnter={() => {
                setHovered(p.index);
                onHover?.({ index: p.index, item: p.item });
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.({ index: p.index, item: p.item })}
            >
              {p.item.text}
            </text>
          ))}
        </g>
      </svg>
    </figure>
  );
}
