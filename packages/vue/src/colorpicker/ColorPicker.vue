<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  formatColor,
  hsvToRgb,
  parseColor,
  rgbToHex,
  rgbToHsv,
  type ColorFormat,
  type HSV,
  type RGBA,
} from './color';
import {
  colorPickerClass,
  DEFAULT_PRESETS,
  type ColorPickerProps,
} from './variants';

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#3b82f6',
  defaultFormat: 'hex',
  showAlpha: false,
  presets: () => DEFAULT_PRESETS,
  disabled: false,
  size: 'md',
  panelOnly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const open = ref(props.panelOnly);
const format = ref<ColorFormat>(props.defaultFormat);
const hsv = ref<HSV>({ h: 220, s: 0.7, v: 0.96 });
const alpha = ref(1);
const inputValue = ref(props.modelValue);
const rootRef = ref<HTMLDivElement | null>(null);
const svRef = ref<HTMLDivElement | null>(null);

function syncFromString(v: string) {
  const parsed = parseColor(v);
  if (!parsed) return;
  const next = rgbToHsv(parsed);
  // Preserve hue when value is achromatic to avoid jumps in hue slider.
  if (next.s > 0) hsv.value = next;
  else hsv.value = { ...hsv.value, s: next.s, v: next.v };
  alpha.value = parsed.a;
}

watch(
  () => props.modelValue,
  (v) => {
    inputValue.value = v;
    syncFromString(v);
  },
  { immediate: true },
);

const rgba = computed<RGBA>(() => {
  const rgb = hsvToRgb(hsv.value);
  return { ...rgb, a: alpha.value };
});

const formatted = computed(() => formatColor(rgba.value, format.value));
const swatchColor = computed(() => rgbToHex({ r: rgba.value.r, g: rgba.value.g, b: rgba.value.b }));

const hueColor = computed(() => {
  const rgb = hsvToRgb({ h: hsv.value.h, s: 1, v: 1 });
  return rgbToHex(rgb);
});

const cls = computed(() =>
  colorPickerClass({
    size: props.size,
    open: open.value,
    disabled: props.disabled,
    panelOnly: props.panelOnly,
  }),
);

function commit() {
  inputValue.value = formatted.value;
  emit('update:modelValue', formatted.value);
  emit('change', formatted.value);
}

function toggle() {
  if (props.disabled || props.panelOnly) return;
  open.value = !open.value;
}

function close() {
  if (!open.value || props.panelOnly) return;
  open.value = false;
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value || rootRef.value.contains(e.target as Node)) return;
  close();
}

watch(open, (v) => {
  if (v) {
    document.addEventListener('mousedown', onDocClick);
  } else {
    document.removeEventListener('mousedown', onDocClick);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});

/* SV plane drag */
function onSvPointer(e: PointerEvent) {
  if (props.disabled) return;
  const el = svRef.value;
  if (!el) return;
  el.setPointerCapture(e.pointerId);
  const rect = el.getBoundingClientRect();
  const update = (clientX: number, clientY: number) => {
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    hsv.value = {
      h: hsv.value.h,
      s: Math.min(1, Math.max(0, x)),
      v: Math.min(1, Math.max(0, 1 - y)),
    };
    commit();
  };
  update(e.clientX, e.clientY);
  const move = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
  const release = (ev: PointerEvent) => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', release);
    el.removeEventListener('pointercancel', release);
    el.releasePointerCapture(ev.pointerId);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
}

function onHueInput(e: Event) {
  const v = +(e.target as HTMLInputElement).value;
  hsv.value = { ...hsv.value, h: v };
  commit();
}

function onAlphaInput(e: Event) {
  const v = +(e.target as HTMLInputElement).value;
  alpha.value = v / 100;
  commit();
}

function onInputChange(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  inputValue.value = v;
  const parsed = parseColor(v);
  if (parsed) {
    syncFromString(v);
    commit();
  }
}

function pickPreset(c: string) {
  if (props.disabled) return;
  syncFromString(c);
  commit();
}

function setFormat(f: ColorFormat) {
  format.value = f;
  inputValue.value = formatColor(rgba.value, f);
}
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      v-if="!panelOnly"
      type="button"
      class="cf-color__trigger"
      :disabled="disabled"
      :aria-haspopup="'dialog'"
      :aria-expanded="open"
      @click="toggle"
    >
      <span
        class="cf-color__swatch"
        :style="{ background: formatted }"
        aria-hidden="true"
      />
      <span class="cf-color__value">{{ formatted }}</span>
    </button>

    <div v-if="open || panelOnly" class="cf-color__panel" role="dialog">
      <div
        ref="svRef"
        class="cf-color__sv"
        :style="{ background: hueColor }"
        @pointerdown="onSvPointer"
      >
        <div class="cf-color__sv-white" />
        <div class="cf-color__sv-black" />
        <div
          class="cf-color__sv-cursor"
          :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }"
        />
      </div>

      <div class="cf-color__sliders">
        <div class="cf-color__preview">
          <span
            class="cf-color__preview-swatch"
            :style="{ background: formatted }"
          />
          <span
            v-if="showAlpha"
            class="cf-color__preview-swatch cf-color__preview-swatch--solid"
            :style="{ background: swatchColor }"
          />
        </div>

        <div class="cf-color__slider-group">
          <input
            type="range"
            class="cf-color__slider cf-color__slider--hue"
            min="0"
            max="360"
            step="1"
            :value="hsv.h"
            :disabled="disabled"
            aria-label="色相"
            @input="onHueInput"
          />
          <input
            v-if="showAlpha"
            type="range"
            class="cf-color__slider cf-color__slider--alpha"
            :style="{ '--solid': swatchColor }"
            min="0"
            max="100"
            step="1"
            :value="Math.round(alpha * 100)"
            :disabled="disabled"
            aria-label="透明度"
            @input="onAlphaInput"
          />
        </div>
      </div>

      <div class="cf-color__formats">
        <button
          v-for="f in (['hex', 'rgb', 'hsl'] as const)"
          :key="f"
          type="button"
          class="cf-color__format"
          :class="format === f && 'is-active'"
          @click="setFormat(f)"
        >
          {{ f.toUpperCase() }}
        </button>
      </div>

      <input
        type="text"
        class="cf-color__input"
        :value="inputValue"
        :disabled="disabled"
        spellcheck="false"
        @input="(e) => (inputValue = (e.target as HTMLInputElement).value)"
        @change="onInputChange"
        @keydown.enter="onInputChange"
      />

      <div v-if="presets.length" class="cf-color__presets">
        <button
          v-for="c in presets"
          :key="c"
          type="button"
          class="cf-color__preset"
          :style="{ background: c }"
          :aria-label="c"
          :title="c"
          @click="pickPreset(c)"
        />
      </div>
    </div>
  </div>
</template>
