export interface TocItem {
  id: string;
  label: import('react').ReactNode;
  depth?: number;
}

export interface TocProps {
  items: TocItem[];
  autoSpy?: boolean;
  scrollRoot?: string;
  activeId?: string | null;
  defaultActiveId?: string | null;
  title?: import('react').ReactNode;
  maxDepth?: number;
  className?: string;
  onActiveIdChange?: (id: string | null) => void;
}

export function tocClass(p: { className?: string }): string {
  return ['cf-toc', p.className].filter(Boolean).join(' ');
}
