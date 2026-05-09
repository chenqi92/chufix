import { diffJson, jsonDiffClass, type DiffOp, type JsonDiffProps } from './variants';

function sigil(op: DiffOp): string {
  return op === 'add' ? '+' : op === 'del' ? '-' : ' ';
}

export function JsonDiff(props: JsonDiffProps) {
  const {
    left,
    right,
    size = 'md',
    bordered = true,
    lineNumbers = true,
    className,
  } = props;

  const lines = diffJson(left, right);
  const cls = jsonDiffClass({ size, bordered, lineNumbers, className });

  return (
    <pre className={cls}>
      {lines.map((line, i) => (
        <span key={i} className={`cf-jdiff__line cf-jdiff__line--${line.op}`}>
          {lineNumbers ? <span className="cf-jdiff__num">{i + 1}</span> : null}
          <span className="cf-jdiff__sigil">{sigil(line.op)}</span>
          <span className="cf-jdiff__text">{line.text}</span>
          {'\n'}
        </span>
      ))}
    </pre>
  );
}
