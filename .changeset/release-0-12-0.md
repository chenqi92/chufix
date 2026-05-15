---
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/maps-vue': minor
'@chufix-design/maps-react': minor
'@chufix-design/tokens': minor
---

feat(collab,agent): add Collaboration & Agent visualization family (PresenceAvatars / RemoteCursor / TypingIndicator / PulseDot / PlanCard / ReasoningTree / AgentTimeline)

- PresenceAvatars: 在线用户头像行，颜色按 id 哈希，self 加粗 ring，away 半透明，+N 折叠
- RemoteCursor: 远端光标 overlay，跟 WebSocket / WebRTC 接坐标，跨用户颜色哈希
- TypingIndicator: 三圆点 bouncing 动画 + 可选名字，prefers-reduced-motion 退化为静态
- PulseDot: 状态脉冲点，6 tone × 3 size，可关闭动画
- PlanCard: 多步骤计划卡片，每步 pending/active/done/failed/skipped + 时长 + 可折叠详情
- ReasoningTree: Tree-of-Thoughts 可视化，每节点 score 自动配色，selected 路径加粗，子树折叠
- AgentTimeline: 单 agent 行动流，6 种事件类型（thought/tool/action/observation/message/error）
- docs: 7 个 mdx + demos + 「协作 / Agent 可视化」侧边栏分组 + 首页卡片
