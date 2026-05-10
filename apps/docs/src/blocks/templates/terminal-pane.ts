import Preview from '~/components/demos/terminalpane/BasicVue.vue';
import previewSrc from '~/components/demos/terminalpane/BasicVue.vue?raw';
import previewReactSrc from './TerminalPane.tsx?raw';
import type { BlockMeta } from '../types';

export const terminalPane: BlockMeta = {
  id: 'terminal-pane',
  name: 'Terminal Pane 终端面板',
  description: 'Terminal / Output / CommandLine 3 个 tab 的终端面板外壳',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    { name: 'TerminalPane.vue', content: previewSrc, lang: 'vue' },
    { name: 'TerminalPane.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
