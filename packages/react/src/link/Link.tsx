import { linkClass, type LinkProps } from './variants';

export function Link(props: LinkProps) {
  const {
    href,
    target,
    rel,
    external,
    variant = 'default',
    size = 'md',
    disabled = false,
    className,
    children,
    onClick,
  } = props;

  const isExternal =
    !!external ||
    target === '_blank' ||
    (!!href && /^https?:\/\//i.test(href));

  const finalRel = rel ?? (isExternal ? 'noopener noreferrer' : undefined);
  const finalTarget = target ?? (external ? '_blank' : undefined);

  return (
    <a
      className={linkClass({ variant, size, disabled, className })}
      href={disabled ? undefined : href}
      target={finalTarget}
      rel={finalRel}
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {children}
      {isExternal ? (
        <svg
          className="cf-link__external"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 3h4v4M13 3l-6 6M11 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </a>
  );
}
