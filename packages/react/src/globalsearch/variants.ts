export interface GlobalSearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  badge?: string;
  path?: string;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: GlobalSearchResult[];
  placeholder?: string;
  emptyText?: string;
  showCategories?: boolean;
  closeOnSelect?: boolean;
  container?: HTMLElement | null;
  onSelect?: (id: string, result: GlobalSearchResult) => void;
  className?: string;
}

export interface FilteredCategoryGroup {
  category: string;
  results: GlobalSearchResult[];
}

export function filterResults(
  results: GlobalSearchResult[],
  query: string,
  category: string | null,
): FilteredCategoryGroup[] {
  const q = query.trim().toLowerCase();
  let filtered = results;
  if (category) filtered = filtered.filter((r) => r.category === category);
  if (q) {
    filtered = filtered.filter((r) => {
      const hay = [
        r.title,
        r.description ?? '',
        r.path ?? '',
        ...(r.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
  const map = new Map<string, GlobalSearchResult[]>();
  for (const r of filtered) {
    const arr = map.get(r.category);
    if (arr) arr.push(r);
    else map.set(r.category, [r]);
  }
  return Array.from(map.entries()).map(([category, results]) => ({
    category,
    results,
  }));
}
