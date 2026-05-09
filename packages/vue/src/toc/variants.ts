export interface TocItem {
  id: string;
  label: string;
  depth?: number;
}

export interface TocProps {
  items: TocItem[];
  /** When true, observe headings on scroll and auto-set active. */
  autoSpy?: boolean;
  /** Selector or root element to observe headings within. */
  scrollRoot?: string;
  /** Active item id (controlled mode); ignored when autoSpy. */
  activeId?: string | null;
  title?: string;
  maxDepth?: number;
}

export function tocClass(): string {
  return 'cf-toc';
}
