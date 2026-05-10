import type { BlockMeta } from './types';

import { protocolMonitor } from './templates/protocol-monitor';
import { networkInspector } from './templates/network-inspector';
import { sqlWorkbench } from './templates/sql-workbench';
import { terminalPane } from './templates/terminal-pane';
import { crashReport } from './templates/crash-report';
import { pluginCenter } from './templates/plugin-center';
import { apiDebugger } from './templates/api-debugger';
import { onboardingFlow } from './templates/onboarding-flow';

import { dashboardOverview } from './dashboards/dashboard-overview';
import { analyticsBoard } from './dashboards/analytics-board';
import { monitoringBoard } from './dashboards/monitoring-board';
import { executiveSummary } from './dashboards/executive-summary';

import { loginBasic } from './auth/login-basic';
import { loginOtp } from './auth/login-otp';
import { registerMultistep } from './auth/register-multistep';

import { error404 } from './errors/error-404';
import { error403 } from './errors/error-403';
import { errorNetwork } from './errors/error-network';

import { codeWorkbench } from './workbench/code-workbench';
import { dbWorkbench } from './workbench/db-workbench';

import { settingsPage } from './settings/settings-page';

export const blocks: BlockMeta[] = [
  protocolMonitor,
  networkInspector,
  sqlWorkbench,
  terminalPane,
  crashReport,
  pluginCenter,
  apiDebugger,
  onboardingFlow,

  dashboardOverview,
  analyticsBoard,
  monitoringBoard,
  executiveSummary,

  loginBasic,
  loginOtp,
  registerMultistep,

  error404,
  error403,
  errorNetwork,

  codeWorkbench,
  dbWorkbench,

  settingsPage,
];

export function getBlock(id: string): BlockMeta | undefined {
  return blocks.find((b) => b.id === id);
}

export function blocksByCategory() {
  const map = new Map<BlockMeta['category'], BlockMeta[]>();
  for (const b of blocks) {
    const arr = map.get(b.category) ?? [];
    arr.push(b);
    map.set(b.category, arr);
  }
  return map;
}
