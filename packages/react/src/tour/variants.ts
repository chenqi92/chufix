export type TourPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TourStep {
  target: string;
  title: string;
  description?: string;
  placement?: TourPlacement;
}

export interface TourProps {
  steps: TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  current?: number;
  defaultCurrent?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  onCurrentChange?: (n: number) => void;
  onFinish?: () => void;
  onClose?: () => void;
}

export interface TourGeometry {
  rect: { top: number; left: number; width: number; height: number };
  popoverStyle: Record<string, string>;
  highlightStyle: Record<string, string>;
}

export function tourClass(p: { className?: string }): string {
  return ['cf-tour', p.className].filter(Boolean).join(' ');
}

export function computeGeometry(
  el: Element,
  placement: TourPlacement,
): TourGeometry {
  const r = el.getBoundingClientRect();
  const margin = 12;
  const popoverStyle: Record<string, string> = { position: 'fixed' };
  switch (placement) {
    case 'top':
      popoverStyle.top = `${r.top - margin}px`;
      popoverStyle.left = `${r.left + r.width / 2}px`;
      popoverStyle.transform = 'translate(-50%, -100%)';
      break;
    case 'bottom':
      popoverStyle.top = `${r.bottom + margin}px`;
      popoverStyle.left = `${r.left + r.width / 2}px`;
      popoverStyle.transform = 'translateX(-50%)';
      break;
    case 'left':
      popoverStyle.top = `${r.top + r.height / 2}px`;
      popoverStyle.left = `${r.left - margin}px`;
      popoverStyle.transform = 'translate(-100%, -50%)';
      break;
    case 'right':
      popoverStyle.top = `${r.top + r.height / 2}px`;
      popoverStyle.left = `${r.right + margin}px`;
      popoverStyle.transform = 'translateY(-50%)';
      break;
  }
  const pad = 4;
  const highlightStyle: Record<string, string> = {
    position: 'fixed',
    top: `${r.top - pad}px`,
    left: `${r.left - pad}px`,
    width: `${r.width + pad * 2}px`,
    height: `${r.height + pad * 2}px`,
  };
  return {
    rect: { top: r.top, left: r.left, width: r.width, height: r.height },
    popoverStyle,
    highlightStyle,
  };
}
