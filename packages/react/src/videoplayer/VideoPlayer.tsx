import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  type VideoCaption,
  DEFAULT_PLAYBACK_RATES,
  formatTime,
} from './variants';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  aspectRatio?: string;
  captions?: VideoCaption[];
  playbackRates?: number[];
  className?: string;
  overlay?: ReactNode;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number, duration: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onRateChange?: (rate: number) => void;
}

export function VideoPlayer({
  src,
  poster,
  autoplay,
  loop,
  muted,
  preload = 'metadata',
  aspectRatio = '16 / 9',
  captions,
  playbackRates,
  className,
  overlay,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onRateChange,
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted ?? false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showRateMenu, setShowRateMenu] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progress = duration > 0 ? currentTime / duration : 0;
  const rates = playbackRates ?? DEFAULT_PLAYBACK_RATES;

  function play() {
    videoRef.current?.play().catch(() => {});
  }
  function pause() {
    videoRef.current?.pause();
  }
  function toggle() {
    if (playing) pause();
    else play();
  }
  function seek(ev: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
  }
  function onVolumeInput(ev: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(ev.target.value);
    v.volume = val;
    v.muted = val === 0;
  }
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }
  function applyRate(r: number) {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = r;
    setShowRateMenu(false);
  }
  function toggleFullscreen() {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }
  function bumpIdle() {
    setIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (playing) setIdle(true);
    }, 2000);
  }

  useEffect(() => {
    function onFs() {
      setFullscreen(document.fullscreenElement === rootRef.current);
    }
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={[
        'cf-video',
        idle && 'is-idle',
        fullscreen && 'is-fullscreen',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ aspectRatio }}
      onPointerMove={bumpIdle}
      onPointerLeave={bumpIdle}
    >
      <video
        ref={videoRef}
        className="cf-video__el"
        src={src}
        poster={poster}
        preload={preload}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={toggle}
        onPlay={() => { setPlaying(true); onPlay?.(); bumpIdle(); }}
        onPause={() => { setPlaying(false); setIdle(false); onPause?.(); }}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          onTimeUpdate?.(v.currentTime, duration);
        }}
        onDurationChange={() => {
          const v = videoRef.current;
          if (!v) return;
          setDuration(v.duration || 0);
        }}
        onVolumeChange={() => {
          const v = videoRef.current;
          if (!v) return;
          setVolume(v.volume);
          setIsMuted(v.muted);
          onVolumeChange?.(v.volume, v.muted);
        }}
        onRateChange={() => {
          const v = videoRef.current;
          if (!v) return;
          setRate(v.playbackRate);
          onRateChange?.(v.playbackRate);
        }}
      >
        {captions?.map((c) => (
          <track
            key={c.src}
            kind="subtitles"
            src={c.src}
            srcLang={c.srclang}
            label={c.label}
            default={c.default}
          />
        ))}
      </video>
      <div className="cf-video__overlay">{overlay}</div>
      <div className="cf-video__bar">
        <button
          type="button"
          className="cf-video__btn"
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
        <div className="cf-video__progress" onClick={seek}>
          <div className="cf-video__progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="cf-video__time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <button
          type="button"
          className="cf-video__btn"
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
          type="range"
          className="cf-video__volume"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={onVolumeInput}
          aria-label="volume"
        />
        <div className="cf-video__rate">
          <button
            type="button"
            className="cf-video__btn cf-video__rate-toggle"
            onClick={() => setShowRateMenu((m) => !m)}
          >
            {rate.toFixed(2).replace(/\.?0+$/, '')}×
          </button>
          {showRateMenu && (
            <div className="cf-video__rate-menu" role="menu">
              {rates.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={['cf-video__rate-item', rate === r && 'is-active'].filter(Boolean).join(' ')}
                  onClick={() => applyRate(r)}
                >
                  {r.toFixed(2).replace(/\.?0+$/, '')}×
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="cf-video__btn"
          aria-label={fullscreen ? 'exit fullscreen' : 'fullscreen'}
          onClick={toggleFullscreen}
        >
          {!fullscreen ? (
            <svg viewBox="0 0 24 24" width={14} height={14}>
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth={1.6} />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={14} height={14}>
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" strokeWidth={1.6} />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
