import { useState } from 'react';
import { type TabsProps, tabsClass } from './variants';

export function Tabs(props: TabsProps) {
  const {
    value,
    defaultValue,
    items = [],
    variant = 'line',
    size = 'md',
    align = 'start',
    onChange,
    children,
  } = props;

  const controlled = value != null;
  const [inner, setInner] = useState<string>(
    defaultValue ?? items[0]?.value ?? ''
  );
  const active = controlled ? (value as string) : inner;

  function pick(v: string, disabled?: boolean) {
    if (disabled) return;
    if (!controlled) setInner(v);
    onChange?.(v);
  }

  return (
    <div className={tabsClass({ variant, size, align })}>
      <div className="ck-tabs__list" role="tablist">
        {items.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            className={[
              'ck-tabs__tab',
              active === t.value ? 'is-active' : '',
              t.disabled ? 'is-disabled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-selected={active === t.value}
            disabled={t.disabled || undefined}
            onClick={() => pick(t.value, t.disabled)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="ck-tabs__panels">
        {typeof children === 'function'
          ? (children as (a: { active: string }) => React.ReactNode)({ active })
          : children}
      </div>
    </div>
  );
}

export function TabPanel({
  value,
  active,
  children,
}: {
  value: string;
  active: string;
  children?: React.ReactNode;
}) {
  if (value !== active) return null;
  return (
    <div className="ck-tabs__panel" role="tabpanel">
      {children}
    </div>
  );
}
