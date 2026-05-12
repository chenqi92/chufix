// admin-mini 演示的全局 UI 状态：主题 / 密度 / 菜单形态 / accent 色 / 语言 / 源码面板。
// 用 inject/provide 把 reactive 实例下发到所有 page，page 内部按需读取以渲染 i18n 文案。

import { type InjectionKey, type Ref } from 'vue';

export type DemoTheme = 'dark-cool' | 'dark-warm' | 'light';
export type DemoDensity = 'comfortable' | 'compact';
export type DemoMenuForm = 'sidebar' | 'topbar' | 'collapsed';
export type DemoAccent = 'blue' | 'green' | 'purple' | 'orange' | 'rose';
export type DemoLocale = 'zh' | 'en';

export interface DemoState {
  theme: Ref<DemoTheme>;
  density: Ref<DemoDensity>;
  menuForm: Ref<DemoMenuForm>;
  accent: Ref<DemoAccent>;
  locale: Ref<DemoLocale>;
}

export const DemoStateKey: InjectionKey<DemoState> = Symbol('AdminMiniDemoState');

export const ACCENT_HUE: Record<DemoAccent, string> = {
  blue:   'oklch(64% 0.16 263)',
  green:  'oklch(68% 0.16 150)',
  purple: 'oklch(64% 0.18 300)',
  orange: 'oklch(72% 0.16 60)',
  rose:   'oklch(66% 0.18 15)',
};

