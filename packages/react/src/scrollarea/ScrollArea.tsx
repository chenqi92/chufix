import { type CSSProperties } from 'react';
import { scrollAreaClass, type ScrollAreaProps } from './variants';

export function ScrollArea(props: ScrollAreaProps) {
  const {
    maxHeight,
    maxWidth,
    size = 'md',
    bordered = false,
    axis = 'y',
    className,
    children,
  } = props;

  const styles: CSSProperties = {};
  if (maxHeight != null)
    styles.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  if (maxWidth != null)
    styles.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <div
      className={scrollAreaClass({ size, bordered, axis, className })}
      style={styles}
    >
      {children}
    </div>
  );
}
