export type PhoneInputSize = 'sm' | 'md' | 'lg';

export interface CountryCode {
  code: string;
  dial: string;
  label: string;
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  onCountryChange?: (code: string) => void;
  countries?: CountryCode[];
  size?: PhoneInputSize;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export const defaultCountries: CountryCode[] = [
  { code: 'CN', dial: '86', label: 'China' },
  { code: 'US', dial: '1', label: 'United States' },
  { code: 'GB', dial: '44', label: 'United Kingdom' },
  { code: 'JP', dial: '81', label: 'Japan' },
  { code: 'KR', dial: '82', label: 'South Korea' },
  { code: 'DE', dial: '49', label: 'Germany' },
  { code: 'FR', dial: '33', label: 'France' },
  { code: 'AU', dial: '61', label: 'Australia' },
  { code: 'IN', dial: '91', label: 'India' },
  { code: 'BR', dial: '55', label: 'Brazil' },
  { code: 'SG', dial: '65', label: 'Singapore' },
  { code: 'AE', dial: '971', label: 'United Arab Emirates' },
];
