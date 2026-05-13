export type WordCloudSize = 'sm' | 'md' | 'lg';

export interface WordCloudItem {
  text: string;
  weight: number;
  color?: string;
  /** Rotation in degrees. Auto-randomized when omitted. */
  rotate?: number;
}

export interface WordCloudProps {
  items: WordCloudItem[];
  /** Pixel width. Default 480. */
  width?: number;
  /** Pixel height. Default 280. */
  height?: number;
  /** Min font size in px. Default 12. */
  minFont?: number;
  /** Max font size in px. Default 48. */
  maxFont?: number;
  /** Probability of vertical (90°) words. Default 0.3. */
  rotateRatio?: number;
  /** Spiral placement step (px). Smaller = tighter / slower. Default 4. */
  spiralStep?: number;
  /** Default palette when items don't specify color. */
  palette?: string[];
  /** Random seed for reproducible layout. */
  seed?: number;
  ariaLabel?: string;
  size?: WordCloudSize;
}

export interface WordCloudHoverPayload {
  index: number;
  item: WordCloudItem;
}
