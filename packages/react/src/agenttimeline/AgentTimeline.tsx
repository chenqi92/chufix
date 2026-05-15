import { type AgentEvent, type AgentEventType, formatMs, formatStamp, typeLabel } from './variants';

export interface AgentTimelineProps {
  events: AgentEvent[];
  showTimestamp?: boolean;
  className?: string;
}

function IconFor({ type }: { type: AgentEventType }) {
  switch (type) {
    case 'thought':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <path
            d="M5 11h6M4 8q-1-3 2-5t6 1 0 5q-1 1-2 2v1h-4v-1q-1-1-2-3z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'tool':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <path
            d="M4 13l5-5 1 1-5 5zM10 3l3 3-2 2-3-3z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'action':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <path
            d="M3 8h10m-3-3l3 3-3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'observation':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <circle cx={8} cy={8} r={3} fill="none" stroke="currentColor" strokeWidth={1.3} />
          <path
            d="M2 8q3-5 6-5t6 5q-3 5-6 5t-6-5z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
          />
        </svg>
      );
    case 'message':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <path
            d="M2 4h12v7h-4l-2 2-2-2H2z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 16 16" width={14} height={14}>
          <circle cx={8} cy={8} r={6} fill="none" stroke="currentColor" strokeWidth={1.3} />
          <path d="M8 5v4m0 2v.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      );
  }
}

export function AgentTimeline({
  events,
  showTimestamp = true,
  className,
}: AgentTimelineProps) {
  return (
    <ol className={['cf-agentt', className].filter(Boolean).join(' ')}>
      {events.map((ev) => (
        <li key={ev.id} className={['cf-agentt__item', `cf-agentt__item--${ev.type}`].join(' ')}>
          <div className="cf-agentt__bullet">
            <IconFor type={ev.type} />
          </div>
          <div className="cf-agentt__body">
            <div className="cf-agentt__header">
              <span className="cf-agentt__type">{typeLabel(ev.type)}</span>
              {ev.title && <strong>{ev.title}</strong>}
              {ev.duration !== undefined && (
                <span className="cf-agentt__duration">{formatMs(ev.duration)}</span>
              )}
              {showTimestamp && ev.timestamp !== undefined && (
                <span className="cf-agentt__stamp">{formatStamp(ev.timestamp)}</span>
              )}
            </div>
            {ev.content && <pre className="cf-agentt__content">{ev.content}</pre>}
            {ev.meta && (
              <dl className="cf-agentt__meta">
                {Object.entries(ev.meta).map(([k, v]) => (
                  <Row key={k} k={k} v={v} />
                ))}
              </dl>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </>
  );
}
