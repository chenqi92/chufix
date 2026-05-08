import { type DividerProps, dividerClass } from './variants';

export function Divider(props: DividerProps) {
  const { orientation = 'horizontal', variant = 'solid', align = 'center', children } = props;
  const cls = dividerClass({
    orientation,
    variant,
    align,
    hasLabel: !!children,
  });
  return (
    <div className={cls} role="separator" aria-orientation={orientation}>
      {children != null && <span className="cf-divider__label">{children}</span>}
    </div>
  );
}
