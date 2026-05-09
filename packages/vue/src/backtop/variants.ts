export type BackTopSize = 'sm' | 'md' | 'lg';

export interface BackTopProps {
  visibilityHeight?: number;
  target?: string;
  size?: BackTopSize;
  duration?: number;
  className?: string;
}

export function backTopClass(p: { size: BackTopSize; visible: boolean; className?: string }): string {
  return [
    'cf-backtop',
    `cf-backtop--${p.size}`,
    p.visible && 'is-visible',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function smoothScrollTo(target: Element | Window, top: number, duration: number) {
  const start = target instanceof Window ? window.scrollY : (target as Element).scrollTop;
  const change = top - start;
  if (Math.abs(change) < 1 || duration <= 0) {
    if (target instanceof Window) window.scrollTo(0, top);
    else (target as Element).scrollTop = top;
    return;
  }
  const startTime = performance.now();
  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const y = start + change * eased;
    if (target instanceof Window) window.scrollTo(0, y);
    else (target as Element).scrollTop = y;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
