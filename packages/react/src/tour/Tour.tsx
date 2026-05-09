import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  computeGeometry,
  tourClass,
  type TourGeometry,
  type TourProps,
} from './variants';

export function Tour({
  steps,
  open,
  defaultOpen = false,
  current,
  defaultCurrent = 0,
  className,
  onOpenChange,
  onCurrentChange,
  onFinish,
  onClose,
}: TourProps) {
  const isOpenControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const realOpen = isOpenControlled ? !!open : internalOpen;

  const isCurrentControlled = current !== undefined;
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const idx = isCurrentControlled ? (current as number) : internalCurrent;

  const step = steps[idx];

  const [geometry, setGeometry] = useState<TourGeometry | null>(null);

  const recompute = useCallback(() => {
    if (typeof document === 'undefined' || !step) {
      setGeometry(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (!el) {
      setGeometry(null);
      return;
    }
    setGeometry(computeGeometry(el, step.placement ?? 'bottom'));
  }, [step]);

  useEffect(() => {
    if (!realOpen) return;
    recompute();
    const onChange = () => recompute();
    window.addEventListener('scroll', onChange, true);
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('scroll', onChange, true);
      window.removeEventListener('resize', onChange);
    };
  }, [realOpen, recompute]);

  function setOpen(v: boolean) {
    if (!isOpenControlled) setInternalOpen(v);
    onOpenChange?.(v);
    if (!v) onClose?.();
  }

  function setCurrent(n: number) {
    if (!isCurrentControlled) setInternalCurrent(n);
    onCurrentChange?.(n);
  }

  function next() {
    if (idx >= steps.length - 1) {
      onFinish?.();
      setOpen(false);
      setCurrent(0);
    } else {
      setCurrent(idx + 1);
    }
  }
  function prev() {
    if (idx > 0) setCurrent(idx - 1);
  }

  if (!realOpen || !step) return null;
  if (typeof document === 'undefined') return null;

  const cls = tourClass({ className });

  return createPortal(
    <div className={cls}>
      <div className="cf-tour__backdrop" onClick={() => setOpen(false)} />
      {geometry && (
        <div className="cf-tour__highlight" style={geometry.highlightStyle as React.CSSProperties} />
      )}
      {geometry && (
        <div
          className="cf-tour__popover"
          style={geometry.popoverStyle as React.CSSProperties}
          role="dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="cf-tour__title">{step.title}</h4>
          {step.description && <p className="cf-tour__desc">{step.description}</p>}
          <div className="cf-tour__footer">
            <span className="cf-tour__progress">{idx + 1} / {steps.length}</span>
            <div className="cf-tour__actions">
              {idx > 0 && (
                <button type="button" className="cf-tour__btn cf-tour__btn--ghost" onClick={prev}>上一步</button>
              )}
              <button type="button" className="cf-tour__btn cf-tour__btn--ghost" onClick={() => setOpen(false)}>跳过</button>
              <button type="button" className="cf-tour__btn cf-tour__btn--primary" onClick={next}>
                {idx < steps.length - 1 ? '下一步' : '完成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
