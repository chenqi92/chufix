<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CodeBlock from './CodeBlock.vue';
import CodeEditor from '../codeeditor/CodeEditor.vue';
import {
  buildCodeTree,
  codeFileId,
  codeFileLanguage,
  codeFileName,
  codeWorkspaceClass,
  normalizeCodeIndent,
  type CodeWorkspaceBundle,
  type CodeWorkspaceFile,
  type CodeWorkspaceProps,
} from './variants';

const props = withDefaults(defineProps<CodeWorkspaceProps>(), {
  rootLabel: 'project',
  size: 'md',
  showLineNumbers: true,
  copyable: true,
  editable: false,
  readOnly: false,
  wrap: false,
  tone: 'auto',
  trimIndent: false,
  highlight: true,
});

const emit = defineEmits<{
  (e: 'update:activeFile', value: string): void;
  (e: 'update:activeBundle', value: string): void;
  (e: 'change', payload: { file: CodeWorkspaceFile; value: string }): void;
}>();

/* ---------- 模式判断：bundles 优先于 files ---------- */
const isBundleMode = computed(() => Array.isArray(props.bundles) && props.bundles.length > 0);
const bundles = computed<CodeWorkspaceBundle[]>(() => props.bundles ?? []);

/* ---------- 当前激活 bundle ---------- */
const initialBundleId = computed(() => {
  if (!isBundleMode.value) return '';
  if (props.activeBundle && bundles.value.some((b) => b.id === props.activeBundle)) return props.activeBundle;
  if (props.defaultBundle && bundles.value.some((b) => b.id === props.defaultBundle)) return props.defaultBundle;
  return bundles.value[0]?.id ?? '';
});
const innerBundle = ref(initialBundleId.value);
watch(
  () => props.activeBundle,
  (next) => {
    if (next && bundles.value.some((b) => b.id === next)) innerBundle.value = next;
  },
);
watch(
  () => bundles.value.map((b) => b.id).join('|'),
  () => {
    if (!bundles.value.some((b) => b.id === innerBundle.value)) {
      innerBundle.value = bundles.value[0]?.id ?? '';
    }
  },
);
const activeBundleId = computed(() => (props.activeBundle ?? innerBundle.value));
const activeBundle = computed(() => bundles.value.find((b) => b.id === activeBundleId.value));

/* ---------- 框架 / 变体 tab ---------- */
const frameworkOrder = computed(() => {
  const out: string[] = [];
  for (const b of bundles.value) {
    if (b.framework === 'neutral') continue;
    if (!out.includes(b.framework as string)) out.push(b.framework as string);
  }
  return out;
});
const frameworkLabel = computed(() => {
  const map: Record<string, string> = {};
  for (const b of bundles.value) {
    if (b.framework === 'neutral') continue;
    map[b.framework as string] ??= b.frameworkLabel;
  }
  return map;
});
const activeFramework = computed(() => activeBundle.value?.framework ?? 'neutral');
const showFrameworkTabs = computed(() => isBundleMode.value && frameworkOrder.value.length > 1);
const showVariantTabs = computed(() => {
  if (!isBundleMode.value) return false;
  return bundles.value.some((b) => {
    if (b.framework === 'neutral') return false;
    return bundles.value.some(
      (o) => o !== b && o.framework === b.framework && o.variant !== b.variant,
    );
  });
});
function firstBundleOfFramework(framework: string): string {
  return bundles.value.find((b) => b.framework === framework)?.id ?? '';
}
function selectBundle(id: string) {
  if (!id || id === activeBundleId.value) return;
  innerBundle.value = id;
  emit('update:activeBundle', id);
  // bundle 切换时把 active 文件落到该 bundle 的第一个文件
  const bundle = bundles.value.find((b) => b.id === id);
  const firstFile = bundle?.files[0];
  if (firstFile) {
    const fid = codeFileId(firstFile);
    innerActive.value = fid;
    emit('update:activeFile', fid);
  }
}

/* ---------- 当前可见的 files（来自激活 bundle 或 props.files） ---------- */
const visibleFiles = computed<CodeWorkspaceFile[]>(() => {
  if (isBundleMode.value) return activeBundle.value?.files ?? [];
  return props.files ?? [];
});

/* ---------- 当前激活文件（沿用旧逻辑） ---------- */
const fallbackId = computed(() => {
  const first = visibleFiles.value[0];
  return first ? codeFileId(first) : '';
});

const innerActive = ref(props.activeFile ?? props.defaultFile ?? fallbackId.value);
const draftValues = ref<Record<string, string>>({});
const copyState = ref<'idle' | 'copied'>('idle');

watch(
  () => props.activeFile,
  (next) => {
    if (next) innerActive.value = next;
  },
);

watch(fallbackId, (next) => {
  if (!visibleFiles.value.some((file) => codeFileId(file) === innerActive.value)) {
    innerActive.value = next;
  }
});

const activeId = computed(() => props.activeFile ?? innerActive.value);
const activeFile = computed(() =>
  visibleFiles.value.find((file) => codeFileId(file) === activeId.value) ?? visibleFiles.value[0],
);
const activeLanguage = computed(() => activeFile.value ? codeFileLanguage(activeFile.value) : 'plaintext');
const treeItems = computed(() => buildCodeTree(visibleFiles.value));

const activeCode = computed(() => {
  if (!activeFile.value) return '';
  const id = codeFileId(activeFile.value);
  const value = draftValues.value[id] ?? activeFile.value.content;
  return props.trimIndent && !props.editable ? normalizeCodeIndent(value) : value;
});

