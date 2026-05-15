export type TerminalLineType = 'output' | 'command' | 'error' | 'info' | 'success' | 'warning';

export interface TerminalLine {
  text: string;
  type?: TerminalLineType;
}

export function normalizeLine(line: TerminalLine | string): TerminalLine {
  if (typeof line === 'string') return { text: line, type: 'output' };
  return line;
}
