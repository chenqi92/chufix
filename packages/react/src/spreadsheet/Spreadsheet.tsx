import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  colLetter,
  normalizeRange,
  rangeToTSV,
  toA1,
  tsvToData,
  type CellPos,
  type CellRange,
  type SpreadsheetProps as BaseProps,
} from './variants';

export type SpreadsheetProps = BaseProps & {
  onChange?: (next: Record<string, string>) => void;
  onCellChange?: (payload: { cell: string; value: string }) => void;
  onSelectionChange?: (range: CellRange) => void;
};

export function Spreadsheet(props: SpreadsheetProps) {
  const {
    rows = 20,
    cols = 10,
    modelValue = {},
    colWidth = 120,
    rowHeight = 28,
    rowHeaderWidth = 44,
    readonly = false,
    disableClipboard = false,
    caption,
    size = 'md',
    onChange,
    onCellChange,
    onSelectionChange,
  } = props;

  const [data, setData] = useState<Record<string, string>>(modelValue);
  const [selection, setSelection] = useState<CellRange>({
    start: { col: 0, row: 0 },
    end: { col: 0, row: 0 },
  });
  const [editing, setEditing] = useState<CellPos | null>(null);
  const [editValue, setEditValue] = useState('');
  const dragSelectingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync external modelValue → internal when ref identity changes
  useEffect(() => {
    setData(modelValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelValue]);

  const cellValue = useCallback(
    (col: number, row: number) => data[toA1(col, row)] ?? '',
    [data],
  );

  const inSelection = useCallback(
    (col: number, row: number) => {
      const r = normalizeRange(selection);
      return col >= r.start.col && col <= r.end.col && row >= r.start.row && row <= r.end.row;
    },
    [selection],
  );

  const isAnchor = (col: number, row: number) =>
    selection.start.col === col && selection.start.row === row;

  const updateSelection = useCallback(
    (start: CellPos, end?: CellPos) => {
      const next = { start, end: end ?? start };
      setSelection(next);
      onSelectionChange?.(next);
    },
    [onSelectionChange],
  );

  const commitData = useCallback(
    (next: Record<string, string>) => {
      setData(next);
      onChange?.(next);
    },
    [onChange],
  );

  const setCell = useCallback(
    (col: number, row: number, value: string) => {
      const next = { ...data };
      const key = toA1(col, row);
      if (value === '') delete next[key];
      else next[key] = value;
      commitData(next);
      onCellChange?.({ cell: key, value });
    },
    [data, commitData, onCellChange],
  );

  const startEdit = useCallback(
    (col: number, row: number, initial?: string) => {
      if (readonly) return;
      setEditing({ col, row });
      setEditValue(initial ?? cellValue(col, row));
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    },
    [readonly, cellValue],
  );

  const commitEdit = useCallback(() => {
    if (!editing) return;
    setCell(editing.col, editing.row, editValue);
    setEditing(null);
  }, [editing, editValue, setCell]);

  const cancelEdit = useCallback(() => setEditing(null), []);

  const moveAnchor = useCallback(
    (dCol: number, dRow: number, extend = false) => {
      const cur = selection.end;
      const col = Math.max(0, Math.min(cols - 1, cur.col + dCol));
      const row = Math.max(0, Math.min(rows - 1, cur.row + dRow));
      if (extend) updateSelection(selection.start, { col, row });
      else updateSelection({ col, row });
    },
    [selection, cols, rows, updateSelection],
  );

  const onCellPointerDown = (e: ReactPointerEvent, col: number, row: number) => {
    if (editing) commitEdit();
    e.preventDefault();
    if (e.shiftKey) updateSelection(selection.start, { col, row });
    else updateSelection({ col, row });
    dragSelectingRef.current = true;
    rootRef.current?.focus();
  };

  const onCellPointerEnter = (col: number, row: number) => {
    if (!dragSelectingRef.current) return;
    updateSelection(selection.start, { col, row });
  };

  useEffect(() => {
    function endDrag() {
      dragSelectingRef.current = false;
    }
    window.addEventListener('pointerup', endDrag);
    return () => window.removeEventListener('pointerup', endDrag);
  }, []);

  const onCellDoubleClick = (col: number, row: number) => startEdit(col, row);

  const clearSelection = useCallback(() => {
    if (readonly) return;
    const r = normalizeRange(selection);
    const next = { ...data };
    for (let row = r.start.row; row <= r.end.row; row++) {
      for (let col = r.start.col; col <= r.end.col; col++) {
        delete next[toA1(col, row)];
      }
    }
    commitData(next);
  }, [readonly, selection, data, commitData]);

  const copySelection = useCallback(async () => {
    if (disableClipboard) return;
    const tsv = rangeToTSV(data, selection);
    try {
      await navigator.clipboard.writeText(tsv);
    } catch {
      /* ignore */
    }
  }, [data, selection, disableClipboard]);

  const onKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit();
        moveAnchor(0, 1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitEdit();
        moveAnchor(e.shiftKey ? -1 : 1, 0);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveAnchor(-1, 0, e.shiftKey);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveAnchor(1, 0, e.shiftKey);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveAnchor(0, -1, e.shiftKey);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveAnchor(0, 1, e.shiftKey);
        break;
      case 'Tab':
        e.preventDefault();
        moveAnchor(e.shiftKey ? -1 : 1, 0);
        break;
      case 'Enter':
      case 'F2':
        e.preventDefault();
        startEdit(selection.end.col, selection.end.row);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        clearSelection();
        break;
      default: {
        const mod = e.metaKey || e.ctrlKey;
        if (mod && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          void copySelection();
          return;
        }
        if (mod && e.key.toLowerCase() === 'x') {
          e.preventDefault();
          void copySelection();
          clearSelection();
          return;
        }
        if (mod && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          updateSelection({ col: 0, row: 0 }, { col: cols - 1, row: rows - 1 });
          return;
        }
        if (mod && e.key.toLowerCase() === 'v') return;
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          startEdit(selection.end.col, selection.end.row, e.key);
        }
      }
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (readonly || disableClipboard || editing) return;
    const tsv = e.clipboardData.getData('text/plain');
    if (!tsv) return;
    e.preventDefault();
    const start = normalizeRange(selection).start;
    const patch = tsvToData(tsv, start, { cols, rows });
    commitData({ ...data, ...patch });
  };

  const totalWidth = rowHeaderWidth + cols * colWidth;
  const anchorLabel = toA1(selection.end.col, selection.end.row);
  const selectionLabel = useMemo(() => {
    const r = normalizeRange(selection);
    if (r.start.col === r.end.col && r.start.row === r.end.row) return toA1(r.start.col, r.start.row);
    return `${toA1(r.start.col, r.start.row)}:${toA1(r.end.col, r.end.row)}`;
  }, [selection]);

  return (
    <div className={`cf-sheet cf-sheet--${size}`}>
      {caption && <p className="cf-sheet__caption">{caption}</p>}
      <div className="cf-sheet__statusbar">
        <span className="cf-sheet__statusbar-name">{anchorLabel}</span>
        <span className="cf-sheet__statusbar-range">{selectionLabel}</span>
      </div>
      <div
        ref={rootRef}
        className="cf-sheet__frame"
        tabIndex={0}
        style={{ width: `${totalWidth}px` }}
        onKeyDown={onKeydown}
        onPaste={onPaste}
      >
        <div className="cf-sheet__col-head" style={{ height: `${rowHeight}px` }}>
          <div className="cf-sheet__corner" style={{ width: `${rowHeaderWidth}px` }} />
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={'cf-sheet__col-cell' + (selection.end.col === c ? ' is-active' : '')}
              style={{ width: `${colWidth}px` }}
            >
              {colLetter(c)}
            </div>
          ))}
        </div>

        <div className="cf-sheet__body" style={{ height: `${rows * rowHeight}px` }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="cf-sheet__row" style={{ height: `${rowHeight}px` }}>
              <div
                className={'cf-sheet__row-head' + (selection.end.row === r ? ' is-active' : '')}
                style={{ width: `${rowHeaderWidth}px` }}
              >
                {r + 1}
              </div>
              {Array.from({ length: cols }).map((_, c) => {
                const isEditing = !!editing && editing.col === c && editing.row === r;
                const cls =
                  'cf-sheet__cell' +
                  (inSelection(c, r) ? ' is-selected' : '') +
                  (isAnchor(c, r) ? ' is-anchor' : '') +
                  (isEditing ? ' is-editing' : '');
                return (
                  <div
                    key={c}
                    className={cls}
                    style={{ width: `${colWidth}px` }}
                    onPointerDown={(e) => onCellPointerDown(e, c, r)}
                    onPointerEnter={() => onCellPointerEnter(c, r)}
                    onDoubleClick={() => onCellDoubleClick(c, r)}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(ev: ChangeEvent<HTMLInputElement>) => setEditValue(ev.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(ev) => {
                          ev.stopPropagation();
                          onKeydown(ev);
                        }}
                        className="cf-sheet__input"
                      />
                    ) : (
                      <span className="cf-sheet__value">{cellValue(c, r)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
