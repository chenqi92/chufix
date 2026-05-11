import type { IconName } from './names';
import { iconNames } from './names';
import { iconSymbols } from './symbols';

export { iconNames } from './names';
export type { IconName } from './names';
export { iconSymbols } from './symbols';

export const CHUFIX_ICON_SPRITE_PATH = '@chufix-design/icons/icons.svg';
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

export function getIconSymbol(name: IconName): string {
  return iconSymbols[name];
}
