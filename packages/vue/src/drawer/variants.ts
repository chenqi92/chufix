export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DrawerTone = 'default' | 'info' | 'success' | 'warning' | 'error';
export type DrawerFooterAlign = 'start' | 'center' | 'end' | 'space-between';

export interface DrawerProps {
  open?: boolean;
  title?: string;
  description?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  tone?: DrawerTone;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  /** Custom width override (left/right placement). number = px. */
  width?: number | string;
  /** Custom height override (top/bottom placement). number = px. */
  height?: number | string;
  /** Make panel resizable from its inner edge (drag to grow/shrink). */
  resizable?: boolean;
  /** Show a top grabber bar (placement='bottom' only). Default true for bottom. */
  showGrabber?: boolean;
  /**
   * Allow closing by swiping the panel toward its edge (currently
   * placement='bottom' only; drag down past 1/3 panel height or velocity
   * > 0.3 px/ms releases). Default true for placement='bottom'. Mutually
   * exclusive with `resizable`.
   */
  dismissible?: boolean;
  /** Render mask layer. Set false for non-modal drawers. */
  mask?: boolean;
  /** Footer alignment when using built-in footer slot/area. */
  footerAlign?: DrawerFooterAlign;
  /** Built-in OK button text. Omit to skip default footer. */
  okText?: string;
  /** Built-in Cancel button text. */
  cancelText?: string;
  okVariant?: 'primary' | 'danger' | 'secondary';
  /** Async hook before OK. Return false / throw to keep open. */
  onBeforeOk?: () => boolean | void | Promise<boolean | void>;
  /** Where to teleport. Defaults to body. */
  to?: string;
  /** Override z-index base. */
  zIndex?: number;
}

export function toneClass(tone: DrawerTone | undefined): string {
  return tone && tone !== 'default' ? `cf-drawer__overlay--tone-${tone}` : '';
}

export const DRAWER_TONE_ICON_PATH: Record<Exclude<DrawerTone, 'default'>, string> = {
  info:    'M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm-1 4h2v7h-2z',
  success: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.4 13.6L7.2 12.2l1.4-1.4 2 2 4.8-4.8 1.4 1.4z',
  warning: 'M12 2L1 21h22L12 2zm0 6l1 7h-2l1-7zm0 9.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
  error:   'M12 2a10 10 0 100 20 10 10 0 000-20zm0 8.6L9.4 8 8 9.4 10.6 12 8 14.6 9.4 16 12 13.4 14.6 16 16 14.6 13.4 12 16 9.4 14.6 8 12 10.6z',
};

let stackCounter = 0;
const ACTIVE_DRAWER_STACK: Array<() => void> = [];

export function pushDrawer(closeFn: () => void): { zIndex: number; release: () => void } {
  ACTIVE_DRAWER_STACK.push(closeFn);
  stackCounter += 1;
  const zIndex = 1500 + stackCounter * 10;
  return {
    zIndex,
    release() {
      const idx = ACTIVE_DRAWER_STACK.indexOf(closeFn);
      if (idx >= 0) ACTIVE_DRAWER_STACK.splice(idx, 1);
    },
  };
}

export function topMostDrawerCloseFn(): (() => void) | null {
  return ACTIVE_DRAWER_STACK[ACTIVE_DRAWER_STACK.length - 1] ?? null;
}
