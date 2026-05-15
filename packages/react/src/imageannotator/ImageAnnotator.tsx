import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type AnnotationTone,
  type ImageAnnotation,
  clampNorm,
} from './variants';

export interface ImageAnnotatorProps {
  src: string;
  alt?: string;
  annotations: ImageAnnotation[];
  readonly?: boolean;
  addMode?: 'click' | 'manual';
  selectedId?: string;
  defaultTone?: AnnotationTone;
  className?: string;
  onChange?: (list: ImageAnnotation[]) => void;
  onAdd?: (annotation: ImageAnnotation) => void;
  onUpdate?: (annotation: ImageAnnotation) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
}

function nextId(): string {
  return `pin-${Math.random().toString(36).slice(2, 9)}`;
}

export function ImageAnnotator({
  src,
  alt = '',
  annotations,
  readonly,
  addMode = 'click',
  selectedId,
  defaultTone = 'info',
  className,
  onChange,
  onAdd,
  onUpdate,
  onDelete,
  onSelect,
}: ImageAnnotatorProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const pointerIdRef = useRef(-1);

  const annotationsRef = useRef(annotations);
  annotationsRef.current = annotations;

  const handlePinMove = useCallback(
    (ev: PointerEvent) => {
      if (!draggingId || ev.pointerId !== pointerIdRef.current || !surfaceRef.current) return;
      const rect = surfaceRef.current.getBoundingClientRect();
      const x = clampNorm((ev.clientX - rect.left) / rect.width);
      const y = clampNorm((ev.clientY - rect.top) / rect.height);
      const next = annotationsRef.current.map((a) =>
        a.id === draggingId ? { ...a, x, y } : a,
      );
      const moved = next.find((a) => a.id === draggingId);
      onChange?.(next);
      if (moved) onUpdate?.(moved);
    },
    [draggingId, onChange, onUpdate],
  );

  const handlePinUp = useCallback(() => {
    setDraggingId(null);
    pointerIdRef.current = -1;
  }, []);

  useEffect(() => {
    if (!draggingId) return;
    window.addEventListener('pointermove', handlePinMove);
    window.addEventListener('pointerup', handlePinUp);
    return () => {
      window.removeEventListener('pointermove', handlePinMove);
      window.removeEventListener('pointerup', handlePinUp);
    };
  }, [draggingId, handlePinMove, handlePinUp]);

  function onSurfaceDown(ev: React.PointerEvent<HTMLDivElement>) {
    if (readonly || addMode !== 'click') return;
    if (ev.button !== undefined && ev.button !== 0) return;
    if ((ev.target as Element)?.closest('.cf-annot__pin')) return;
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const x = clampNorm((ev.clientX - rect.left) / rect.width);
    const y = clampNorm((ev.clientY - rect.top) / rect.height);
    const a: ImageAnnotation = { id: nextId(), x, y, tone: defaultTone };
    onChange?.([...annotations, a]);
    onAdd?.(a);
    onSelect?.(a.id);
  }

  function onPinDown(ev: React.PointerEvent<HTMLDivElement>, id: string) {
    if (readonly) return;
    ev.stopPropagation();
    if (ev.button !== undefined && ev.button !== 0) return;
    setDraggingId(id);
    pointerIdRef.current = ev.pointerId;
    try {
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    } catch {}
    onSelect?.(id);
  }

  function deletePin(id: string) {
    if (readonly) return;
    const next = annotations.filter((a) => a.id !== id);
    onChange?.(next);
    onDelete?.(id);
  }

  return (
    <div
      className={['cf-annot', readonly && 'is-readonly', className].filter(Boolean).join(' ')}
    >
      <div ref={surfaceRef} className="cf-annot__surface" onPointerDown={onSurfaceDown}>
        <img src={src} alt={alt} className="cf-annot__img" draggable={false} />
        {annotations.map((a) => (
          <div
            key={a.id}
            className={[
              'cf-annot__pin',
              `cf-annot__pin--${a.tone ?? defaultTone}`,
              selectedId === a.id && 'is-selected',
              draggingId === a.id && 'is-dragging',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }}
            title={a.label ?? ''}
            onPointerDown={(e) => onPinDown(e, a.id)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(a.id);
            }}
          >
            <span className="cf-annot__dot" />
            {a.label && <span className="cf-annot__label">{a.label}</span>}
            {!readonly && selectedId === a.id && (
              <button
                type="button"
                className="cf-annot__remove"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(a.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
