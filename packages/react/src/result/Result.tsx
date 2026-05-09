import { resultClass, resultDefaultTitle, type ResultProps, type ResultStatus } from './variants';

const codeStatuses: ResultStatus[] = ['404', '403', '500'];

function defaultIcon(status: ResultStatus) {
  if (codeStatuses.includes(status)) {
    return <span className="cf-result__code">{status}</span>;
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
      {status === 'success' ? (
        <path
          d="M20 32l8 8 16-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : status === 'error' ? (
        <path
          d="M22 22l20 20M42 22L22 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M32 22v18M32 46v.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Result(props: ResultProps) {
  const { status = 'info', title, description, icon, extra, size = 'md', className, children } = props;
  const finalTitle = title ?? resultDefaultTitle(status);

  return (
    <div className={resultClass({ status, size, className })}>
      <div className="cf-result__icon" aria-hidden>
        {icon ?? defaultIcon(status)}
      </div>
      <div className="cf-result__title">{finalTitle}</div>
      {description ? <div className="cf-result__description">{description}</div> : null}
      {extra ? <div className="cf-result__extra">{extra}</div> : null}
      {children}
    </div>
  );
}
