import defaultTheme from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['CircularStd', ...defaultTheme.fontFamily.sans],
        secondary: [...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: '#FF5C24',
        secondary: '#1F35A5',
        tertiary: 'var(--color-tertiary)',
        text: 'var(--color-text)',
        grid: 'var(--color-grid)',
        bg: 'var(--color-bg)',
      },
    },
  },
  plugins: [],
};

export default config;
