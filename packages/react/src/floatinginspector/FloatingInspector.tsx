import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { FloatingInspectorProps } from './variants';

export function FloatingInspector(props: FloatingInspectorProps) {
  const {
    open = true,
    onOpenChange,
    collapsed: collapsedProp,
    onCollapsedChange,
    title,
    placement = 'bottom-right',
    width = 320,
    offset = 24,
    closable = true,
    container,
    actions,
    children,
    className,
  } = props;

  const isControlled = typeof collapsedProp === 'boolean';
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = isControlled ? collapsedProp : localCollapsed;

  const setCollapsed = (v: boolean) => {
    if (!isControlled) setLocalCollapsed(v);
    onCollapsedChange?.(v);
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);
  if (!open || !target) return null;

  const cls = [
    'cf-inspector',
    `cf-inspector--${placement}`,
    collapsed && 'is-collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    margin: `${offset}px`,
  };

  return createPortal(
    <aside className={cls} style={style} role="complementary">
      <header className="cf-inspector__header">
        <button
          type="button"
          className="cf-inspector__toggle"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={[
              'cf-inspector__caret',
              !collapsed && 'is-open',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <path
              d="M3 4l3 3 3-3"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="cf-inspector__title">{title}</span>
        </button>
        <span className="cf-inspector__actions">
          {actions}
          {closable ? (
            <button
              type="button"
              className="cf-inspector__close"
              aria-label="关闭"
              onClick={() => onOpenChange?.(false)}
            >
              ×
            </button>
          ) : null}
        </span>
      </header>
      {!collapsed ? (
        <div className="cf-inspector__body">{children}</div>
      ) : null}
    </aside>,
    target,
  );
}
