// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://netpayuk.com',
  integrations: [
    mdx(),
    sitemap({
      // /insights renders <meta name="robots" content="noindex, follow"> in
      // production. Excluding from the sitemap keeps the two signals aligned.
      filter: (page) => !page.includes('/insights/'),
    }),
  ],
  output: 'static',
});
