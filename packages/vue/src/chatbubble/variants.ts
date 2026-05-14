export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatBubbleState = 'sending' | 'sent' | 'error' | 'streaming';
export type ChatBubbleAlign = 'auto' | 'start' | 'end';

export interface ChatAuthor {
  name?: string;
  avatar?: string;
  /** Optional initials override when avatar missing. */
  initials?: string;
}

export interface ChatBubbleProps {
  role: ChatRole;
  /** Fast path: plain text content. Slot/children override this. */
  content?: string;
  timestamp?: Date | string;
  author?: ChatAuthor;
  state?: ChatBubbleState;
  /** Show the inline copy button (hover-revealed). Default true. */
  showCopy?: boolean;
  /** Show hover toolbar (copy / retry / edit / branch). Default true. */
  showActions?: boolean;
  /** Override automatic alignment. */
  align?: ChatBubbleAlign;
}

export function formatTimestamp(value: Date | string | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function resolveInitials(author: ChatAuthor | undefined, role: ChatRole): string {
  if (author?.initials) return author.initials;
  if (author?.name) {
    const parts = author.name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }
  if (role === 'user') return 'U';
  if (role === 'assistant') return 'A';
  return 'S';
}

export function alignFromRole(role: ChatRole, align: ChatBubbleAlign | undefined): 'start' | 'end' {
  if (align === 'start' || align === 'end') return align;
  return role === 'user' ? 'end' : 'start';
}
