import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';

export interface SignaturePoint {
  x: number;
  y: number;
}

export interface SignaturePadHandle {
  clear: () => void;
  toDataURL: (type?: string, quality?: number) => string;
  toBlob: (type?: string, quality?: number) => Promise<Blob | null>;
  isEmpty: () => boolean;
}

export interface SignaturePadProps {
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  strokeColor?: string;
  background?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (empty: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  {
    width = '100%',
    height = 180,
    strokeWidth = 2,
    strokeColor,
    background = 'transparent',
    disabled,
    className,
    onChange,
    onStart,
    onEnd,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const pointerIdRef = useRef(-1);
  const strokeRef = useRef<SignaturePoint[]>([]);
  const emptyRef = useRef(true);

  const getStroke = useCallback((): string => {
    if (strokeColor) return strokeColor;
    if (canvasRef.current) {
      return getComputedStyle(canvasRef.current).getPropertyValue('color') || '#fff';
    }
    return '#fff';
  }, [strokeColor]);

  const resize = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();
    el.width = Math.max(1, Math.round(rect.width * dpr));
    el.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useImperativeHandle(
    ref,
    (): SignaturePadHandle => ({
      clear: () => {
        const ctx = ctxRef.current;
        const el = canvasRef.current;
        if (!ctx || !el) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, el.width, el.height);
        ctx.restore();
        emptyRef.current = true;
        onChange?.(true);
      },
      toDataURL: (type = 'image/png', quality?: number) =>
        canvasRef.current?.toDataURL(type, quality) ?? '',
      toBlob: (type = 'image/png', quality?: number) =>
        new Promise((resolve) => {
          const el = canvasRef.current;
          if (!el) return resolve(null);
          el.toBlob(resolve, type, quality);
        }),
      isEmpty: () => emptyRef.current,
    }),
    [onChange],
  );

  function pointFromEvent(ev: PointerEvent | React.PointerEvent): SignaturePoint {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  }

  function onDown(ev: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled || !ctxRef.current || !canvasRef.current) return;
    if (ev.button !== undefined && ev.button !== 0) return;
    drawingRef.current = true;
    pointerIdRef.current = ev.pointerId;
    try {
      canvasRef.current.setPointerCapture(ev.pointerId);
    } catch {}
    const p = pointFromEvent(ev);
    strokeRef.current = [p];
    const ctx = ctxRef.current;
    ctx.strokeStyle = getStroke();
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    onStart?.();
  }

  function onMove(ev: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || ev.pointerId !== pointerIdRef.current || !ctxRef.current) return;
    const p = pointFromEvent(ev);
    const stroke = strokeRef.current;
    const last = stroke[stroke.length - 1];
    const mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
    const ctx = ctxRef.current;
    ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    stroke.push(p);
  }

  function onUp(ev: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || ev.pointerId !== pointerIdRef.current || !ctxRef.current) return;
    drawingRef.current = false;
    const ctx = ctxRef.current;
    const stroke = strokeRef.current;
    if (stroke.length > 1) {
      const last = stroke[stroke.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    } else if (stroke.length === 1) {
      const p = stroke[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, strokeWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = getStroke();
      ctx.fill();
    }
    strokeRef.current = [];
    try {
      canvasRef.current?.releasePointerCapture(ev.pointerId);
    } catch {}
    emptyRef.current = false;
    onEnd?.();
    onChange?.(false);
  }

  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    background,
  };

  return (
    <div
      className={['cf-signpad', disabled && 'is-disabled', className].filter(Boolean).join(' ')}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="cf-signpad__canvas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
    </div>
  );
});
