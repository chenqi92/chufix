import type { ReactNode } from 'react';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover' | 'manual';

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  offset?: number;
  closeOnOutside?: boolean;
  closeOnEsc?: boolean;
  width?: number | string;
  disabled?: boolean;
  content?: ReactNode;
  children?: ReactNode;
}

export interface PopoverPosition {
  top: number;
  left: number;
  placement: PopoverPlacement;
}

export function computePopoverPosition(
  trigger: DOMRect,
  panelW: number,
  panelH: number,
  placement: PopoverPlacement,
  offset: number,
): PopoverPosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let final: PopoverPlacement = placement;

  function compute(p: PopoverPlacement): { top: number; left: number } {
    switch (p) {
      case 'top':
        return {
          top: trigger.top - panelH - offset,
          left: trigger.left + (trigger.width - panelW) / 2,
        };
      case 'bottom':
        return {
          top: trigger.bottom + offset,
          left: trigger.left + (trigger.width - panelW) / 2,
        };
      case 'left':
        return {
          top: trigger.top + (trigger.height - panelH) / 2,
          left: trigger.left - panelW - offset,
        };
      case 'right':
        return {
          top: trigger.top + (trigger.height - panelH) / 2,
          left: trigger.right + offset,
        };
    }
  }

  let { top, left } = compute(placement);

  const overflowY = top < 4 || top + panelH > vh - 4;
  const overflowX = left < 4 || left + panelW > vw - 4;

  if ((placement === 'top' || placement === 'bottom') && overflowY) {
    final = placement === 'top' ? 'bottom' : 'top';
    ({ top, left } = compute(final));
  } else if ((placement === 'left' || placement === 'right') && overflowX) {
    final = placement === 'left' ? 'right' : 'left';
    ({ top, left } = compute(final));
  }

  left = Math.max(4, Math.min(left, vw - panelW - 4));
  top = Math.max(4, Math.min(top, vh - panelH - 4));

  return { top, left, placement: final };
}
