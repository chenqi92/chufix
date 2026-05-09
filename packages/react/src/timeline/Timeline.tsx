import { timelineClass, type TimelineProps } from './variants';

export function Timeline(props: TimelineProps) {
  const { items, size = 'md', mode = 'left', reverse = false, className } = props;
  const ordered = reverse ? items.slice().reverse() : items;
  const cls = timelineClass({ size, mode, className });

  return (
    <ul className={cls}>
      {ordered.map((item, i) => {
        const itemCls = [
          'cf-timeline__item',
          `cf-timeline__item--${item.color ?? 'primary'}`,
          i === ordered.length - 1 && 'is-last',
          mode === 'alternate' && (i % 2 === 0 ? 'is-left' : 'is-right'),
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <li key={item.key ?? i} className={itemCls}>
            <span className="cf-timeline__dot" aria-hidden>
              {item.icon}
            </span>
            <div className="cf-timeline__body">
              {item.title ? <div className="cf-timeline__title">{item.title}</div> : null}
              {item.content ? <div className="cf-timeline__content">{item.content}</div> : null}
              {item.time ? <div className="cf-timeline__time">{item.time}</div> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
