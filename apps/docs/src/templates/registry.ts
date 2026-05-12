import type { TemplateMeta } from './types';

import { adminMini } from './admin-mini/meta';

export const templates: TemplateMeta[] = [
  adminMini,
];

export function findTemplate(id: string): TemplateMeta | undefined {
  return templates.find((t) => t.id === id);
}
