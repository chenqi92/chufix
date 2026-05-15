<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { drawWaveform, formatTime } from './variants';

const props = withDefaults(
  defineProps<{
    src: string;
    peaks?: number[];
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: 'auto' | 'metadata' | 'none';
  }>(),
  {
    preload: 'metadata',
  },
);

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
  (e: 'timeupdate', time: number, duration: number): void;
  (e: 'volumechange', volume: number, muted: boolean): void;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const playing = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const internalMuted = ref(props.muted ?? false);
let dpr = 1;

const progress = computed(() => (duration.value > 0 ? currentTime.value / duration.value : 0));
const hasPeaks = computed(() => Array.isArray(props.peaks) && props.peaks.length > 0);

function play() {
  audio.value?.play().catch(() => {});
}
function pause() {
  audio.value?.pause();
}
function toggle() {
  if (playing.value) pause();
  else play();
}

function seekFromPointer(ev: MouseEvent) {
  if (!audio.value || !duration.value) return;
  const target = ev.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
  audio.value.currentTime = ratio * duration.value;
}

function onPlay() {
  playing.value = true;
  emit('play');
}
function onPause() {
  playing.value = false;
  emit('pause');
}
function onEnded() {
  playing.value = false;
  emit('ended');
}
function onTimeUpdate() {
  if (!audio.value) return;
  currentTime.value = audio.value.currentTime;
  emit('timeupdate', audio.value.currentTime, duration.value);
}
function onDurationChange() {
  if (!audio.value) return;
  duration.value = audio.value.duration || 0;
}
function onVolume() {
  if (!audio.value) return;
  volume.value = audio.value.volume;
  internalMuted.value = audio.value.muted;
  emit('volumechange', volume.value, internalMuted.value);
}

function onVolumeInput(ev: Event) {
  if (!audio.value) return;
  const v = parseFloat((ev.target as HTMLInputElement).value);
  audio.value.volume = v;
  audio.value.muted = v === 0;
}

function toggleMute() {
  if (!audio.value) return;
  audio.value.muted = !audio.value.muted;
}

function resize() {
  const el = canvas.value;
  if (!el) return;
  dpr = window.devicePixelRatio || 1;
  const rect = el.getBoundingClientRect();
  el.width = Math.max(1, Math.round(rect.width * dpr));
  el.height = Math.max(1, Math.round(rect.height * dpr));
  redraw();
}

function redraw() {
  const el = canvas.value;
  if (!el || !hasPeaks.value) return;
  const ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawWaveform(
    ctx,
    props.peaks!,
    el.width,
    el.height,
    progress.value,
    'rgba(255,255,255,0.25)',
    'currentColor',
  );
  ctx.restore();
}

onMounted(() => {
  if (audio.value) {
    volume.value = audio.value.volume;
    internalMuted.value = audio.value.muted;
  }
  resize();
  window.addEventListener('resize', resize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});

watch(progress, redraw);
watch(() => props.peaks, () => {
  resize();
});

const currentLabel = computed(() => formatTime(currentTime.value));
const totalLabel = computed(() => formatTime(duration.value));
</script>

<template>
  <div class="cf-audio">
    <audio
      ref="audio"
      :src="src"
      :preload="preload"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @durationchange="onDurationChange"
      @volumechange="onVolume"
    />
    <button
      type="button"
      class="cf-audio__play"
      :aria-label="playing ? 'pause' : 'play'"
      @click="toggle"
    >
      <svg v-if="!playing" viewBox="0 0 24 24" width="16" height="16">
        <path d="M7 4l13 8-13 8z" fill="currentColor" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="16" height="16">
        <rect x="6" y="4" width="4" height="16" fill="currentColor" />
        <rect x="14" y="4" width="4" height="16" fill="currentColor" />
      </svg>
    </button>
    <div class="cf-audio__progress" @click="seekFromPointer">
      <canvas v-if="hasPeaks" ref="canvas" class="cf-audio__wave" />
      <div v-else class="cf-audio__bar">
        <div class="cf-audio__bar-fill" :style="{ width: `${progress * 100}%` }" />
      </div>
    </div>
    <span class="cf-audio__time">{{ currentLabel }} / {{ totalLabel }}</span>
    <button
      type="button"
      class="cf-audio__mute"
      :aria-label="internalMuted ? 'unmute' : 'mute'"
      @click="toggleMute"
    >
      <svg v-if="!internalMuted" viewBox="0 0 24 24" width="14" height="14">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        <path d="M16 8q3 4 0 8" fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="14" height="14">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        <path d="M17 9l5 6m0-6l-5 6" fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
    </button>
    <input
      class="cf-audio__volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="internalMuted ? 0 : volume"
      @input="onVolumeInput"
      aria-label="volume"
    />
  </div>
</template>
