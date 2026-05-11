export type PasswordStrengthSize = 'sm' | 'md' | 'lg';

export interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

export interface PasswordStrengthProps {
  value: string;
  onChange: (value: string) => void;
  size?: PasswordStrengthSize;
  placeholder?: string;
  disabled?: boolean;
  showToggle?: boolean;
  requirements?: PasswordRequirement[];
}

export const defaultRequirements: PasswordRequirement[] = [
  { label: '8+ 位字符', test: (v) => v.length >= 8 },
  { label: '1 个大写字母', test: (v) => /[A-Z]/.test(v) },
  { label: '1 个数字', test: (v) => /\d/.test(v) },
  { label: '1 个符号', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export interface StrengthLevel {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: 'default' | 'error' | 'warning' | 'accent' | 'success';
}

export function computeStrength(
  value: string,
  reqs: PasswordRequirement[],
): StrengthLevel {
  const passed = reqs.filter((r) => r.test(value)).length;
  if (!value) return { score: 0, label: '', tone: 'default' };
  if (passed <= 1) return { score: 1, label: '弱', tone: 'error' };
  if (passed === 2) return { score: 2, label: '一般', tone: 'warning' };
  if (passed === 3) return { score: 3, label: '良好', tone: 'accent' };
  return { score: 4, label: '强', tone: 'success' };
}
