import { useState } from 'react';
import { type PlanStep, formatMs } from './variants';

export interface PlanCardProps {
  title?: string;
  steps: PlanStep[];
  initialOpenIds?: string[];
  className?: string;
}

export function PlanCard({ title, steps, initialOpenIds, className }: PlanCardProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries((initialOpenIds ?? []).map((id) => [id, true])),
  );

  function toggle(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className={['cf-plan', className].filter(Boolean).join(' ')}>
      {title && <header className="cf-plan__header">{title}</header>}
      <ol className="cf-plan__steps">
        {steps.map((step) => (
          <li
            key={step.id}
            className={['cf-plan__step', `cf-plan__step--${step.status}`].join(' ')}
          >
            <div className="cf-plan__bullet">
              {step.status === 'done' && (
                <svg viewBox="0 0 16 16" width={12} height={12}>
                  <path
                    d="M3 8l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {step.status === 'failed' && (
                <svg viewBox="0 0 16 16" width={12} height={12}>
                  <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              )}
              {step.status === 'active' && (
                <svg viewBox="0 0 16 16" width={14} height={14} className="cf-plan__spinner">
                  <circle cx={8} cy={8} r={6} fill="none" stroke="currentColor" strokeWidth={1.6} opacity={0.25} />
                  <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                </svg>
              )}
              {step.status === 'skipped' && <span>—</span>}
            </div>
            <div className="cf-plan__content">
              {step.detail ? (
                <button
                  type="button"
                  className="cf-plan__row cf-plan__row--toggle"
                  onClick={() => toggle(step.id)}
                >
                  <span className="cf-plan__title">{step.title}</span>
                  {step.duration !== undefined && (
                    <span className="cf-plan__duration">{formatMs(step.duration)}</span>
                  )}
                  <span className={['cf-plan__caret', open[step.id] && 'is-open'].filter(Boolean).join(' ')}>
                    ›
                  </span>
                </button>
              ) : (
                <div className="cf-plan__row">
                  <span className="cf-plan__title">{step.title}</span>
                  {step.duration !== undefined && (
                    <span className="cf-plan__duration">{formatMs(step.duration)}</span>
                  )}
                </div>
              )}
              {step.description && <p className="cf-plan__desc">{step.description}</p>}
              {step.detail && open[step.id] && (
                <pre className="cf-plan__detail">{step.detail}</pre>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
