import { Modal } from '../modal/Modal';
import { Button } from '../button/Button';
import type { ConfirmDialogProps } from './variants';

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open,
    onOpenChange,
    title,
    description,
    tone = 'default',
    confirmText = '确认',
    cancelText = '取消',
    loading = false,
    closeOnOverlay = false,
    closeOnEsc = true,
    onConfirm,
    onCancel,
    children,
  } = props;

  const confirmVariant = tone === 'danger' ? 'danger' : 'primary';
  const modalTitle = typeof title === 'string' ? title : undefined;

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) onCancel?.();
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      header={modalTitle}
      size="sm"
      closeOnOverlay={closeOnOverlay}
      closeOnEsc={closeOnEsc}
      footer={
        <>
          <Button variant="tertiary" disabled={loading} onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            loading={loading}
            onClick={() => onConfirm?.()}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="cf-confirm">
        <div className="cf-confirm__icon" data-tone={tone}>
          {tone === 'danger' ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={1.6}
              />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="cf-confirm__content">
          {description ? <p className="cf-confirm__desc">{description}</p> : null}
          {children}
        </div>
      </div>
    </Modal>
  );
}
