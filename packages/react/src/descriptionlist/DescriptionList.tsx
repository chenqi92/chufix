import { type CSSProperties } from 'react';
import {
  descriptionListClass,
  type DescriptionListProps,
} from './variants';

export function DescriptionList(props: DescriptionListProps) {
  const {
    items = [],
    layout = 'horizontal',
    size = 'md',
    columns = 1,
    bordered = false,
    termWidth,
    title,
    className,
    children,
  } = props;

  const styles: CSSProperties = {
    ['--cf-dl-cols' as never]: String(columns),
    ...(termWidth != null
      ? {
          ['--cf-dl-term-width' as never]:
            typeof termWidth === 'number' ? `${termWidth}px` : termWidth,
        }
      : {}),
  };

  return (
    <div
      className={descriptionListClass({ layout, size, bordered, className })}
      style={styles}
    >
      {title ? <div className="cf-dl__title">{title}</div> : null}
      <dl className="cf-dl__grid">
        {items.map((item, i) => (
          <div
            key={item.key ?? i}
            className="cf-dl__row"
            style={item.span ? { gridColumn: `span ${item.span}` } : undefined}
          >
            <dt className="cf-dl__term">{item.term}</dt>
            <dd className="cf-dl__description">{item.description}</dd>
          </div>
        ))}
        {children}
      </dl>
    </div>
  );
}
