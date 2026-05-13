// admin-mini 演示的全局 UI 状态：主题 / 密度 / 菜单形态 / accent 色 / 语言。
// React 端用 Context 把状态下发到所有 page。

import { createContext, type Dispatch, type SetStateAction } from 'react';

export type DemoTheme = 'dark-cool' | 'dark-warm' | 'light';
export type DemoDensity = 'comfortable' | 'compact';
export type DemoMenuForm = 'sidebar' | 'topbar' | 'collapsed';
export type DemoAccent = 'blue' | 'green' | 'purple' | 'orange' | 'rose';
export type DemoLocale = 'zh' | 'en';

export interface DemoState {
  theme: DemoTheme;
  setTheme: Dispatch<SetStateAction<DemoTheme>>;
  density: DemoDensity;
  setDensity: Dispatch<SetStateAction<DemoDensity>>;
  menuForm: DemoMenuForm;
  setMenuForm: Dispatch<SetStateAction<DemoMenuForm>>;
  accent: DemoAccent;
  setAccent: Dispatch<SetStateAction<DemoAccent>>;
  locale: DemoLocale;
  setLocale: Dispatch<SetStateAction<DemoLocale>>;
}

export const DemoContext = createContext<DemoState | null>(null);

export const ACCENT_HUE: Record<DemoAccent, string> = {
  blue:   'oklch(64% 0.16 263)',
  green:  'oklch(68% 0.16 150)',
  purple: 'oklch(64% 0.18 300)',
  orange: 'oklch(72% 0.16 60)',
  rose:   'oklch(66% 0.18 15)',
};

export interface DemoStrings {
  brand: string;
  switch_theme: string;
  switch_density: string;
  switch_menu: string;
  switch_accent: string;
  switch_locale: string;
  view_source: string;
  hide_source: string;
  page_dashboard: string;
  page_users: string;
  page_roles: string;
  page_user_roles: string;
  page_dict: string;
  page_op_log: string;
  page_login_log: string;
  grp_overview: string;
  grp_authz: string;
  grp_system: string;
  search: string;
  create: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  status: string;
  status_active: string;
  status_disabled: string;
  status_ok: string;
  status_fail: string;
  status_success: string;
  status_failed: string;
  actions: string;
  total_rows: string;
  col_id: string;
  col_username: string;
  col_name: string;
  col_email: string;
  col_phone: string;
  col_created_at: string;
  col_role_name: string;
  col_role_desc: string;
  col_role_perms: string;
  col_user_roles: string;
  col_assign: string;
  col_dict_label: string;
  col_dict_value: string;
  col_dict_remark: string;
  col_log_user: string;
  col_log_action: string;
  col_log_resource: string;
  col_log_ip: string;
  col_log_at: string;
  col_log_ua: string;
  kpi_users: string;
  kpi_roles: string;
  kpi_login_today: string;
  kpi_op_today: string;
  recent_op: string;
  recent_login: string;
}

export const STRINGS: Record<DemoLocale, DemoStrings> = {
  zh: {
    brand: 'admin-mini 后台',
    switch_theme: '主题', switch_density: '密度', switch_menu: '菜单形态',
    switch_accent: '主色', switch_locale: '语言',
    view_source: '查看源码', hide_source: '关闭源码',
    page_dashboard: '工作台', page_users: '用户管理', page_roles: '角色管理',
    page_user_roles: '用户角色', page_dict: '字典管理',
    page_op_log: '操作日志', page_login_log: '登录日志',
    grp_overview: '概览', grp_authz: '权限', grp_system: '系统',
    search: '搜索', create: '新增', edit: '编辑', delete: '删除',
    save: '保存', cancel: '取消',
    status: '状态', status_active: '启用', status_disabled: '停用',
    status_ok: '成功', status_fail: '失败',
    status_success: '成功', status_failed: '失败',
    actions: '操作', total_rows: '共 {n} 条',
    col_id: 'ID', col_username: '账号', col_name: '姓名',
    col_email: '邮箱', col_phone: '手机号', col_created_at: '创建时间',
    col_role_name: '角色名', col_role_desc: '描述', col_role_perms: '权限',
    col_user_roles: '已分配角色', col_assign: '分配角色',
    col_dict_label: '名称', col_dict_value: '值', col_dict_remark: '备注',
    col_log_user: '操作人', col_log_action: '动作', col_log_resource: '资源',
    col_log_ip: 'IP', col_log_at: '时间', col_log_ua: '设备',
    kpi_users: '用户总数', kpi_roles: '角色总数',
    kpi_login_today: '今日登录', kpi_op_today: '今日操作',
    recent_op: '最近操作', recent_login: '最近登录',
  },
  en: {
    brand: 'admin-mini console',
    switch_theme: 'Theme', switch_density: 'Density', switch_menu: 'Menu',
    switch_accent: 'Accent', switch_locale: 'Locale',
    view_source: 'View source', hide_source: 'Hide source',
    page_dashboard: 'Dashboard', page_users: 'Users', page_roles: 'Roles',
    page_user_roles: 'User roles', page_dict: 'Dictionary',
    page_op_log: 'Operation log', page_login_log: 'Login log',
    grp_overview: 'Overview', grp_authz: 'Authorization', grp_system: 'System',
    search: 'Search', create: 'Create', edit: 'Edit', delete: 'Delete',
    save: 'Save', cancel: 'Cancel',
    status: 'Status', status_active: 'Active', status_disabled: 'Disabled',
    status_ok: 'OK', status_fail: 'Failed',
    status_success: 'Success', status_failed: 'Failed',
    actions: 'Actions', total_rows: '{n} rows',
    col_id: 'ID', col_username: 'Username', col_name: 'Name',
    col_email: 'Email', col_phone: 'Phone', col_created_at: 'Created at',
    col_role_name: 'Role', col_role_desc: 'Description', col_role_perms: 'Permissions',
    col_user_roles: 'Assigned roles', col_assign: 'Assign',
    col_dict_label: 'Label', col_dict_value: 'Value', col_dict_remark: 'Remark',
    col_log_user: 'User', col_log_action: 'Action', col_log_resource: 'Resource',
    col_log_ip: 'IP', col_log_at: 'Time', col_log_ua: 'Device',
    kpi_users: 'Total users', kpi_roles: 'Total roles',
    kpi_login_today: "Today's logins", kpi_op_today: "Today's operations",
    recent_op: 'Recent operations', recent_login: 'Recent logins',
  },
};
