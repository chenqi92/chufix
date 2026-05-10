// 命令式 Modal 服务：
//   import { modal } from '@chufix-design/vue';
//   modal.confirm({ title: '删除？', description: '该操作不可撤销。', onOk: async () => { await api.delete() } });
//
// 内部用一个挂在 body 上的隐藏 div 作为 Portal 宿主，每次 open 创建一个 Vue app 渲染 Modal。

import { createApp, h, ref, type Component } from 'vue';
import Modal from './Modal.vue';
import type { FooterAlign, ModalProps, ModalSize, ModalTone } from './variants';

export interface ModalServiceOptions extends Omit<ModalProps, 'open'> {
  /** 默认 'md'。*/
  size?: ModalSize;
  /** 默认 'default'。*/
  tone?: ModalTone;
  /** 默认 '确定'。*/
  okText?: string;
  /** 默认 '取消'，传 '' 隐藏取消按钮。*/
  cancelText?: string;
  /** 渲染 body 的字符串或 Vue 组件。*/
  content?: string | Component;
  /** 异步钩子；返回 false 阻止关闭。*/
  onOk?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;
  footerAlign?: FooterAlign;
}

function mount(opts: ModalServiceOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const open = ref(true);
    const host = document.createElement('div');
    host.setAttribute('data-cf-modal-service', '');
    document.body.appendChild(host);

    let resolved = false;
    function destroy() {
      app.unmount();
      host.remove();
    }

    const app = createApp({
      render() {
        return h(
          Modal,
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
              setTimeout(destroy, 200);
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
            okText: opts.okText ?? '确定',
            cancelText: opts.cancelText === '' ? undefined : (opts.cancelText ?? '取消'),
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

export const modal = {
  /** 通用对话框。*/
  open(opts: ModalServiceOptions): Promise<boolean> {
    return mount(opts);
  },
  /** 确认（OK + Cancel）；resolve(true) = 用户点 OK；resolve(false) = Cancel / Close。*/
  confirm(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: opts.tone ?? 'warning', cancelText: opts.cancelText ?? '取消' });
  },
  /** 警告型确认（红色 OK）。*/
  danger(opts: ModalServiceOptions): Promise<boolean> {
    return mount({ ...opts, tone: 'error', okVariant: 'danger', cancelText: opts.cancelText ?? '取消' });
  },
  /** 信息提示（仅 OK）。*/
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
