export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content?: string;
  placement?: TooltipPlacement;
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  offset?: number;
  maxWidth?: number | string;
}

export interface TooltipPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
}

export function computeTooltipPosition(
  trigger: DOMRect,
  tipW: number,
  tipH: number,
  placement: TooltipPlacement,
  offset: number,
): TooltipPosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;
  let final: TooltipPlacement = placement;

  function compute(p: TooltipPlacement): { top: number; left: number } {
    switch (p) {
      case 'top':
        return {
          top: trigger.top - tipH - offset,
          left: trigger.left + (trigger.width - tipW) / 2,
        };
      case 'bottom':
        return {
          top: trigger.bottom + offset,
          left: trigger.left + (trigger.width - tipW) / 2,
        };
      case 'left':
        return {
          top: trigger.top + (trigger.height - tipH) / 2,
          left: trigger.left - tipW - offset,
        };
      case 'right':
        return {
          top: trigger.top + (trigger.height - tipH) / 2,
          left: trigger.right + offset,
        };
    }
  }

  ({ top, left } = compute(placement));

  const overflowX = left < 4 || left + tipW > vw - 4;
  const overflowY = top < 4 || top + tipH > vh - 4;

  if ((placement === 'top' || placement === 'bottom') && overflowY) {
    final = placement === 'top' ? 'bottom' : 'top';
    ({ top, left } = compute(final));
  } else if ((placement === 'left' || placement === 'right') && overflowX) {
    final = placement === 'left' ? 'right' : 'left';
    ({ top, left } = compute(final));
  }

  left = Math.max(4, Math.min(left, vw - tipW - 4));
  top = Math.max(4, Math.min(top, vh - tipH - 4));

  return { top, left, placement: final };
}
