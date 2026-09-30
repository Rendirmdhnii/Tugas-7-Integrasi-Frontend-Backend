import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-100': '#111827',
        'dark-70': '#374151',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
};

export default config;
