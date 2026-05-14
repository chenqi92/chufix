import type { ReactNode } from 'react';

export interface PromptAttachment {
  id: string;
  name: string;
  size?: number;
  mime?: string;
  thumbnailUrl?: string;
}

export interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  match?: string[];
}

export interface MentionItem {
  id: string;
  label: string;
  description?: string;
  avatar?: string;
}

export type SubmitKey = 'enter' | 'mod-enter';

export interface PromptComposerProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  maxRows?: number;
  submitKey?: SubmitKey;
  attachments?: PromptAttachment[];
  slashCommands?: SlashCommand[];
  mentions?: MentionItem[];
  onSubmit?: (text: string) => void;
  onStop?: () => void;
  onAttachAdd?: (file: File) => void;
  onAttachRemove?: (id: string) => void;
  onMention?: (m: MentionItem) => void;
  onSlash?: (c: SlashCommand) => void;
  toolbar?: ReactNode;
}

export function formatBytes(n: number | undefined): string {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function detectTrigger(value: string, caret: number): { trigger: '/' | '@'; query: string } | null {
  const before = value.slice(0, caret);
  const match = /(?:^|\s)([\/@])([^\s\/@]*)$/.exec(before);
  if (!match) return null;
  return { trigger: match[1] as '/' | '@', query: match[2] };
}

export function isSlashMatch(cmd: SlashCommand, q: string): boolean {
  if (!q) return true;
  const target = q.toLowerCase();
  if (cmd.id.toLowerCase().includes(target)) return true;
  if (cmd.label.toLowerCase().includes(target)) return true;
  return cmd.match?.some((m) => m.toLowerCase().includes(target)) ?? false;
}

export function isMentionMatch(m: MentionItem, q: string): boolean {
  if (!q) return true;
  const target = q.toLowerCase();
  return m.id.toLowerCase().includes(target) || m.label.toLowerCase().includes(target);
}
