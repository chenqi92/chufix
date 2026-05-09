import { useMemo, useState } from 'react';
import { transferClass, type TransferItem, type TransferProps } from './variants';

function filterByText(items: TransferItem[], q: string) {
  if (!q.trim()) return items;
  const t = q.trim().toLowerCase();
  return items.filter((i) => i.label.toLowerCase().includes(t));
}

export function Transfer({
  dataSource,
  value,
  defaultValue = [],
  titles,
  searchable = false,
  className,
  onChange,
}: TransferProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const targetKeys = isControlled ? (value as string[]) : internal;

  const [leftChecked, setLeftChecked] = useState<Set<string>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<string>>(new Set());
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const leftItems = useMemo(
    () => dataSource.filter((i) => !targetKeys.includes(i.key)),
    [dataSource, targetKeys],
  );
  const rightItems = useMemo(
    () => dataSource.filter((i) => targetKeys.includes(i.key)),
    [dataSource, targetKeys],
  );

  const filteredLeft = useMemo(() => filterByText(leftItems, leftSearch), [leftItems, leftSearch]);
  const filteredRight = useMemo(() => filterByText(rightItems, rightSearch), [rightItems, rightSearch]);

  const [left0, left1] = titles ?? ['可选', '已选'];

  function toggleCheck(side: 'left' | 'right', key: string) {
    const setter = side === 'left' ? setLeftChecked : setRightChecked;
    const cur = side === 'left' ? leftChecked : rightChecked;
    const next = new Set(cur);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  }

  function toggleAll(side: 'left' | 'right') {
    const items = side === 'left' ? filteredLeft : filteredRight;
    const enabled = items.filter((i) => !i.disabled);
    const cur = side === 'left' ? leftChecked : rightChecked;
    const setter = side === 'left' ? setLeftChecked : setRightChecked;
    const allOn = enabled.length > 0 && enabled.every((i) => cur.has(i.key));
    const next = new Set(cur);
    for (const i of enabled) {
      if (allOn) next.delete(i.key);
      else next.add(i.key);
    }
    setter(next);
  }

  function emitChange(keys: string[]) {
    if (!isControlled) setInternal(keys);
    onChange?.(keys);
  }

  function moveToRight() {
    const moving = Array.from(leftChecked).filter((k) =>
      leftItems.some((i) => i.key === k && !i.disabled),
    );
    if (moving.length === 0) return;
    emitChange([...targetKeys, ...moving]);
    setLeftChecked(new Set());
  }

  function moveToLeft() {
    const moving = Array.from(rightChecked).filter((k) =>
      rightItems.some((i) => i.key === k && !i.disabled),
    );
    if (moving.length === 0) return;
    emitChange(targetKeys.filter((k) => !moving.includes(k)));
    setRightChecked(new Set());
  }

  const leftAllOn =
    filteredLeft.filter((i) => !i.disabled).length > 0 &&
    filteredLeft.filter((i) => !i.disabled).every((i) => leftChecked.has(i.key));
  const rightAllOn =
    filteredRight.filter((i) => !i.disabled).length > 0 &&
    filteredRight.filter((i) => !i.disabled).every((i) => rightChecked.has(i.key));

  const cls = transferClass({ className });

  return (
    <div className={cls}>
      <div className="cf-transfer__pane">
        <div className="cf-transfer__head">
          <label className="cf-transfer__select-all">
            <input type="checkbox" checked={leftAllOn} onChange={() => toggleAll('left')} />
            <span className="cf-transfer__title">{left0}</span>
          </label>
          <span className="cf-transfer__count">
            {leftChecked.size} / {filteredLeft.length}
          </span>
        </div>
        {searchable && (
          <input
            type="search"
            className="cf-transfer__search"
            placeholder="搜索"
            value={leftSearch}
            onChange={(e) => setLeftSearch(e.target.value)}
          />
        )}
        <ul className="cf-transfer__list">
          {filteredLeft.map((it) => (
            <li
              key={it.key}
              className={`cf-transfer__item${it.disabled ? ' is-disabled' : ''}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={leftChecked.has(it.key)}
                  disabled={it.disabled}
                  onChange={() => toggleCheck('left', it.key)}
                />
                <span>{it.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="cf-transfer__ops">
        <button
          type="button"
          className="cf-transfer__btn"
          disabled={leftChecked.size === 0}
          aria-label="移到右侧"
          onClick={moveToRight}
        >›</button>
        <button
          type="button"
          className="cf-transfer__btn"
          disabled={rightChecked.size === 0}
          aria-label="移到左侧"
          onClick={moveToLeft}
        >‹</button>
      </div>

      <div className="cf-transfer__pane">
        <div className="cf-transfer__head">
          <label className="cf-transfer__select-all">
            <input type="checkbox" checked={rightAllOn} onChange={() => toggleAll('right')} />
            <span className="cf-transfer__title">{left1}</span>
          </label>
          <span className="cf-transfer__count">
            {rightChecked.size} / {filteredRight.length}
          </span>
        </div>
        {searchable && (
          <input
            type="search"
            className="cf-transfer__search"
            placeholder="搜索"
            value={rightSearch}
            onChange={(e) => setRightSearch(e.target.value)}
          />
        )}
        <ul className="cf-transfer__list">
          {filteredRight.map((it) => (
            <li
              key={it.key}
              className={`cf-transfer__item${it.disabled ? ' is-disabled' : ''}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={rightChecked.has(it.key)}
                  disabled={it.disabled}
                  onChange={() => toggleCheck('right', it.key)}
                />
                <span>{it.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
