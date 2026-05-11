/* Shared types for template panes (CfProtocolPane, CfNetworkPane, etc.).
 * Each template is a thin Tabs shell with predefined tab IDs and slots. */

export interface TemplatePaneTab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface TemplatePaneProps {
  modelValue?: string;
  tabs?: TemplatePaneTab[];
  size?: 'sm' | 'md' | 'lg';
}

/** Predefined tab sets per template. Consumers can override via props.tabs. */
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
