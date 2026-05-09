<script setup lang="ts">
import { computed } from 'vue';
import {
  ALL_FLAGS,
  compileAndMatch,
  highlightMatches,
  type RegexBuilderProps,
  type RegexFlag,
} from './variants';

const props = withDefaults(defineProps<RegexBuilderProps>(), {
  pattern: '',
  flags: 'g',
  testText: '',
  size: 'md',
  patternPlaceholder: '正则表达式',
  testPlaceholder: '在此粘贴待测试文本…',
});

const emit = defineEmits<{
  (e: 'update:pattern', value: string): void;
  (e: 'update:flags', value: string): void;
  (e: 'update:testText', value: string): void;
}>();

const result = computed(() =>
  compileAndMatch(props.pattern, props.flags, props.testText),
);

const highlighted = computed(() =>
  highlightMatches(props.testText, result.value.matches).parts,
);

const cls = computed(() => [
  'cf-regex',
  `cf-regex--${props.size}`,
  !result.value.ok && 'is-error',
]);

function toggleFlag(flag: RegexFlag) {
  const cur = props.flags;
  const next = cur.includes(flag)
    ? cur.replace(flag, '')
    : cur + flag;
  emit('update:flags', next);
}
</script>

<template>
  <div :class="cls">
    <div class="cf-regex__pattern">
      <span class="cf-regex__delim">/</span>
      <input
        type="text"
        class="cf-regex__pattern-input"
        :value="pattern"
        :placeholder="patternPlaceholder"
        spellcheck="false"
        autocomplete="off"
        @input="(e) => emit('update:pattern', (e.target as HTMLInputElement).value)"
      />
      <span class="cf-regex__delim">/</span>
      <span class="cf-regex__flags-text">{{ flags }}</span>
    </div>
    <div class="cf-regex__flags" role="group" aria-label="正则标志">
      <button
        v-for="f in ALL_FLAGS"
        :key="f.flag"
        type="button"
        class="cf-regex__flag"
        :title="f.desc"
        :aria-pressed="flags.includes(f.flag)"
        @click="toggleFlag(f.flag)"
      >
        {{ f.label }}
      </button>
    </div>
    <div v-if="!result.ok" class="cf-regex__error">
      <strong>正则编译错误：</strong>{{ result.error }}
    </div>
    <textarea
      class="cf-regex__test"
      :value="testText"
      :placeholder="testPlaceholder"
      rows="6"
      spellcheck="false"
      @input="(e) => emit('update:testText', (e.target as HTMLTextAreaElement).value)"
    />
    <div class="cf-regex__output">
      <div class="cf-regex__output-head">
        匹配 <strong>{{ result.matches.length }}</strong> 处
      </div>
      <div class="cf-regex__output-body">
        <template v-for="(p, i) in highlighted" :key="i">
          <span v-if="p.match" class="cf-regex__hit">{{ p.text }}</span>
          <span v-else>{{ p.text }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
