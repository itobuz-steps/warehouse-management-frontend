import { resolve } from 'path';
import { readdirSync } from 'fs';

// Get all HTML files in the pages directory
const pagesDir = resolve(__dirname, 'src/pages');
const pageFiles = readdirSync(pagesDir).filter((file) =>
  file.endsWith('.html')
);
const pages = Object.fromEntries(
  pageFiles.map((file) => [
    `pages/${file.replace('.html', '')}`, // Key: pages/dashboard, pages/analytics, etc.
    resolve(pagesDir, file), // Value: full path to the HTML file
  ])
);

export default {
  root: resolve(__dirname, 'src'),
  base: './',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        ...pages,
      },
    },
  },
  server: {
    port: 8080,
  },
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'import',
          'mixed-decls',
          'color-functions',
          'global-builtin',
        ],
      },
    },
  },
};
