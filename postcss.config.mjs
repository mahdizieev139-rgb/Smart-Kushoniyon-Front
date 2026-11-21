/**
 * PostCSS configuration.
 *
 * Tailwind CSS v4 is applied through its official PostCSS plugin. Using PostCSS
 * (instead of a custom Turbopack CSS loader) avoids conflicts with next/font's
 * generated CSS modules.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
