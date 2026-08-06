// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cursodeglobosonline.com',
  trailingSlash: 'always',
  // El panel de preview asigna el puerto vía PORT (autoPort); 4321 suele estar
  // ocupado por otros proyectos del workspace.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
