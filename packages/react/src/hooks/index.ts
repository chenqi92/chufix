// Async / submit protection
export { useSingleFlight, type SingleFlightApi } from './useSingleFlight';
export {
  useSubmitGuard,
  type SubmitGuardOptions,
  type SubmitGuardApi,
} from './useSubmitGuard';
export { useAsync, type AsyncApi, type UseAsyncOptions } from './useAsync';
export { useRetry, type RetryOptions } from './useRetry';
export { usePolling, type PollingOptions, type PollingApi } from './usePolling';

// Throttle / debounce
export { useDebouncedValue } from './useDebouncedValue';
export { useDebouncedFn, type DebouncedFn } from './useDebouncedFn';
export { useThrottledFn, type ThrottledFn, type ThrottleOptions } from './useThrottledFn';

// Gestures
export { useDrag, type DragOptions, type DragState, type DragAxis } from './useDrag';
export { useSwipe, type SwipeOptions, type SwipeDirection } from './useSwipe';

// Form validation
export {
  useFormValidation,
  type Validator,
  type FieldSchema,
  type FormSchema,
  type ValidateMode,
  type UseFormValidationOptions,
  type FormApi,
} from './useFormValidation';

// DOM / events
export { useEventListener } from './useEventListener';
export { useClickOutside } from './useClickOutside';
export { useFocusTrap } from './useFocusTrap';
export { useScrollLock } from './useScrollLock';
export { useHotkeys, type HotkeysOptions } from './useHotkeys';
export { useMediaQuery } from './useMediaQuery';
export {
  useIntersectionObserver,
  type UseIntersectionObserverOptions,
} from './useIntersectionObserver';
export { useResizeObserver } from './useResizeObserver';

// Storage
export {
  useLocalStorage,
  useSessionStorage,
  type StorageOptions,
} from './useLocalStorage';
export { useClipboard, type ClipboardApi } from './useClipboard';

// Theme / preferences
export { useTheme, type ChuFixTheme, type ThemeApi } from './useTheme';
export { useDensity, type ChuFixDensity, type DensityApi } from './useDensity';
export { useReducedMotion } from './useReducedMotion';

// Misc
export { useId } from './useId';
export { usePrevious } from './usePrevious';
export { useToggle, type ToggleApi } from './useToggle';
export { useTimeout, type TimeoutApi } from './useTimeout';
export { useInterval, type IntervalApi } from './useInterval';
export { useCounter, type CounterApi } from './useCounter';
