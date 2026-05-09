import { floatButtonClass, floatButtonStyle, type FloatButtonProps } from './variants';

export function FloatButton({
  children,
  shape = 'circle',
  variant = 'default',
  tooltip,
  badge,
  bottom,
  right,
  top,
  left,
  ariaLabel,
  className,
  onClick,
}: FloatButtonProps) {
  const cls = floatButtonClass({ shape, variant, className });
  const style = floatButtonStyle({ bottom, right, top, left });
  return (
    <button
      type="button"
      className={cls}
      style={style}
      aria-label={ariaLabel ?? tooltip}
      title={tooltip}
      onClick={onClick}
    >
      <span className="cf-floatbtn__icon">{children}</span>
      {badge != null && badge !== '' && (
        <span className="cf-floatbtn__badge">{badge}</span>
      )}
    </button>
  );
}
