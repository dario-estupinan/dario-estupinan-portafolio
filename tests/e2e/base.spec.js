import { test, expect, ANCHOS, IDIOMAS, sinDesborde, vigilar } from './ayudas.js';

for (const [lang, ruta] of IDIOMAS) for (const ancho of ANCHOS) {
  test(`base ${lang} a ${ancho}: sin desborde, sin errores, sin terceros`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 800 });
    const v = vigilar(page);
    await page.goto(ruta);
    await page.waitForLoadState('networkidle');
    await sinDesborde(page);
    expect(v.errores).toEqual([]);
    expect(v.externas).toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    const otra = lang === 'es' ? 'en' : 'es';
    await expect(page.locator(`link[rel=alternate][hreflang=${otra}]`)).toHaveCount(1);
  });
}

test('las letras del sitio cargan desde el propio sitio', async ({ page }) => {
  await page.goto('/');
  const cargadas = await page.evaluate(async () => [
    (await document.fonts.load('800 20px "Bricolage Grotesque"')).length,
    (await document.fonts.load('700 12px "Martian Mono"')).length,
  ]);
  expect(cargadas).toEqual([1, 1]);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(34, 48, 143)');
});
