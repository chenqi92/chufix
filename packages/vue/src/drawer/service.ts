// 命令式 Drawer 服务：
//   import { drawer } from '@chufix-design/vue';
//   drawer.open({ title: '设置', placement: 'right', content: ... });

import { createApp, h, ref, type Component } from 'vue';
import Drawer from './Drawer.vue';
import type {
  DrawerFooterAlign,
  DrawerPlacement,
  DrawerProps,
  DrawerSize,
  DrawerTone,
} from './variants';

export interface DrawerServiceOptions extends Omit<DrawerProps, 'open'> {
  placement?: DrawerPlacement;
  size?: DrawerSize;
  tone?: DrawerTone;
  okText?: string;
  cancelText?: string;
  content?: string | Component;
  onOk?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;
  footerAlign?: DrawerFooterAlign;
}

function mount(opts: DrawerServiceOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const open = ref(true);
    const host = document.createElement('div');
    host.setAttribute('data-cf-drawer-service', '');
    document.body.appendChild(host);

    let resolved = false;
    function destroy() {
      app.unmount();
      host.remove();
    }

    const app = createApp({
      render() {
        return h(
          Drawer,
          {
            ...opts,
            open: open.value,
            onBeforeOk: opts.onOk,
            'onUpdate:open': (v: boolean) => {
              open.value = v;
            },
            onClose: () => {
              if (!resolved) {
                resolved = true;
                resolve(false);
              }
              setTimeout(destroy, 220);
            },
            onOk: () => {
              if (!resolved) {
                resolved = true;
                resolve(true);
              }
            },
            onCancel: () => {
              opts.onCancel?.();
            },
            okText: opts.okText,
            cancelText: opts.cancelText === '' ? undefined : opts.cancelText,
          },
          {
            default: () => {
              if (!opts.content) return null;
              if (typeof opts.content === 'string') return opts.content;
              return h(opts.content);
            },
          },
        );
      },
    });
    app.mount(host);
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
