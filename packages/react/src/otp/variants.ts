export type OtpInputSize = 'sm' | 'md' | 'lg';
export type OtpInputType = 'numeric' | 'alphanumeric';

export interface OtpInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  size?: OtpInputSize;
  type?: OtpInputType;
  disabled?: boolean;
  autoFocus?: boolean;
  separatorAt?: number;
}

export function isValidChar(ch: string, type: OtpInputType): boolean {
  if (!ch) return false;
  if (type === 'numeric') return /^[0-9]$/.test(ch);
  return /^[0-9a-zA-Z]$/.test(ch);
}

export function sanitize(input: string, type: OtpInputType): string {
  if (type === 'numeric') return input.replace(/[^0-9]/g, '');
  return input.replace(/[^0-9a-zA-Z]/g, '');
}
