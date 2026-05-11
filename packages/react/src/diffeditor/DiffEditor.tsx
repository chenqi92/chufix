import { Fragment, useMemo } from 'react';
import { diffLines, type DiffEditorProps } from './variants';

export function DiffEditor(props: DiffEditorProps) {
  const {
    left,
    right,
    size = 'md',
    mode = 'split',
    showLineNumbers = true,
    leftLabel = '原文',
    rightLabel = '修改',
    className,
  } = props;

  const rows = useMemo(() => diffLines(left, right), [left, right]);

  const cls = [
    'cf-diff',
    `cf-diff--${size}`,
    `cf-diff--${mode}`,
    showLineNumbers && 'cf-diff--gutter',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="cf-diff__header">
        <span className="cf-diff__label cf-diff__label--left">{leftLabel}</span>
        {mode === 'split' ? (
          <span className="cf-diff__label cf-diff__label--right">
            {rightLabel}
          </span>
        ) : null}
      </div>
      <div className="cf-diff__body">
        {mode === 'split'
          ? rows.map((row, i) => (
              <div key={i} className="cf-diff__row" data-op={row.op}>
                {showLineNumbers ? (
                  <span className="cf-diff__num cf-diff__num--left">
                    {row.leftLine ?? ''}
                  </span>
                ) : null}
                <span
                  className="cf-diff__cell cf-diff__cell--left"
                  data-empty={row.op === 'add' || undefined}
                >
                  {row.op === 'del' ? (
                    <span className="cf-diff__sigil">-</span>
                  ) : row.op === 'eq' ? (
                    <span className="cf-diff__sigil"> </span>
                  ) : null}
                  <span className="cf-diff__text">{row.leftText ?? ''}</span>
                </span>
                {showLineNumbers ? (
                  <span className="cf-diff__num cf-diff__num--right">
                    {row.rightLine ?? ''}
                  </span>
                ) : null}
                <span
                  className="cf-diff__cell cf-diff__cell--right"
                  data-empty={row.op === 'del' || undefined}
                >
                  {row.op === 'add' ? (
                    <span className="cf-diff__sigil">+</span>
                  ) : row.op === 'eq' ? (
                    <span className="cf-diff__sigil"> </span>
                  ) : null}
                  <span className="cf-diff__text">{row.rightText ?? ''}</span>
                </span>
              </div>
            ))
          : rows.map((row, i) => (
              <Fragment key={i}>
                {row.op !== 'add' ? (
                  <div
                    className="cf-diff__line"
                    data-op={row.op === 'eq' ? 'eq' : 'del'}
                  >
                    {showLineNumbers ? (
                      <span className="cf-diff__num">{row.leftLine ?? ''}</span>
                    ) : null}
                    <span className="cf-diff__sigil">
                      {row.op === 'del' ? '-' : ' '}
                    </span>
                    <span className="cf-diff__text">{row.leftText ?? ''}</span>
                  </div>
                ) : null}
                {row.op === 'add' ? (
                  <div className="cf-diff__line" data-op="add">
                    {showLineNumbers ? (
                      <span className="cf-diff__num">{row.rightLine ?? ''}</span>
                    ) : null}
                    <span className="cf-diff__sigil">+</span>
                    <span className="cf-diff__text">{row.rightText ?? ''}</span>
                  </div>
                ) : null}
              </Fragment>
            ))}
      </div>
    </div>
  );
}
