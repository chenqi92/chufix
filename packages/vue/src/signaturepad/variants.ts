export interface SignaturePoint {
  x: number;
  y: number;
}

export interface SignaturePadHandle {
  clear: () => void;
  toDataURL: (type?: string, quality?: number) => string;
  toBlob: (type?: string, quality?: number) => Promise<Blob | null>;
  isEmpty: () => boolean;
}
