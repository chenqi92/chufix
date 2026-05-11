import { statusIllustrationClass, type StatusIllustrationProps } from './variants';

export function StatusIllustration(props: StatusIllustrationProps) {
  const {
    variant = 'empty',
    size = 'md',
    title,
    className,
  } = props;
  const cls = statusIllustrationClass({ variant, size, className });

  return (
    <svg
      className={cls}
      viewBox="0 0 96 72"
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <ellipse className="cf-status-illustration__shadow" cx="48" cy="64" rx="31" ry="5" />
      <path className="cf-status-illustration__panel" d="M18 17a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V17z" />
      <path className="cf-status-illustration__bar" d="M18 25h60" />
      <circle className="cf-status-illustration__dot" cx="27" cy="19.5" r="1.5" />
      <circle className="cf-status-illustration__dot" cx="33" cy="19.5" r="1.5" />
      <circle className="cf-status-illustration__dot" cx="39" cy="19.5" r="1.5" />
      <path className="cf-status-illustration__muted-stroke" d="M60 19.5h8" />

      {variant === 'upload' ? (
        <>
          <rect className="cf-status-illustration__soft" x="35" y="31" width="26" height="20" rx="5" />
          <path className="cf-status-illustration__accent-stroke" d="M48 44V34m0 0-5 5m5-5 5 5" />
          <path className="cf-status-illustration__muted-stroke" d="M41 47h14" />
        </>
      ) : variant === 'success' ? (
        <>
          <circle className="cf-status-illustration__soft" cx="48" cy="39" r="14" />
          <path className="cf-status-illustration__accent-stroke" d="M40 39l5 5 12-12" />
          <path className="cf-status-illustration__muted-stroke" d="M30 54h36" />
        </>
      ) : variant === 'info' ? (
        <>
          <circle className="cf-status-illustration__soft" cx="48" cy="39" r="14" />
          <path className="cf-status-illustration__accent-stroke" d="M48 38v8M48 32.5v.2" />
          <path className="cf-status-illustration__muted-stroke" d="M36 54h24" />
        </>
      ) : variant === 'warning' ? (
        <>
          <path className="cf-status-illustration__soft" d="M48 27l16 26H32l16-26z" />
          <path className="cf-status-illustration__accent-stroke" d="M48 37v8M48 49v.2" />
          <path className="cf-status-illustration__muted-stroke" d="M34 56h28" />
        </>
      ) : variant === 'error' ? (
        <>
          <circle className="cf-status-illustration__soft" cx="48" cy="39" r="14" />
          <path className="cf-status-illustration__accent-stroke" d="M42 33l12 12M54 33 42 45" />
          <path className="cf-status-illustration__muted-stroke" d="M34 54h28" />
        </>
      ) : variant === 'search' ? (
        <>
          <path className="cf-status-illustration__muted-stroke" d="M31 33h15M31 41h10M31 49h13" />
          <circle className="cf-status-illustration__soft" cx="58" cy="38" r="10" />
          <circle className="cf-status-illustration__accent-stroke" cx="58" cy="38" r="7" />
          <path className="cf-status-illustration__accent-stroke" d="M63 43l7 7" />
        </>
      ) : variant === 'not-found' ? (
        <>
          <path className="cf-status-illustration__muted-stroke" d="M31 34h12M53 34h12M34 49c5-4 23-4 28 0" />
          <text className="cf-status-illustration__code" x="48" y="44" textAnchor="middle">404</text>
        </>
      ) : variant === 'forbidden' ? (
        <>
          <circle className="cf-status-illustration__soft" cx="48" cy="39" r="14" />
          <path className="cf-status-illustration__accent-stroke" d="M39 48l18-18" />
          <circle className="cf-status-illustration__accent-stroke" cx="48" cy="39" r="11" />
          <path className="cf-status-illustration__muted-stroke" d="M34 55h28" />
        </>
      ) : variant === 'server-error' ? (
        <>
          <rect className="cf-status-illustration__soft" x="31" y="30" width="34" height="8" rx="2" />
          <rect className="cf-status-illustration__soft" x="31" y="43" width="34" height="8" rx="2" />
          <path className="cf-status-illustration__accent-stroke" d="M57 34h3M57 47h3M37 34h.2M37 47h.2M41 34h10M41 47h10" />
          <path className="cf-status-illustration__muted-stroke" d="M48 28v-3M43 25h10" />
        </>
      ) : (
        <>
          <rect className="cf-status-illustration__soft" x="34" y="31" width="28" height="20" rx="5" />
          <path className="cf-status-illustration__accent-stroke" d="M34 37h28M40 43h15M40 47h10" />
          <path className="cf-status-illustration__muted-stroke" d="M29 54h38" />
        </>
      )}
    </svg>
  );
}
