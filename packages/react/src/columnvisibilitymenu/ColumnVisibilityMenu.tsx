import { useRef, useState, type DragEvent } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { moveItem, type ColumnConfig, type ColumnPin, type ColumnVisibilityMenuProps } from './variants';

export function ColumnVisibilityMenu(props: ColumnVisibilityMenuProps) {
  const {
    value,
    onChange,
    showPinning = true,
    showReorder = true,
    triggerLabel = '列设置',
    menuLabel = '列显示与排序',
  } = props;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragIndexRef = useRef(-1);

  useClickOutside(rootRef, () => setOpen(false));

  function toggleVisible(col: ColumnConfig) {
    if (col.locked) return;
    onChange(value.map((c) => (c.key === col.key ? { ...c, visible: !c.visible } : c)));
  }

  function setPin(col: ColumnConfig, pinned: ColumnPin) {
    if (col.locked) return;
    onChange(value.map((c) => (c.key === col.key ? { ...c, pinned } : c)));
  }

  function onDragStart(i: number, e: DragEvent<HTMLLIElement>) {
    dragIndexRef.current = i;
    e.dataTransfer.setData('text/plain', String(i));
  }

  function onDrop(i: number) {
    if (dragIndexRef.current < 0 || dragIndexRef.current === i) return;
    onChange(moveItem(value, dragIndexRef.current, i));
    dragIndexRef.current = -1;
  }

  function move(i: number, delta: number) {
    onChange(moveItem(value, i, i + delta));
  }

  function showAll() {
    onChange(value.map((c) => (c.locked ? c : { ...c, visible: true })));
  }

  return (
    <div ref={rootRef} className={['cf-colmenu', open ? 'is-open' : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="cf-colmenu__trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden>
          <path d="M3 3h4v10H3zM9 3h4v10H9z M3 7h4M9 7h4 M3 11h4M9 11h4" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
        <span>{triggerLabel}</span>
      </button>
      {open && (
        <div className="cf-colmenu__panel" role="menu" aria-label={menuLabel}>
          <div className="cf-colmenu__head">
            <span className="cf-colmenu__title">{menuLabel}</span>
            <button type="button" className="cf-colmenu__action" onClick={showAll}>
              全部显示
            </button>
          </div>
          <ul className="cf-colmenu__list">
            {value.map((col, i) => (
              <li
                key={col.key}
                className={['cf-colmenu__row', col.locked ? 'is-locked' : ''].filter(Boolean).join(' ')}
                draggable={showReorder && !col.locked}
                onDragStart={(e) => onDragStart(i, e)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
              >
                {showReorder && (
                  <span className={['cf-colmenu__handle', col.locked ? 'is-disabled' : ''].filter(Boolean).join(' ')} aria-hidden>
                    <svg viewBox="0 0 16 16" width={12} height={12}>
                      <path d="M5 4h1v1H5zm0 3h1v1H5zm0 3h1v1H5zM10 4h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1z" fill="currentColor" />
                    </svg>
                  </span>
                )}
                <button
                  type="button"
                  className={['cf-colmenu__check', col.visible ? 'is-checked' : ''].filter(Boolean).join(' ')}
                  disabled={col.locked}
                  aria-pressed={col.visible}
                  onClick={() => toggleVisible(col)}
                >
                  {col.visible && (
                    <svg viewBox="0 0 16 16" width={12} height={12}>
                      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="cf-colmenu__label">{col.label}</span>
                {showReorder && (
                  <span className="cf-colmenu__order-arrows">
                    <button
                      type="button"
                      className="cf-colmenu__order-btn"
                      disabled={i === 0 || col.locked}
                      onClick={() => move(i, -1)}
                      aria-label="上移"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="cf-colmenu__order-btn"
                      disabled={i === value.length - 1 || col.locked}
                      onClick={() => move(i, 1)}
                      aria-label="下移"
                    >
                      ↓
                    </button>
                  </span>
                )}
                {showPinning && (
                  <span className="cf-colmenu__pins">
                    <button
                      type="button"
                      className={['cf-colmenu__pin', col.pinned === 'left' ? 'is-active' : ''].filter(Boolean).join(' ')}
                      disabled={col.locked}
                      aria-pressed={col.pinned === 'left'}
                      title="固定到左"
                      onClick={() => setPin(col, col.pinned === 'left' ? null : 'left')}
                    >
                      L
                    </button>
                    <button
                      type="button"
                      className={['cf-colmenu__pin', col.pinned === 'right' ? 'is-active' : ''].filter(Boolean).join(' ')}
                      disabled={col.locked}
                      aria-pressed={col.pinned === 'right'}
                      title="固定到右"
                      onClick={() => setPin(col, col.pinned === 'right' ? null : 'right')}
                    >
                      R
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
