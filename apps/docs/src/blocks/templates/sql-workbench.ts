import Preview from '~/components/demos/sqlworkbench/BasicVue.vue';
import previewSrc from '~/components/demos/sqlworkbench/BasicVue.vue?raw';
import previewReactSrc from './SqlWorkbench.tsx?raw';
import type { BlockMeta } from '../types';

export const sqlWorkbench: BlockMeta = {
  id: 'sql-workbench',
  name: 'SQL Workbench SQL 工作台',
  description: 'Editor / Console / History 3 个 tab 的 SQL 工作台外壳',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    { name: 'SqlWorkbench.vue', content: previewSrc, lang: 'vue' },
    { name: 'SqlWorkbench.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
