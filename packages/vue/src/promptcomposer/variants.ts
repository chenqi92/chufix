export interface PromptAttachment {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  /** Mime type or file extension. */
  mime?: string;
  /** Optional thumbnail URL (for images). */
  thumbnailUrl?: string;
}

export interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  /** Optional alias matched against the query (after `/`). */
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
  modelValue?: string;
  placeholder?: string;
  /** Disable input + submit button. */
  disabled?: boolean;
  /** Show stop button instead of submit; disables Enter submit. */
  loading?: boolean;
  /** Hard cap on character count. */
  maxLength?: number;
  /** Max rows before scroll. Default 8. */
  maxRows?: number;
  /** Submit key. Default 'enter' (Shift+Enter = newline). */
  submitKey?: SubmitKey;
  /** Current attachments. */
  attachments?: PromptAttachment[];
  /** Available slash commands; pop after `/` at line start. */
  slashCommands?: SlashCommand[];
  /** Available mentions; pop after `@`. */
  mentions?: MentionItem[];
}

export function formatBytes(n: number | undefined): string {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Detect a popup trigger immediately to the left of the cursor in `value`.
 * Returns the trigger char + query, or null when no popup should open.
 */
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
