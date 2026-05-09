import type { ReactNode } from 'react';

export interface TemplatePaneTab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface TemplatePaneProps {
  value?: string;
  onChange?: (value: string) => void;
  tabs?: TemplatePaneTab[];
  size?: 'sm' | 'md' | 'lg';
  /** Map of `panel-{tabId}` → ReactNode for tab content. */
  slots?: Record<string, ReactNode>;
  className?: string;
}

export const PROTOCOL_TABS: TemplatePaneTab[] = [
  { id: 'sse', label: 'SSE', badge: 'EventStream' },
  { id: 'mqtt', label: 'MQTT', badge: 'TopicTree' },
  { id: 'kafka', label: 'Kafka', badge: 'PartitionGrid' },
  { id: 'grpc', label: 'gRPC', badge: 'MethodList' },
];
export const NETWORK_TABS: TemplatePaneTab[] = [
  { id: 'har', label: 'HAR Timeline' },
  { id: 'hex', label: 'Hex Viewer' },
  { id: 'pcap', label: 'PCAP' },
  { id: 'cert', label: 'Cert' },
  { id: 'cookie', label: 'Cookie Jar' },
];
export const SQL_TABS: TemplatePaneTab[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'console', label: 'Console' },
  { id: 'history', label: 'History' },
];
export const TERMINAL_TABS: TemplatePaneTab[] = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'output', label: 'Output' },
  { id: 'commandline', label: 'Command' },
];
export const CRASH_TABS: TemplatePaneTab[] = [
  { id: 'dialog', label: 'Crash Dialog' },
  { id: 'stack', label: 'Stack Trace' },
  { id: 'uploader', label: 'Dump Uploader' },
  { id: 'safemode', label: 'Safe Mode' },
];
export const PLUGIN_TABS: TemplatePaneTab[] = [
  { id: 'card', label: 'Card' },
  { id: 'manifest', label: 'Manifest' },
  { id: 'permission', label: 'Permission' },
  { id: 'marketplace', label: 'Marketplace' },
];
export const DOMAIN_TABS: TemplatePaneTab[] = [
  { id: 'collection', label: 'Collection' },
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'mock', label: 'Mock' },
  { id: 'workflow', label: 'Workflow' },
];
export const ONBOARDING_TABS: TemplatePaneTab[] = [
  { id: 'wizard', label: 'First-Run Wizard' },
  { id: 'hotspot', label: 'Hotspot Tour' },
  { id: 'flow', label: 'Full Flow' },
];
