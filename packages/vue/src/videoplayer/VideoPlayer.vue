<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  type VideoCaption,
  DEFAULT_PLAYBACK_RATES,
  formatTime,
} from './variants';

const props = withDefaults(
  defineProps<{
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: 'auto' | 'metadata' | 'none';
    aspectRatio?: string;
    captions?: VideoCaption[];
    playbackRates?: number[];
  }>(),
  {
    preload: 'metadata',
    aspectRatio: '16 / 9',
  },
);

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
  (e: 'timeupdate', time: number, duration: number): void;
  (e: 'volumechange', volume: number, muted: boolean): void;
  (e: 'ratechange', rate: number): void;
}>();

const root = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const playing = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const internalMuted = ref(props.muted ?? false);
const rate = ref(1);
const fullscreen = ref(false);
const showRateMenu = ref(false);
const idle = ref(false);
let idleTimer: ReturnType<typeof setTimeout> | null = null;

const progress = computed(() => (duration.value > 0 ? currentTime.value / duration.value : 0));
const rates = computed(() => props.playbackRates ?? DEFAULT_PLAYBACK_RATES);

function play() {
  video.value?.play().catch(() => {});
}
function pause() {
  video.value?.pause();
}
function toggle() {
  if (playing.value) pause();
  else play();
}

function seek(ev: MouseEvent) {
  if (!video.value || !duration.value) return;
  const target = ev.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
  video.value.currentTime = ratio * duration.value;
}

function onVolumeInput(ev: Event) {
  if (!video.value) return;
  const v = parseFloat((ev.target as HTMLInputElement).value);
  video.value.volume = v;
  video.value.muted = v === 0;
}

function toggleMute() {
  if (!video.value) return;
  video.value.muted = !video.value.muted;
}

function setRate(r: number) {
  if (!video.value) return;
  video.value.playbackRate = r;
  showRateMenu.value = false;
}

function toggleFullscreen() {
  const el = root.value;
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

function onFullscreenChange() {
  fullscreen.value = document.fullscreenElement === root.value;
}

function bumpIdle() {
  idle.value = false;
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (playing.value) idle.value = true;
  }, 2000);
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange);
});
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  if (idleTimer) clearTimeout(idleTimer);
});
</script>

<template>
  <div
    ref="root"
    class="cf-video"
    :class="{ 'is-idle': idle, 'is-fullscreen': fullscreen }"
    :style="{ aspectRatio }"
    @pointermove="bumpIdle"
    @pointerleave="bumpIdle"
  >
    <video
      ref="video"
      class="cf-video__el"
      :src="src"
      :poster="poster"
      :preload="preload"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      playsinline
      @click="toggle"
      @play="() => { playing = true; emit('play'); bumpIdle(); }"
      @pause="() => { playing = false; idle = false; emit('pause'); }"
      @ended="() => { playing = false; emit('ended'); }"
      @timeupdate="() => { if (video) { currentTime = video.currentTime; emit('timeupdate', video.currentTime, duration); } }"
      @durationchange="() => { if (video) duration = video.duration || 0; }"
      @volumechange="() => { if (video) { volume = video.volume; internalMuted = video.muted; emit('volumechange', volume, internalMuted); } }"
      @ratechange="() => { if (video) { rate = video.playbackRate; emit('ratechange', rate); } }"
    >
      <track
        v-for="c in captions"
        :key="c.src"
        kind="subtitles"
        :src="c.src"
        :srclang="c.srclang"
        :label="c.label"
        :default="c.default"
      />
    </video>
    <div class="cf-video__overlay">
      <slot name="overlay" />
    </div>
    <div class="cf-video__bar">
      <button
        type="button"
        class="cf-video__btn"
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
      <div class="cf-video__progress" @click="seek">
        <div class="cf-video__progress-fill" :style="{ width: `${progress * 100}%` }" />
      </div>
      <span class="cf-video__time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      <button
        type="button"
        class="cf-video__btn"
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
        type="range"
        class="cf-video__volume"
        min="0"
        max="1"
        step="0.01"
        :value="internalMuted ? 0 : volume"
        @input="onVolumeInput"
        aria-label="volume"
      />
      <div class="cf-video__rate">
        <button
          type="button"
          class="cf-video__btn cf-video__rate-toggle"
          @click="showRateMenu = !showRateMenu"
        >{{ rate.toFixed(2).replace(/\.?0+$/, '') }}×</button>
        <div v-if="showRateMenu" class="cf-video__rate-menu" role="menu">
          <button
            v-for="r in rates"
            :key="r"
            type="button"
            class="cf-video__rate-item"
            :class="{ 'is-active': rate === r }"
            @click="setRate(r)"
          >{{ r.toFixed(2).replace(/\.?0+$/, '') }}×</button>
        </div>
      </div>
      <button
        type="button"
        class="cf-video__btn"
        :aria-label="fullscreen ? 'exit fullscreen' : 'fullscreen'"
        @click="toggleFullscreen"
      >
        <svg v-if="!fullscreen" viewBox="0 0 24 24" width="14" height="14">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="14" height="14">
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </button>
    </div>
  </div>
</template>
