import { useCallback, useEffect, useRef, useState } from 'react';
import { drawWaveform, formatTime } from './variants';

export interface AudioPlayerProps {
  src: string;
  peaks?: number[];
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number, duration: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
}

export function AudioPlayer({
  src,
  peaks,
  autoplay,
  loop,
  muted,
  preload = 'metadata',
  className,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted ?? false);

  const progress = duration > 0 ? currentTime / duration : 0;
  const hasPeaks = Array.isArray(peaks) && peaks.length > 0;

  const redraw = useCallback(() => {
    const el = canvasRef.current;
    if (!el || !hasPeaks || !peaks) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawWaveform(ctx, peaks, el.width, el.height, progress, 'rgba(255,255,255,0.25)', 'currentColor');
    ctx.restore();
  }, [hasPeaks, peaks, progress]);

  const resize = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();
    el.width = Math.max(1, Math.round(rect.width * dpr));
    el.height = Math.max(1, Math.round(rect.height * dpr));
    redraw();
  }, [redraw]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    redraw();
  }, [progress, redraw]);

  function play() {
    audioRef.current?.play().catch(() => {});
  }
  function pause() {
    audioRef.current?.pause();
  }
  function toggle() {
    if (playing) pause();
    else play();
  }

  function seek(ev: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || !duration) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  }

  function onVolumeInput(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return;
    const v = parseFloat(ev.target.value);
    audioRef.current.volume = v;
    audioRef.current.muted = v === 0;
  }
  function toggleMute() {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
  }

  return (
    <div className={['cf-audio', className].filter(Boolean).join(' ')}>
      <audio
        ref={audioRef}
        src={src}
        preload={preload}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        onPlay={() => { setPlaying(true); onPlay?.(); }}
        onPause={() => { setPlaying(false); onPause?.(); }}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          onTimeUpdate?.(a.currentTime, duration);
        }}
        onDurationChange={() => {
          const a = audioRef.current;
          if (!a) return;
          setDuration(a.duration || 0);
        }}
        onVolumeChange={() => {
          const a = audioRef.current;
          if (!a) return;
          setVolume(a.volume);
          setIsMuted(a.muted);
          onVolumeChange?.(a.volume, a.muted);
        }}
      />
      <button
        type="button"
        className="cf-audio__play"
        aria-label={playing ? 'pause' : 'play'}
        onClick={toggle}
      >
        {!playing ? (
          <svg viewBox="0 0 24 24" width={16} height={16}>
            <path d="M7 4l13 8-13 8z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width={16} height={16}>
            <rect x={6} y={4} width={4} height={16} fill="currentColor" />
            <rect x={14} y={4} width={4} height={16} fill="currentColor" />
          </svg>
        )}
      </button>
      <div className="cf-audio__progress" onClick={seek}>
        {hasPeaks ? (
          <canvas ref={canvasRef} className="cf-audio__wave" />
        ) : (
          <div className="cf-audio__bar">
            <div className="cf-audio__bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
      <span className="cf-audio__time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      <button
        type="button"
        className="cf-audio__mute"
        aria-label={isMuted ? 'unmute' : 'mute'}
        onClick={toggleMute}
      >
        {!isMuted ? (
          <svg viewBox="0 0 24 24" width={14} height={14}>
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M16 8q3 4 0 8" fill="none" stroke="currentColor" strokeWidth={1.6} />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width={14} height={14}>
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M17 9l5 6m0-6l-5 6" fill="none" stroke="currentColor" strokeWidth={1.6} />
          </svg>
        )}
      </button>
      <input
        className="cf-audio__volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={onVolumeInput}
        aria-label="volume"
      />
    </div>
  );
}
