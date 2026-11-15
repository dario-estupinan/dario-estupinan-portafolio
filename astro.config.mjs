import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dario-estupinan.pages.dev',
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } } })],
  i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } },
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },   // tampoco scripts en línea   // hojas de estilo en archivos: la política de seguridad no admite estilos en línea
});
