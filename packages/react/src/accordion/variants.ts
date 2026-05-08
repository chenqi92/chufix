export type AccordionMode = 'single' | 'multiple';
export type AccordionVariant = 'bordered' | 'flush' | 'separated';

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  value?: string | string[];
  defaultValue?: string | string[];
  items?: AccordionItem[];
  mode?: AccordionMode;
  variant?: AccordionVariant;
  onChange?: (v: string | string[]) => void;
}

export function accordionClass(p: { variant: AccordionVariant }): string {
  return ['cf-accordion', `cf-accordion--${p.variant}`].join(' ');
}
