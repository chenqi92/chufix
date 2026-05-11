import type { DateLike } from '../datepicker/date';

export type GanttUnit = 'day' | 'week' | 'month';
export type GanttSize = 'sm' | 'md' | 'lg';

export interface GanttBar {
  id: string;
  start: DateLike;
  end: DateLike;
  label?: string;
  /** OKLCH / hex / rgb — overrides the default accent. */
  color?: string;
  /** 0–1 fill ratio shown as a darker overlay. */
  progress?: number;
  disabled?: boolean;
}

export interface GanttRow {
  id: string;
  label: string;
  /** Optional group name; rows sharing a group render under a section header. */
  group?: string;
  bars: GanttBar[];
}

export interface GanttDependency {
  /** Source bar id. */
  from: string;
  /** Target bar id. */
  to: string;
}

export interface GanttBarChangeMeta {
  action: 'move' | 'resize-start' | 'resize-end';
  /** Original (pre-drag) start/end. */
  prev: { start: Date; end: Date };
}

export interface TimelineGanttProps {
  rows: GanttRow[];
  /** Visible range start. */
  start: DateLike;
  /** Visible range end (inclusive). */
  end: DateLike;
  /** Axis primary unit. Default 'day'. */
  unit?: GanttUnit;
  /** Width of one day in pixels. Default 32. */
  dayWidth?: number;
  /** Height of each row in pixels. Default 40. */
  rowHeight?: number;
  /** Width of the left label column. Default 200. */
  labelWidth?: number;
  /** Render a vertical line at "today". Default true. */
  showToday?: boolean;
  /** Render dependencies as connecting lines. */
  dependencies?: GanttDependency[];
  /** Allow drag-to-move and edge-resize. Default false. */
  editable?: boolean;
  /** 0 = Sunday-first, 1 = Monday-first. Default 1. */
  weekStartsOn?: 0 | 1;
  /** Optional caption shown above the chart. */
  caption?: string;
  size?: GanttSize;
}
