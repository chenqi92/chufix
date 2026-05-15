import { useMemo, type CSSProperties } from 'react';
import { type PresenceUser, colorForUser, initials } from './variants';

export interface PresenceAvatarsProps {
  users: PresenceUser[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showSelfFirst?: boolean;
  className?: string;
}

export function PresenceAvatars({
  users,
  max = 5,
  size = 'md',
  showSelfFirst = true,
  className,
}: PresenceAvatarsProps) {
  const ordered = useMemo(
    () =>
      showSelfFirst
        ? [...users].sort((a, b) => Number(!!b.self) - Number(!!a.self))
        : users,
    [users, showSelfFirst],
  );
  const visible = ordered.slice(0, max);
  const overflow = Math.max(0, ordered.length - max);

  return (
    <div className={['cf-presence', `cf-presence--${size}`, className].filter(Boolean).join(' ')}>
      {visible.map((u) => {
        const style: CSSProperties = {
          ['--cf-presence-color' as string]: colorForUser(u),
        };
        return (
          <div
            key={u.id}
            className={['cf-presence__avatar', u.self && 'is-self', u.away && 'is-away']
              .filter(Boolean)
              .join(' ')}
            title={u.name + (u.self ? ' (你)' : '')}
            style={style}
          >
            {u.avatar ? <img src={u.avatar} alt={u.name} /> : <span>{initials(u.name)}</span>}
          </div>
        );
      })}
      {overflow > 0 && (
        <div className="cf-presence__overflow" title={`还有 ${overflow} 人`}>+{overflow}</div>
      )}
    </div>
  );
}