export interface DemoStrings {
  // top toolbar
  brand: string;
  switch_theme: string;
  switch_density: string;
  switch_menu: string;
  switch_accent: string;
  switch_locale: string;
  settings: string;
  notifications: string;
  no_notifications: string;
  mark_all_read: string;
  view_all: string;
  profile: string;
  change_password: string;
  logout: string;
  search_placeholder: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
  password_mismatch: string;
  password_changed: string;
  profile_saved: string;
  logout_done: string;
  theme_dark_cool: string;
  theme_dark_warm: string;
  theme_light: string;
  density_comfortable: string;
  density_compact: string;
  menu_sidebar: string;
  menu_topbar: string;
  menu_collapsed: string;
  // pages titles
  page_dashboard: string;
  page_users: string;
  page_roles: string;
  page_user_roles: string;
  page_dict: string;
  page_op_log: string;
  page_login_log: string;
  page_sys_settings: string;
  sys_general: string;
  sys_security: string;
  sys_backup: string;
  sys_log_retention: string;
  sys_log_retention_hint: string;
  sys_two_factor: string;
  sys_two_factor_hint: string;
  sys_password_policy: string;
  sys_password_policy_basic: string;
  sys_password_policy_strict: string;
  sys_password_policy_paranoid: string;
  sys_session_timeout: string;
  sys_next_backup: string;
  sys_upload_logs: string;
  sys_save_changes: string;
  sys_revert: string;
  sys_saved: string;
  sys_reverted: string;
  // groups
  grp_overview: string;
  grp_authz: string;
  grp_system: string;
  // common
  search: string;
  create: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  confirm: string;
  status: string;
  status_active: string;
  status_disabled: string;
  status_ok: string;
  status_fail: string;
  status_success: string;
  status_failed: string;
  actions: string;
  total_rows: string;
  // table columns
  col_id: string;
  col_username: string;
  col_name: string;
  col_email: string;
  col_phone: string;
  col_created_at: string;
  col_role_name: string;
  col_role_desc: string;
  col_role_perms: string;
  perm_user_read: string;
  perm_user_write: string;
  perm_role_read: string;
  perm_role_write: string;
  perm_dict_read: string;
  perm_dict_write: string;
  perm_log_read: string;
  perm_log_export: string;
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
  column_settings: string;
  reset_columns: string;
  phone_updated: string;
  // dashboard
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
    switch_theme: '主题',
    switch_density: '密度',
    switch_menu: '菜单形态',
    switch_accent: '主色',
    switch_locale: '语言',
    settings: '主题设置',
    notifications: '通知',
    no_notifications: '暂无新通知',
    mark_all_read: '全部已读',
    view_all: '查看全部',
    profile: '个人中心',
    change_password: '修改密码',
    logout: '退出登录',
    search_placeholder: '搜索菜单 / 用户 / 角色…',
    current_password: '当前密码',
    new_password: '新密码',
    confirm_password: '确认新密码',
    password_mismatch: '两次输入的新密码不一致',
    password_changed: '密码已更新',
    profile_saved: '资料已保存',
    logout_done: '已退出（演示态，无实际登出）',
    theme_dark_cool: '深蓝',
    theme_dark_warm: '深棕',
    theme_light: '浅色',
    density_comfortable: '宽松',
    density_compact: '紧凑',
    menu_sidebar: '侧栏',
    menu_topbar: '顶栏',
    menu_collapsed: '折叠侧栏',
    page_dashboard: '工作台',
    page_users: '用户管理',
    page_roles: '角色管理',
    page_user_roles: '用户角色',
    page_dict: '字典管理',
    page_op_log: '操作日志',
    page_login_log: '登录日志',
    page_sys_settings: '系统设置',
    sys_general: '常规',
    sys_security: '安全',
    sys_backup: '备份',
    sys_log_retention: '日志保留天数',
    sys_log_retention_hint: '超过该天数的日志会自动归档',
    sys_two_factor: '启用两步验证',
    sys_two_factor_hint: '管理员账号强制开启',
    sys_password_policy: '密码策略',
    sys_password_policy_basic: '基本（≥ 8 位）',
    sys_password_policy_strict: '严格（≥ 12 位 + 大小写 + 数字）',
    sys_password_policy_paranoid: '偏执（≥ 16 位 + 大小写 + 数字 + 符号）',
    sys_session_timeout: '会话超时（分钟）',
    sys_next_backup: '下一次备份时间',
    sys_upload_logs: '上传归档日志',
    sys_save_changes: '保存设置',
    sys_revert: '撤销',
    sys_saved: '设置已保存',
    sys_reverted: '已撤销',
    grp_overview: '概览',
    grp_authz: '权限',
    grp_system: '系统',
    search: '搜索',
    create: '新增',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确定',
    status: '状态',
    status_active: '启用',
    status_disabled: '停用',
    status_ok: '成功',
    status_fail: '失败',
    status_success: '成功',
    status_failed: '失败',
    actions: '操作',
    total_rows: '共 {n} 条',
    col_id: 'ID',
    col_username: '账号',
    col_name: '姓名',
    col_email: '邮箱',
    col_phone: '手机号',
    col_created_at: '创建时间',
    col_role_name: '角色名',
    col_role_desc: '描述',
    col_role_perms: '权限',
    perm_user_read: '查看用户',
    perm_user_write: '编辑用户',
    perm_role_read: '查看角色',
    perm_role_write: '编辑角色',
    perm_dict_read: '查看字典',
    perm_dict_write: '编辑字典',
    perm_log_read: '查看日志',
    perm_log_export: '导出日志',
    col_user_roles: '已分配角色',
    col_assign: '分配角色',
    col_dict_label: '名称',
    col_dict_value: '值',
    col_dict_remark: '备注',
    col_log_user: '操作人',
    col_log_action: '动作',
    col_log_resource: '资源',
    col_log_ip: 'IP',
    col_log_at: '时间',
    col_log_ua: '设备',
    column_settings: '列设置',
    reset_columns: '重置列',
    phone_updated: '手机号已更新',
    kpi_users: '用户总数',
    kpi_roles: '角色总数',
    kpi_login_today: '今日登录',
    kpi_op_today: '今日操作',
    recent_op: '最近操作',
    recent_login: '最近登录',
  },
  en: {
    brand: 'admin-mini console',
    switch_theme: 'Theme',
    switch_density: 'Density',
    switch_menu: 'Menu',
    switch_accent: 'Accent',
    switch_locale: 'Locale',
    settings: 'Appearance',
    notifications: 'Notifications',
    no_notifications: 'You are all caught up',
    mark_all_read: 'Mark all read',
    view_all: 'View all',
    profile: 'Profile',
    change_password: 'Change password',
    logout: 'Sign out',
    search_placeholder: 'Search menus / users / roles…',
    current_password: 'Current password',
    new_password: 'New password',
    confirm_password: 'Confirm new password',
    password_mismatch: 'New passwords do not match',
    password_changed: 'Password updated',
    profile_saved: 'Profile saved',
    logout_done: 'Signed out (demo only — no real session)',
    theme_dark_cool: 'Dark cool',
    theme_dark_warm: 'Dark warm',
    theme_light: 'Light',
    density_comfortable: 'Comfortable',
    density_compact: 'Compact',
    menu_sidebar: 'Sidebar',
    menu_topbar: 'Topbar',
    menu_collapsed: 'Collapsed',
    page_dashboard: 'Dashboard',
    page_users: 'Users',
    page_roles: 'Roles',
    page_user_roles: 'User roles',
    page_dict: 'Dictionary',
    page_op_log: 'Operation log',
    page_login_log: 'Login log',
    page_sys_settings: 'Settings',
    sys_general: 'General',
    sys_security: 'Security',
    sys_backup: 'Backup',
    sys_log_retention: 'Log retention (days)',
    sys_log_retention_hint: 'Older logs are archived automatically',
    sys_two_factor: 'Enable 2FA',
    sys_two_factor_hint: 'Required for admin accounts',
    sys_password_policy: 'Password policy',
    sys_password_policy_basic: 'Basic (≥ 8 chars)',
    sys_password_policy_strict: 'Strict (≥ 12 + upper/lower + digits)',
    sys_password_policy_paranoid: 'Paranoid (≥ 16 + upper/lower + digits + symbols)',
    sys_session_timeout: 'Session timeout (min)',
    sys_next_backup: 'Next backup at',
    sys_upload_logs: 'Upload archived logs',
    sys_save_changes: 'Save settings',
    sys_revert: 'Revert',
    sys_saved: 'Settings saved',
    sys_reverted: 'Reverted',
    grp_overview: 'Overview',
    grp_authz: 'Authorization',
    grp_system: 'System',
    search: 'Search',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    status: 'Status',
    status_active: 'Active',
    status_disabled: 'Disabled',
    status_ok: 'OK',
    status_fail: 'Failed',
    status_success: 'Success',
    status_failed: 'Failed',
    actions: 'Actions',
    total_rows: '{n} rows',
    col_id: 'ID',
    col_username: 'Username',
    col_name: 'Name',
    col_email: 'Email',
    col_phone: 'Phone',
    col_created_at: 'Created at',
    col_role_name: 'Role',
    col_role_desc: 'Description',
    col_role_perms: 'Permissions',
    perm_user_read: 'Read users',
    perm_user_write: 'Edit users',
    perm_role_read: 'Read roles',
    perm_role_write: 'Edit roles',
    perm_dict_read: 'Read dictionary',
    perm_dict_write: 'Edit dictionary',
    perm_log_read: 'Read logs',
    perm_log_export: 'Export logs',
    col_user_roles: 'Assigned roles',
    col_assign: 'Assign',
    col_dict_label: 'Label',
    col_dict_value: 'Value',
    col_dict_remark: 'Remark',
    col_log_user: 'User',
    col_log_action: 'Action',
    col_log_resource: 'Resource',
    col_log_ip: 'IP',
    col_log_at: 'Time',
    col_log_ua: 'Device',
    column_settings: 'Columns',
    reset_columns: 'Reset columns',
    phone_updated: 'Phone updated',
    kpi_users: 'Total users',
    kpi_roles: 'Total roles',
    kpi_login_today: "Today's logins",
    kpi_op_today: "Today's operations",
    recent_op: 'Recent operations',
    recent_login: 'Recent logins',
  },
};
