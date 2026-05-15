import type { CSSProperties } from 'react';
import { type RemoteCursorItem, colorForCursor } from './variants';

export interface RemoteCursorProps {
  cursors: RemoteCursorItem[];
  positioning?: 'fixed' | 'absolute';
  className?: string;
}

export function RemoteCursor({
  cursors,
  positioning = 'absolute',
  className,
}: RemoteCursorProps) {
  return (
    <div
      className={['cf-rcursor', `cf-rcursor--${positioning}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {cursors.map((c) => {
        const style: CSSProperties = {
          left: `${c.x}px`,
          top: `${c.y}px`,
          ['--cf-rcursor-color' as string]: colorForCursor(c),
        };
        return (
          <div key={c.id} className="cf-rcursor__item" style={style}>
            <svg viewBox="0 0 24 24" width={20} height={20} className="cf-rcursor__pointer">
              <path
                d="M5 3l14 8-6 1.5L9 21z"
                fill="currentColor"
                stroke="white"
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </svg>
            {c.name && <span className="cf-rcursor__label">{c.name}</span>}
          </div>
        );
      })}
    </div>
  );
}
