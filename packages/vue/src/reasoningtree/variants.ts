export interface ReasoningNode {
  id: string;
  thought: string;
  score?: number;
  selected?: boolean;
  children?: ReasoningNode[];
}

export function scoreColor(score: number | undefined): string {
  if (score === undefined) return 'var(--fg-3)';
  if (score >= 0.75) return 'var(--status-success)';
  if (score >= 0.5) return 'var(--status-info)';
  if (score >= 0.25) return 'var(--status-warning)';
  return 'var(--status-error)';
}
