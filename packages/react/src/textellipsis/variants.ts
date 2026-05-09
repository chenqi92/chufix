import type { ReactNode } from 'react';

export interface TextEllipsisProps {
  text?: string;
  children?: ReactNode;
  rows?: number;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  className?: string;
}

export function textEllipsisClass(p: {
  expanded: boolean;
  className?: string;
}): string {
  return [
    'cf-textellipsis',
    p.expanded && 'is-expanded',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
