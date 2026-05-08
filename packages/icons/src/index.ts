import type { IconName } from './names';

export { iconNames } from './names';
export type { IconName } from './names';

export const CHUFIX_ICON_SPRITE_PATH = '@chufix/icons/icons.svg';
export const CHUFIX_ICON_VIEWBOX = '0 0 16 16';

export function getIconSymbolId(name: IconName): string {
  return `chufix-icon-${name}`;
}

export function getIconHref(name: IconName, spritePath = CHUFIX_ICON_SPRITE_PATH): string {
  return `${spritePath}#${name}`;
}

export function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}
