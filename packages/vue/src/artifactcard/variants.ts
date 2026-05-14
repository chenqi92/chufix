export type ArtifactKind = 'code' | 'doc' | 'svg' | 'html' | 'image' | 'csv' | 'json';

export interface ArtifactActions {
  copy?: boolean;
  download?: boolean;
  open?: boolean;
}

export interface ArtifactCardProps {
  kind: ArtifactKind;
  title: string;
  /** For code/doc/svg/html/csv/json: file extension hint shown next to title. */
  language?: string;
  /** Tokens / lines counter shown in the header. */
  meta?: string;
  /** Raw content used for copy/download. */
  content?: string;
  /** Filename for download. Falls back to `title`. */
  filename?: string;
  /** Actions to enable in the header. Defaults to copy + download. */
  actions?: ArtifactActions;
  /** Override the kind label. */
  kindLabel?: string;
}

export const KIND_LABEL: Record<ArtifactKind, string> = {
  code: '代码',
  doc: '文档',
  svg: 'SVG',
  html: 'HTML',
  image: '图片',
  csv: '数据',
  json: 'JSON',
};

export const KIND_ICON_PATH: Record<ArtifactKind, string> = {
  code: 'M5 4l-3 4 3 4M11 4l3 4-3 4',
  doc:  'M4 2h6l4 4v10H4z M10 2v4h4',
  svg:  'M3 12V4h10v8z M3 12l5-4 3 3 2-2',
  html: 'M3 4l1 8 4 1 4-1 1-8z M6 7h4M6 9h3',
  image:'M3 4h10v8H3z M3 10l3-3 3 3 2-2 2 2',
  csv:  'M3 4h10v8H3z M3 7h10 M3 10h10 M7 4v8',
  json: 'M5 3h-2v10h2 M11 3h2v10h-2',
};
