export type CodeBlockSize = 'sm' | 'md' | 'lg';

export interface InlineCodeProps {
  size?: 'sm' | 'md';
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  size?: CodeBlockSize;
  showLineNumbers?: boolean;
  copyable?: boolean;
  maxHeight?: number | string;
}

export function codeBlockClass(p: {
  size: CodeBlockSize;
  showLineNumbers: boolean;
}): string {
  return [
    'cf-code-block',
    `cf-code-block--${p.size}`,
    p.showLineNumbers && 'has-numbers',
  ]
    .filter(Boolean)
    .join(' ');
}
