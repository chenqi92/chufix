import type { TemplateMeta } from '../types';
import Preview from './preview/AdminMiniDemo.vue';

// Vue 源码 —— 用 ?raw 直接读演示组件原文，保证源码面板里看到的代码 = 真正跑起来的代码。
import previewAdminMini from './preview/AdminMiniDemo.vue?raw';
import previewAdminHeader from './preview/AdminHeader.vue?raw';
import previewLogin from './preview/Login.vue?raw';
import previewSettingsDrawer from './preview/SettingsDrawer.vue?raw';
import previewProfileModal from './preview/ProfileModal.vue?raw';
import previewChangePassword from './preview/ChangePasswordModal.vue?raw';
import previewState from './preview/state.ts?raw';
import previewMock from './preview/mock.ts?raw';
import previewDashboard from './preview/pages/Dashboard.vue?raw';
import previewUsers from './preview/pages/Users.vue?raw';
import previewRoles from './preview/pages/Roles.vue?raw';
import previewUserRoles from './preview/pages/UserRoles.vue?raw';
import previewDict from './preview/pages/Dict.vue?raw';
import previewOpLog from './preview/pages/OperationLog.vue?raw';
import previewLoginLog from './preview/pages/LoginLog.vue?raw';
import previewSysSettings from './preview/pages/SystemSettings.vue?raw';
import previewOrg from './preview/pages/Org.vue?raw';
import previewMenus from './preview/pages/Menus.vue?raw';

// React 镜像源码 —— 仅用于源码面板展示，不参与运行。结构与 Vue 文件一一对应。
import srcReactApp from './source-react/AdminMiniDemo.tsx?raw';
import srcReactState from './source-react/state.ts?raw';
import srcReactMock from './source-react/mock.ts?raw';
import srcReactDashboard from './source-react/pages/Dashboard.tsx?raw';
import srcReactUsers from './source-react/pages/Users.tsx?raw';
import srcReactRoles from './source-react/pages/Roles.tsx?raw';
import srcReactUserRoles from './source-react/pages/UserRoles.tsx?raw';
import srcReactDict from './source-react/pages/Dict.tsx?raw';
import srcReactOpLog from './source-react/pages/OperationLog.tsx?raw';
import srcReactLoginLog from './source-react/pages/LoginLog.tsx?raw';
import srcReactSysSettings from './source-react/pages/SystemSettings.tsx?raw';
import srcReactOrg from './source-react/pages/Org.tsx?raw';

const vueFiles: Record<string, string> = {
  'src/AdminMiniDemo.vue':       previewAdminMini,
  'src/AdminHeader.vue':         previewAdminHeader,
  'src/Login.vue':               previewLogin,
  'src/SettingsDrawer.vue':      previewSettingsDrawer,
  'src/ProfileModal.vue':        previewProfileModal,
  'src/ChangePasswordModal.vue': previewChangePassword,
  'src/state.ts':                previewState,
  'src/mock.ts':                 previewMock,
  'src/pages/Dashboard.vue':     previewDashboard,
  'src/pages/Users.vue':         previewUsers,
  'src/pages/Roles.vue':         previewRoles,
  'src/pages/UserRoles.vue':     previewUserRoles,
  'src/pages/Dict.vue':          previewDict,
  'src/pages/OperationLog.vue':  previewOpLog,
  'src/pages/LoginLog.vue':      previewLoginLog,
  'src/pages/SystemSettings.vue': previewSysSettings,
  'src/pages/Org.vue':            previewOrg,
  'src/pages/Menus.vue':          previewMenus,
};

const reactFiles: Record<string, string> = {
  'src/AdminMiniDemo.tsx':       srcReactApp,
  'src/state.ts':                srcReactState,
  'src/mock.ts':                 srcReactMock,
  'src/pages/Dashboard.tsx':     srcReactDashboard,
  'src/pages/Users.tsx':         srcReactUsers,
  'src/pages/Roles.tsx':         srcReactRoles,
  'src/pages/UserRoles.tsx':     srcReactUserRoles,
  'src/pages/Dict.tsx':          srcReactDict,
  'src/pages/OperationLog.tsx':  srcReactOpLog,
  'src/pages/LoginLog.tsx':      srcReactLoginLog,
  'src/pages/SystemSettings.tsx': srcReactSysSettings,
  'src/pages/Org.tsx':            srcReactOrg,
};

export const adminMini: TemplateMeta = {
  id: 'admin-mini',
  name: 'admin-mini · 后台管理',
  description:
    '完整可交互的后台管理工程：顶部 header（搜索 / 消息铃铛 / 语言 / 主题齿轮 / 用户头像下拉）+ 左侧菜单 / 顶栏 / 折叠侧栏三种菜单形态、三套主题、两种密度、五种主色、中英文双语；用户 / 角色 / 用户角色 / 字典 / 操作日志 / 登录日志 7 个真实页面，可直接在演示里点开个人中心 / 修改密码 / CRUD 弹窗 / 权限分配 / 搜索等交互。',
  category: 'admin',
  Preview,
  vueFiles,
  reactFiles,
  workspaceTitle: 'admin-mini · source',
  workspaceRoot: 'admin-mini',
  workspaceHeight: 'min(620px, 70vh)',
  previewHeight: 'min(820px, 88vh)',
};
