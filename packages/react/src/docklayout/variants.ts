import type { ReactNode } from 'react';

export type DockOrientation = 'horizontal' | 'vertical';

export interface DockPanel {
  id: string;
  title: string;
  contentKey?: string;
  closable?: boolean;
  detachable?: boolean;
  size?: number | string;
  collapsed?: boolean;
}

export interface DockGroup {
  id: string;
  orientation: DockOrientation;
  children?: DockGroup[];
  panels?: DockPanel[];
  size?: number | string;
}

export interface DockLayoutProps {
  layout: DockGroup;
  active?: Record<string, string>;
  onActiveChange?: (groupId: string, panelId: string) => void;
  onPanelClose?: (groupId: string, panelId: string, panel: DockPanel) => void;
  onPanelDetach?: (groupId: string, panelId: string, panel: DockPanel) => void;
  /** Map of slot key (e.g. "panel-foo") → ReactNode. */
  slots?: Record<string, ReactNode>;
  className?: string;
}
