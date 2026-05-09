<script setup lang="ts">
import { computed, ref } from 'vue';
import { iconNames, type IconName } from '@chufix/icons';
import { CfIcon } from '@chufix/vue';

type IconCategory = {
  id: string;
  label: string;
  hint: string;
  names: IconName[];
};

const categories: IconCategory[] = [
  {
    id: 'direction',
    label: '方向导航',
    hint: '箭头、折叠、跳转、路由',
    names: [
      'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right', 'arrow-down-left',
      'arrow-up-left', 'arrow-down-right', 'chevron-right', 'chevron-left', 'chevron-down',
      'chevron-up', 'caret-right', 'caret-left', 'caret-up', 'caret-down', 'corner-down-right',
      'corner-up-left', 'enter', 'exit', 'undo', 'redo', 'shuffle', 'repeat', 'expand', 'collapse',
    ] as IconName[],
  },
  {
    id: 'status',
    label: '状态反馈',
    hint: '校验、提示、加载、形状',
    names: [
      'check', 'check-circle', 'x', 'x-circle', 'alert', 'alert-circle', 'info', 'help',
      'spinner', 'loader', 'plus-circle', 'minus-circle', 'ban', 'verified', 'circle', 'square',
      'triangle', 'diamond',
    ] as IconName[],
  },
  {
    id: 'action',
    label: '常用操作',
    hint: '增删改查、复制、导入导出',
    names: [
      'plus', 'minus', 'search', 'filter', 'sort', 'refresh', 'copy', 'edit', 'trash', 'save',
      'download', 'upload', 'import', 'export', 'external', 'link', 'drag', 'more-h', 'more-v',
      'send', 'share', 'print',
    ] as IconName[],
  },
  {
    id: 'file',
    label: '文件文档',
    hint: '文件、目录、书籍、剪贴板',
    names: [
      'folder', 'folder-open', 'file', 'file-text', 'file-code', 'file-json', 'file-image',
      'file-archive', 'book', 'docs', 'clipboard', 'quote',
    ] as IconName[],
  },
  {
    id: 'interface',
    label: '界面布局',
    hint: '窗口、面板、菜单、组件结构',
    names: [
      'home', 'grid', 'list', 'columns', 'rows', 'layout', 'panel-left', 'panel-right',
      'panel-top', 'panel-bottom', 'split-h', 'split-v', 'sidebar', 'dock', 'window', 'modal',
      'drawer', 'popover', 'tabs', 'menu', 'toolbar', 'fullscreen', 'component', 'theme-token',
      'variant', 'slot', 'props', 'event', 'hook',
    ] as IconName[],
  },
  {
    id: 'identity',
    label: '用户安全',
    hint: '账号、权限、认证、隐私',
    names: [
      'user', 'users', 'user-plus', 'user-minus', 'role', 'shield', 'shield-check', 'permission',
      'lock', 'unlock', 'key', 'api-key', 'token', 'fingerprint', 'eye', 'eye-off', 'pin', 'star',
    ] as IconName[],
  },
  {
    id: 'data',
    label: '数据图表',
    hint: '表格、关系、趋势、公式',
    names: [
      'table', 'tree', 'node', 'chart-line', 'chart-bar', 'chart-pie', 'trend-up', 'trend-down',
      'sigma', 'braces', 'brackets', 'database', 'schema', 'json-tree', 'diff', 'activity',
    ] as IconName[],
  },
  {
    id: 'dev',
    label: '开发技术',
    hint: '代码、服务、网络、发布',
    names: [
      'terminal', 'command', 'code', 'bug', 'cloud', 'cloud-upload', 'cloud-download', 'server',
      'cpu', 'network', 'globe', 'protocol', 'endpoint', 'request', 'response', 'git-branch',
      'git-commit', 'git-merge', 'workflow', 'sandbox', 'rocket', 'lab', 'plug', 'package',
      'toolbox', 'mock', 'gauge', 'puzzle', 'store',
    ] as IconName[],
  },
  {
    id: 'media',
    label: '媒体设备',
    hint: '图片、音视频、设备、播放',
    names: [
      'image', 'video', 'camera', 'film', 'music', 'mic', 'volume', 'volume-off', 'headphones',
      'play', 'pause', 'stop', 'record', 'monitor', 'mobile', 'keyboard', 'mouse', 'pointer', 'hand',
    ] as IconName[],
  },
  {
    id: 'content',
    label: '内容编辑',
    hint: '文本、段落、排版、格式',
    names: [
      'bold', 'italic', 'underline', 'strikethrough', 'align-left', 'align-center', 'align-right',
      'align-justify', 'paragraph', 'type', 'text-cursor', 'list-ordered', 'hash', 'percent',
      'at-sign', 'mail', 'phone', 'language',
    ] as IconName[],
  },
  {
    id: 'business',
    label: '业务场景',
    hint: '位置、交易、时间、主题',
    names: [
      'calendar', 'clock', 'tag', 'color-swatch', 'palette', 'map', 'map-pin', 'compass',
      'navigation', 'location', 'route', 'cart', 'credit-card', 'wallet', 'receipt', 'gift',
      'ticket', 'bell', 'bell-off', 'settings', 'sliders', 'sun', 'moon', 'zap',
    ] as IconName[],
  },
];

