import Preview from './CodeWorkbench.vue';
import previewSrc from './CodeWorkbench.vue?raw';
import previewReactSrc from './CodeWorkbench.tsx?raw';
import type { BlockMeta } from '../types';

export const codeWorkbench: BlockMeta = {
  id: 'code-workbench',
  name: 'Code Workbench VSCode 风格代码工作台',
  description:
    'DockLayout 嵌套：左侧 TreeView 文件树 + 主区 CodeEditor 多 tab + 底部 Terminal/Output/Problems + 底部 StatusBar。',
  category: 'workbench',
  height: 680,
  Preview,
  files: [
    { name: 'CodeWorkbench.vue', content: previewSrc, lang: 'vue' },
    { name: 'CodeWorkbench.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
