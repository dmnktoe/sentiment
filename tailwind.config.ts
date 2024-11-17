import defaultTheme from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roobert', ...defaultTheme.fontFamily.sans],
        secondary: ['Tobias'],
      },
      colors: {
        primary: '#D2D05B',
        secondary: '#71cecb',
        tertiary: '#4d5562',
        text: '#1b1f28',
      },
    },
  },
  plugins: [],
};

export default config;
