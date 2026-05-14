export interface CitationSource {
  title: string;
  url?: string;
  /** Short snippet shown in the hover card. */
  snippet?: string;
  /** Favicon / domain icon URL. */
  favicon?: string;
  /** Source domain / publisher; rendered under the title. */
  domain?: string;
}

export interface CitationMarkProps {
  /** Numeric badge index (1-based). */
  index: number;
  source: CitationSource;
  /** Disable the hover card (e.g. for plain print views). */
  disableHover?: boolean;
}
