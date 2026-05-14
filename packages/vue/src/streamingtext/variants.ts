export type StreamingCursor = 'blink' | 'block' | 'none';
export type StreamingFormat = 'text' | 'markdown';

export interface StreamingTextProps {
  /** Current accumulated text. Pass new value as more tokens arrive. */
  text: string;
  /** Marks the stream as complete (hides cursor). */
  done?: boolean;
  /** Render plain text or basic markdown (paragraphs / `inline code` / **bold** / _italic_). */
  format?: StreamingFormat;
  cursor?: StreamingCursor;
  /** Optional CSS class on root. */
  className?: string;
}

/**
 * Tiny markdown renderer — paragraphs, **bold**, _italic_, `inline code`.
 * Avoids pulling in markdown-it / remark for the streaming hot path.
 */
export function renderInlineMarkdown(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code class="cf-streaming__code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');
  html = html.replace(/\n\n+/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  return `<p>${html}</p>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
