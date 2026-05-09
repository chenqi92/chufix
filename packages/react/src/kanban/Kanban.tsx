import { useRef, useState, type DragEvent } from 'react';
import {
  kanbanClass,
  moveCard,
  type KanbanColumn,
  type KanbanProps,
} from './variants';

export function Kanban(props: KanbanProps) {
  const {
    value,
    defaultValue = [],
    size = 'md',
    bordered = true,
    draggable = true,
    className,
    onChange,
    onCardMove,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<KanbanColumn[]>(defaultValue);
  const cols = isControlled ? (value as KanbanColumn[]) : internal;

  const dragId = useRef<string | null>(null);
  const dragFrom = useRef<string | null>(null);

  const cls = kanbanClass({ size, bordered, className });

  function commit(next: KanbanColumn[]) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function onDragStart(e: DragEvent<HTMLDivElement>, cardId: string, fromColId: string) {
    if (!draggable) return;
    dragId.current = cardId;
    dragFrom.current = fromColId;
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    if (!draggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function finishDrop(toColId: string, toIndex: number) {
    const cardId = dragId.current;
    const from = dragFrom.current;
    if (!cardId || !from) return;
    const next = moveCard(cols, cardId, toColId, toIndex);
    commit(next);
    onCardMove?.({ cardId, from, to: toColId, toIndex });
    dragId.current = null;
    dragFrom.current = null;
  }

  function dropOnCard(e: DragEvent<HTMLDivElement>, toColId: string, toIndex: number) {
    if (!draggable || !dragId.current) return;
    e.preventDefault();
    finishDrop(toColId, toIndex);
  }

  function dropOnColumn(e: DragEvent<HTMLDivElement>, toColId: string) {
    if (!draggable || !dragId.current) return;
    e.preventDefault();
    const col = cols.find((c) => c.id === toColId);
    finishDrop(toColId, col?.cards.length ?? 0);
  }

  return (
    <div className={cls}>
      {cols.map((col) => (
        <div
          key={col.id}
          className="cf-kanban__col"
          onDragOver={onDragOver}
          onDrop={(e) => dropOnColumn(e, col.id)}
        >
          <div className="cf-kanban__col-head">
            <span
              className="cf-kanban__col-title"
              style={col.accent ? { color: col.accent } : undefined}
            >
              {col.title}
            </span>
            <span className="cf-kanban__col-count">
              {col.cards.length}
              {col.limit ? ` / ${col.limit}` : ''}
            </span>
          </div>
          <div className="cf-kanban__col-body">
            {col.cards.map((card, idx) => (
              <div
                key={card.id}
                className="cf-kanban__card"
                draggable={draggable}
                onDragStart={(e) => onDragStart(e, card.id, col.id)}
                onDragOver={onDragOver}
                onDrop={(e) => dropOnCard(e, col.id, idx)}
              >
                <div className="cf-kanban__card-title">{card.title}</div>
                {card.description ? (
                  <div className="cf-kanban__card-desc">{card.description}</div>
                ) : null}
                {card.tag || card.meta ? (
                  <div className="cf-kanban__card-foot">
                    {card.tag ? <span className="cf-kanban__card-tag">{card.tag}</span> : null}
                    {card.meta ? <span className="cf-kanban__card-meta">{card.meta}</span> : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
