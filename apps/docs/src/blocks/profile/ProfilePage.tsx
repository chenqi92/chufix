import {
  CfAvatar,
  CfTabs,
  CfTabPanel,
  CfButton,
  CfDescriptionList,
  CfTimeline,
  CfTag,
  CfStat,
} from '@chufix-design/react';

const profile = [
  { label: '邮箱', value: 'jane.l@example.com' },
  { label: '团队', value: 'Payments · 6 人' },
  { label: '加入', value: '2024-03-12' },
  { label: '时区', value: 'UTC+8' },
];

const activity = [
  { id: '1', title: '合并了 PR #842', desc: 'feat(orders): 支持批量退款', time: '2h 前', dotColor: 'success' as const },
  { id: '2', title: '提交评论', desc: '看起来 LGTM，建议补一个边界 case', time: '4h 前', dotColor: 'default' as const },
  { id: '3', title: '邀请了 jordan.kim', desc: '加入 Payments 团队', time: '昨天', dotColor: 'info' as const },
  { id: '4', title: '完成 OKR Q1', desc: '订单接口 P95 延迟降至 220ms', time: '2 天前', dotColor: 'success' as const },
];

const tags = ['payments', 'backend', 'go', 'postgres', 'redis'];

export function ProfilePage() {
  return (
    <div className="prof">
      <header className="prof__head">
        <CfAvatar size="lg">JL</CfAvatar>
        <div className="prof__title">
          <h2>Jane Liu</h2>
          <p>Backend Engineer · Payments</p>
          <div className="prof__tags">
            {tags.map((t) => (
              <CfTag key={t} size="sm">{t}</CfTag>
            ))}
          </div>
        </div>
        <div className="prof__actions">
          <CfButton variant="primary">关注</CfButton>
          <CfButton variant="tertiary">发消息</CfButton>
        </div>
      </header>

      <section className="prof__stats">
        <CfStat label="提交" value={284} />
        <CfStat label="PR" value={42} />
        <CfStat label="评审" value={118} />
        <CfStat label="问题" value={7} />
      </section>

      <CfTabs
        defaultValue="overview"
        items={[
          { value: 'overview', label: '概览' },
          { value: 'activity', label: '动态' },
          { value: 'repos', label: '仓库' },
        ]}
      >
        {({ active }) => (
          <>
            <CfTabPanel value="overview" active={active}>
              <div className="prof__pane">
                <h3>个人信息</h3>
                <CfDescriptionList items={profile} />
              </div>
            </CfTabPanel>
            <CfTabPanel value="activity" active={active}>
              <div className="prof__pane">
                <CfTimeline items={activity} />
              </div>
            </CfTabPanel>
            <CfTabPanel value="repos" active={active}>
              <div className="prof__pane">
                <p>jane.l 拥有的 4 个仓库（基于 CfList 渲染）。</p>
              </div>
            </CfTabPanel>
          </>
        )}
      </CfTabs>
    </div>
  );
}
