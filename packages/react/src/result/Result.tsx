import { StatusIllustration } from '../statusillustration/StatusIllustration';
import type { StatusIllustrationVariant } from '../statusillustration/variants';
import { resultClass, resultDefaultTitle, type ResultProps, type ResultStatus } from './variants';

function statusToIllustration(status: ResultStatus): StatusIllustrationVariant {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case '404': return 'not-found';
    case '403': return 'forbidden';
    case '500': return 'server-error';
    case 'info':
    default:
      return 'info';
  }
}

export function Result(props: ResultProps) {
  const { status = 'info', title, description, icon, extra, size = 'md', className, children } = props;
  const finalTitle = title ?? resultDefaultTitle(status);

  return (
    <div className={resultClass({ status, size, className })}>
      <div className="cf-result__icon" aria-hidden>
        {icon ?? <StatusIllustration variant={statusToIllustration(status)} size={size} />}
      </div>
      <div className="cf-result__title">{finalTitle}</div>
      {description ? <div className="cf-result__description">{description}</div> : null}
      {extra ? <div className="cf-result__extra">{extra}</div> : null}
      {children}
    </div>
  );
}
