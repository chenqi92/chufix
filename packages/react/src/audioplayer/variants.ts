export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  peaks: number[],
  width: number,
  height: number,
  progress: number,
  baseColor: string,
  activeColor: string,
) {
  ctx.clearRect(0, 0, width, height);
  if (peaks.length === 0) return;
  const barCount = Math.min(peaks.length, Math.floor(width / 3));
  const barWidth = Math.max(1, (width - barCount) / barCount);
  const gap = Math.max(1, width / barCount - barWidth);
  const cutoff = Math.floor(progress * barCount);
  for (let i = 0; i < barCount; i++) {
    const idx = Math.floor((i / barCount) * peaks.length);
    const v = Math.max(0.05, peaks[idx] ?? 0);
    const barHeight = Math.max(2, v * (height - 4));
    const x = i * (barWidth + gap);
    const y = (height - barHeight) / 2;
    ctx.fillStyle = i < cutoff ? activeColor : baseColor;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
}
