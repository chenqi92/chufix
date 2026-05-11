// ChuFix UI · Modal types & helpers
// 兼容 v0.1（open / title / size / closeOnOverlay / closeOnEsc / showClose / to）；
// 新增 tone / centered / draggable / resizable / asyncOk / footerAlign / stacked z-index。

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalTone = 'default' | 'info' | 'success' | 'warning' | 'error';
export type FooterAlign = 'start' | 'center' | 'end' | 'space-between';

export interface ModalProps {
  open?: boolean;
  title?: string;
  description?: string;
  size?: ModalSize;
  /** 视觉 tone；info/success/warning/error 会在 header 加图标 + 强调色。*/
  tone?: ModalTone;

  /* 关闭行为 */
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;

  /* 位置 / 尺寸 */
  /** true：垂直居中；false：top 80px（默认 true）。*/
  centered?: boolean;
  /** 自定义宽度（覆盖 size）。 */
  width?: number | string;
  /** 自定义最小高度。 */
  minHeight?: number | string;

  /* footer */
  footerAlign?: FooterAlign;

  /* 拖拽 / 缩放 */
  draggable?: boolean;
  resizable?: boolean;

  /* 异步确认 */
  /** 默认确认按钮文案；不传则不渲染默认 OK，由 #footer 自定义。*/
  okText?: string;
  cancelText?: string;
  /** 确认按钮 variant；tone='error' 时建议 'danger'。*/
  okVariant?: 'primary' | 'danger' | 'secondary';
  /** ok 钩子；可异步：
   *  - 返回 false / Promise<false> → 阻止关闭，loading 解除
   *  - 抛错 → 同上，loading 解除（外部可显示 toast）
   *  - 其它 → 关闭并提交。*/
  onBeforeOk?: () => boolean | void | Promise<boolean | void>;

  /* Teleport / 层级 */
  to?: string;
  /** z-index 起点；缺省由组件内部维护栈递增。*/
  zIndex?: number;
}

/* ============================================================ */
/*                    多模态栈                                   */
/* ============================================================ */

let stackCounter = 0;
const ACTIVE_MODAL_STACK: Array<() => void> = [];

export function pushModal(closeFn: () => void): { zIndex: number; release: () => void } {
  stackCounter++;
  const z = 1000 + stackCounter * 10;
  ACTIVE_MODAL_STACK.push(closeFn);
  return {
    zIndex: z,
    release: () => {
      const i = ACTIVE_MODAL_STACK.indexOf(closeFn);
      if (i !== -1) ACTIVE_MODAL_STACK.splice(i, 1);
    },
  };
}

export function topMostCloseFn(): (() => void) | null {
  return ACTIVE_MODAL_STACK[ACTIVE_MODAL_STACK.length - 1] ?? null;
}

/* ============================================================ */
/*                    tone 图标                                  */
/* ============================================================ */

export const TONE_ICON_PATH: Record<Exclude<ModalTone, 'default'>, string> = {
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm-1 4h2v7h-2z',
  success: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.4 13.6L7.2 12.2l1.4-1.4 2 2 4.6-4.6 1.4 1.4z',
  warning: 'M12 2L1 21h22L12 2zm0 6l1 7h-2l1-7zm0 9.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
  error: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 8.6l3-3 1.4 1.4-3 3 3 3-1.4 1.4-3-3-3 3-1.4-1.4 3-3-3-3 1.4-1.4z',
};

export function toneClass(tone: ModalTone | undefined): string {
  return tone && tone !== 'default' ? `cf-modal--${tone}` : '';
}
