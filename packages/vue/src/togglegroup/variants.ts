export type ToggleGroupMode = 'single' | 'multi';
export type ToggleGroupOrientation = 'horizontal' | 'vertical';
export type ToggleGroupSize = 'sm' | 'md' | 'lg';
export type ToggleGroupVariant = 'attached' | 'separated';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  /** Selected value(s). For single mode pass string|null, for multi pass string[]. */
  modelValue?: string | string[] | null;
  mode?: ToggleGroupMode;
  orientation?: ToggleGroupOrientation;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface ToggleGroupChangePayload {
  value: string | string[] | null;
  changedValue: string;
}
