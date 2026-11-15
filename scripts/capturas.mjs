// Toma las capturas de los trabajos desde sus carpetas compiladas en C:\sistemas (sin tocar los sitios en vivo)
// y las guarda en public/img/trabajos/<slug>.webp (escritorio) y <slug>-movil.webp. Uso: node scripts/capturas.mjs
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import sharp from 'sharp';

const ORIGEN = {
  'npc-guayaquil': 'C:/sistemas/NPC-GMS-WEB/web/dist',
  'maple-tree': 'C:/sistemas/MapleTree/dist',
  'dra-lorena-martinez': 'C:/sistemas/dra-lorenamartinez-web/dra-web',
  'cnel-ep': 'C:/sistemas/CnelEP/dist',
  'construaceros': 'C:/sistemas/caconstruaceroWeb/dist',
  'chuku-gym': 'C:/sistemas/CHUKU-GYM',
};
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.ico': 'image/x-icon' };

const servir = raiz => createServer(async (pet, res) => {
  let ruta = normalize(join(raiz, decodeURIComponent(new URL(pet.url, 'http://x').pathname)));
  if (!ruta.startsWith(normalize(raiz))) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(ruta)).isDirectory()) ruta = join(ruta, 'index.html');
  } catch { ruta += '.html'; }
  let datos;
  try { datos = await readFile(ruta); } catch { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(ruta).toLowerCase()] || 'application/octet-stream' }).end(datos);
});

const salida = new URL('../public/img/trabajos/', import.meta.url);
await mkdir(salida, { recursive: true });
const nav = await chromium.launch({ channel: 'chrome' });
for (const [slug, raiz] of Object.entries(ORIGEN)) {
  const srv = servir(raiz); await new Promise(r => srv.listen(0, r));
  const url = `http://localhost:${srv.address().port}/`;
  for (const [sufijo, w, h, ancho] of [['', 1440, 900, 1200], ['-movil', 390, 844, 480]]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('bienvenida', '1'); } catch {} });
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: 'load', timeout: 30000 }); await p.waitForTimeout(3500);
      await p.mouse.click(w / 2, h / 2).catch(() => {});      // salta bienvenidas que se quitan con un toque
      await p.waitForTimeout(1500);
      const png = await p.screenshot();
      const info = await sharp(png).resize({ width: ancho }).webp({ quality: 74 }).toFile(new URL(`${slug}${sufijo}.webp`, salida).pathname.slice(1));
      console.log(slug + sufijo, info.width + '×' + info.height, Math.round(info.size / 1024) + ' KB');
    } catch (e) { console.log(slug + sufijo, 'ERROR', e.message.split('\n')[0]); }
    await ctx.close();
  }
  srv.close();
}
await nav.close();
