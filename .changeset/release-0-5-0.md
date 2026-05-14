---
'@chufix-design/tokens': minor
'@chufix-design/icons': minor
'@chufix-design/vue': minor
'@chufix-design/react': minor
'@chufix-design/cli': minor
---

AI / LLM 对话组件家族（10 个新组件）

- `CfChatList` —— 自动滚到底部、stickToBottom 守卫、role/date 分组、"回到最新" 浮动按钮
- `CfChatBubble` —— 三 role（user/assistant/system）+ 四态（sending/sent/streaming/error）+ hover 工具条（复制 / 重试 / 编辑 / 分支）
- `CfPromptComposer` —— 多行输入、附件、`/` 命令、`@` mention、Enter / Cmd+Enter 提交、loading stop 按钮
- `CfStreamingText` —— SSE token-by-token 渲染、闪烁光标、轻量 markdown（粗体 / 斜体 / `code`）不依赖 markdown-it
- `CfThinkingTrace` —— 可折叠推理 trace；"Thought for X.Xs"；status `thinking → done` 时非受控自动收起
- `CfToolCallCard` —— tool call 展示：name / input / output / pending|running|success|error / duration / errorMessage
- `CfArtifactCard` —— 产物卡：code / doc / svg / html / image / csv / json，含 copy + Blob download + open 操作
- `CfCitationMark` —— 行内 inline 引用 chip，hover 弹来源卡（title / domain / snippet / favicon / 打开链接）
- `CfModelPicker` —— LLM 模型选择器，provider 分组 + capability badges + context window 自动 k/M 格式化
- `CfTokenMeter` —— 上下文用量进度条，分段拆解（system / cached / fresh / completion），按比例自动 warning / error

文档
- 新增 `/components/{chatlist,chatbubble,promptcomposer,streamingtext,thinkingtrace,toolcallcard,artifactcard,citationmark,modelpicker,tokenmeter}/` 10 个页面
- sidebar 新增「AI 对话」分组，置于「移动端 / 触控」之前
- components/index.mdx 加 AI 对话卡片网格
