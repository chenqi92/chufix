import {
  statusCodeBadgeClass,
  type StatusCodeBadgeProps,
} from './variants';

export function StatusCodeBadge(props: StatusCodeBadgeProps) {
  const { code, reason } = props;
  const cls = statusCodeBadgeClass(props);
  const ariaLabel = reason ? `${code} ${reason}` : String(code);
  return (
    <span className={cls} role="img" aria-label={ariaLabel}>
      <span className="cf-statuscode__code">{code}</span>
      {reason ? (
        <span className="cf-statuscode__reason">{reason}</span>
      ) : null}
    </span>
  );
}
