import { useState } from 'react';
import type { TemplatePaneProps, TemplatePaneTab } from './variants';

interface InternalProps extends TemplatePaneProps {
  defaultTabs: TemplatePaneTab[];
  paneClass: string;
}

export function TemplatePane(props: InternalProps) {
  const {
    value,
    onChange,
    tabs,
    size = 'md',
    slots = {},
    className,
    defaultTabs,
    paneClass,
  } = props;

  const tabList = tabs ?? defaultTabs;
  const [localActive, setLocalActive] = useState<string>(tabList[0].id);
  const activeId = value ?? localActive;

  const setActive = (id: string) => {
    setLocalActive(id);
    onChange?.(id);
  };

  const cls = [
    'cf-tplpane',
    `cf-tplpane--${size}`,
    paneClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="cf-tplpane__bar" role="tablist">
        {tabList.map((t) => (
          <button
            key={t.id}
            type="button"
            className={[
              'cf-tplpane__tab',
              t.id === activeId && 'is-active',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tab"
            aria-selected={t.id === activeId}
            disabled={t.disabled}
            onClick={() => setActive(t.id)}
          >
            <span className="cf-tplpane__label">{t.label}</span>
            {t.badge ? (
              <span className="cf-tplpane__badge">{t.badge}</span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="cf-tplpane__body">
        {tabList.map((t) =>
          t.id === activeId ? (
            <div key={t.id} className="cf-tplpane__panel">
              {slots[`panel-${t.id}`] ?? null}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
