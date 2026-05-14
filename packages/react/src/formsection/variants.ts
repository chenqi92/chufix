import type { ReactNode } from 'react';

export interface FormSectionProps {
  title?: string;
  description?: string;
  anchor?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
