export type CodeBlockSize = 'sm' | 'md' | 'lg';

export interface InlineCodeProps {
  size?: 'sm' | 'md';
  className?: string;
  children?: import('react').ReactNode;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: import('react').ReactNode;
  size?: CodeBlockSize;
  showLineNumbers?: boolean;
  copyable?: boolean;
  maxHeight?: number | string;
  className?: string;
}

export function codeBlockClass(p: {
  size: CodeBlockSize;
  showLineNumbers: boolean;
  className?: string;
}): string {
  return [
    'cf-code-block',
    `cf-code-block--${p.size}`,
    p.showLineNumbers && 'has-numbers',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
