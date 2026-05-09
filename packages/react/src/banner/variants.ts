export type BannerTone = 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
export type BannerVariant = 'subtle' | 'solid';

export interface BannerProps {
  tone?: BannerTone;
  variant?: BannerVariant;
  dismissible?: boolean;
  icon?: import('react').ReactNode | boolean;
  sticky?: boolean;
  action?: import('react').ReactNode;
  className?: string;
  children?: import('react').ReactNode;
  onDismiss?: () => void;
}

export function bannerClass(p: {
  tone: BannerTone;
  variant: BannerVariant;
  sticky: boolean;
  className?: string;
}): string {
  return [
    'cf-banner',
    `cf-banner--${p.tone}`,
    `cf-banner--${p.variant}`,
    p.sticky && 'is-sticky',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
