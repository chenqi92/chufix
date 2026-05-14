export type FieldRowLayout = 'vertical' | 'horizontal';
export type FieldRowSize = 'sm' | 'md' | 'lg';

export interface FieldRowProps {
  label?: string;
  required?: boolean;
  /** Helper text shown below the control. */
  hint?: string;
  /** Validation error; overrides hint and turns control border red. */
  error?: string;
  /** Bind to the inner control's id. */
  htmlFor?: string;
  layout?: FieldRowLayout;
  size?: FieldRowSize;
  /** Optional content rendered after the label (e.g. a help icon). */
  extraLabel?: string;
}
