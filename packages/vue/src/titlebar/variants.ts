export type TitleBarPlatform = 'macos' | 'windows' | 'linux';
export type TitleBarSize = 'sm' | 'md' | 'lg';

export interface TitleBarProps {
  platform?: TitleBarPlatform;
  title?: string;
  subtitle?: string;
  /** Show modified dot. */
  modified?: boolean;
  size?: TitleBarSize;
  /** Hide window controls (use as a header bar). */
  hideControls?: boolean;
}
