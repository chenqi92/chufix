export interface SavedView {
  id: string;
  label: string;
  /** Optional badge / count. */
  count?: number;
}

export interface FilterPanelProps {
  title?: string;
  /** Saved views row at the top. */
  savedViews?: SavedView[];
  activeViewId?: string;
  /** Number of currently applied filters; shown as badge in header. */
  activeFilters?: number;
  /** Show built-in 清空 / 应用 footer. Default true. */
  showFooter?: boolean;
  /** Footer apply button loading state. */
  applying?: boolean;
}

export interface FilterSectionProps {
  title: string;
  /** Number of applied filters in this section; rendered as badge. */
  count?: number;
  /** Initial open state. Default true. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
}
