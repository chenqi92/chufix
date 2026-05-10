/**
 * Imperative Modal service.
 *   import { modal } from '@chufix-design/react';
 *   await modal.confirm({ title: '删除？', description: '不可撤销', onOk: async () => api.del() });
 */
import { createElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Modal, type ModalProps } from './Modal';
import type { FooterAlign, ModalSize, ModalTone } from './variants';

export interface ModalServiceOptions {
  title?: string;
  description?: string;
  size?: ModalSize;
  tone?: ModalTone;
  okText?: string;
  cancelText?: string;
  okVariant?: ModalProps['okVariant'];
  footerAlign?: FooterAlign;
  width?: number | string;
  centered?: boolean;
  /** Body content. */
  content?: ReactNode;
  /** Async hook; return false to keep modal open. */
  onOk?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;
}

function mount(opts: ModalServiceOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }
    const host = document.createElement('div');
    host.setAttribute('data-cf-modal-service', '');
    document.body.appendChild(host);
    const root = createRoot(host);
    let resolved = false;
    let isOpen = true;

    function destroy() {
      root.unmount();
      host.remove();
    }

    function render() {
      root.render(
        createElement(
          Modal,
          {
            open: isOpen,
            title: opts.title,
            description: opts.description,
            size: opts.size,
            tone: opts.tone,
            footerAlign: opts.footerAlign,
            width: opts.width,
            centered: opts.centered,
            okText: opts.okText ?? '确定',
            cancelText: opts.cancelText === '' ? undefined : (opts.cancelText ?? '取消'),
            okVariant: opts.okVariant,
            onBeforeOk: opts.onOk,
            onCancel: opts.onCancel,
            onOk: () => {
              if (!resolved) {
                resolved = true;
                resolve(true);
              }
            },
            onOpenChange: (v: boolean) => {
              isOpen = v;
              render();
              if (!v) {
                if (!resolved) {
                  resolved = true;
                  resolve(false);
                }
                setTimeout(destroy, 220);
              }
            },
          },
          opts.content,
        ),
      );
    }
    render();
  });
}

export const modal = {
  open(opts: ModalServiceOptions): Promise<boolean> {
    return mount(opts);
  },
  confirm(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: opts.tone ?? 'warning', cancelText: opts.cancelText ?? '取消' });
  },
  danger(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'error', okVariant: 'danger', cancelText: opts.cancelText ?? '取消' });
  },
  alert(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: opts.tone ?? 'info', cancelText: '' });
  },
  info(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'info', cancelText: '' });
  },
  success(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'success', cancelText: '' });
  },
  warning(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'warning', cancelText: '' });
  },
  error(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'error', cancelText: '' });
  },
};
