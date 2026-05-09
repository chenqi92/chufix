import {
  resolveStatus,
  stepperClass,
  type StepItem,
  type StepperProps,
} from './variants';

export function Stepper(props: StepperProps) {
  const {
    items,
    current = 0,
    variant = 'numbered',
    orientation = 'horizontal',
    size = 'md',
    clickable = false,
    className,
    onChange,
  } = props;

  function handleClick(i: number, item: StepItem) {
    if (!clickable || item.disabled) return;
    onChange?.(i, item);
  }

  return (
    <ol className={stepperClass({ variant, orientation, size, className })}>
      {items.map((item, i) => {
        const status = resolveStatus(i, current, item.status);
        const itemCls = [
          'cf-stepper__item',
          `is-${status}`,
          item.disabled && 'is-disabled',
          clickable && !item.disabled && 'is-clickable',
        ].filter(Boolean).join(' ');
        return (
          <li key={item.key ?? i} className={itemCls}>
            <button
              type="button"
              className="cf-stepper__node"
              disabled={!clickable || item.disabled}
              aria-current={status === 'current' ? 'step' : undefined}
              onClick={() => handleClick(i, item)}
            >
              <span className="cf-stepper__indicator">
                {status === 'done' ? (
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : status === 'error' ? (
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : variant === 'dots' ? (
                  <span className="cf-stepper__dot" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="cf-stepper__body">
                <span className="cf-stepper__title">{item.title}</span>
                {item.description ? (
                  <span className="cf-stepper__description">{item.description}</span>
                ) : null}
              </span>
            </button>
            {i < items.length - 1 ? (
              <span
                className={`cf-stepper__connector${i < current ? ' is-active' : ''}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