const query = ref('');
const activeCategory = ref('all');
const copied = ref('');

const availableNames = new Set<IconName>(iconNames);
const listedNames = new Set<IconName>();

const normalizedCategories = categories
  .map((category) => {
    const names = category.names.filter((name) => {
      if (!availableNames.has(name)) return false;
      listedNames.add(name);
      return true;
    });
    return { ...category, names };
  })
  .filter((category) => category.names.length > 0);

const uncategorizedNames = iconNames.filter((name) => !listedNames.has(name));

const allCategories = computed<IconCategory[]>(() => [
  {
    id: 'all',
    label: '全部',
    hint: '当前内置图标',
    names: iconNames,
  },
  ...normalizedCategories,
  ...(uncategorizedNames.length
    ? [{
        id: 'more',
        label: '其他',
        hint: '未归入主分类',
        names: uncategorizedNames,
      }]
    : []),
]);

const selectedCategory = computed(() => (
  allCategories.value.find((category) => category.id === activeCategory.value) ?? allCategories.value[0]
));

const filteredIcons = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  const names = selectedCategory.value.names;

  if (!keyword) return names;
  return names.filter((name) => name.includes(keyword));
});

const visibleSections = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  const source = activeCategory.value === 'all' && !keyword ? normalizedCategories : [selectedCategory.value];

  return source
    .map((category) => {
      const names = keyword
        ? category.names.filter((name) => name.includes(keyword))
        : category.names;
      return { ...category, names };
    })
    .filter((category) => category.names.length > 0);
});

const copiedSnippet = computed(() => (
  copied.value ? `<CfIcon name="${copied.value}" />` : '<CfIcon name="search" />'
));

function categoryCount(category: IconCategory) {
  const keyword = query.value.trim().toLowerCase();
  if (!keyword) return category.names.length;
  return category.names.filter((name) => name.includes(keyword)).length;
}

async function copyIcon(name: IconName) {
  const snippet = `<CfIcon name="${name}" />`;
  try {
    await navigator.clipboard.writeText(snippet);
    copied.value = name;
    window.setTimeout(() => {
      if (copied.value === name) copied.value = '';
    }, 1400);
  } catch {
    copied.value = '';
  }
}
</script>

<template>
  <div class="icon-gallery">
    <div class="icon-gallery__tools">
      <label class="icon-gallery__search">
        <span>搜索图标</span>
        <input v-model="query" type="search" placeholder="search, table, calendar..." />
      </label>

      <div class="icon-gallery__usage" aria-live="polite">
        <span>{{ copied ? '已复制' : '点击图标复制' }}</span>
        <code>{{ copiedSnippet }}</code>
      </div>
    </div>

    <div class="icon-gallery__tabs" role="tablist" aria-label="图标分类">
      <button
        v-for="category in allCategories"
        :key="category.id"
        class="icon-gallery__tab"
        :class="{ 'is-active': activeCategory === category.id }"
        type="button"
        role="tab"
        :aria-selected="activeCategory === category.id"
        @click="activeCategory = category.id"
      >
        <span>{{ category.label }}</span>
        <em>{{ categoryCount(category) }}</em>
      </button>
    </div>

    <div v-if="filteredIcons.length" class="icon-gallery__sections">
      <section
        v-for="section in visibleSections"
        :key="section.id"
        class="icon-gallery__section"
      >
        <div class="icon-gallery__section-head">
          <div>
            <h3>{{ section.label }}</h3>
            <p>{{ section.hint }}</p>
          </div>
          <span>{{ section.names.length }} 个</span>
        </div>

        <div class="icon-gallery__grid">
          <button
            v-for="name in section.names"
            :key="name"
            class="icon-gallery__item"
            type="button"
            :aria-label="`复制 <CfIcon name=&quot;${name}&quot; />`"
            @click="copyIcon(name)"
          >
            <span class="icon-gallery__preview">
              <CfIcon :name="name" size="xl" />
            </span>
            <span class="icon-gallery__name">{{ name }}</span>
            <span class="icon-gallery__copy">{{ copied === name ? '已复制' : '复制 CfIcon' }}</span>
          </button>
        </div>
      </section>
    </div>

    <div v-else class="icon-gallery__empty">
      没有匹配的图标
    </div>
  </div>
