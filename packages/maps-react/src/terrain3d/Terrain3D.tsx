import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  type Terrain3DColorScale,
  type Terrain3DBounds,
  type Terrain3DCamera,
  normalizeHeights,
  resolveColorScale,
} from './variants';

export interface Terrain3DPickPayload {
  x: number;
  y: number;
  z: number;
  row: number;
  col: number;
}

export interface Terrain3DProps {
  heightData: number[] | Float32Array;
  width: number;
  height: number;
  bounds?: Terrain3DBounds;
  minHeight?: number;
  maxHeight?: number;
  exaggeration?: number;
  colorScale?: Terrain3DColorScale | ((t: number) => { r: number; g: number; b: number });
  wireframe?: boolean;
  camera?: Terrain3DCamera;
  autoRotate?: boolean;
  showGrid?: boolean;
  background?: string;
  rendererWidth?: number | string;
  rendererHeight?: number | string;
  className?: string;
  onReady?: () => void;
  onPick?: (payload: Terrain3DPickPayload) => void;
}

export function Terrain3D({
  heightData,
  width,
  height,
  minHeight,
  maxHeight,
  exaggeration = 1,
  colorScale = 'depth',
  wireframe = false,
  camera,
  autoRotate = false,
  showGrid = false,
  background = 'oklch(13% 0.012 260)',
  rendererWidth = '100%',
  rendererHeight = 480,
  className,
  onReady,
  onPick,
}: Terrain3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const propsRef = useRef({ heightData, width, height, minHeight, maxHeight, exaggeration, colorScale, wireframe, onPick });
  propsRef.current = { heightData, width, height, minHeight, maxHeight, exaggeration, colorScale, wireframe, onPick };

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    (async () => {
      let THREE: typeof import('three');
      let OrbitControlsCtor: typeof import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
      try {
        THREE = await import('three');
        const orbit = await import('three/examples/jsm/controls/OrbitControls.js');
        OrbitControlsCtor = orbit.OrbitControls;
      } catch {
        if (!cancelled) setError('未检测到 three.js 依赖。请安装：pnpm add three');
        return;
      }
      if (cancelled) return;

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
      const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
      const pitch = ((camera?.pitch ?? 60) * Math.PI) / 180;
      const yaw = ((camera?.yaw ?? 0) * Math.PI) / 180;
      const zoom = camera?.zoom ?? 1;
      const distance = 240 * zoom;
      cam.position.set(
        Math.sin(yaw) * distance * Math.cos(pitch),
        distance * Math.sin(pitch),
        Math.cos(yaw) * distance * Math.cos(pitch),
      );
      cam.lookAt(0, 0, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x223347, 0.7));
      const dir = new THREE.DirectionalLight(0xffffff, 0.7);
      dir.position.set(200, 300, 120);
      scene.add(dir);

      const controls = new OrbitControlsCtor(cam, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, 0, 0);
      controls.autoRotate = !!autoRotate;
      controls.autoRotateSpeed = 0.4;

      const pickRaycaster = new THREE.Raycaster();
      const pickPointer = new THREE.Vector2();

      const state: any = {
        THREE,
        renderer,
        scene,
        camera: cam,
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
      stateRef.current = state;

      function rebuildMesh() {
        const p = propsRef.current;
        if (state.mesh) {
          state.scene.remove(state.mesh);
          state.geometry?.dispose();
          state.mesh.material.dispose();
          state.mesh = null;
          state.geometry = null;
        }
        if (state.wireframe) {
          state.scene.remove(state.wireframe);
          state.wireframe.geometry.dispose();
          state.wireframe.material.dispose();
          state.wireframe = null;
        }
        const cols = p.width;
        const rows = p.height;
        if (cols < 2 || rows < 2 || p.heightData.length < cols * rows) return;
        const planeSize = 200;
        const geom = new THREE.PlaneGeometry(planeSize, planeSize, cols - 1, rows - 1);
        geom.rotateX(-Math.PI / 2);
        const { min, range } = normalizeHeights(p.heightData, p.minHeight, p.maxHeight);
        const colorFn = resolveColorScale(p.colorScale);
        const positions = geom.attributes.position as import('three').BufferAttribute;
        const colors = new Float32Array(positions.count * 3);
        const vScale = (60 * p.exaggeration) / (range || 1);
        for (let i = 0; i < positions.count; i++) {
          const v = p.heightData[i] ?? min;
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
        state.scene.add(mesh);
        state.mesh = mesh;
        state.geometry = geom;
        if (p.wireframe) {
          const wg = new THREE.WireframeGeometry(geom);
          const wm = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.12, transparent: true });
          const wf = new THREE.LineSegments(wg, wm);
          state.scene.add(wf);
          state.wireframe = wf;
        }
      }

      function rebuildGrid() {
        if (state.grid) {
          state.scene.remove(state.grid);
          state.grid.geometry.dispose();
          state.grid.material.dispose();
          state.grid = null;
        }
        if (showGrid) {
          const grid = new THREE.GridHelper(220, 22, 0x3a4a5e, 0x222a36);
          grid.position.y = -30.2;
          state.scene.add(grid);
          state.grid = grid;
        }
      }

      state.rebuildMesh = rebuildMesh;
      state.rebuildGrid = rebuildGrid;
      rebuildMesh();
      rebuildGrid();

      function tick() {
        controls.update();
        renderer.render(scene, cam);
        state.raf = requestAnimationFrame(tick);
      }
      state.raf = requestAnimationFrame(tick);

      const ro = new ResizeObserver(() => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        renderer.setSize(Math.max(64, r.width), Math.max(64, r.height), false);
        cam.aspect = Math.max(64, r.width) / Math.max(64, r.height);
        cam.updateProjectionMatrix();
      });
      ro.observe(el);
      state.resizeObs = ro;

      function onClick(ev: MouseEvent) {
        const p = propsRef.current;
        if (!state.mesh) return;
        const r = renderer.domElement.getBoundingClientRect();
        pickPointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
        pickPointer.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
        pickRaycaster.setFromCamera(pickPointer, cam);
        const hits = pickRaycaster.intersectObject(state.mesh, false);
        if (hits.length === 0) return;
        const pt = hits[0].point;
        const planeSize = 200;
        const u = (pt.x + planeSize / 2) / planeSize;
        const v = (pt.z + planeSize / 2) / planeSize;
        const col = Math.max(0, Math.min(p.width - 1, Math.floor(u * p.width)));
        const row = Math.max(0, Math.min(p.height - 1, Math.floor(v * p.height)));
        p.onPick?.({ x: pt.x, y: pt.y, z: pt.z, row, col });
      }
      renderer.domElement.addEventListener('click', onClick);
      state.onClick = onClick;

      onReady?.();
    })();

    return () => {
      cancelled = true;
      const state = stateRef.current;
      if (!state) return;
      if (state.raf != null) cancelAnimationFrame(state.raf);
      state.resizeObs?.disconnect();
      state.renderer.domElement.removeEventListener('click', state.onClick);
      state.controls?.dispose();
      if (state.mesh) {
        state.scene.remove(state.mesh);
        state.geometry?.dispose();
        state.mesh.material.dispose();
      }
      if (state.wireframe) {
        state.wireframe.geometry.dispose();
        state.wireframe.material.dispose();
      }
      if (state.grid) {
        state.grid.geometry.dispose();
        state.grid.material.dispose();
      }
      state.renderer.dispose();
      state.renderer.domElement.remove();
      stateRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (state?.rebuildMesh) state.rebuildMesh();
  }, [heightData, width, height, exaggeration, colorScale, minHeight, maxHeight, wireframe]);

  useEffect(() => {
    const state = stateRef.current;
    if (state?.rebuildGrid) state.rebuildGrid();
  }, [showGrid]);

  useEffect(() => {
    const state = stateRef.current;
    if (state?.controls) state.controls.autoRotate = !!autoRotate;
  }, [autoRotate]);

  const style: CSSProperties = {
    width: typeof rendererWidth === 'number' ? `${rendererWidth}px` : rendererWidth,
    height: typeof rendererHeight === 'number' ? `${rendererHeight}px` : rendererHeight,
    background,
  };

  return (
    <div
      ref={containerRef}
      className={['cf-terrain3d', className].filter(Boolean).join(' ')}
      style={style}
    >
      {error && <div className="cf-terrain3d__error">{error}</div>}
    </div>
  );
}
