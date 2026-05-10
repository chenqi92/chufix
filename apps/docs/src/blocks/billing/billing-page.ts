import Preview from './BillingPage.vue';
import previewSrc from './BillingPage.vue?raw';
import previewReactSrc from './BillingPage.tsx?raw';
import type { BlockMeta } from '../types';

export const billingPage: BlockMeta = {
  id: 'billing-page',
  name: 'Billing Page 账单页',
  description:
    'Banner 提醒 + 当前方案 / 付款方式 / 本月使用 三卡 + 历史发票 DataGrid（PDF 下载）。',
  category: 'billing',
  height: 720,
  Preview,
  files: [
    { name: 'BillingPage.vue', content: previewSrc, lang: 'vue' },
    { name: 'BillingPage.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
