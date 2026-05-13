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

export interface ToggleGroupChangePayload {
  value: string | string[] | null;
  changedValue: string;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  mode?: ToggleGroupMode;
  orientation?: ToggleGroupOrientation;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  onChange?: (payload: ToggleGroupChangePayload) => void;
}
