import Preview from './DbWorkbench.vue';
import previewSrc from './DbWorkbench.vue?raw';
import type { BlockMeta } from '../types';

export const dbWorkbench: BlockMeta = {
  id: 'db-workbench',
  name: 'DB Workbench 数据库工作台',
  description:
    '左侧 Schema 树 + 右侧 SQL 编辑器 + 下方结果 / 历史 / 消息三 tab。Splitter 双向分隔，Postgres / MySQL 风格。',
  category: 'workbench',
  height: 640,
  Preview,
  files: [
    { name: 'DbWorkbench.vue', content: previewSrc, lang: 'vue' },
  ],
};
