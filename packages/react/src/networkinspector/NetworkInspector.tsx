import { useMemo, useState, type CSSProperties } from 'react';
import {
  type NetworkRequest,
  formatBytes,
  formatDuration,
  normalizeHeaders,
  statusTone,
} from './variants';

export interface NetworkInspectorProps {
  requests: NetworkRequest[];
  height?: number | string;
  initialSelectedId?: string;
  className?: string;
  onSelect?: (request: NetworkRequest | null) => void;
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url, 'http://x.local');
    return u.pathname + (u.search ?? '');
  } catch {
    return url;
  }
}

export function NetworkInspector({
  requests,
  height = 400,
  initialSelectedId,
  className,
  onSelect,
}: NetworkInspectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);

  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId],
  );
  const reqHeaders = useMemo(() => normalizeHeaders(selected?.requestHeaders), [selected]);
  const resHeaders = useMemo(() => normalizeHeaders(selected?.responseHeaders), [selected]);

  function toggle(id: string) {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    onSelect?.(next ? requests.find((r) => r.id === next) ?? null : null);
  }

  const style: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={['cf-net', className].filter(Boolean).join(' ')} style={style}>
      <div className="cf-net__list">
        <div className="cf-net__head">
          <div className="cf-net__cell cf-net__cell--method">方法</div>
          <div className="cf-net__cell cf-net__cell--url">URL</div>
          <div className="cf-net__cell cf-net__cell--status">状态</div>
          <div className="cf-net__cell cf-net__cell--type">类型</div>
          <div className="cf-net__cell cf-net__cell--size">大小</div>
          <div className="cf-net__cell cf-net__cell--time">耗时</div>
        </div>
        <div className="cf-net__body">
          {requests.map((r) => (
            <div
              key={r.id}
              className={['cf-net__row', selectedId === r.id && 'is-selected'].filter(Boolean).join(' ')}
              onClick={() => toggle(r.id)}
            >
              <div className="cf-net__cell cf-net__cell--method">
                <span className="cf-net__method" data-method={r.method}>{r.method}</span>
              </div>
              <div className="cf-net__cell cf-net__cell--url" title={r.url}>{shortUrl(r.url)}</div>
              <div className="cf-net__cell cf-net__cell--status">
                <span className="cf-net__status" data-tone={statusTone(r.status)}>
                  {r.error ? 'ERR' : r.status ?? '—'}
                </span>
              </div>
              <div className="cf-net__cell cf-net__cell--type">{r.type ?? '—'}</div>
              <div className="cf-net__cell cf-net__cell--size">{formatBytes(r.size)}</div>
              <div className="cf-net__cell cf-net__cell--time">{formatDuration(r.duration)}</div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div className="cf-net__detail">
          <header>
            <strong>{selected.method}</strong>
            <code>{selected.url}</code>
            <button
              type="button"
              className="cf-net__close"
              onClick={() => toggle(selected.id)}
              aria-label="close"
            >×</button>
          </header>
          <section>
            <h4>Request Headers</h4>
            {reqHeaders.length ? (
              <table>
                <tbody>
                  {reqHeaders.map((h) => (
                    <tr key={h.name}>
                      <td>{h.name}</td>
                      <td>{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>—</p>
            )}
          </section>
          {selected.requestBody && (
            <section>
              <h4>Request Body</h4>
              <pre>{selected.requestBody}</pre>
            </section>
          )}
          <section>
            <h4>Response Headers</h4>
            {resHeaders.length ? (
              <table>
                <tbody>
                  {resHeaders.map((h) => (
                    <tr key={h.name}>
                      <td>{h.name}</td>
                      <td>{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>—</p>
            )}
          </section>
          {selected.responseBody && (
            <section>
              <h4>Response Body</h4>
              <pre>{selected.responseBody}</pre>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
