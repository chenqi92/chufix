import { useState } from 'react';
import { jsonViewerClass, typeOf, type JsonViewerProps } from './variants';

interface NodeProps {
  data: unknown;
  name?: string;
  depth: number;
  defaultExpandDepth: number;
  showTypes: boolean;
}

function JsonNode({ data, name, depth, defaultExpandDepth, showTypes }: NodeProps) {
  const t = typeOf(data);
  const isContainer = t === 'object' || t === 'array';
  const [open, setOpen] = useState(depth < defaultExpandDepth);

  const entries: Array<[string, unknown]> = isContainer
    ? t === 'array'
      ? (data as unknown[]).map((v, i) => [String(i), v])
      : Object.entries(data as Record<string, unknown>)
    : [];

  const summary = isContainer
    ? t === 'array'
      ? `[${(data as unknown[]).length}]`
      : `{${Object.keys(data as Record<string, unknown>).length}}`
    : '';

  return (
    <div className="cf-json__node">
      <div className="cf-json__line" style={{ paddingInlineStart: `${depth * 16}px` }}>
        {isContainer ? (
          <button
            type="button"
            className={`cf-json__caret${open ? ' is-open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? '折叠' : '展开'}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M5 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <span className="cf-json__caret cf-json__caret--leaf" aria-hidden />
        )}

        {name !== undefined ? <span className="cf-json__key">{name}</span> : null}
        {name !== undefined ? <span className="cf-json__sep">:</span> : null}

        {!isContainer ? (
          <>
            <span className={`cf-json__value cf-json__value--${t}`}>
              {t === 'string'
                ? `"${data as string}"`
                : t === 'null'
                  ? 'null'
                  : t === 'undefined'
                    ? 'undefined'
                    : String(data)}
            </span>
            {showTypes ? <span className="cf-json__type">{t}</span> : null}
          </>
        ) : (
          <>
            <span className="cf-json__bracket">{t === 'array' ? '[' : '{'}</span>
            {!open ? <span className="cf-json__summary">{summary}</span> : null}
            {!open ? (
              <span className="cf-json__bracket">{t === 'array' ? ']' : '}'}</span>
            ) : null}
          </>
        )}
      </div>

      {isContainer && open ? (
        <div className="cf-json__children">
          {entries.map(([key, val]) => (
            <JsonNode
              key={key}
              data={val}
              name={t === 'array' ? undefined : key}
              depth={depth + 1}
              defaultExpandDepth={defaultExpandDepth}
              showTypes={showTypes}
            />
          ))}
          <div
            className="cf-json__line cf-json__line--close"
            style={{ paddingInlineStart: `${depth * 16}px` }}
          >
            <span className="cf-json__caret cf-json__caret--leaf" aria-hidden />
            <span className="cf-json__bracket">{t === 'array' ? ']' : '}'}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function JsonViewer(props: JsonViewerProps) {
  const {
    data,
    defaultExpandDepth = 1,
    size = 'md',
    bordered = true,
    lineNumbers = false,
    showTypes = false,
    className,
  } = props;

  return (
    <div className={jsonViewerClass({ size, bordered, lineNumbers, className })}>
      <JsonNode
        data={data}
        depth={0}
        defaultExpandDepth={defaultExpandDepth}
        showTypes={showTypes}
      />
    </div>
  );
}
