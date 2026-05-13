// One-off script: replace problematic brand-* symbols in icons.svg with
// cleaner 16x16 geometry. After running this, run generate-icons.mjs to
// refresh symbols.ts.
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = resolve(packageDir, 'src', 'icons.svg');
const rootSvgPath = resolve(packageDir, '..', '..', 'icons.svg');

// Each entry is the FULL replacement <symbol> tag (single line, no trailing newline).
// Only brand icons that needed fixing are listed; the rest stay untouched.
const replacements = {
  'brand-dribbble':
    '<symbol id="brand-dribbble" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#EA4C89"></circle><path d="M2.6 4.6c2.4.7 7 1 11.1-1.1M1.4 9.2c3.5-1.2 7.1-1 10.6 1M5.4 14.4c.8-3.3 2.5-6.1 5.6-8.6" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"></path></symbol>',
  'brand-windows':
    '<symbol id="brand-windows" viewBox="0 0 16 16"><rect x="1" y="1" width="6.4" height="6.4" fill="#0078D4"></rect><rect x="8.6" y="1" width="6.4" height="6.4" fill="#0078D4"></rect><rect x="1" y="8.6" width="6.4" height="6.4" fill="#0078D4"></rect><rect x="8.6" y="8.6" width="6.4" height="6.4" fill="#0078D4"></rect></symbol>',
  'brand-figma':
    '<symbol id="brand-figma" viewBox="0 0 16 16"><path d="M5 2h2.5v4H5a2 2 0 010-4z" fill="#F24E1E"></path><path d="M7.5 2H10a2 2 0 010 4H7.5V2z" fill="#FF7262"></path><path d="M5 6h2.5v4H5a2 2 0 010-4z" fill="#A259FF"></path><circle cx="9" cy="8" r="2" fill="#1ABCFE"></circle><path d="M5 10h2.5v2a2 2 0 11-2.5-2z" fill="#0ACF83"></path></symbol>',
  'brand-js':
    '<symbol id="brand-js" viewBox="0 0 16 16"><rect width="16" height="16" fill="#F7DF1E"></rect><path d="M6.6 12.7V7h1.2v5.7c0 1-.5 1.6-1.6 1.6-.9 0-1.5-.4-1.8-1.2l1-.6c.2.4.4.6.7.6.4 0 .5-.2.5-.7zm5.7 1.6c-1 0-1.7-.4-2.1-1.2l1-.6c.3.5.6.7 1 .7.4 0 .6-.2.6-.5 0-.3-.3-.5-.8-.7l-.2-.1c-.8-.4-1.4-.8-1.4-1.7 0-.9.7-1.5 1.7-1.5.7 0 1.3.3 1.6.9l-.9.6c-.2-.3-.4-.5-.7-.5-.3 0-.5.2-.5.5 0 .3.2.4.7.6l.3.1c1 .4 1.4.8 1.4 1.7 0 1-.8 1.6-1.8 1.6z" fill="#000"></path></symbol>',
  'brand-python':
    '<symbol id="brand-python" viewBox="0 0 16 16"><path d="M8 1c-1.4 0-2.5.3-2.5 1.5V4h2.6v.4H4A1.5 1.5 0 002.5 6v1.6c0 .9.7 1.5 1.5 1.5h1v-1.6c0-.9.7-1.5 1.5-1.5h3a1.3 1.3 0 001.3-1.3V2.5C10.8 1.4 9.8 1 8 1zM6.2 1.8a.6.6 0 110 1.2.6.6 0 010-1.2z" fill="#3776AB"></path><path d="M8 15c1.4 0 2.5-.3 2.5-1.5V12H7.9v-.4H12A1.5 1.5 0 0013.5 10V8.4c0-.9-.7-1.5-1.5-1.5h-1v1.6c0 .9-.7 1.5-1.5 1.5h-3a1.3 1.3 0 00-1.3 1.3v2.2C5.2 14.6 6.2 15 8 15zm1.8-.8a.6.6 0 110-1.2.6.6 0 010 1.2z" fill="#FFD43B"></path></symbol>',
  'brand-rust':
    '<symbol id="brand-rust" viewBox="0 0 16 16"><path d="M8 .8l.9.9 1.2-.5.5 1.1 1.2-.1.1 1.2 1.1.5-.5 1.2.9.9-.9.9.5 1.2-1.1.5-.1 1.2-1.2-.1-.5 1.1-1.2-.5-.9.9-.9-.9-1.2.5-.5-1.1-1.2.1-.1-1.2-1.1-.5.5-1.2-.9-.9.9-.9-.5-1.2 1.1-.5.1-1.2 1.2.1.5-1.1L6.2.7l.9.9.9-.8z" fill="currentColor"></path><circle cx="8" cy="8" r="3.5" fill="#fff"></circle><path d="M6.4 5.8h2.4a1.4 1.4 0 011 2.4l1 1.9H9.4l-.9-1.8H7.4V10h-1V5.8zm1 1v1.2h1.3a.6.6 0 000-1.2H7.4z" fill="currentColor"></path></symbol>',
  'brand-docker':
    '<symbol id="brand-docker" viewBox="0 0 16 16"><rect x="1.6" y="6" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="3.8" y="6" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="6" y="6" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="8.2" y="6" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="3.8" y="3.8" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="6" y="3.8" width="1.8" height="1.8" fill="#2496ED"></rect><rect x="6" y="1.6" width="1.8" height="1.8" fill="#2496ED"></rect><path d="M.5 8.4h11.2c.5 0 .7.4.9.7.6-.5 1.6-.5 2.2-.2.1-.4.5-.5.9-.4-.4 1.5-1.8 2.5-3.5 2.7-1.8.2-3.8 0-5.8-.5-1.5-.4-3-1-4.1-2-1-.9-1.5-2-1.8-2.3z" fill="#2496ED"></path></symbol>',
  'brand-k8s':
    '<symbol id="brand-k8s" viewBox="0 0 16 16"><path d="M8 .8l6.2 3 1.5 6.7-4.3 5.3H4.6L.3 10.5l1.5-6.7L8 .8z" fill="#326CE5"></path><circle cx="8" cy="8" r="1.4" fill="#fff"></circle><path d="M8 4v3M11.5 5.7L9.3 7.3M12.3 9.5l-2.8-.8M9.1 12.5L8.5 9.7M6.9 12.5l.6-2.8M3.7 9.5l2.8-.8M4.5 5.7l2.2 1.6" stroke="#fff" stroke-width=".5" stroke-linecap="round"></path></symbol>',
  'brand-aws':
    '<symbol id="brand-aws" viewBox="0 0 16 16"><rect x=".5" y="3.5" width="15" height="6" rx=".8" fill="#252F3E"></rect><path d="M3 5.5h.9l.4 2.3.7-2.3h.7l.7 2.3.4-2.3h.9l-.8 3.3h-.9l-.6-2.1-.6 2.1H4l-1-3.3zm5.8 0c.4 0 .8.1 1.1.3l-.2.7c-.3-.1-.5-.2-.7-.2-.3 0-.4.1-.4.3 0 .4 1.5.2 1.5 1.3 0 .7-.6 1-1.2 1-.5 0-.9-.1-1.3-.3l.3-.7c.3.2.6.3.9.3.3 0 .4-.1.4-.3 0-.5-1.5-.2-1.5-1.3 0-.6.5-1.1 1.1-1.1zm3 0c.4 0 .8.1 1.1.3l-.2.7c-.3-.1-.5-.2-.7-.2-.3 0-.4.1-.4.3 0 .4 1.5.2 1.5 1.3 0 .7-.6 1-1.2 1-.5 0-.9-.1-1.3-.3l.3-.7c.3.2.6.3.9.3.3 0 .4-.1.4-.3 0-.5-1.5-.2-1.5-1.3 0-.6.5-1.1 1.1-1.1z" fill="#fff"></path><path d="M1.5 11.8c1.8 1.4 4.3 2.2 6.5 2.2s4.7-.8 6.5-2.2" fill="none" stroke="#FF9900" stroke-width="1.3" stroke-linecap="round"></path><path d="M13.5 11.5l1.7-.3-.6 1.6z" fill="#FF9900"></path></symbol>',
  'brand-azure':
    '<symbol id="brand-azure" viewBox="0 0 16 16"><path d="M6.5 2.2L2 12.5l3.2-.5L11 2.2H6.5z" fill="#0078D4"></path><path d="M7.5 4.5L5 12.5l2-.5L8.5 14.5h-7L7.5 4.5z" fill="#0078D4" opacity=".7"></path><path d="M11 2.2l4.5 12.3H7L6.6 12h6L8.6 4.8 11 2.2z" fill="#0078D4"></path></symbol>',
  'brand-android':
    '<symbol id="brand-android" viewBox="0 0 16 16"><path d="M2 9h12v4a1 1 0 01-1 1H3a1 1 0 01-1-1V9z" fill="#3DDC84"></path><rect x="3.5" y="13.5" width="1" height="2" rx=".3" fill="#3DDC84"></rect><rect x="11.5" y="13.5" width="1" height="2" rx=".3" fill="#3DDC84"></rect><rect x=".4" y="9" width="1.2" height="4.5" rx=".6" fill="#3DDC84"></rect><rect x="14.4" y="9" width="1.2" height="4.5" rx=".6" fill="#3DDC84"></rect><path d="M2 8a6 6 0 0112 0H2z" fill="#3DDC84"></path><path d="M3.6 3.6L2.4 2.4M12.4 3.6L13.6 2.4" stroke="#3DDC84" stroke-linecap="round"></path><circle cx="5.6" cy="5.6" r=".6" fill="#fff"></circle><circle cx="10.4" cy="5.6" r=".6" fill="#fff"></circle></symbol>',
  'brand-instagram':
    '<symbol id="brand-instagram" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.4"></rect><circle cx="8" cy="8" r="3.3" fill="none" stroke="currentColor" stroke-width="1.4"></circle><circle cx="11.8" cy="4.2" r=".9" fill="currentColor"></circle></symbol>',
  'brand-solana':
    '<symbol id="brand-solana" viewBox="0 0 16 16"><path d="M4 3h10l-2 2H2l2-2z" fill="#9945FF"></path><path d="M2 7h10l2 2H4L2 7z" fill="#14F195"></path><path d="M4 11h10l-2 2H2l2-2z" fill="#00C2FF"></path></symbol>',
  'brand-polygon':
    '<symbol id="brand-polygon" viewBox="0 0 16 16"><path d="M11 2.5L13.8 4v3L11 8.5 9 7.3v-.8L8 6l-1 .5v.8L4.9 8.5 2.2 7V4l2.7-1.5L7 3.8l1-.5 1 .5L11 2.5z" fill="#8247E5"></path><path d="M11 7.5L13.8 9v3L11 13.5 8.2 12V9L11 7.5z" fill="#8247E5" opacity=".55"></path><path d="M5 7.5L7.8 9v3L5 13.5 2.2 12V9L5 7.5z" fill="#8247E5" opacity=".55"></path></symbol>',
  'brand-arbitrum':
    '<symbol id="brand-arbitrum" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#213147"></circle><path d="M8 3l4.2 8.7h-1.7l-.7-1.7H6.2l-.7 1.7H3.8L8 3z" fill="#28A0F0"></path><path d="M8 5.5l-1.3 3h2.6L8 5.5z" fill="#fff"></path></symbol>',
  'brand-optimism':
    '<symbol id="brand-optimism" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#FF0420"></circle><path d="M4 8.6c0-1 .3-1.7.8-2.2.5-.5 1.2-.7 2-.7s1.5.2 2 .6c.4.4.6 1 .6 1.7 0 1-.3 1.7-.8 2.2-.5.5-1.2.7-2 .7s-1.5-.2-2-.6c-.4-.4-.6-1-.6-1.7zm1.6 0c0 .8.3 1.1.9 1.1.3 0 .6-.1.8-.4.2-.3.3-.7.3-1.3 0-.7-.3-1.1-.9-1.1-.3 0-.6.2-.8.4-.2.3-.3.8-.3 1.3zM10 5.8h2.1c.7 0 1.2.1 1.4.4.3.3.4.6.4 1 0 .6-.2 1-.5 1.3-.4.3-.9.4-1.5.4h-.7l-.3 1.6h-1.6L10 5.8zm1.4 1.1l-.2 1h.5c.3 0 .5 0 .6-.1.1-.1.2-.2.2-.4 0-.3-.2-.5-.7-.5h-.4z" fill="#fff"></path></symbol>',
  'brand-tailwind':
    '<symbol id="brand-tailwind" viewBox="0 0 16 16"><path d="M5 3.4c-1.5 0-2.4 1-2.8 2.3 1-1.2 2-1.5 3.3-1.2.7.2 1.3.7 1.9 1.3.9 1 2 2.2 4.2 2.2 1.5 0 2.4-1 2.8-2.3-1 1.2-2 1.5-3.3 1.2-.7-.2-1.3-.7-1.9-1.3-.9-1-2-2.2-4.2-2.2zM2.2 8.5c-1.5 0-2.4 1-2.8 2.3 1-1.2 2-1.5 3.3-1.2.7.2 1.3.7 1.9 1.3.9 1 2 2.2 4.2 2.2 1.5 0 2.4-1 2.8-2.3-1 1.2-2 1.5-3.3 1.2-.7-.2-1.3-.7-1.9-1.3-.9-1-2-2.2-4.2-2.2z" fill="#38BDF8"></path></symbol>',
  'brand-mongodb':
    '<symbol id="brand-mongodb" viewBox="0 0 16 16"><path d="M8 1c.5 1.5 1.5 2.8 2.5 4 1.5 1.8 2 4 1 6.3-.8 1.8-2 2.7-3 3.2L8 16l-.5-1.5C7.4 13 7.4 11 8 8.5 8.4 6.5 8.2 4 8 2c0-.3 0-.7 0-1z" fill="#13AA52"></path><path d="M8 2C7.3 4.5 7 7 7.3 9c.3 1.7.6 3 .7 5.5l-1-.7C5.5 13 4.5 11 4.5 9c0-2 1.3-4 2.5-5C7.4 3.7 7.8 2.8 8 2z" fill="#47A248"></path><path d="M7.5 15.5l.3.5.2-.5v-1h-.5v1z" fill="#13AA52"></path></symbol>',
  'brand-postgresql':
    '<symbol id="brand-postgresql" viewBox="0 0 16 16"><path d="M12 3.5c-.8-.5-2-.8-3-.8-.5 0-1 .1-1.5.2-.7-.3-1.4-.4-2.2-.3C3.7 2.8 2.7 4 2.5 5.5c-.2 1.5.1 3.5.8 5.2.5 1.3 1.3 2.4 2.3 3 .7.4 1.5.5 2.1.3.6.2 1.4.2 2.2-.1 1.2-.5 2-1.6 2.6-3 .9-2.2 1.3-5.3.4-6.6-.2-.3-.5-.6-.9-.8z" fill="#336791"></path><path d="M6 6.8c-.3 0-.6-.1-.8-.4M10 6.8c.3 0 .6-.1.8-.4" stroke="#fff" stroke-width=".6" stroke-linecap="round" fill="none"></path><circle cx="6" cy="7.5" r=".4" fill="#fff"></circle><circle cx="9.5" cy="7.5" r=".4" fill="#fff"></circle><path d="M7 9.5c.5.4 1.3.4 1.8 0M5.5 11.5c.8.5 2 .6 3 .2" stroke="#fff" stroke-width=".6" stroke-linecap="round" fill="none"></path></symbol>',
  'brand-redis':
    '<symbol id="brand-redis" viewBox="0 0 16 16"><path d="M8 9.8L1 6.5 8 3.5l7 3-7 3.3z" fill="#A41E11"></path><path d="M1 9.5l7 3.3 7-3.3v-2L8 10.8 1 7.5v2z" fill="#D82C20"></path><path d="M1 6.5l7-3 7 3-7 3.3-7-3.3z" fill="#D82C20"></path><path d="M8 3.5L4 5l4 1.7L12 5 8 3.5z" fill="#fff" opacity=".4"></path></symbol>',
  'brand-firebase':
    '<symbol id="brand-firebase" viewBox="0 0 16 16"><path d="M2.6 12.3L4.6 2 7 6l1-2 5 8.3L8 15 2.6 12.3z" fill="#FFA000"></path><path d="M2.6 12.3L4.6 2 7 6 2.6 12.3z" fill="#FFCA28"></path><path d="M2.6 12.3L8 15l5-2.7L8 5l-5.4 7.3z" fill="#F57C00"></path><path d="M2.6 12.3L8 15v-10L2.6 12.3z" fill="#FFA000" opacity=".5"></path></symbol>',
  'brand-notion':
    '<symbol id="brand-notion" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="1.2" fill="#fff" stroke="currentColor"></rect><path d="M4.5 4h1.8L9.2 9V4h1.3v8H8.7L5.8 7v5H4.5V4z" fill="currentColor"></path></symbol>',
  'brand-linear':
    '<symbol id="brand-linear" viewBox="0 0 16 16"><path d="M2.4 9.1L6.9 13.6a6 6 0 01-4.5-4.5zM2.1 6.8L9.2 13.9a6 6 0 01-1.6.5L1.6 8.4c.1-.6.3-1.1.5-1.6zM3 5L11 13a6 6 0 01-1.3.8L2.2 6.3A6 6 0 013 5zm1.5-1.7l8.2 8.2A6 6 0 014.5 3.3z" fill="currentColor"></path></symbol>',
  'brand-trello':
    '<symbol id="brand-trello" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="1.8" fill="#0079BF"></rect><rect x="3" y="3" width="4.5" height="8" rx=".7" fill="#fff"></rect><rect x="8.5" y="3" width="4.5" height="5" rx=".7" fill="#fff"></rect></symbol>',
  'brand-zoom':
    '<symbol id="brand-zoom" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#2D8CFF"></circle><path d="M3.5 6.5c0-.6.4-1 1-1H9c.6 0 1 .4 1 1V10c0 .6-.4 1-1 1H4.5c-.6 0-1-.4-1-1V6.5z" fill="#fff"></path><path d="M10.5 7.3l2-1.3v4l-2-1.3V7.3z" fill="#fff"></path></symbol>',
  'brand-teams':
    '<symbol id="brand-teams" viewBox="0 0 16 16"><circle cx="12.2" cy="5" r="1.8" fill="#7B83EB"></circle><path d="M10.5 7.5h3.5c.6 0 1 .4 1 1v2.8a2.5 2.5 0 01-2.5 2.5h-.5l-1.5-6.3z" fill="#7B83EB"></path><rect x="1" y="3.5" width="9.5" height="9" rx=".8" fill="#5059C9"></rect><path d="M3 5.5h5.5v1H6.5V11H5.3V6.5H3V5.5z" fill="#fff"></path></symbol>',
  'brand-visa':
    '<symbol id="brand-visa" viewBox="0 0 16 16"><rect x=".5" y="3.5" width="15" height="9" rx="1" fill="#1A1F71"></rect><path d="M3.2 6.3h1.1l-.7 3.4h-1l.6-3.4zm1.8 0h1l.4 2.2.8-2.2h1l-1.5 3.4H5.7L5 6.3zm3.6 0h1l-.7 3.4H8l.7-3.4zm2.6 0h.8c.3 0 .5.1.6.4l.7 3h-1.1l-.1-.5h-1l-.3.5h-1.1l1.5-3.4zm.6 1l-.6 1.2h.8l-.2-1.2z" fill="#fff"></path><path d="M12.5 6.5l-.4 2 .4 1.2h-1l-.2-1.6.4-1.6h.8z" fill="#F7B600"></path></symbol>',
  'brand-paypal':
    '<symbol id="brand-paypal" viewBox="0 0 16 16"><path d="M4 1.5h5.2c2 0 3.3 1.2 2.9 3.2-.4 2-2 3-4.2 3H6L5 14H2.6L4 1.5z" fill="#003087"></path><path d="M5.6 4.5h5.2c2 0 3.3 1.2 2.9 3.2-.4 2-2 3-4.2 3H7.6L6.6 14H4.2l1.4-9.5z" fill="#009CDE"></path><path d="M4 1.5h5.2c2 0 3.3 1.2 2.9 3.2-.4 2-2 3-4.2 3H6L5.5 11H4.2L4 1.5z" fill="#003087" opacity=".7"></path></symbol>',
  'brand-alipay':
    '<symbol id="brand-alipay" viewBox="0 0 16 16"><rect x=".5" y=".5" width="15" height="15" rx="2.5" fill="#1677FF"></rect><path d="M8 4.5v1.6h2.5v.7H8v1.4h2c-.2.5-.5 1-.8 1.5C7.7 9 6.6 8 5.5 7h3.2v-.7H5.8v-.2h2.9V4.5H8zM3 11c2.8-.6 5.4-.2 7.7.9-.4.7-1 1.1-1.7 1.1H4.5c-.8 0-1.5-.5-1.5-1.5V11z" fill="#fff"></path><path d="M5 9.5c-.7 0-1.2.4-1.2 1s.5 1 1.3 1c.5 0 1-.2 1.5-.6-.4-.4-1-.7-1.6-1.4z" fill="#1677FF"></path></symbol>',
  'brand-wechat-pay':
    '<symbol id="brand-wechat-pay" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#09BB07"></circle><path d="M6 3.5C3.8 3.5 2 5 2 6.8c0 1 .6 2 1.6 2.6l-.4 1.4 1.7-.9c.4.1.8.2 1.1.2h.3a3.4 3.4 0 014-3.2C9.8 5.1 8.1 3.5 6 3.5zm-1.7 3a.6.6 0 110-1.2.6.6 0 010 1.2zm3 0a.6.6 0 110-1.2.6.6 0 010 1.2z" fill="#fff"></path><path d="M14.5 10c0-1.8-1.6-3.2-3.5-3.2S7.5 8.2 7.5 10s1.5 3.2 3.5 3.2c.4 0 .8-.1 1.2-.2l1.5.8-.3-1.3c.6-.4 1.1-1 1.1-1.5zm-4.6-.5a.5.5 0 110-1 .5.5 0 010 1zm2.6 0a.5.5 0 110-1 .5.5 0 010 1z" fill="#fff"></path></symbol>',
  'brand-stripe':
    '<symbol id="brand-stripe" viewBox="0 0 16 16"><rect x=".5" y="1.5" width="15" height="13" rx="2" fill="#6772E5"></rect><path d="M7.6 6.6c0-.4.3-.5.7-.5.6 0 1.4.2 2 .5l.3-1.7c-.7-.3-1.4-.4-2.3-.4-1.8 0-3.1.9-3.1 2.5 0 2.4 3.3 2.1 3.3 3.1 0 .4-.4.5-.8.5-.7 0-1.7-.3-2.4-.7l-.3 1.8c.7.3 1.6.5 2.5.5 1.9 0 3.3-.9 3.3-2.6 0-2.6-3.2-2.2-3.2-3z" fill="#fff"></path></symbol>',
  'brand-ethereum':
    '<symbol id="brand-ethereum" viewBox="0 0 16 16"><path d="M8 .5L3.2 8.3 8 11.1V.5z" fill="currentColor" opacity=".6"></path><path d="M8 .5l4.8 7.8L8 11.1V.5z" fill="currentColor"></path><path d="M8 11.9l-4.8-2.8L8 15.5v-3.6z" fill="currentColor" opacity=".6"></path><path d="M8 15.5l4.8-6.4L8 11.9v3.6z" fill="currentColor"></path><path d="M3.2 8.3L8 11.1l4.8-2.8L8 6.1 3.2 8.3z" fill="currentColor" opacity=".3"></path></symbol>',
};

const svg = await readFile(svgPath, 'utf8');
let updated = svg;
let replacedCount = 0;
const missing = [];

for (const [id, newTag] of Object.entries(replacements)) {
  // Match the existing <symbol id="..."> ... </symbol> tag (single line).
  const re = new RegExp(
    `<symbol\\s+id="${id}"[^>]*>[\\s\\S]*?</symbol>`,
    'g',
  );
  if (!re.test(updated)) {
    missing.push(id);
    continue;
  }
  updated = updated.replace(
    new RegExp(`<symbol\\s+id="${id}"[^>]*>[\\s\\S]*?</symbol>`, 'g'),
    () => newTag,
  );
  replacedCount += 1;
}

await writeFile(svgPath, updated);
await copyFile(svgPath, rootSvgPath);

console.log(`Replaced ${replacedCount} brand symbols.`);
if (missing.length) {
  console.warn(`Missing ids (not found in svg): ${missing.join(', ')}`);
}
