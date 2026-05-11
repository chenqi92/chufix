export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  label?: string;
}

export interface CandlestickChartProps {
  data: Candle[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
}
