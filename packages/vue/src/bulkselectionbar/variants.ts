export type BulkBarPosition = 'sticky-top' | 'sticky-bottom' | 'inline';

export interface BulkSelectionBarProps {
  /** Number of selected items. Falsy hides the bar (unless hideWhenEmpty=false). */
  count: number;
  /** Total available items; if provided shows "N / total". */
  total?: number;
  /** Hide entire bar when count is 0. Default true. */
  hideWhenEmpty?: boolean;
  position?: BulkBarPosition;
  /** Override label text (default "已选 N 项"). */
  label?: string;
  /** Show built-in clear button. Default true. */
  showClear?: boolean;
  clearLabel?: string;
}
