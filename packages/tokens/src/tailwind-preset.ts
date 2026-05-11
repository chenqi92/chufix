/* Optional Tailwind preset that exposes ChuFix tokens as Tailwind utilities.
 * Usage:
 *   // tailwind.config.ts
 *   import preset from '@chufix-design/tokens/tailwind';
 *   export default { presets: [preset], content: [...] };
 */
const channel = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

export default {
  theme: {
    extend: {
      colors: {
        chufix: {
          bg: channel('--cf-bg'),
          fg: channel('--cf-fg'),
          muted: {
            DEFAULT: channel('--cf-muted'),
            fg: channel('--cf-muted-fg'),
          },
          border: channel('--cf-border'),
          ring: channel('--cf-ring'),
          primary: {
            DEFAULT: channel('--cf-primary'),
            hover: channel('--cf-primary-hover'),
            active: channel('--cf-primary-active'),
            fg: channel('--cf-primary-fg'),
            soft: channel('--cf-primary-soft'),
          },
          danger: {
            DEFAULT: channel('--cf-danger'),
            hover: channel('--cf-danger-hover'),
            fg: channel('--cf-danger-fg'),
            soft: channel('--cf-danger-soft'),
          },
        },
      },
      borderRadius: {
        chufix: 'var(--cf-radius)',
        'chufix-sm': 'var(--cf-radius-sm)',
        'chufix-lg': 'var(--cf-radius-lg)',
      },
      fontFamily: {
        chufix: 'var(--cf-font-sans)',
      },
    },
  },
};
