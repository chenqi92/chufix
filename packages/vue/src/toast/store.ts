export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration: number;
  dismissible: boolean;
}

export interface ToastInput {
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
}

type Listener = (items: ToastItem[]) => void;

const items: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
  const snapshot = [...items];
  listeners.forEach((l) => l(snapshot));
}

function nextId(): string {
  counter += 1;
  return `cf-toast-${Date.now().toString(36)}-${counter}`;
}

function publish(input: ToastInput | string): string {
  const partial: ToastInput =
    typeof input === 'string' ? { title: input } : input;
  const item: ToastItem = {
    id: nextId(),
    type: partial.type ?? 'default',
    title: partial.title,
    description: partial.description,
    duration: partial.duration ?? 4000,
    dismissible: partial.dismissible ?? true,
  };
  items.push(item);
  emit();
  return item.id;
}

export const toastStore = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn([...items]);
    return () => listeners.delete(fn);
  },
  dismiss(id: string) {
    const i = items.findIndex((x) => x.id === id);
    if (i >= 0) {
      items.splice(i, 1);
      emit();
    }
  },
  clear() {
    items.length = 0;
    emit();
  },
};

interface ToastApi {
  (input: ToastInput | string): string;
  success(input: ToastInput | string): string;
  error(input: ToastInput | string): string;
  warning(input: ToastInput | string): string;
  info(input: ToastInput | string): string;
  dismiss(id: string): void;
  clear(): void;
}

const fn = ((input: ToastInput | string) => publish(input)) as ToastApi;
fn.success = (input) =>
  publish({ ...(typeof input === 'string' ? { title: input } : input), type: 'success' });
fn.error = (input) =>
  publish({ ...(typeof input === 'string' ? { title: input } : input), type: 'error' });
fn.warning = (input) =>
  publish({ ...(typeof input === 'string' ? { title: input } : input), type: 'warning' });
fn.info = (input) =>
  publish({ ...(typeof input === 'string' ? { title: input } : input), type: 'info' });
fn.dismiss = toastStore.dismiss;
fn.clear = toastStore.clear;

export const toast = fn;
