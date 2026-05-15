<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import {
  type Terrain3DProps,
  normalizeHeights,
  resolveColorScale,
} from './variants';

const props = withDefaults(
  defineProps<Terrain3DProps>(),
  {
    exaggeration: 1,
    colorScale: 'depth',
    wireframe: false,
    autoRotate: false,
    showGrid: false,
    background: 'oklch(13% 0.012 260)',
    rendererWidth: '100%',
    rendererHeight: 480,
  },
);

const emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'pick', payload: { x: number; y: number; z: number; row: number; col: number }): void;
}>();

const container = ref<HTMLDivElement | null>(null);
const error = ref<string | null>(null);

const sceneState = shallowRef<{
  THREE: typeof import('three');
  renderer: import('three').WebGLRenderer;
  scene: import('three').Scene;
  camera: import('three').PerspectiveCamera;
  controls: { update: () => void; dispose: () => void; autoRotate: boolean; target: import('three').Vector3 } | null;
  mesh: import('three').Mesh | null;
  wireframe: import('three').LineSegments | null;
  geometry: import('three').PlaneGeometry | null;
  grid: import('three').GridHelper | null;
  raf: number | null;
  resizeObs: ResizeObserver | null;
  pickRaycaster: import('three').Raycaster;
  pickPointer: import('three').Vector2;
} | null>(null);

const style = computed(() => ({
  width: typeof props.rendererWidth === 'number' ? `${props.rendererWidth}px` : props.rendererWidth,
  height: typeof props.rendererHeight === 'number' ? `${props.rendererHeight}px` : props.rendererHeight,
  background: props.background,
}));

async function mount() {
  if (!container.value) return;
  let THREE: typeof import('three');
  let OrbitControlsCtor: typeof import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
  try {
    THREE = await import('three');
    const orbit = await import('three/examples/jsm/controls/OrbitControls.js');
    OrbitControlsCtor = orbit.OrbitControls;
  } catch (e) {
    error.value = "未检测到 three.js 依赖。请安装：pnpm add three";
    return;
  }

  const el = container.value;
  const rect = el.getBoundingClientRect();
  const w = Math.max(64, rect.width);
  const h = Math.max(64, rect.height);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(w, h, false);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
  const pitch = ((props.camera?.pitch ?? 60) * Math.PI) / 180;
  const yaw = ((props.camera?.yaw ?? 0) * Math.PI) / 180;
  const zoom = props.camera?.zoom ?? 1;
  const distance = 240 * zoom;
  camera.position.set(
    Math.sin(yaw) * distance * Math.cos(pitch),
    distance * Math.sin(pitch),
    Math.cos(yaw) * distance * Math.cos(pitch),
  );
  camera.lookAt(0, 0, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223347, 0.7);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(200, 300, 120);
  scene.add(dir);

  const controls = new OrbitControlsCtor(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);
  controls.autoRotate = !!props.autoRotate;
  controls.autoRotateSpeed = 0.4;

  const pickRaycaster = new THREE.Raycaster();
  const pickPointer = new THREE.Vector2();

  sceneState.value = {
    THREE,
    renderer,
    scene,
    camera,
    controls,
    mesh: null,
    wireframe: null,
    geometry: null,
    grid: null,
    raf: null,
    resizeObs: null,
    pickRaycaster,
    pickPointer,
  };

  rebuildMesh();
  rebuildGrid();

  function tick() {
    const s = sceneState.value;
    if (!s) return;
    s.controls?.update();
    s.renderer.render(s.scene, s.camera);
    s.raf = requestAnimationFrame(tick);
  }
  sceneState.value.raf = requestAnimationFrame(tick);

  const ro = new ResizeObserver(() => {
    onResize();
  });
  ro.observe(el);
  sceneState.value.resizeObs = ro;

  renderer.domElement.addEventListener('click', onPickClick);

  emit('ready');
}

function onResize() {
  const s = sceneState.value;
  if (!s || !container.value) return;
  const rect = container.value.getBoundingClientRect();
  const w = Math.max(64, rect.width);
  const h = Math.max(64, rect.height);
  s.renderer.setSize(w, h, false);
  s.camera.aspect = w / h;
  s.camera.updateProjectionMatrix();
}

