// admin-mini 演示用的内存 mock 数据，不接任何后端。
// 各 page 直接 import 这里的常量；增删改只动各自页面持有的 ref。

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'disabled';
  createdAt: string;
  /** 所属部门 key（用于组织架构页 join）。 */
  deptKey?: string;
}

export interface Department {
  key: string;
  label: string;
  children?: Department[];
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface UserRoleLink {
  userId: number;
  roleIds: string[];
}

export interface DictItem {
  id: string;
  parentId: string | null;
  label: string;
  value: string;
  remark: string;
}

export interface OperationLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  at: string;
  status: 'ok' | 'fail';
}

export interface LoginLog {
  id: number;
  user: string;
  ip: string;
  ua: string;
  at: string;
  status: 'success' | 'failed';
}

export const initialUsers: AdminUser[] = [
  { id: 1, username: 'admin', name: '系统管理员', email: 'admin@chufix.dev', phone: '13800000001', status: 'active', createdAt: '2025-09-01 10:21', deptKey: 'd-root' },
  { id: 2, username: 'ada',   name: 'Ada Lovelace', email: 'ada@chufix.dev',  phone: '13800000002', status: 'active', createdAt: '2025-10-12 14:03', deptKey: 'd-rnd-frontend' },
  { id: 3, username: 'linus', name: 'Linus Torvalds', email: 'linus@chufix.dev', phone: '13800000003', status: 'active', createdAt: '2025-11-03 09:47', deptKey: 'd-rnd-backend' },
  { id: 4, username: 'grace', name: 'Grace Hopper', email: 'grace@chufix.dev', phone: '13800000004', status: 'disabled', createdAt: '2025-11-19 16:55', deptKey: 'd-ops' },
  { id: 5, username: 'alan',  name: 'Alan Turing',  email: 'alan@chufix.dev',  phone: '13800000005', status: 'active', createdAt: '2026-01-08 11:32', deptKey: 'd-rnd-backend' },
  { id: 6, username: 'donald',name: 'Donald Knuth', email: 'donald@chufix.dev',phone: '13800000006', status: 'active', createdAt: '2026-02-14 13:18', deptKey: 'd-rnd-frontend' },
];

export const initialDepartments: Department[] = [
  {
    key: 'd-root',
    label: 'ChuFix Inc.',
    children: [
      {
        key: 'd-rnd',
        label: '研发中心',
        children: [
          { key: 'd-rnd-frontend', label: '前端组' },
          { key: 'd-rnd-backend',  label: '后端组' },
          { key: 'd-rnd-qa',       label: '测试组' },
        ],
      },
      {
        key: 'd-ops',
        label: '运维与基础设施',
        children: [
          { key: 'd-ops-sre',    label: 'SRE' },
          { key: 'd-ops-dba',    label: 'DBA' },
        ],
      },
      { key: 'd-design',  label: '设计中心' },
      { key: 'd-support', label: '客户支持' },
    ],
  },
];

/** 收集某节点及其所有后代部门 key。 */
export function collectDeptKeys(dept: Department): string[] {
  const out: string[] = [dept.key];
  const visit = (d: Department) => {
    if (!d.children) return;
    for (const c of d.children) {
      out.push(c.key);
      visit(c);
    }
  };
  visit(dept);
  return out;
}

export function findDepartment(key: string, list: Department[] = initialDepartments): Department | null {
  for (const d of list) {
    if (d.key === key) return d;
    if (d.children) {
      const found = findDepartment(key, d.children);
      if (found) return found;
    }
  }
  return null;
}

export const initialRoles: AdminRole[] = [
  { id: 'r-admin',   name: '超级管理员', description: '拥有全部权限', permissions: ['user:*', 'role:*', 'dict:*', 'log:*'] },
  { id: 'r-manager', name: '业务管理员', description: '业务模块全部读写', permissions: ['user:read', 'user:write', 'role:read'] },
  { id: 'r-viewer',  name: '只读账号',  description: '只能查看，不能修改', permissions: ['user:read', 'role:read', 'log:read'] },
  { id: 'r-auditor', name: '审计员',    description: '查看日志，不能修改业务', permissions: ['log:read', 'log:export'] },
];

