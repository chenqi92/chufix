import { type EmptyProps, emptyClass } from './variants';
import { StatusIllustration } from '../statusillustration/StatusIllustration';

export function Empty(props: EmptyProps) {
  const { title = '暂无数据', description, size = 'md', image, imageAlt = '', icon, action } = props;
  return (
    <div className={emptyClass({ size })} role="status">
      <div className="cf-empty__icon">
        {icon ?? (image ? <img className="cf-empty__image" src={image} alt={imageAlt} /> : <StatusIllustration variant="empty" />)}
      </div>
      <div className="cf-empty__title">{title}</div>
      {description != null && <div className="cf-empty__desc">{description}</div>}
      {action != null && <div className="cf-empty__action">{action}</div>}
    </div>
  );
}
