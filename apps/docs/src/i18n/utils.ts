import { DEFAULT_LOCALE, LOCALES, type Locale } from './strings';

/**
 * 从 URL pathname 推断当前 locale。
 *   /en/foo            -> en
 *   /en                -> en
 *   /                  -> zh（DEFAULT_LOCALE）
 *   /components/button -> zh
 */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, '').split('/')[0] ?? '';
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : DEFAULT_LOCALE;
}

export function getLocaleFromUrl(url: URL | string): Locale {
  const u = typeof url === 'string' ? url : url.pathname;
  return getLocaleFromPath(u);
}

/**
 * 给定一条 zh 端的路径，转换为指定 locale 的对应路径。
 *   localizeUrl('/components/button', 'en')  ->  '/en/components/button'
 *   localizeUrl('/en/components/button', 'zh') ->  '/components/button'
 *   localizeUrl('/', 'en')                    ->  '/en/'
 */
export function localizeUrl(path: string, target: Locale): string {
  // 先剥掉前导 locale，再贴上目标 locale
  const withoutLocale = stripLocale(path);
  if (target === DEFAULT_LOCALE) return withoutLocale || '/';
  // 保证以 / 结尾仅当原本以 / 结尾
  const trailing = withoutLocale.endsWith('/') ? '/' : '';
  const core = withoutLocale.replace(/^\/+|\/+$/g, '');
  return core ? `/${target}/${core}${trailing}` : `/${target}/`;
}

export function stripLocale(path: string): string {
  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    const re = new RegExp(`^/${loc}(?=/|$)`);
    if (re.test(path)) return path.replace(re, '') || '/';
  }
  return path;
}

/**
 * 给一个相对路径（zh 写法），按当前 locale 自动加 prefix。
 * 用在 layout / nav / sidebar 里生成链接：
 *   prefixHref('/components/button', 'en') -> '/en/components/button'
 */
export function prefixHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href;
  return localizeUrl(href, locale);
}

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };
