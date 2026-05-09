import { TemplatePane } from './TemplatePane';
import {
  PROTOCOL_TABS,
  NETWORK_TABS,
  SQL_TABS,
  TERMINAL_TABS,
  CRASH_TABS,
  PLUGIN_TABS,
  DOMAIN_TABS,
  ONBOARDING_TABS,
  type TemplatePaneProps,
} from './variants';

export function ProtocolPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={PROTOCOL_TABS}
      paneClass="cf-tplpane--protocol"
    />
  );
}

export function NetworkPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={NETWORK_TABS}
      paneClass="cf-tplpane--network"
    />
  );
}

export function SqlWorkbench(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={SQL_TABS}
      paneClass="cf-tplpane--sql"
    />
  );
}

export function TerminalPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={TERMINAL_TABS}
      paneClass="cf-tplpane--terminal"
    />
  );
}

export function CrashPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={CRASH_TABS}
      paneClass="cf-tplpane--crash"
    />
  );
}

export function PluginPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={PLUGIN_TABS}
      paneClass="cf-tplpane--plugin"
    />
  );
}

export function DomainPane(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={DOMAIN_TABS}
      paneClass="cf-tplpane--domain"
    />
  );
}

export function OnboardingFlow(props: TemplatePaneProps) {
  return (
    <TemplatePane
      {...props}
      defaultTabs={ONBOARDING_TABS}
      paneClass="cf-tplpane--onboarding"
    />
  );
}
