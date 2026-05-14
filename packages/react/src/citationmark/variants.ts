export interface CitationSource {
  title: string;
  url?: string;
  snippet?: string;
  favicon?: string;
  domain?: string;
}

export interface CitationMarkProps {
  index: number;
  source: CitationSource;
  disableHover?: boolean;
}
