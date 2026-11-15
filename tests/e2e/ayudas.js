import { test as base, expect } from '@playwright/test';

// Las pruebas normales entran con la bienvenida ya vista (tiene sus propias pruebas con el `test` sin extender).
export const test = base.extend({
  page: async ({ page }, usar) => {
    await page.addInitScript(() => { try { sessionStorage.setItem('bienvenida-vista', '1'); } catch {} });
    await usar(page);
  },
});
export { expect };

export const ANCHOS = [360, 390, 768, 1024, 1440, 1920];
export const IDIOMAS = [['es', '/'], ['en', '/en/']];

// Nada desborda de lado: ni el documento ni ningún elemento con texto propio (tolerancia 3 px por redondeo).
export async function sinDesborde(page) {
  const mal = await page.evaluate(() => {
    const d = document.documentElement, lista = [];
    if (d.scrollWidth > d.clientWidth) lista.push(`documento ${d.scrollWidth} > ${d.clientWidth}`);
    for (const e of document.querySelectorAll('body *')) {
      if (e.closest('[data-desborde-ok], .solo-lector') || !e.getClientRects().length) continue;   // texto solo para lectores de pantalla, o no pintado
      const propio = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (propio && e.scrollWidth - e.clientWidth > 3 && getComputedStyle(e).overflowX !== 'visible')
        lista.push(`${e.tagName}.${e.className} ${e.scrollWidth} > ${e.clientWidth}`);
      const r = e.getBoundingClientRect();
      if (propio && r.width && (r.right > d.clientWidth + 3 || r.left < -3) && !e.closest('[data-corre]'))
        lista.push(`${e.tagName}.${e.className} fuera de la ventana (${Math.round(r.left)}–${Math.round(r.right)})`);
    }
    return lista;
  });
  expect(mal, mal.join('\n')).toEqual([]);
}

// Junta errores de consola y peticiones que salen del propio origen.
export function vigilar(page) {
  const errores = [], externas = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => m.type() === 'error' && errores.push(m.text()));
  page.on('request', r => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol.startsWith('http') && !process.env.URL_BASE) externas.push(r.url()); });
  return { errores, externas };
}
