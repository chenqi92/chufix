<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfTag, CfSegmentedControl } from '@chufix-design/vue';

const billing = ref<'monthly' | 'yearly'>('yearly');
const billingItems = [
  { label: '按月', value: 'monthly' },
  { label: '按年（省 17%）', value: 'yearly' },
];

const plans = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    monthly: 0,
    yearly: 0,
    desc: '永久免费，适合个人 hobby 项目',
    features: [
      '所有 atoms 与 blocks',
      '社区支持',
      '1 个工作区',
      '500 MB 存储',
    ],
    cta: '立即开始',
    variant: 'tertiary' as const,
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '最受欢迎',
    monthly: 12,
    yearly: 120,
    desc: '小团队与初创公司，按月续订',
    features: [
      'Free 的全部',
      '无限工作区',
      '50 GB 存储',
      '邮件 + Slack 工单',
      'SSO 单点登录',
    ],
    cta: '试用 14 天',
    variant: 'primary' as const,
    highlighted: true,
  },
  {
    id: 'ent',
    name: 'Enterprise',
    badge: null,
    monthly: 0,
    yearly: 0,
    desc: '大型组织，定制部署与合规支持',
    features: [
      'Pro 的全部',
      '私有化 / VPC 部署',
      'SAML + SCIM',
      '24/7 专属技术支持',
      'SLA 99.95%',
    ],
    cta: '联系销售',
    variant: 'secondary' as const,
    highlighted: false,
    custom: true,
  },
];

function price(p: (typeof plans)[number]) {
  if (p.custom) return '自定义';
  const v = billing.value === 'monthly' ? p.monthly : Math.round(p.yearly / 12);
  if (v === 0) return '免费';
  return `$ ${v}`;
}
</script>

<template>
  <div class="pr">
    <header class="pr__head">
      <h2>简单透明的定价</h2>
      <p>按需付费，随时取消。所有方案都包含核心组件库 MIT License。</p>
      <div class="pr__billing">
        <CfSegmentedControl v-model="billing" :items="billingItems" />
      </div>
    </header>

    <section class="pr__plans">
      <article
        v-for="p in plans"
        :key="p.id"
        :class="['pr__plan', p.highlighted && 'pr__plan--hl']"
      >
        <header class="pr__plan-head">
          <span class="pr__plan-name">{{ p.name }}</span>
          <CfTag v-if="p.badge" size="sm" tone="accent">{{ p.badge }}</CfTag>
        </header>
        <div class="pr__plan-price">
          <span class="pr__plan-amount">{{ price(p) }}</span>
          <span v-if="!p.custom && (billing === 'monthly' ? p.monthly : p.yearly) > 0" class="pr__plan-cycle">
            / {{ billing === 'monthly' ? '月' : '月，按年付' }}
          </span>
        </div>
        <p class="pr__plan-desc">{{ p.desc }}</p>
        <ul class="pr__plan-features">
          <li v-for="f in p.features" :key="f">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>
        <CfButton :variant="p.variant" block>{{ p.cta }}</CfButton>
      </article>
    </section>
  </div>
</template>

<style scoped>
.pr {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: var(--font-sans);
}
.pr__head {
  text-align: center;
}
.pr__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.pr__head p {
  margin: 8px 0 16px;
  color: var(--fg-2);
}
.pr__billing {
  display: flex;
  justify-content: center;
}
.pr__plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.pr__plan {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
}
.pr__plan--hl {
  border-color: var(--accent-1);
  box-shadow: 0 0 0 1px var(--accent-1);
}
.pr__plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pr__plan-name {
  font-size: var(--t-16);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.pr__plan-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.pr__plan-amount {
  font-size: 32px;
  font-weight: 600;
  color: var(--fg-1);
}
.pr__plan-cycle {
  color: var(--fg-3);
  font-size: var(--t-12);
}
.pr__plan-desc {
  margin: 0;
  color: var(--fg-2);
  font-size: var(--t-12);
  line-height: 1.5;
  min-height: 36px;
}
.pr__plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--t-13);
  color: var(--fg-1);
  flex: 1;
}
.pr__plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pr__plan-features svg {
  color: var(--status-success);
  flex-shrink: 0;
}
</style>
