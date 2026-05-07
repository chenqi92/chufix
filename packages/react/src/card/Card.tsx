import { forwardRef, type HTMLAttributes } from 'react';
import { cardClass, type CardProps } from './variants';

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  props,
  ref,
) {
  const {
    variant = 'outlined',
    interactive = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={cardClass({ variant, interactive, className })}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

type SubProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, SubProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ck-card__header', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export const CardBody = forwardRef<HTMLDivElement, SubProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ck-card__body', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export const CardFooter = forwardRef<HTMLDivElement, SubProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['ck-card__footer', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});
