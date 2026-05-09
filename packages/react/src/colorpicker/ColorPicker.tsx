import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  formatColor,
  hsvToRgb,
  parseColor,
  rgbToHex,
  rgbToHsv,
  type ColorFormat,
  type HSV,
} from './color';
import {
  colorPickerClass,
  DEFAULT_PRESETS,
  type ColorPickerProps,
} from './variants';

export function ColorPicker(props: ColorPickerProps) {
  const {
    value,
    defaultValue = '#3b82f6',
    defaultFormat = 'hex',
    showAlpha = false,
    presets = DEFAULT_PRESETS,
    disabled = false,
    size = 'md',
    panelOnly = false,
    name,
    id,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? (value as string) : internal;

  const [open, setOpen] = useState(panelOnly);
  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const [hsv, setHsv] = useState<HSV>({ h: 220, s: 0.7, v: 0.96 });
  const [alpha, setAlpha] = useState(1);
  const [draft, setDraft] = useState(current);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const svRef = useRef<HTMLDivElement | null>(null);
  const skipSync = useRef(false);

  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    setDraft(current);
    const parsed = parseColor(current);
    if (!parsed) return;
    const next = rgbToHsv(parsed);
    setHsv((prev) => (next.s > 0 ? next : { ...prev, s: next.s, v: next.v }));
    setAlpha(parsed.a);
  }, [current]);

  const rgba = useMemo(
    () => ({ ...hsvToRgb(hsv), a: alpha }),
    [hsv, alpha],
  );
  const formatted = useMemo(() => formatColor(rgba, format), [rgba, format]);
  const swatchHex = useMemo(
    () => rgbToHex({ r: rgba.r, g: rgba.g, b: rgba.b }),
    [rgba],
  );
  const hueColor = useMemo(
    () => rgbToHex(hsvToRgb({ h: hsv.h, s: 1, v: 1 })),
    [hsv.h],
  );

  const commit = useCallback(
    (next: string) => {
      skipSync.current = true;
      setDraft(next);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  function commitFromHsv(h: HSV, a: number, f: ColorFormat) {
    const rgb = hsvToRgb(h);
    commit(formatColor({ ...rgb, a }, f));
  }

  useEffect(() => {
    if (panelOnly || !open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, panelOnly]);

  function onSvPointer(e: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) return;
    const el = svRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    const update = (clientX: number, clientY: number) => {
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const next = {
        h: hsv.h,
        s: Math.min(1, Math.max(0, x)),
        v: Math.min(1, Math.max(0, 1 - y)),
      };
      setHsv(next);
      commitFromHsv(next, alpha, format);
    };
    update(e.clientX, e.clientY);
    const move = (ev: globalThis.PointerEvent) => update(ev.clientX, ev.clientY);
    const release = (ev: globalThis.PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', release);
      el.removeEventListener('pointercancel', release);
      el.releasePointerCapture(ev.pointerId);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  }

  function onHueInput(e: ChangeEvent<HTMLInputElement>) {
    const next = { ...hsv, h: +e.target.value };
    setHsv(next);
    commitFromHsv(next, alpha, format);
  }

  function onAlphaInput(e: ChangeEvent<HTMLInputElement>) {
    const v = +e.target.value / 100;
    setAlpha(v);
    commitFromHsv(hsv, v, format);
  }

  function onInputBlur() {
    const parsed = parseColor(draft);
    if (parsed) {
      const next = rgbToHsv(parsed);
      const merged = next.s > 0 ? next : { ...hsv, s: next.s, v: next.v };
      setHsv(merged);
      setAlpha(parsed.a);
      commitFromHsv(merged, parsed.a, format);
    } else {
      setDraft(formatted);
    }
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
  }

  function pickPreset(c: string) {
    if (disabled) return;
    const parsed = parseColor(c);
    if (!parsed) return;
    const next = rgbToHsv(parsed);
    const merged = next.s > 0 ? next : { ...hsv, s: next.s, v: next.v };
    setHsv(merged);
    setAlpha(parsed.a);
    commitFromHsv(merged, parsed.a, format);
  }

  function changeFormat(f: ColorFormat) {
    setFormat(f);
    setDraft(formatColor(rgba, f));
  }

  const cls = colorPickerClass({ size, open, disabled, panelOnly, className });

  return (
    <div ref={rootRef} className={cls} id={id}>
      {!panelOnly ? (
        <button
          type="button"
          className="cf-color__trigger"
          name={name}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((v) => !v)}
        >
          <span
            className="cf-color__swatch"
            style={{ background: formatted }}
            aria-hidden="true"
          />
          <span className="cf-color__value">{formatted}</span>
        </button>
      ) : null}

      {open || panelOnly ? (
        <div className="cf-color__panel" role="dialog">
          <div
            ref={svRef}
            className="cf-color__sv"
            style={{ background: hueColor }}
            onPointerDown={onSvPointer}
          >
            <div className="cf-color__sv-white" />
            <div className="cf-color__sv-black" />
            <div
              className="cf-color__sv-cursor"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
              }}
            />
          </div>

          <div className="cf-color__sliders">
            <div className="cf-color__preview">
              <span
                className="cf-color__preview-swatch"
                style={{ background: formatted }}
              />
              {showAlpha ? (
                <span
                  className="cf-color__preview-swatch cf-color__preview-swatch--solid"
                  style={{ background: swatchHex }}
                />
              ) : null}
            </div>

            <div className="cf-color__slider-group">
              <input
                type="range"
                className="cf-color__slider cf-color__slider--hue"
                min={0}
                max={360}
                step={1}
                value={hsv.h}
                disabled={disabled}
                aria-label="色相"
                onChange={onHueInput}
              />
              {showAlpha ? (
                <input
                  type="range"
                  className="cf-color__slider cf-color__slider--alpha"
                  style={{ '--solid': swatchHex } as CSSProperties}
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(alpha * 100)}
                  disabled={disabled}
                  aria-label="透明度"
                  onChange={onAlphaInput}
                />
              ) : null}
            </div>
          </div>

          <div className="cf-color__formats">
            {(['hex', 'rgb', 'hsl'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`cf-color__format${format === f ? ' is-active' : ''}`}
                onClick={() => changeFormat(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="cf-color__input"
            value={draft}
            disabled={disabled}
            spellCheck={false}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
          />

          {presets.length ? (
            <div className="cf-color__presets">
              {presets.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="cf-color__preset"
                  style={{ background: c }}
                  aria-label={c}
                  title={c}
                  onClick={() => pickPreset(c)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
