export type AccordionMode = 'single' | 'multiple';
export type AccordionVariant = 'bordered' | 'flush' | 'separated';

export interface AccordionItem {
  value: string;
  title: string;
  /** Plain string body. For rich content use the named slot. */
  content?: string;
  disabled?: boolean;
}

export interface AccordionProps {
  /** Open value(s). string for single; string[] for multiple. */
  modelValue?: string | string[];
  items?: AccordionItem[];
  mode?: AccordionMode;
  variant?: AccordionVariant;
  /** Default open value(s) when uncontrolled. */
  defaultOpen?: string | string[];
}

export function accordionClass(p: { variant: AccordionVariant }): string {
  return ['cf-accordion', `cf-accordion--${p.variant}`].join(' ');
}
