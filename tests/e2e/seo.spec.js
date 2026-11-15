import { test, expect, vigilar } from './ayudas.js';

const PAGINAS = ['/', '/en/', '/trabajos/npc-guayaquil/', '/en/work/npc-guayaquil/'];

for (const ruta of PAGINAS) {
  test(`${ruta}: título, descripción, canónica, idiomas alternos y etiquetas para compartir`, async ({ page }) => {
    await page.goto(ruta);
    expect((await page.title()).length).toBeGreaterThan(10);
    const meta = sel => page.locator(sel).getAttribute('content');
    expect((await meta('meta[name=description]')).length).toBeGreaterThan(40);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', new RegExp(`^https://dario-estupinan\\.pages\\.dev${ruta}$`));
    for (const h of ['es', 'en', 'x-default']) await expect(page.locator(`link[rel=alternate][hreflang="${h}"]`)).toHaveCount(1);
    expect(await meta('meta[property="og:title"]')).toBeTruthy();
    expect(await meta('meta[property="og:image"]')).toMatch(/^https:\/\/dario-estupinan\.pages\.dev\/img\/og\.png$/);
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  });
}

test('los datos estructurados describen a la persona, el servicio y las mismas preguntas de la página', async ({ page }) => {
  await page.goto('/');
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  const grafo = bloques.flatMap(b => JSON.parse(b)['@graph']);
  const tipos = grafo.map(n => n['@type']);
  expect(tipos).toEqual(expect.arrayContaining(['Person', 'ProfessionalService', 'FAQPage']));
  const faq = grafo.find(n => n['@type'] === 'FAQPage').mainEntity.map(q => q.name);
  const enPagina = await page.locator('#preguntas summary span:first-child').allTextContents();
  expect(faq).toEqual(enPagina);
  expect(JSON.stringify(grafo)).not.toMatch(/priceRange|"price"/);
});

test('mapa del sitio con todas las páginas, robots abierto y llms.txt', async ({ request }) => {
  const indice = await (await request.get('/sitemap-index.xml')).text();
  const mapa = await (await request.get(indice.match(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/)[1].replace(/^/, '/'))).text();
  for (const ruta of ['/', '/en/', '/trabajos/fiscalio/', '/en/work/fiscalio/', '/trabajos/maple-tree/', '/en/work/dra-lorena-martinez/'])
    expect(mapa).toContain(`<loc>https://dario-estupinan.pages.dev${ruta}</loc>`);
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(robots).toContain('Sitemap: https://dario-estupinan.pages.dev/sitemap-index.xml');
  expect(await (await request.get('/llms.txt')).text()).toContain('Darío Estupiñán');
});

test('la página no trae scripts ni estilos en línea (los bloquearía la política de seguridad)', async ({ page }) => {
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    expect(await page.locator('script:not([src]):not([type="application/ld+json"])').count(), ruta).toBe(0);
    expect(await page.locator('style').count(), ruta).toBe(0);
    // En el HTML servido (lo que pone JavaScript después por CSSOM sí está permitido).
    expect(await (await page.request.get(ruta)).text(), ruta).not.toMatch(/\sstyle=/);
  }
});

test('con la política de seguridad de _headers aplicada no hay violaciones y todo funciona', async ({ page, request }) => {
  const cabeceras = await (await request.get('/_headers')).text();
  const csp = cabeceras.match(/Content-Security-Policy:\s*(.+)/)[1].trim();
  expect(csp).toContain("default-src 'self'");
  expect(csp).not.toMatch(/unsafe-inline|unsafe-eval/);
  for (const c of ['X-Content-Type-Options: nosniff', 'Referrer-Policy:', 'Permissions-Policy:']) expect(cabeceras).toContain(c);
  expect(cabeceras).not.toContain('X-Robots-Tag');

  const v = vigilar(page);
  await page.route('**/*', async ruta => {
    const r = await ruta.fetch();
    await ruta.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
  });
  await page.goto('/');
  await page.waitForSelector('[data-mascota][data-lista]');
  await page.locator('#datos [role=tab]').nth(1).click();
  await expect(page.locator('#datos [role=tab]').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.locator('#portada [data-cambiar]').click();
  await expect(page.locator('[data-rotulo]').first()).toContainText('Fig. 02');
  expect(v.errores).toEqual([]);
});
