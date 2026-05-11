import { useMemo, useState } from 'react';
import { CfButton, CfTag, CfSegmentedControl } from '@chufix-design/react';

const billingItems = [
  { label: '按月', value: 'monthly' },
  { label: '按年（省 17%）', value: 'yearly' },
];

const plans = [
  {
    id: 'free', name: 'Free', badge: null, monthly: 0, yearly: 0,
    desc: '永久免费，适合个人 hobby 项目',
    features: ['所有 atoms 与 blocks', '社区支持', '1 个工作区', '500 MB 存储'],
    cta: '立即开始', variant: 'tertiary' as const, highlighted: false, custom: false,
  },
  {
    id: 'pro', name: 'Pro', badge: '最受欢迎', monthly: 12, yearly: 120,
    desc: '小团队与初创公司，按月续订',
    features: ['Free 的全部', '无限工作区', '50 GB 存储', '邮件 + Slack 工单', 'SSO 单点登录'],
    cta: '试用 14 天', variant: 'primary' as const, highlighted: true, custom: false,
  },
  {
    id: 'ent', name: 'Enterprise', badge: null, monthly: 0, yearly: 0,
    desc: '大型组织，定制部署与合规支持',
    features: ['Pro 的全部', '私有化 / VPC 部署', 'SAML + SCIM', '24/7 专属技术支持', 'SLA 99.95%'],
    cta: '联系销售', variant: 'secondary' as const, highlighted: false, custom: true,
  },
];

export function PricingTable() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const price = (p: (typeof plans)[number]) => {
    if (p.custom) return '自定义';
    const v = billing === 'monthly' ? p.monthly : Math.round(p.yearly / 12);
    if (v === 0) return '免费';
    return `$ ${v}`;
  };

  return (
    <div className="pr">
      <header className="pr__head">
        <h2>简单透明的定价</h2>
        <p>按需付费，随时取消。所有方案都包含核心组件库 MIT License。</p>
        <div className="pr__billing">
          <CfSegmentedControl value={billing} onChange={setBilling as any} items={billingItems} />
        </div>
      </header>
      <section className="pr__plans">
        {plans.map((p) => (
          <article key={p.id} className={['pr__plan', p.highlighted && 'pr__plan--hl'].filter(Boolean).join(' ')}>
            <header className="pr__plan-head">
              <span className="pr__plan-name">{p.name}</span>
              {p.badge && <CfTag size="sm" tone="accent">{p.badge}</CfTag>}
            </header>
            <div className="pr__plan-price">
              <span className="pr__plan-amount">{price(p)}</span>
              {!p.custom && (billing === 'monthly' ? p.monthly : p.yearly) > 0 && (
                <span className="pr__plan-cycle">
                  / {billing === 'monthly' ? '月' : '月，按年付'}
                </span>
              )}
            </div>
            <p className="pr__plan-desc">{p.desc}</p>
            <ul className="pr__plan-features">
              {p.features.map((f) => (
                <li key={f}>
                  <svg viewBox="0 0 16 16" width={14} height={14} fill="none">
                    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <CfButton variant={p.variant} block>{p.cta}</CfButton>
          </article>
        ))}
      </section>
    </div>
  );
}
