export type TabBarVariant = 'line' | 'fill';

export interface TabBarItem {
  key: string;
  label?: string;
  /** SVG path-data string (the most lightweight icon contract). */
  iconPath?: string;
  /** Numeric / textual badge. Falsy values hide. */
  badge?: number | string;
  disabled?: boolean;
}

export interface TabBarProps {
  items: TabBarItem[];
  modelValue?: string;
  /** Fixed to bottom (default true). Set false to render inline. */
  fixed?: boolean;
  /** Pad bottom with safe-area-inset (default true when fixed). */
  safeArea?: boolean;
  variant?: TabBarVariant;
  /** Override aria-label. Default '主导航'. */
  ariaLabel?: string;
}
