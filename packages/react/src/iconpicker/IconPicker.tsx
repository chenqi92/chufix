import { useMemo, useState, type MouseEvent } from 'react';
import { iconNames, type IconName } from '@chufix-design/icons';
import { Icon } from '../icon/Icon';
import { iconPickerClass, type IconPickerProps } from './variants';

export function IconPicker({
  value,
  placeholder = '选择图标',
  searchable = true,
  clearable = true,
  disabled = false,
  size = 'md',
  onChange,
  className,
  ...rest
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return iconNames;
    return iconNames.filter((name) => name.includes(keyword));
  }, [query]);

  function selectIcon(name: IconName) {
    onChange?.(name);
    setOpen(false);
  }

  function clear(event: MouseEvent) {
    event.stopPropagation();
    onChange?.(undefined);
  }

  return (
    <div className={iconPickerClass({ size, open, disabled, className })} {...rest}>
      <button type="button" className="cf-iconpicker__trigger" disabled={disabled} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {value ? <Icon name={value} /> : null}
        <span className={`cf-iconpicker__value${value ? '' : ' is-placeholder'}`}>{value || placeholder}</span>
        {clearable && value ? <span className="cf-iconpicker__clear" aria-hidden="true" onClick={clear}>×</span> : null}
        <span className="cf-iconpicker__chevron" aria-hidden="true">⌄</span>
      </button>

      {open ? (
        <div className="cf-iconpicker__popup" role="listbox">
          {searchable ? (
            <input
              className="cf-iconpicker__search"
              type="search"
              placeholder="搜索图标..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
          <div className="cf-iconpicker__grid">
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                className={`cf-iconpicker__item${value === name ? ' is-selected' : ''}`}
                role="option"
                aria-selected={value === name}
                title={name}
                onClick={() => selectIcon(name)}
              >
                <Icon name={name} />
              </button>
            ))}
          </div>
          {!filtered.length ? <div className="cf-iconpicker__empty">没有匹配图标</div> : null}
        </div>
      ) : null}
    </div>
  );
}
