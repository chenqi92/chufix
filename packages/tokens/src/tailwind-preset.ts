/* Optional Tailwind preset that exposes ChuKit tokens as Tailwind utilities.
 * Usage:
 *   // tailwind.config.ts
 *   import preset from '@chukit/tokens/tailwind';
 *   export default { presets: [preset], content: [...] };
 */
const channel = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

export default {
  theme: {
    extend: {
      colors: {
        chukit: {
          bg: channel('--ck-bg'),
          fg: channel('--ck-fg'),
          muted: {
            DEFAULT: channel('--ck-muted'),
            fg: channel('--ck-muted-fg'),
          },
          border: channel('--ck-border'),
          ring: channel('--ck-ring'),
          primary: {
            DEFAULT: channel('--ck-primary'),
            hover: channel('--ck-primary-hover'),
            active: channel('--ck-primary-active'),
            fg: channel('--ck-primary-fg'),
            soft: channel('--ck-primary-soft'),
          },
          danger: {
            DEFAULT: channel('--ck-danger'),
            hover: channel('--ck-danger-hover'),
            fg: channel('--ck-danger-fg'),
            soft: channel('--ck-danger-soft'),
          },
        },
      },
      borderRadius: {
        chukit: 'var(--ck-radius)',
        'chukit-sm': 'var(--ck-radius-sm)',
        'chukit-lg': 'var(--ck-radius-lg)',
      },
      fontFamily: {
        chukit: 'var(--ck-font-sans)',
      },
    },
  },
};
