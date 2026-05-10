/**
 * Imperative Drawer service.
 *   import { drawer } from '@chufix-design/react';
 *   await drawer.open({ title: '设置', placement: 'right', content: <Settings /> });
 */
import { createElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Drawer } from './Drawer';
import type {
  DrawerFooterAlign,
  DrawerPlacement,
  DrawerSize,
  DrawerTone,
} from './variants';

export interface DrawerServiceOptions {
  title?: string;
  description?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  tone?: DrawerTone;
  okText?: string;
  cancelText?: string;
  okVariant?: 'primary' | 'danger' | 'secondary';
  footerAlign?: DrawerFooterAlign;
  width?: number | string;
  height?: number | string;
  resizable?: boolean;
  mask?: boolean;
  content?: ReactNode;
  onOk?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;
}

function mount(opts: DrawerServiceOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }
    const host = document.createElement('div');
    host.setAttribute('data-cf-drawer-service', '');
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
          Drawer,
          {
            open: isOpen,
            title: opts.title,
            description: opts.description,
            placement: opts.placement,
            size: opts.size,
            tone: opts.tone,
            footerAlign: opts.footerAlign,
            width: opts.width,
            height: opts.height,
            resizable: opts.resizable,
            mask: opts.mask,
            okText: opts.okText,
            cancelText: opts.cancelText === '' ? undefined : opts.cancelText,
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
                setTimeout(destroy, 240);
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

export const drawer = {
  open(opts: DrawerServiceOptions): Promise<boolean> {
    return mount(opts);
  },
  confirm(opts: DrawerServiceOptions): Promise<boolean> {
    return mount({
      ...opts,
      tone: opts.tone ?? 'warning',
      okText: opts.okText ?? '确定',
      cancelText: opts.cancelText ?? '取消',
    });
  },
  danger(opts: DrawerServiceOptions): Promise<boolean> {
    return mount({
      ...opts,
      tone: 'error',
      okVariant: 'danger',
      okText: opts.okText ?? '确定',
      cancelText: opts.cancelText ?? '取消',
    });
  },
};
