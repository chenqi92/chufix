import Preview from '~/components/demos/pluginpane/BasicVue.vue';
import previewSrc from '~/components/demos/pluginpane/BasicVue.vue?raw';
import previewReactSrc from './PluginCenter.tsx?raw';
import type { BlockMeta } from '../types';

export const pluginCenter: BlockMeta = {
  id: 'plugin-center',
  name: 'Plugin Center 插件中心',
  description: 'Card / Manifest / Permission / Marketplace 4 个 tab 的插件中心面板',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    { name: 'PluginCenter.vue', content: previewSrc, lang: 'vue' },
    { name: 'PluginCenter.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
