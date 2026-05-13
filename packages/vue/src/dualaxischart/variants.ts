export type DualAxisSize = 'sm' | 'md' | 'lg';

export interface DualAxisProps {
  /** Common X-axis category labels. */
  categories: string[];
  /** Bar series — drives the left Y axis. */
  bar: { label: string; data: number[]; color?: string };
  /** Line series — drives the right Y axis. */
  line: { label: string; data: number[]; color?: string; smooth?: boolean };
  height?: number;
  /** Custom formatter for bar tooltip / axis labels. */
  formatBar?: (v: number) => string;
  /** Custom formatter for line tooltip / axis labels. */
  formatLine?: (v: number) => string;
  /** Optional aria description for SR users. */
  ariaLabel?: string;
  size?: DualAxisSize;
}

export interface DualAxisHoverPayload {
  index: number;
  category: string;
  barValue: number;
  lineValue: number;
}