function onPickClick(ev: MouseEvent) {
  const s = sceneState.value;
  if (!s || !s.mesh || !container.value) return;
  const rect = s.renderer.domElement.getBoundingClientRect();
  s.pickPointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  s.pickPointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  s.pickRaycaster.setFromCamera(s.pickPointer, s.camera);
  const hits = s.pickRaycaster.intersectObject(s.mesh, false);
  if (hits.length === 0) return;
  const p = hits[0].point;
  const planeSize = 200;
  const u = (p.x + planeSize / 2) / planeSize;
  const v = (p.z + planeSize / 2) / planeSize;
  const col = Math.max(0, Math.min(props.width - 1, Math.floor(u * props.width)));
  const row = Math.max(0, Math.min(props.height - 1, Math.floor(v * props.height)));
  emit('pick', { x: p.x, y: p.y, z: p.z, row, col });
}

function rebuildMesh() {
  const s = sceneState.value;
  if (!s) return;
  const { THREE } = s;
  if (s.mesh) {
    s.scene.remove(s.mesh);
    s.geometry?.dispose();
    (s.mesh.material as import('three').Material).dispose();
    s.mesh = null;
    s.geometry = null;
  }
  if (s.wireframe) {
    s.scene.remove(s.wireframe);
    (s.wireframe.geometry as import('three').BufferGeometry).dispose();
    (s.wireframe.material as import('three').Material).dispose();
    s.wireframe = null;
  }

  const cols = props.width;
  const rows = props.height;
  if (cols < 2 || rows < 2 || props.heightData.length < cols * rows) return;

  const planeSize = 200;
  const geom = new THREE.PlaneGeometry(planeSize, planeSize, cols - 1, rows - 1);
  geom.rotateX(-Math.PI / 2);

  const { min, range } = normalizeHeights(props.heightData, props.minHeight, props.maxHeight);
  const colorFn = resolveColorScale(props.colorScale);
  const positions = geom.attributes.position as import('three').BufferAttribute;
  const colors = new Float32Array(positions.count * 3);
  const exaggeration = props.exaggeration;
  const vScale = (60 * exaggeration) / (range || 1);
  for (let i = 0; i < positions.count; i++) {
    const v = props.heightData[i] ?? min;
    const t = (v - min) / range;
    positions.setY(i, (v - min) * vScale - 30);
    const c = colorFn(t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  positions.needsUpdate = true;
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geom, mat);
  s.scene.add(mesh);
  s.mesh = mesh;
  s.geometry = geom;

  if (props.wireframe) {
    const wg = new THREE.WireframeGeometry(geom);
    const wm = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.12, transparent: true });
    const wf = new THREE.LineSegments(wg, wm);
    s.scene.add(wf);
    s.wireframe = wf;
  }
}

function rebuildGrid() {
  const s = sceneState.value;
  if (!s) return;
  const { THREE } = s;
  if (s.grid) {
    s.scene.remove(s.grid);
    (s.grid.geometry as import('three').BufferGeometry).dispose();
    (s.grid.material as import('three').Material).dispose();
    s.grid = null;
  }
  if (props.showGrid) {
    const grid = new THREE.GridHelper(220, 22, 0x3a4a5e, 0x222a36);
    grid.position.y = -30.2;
    s.scene.add(grid);
    s.grid = grid;
  }
}

function dispose() {
  const s = sceneState.value;
  if (!s) return;
  if (s.raf != null) cancelAnimationFrame(s.raf);
  s.resizeObs?.disconnect();
  s.renderer.domElement.removeEventListener('click', onPickClick);
  s.controls?.dispose();
  if (s.mesh) {
    s.scene.remove(s.mesh);
    s.geometry?.dispose();
    (s.mesh.material as import('three').Material).dispose();
  }
  if (s.wireframe) {
    (s.wireframe.geometry as import('three').BufferGeometry).dispose();
    (s.wireframe.material as import('three').Material).dispose();
  }
  if (s.grid) {
    (s.grid.geometry as import('three').BufferGeometry).dispose();
    (s.grid.material as import('three').Material).dispose();
  }
  s.renderer.dispose();
  s.renderer.domElement.remove();
  sceneState.value = null;
}

onMounted(mount);
onBeforeUnmount(dispose);

watch(
  () => [
    props.heightData,
    props.width,
    props.height,
    props.exaggeration,
    props.colorScale,
    props.minHeight,
    props.maxHeight,
    props.wireframe,
  ],
  () => {
    if (sceneState.value) rebuildMesh();
  },
);
watch(
  () => props.showGrid,
  () => {
    if (sceneState.value) rebuildGrid();
  },
);
watch(
  () => props.autoRotate,
  (v) => {
    if (sceneState.value?.controls) sceneState.value.controls.autoRotate = !!v;
  },
);
</script>

<template>
  <div ref="container" class="cf-terrain3d" :style="style">
    <div v-if="error" class="cf-terrain3d__error">{{ error }}</div>
  </div>
</template>
