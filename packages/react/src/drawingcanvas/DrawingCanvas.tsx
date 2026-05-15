import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  type DrawingCanvasHandle,
  type DrawingPoint,
  type DrawingStroke,
  type DrawingTool,
  DEFAULT_PALETTE,
  DEFAULT_SIZES,
  strokePath,
} from './variants';

export interface DrawingCanvasProps {
  width?: number | string;
  height?: number | string;
  initialStrokes?: DrawingStroke[];
  colors?: string[];
  sizes?: number[];
  background?: string;
  toolbar?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (strokes: DrawingStroke[]) => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(function DrawingCanvas(
  {
    width = '100%',
    height = 320,
    initialStrokes,
    colors,
    sizes,
    background = 'transparent',
    toolbar = true,
    disabled,
    className,
    onChange,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const pointerIdRef = useRef(-1);
  const currentRef = useRef<DrawingStroke | null>(null);

  const palette = colors ?? DEFAULT_PALETTE;
  const brushSizes = sizes ?? DEFAULT_SIZES;

  const [color, setColor] = useState(palette[1] ?? '#fff');
  const [size, setSize] = useState(brushSizes[1] ?? 4);
  const [tool, setTool] = useState<DrawingTool>('brush');
  const [strokes, setStrokes] = useState<DrawingStroke[]>([...(initialStrokes ?? [])]);
  const [future, setFuture] = useState<DrawingStroke[]>([]);

  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;
  const futureRef = useRef(future);
  futureRef.current = future;

  const redraw = useCallback(() => {
    const el = canvasRef.current;
    const ctx = ctxRef.current;
    if (!el || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, el.width, el.height);
    ctx.restore();
    for (const s of strokesRef.current) strokePath(s, ctx);
    if (currentRef.current) strokePath(currentRef.current, ctx);
  }, []);

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
    ctxRef.current = ctx;
    redraw();
  }, [redraw]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    redraw();
  }, [strokes, redraw]);

  useImperativeHandle(
    ref,
    (): DrawingCanvasHandle => ({
      clear: () => {
        setStrokes([]);
        setFuture([]);
        onChange?.([]);
      },
      undo: () => {
        if (strokesRef.current.length === 0) return;
        const last = strokesRef.current[strokesRef.current.length - 1];
        const next = strokesRef.current.slice(0, -1);
        setStrokes(next);
        setFuture([...futureRef.current, last]);
        onChange?.(next);
      },
      redo: () => {
        if (futureRef.current.length === 0) return;
        const last = futureRef.current[futureRef.current.length - 1];
        const newFuture = futureRef.current.slice(0, -1);
        const newStrokes = [...strokesRef.current, last];
        setFuture(newFuture);
        setStrokes(newStrokes);
        onChange?.(newStrokes);
      },
      getStrokes: () => strokesRef.current,
      setStrokes: (next) => {
        setStrokes([...next]);
        setFuture([]);
        onChange?.(next);
      },
      toDataURL: (type = 'image/png', quality?: number) =>
        canvasRef.current?.toDataURL(type, quality) ?? '',
      toBlob: (type = 'image/png', quality?: number) =>
        new Promise((resolve) => {
          const el = canvasRef.current;
          if (!el) return resolve(null);
          el.toBlob(resolve, type, quality);
        }),
    }),
    [onChange],
  );

  function pointFromEvent(ev: React.PointerEvent): DrawingPoint {
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
    currentRef.current = {
      tool,
      color,
      width: size,
      points: [pointFromEvent(ev)],
    };
    redraw();
  }
  function onMove(ev: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || ev.pointerId !== pointerIdRef.current || !currentRef.current) return;
    currentRef.current.points.push(pointFromEvent(ev));
    redraw();
  }
  function onUp(ev: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || ev.pointerId !== pointerIdRef.current || !currentRef.current) return;
    drawingRef.current = false;
    const finished = currentRef.current;
    currentRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(ev.pointerId);
    } catch {}
    const nextStrokes = [...strokesRef.current, finished];
    setStrokes(nextStrokes);
    setFuture([]);
    onChange?.(nextStrokes);
  }

  function doUndo() {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    const next = strokes.slice(0, -1);
    setStrokes(next);
    setFuture([...future, last]);
    onChange?.(next);
  }
  function doRedo() {
    if (future.length === 0) return;
    const last = future[future.length - 1];
    const newFuture = future.slice(0, -1);
    const newStrokes = [...strokes, last];
    setFuture(newFuture);
    setStrokes(newStrokes);
    onChange?.(newStrokes);
  }
  function doClear() {
    if (strokes.length === 0) return;
    setStrokes([]);
    setFuture([]);
    onChange?.([]);
  }

  const wrapStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    background,
  };
  const canvasStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={['cf-draw', disabled && 'is-disabled', className].filter(Boolean).join(' ')}
      style={wrapStyle}
    >
      {toolbar && (
        <div className="cf-draw__bar">
          <div className="cf-draw__tools">
            <button
              type="button"
              className={['cf-draw__tool', tool === 'brush' && 'is-active'].filter(Boolean).join(' ')}
              disabled={disabled}
              aria-label="brush"
              onClick={() => setTool('brush')}
            >
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path d="M2 13l3-2.5L10 5l1.5 1.5L6 12 3.5 14z" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className={['cf-draw__tool', tool === 'eraser' && 'is-active'].filter(Boolean).join(' ')}
              disabled={disabled}
              aria-label="eraser"
              onClick={() => setTool('eraser')}
            >
              <svg viewBox="0 0 16 16" width={14} height={14}>
                <path
                  d="M3 12l5.5-5.5 4 4L7 16H3v-4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="cf-draw__colors">
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                className={['cf-draw__color', color === c && 'is-active'].filter(Boolean).join(' ')}
                style={{ background: c }}
                disabled={disabled}
                aria-label={`color ${c}`}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="cf-draw__sizes">
            {brushSizes.map((s) => (
              <button
                key={s}
                type="button"
                className={['cf-draw__size', size === s && 'is-active'].filter(Boolean).join(' ')}
                disabled={disabled}
                aria-label={`size ${s}`}
                onClick={() => setSize(s)}
              >
                <span style={{ width: `${s}px`, height: `${s}px` }} />
              </button>
            ))}
          </div>
          <div className="cf-draw__spacer" />
          <button
            type="button"
            className="cf-draw__action"
            disabled={disabled || strokes.length === 0}
            onClick={doUndo}
          >撤销</button>
          <button
            type="button"
            className="cf-draw__action"
            disabled={disabled || future.length === 0}
            onClick={doRedo}
          >重做</button>
          <button
            type="button"
            className="cf-draw__action"
            disabled={disabled || strokes.length === 0}
            onClick={doClear}
          >清空</button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="cf-draw__canvas"
        style={canvasStyle}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
    </div>
  );
});