const cls = computed(() =>
  codeWorkspaceClass({
    size: props.size,
    showLineNumbers: props.showLineNumbers,
    editable: props.editable,
    wrap: props.wrap,
    tone: props.tone,
    className: props.className,
  }),
);

const heightStyle = computed(() => {
  if (props.height == null) return undefined;
  return {
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  };
});

function selectFile(file?: CodeWorkspaceFile) {
  if (!file) return;
  const id = codeFileId(file);
  innerActive.value = id;
  emit('update:activeFile', id);
}

function updateCode(value: string) {
  if (!activeFile.value) return;
  const id = codeFileId(activeFile.value);
  draftValues.value = { ...draftValues.value, [id]: value };
  emit('change', { file: activeFile.value, value });
}

async function copy() {
  if (!activeFile.value) return;
  try {
    await navigator.clipboard.writeText(activeCode.value);
    copyState.value = 'copied';
    setTimeout(() => (copyState.value = 'idle'), 1500);
  } catch (e) {
    /* clipboard blocked */
  }
}
</script>

<template>
  <div
    :class="cls"
    :style="heightStyle"
    :data-active-framework="activeFramework"
    :data-active-bundle="activeBundleId || undefined"
  >
    <header v-if="title || copyable" class="cf-code-workspace__header">
      <div class="cf-code-workspace__title">
        <span class="cf-code-workspace__traffic" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
        <span v-if="title">{{ title }}</span>
      </div>
      <button
        v-if="copyable && activeFile"
        type="button"
        class="cf-code-workspace__copy"
        :aria-label="copyState === 'copied' ? '已复制' : '复制代码'"
        @click="copy"
      >
        {{ copyState === 'copied' ? '已复制' : '复制' }}
      </button>
    </header>

    <div
      v-if="showFrameworkTabs || showVariantTabs"
      class="cf-code-workspace__bundles"
      role="tablist"
      aria-label="Framework"
    >
      <div v-if="showFrameworkTabs" class="cf-code-workspace__frameworks">
        <button
          v-for="framework in frameworkOrder"
          :key="framework"
          type="button"
          class="cf-code-workspace__framework-tab"
          :aria-selected="activeFramework === framework ? 'true' : 'false'"
          @click="selectBundle(firstBundleOfFramework(framework))"
        >
          {{ frameworkLabel[framework] }}
        </button>
      </div>
      <div v-if="showVariantTabs" class="cf-code-workspace__variants">
        <template v-for="bundle in bundles" :key="bundle.id">
          <button
            v-if="bundle.framework !== 'neutral' && bundle.framework === activeFramework"
            type="button"
            class="cf-code-workspace__variant-tab"
            :aria-selected="bundle.id === activeBundleId ? 'true' : 'false'"
            @click="selectBundle(bundle.id)"
          >
            {{ bundle.variantLabel }}
          </button>
        </template>
      </div>
    </div>

    <div class="cf-code-workspace__shell">
      <aside class="cf-code-workspace__tree" aria-label="Code files">
        <div class="cf-code-workspace__root">
          <span class="cf-code-workspace__folder-icon" aria-hidden="true"></span>
          <span>{{ rootLabel }}</span>
        </div>
        <template v-for="item in treeItems" :key="item.id">
          <div
            v-if="item.kind === 'folder'"
            class="cf-code-workspace__folder"
            :style="{ '--cf-code-tree-indent': `${item.depth * 14}px` }"
          >
            <span class="cf-code-workspace__folder-icon" aria-hidden="true"></span>
            <span>{{ item.name }}</span>
          </div>
          <button
            v-else
            type="button"
            class="cf-code-workspace__file"
            :style="{ '--cf-code-tree-indent': `${item.depth * 14}px` }"
            :aria-selected="item.file && codeFileId(item.file) === activeId ? 'true' : 'false'"
            @click="selectFile(item.file)"
          >
            <span class="cf-code-workspace__file-dot" aria-hidden="true"></span>
            <span class="cf-code-workspace__file-name">{{ item.name }}</span>
          </button>
        </template>
      </aside>

      <section class="cf-code-workspace__editor" aria-live="polite">
        <div v-if="activeFile" class="cf-code-workspace__tabs" role="tablist">
          <button
            v-for="file in visibleFiles"
            :key="codeFileId(file)"
            type="button"
            class="cf-code-workspace__tab"
            :aria-selected="codeFileId(file) === activeId ? 'true' : 'false'"
            @click="selectFile(file)"
          >
            {{ codeFileName(file.name) }}
          </button>
        </div>

        <div v-if="activeFile" class="cf-code-workspace__meta">
          <span>{{ activeFile.name }}</span>
          <span class="cf-code-workspace__lang">{{ activeLanguage }}</span>
        </div>

        <div class="cf-code-workspace__body">
          <CodeEditor
            v-if="editable && activeFile"
            :model-value="activeCode"
            :language="activeLanguage"
            :show-line-numbers="showLineNumbers"
            :read-only="readOnly || activeFile.readonly"
            :wrap="wrap"
            :rows="18"
            @update:model-value="updateCode"
          />
          <slot
            v-else-if="activeFile"
            name="code"
            :file="activeFile"
            :code="activeCode"
            :language="activeLanguage"
          >
            <CodeBlock
              :code="activeFile.content"
              :language="activeLanguage"
              :show-line-numbers="showLineNumbers"
              :copyable="false"
              :wrap="wrap"
              :tone="tone"
              :trim-indent="trimIndent"
              :highlight="highlight"
              :highlighted-html="activeFile.highlightedHtml"
              class-name="cf-code-workspace__block"
            />
          </slot>
        </div>
      </section>
    </div>
  </div>
</template>
