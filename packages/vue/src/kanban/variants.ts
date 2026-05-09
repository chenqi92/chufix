export type KanbanSize = 'sm' | 'md' | 'lg';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  meta?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
  accent?: string;
}

export interface KanbanProps {
  modelValue?: KanbanColumn[];
  defaultValue?: KanbanColumn[];
  size?: KanbanSize;
  bordered?: boolean;
  draggable?: boolean;
  className?: string;
}

export function kanbanClass(p: {
  size: KanbanSize;
  bordered: boolean;
  className?: string;
}): string {
  return [
    'cf-kanban',
    `cf-kanban--${p.size}`,
    p.bordered && 'is-bordered',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function moveCard(
  cols: KanbanColumn[],
  cardId: string,
  toColId: string,
  toIndex: number,
): KanbanColumn[] {
  let card: KanbanCard | null = null;
  const stripped: KanbanColumn[] = cols.map((c) => {
    const idx = c.cards.findIndex((x) => x.id === cardId);
    if (idx >= 0) {
      card = c.cards[idx];
      return { ...c, cards: c.cards.filter((_, i) => i !== idx) };
    }
    return { ...c, cards: c.cards.slice() };
  });
  if (!card) return cols;
  return stripped.map((c) => {
    if (c.id !== toColId) return c;
    const next = c.cards.slice();
    const at = Math.max(0, Math.min(toIndex, next.length));
    next.splice(at, 0, card!);
    return { ...c, cards: next };
  });
}
