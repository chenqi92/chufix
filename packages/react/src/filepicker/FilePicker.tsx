import { useRef } from 'react';
import { formatBytes, type FilePickerProps } from './variants';

export function FilePicker(props: FilePickerProps) {
  const {
    value,
    onChange,
    multiple = false,
    accept,
    size = 'md',
    variant = 'outline',
    disabled = false,
    buttonText = '选择文件',
    emptyText = '未选择文件',
    showFiles = true,
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const files = value ?? [];

  const cls = [
    'cf-filepicker',
    `cf-filepicker--${size}`,
    `cf-filepicker--${variant}`,
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    onChange(Array.from(list));
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    const next = files.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className={cls}>
      <button
        type="button"
        className="cf-filepicker__btn"
        disabled={disabled}
        onClick={openPicker}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 2.5h5L13 6.5v6.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          <path
            d="M9 2.5v3.5a1 1 0 0 0 1 1H13"
            stroke="currentColor"
            strokeWidth={1.4}
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
        <span>{buttonText}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="cf-filepicker__native"
        multiple={multiple}
        accept={accept}
        onChange={onFiles}
      />
      {showFiles && files.length === 0 ? (
        <span className="cf-filepicker__empty">{emptyText}</span>
      ) : null}
      {showFiles && files.length > 0 ? (
        <ul className="cf-filepicker__list">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="cf-filepicker__item"
            >
              <span className="cf-filepicker__name">{file.name}</span>
              <span className="cf-filepicker__size">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                className="cf-filepicker__remove"
                aria-label="移除"
                onClick={() => removeFile(i)}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {showFiles && files.length > 1 ? (
        <button
          type="button"
          className="cf-filepicker__clear"
          onClick={() => onChange([])}
        >
          清空
        </button>
      ) : null}
    </div>
  );
}
