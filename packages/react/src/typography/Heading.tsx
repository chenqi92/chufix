import { createElement } from 'react';
import { headingClass, type HeadingProps } from './variants';

export function Heading(props: HeadingProps) {
  const { level = 2, children, className } = props;
  const cls = [headingClass(props), className].filter(Boolean).join(' ');
  return createElement(`h${level}`, { className: cls }, children);
}
