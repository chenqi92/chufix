export interface MetricSeriesItem {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  delta?: number;
  /** Optional inline sparkline. */
  trend?: number[];
  /** Optional color override for the swatch dot. */
  color?: string;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  /** Text rendered before the value, e.g. currency symbol. */
  prefix?: string;
  /** Text rendered after the value. Alias of unit for dashboard-style cards. */
  suffix?: string;
  unit?: string;
  /** Small helper text below the value. */
  hint?: string;
  delta?: number;
  /** Trend sparkline data or a built-in preset. */
  trend?: number[] | 'up' | 'down' | 'flat';
  /** Format the delta. Default: "+N%". */
  deltaFn?: (delta: number) => string;
  ariaLabel?: string;
  className?: string;
  /** Optional breakdown rendered when the card is expanded. */
  series?: MetricSeriesItem[];
  /** Show the expand chevron when `series` is non-empty. Default true. */
  expandable?: boolean;
  /** Initial expanded state for uncontrolled cards. Default false. */
  defaultExpanded?: boolean;
  /** Controlled expanded flag. Pair with `onExpandedChange`. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export interface MetricCardExpandPayload {
  expanded: boolean;
}
