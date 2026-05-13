export type ParetoSize = 'sm' | 'md' | 'lg';

export interface ParetoItem {
  label: string;
  value: number;
  color?: string;
}

export interface ParetoProps {
  items: ParetoItem[];
  height?: number;
  /** Cumulative reference line position (0–1). Default 0.8 (Pareto's 80/20). */
  cutoff?: number;
  /** Override bar fill. */
  barColor?: string;
  /** Override cumulative-line color. */
  lineColor?: string;
  /** Optional formatter for the bar value (left axis). */
  formatValue?: (v: number) => string;
  ariaLabel?: string;
  size?: ParetoSize;
}

export interface ParetoHoverPayload {
  index: number;
  item: ParetoItem;
  cumulative: number;
  cumulativePct: number;
}
