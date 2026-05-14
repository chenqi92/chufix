import type { BulkSelectionBarProps } from './variants';

export function BulkSelectionBar(props: BulkSelectionBarProps) {
  const {
    count,
    total,
    hideWhenEmpty = true,
    position = 'sticky-bottom',
    label,
    showClear = true,
    clearLabel = '清空',
    onClear,
    children,
  } = props;

  if (hideWhenEmpty && count <= 0) return null;

  const labelText = label ?? (total != null ? `已选 ${count} / ${total}` : `已选 ${count} 项`);

  return (
    <div
      className={['cf-bulkbar', `cf-bulkbar--${position}`].join(' ')}
      role="region"
      aria-label="批量操作"
    >
      <span className="cf-bulkbar__count">{labelText}</span>
      <div className="cf-bulkbar__actions">{children}</div>
      {showClear && (
        <button type="button" className="cf-bulkbar__clear" onClick={() => onClear?.()}>
          {clearLabel}
        </button>
      )}
    </div>
  );
}
