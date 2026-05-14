let counter = 0;

/**
 * Generate a stable, unique ID. Useful for `htmlFor` / `aria-labelledby`
 * pairs when you can't get one from a parent prop.
 *
 * @example
 * const inputId = useId('cf-input');
 * // → "cf-input-1", "cf-input-2", ...
 */
export function useId(prefix = 'cf'): string {
  counter++;
  return `${prefix}-${counter}`;
}
