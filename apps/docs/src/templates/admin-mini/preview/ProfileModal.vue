<script setup lang="ts">
/** 个人中心 modal：账号基本信息（演示态，本地保存）。 */
import { computed, inject, ref, watch } from 'vue';
import { CfModal, CfForm, CfFormField, CfInput, CfSelect, CfAvatar, toast } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from './state';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const form = ref({
  username: 'admin',
  name: '系统管理员',
  email: 'admin@chufix.dev',
  phone: '13800000001',
  role: '超级管理员',
});

// 每次开启时重置（演示用，无后端持久化）
watch(() => props.open, (v) => {
  if (v) {
    form.value = {
      username: 'admin',
      name: '系统管理员',
      email: 'admin@chufix.dev',
      phone: '13800000001',
      role: '超级管理员',
    };
  }
});

function save() {
  toast.success(t.value.profile_saved);
  emit('update:open', false);
}
</script>

<template>
  <CfModal
    :open="props.open"
    :title="t.profile"
    size="md"
    :ok-text="t.save"
    :cancel-text="t.cancel"
    :on-before-ok="() => { save(); return true; }"
    @update:open="(v) => emit('update:open', v)"
  >
    <div class="adm-profile">
      <div class="adm-profile__avatar">
        <CfAvatar name="Admin" size="xl" />
        <div class="adm-profile__name">
          <strong>{{ form.name }}</strong>
          <span>{{ form.username }} · {{ form.role }}</span>
        </div>
      </div>
      <CfForm :model="form" layout="vertical">
        <CfFormField :label="t.col_name" name="name">
          <CfInput v-model="form.name" />
        </CfFormField>
        <CfFormField :label="t.col_email" name="email">
          <CfInput v-model="form.email" type="email" />
        </CfFormField>
        <CfFormField :label="t.col_phone" name="phone">
          <CfInput v-model="form.phone" />
        </CfFormField>
      </CfForm>
    </div>
  </CfModal>
</template>

<style scoped>
.adm-profile { display: flex; flex-direction: column; gap: 16px; }
.adm-profile__avatar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-1);
}
.adm-profile__name { display: flex; flex-direction: column; gap: 2px; }
.adm-profile__name strong { color: var(--fg-1); font-size: var(--t-14); }
.adm-profile__name span { color: var(--fg-3); font-size: var(--t-12); }
</style>
