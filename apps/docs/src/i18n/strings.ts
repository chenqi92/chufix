// 全站 i18n 字符串字典。新增字段时 zh + en 都补齐，TS 类型自动检查不漏译。

export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

const dict = {
  zh: {
    'site.tagline': '初见即用的基础组件库',
    'site.description': '础件 ChuFix UI · 初见即用的基础组件库，Vue 3 与 React 双框架同源，纯 HTML/JS 项目也能直接用 CSS 类名。',
    'site.brand.line': '础件 · 双框架同源 · CSS 变量主题 · 可装包也可拷源码 · 纯 HTML/JS 也能用',

    'nav.menu.components': '组件',
    'nav.menu.charts': '图表',
    'nav.menu.blocks': '页面方案',
    'nav.search.placeholder': '搜索文档…',
    'nav.search.kbd': 'Ctrl K',
    'nav.github': 'GitHub',
    'nav.lang.label': '语言',

    'announce.updated': '更新于',
    'announce.npmUnpub': 'npm 公共包暂未发布',

    'docs.pager.prev': '上一篇',
    'docs.pager.next': '下一篇',
    'docs.comments.title': ' 的讨论',
    'docs.translationPending.title': '英文版尚未翻译',
    'docs.translationPending.body': '该页面英文版暂未提供，已为你回退到中文版。欢迎到 GitHub 提交翻译 PR。',

    'docs.toc.title': '本页内容',

    'comments.eyebrow': '反馈与讨论',
    'comments.title': '讨论',
    'comments.unavailable.title': '评论接口尚未启用',
    'comments.unavailable.body': '当前页面已经预留评论模块。配置 Cloudflare Pages Functions 和 D1 绑定后，用户评论会进入待审核队列。',
    'comments.placeholder.nick': '昵称',
    'comments.placeholder.body': '留下建议、问题或使用反馈',
    'comments.emoji.label': '表情',
    'comments.emoji.send': '选择表情',
    'comments.emoji.aria': '插入',
    'comments.submit': '提交评论',
    'comments.loading': '正在加载评论...',
    'comments.empty.title': '还没有公开评论',
    'comments.empty.body': '第一条高质量反馈，往往会帮后面的使用者少走一点弯路。',
    'comments.role.admin': '维护者',
    'comments.notice.submitted': '评论已提交，审核通过后会显示在这里。',
    'comments.notice.failed': '评论暂时没有提交成功，请稍后再试。',
    'comments.notice.needNick': '先填写昵称，再提交评论。',

    'block.modes.preview': '预览',
    'block.modes.code': '代码',
    'block.copy.cli': '复制 CLI 命令',
    'block.copy.copy': '复制',
    'block.copy.copied': '已复制',
    'block.aria.modes': '预览 / 代码',
    'block.aria.files': '项目文件',
    'block.aria.codeFiles': '代码文件',

    'chart.svgOnly': '需在父 svg 中使用',

    'home.cta.start': '快速开始',
    'home.cta.vanilla': '纯 HTML 用法',
    'home.cta.components': '浏览组件',
    'home.cta.github': 'GitHub →',
    'home.section.why.title': '为什么是础件',
    'home.feature.dual.title': '双框架同源',
    'home.feature.dual.body': 'Vue 3 与 React 共用同一套 design token、同一套类名、同一套交互行为。从 Vue 项目搬到 React 项目，零负担。',
    'home.feature.theme.title': '零运行时主题',
    'home.feature.theme.body': '所有颜色、半径、阴影都走 CSS 变量。切主题只需改 [data-theme]，没有 JS 主题工厂。',
    'home.feature.usage.title': '两种用法',
    'home.feature.usage.body': '当传统组件库装包用，或 npx chufix add 把源码直接拷进自己仓库。',
    'home.feature.html.title': '纯 HTML 也能用',
    'home.feature.html.body': '所有视觉走 cf-* CSS 类名，不写任何 Vue/React 也能拿到 90% 的视觉。一个 <link> 标签搞定。',
    'home.section.demo.title': '一眼看到效果',
    'home.section.demo.lede': '下面是真实可交互的实例，不是截图。代码默认折叠，展开后可在 Vue / React / CLI 三种来源之间切换并一键复制。',
    'home.section.has.title': '现在已经有什么',
    'home.section.has.lede': '151+ 个组件，覆盖表单、容器、反馈、数据展示、导航、布局、编辑器、系统壳、多窗口、22 项数据可视化与 8 个页面模版。',
    'home.section.has.viewAll': '完整清单 →',
    'home.footer.license': 'MIT License',
  },

  en: {
    'site.tagline': 'A no-friction component library, ready out of the box',
    'site.description': 'ChuFix UI · A no-friction component library for Vue 3 and React from the same source. Works in plain HTML/JS too via CSS classes.',
    'site.brand.line': 'ChuFix · same source for Vue & React · themable via CSS vars · install or copy source · works in plain HTML/JS',

    'nav.menu.components': 'Components',
    'nav.menu.charts': 'Charts',
    'nav.menu.blocks': 'Blocks',
    'nav.search.placeholder': 'Search docs…',
    'nav.search.kbd': 'Ctrl K',
    'nav.github': 'GitHub',
    'nav.lang.label': 'Language',

    'announce.updated': 'Updated',
    'announce.npmUnpub': 'npm packages not yet published',

    'docs.pager.prev': 'Previous',
    'docs.pager.next': 'Next',
    'docs.comments.title': ' · Discussion',
    'docs.translationPending.title': 'English translation pending',
    'docs.translationPending.body': "This page hasn't been translated yet — falling back to Chinese. PRs welcome on GitHub.",

    'docs.toc.title': 'On this page',

    'comments.eyebrow': 'Feedback & discussion',
    'comments.title': 'Discussion',
    'comments.unavailable.title': 'Comments backend not configured',
    'comments.unavailable.body': 'This page has the comments module wired up. Once Cloudflare Pages Functions and the D1 binding are configured, submissions will land in the moderation queue.',
    'comments.placeholder.nick': 'Nickname',
    'comments.placeholder.body': 'Share suggestions, questions, or usage feedback',
    'comments.emoji.label': 'Emoji',
    'comments.emoji.send': 'Choose emoji',
    'comments.emoji.aria': 'Insert',
    'comments.submit': 'Submit',
    'comments.loading': 'Loading comments…',
    'comments.empty.title': 'No public comments yet',
    'comments.empty.body': 'The first high-quality piece of feedback often saves the next reader a wrong turn.',
    'comments.role.admin': 'Maintainer',
    'comments.notice.submitted': 'Submitted — your comment will appear after moderation.',
    'comments.notice.failed': "Couldn't submit just now, please try again shortly.",
    'comments.notice.needNick': 'Fill in a nickname before submitting.',

    'block.modes.preview': 'Preview',
    'block.modes.code': 'Code',
    'block.copy.cli': 'Copy CLI command',
    'block.copy.copy': 'Copy',
    'block.copy.copied': 'Copied',
    'block.aria.modes': 'Preview / Code',
    'block.aria.files': 'Project files',
    'block.aria.codeFiles': 'Source files',

    'chart.svgOnly': 'must be used inside a parent svg',

    'home.cta.start': 'Get started',
    'home.cta.vanilla': 'Plain HTML usage',
    'home.cta.components': 'Browse components',
    'home.cta.github': 'GitHub →',
    'home.section.why.title': 'Why ChuFix UI',
    'home.feature.dual.title': 'One source, two frameworks',
    'home.feature.dual.body': 'Vue 3 and React share the same design tokens, class names, and interaction behaviors. Move between projects with zero rework.',
    'home.feature.theme.title': 'Zero-runtime theming',
    'home.feature.theme.body': 'Colors, radii, shadows are all CSS variables. Switch themes by toggling [data-theme] — no JS theme factory.',
    'home.feature.usage.title': 'Two ways to use it',
    'home.feature.usage.body': 'Install as a normal package, or copy source into your repo with npx chufix add.',
    'home.feature.html.title': 'Plain HTML works too',
    'home.feature.html.body': 'All visuals come from cf-* CSS classes — you can get 90% of the look without writing a single Vue or React line. One <link> tag is enough.',
    'home.section.demo.title': 'See it live',
    'home.section.demo.lede': 'Real interactive instances below — not screenshots. Code is collapsed by default; expand to switch between Vue / React / CLI and copy.',
    'home.section.has.title': "What's already in",
    'home.section.has.lede': '151+ components covering forms, containers, feedback, data display, navigation, layout, editors, system shells, multi-window, plus 22 charts and 8 page-level templates.',
    'home.section.has.viewAll': 'Full list →',
    'home.footer.license': 'MIT License',
  },
} as const;

type Dict = (typeof dict)['zh'];
export type Key = keyof Dict;

export function t(locale: Locale, key: Key): string {
  return dict[locale][key] ?? dict[DEFAULT_LOCALE][key] ?? key;
}
