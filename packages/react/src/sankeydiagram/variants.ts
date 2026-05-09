export interface SankeyNode {
  id: string;
  name: string;
  layer?: number;
  colorIndex?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  ariaLabel?: string;
  className?: string;
}
