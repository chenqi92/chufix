export interface DrawingPoint {
  x: number;
  y: number;
}

export type DrawingTool = 'brush' | 'eraser';

export interface DrawingStroke {
  tool: DrawingTool;
  color: string;
  width: number;
  points: DrawingPoint[];
}

export interface DrawingCanvasHandle {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  getStrokes: () => DrawingStroke[];
  setStrokes: (strokes: DrawingStroke[]) => void;
  toDataURL: (type?: string, quality?: number) => string;
  toBlob: (type?: string, quality?: number) => Promise<Blob | null>;
}

export const DEFAULT_PALETTE: string[] = [
  '#f7fafc',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#a855f7',
];

export const DEFAULT_SIZES: number[] = [2, 4, 8, 16];

export function strokePath(stroke: DrawingStroke, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
  const pts = stroke.points;
  if (pts.length === 0) {
    ctx.restore();
    return;
  }
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, stroke.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.color;
    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
    }
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const cur = pts[i];
    const next = pts[i + 1];
    const mid = { x: (cur.x + next.x) / 2, y: (cur.y + next.y) / 2 };
    ctx.quadraticCurveTo(cur.x, cur.y, mid.x, mid.y);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.restore();
}
