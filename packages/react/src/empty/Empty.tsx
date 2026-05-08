import { type EmptyProps, emptyClass } from './variants';

const DEFAULT_ICON = (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="18" width="44" height="34" rx="3" />
    <path d="M10 28h44" />
    <path d="M22 12h20" />
    <circle cx="22" cy="40" r="2" fill="currentColor" />
    <circle cx="32" cy="40" r="2" fill="currentColor" />
    <circle cx="42" cy="40" r="2" fill="currentColor" />
  </svg>
);

export function Empty(props: EmptyProps) {
  const { title = '暂无数据', description, size = 'md', icon, action } = props;
  return (
    <div className={emptyClass({ size })} role="status">
      <div className="cf-empty__icon">{icon ?? DEFAULT_ICON}</div>
      <div className="cf-empty__title">{title}</div>
      {description != null && <div className="cf-empty__desc">{description}</div>}
      {action != null && <div className="cf-empty__action">{action}</div>}
    </div>
  );
}
