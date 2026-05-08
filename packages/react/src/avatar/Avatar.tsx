import { useEffect, useState } from 'react';
import {
  avatarClass,
  initialsFromName,
  type AvatarProps,
} from './variants';

export function Avatar(props: AvatarProps) {
  const {
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    fallback,
    children,
    className,
    style,
  } = props;

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = !!src && !failed;
  const initials = initialsFromName(name, fallback);

  return (
    <span
      className={avatarClass({ size, shape, className })}
      role="img"
      aria-label={alt || name}
      style={style}
    >
      {showImage ? (
        <img
          className="cf-avatar__img"
          src={src}
          alt={alt || name || ''}
          onError={() => setFailed(true)}
        />
      ) : children ? (
        <span className="cf-avatar__icon">{children}</span>
      ) : (
        <span className="cf-avatar__initials">{initials}</span>
      )}
    </span>
  );
}