</template>

<style scoped>
.icon-gallery {
  display: grid;
  gap: 18px;
  width: 100%;
}

.icon-gallery__tools {
  display: grid;
  grid-template-columns: minmax(220px, 360px) minmax(0, 1fr);
  gap: 12px;
  align-items: end;
}

.icon-gallery__search {
  display: grid;
  gap: 6px;
  color: var(--fg-2);
  font-size: var(--t-12);
}

.icon-gallery__search input {
  width: 100%;
  height: 36px;
  padding: 0 11px;
  border: 1px solid var(--line-2);
  border-radius: var(--r-6);
  background: var(--bg-inset);
  color: var(--fg-1);
  font: inherit;
  font-size: var(--t-13);
}

.icon-gallery__search input:focus {
  outline: none;
  border-color: var(--accent-1);
  box-shadow: var(--focus-ring-inset);
}

.icon-gallery__usage {
  display: flex;
  min-width: 0;
  min-height: 36px;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  color: var(--fg-3);
  font-size: var(--t-12);
}

.icon-gallery__usage code {
  overflow: hidden;
  max-width: 100%;
  padding: 5px 8px;
  border-radius: var(--r-4);
  background: var(--bg-2);
  color: var(--fg-1);
  font-size: var(--t-12);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-gallery__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-gallery__tab {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
  color: var(--fg-2);
  cursor: pointer;
  font: inherit;
  font-size: var(--t-12);
}

.icon-gallery__tab:hover {
  border-color: var(--line-2);
  color: var(--fg-1);
}

.icon-gallery__tab:focus-visible,
.icon-gallery__item:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.icon-gallery__tab.is-active {
  border-color: var(--accent-1);
  background: var(--accent-soft);
  color: var(--accent-1);
}

.icon-gallery__tab em {
  color: var(--fg-3);
  font-style: normal;
}

.icon-gallery__sections {
  display: grid;
  gap: 22px;
}

.icon-gallery__section {
  display: grid;
  gap: 10px;
}

.icon-gallery__section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.icon-gallery__section-head h3 {
  margin: 0;
  color: var(--fg-1);
  font-size: var(--t-16);
  letter-spacing: 0;
}

.icon-gallery__section-head p {
  margin: 3px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}

.icon-gallery__section-head > span {
  flex: 0 0 auto;
  color: var(--fg-3);
  font-size: var(--t-12);
}

.icon-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 8px;
}

.icon-gallery__item {
  display: grid;
  min-width: 0;
  min-height: 112px;
  align-content: center;
  justify-items: center;
  gap: 8px;
  padding: 12px 8px 10px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
  color: var(--fg-2);
  cursor: pointer;
  font: inherit;
  text-align: center;
}

.icon-gallery__item:hover {
  border-color: var(--accent-1);
  background: var(--bg-2);
  color: var(--fg-1);
}

.icon-gallery__preview {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-inset);
  color: var(--fg-1);
}

.icon-gallery__name {
  overflow: hidden;
  width: 100%;
  color: var(--fg-1);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-gallery__copy {
  color: var(--fg-3);
  font-size: var(--t-11);
}

.icon-gallery__item:hover .icon-gallery__copy {
  color: var(--accent-1);
}

.icon-gallery__empty {
  display: grid;
  min-height: 120px;
  place-items: center;
  border: 1px dashed var(--line-2);
  border-radius: var(--r-6);
  color: var(--fg-3);
  font-size: var(--t-13);
}

@media (max-width: 720px) {
  .icon-gallery__tools {
    grid-template-columns: 1fr;
  }

  .icon-gallery__usage {
    justify-content: flex-start;
  }

  .icon-gallery__grid {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  }
}
</style>
