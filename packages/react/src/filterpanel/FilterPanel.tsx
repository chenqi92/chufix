import type { FilterPanelProps, SavedView } from './variants';

export function FilterPanel(props: FilterPanelProps) {
  const {
    title = '筛选',
    savedViews,
    activeViewId,
    activeFilters,
    showFooter = true,
    applying = false,
    onViewChange,
    onApply,
    onReset,
    children,
  } = props;

  function onViewClick(view: SavedView) {
    if (view.id === activeViewId) return;
    onViewChange?.(view.id, view);
  }

  return (
    <aside className="cf-filterpanel" role="complementary" aria-label={title}>
      <header className="cf-filterpanel__head">
        <h3 className="cf-filterpanel__title">{title}</h3>
        {!!activeFilters && <span className="cf-filterpanel__badge">{activeFilters}</span>}
      </header>
      {savedViews && savedViews.length > 0 && (
        <div className="cf-filterpanel__views" role="tablist" aria-label="已保存视图">
          {savedViews.map((view) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              className={['cf-filterpanel__view', view.id === activeViewId ? 'is-active' : ''].filter(Boolean).join(' ')}
              aria-selected={view.id === activeViewId}
              onClick={() => onViewClick(view)}
            >
              {view.label}
              {view.count != null && <span className="cf-filterpanel__view-count">{view.count}</span>}
            </button>
          ))}
        </div>
      )}
      <div className="cf-filterpanel__body">{children}</div>
      {showFooter && (
        <footer className="cf-filterpanel__foot">
          <button
            type="button"
            className="cf-filterpanel__btn cf-filterpanel__btn--secondary"
            onClick={() => onReset?.()}
          >
            清空
          </button>
          <button
            type="button"
            className="cf-filterpanel__btn cf-filterpanel__btn--primary"
            disabled={applying}
            onClick={() => onApply?.()}
          >
            {applying ? '应用中...' : '应用'}
          </button>
        </footer>
      )}
    </aside>
  );
}
