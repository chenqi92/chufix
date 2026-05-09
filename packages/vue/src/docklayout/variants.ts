export type DockOrientation = 'horizontal' | 'vertical';

export interface DockPanel {
  id: string;
  title: string;
  /** Slot key — content rendered via <template #panel-{key}>. */
  contentKey?: string;
  closable?: boolean;
  detachable?: boolean;
  size?: number | string;
  collapsed?: boolean;
}

export interface DockGroup {
  id: string;
  orientation: DockOrientation;
  /** Either children groups (nested splits) or leaf panels (a tabbed area). */
  children?: DockGroup[];
  panels?: DockPanel[];
  size?: number | string;
}

export interface DockLayoutProps {
  layout: DockGroup;
  /** Active panel id per group (for tabbed groups). Group id → panel id. */
  active?: Record<string, string>;
}
