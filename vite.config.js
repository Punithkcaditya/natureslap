import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/',
  build: { copyPublicDir: false },
  // Only ship curated media, never the original ZIP archives or screenshots.
  publicDir: 'public',
  plugins: [{
    name: 'copy-website-media',
    closeBundle() {
      for (const folder of ['assets', 'media']) {
        const target = resolve('dist', folder);
        mkdirSync(target, { recursive: true });
        cpSync(resolve('public', folder), target, {
          recursive: true,
          filter: path => !extname(path) || (!path.endsWith('-reference.css') && !path.endsWith('dummy.png')),
        });
      }
    },
  }],
});
