import type { ReactNode } from 'react';

export interface SavedView {
  id: string;
  label: string;
  count?: number;
}

export interface FilterPanelProps {
  title?: string;
  savedViews?: SavedView[];
  activeViewId?: string;
  activeFilters?: number;
  showFooter?: boolean;
  applying?: boolean;
  onViewChange?: (id: string, view: SavedView) => void;
  onApply?: () => void;
  onReset?: () => void;
  children?: ReactNode;
}

export interface FilterSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
