import { Fragment, useMemo } from 'react';
import {
  ALL_FLAGS,
  compileAndMatch,
  highlightMatches,
  type RegexBuilderProps,
  type RegexFlag,
} from './variants';

export function RegexBuilder(props: RegexBuilderProps) {
  const {
    pattern,
    onPatternChange,
    flags,
    onFlagsChange,
    testText,
    onTestTextChange,
    size = 'md',
    patternPlaceholder = '正则表达式',
    testPlaceholder = '在此粘贴待测试文本…',
    className,
  } = props;

  const result = useMemo(
    () => compileAndMatch(pattern, flags, testText),
    [pattern, flags, testText],
  );
  const highlighted = useMemo(
    () => highlightMatches(testText, result.matches),
    [testText, result.matches],
  );

  const cls = [
    'cf-regex',
    `cf-regex--${size}`,
    !result.ok && 'is-error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const toggleFlag = (flag: RegexFlag) => {
    const next = flags.includes(flag) ? flags.replace(flag, '') : flags + flag;
    onFlagsChange(next);
  };

  return (
    <div className={cls}>
      <div className="cf-regex__pattern">
        <span className="cf-regex__delim">/</span>
        <input
          type="text"
          className="cf-regex__pattern-input"
          value={pattern}
          placeholder={patternPlaceholder}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onPatternChange(e.target.value)}
        />
        <span className="cf-regex__delim">/</span>
        <span className="cf-regex__flags-text">{flags}</span>
      </div>
      <div className="cf-regex__flags" role="group" aria-label="正则标志">
        {ALL_FLAGS.map((f) => (
          <button
            key={f.flag}
            type="button"
            className="cf-regex__flag"
            title={f.desc}
            aria-pressed={flags.includes(f.flag)}
            onClick={() => toggleFlag(f.flag)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {!result.ok ? (
        <div className="cf-regex__error">
          <strong>正则编译错误：</strong>
          {result.error}
        </div>
      ) : null}
      <textarea
        className="cf-regex__test"
        value={testText}
        placeholder={testPlaceholder}
        rows={6}
        spellCheck={false}
        onChange={(e) => onTestTextChange(e.target.value)}
      />
      <div className="cf-regex__output">
        <div className="cf-regex__output-head">
          匹配 <strong>{result.matches.length}</strong> 处
        </div>
        <div className="cf-regex__output-body">
          {highlighted.map((p, i) =>
            p.match ? (
              <span key={i} className="cf-regex__hit">
                {p.text}
              </span>
            ) : (
              <Fragment key={i}>{p.text}</Fragment>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
