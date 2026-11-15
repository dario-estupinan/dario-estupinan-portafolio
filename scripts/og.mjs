// Genera public/img/og.png (1200×630), la imagen que se ve al compartir el enlace.
// Uso: con `npm run preview` abierto, node scripts/og.mjs
import { chromium } from '@playwright/test';

const base = process.env.URL_BASE || 'http://localhost:4321';
const nav = await chromium.launch({ channel: 'chrome' });
const p = await nav.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(base + '/robots.txt');   // mismo origen, para que carguen las letras del sitio
await p.setContent(`<style>
  @font-face { font-family: B; src: url(${base}/fuentes/bricolage-grotesque.woff2); font-weight: 200 800; font-stretch: 75% 100%; }
  @font-face { font-family: M; src: url(${base}/fuentes/martian-mono-400.woff2); }
  body { margin: 0; width: 1200px; height: 630px; background: #22308F; color: #ECEBF8; font-family: B; display: grid; grid-template-rows: 1fr auto; }
  main { padding: 64px 72px 0; }
  p { margin: 0; font: 400 20px M; letter-spacing: .04em; text-transform: uppercase; }
  h1 { margin: 34px 0 0; font-size: 104px; line-height: 1; font-weight: 800; font-stretch: 85%; letter-spacing: -.03em; }
  em { font-style: normal; background: #C9F26B; color: #0F1026; padding: 0 .12em; }
  footer { background: #C9F26B; color: #0F1026; padding: 22px 72px; font-size: 44px; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.01em; }
</style><main><p>Guayaquil, Ecuador · dario-estupinan.pages.dev</p><h1>Hago <em>sitios web</em>, <em>tableros de datos</em> y <em>software a medida</em>.</h1></main><footer>Darío Estupiñán · Desarrollador de software</footer>`);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({ path: 'public/img/og.png' });
await nav.close();
console.log('og.png listo');
