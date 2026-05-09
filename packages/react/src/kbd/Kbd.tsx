import { Fragment } from 'react';
import { kbdClass, type KbdProps } from './variants';

export function Kbd(props: KbdProps) {
  const { keys, separator = '+', size = 'md', className, children } = props;
  const cls = kbdClass({ size, className });
  if (keys?.length) {
    return (
      <span className={cls}>
        {keys.map((k, i) => (
          <Fragment key={i}>
            <kbd className="cf-kbd__key">{k}</kbd>
            {i < keys.length - 1 ? (
              <span className="cf-kbd__sep">{separator}</span>
            ) : null}
          </Fragment>
        ))}
      </span>
    );
  }
  return (
    <span className={cls}>
      <kbd className="cf-kbd__key">{children}</kbd>
    </span>
  );
}
