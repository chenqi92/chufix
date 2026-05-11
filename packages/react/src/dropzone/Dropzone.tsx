import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type CSSProperties,
} from 'react';
import {
  dropzoneClass,
  formatBytes,
  matchesAccept,
  type DropzoneProps,
  type DropzoneRejection,
} from './variants';
import { StatusIllustration } from '../statusillustration/StatusIllustration';

export function Dropzone(props: DropzoneProps) {
  const {
    value,
    defaultValue = [],
    accept,
    multiple = true,
    maxSize,
    maxFiles,
    disabled = false,
    size = 'md',
    hint,
    statuses,
    hideList = false,
    className,
    children,
    icon,
    onChange,
    onReject,
    onRemove,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<File[]>(defaultValue);
  const files = isControlled ? (value as File[]) : internal;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragCount, setDragCount] = useState(0);
  const [reject, setReject] = useState(false);

  function commit(next: File[]) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function isDuplicate(a: File, b: File) {
    return (
      a.name === b.name &&
      a.size === b.size &&
      a.lastModified === b.lastModified
    );
  }

  function ingest(incoming: FileList | File[]) {
    if (disabled) return;
    const arr = Array.from(incoming);
    const accepted: File[] = [];
    const rejections: DropzoneRejection[] = [];
    let pool = [...files];

    for (const file of arr) {
      if (maxSize != null && file.size > maxSize) {
        rejections.push({ file, reason: 'too-large' });
        continue;
      }
      if (!matchesAccept(file, accept)) {
        rejections.push({ file, reason: 'wrong-type' });
        continue;
      }
      if (pool.some((existing) => isDuplicate(existing, file))) {
        rejections.push({ file, reason: 'duplicate' });
        continue;
      }
      if (
        maxFiles != null &&
        pool.length + accepted.length >= maxFiles
      ) {
        rejections.push({ file, reason: 'too-many' });
        continue;
      }
      accepted.push(file);
    }

    if (!multiple) {
      if (accepted.length) commit(accepted.slice(-1));
    } else if (accepted.length) {
      pool = [...pool, ...accepted];
      commit(pool);
    }

    if (rejections.length) onReject?.(rejections);
  }

  function onSelect(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    if (input.files) ingest(input.files);
    input.value = '';
  }

  function pickFiles() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function onDragEnter(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    setDragCount((n) => n + 1);
  }
  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragCount((n) => {
      const next = Math.max(0, n - 1);
      if (next === 0) setReject(false);
      return next;
    });
  }
  function onDragOver(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }
  function onDrop(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    setDragCount(0);
    setReject(false);
    if (e.dataTransfer?.files) ingest(e.dataTransfer.files);
  }

  function removeAt(i: number) {
    if (disabled) return;
    const file = files[i];
    const next = files.filter((_, idx) => idx !== i);
    commit(next);
    onRemove?.(file, i);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pickFiles();
    }
  }

  return (
    <div>
      <div
        className={dropzoneClass({
          size,
          disabled,
          active: dragCount > 0,
          reject,
          className,
        })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={pickFiles}
        onKeyDown={onKeyDown}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="cf-dropzone__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onSelect}
        />
        {icon ?? <StatusIllustration className="cf-dropzone__illustration" variant="upload" />}
        {children ?? (
          <>
            <div className="cf-dropzone__title">
              点击或拖拽文件到此区域上传
            </div>
            {hint ? <div className="cf-dropzone__hint">{hint}</div> : null}
          </>
        )}
      </div>

      {!hideList && files.length ? (
        <ul className="cf-dropzone__list">
          {files.map((file, i) => {
            const status = statuses?.[i];
            const cls = [
              'cf-dropzone__file',
              status?.status === 'error' && 'is-error',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <li
                key={`${file.name}-${file.lastModified}-${i}`}
                className={cls}
              >
                <span className="cf-dropzone__file-name">{file.name}</span>
                <span className="cf-dropzone__file-size">{formatBytes(file.size)}</span>
                {status?.status === 'uploading' ? (
                  <span
                    className="cf-dropzone__progress"
                    style={{ '--progress': `${status.progress ?? 0}%` } as CSSProperties}
                  />
                ) : null}
                {status?.status === 'success' ? (
                  <span
                    className="cf-dropzone__file-status cf-dropzone__file-status--ok"
                    aria-label="完成"
                  >✓</span>
                ) : null}
                {status?.status === 'error' ? (
                  <span
                    className="cf-dropzone__file-status cf-dropzone__file-status--err"
                    title={status.error}
                    aria-label="失败"
                  >!</span>
                ) : null}
                {!disabled ? (
                  <button
                    type="button"
                    className="cf-dropzone__file-remove"
                    aria-label={`移除 ${file.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(i);
                    }}
                  >×</button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