export const initialUserRoles: UserRoleLink[] = [
  { userId: 1, roleIds: ['r-admin'] },
  { userId: 2, roleIds: ['r-manager'] },
  { userId: 3, roleIds: ['r-manager', 'r-auditor'] },
  { userId: 4, roleIds: ['r-viewer'] },
  { userId: 5, roleIds: ['r-viewer'] },
  { userId: 6, roleIds: ['r-auditor'] },
];

export const initialDict: DictItem[] = [
  { id: 'd-status',     parentId: null,        label: '用户状态',    value: 'user_status', remark: '系统内置' },
  { id: 'd-status-1',   parentId: 'd-status',  label: '启用',        value: 'active',      remark: '' },
  { id: 'd-status-2',   parentId: 'd-status',  label: '停用',        value: 'disabled',    remark: '' },
  { id: 'd-gender',     parentId: null,        label: '性别',        value: 'gender',      remark: '' },
  { id: 'd-gender-1',   parentId: 'd-gender',  label: '男',          value: 'M',           remark: '' },
  { id: 'd-gender-2',   parentId: 'd-gender',  label: '女',          value: 'F',           remark: '' },
  { id: 'd-gender-3',   parentId: 'd-gender',  label: '保密',        value: 'X',           remark: '' },
  { id: 'd-level',      parentId: null,        label: '日志级别',     value: 'log_level',   remark: '' },
  { id: 'd-level-1',    parentId: 'd-level',   label: 'INFO',        value: 'info',        remark: '' },
  { id: 'd-level-2',    parentId: 'd-level',   label: 'WARN',        value: 'warn',        remark: '' },
  { id: 'd-level-3',    parentId: 'd-level',   label: 'ERROR',       value: 'error',       remark: '' },
];

export const initialOpLogs: OperationLog[] = [
  { id: 1, user: 'admin', action: 'create', resource: '/api/users',  ip: '10.1.0.21',  at: '2026-05-12 08:21:03', status: 'ok' },
  { id: 2, user: 'ada',   action: 'update', resource: '/api/roles/r-manager', ip: '10.1.0.22', at: '2026-05-12 08:19:51', status: 'ok' },
  { id: 3, user: 'linus', action: 'delete', resource: '/api/users/9', ip: '10.1.0.23', at: '2026-05-12 08:17:22', status: 'fail' },
  { id: 4, user: 'ada',   action: 'login',  resource: '/auth/login',  ip: '10.1.0.22',  at: '2026-05-12 08:14:08', status: 'ok' },
  { id: 5, user: 'grace', action: 'export', resource: '/api/logs/op', ip: '10.1.0.42',  at: '2026-05-12 08:10:42', status: 'ok' },
  { id: 6, user: 'admin', action: 'update', resource: '/api/dict/d-status', ip: '10.1.0.21', at: '2026-05-12 08:02:13', status: 'ok' },
];

export const initialLoginLogs: LoginLog[] = [
  { id: 1, user: 'admin', ip: '10.1.0.21',  ua: 'Chrome 124 / macOS', at: '2026-05-12 08:14:08', status: 'success' },
  { id: 2, user: 'ada',   ip: '10.1.0.22',  ua: 'Edge 123 / Windows', at: '2026-05-12 08:11:55', status: 'success' },
  { id: 3, user: 'linus', ip: '10.1.0.23',  ua: 'Firefox 124 / Linux', at: '2026-05-12 08:09:31', status: 'success' },
  { id: 4, user: 'grace', ip: '203.0.113.6', ua: 'Safari 17 / iOS',  at: '2026-05-12 08:07:18', status: 'failed' },
  { id: 5, user: 'grace', ip: '203.0.113.6', ua: 'Safari 17 / iOS',  at: '2026-05-12 08:06:42', status: 'failed' },
  { id: 6, user: 'alan',  ip: '10.1.0.24',  ua: 'Chrome 124 / Linux', at: '2026-05-12 07:58:11', status: 'success' },
];
