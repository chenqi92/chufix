import Preview from '~/components/demos/onboardingflow/BasicVue.vue';
import previewSrc from '~/components/demos/onboardingflow/BasicVue.vue?raw';
import type { BlockMeta } from '../types';

export const onboardingFlow: BlockMeta = {
  id: 'onboarding-flow',
  name: 'Onboarding Flow 引导流',
  description: 'First-Run Wizard / Hotspot Tour / Full Flow 3 个 tab 的引导流外壳',
  category: 'templates',
  height: 480,
  Preview,
  files: [
    {
      name: 'OnboardingFlow.vue',
      content: previewSrc,
      lang: 'vue',
    },
  ],
};
