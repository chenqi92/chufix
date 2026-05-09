export type StepperVariant = 'numbered' | 'dots' | 'minimal';
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperSize = 'sm' | 'md' | 'lg';
export type StepStatus = 'pending' | 'current' | 'done' | 'error';

export interface StepItem {
  key?: string | number;
  title: string;
  description?: string;
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepperProps {
  items: StepItem[];
  current?: number;
  variant?: StepperVariant;
  orientation?: StepperOrientation;
  size?: StepperSize;
  clickable?: boolean;
  className?: string;
  onChange?: (index: number, item: StepItem) => void;
}

export function stepperClass(p: {
  variant: StepperVariant;
  orientation: StepperOrientation;
  size: StepperSize;
  className?: string;
}): string {
  return [
    'cf-stepper',
    `cf-stepper--${p.variant}`,
    `cf-stepper--${p.orientation}`,
    `cf-stepper--${p.size}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function resolveStatus(
  index: number,
  current: number,
  override?: StepStatus,
): StepStatus {
  if (override) return override;
  if (index < current) return 'done';
  if (index === current) return 'current';
  return 'pending';
}
