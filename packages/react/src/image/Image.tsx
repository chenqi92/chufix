import { useState } from 'react';
import { imageClass, type ImageProps } from './variants';

export function Image(props: ImageProps) {
  const {
    src,
    alt = '',
    width,
    height,
    fit = 'cover',
    rounded = false,
    bordered = false,
    fallback,
    lazy = true,
    loading,
    className,
    onLoad,
    onError,
  } = props;

  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  function handleLoad() {
    setState('loaded');
    onLoad?.();
  }
  function handleError() {
    setState('error');
    onError?.();
  }

  const wrapStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const finalLoading = loading ?? (lazy ? 'lazy' : 'eager');

  return (
    <span className={imageClass({ rounded, bordered, state, className })} style={wrapStyle}>
      {state === 'loading' ? <span className="cf-image__placeholder" aria-hidden /> : null}
      <img
        src={src}
        alt={alt}
        loading={finalLoading}
        style={{ objectFit: fit, display: state === 'error' ? 'none' : 'block' }}
        onLoad={handleLoad}
        onError={handleError}
      />
      {state === 'error' ? (
        fallback ? (
          <img src={fallback} alt={alt} style={{ objectFit: fit }} className="cf-image__fallback" />
        ) : (
          <span className="cf-image__error" aria-hidden>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 0v9.59l3.29-3.3a1 1 0 0 1 1.42 0L13 14.59l2.29-2.3a1 1 0 0 1 1.42 0L19 14.59V5H5z"
                fill="currentColor"
              />
            </svg>
          </span>
        )
      ) : null}
    </span>
  );
}
