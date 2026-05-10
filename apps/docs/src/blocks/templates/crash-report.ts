import Preview from '~/components/demos/crashpane/RealVue.vue';
import previewSrc from '~/components/demos/crashpane/RealVue.vue?raw';
import type { BlockMeta } from '../types';

export const crashReport: BlockMeta = {
  id: 'crash-report',
  name: 'Crash Report 崩溃报告',
  description: 'Crash Dialog / Stack / Dump Uploader / Safe Mode 4 个 tab 的崩溃报告面板',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    {
      name: 'CrashReport.vue',
      content: previewSrc,
      lang: 'vue',
    },
  ],
};
