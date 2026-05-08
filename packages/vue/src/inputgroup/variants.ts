export type InputGroupOrientation = 'horizontal' | 'vertical';
export type InputGroupSize = 'sm' | 'md' | 'lg';

export interface InputGroupProps {
  orientation?: InputGroupOrientation;
  size?: InputGroupSize;
  /** Stretch children to equal width along the main axis. */
  stretch?: boolean;
}

export function inputGroupClass(props: Required<Pick<InputGroupProps, 'orientation' | 'size'>> & Pick<InputGroupProps, 'stretch'>): string {
  return [
    'cf-input-group',
    `cf-input-group--${props.orientation}`,
    `cf-input-group--${props.size}`,
    props.stretch ? 'cf-input-group--stretch' : '',
  ].filter(Boolean).join(' ');
}
