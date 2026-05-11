export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
  placeholder?: string;
  emptyText?: string;
  closeOnSelect?: boolean;
  hideFooter?: boolean;
  container?: HTMLElement | null;
  onSelect?: (id: string, item: CommandPaletteItem) => void;
}

export interface FilteredGroup {
  group: string;
  items: CommandPaletteItem[];
}

export function filterAndGroup(
  items: CommandPaletteItem[],
  query: string,
): FilteredGroup[] {
  const q = query.trim().toLowerCase();
  const filtered = !q
    ? items
    : items.filter((it) => {
        const hay = [
          it.label,
          it.description ?? '',
          ...(it.keywords ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });

  const groupMap = new Map<string, CommandPaletteItem[]>();
  for (const it of filtered) {
    const k = it.group ?? '';
    const arr = groupMap.get(k);
    if (arr) arr.push(it);
    else groupMap.set(k, [it]);
  }
  return Array.from(groupMap.entries()).map(([group, items]) => ({
    group,
    items,
  }));
}

export function flatten(groups: FilteredGroup[]): CommandPaletteItem[] {
  return groups.flatMap((g) => g.items);
}

export function highlight(label: string, query: string) {
  const q = query.trim();
  if (!q) return [{ text: label, match: false }];
  const lower = label.toLowerCase();
  const ql = q.toLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let i = 0;
  while (i < label.length) {
    const idx = lower.indexOf(ql, i);
    if (idx === -1) {
      parts.push({ text: label.slice(i), match: false });
      break;
    }
    if (idx > i) parts.push({ text: label.slice(i, idx), match: false });
    parts.push({ text: label.slice(idx, idx + q.length), match: true });
    i = idx + q.length;
  }
  return parts;
}
