import Preview from './BulkImport.vue';
import previewSrc from './BulkImport.vue?raw';
import previewReactSrc from './BulkImport.tsx?raw';
import type { BlockMeta } from '../types';

export const bulkImport: BlockMeta = {
  id: 'bulk-import',
  name: 'Bulk Import 批量导入',
  description:
    'Spreadsheet 直接接受从 Excel/Sheets 粘贴的 TSV,实时校验姓名/邮箱/角色/金额并标出错误,通过 modal.confirm + toast 完成提交流程。一个把 0.2.0 Spreadsheet + Modal v2 + 业务校验串起来的实战示例。',
  category: 'workbench',
  height: 880,
  Preview,
  files: [
    { name: 'BulkImport.vue', content: previewSrc, lang: 'vue' },
    { name: 'BulkImport.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
