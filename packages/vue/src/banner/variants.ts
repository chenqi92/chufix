export type BannerTone = 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
export type BannerVariant = 'subtle' | 'solid';

export interface BannerProps {
  tone?: BannerTone;
  variant?: BannerVariant;
  dismissible?: boolean;
  icon?: boolean;
  sticky?: boolean;
}

export function bannerClass(p: {
  tone: BannerTone;
  variant: BannerVariant;
  sticky: boolean;
}): string {
  return [
    'cf-banner',
    `cf-banner--${p.tone}`,
    `cf-banner--${p.variant}`,
    p.sticky && 'is-sticky',
  ]
    .filter(Boolean)
    .join(' ');
}
