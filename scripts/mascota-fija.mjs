// Genera src/data/mascota-fija.json: el dibujo quieto de la mascota de partida (el ojo) que se ve antes de que cargue
// el JavaScript (o sin él). Uso: npm run build && npm run preview (en otra terminal) && node scripts/mascota-fija.mjs
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const nav = await chromium.launch({ channel: 'chrome' });
const pagina = await nav.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
await pagina.goto(process.env.URL_BASE || 'http://localhost:4321/');
await pagina.waitForSelector('[data-mascota][data-lista]');
await pagina.waitForTimeout(600);
const capas = await pagina.evaluate(() => {
  const [tinta, acento] = document.querySelector('[data-mascota]').querySelectorAll('pre');
  return { tinta: tinta.textContent, acento: acento.textContent };
});
await nav.close();
if (!capas.tinta.trim()) throw new Error('La mascota no dibujó nada');
writeFileSync(new URL('../src/data/mascota-fija.json', import.meta.url), JSON.stringify(capas) + '\n');
console.log('mascota-fija.json actualizado:', capas.tinta.split('\n').length - 1, 'renglones');
