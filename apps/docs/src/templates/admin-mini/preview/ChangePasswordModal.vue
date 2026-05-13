<script setup lang="ts">
/** 修改密码 modal：演示态，本地校验，不接后端。 */
import { computed, inject, ref, watch } from 'vue';
import { CfModal, CfForm, CfFormField, CfInput, CfPasswordStrength, toast } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from './state';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const form = ref({ current: '', next: '', confirm: '' });

watch(() => props.open, (v) => {
  if (v) form.value = { current: '', next: '', confirm: '' };
});

function submit(): boolean {
  if (!form.value.current || !form.value.next || !form.value.confirm) {
    toast.error(state.locale.value === 'zh' ? '请填写完整' : 'Please fill in all fields');
    return false;
  }
  if (form.value.next !== form.value.confirm) {
    toast.error(t.value.password_mismatch);
    return false;
  }
  toast.success(t.value.password_changed);
  return true;
}
</script>

<template>
  <CfModal
    :open="props.open"
    :title="t.change_password"
    size="sm"
    :ok-text="t.save"
    :cancel-text="t.cancel"
    :on-before-ok="submit"
    @update:open="(v) => emit('update:open', v)"
  >
    <CfForm :model="form" layout="vertical">
      <CfFormField :label="t.current_password" name="current">
        <CfInput v-model="form.current" type="password" />
      </CfFormField>
      <CfFormField :label="t.new_password" name="next">
        <CfInput v-model="form.next" type="password" />
        <CfPasswordStrength v-if="form.next" :value="form.next" size="sm" style="margin-top: 6px;" />
      </CfFormField>
      <CfFormField :label="t.confirm_password" name="confirm">
        <CfInput v-model="form.confirm" type="password" />
      </CfFormField>
    </CfForm>
  </CfModal>
</template>
