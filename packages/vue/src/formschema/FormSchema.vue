<script setup lang="ts">
import { computed } from 'vue';
import FieldRow from '../fieldrow/FieldRow.vue';
import type { FormFieldDef, FormSchemaProps } from './variants';

const props = withDefaults(defineProps<FormSchemaProps>(), {
  layout: 'vertical',
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, unknown>): void;
  (e: 'field-change', name: string, value: unknown): void;
}>();

function setField(name: string, value: unknown) {
  const next = { ...props.modelValue, [name]: value };
  emit('update:modelValue', next);
  emit('field-change', name, value);
}

function fieldId(name: string) {
  return `cf-form-${name}`;
}

const formattedFields = computed(() => props.fields);
</script>

<template>
  <div class="cf-formschema">
    <FieldRow
      v-for="f in formattedFields"
      :key="f.name"
      :label="f.label"
      :hint="f.hint"
      :required="f.required"
      :error="errors?.[f.name]"
      :html-for="fieldId(f.name)"
      :layout="layout"
      :size="size"
      :style="f.span && f.span > 1 ? { gridColumn: `span ${f.span}` } : undefined"
    >
      <!-- text / password -->
      <input
        v-if="f.type === 'text' || f.type === 'password'"
        :id="fieldId(f.name)"
        :type="f.type"
        class="cf-input"
        :placeholder="f.placeholder"
        :disabled="disabled || f.disabled"
        :value="(modelValue as Record<string, unknown>)[f.name] ?? ''"
        @input="setField(f.name, ($event.target as HTMLInputElement).value)"
      />
      <!-- number -->
      <input
        v-else-if="f.type === 'number'"
        :id="fieldId(f.name)"
        type="number"
        class="cf-input"
        :placeholder="f.placeholder"
        :disabled="disabled || f.disabled"
        :min="f.min"
        :max="f.max"
        :step="f.step"
        :value="(modelValue as Record<string, unknown>)[f.name] ?? ''"
        @input="setField(f.name, ($event.target as HTMLInputElement).valueAsNumber)"
      />
      <!-- textarea -->
      <textarea
        v-else-if="f.type === 'textarea'"
        :id="fieldId(f.name)"
        class="cf-textarea"
        :placeholder="f.placeholder"
        :disabled="disabled || f.disabled"
        :value="((modelValue as Record<string, unknown>)[f.name] ?? '') as string"
        @input="setField(f.name, ($event.target as HTMLTextAreaElement).value)"
      />
      <!-- select -->
      <select
        v-else-if="f.type === 'select'"
        :id="fieldId(f.name)"
        class="cf-input"
        :disabled="disabled || f.disabled"
        :value="(modelValue as Record<string, unknown>)[f.name] ?? ''"
        @change="setField(f.name, ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="f.placeholder" value="" disabled>{{ f.placeholder }}</option>
        <option v-for="opt in f.options ?? []" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option>
      </select>
      <!-- checkbox -->
      <label v-else-if="f.type === 'checkbox'" class="cf-formschema__checkbox">
        <input
          :id="fieldId(f.name)"
          type="checkbox"
          :disabled="disabled || f.disabled"
          :checked="Boolean((modelValue as Record<string, unknown>)[f.name])"
          @change="setField(f.name, ($event.target as HTMLInputElement).checked)"
        />
        <span>{{ f.placeholder ?? '' }}</span>
      </label>
      <!-- switch (visual diff via class) -->
      <label v-else-if="f.type === 'switch'" class="cf-formschema__switch">
        <input
          :id="fieldId(f.name)"
          type="checkbox"
          role="switch"
          :disabled="disabled || f.disabled"
          :checked="Boolean((modelValue as Record<string, unknown>)[f.name])"
          @change="setField(f.name, ($event.target as HTMLInputElement).checked)"
        />
        <span class="cf-formschema__switch-track"><span class="cf-formschema__switch-thumb" /></span>
        <span v-if="f.placeholder" class="cf-formschema__switch-label">{{ f.placeholder }}</span>
      </label>
      <!-- radio group -->
      <div v-else-if="f.type === 'radio'" class="cf-formschema__radio-group" role="radiogroup">
        <label v-for="opt in f.options ?? []" :key="String(opt.value)" class="cf-formschema__radio">
          <input
            type="radio"
            :name="f.name"
            :value="opt.value"
            :checked="(modelValue as Record<string, unknown>)[f.name] === opt.value"
            :disabled="disabled || f.disabled"
            @change="setField(f.name, opt.value)"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </FieldRow>
  </div>
</template>
