import { CfOnboardingFlow, CfStepper } from '@chufix-design/react';

const steps = [
  { id: '1', title: '选择主题' },
  { id: '2', title: '导入数据' },
  { id: '3', title: '邀请成员' },
];

export function OnboardingFlow() {
  return (
    <div style={{ height: 280 }}>
      <CfOnboardingFlow
        slots={{
          'panel-wizard': <CfStepper items={steps} current={0} />,
          'panel-hotspot': <p style={{ color: 'var(--fg-2)' }}>热点引导：在真实组件上加圆点 + 浮窗（基于 CfTour 增强）。</p>,
          'panel-flow': <p style={{ color: 'var(--fg-2)' }}>完整引导流：组合 wizard + hotspot + 完成态。</p>,
        }}
      />
    </div>
  );
}
