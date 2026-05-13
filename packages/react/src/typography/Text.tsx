import { createElement } from 'react';
import { textClass, type TextProps } from './variants';

export function Text(props: TextProps) {
  const { tag = 'span', children, className } = props;
  const cls = [textClass(props), className].filter(Boolean).join(' ');
  return createElement(tag, { className: cls }, children);
}
