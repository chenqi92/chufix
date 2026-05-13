export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextVariant = 'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'error';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'start' | 'center' | 'end' | 'justify';

export interface HeadingProps {
  level?: HeadingLevel;
  /** Optional weight override. */
  weight?: TextWeight;
  /** Optional color tone. */
  variant?: TextVariant;
  align?: TextAlign;
  /** Truncate to single line with ellipsis. */
  truncate?: boolean;
}

export interface TextProps {
  /** Render as inline by default; pass tag="p" or "div" to switch. */
  tag?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em';
  size?: TextSize;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  truncate?: boolean;
}

export interface ParagraphProps {
  size?: TextSize;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  /** Number of lines before clamping with ellipsis; 0 = no clamp. */
  lineClamp?: number;
}

export function headingClass(props: HeadingProps): string {
  return [
    'cf-typo',
    'cf-typo-heading',
    `cf-typo-heading--h${props.level ?? 2}`,
    props.weight ? `cf-typo--w-${props.weight}` : '',
    props.variant ? `cf-typo--${props.variant}` : '',
    props.align ? `cf-typo--align-${props.align}` : '',
    props.truncate ? 'cf-typo--truncate' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function textClass(props: TextProps): string {
  return [
    'cf-typo',
    'cf-typo-text',
    `cf-typo-text--${props.size ?? 'md'}`,
    props.weight ? `cf-typo--w-${props.weight}` : '',
    props.variant ? `cf-typo--${props.variant}` : '',
    props.align ? `cf-typo--align-${props.align}` : '',
    props.truncate ? 'cf-typo--truncate' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function paragraphClass(props: ParagraphProps): string {
  return [
    'cf-typo',
    'cf-typo-paragraph',
    `cf-typo-text--${props.size ?? 'md'}`,
    props.weight ? `cf-typo--w-${props.weight}` : '',
    props.variant ? `cf-typo--${props.variant}` : '',
    props.align ? `cf-typo--align-${props.align}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
