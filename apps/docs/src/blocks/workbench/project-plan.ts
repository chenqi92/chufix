import Preview from './ProjectPlan.vue';
import previewSrc from './ProjectPlan.vue?raw';
import previewReactSrc from './ProjectPlan.tsx?raw';
import type { BlockMeta } from '../types';

export const projectPlan: BlockMeta = {
  id: 'project-plan',
  name: 'Project Plan 项目甘特看板',
  description:
    'TimelineGantt + Drawer 编辑表单 + 命令式 modal/drawer/toast：一个用来管发布计划的实战示例，覆盖 Modal v2 / Drawer v2 / Form 规则校验 / TimelineGantt 拖拽五个最新能力的端到端组合。',
  category: 'workbench',
  height: 880,
  Preview,
  files: [
    { name: 'ProjectPlan.vue', content: previewSrc, lang: 'vue' },
    { name: 'ProjectPlan.tsx', content: previewReactSrc, lang: 'tsx' },
  ],
};
