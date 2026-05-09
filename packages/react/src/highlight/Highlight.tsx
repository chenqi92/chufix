import { highlightClass, splitByMatch, type HighlightProps } from './variants';

export function Highlight({
  text,
  match,
  caseSensitive = false,
  className,
}: HighlightProps) {
  const cls = highlightClass({ className });
  const segments = splitByMatch(text, match, caseSensitive);
  return (
    <span className={cls}>
      {segments.map((seg, i) =>
        seg.hit ? (
          <mark key={i} className="cf-highlight__hit">{seg.text}</mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
