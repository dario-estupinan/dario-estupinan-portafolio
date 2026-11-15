import { test, expect, sinDesborde, vigilar } from './ayudas.js';

const lista = page => page.waitForSelector('[data-mascota][data-lista]');
const dibujo = page => page.evaluate(() => document.querySelector('[data-mascota] pre').textContent);

for (const ancho of [1440, 390, 360]) {
  test(`el dibujo cabe en su marco a ${ancho}`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 800 });
    await page.goto('/'); await lista(page); await page.waitForTimeout(400);
    const sobra = await page.evaluate(() => {
      const pre = document.querySelector('[data-mascota] pre'), r = document.createRange(); r.selectNodeContents(pre);
      const t = r.getBoundingClientRect(), m = pre.parentElement.getBoundingClientRect();
      return [t.right - m.right, t.bottom - m.bottom];
    });
    expect(sobra[0]).toBeLessThanOrEqual(1);
    expect(sobra[1]).toBeLessThanOrEqual(1);
    await sinDesborde(page);
  });
}

test('el botón rota las tres mascotas y la elección se conserva al recargar', async ({ page }) => {
  await page.goto('/'); await lista(page);
  const rotulo = page.locator('[data-rotulo]').first(), boton = page.locator('[data-cambiar]').first();
  await expect(rotulo).toContainText('Fig. 01');
  await boton.click(); await expect(rotulo).toContainText('Fig. 02');
  await page.reload(); await lista(page);
  await expect(rotulo).toContainText('Fig. 02');
  await boton.click(); await expect(rotulo).toContainText('Fig. 03');
  await boton.click(); await expect(rotulo).toContainText('Fig. 01');
});

test('con el almacenamiento bloqueado el botón sigue funcionando y no hay errores', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('bloqueado'); };
    Storage.prototype.setItem = () => { throw new Error('bloqueado'); };
  });
  const v = vigilar(page);
  await page.goto('/'); await lista(page);
  await page.locator('[data-cambiar]').first().click();
  await expect(page.locator('[data-rotulo]').first()).toContainText('Fig. 02');
  expect(v.errores).toEqual([]);
});

test('con movimiento reducido está quieta hasta que se toca', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto('/'); await lista(page); await page.waitForTimeout(500);
  const a = await dibujo(page); await page.waitForTimeout(1000);
  expect(await dibujo(page)).toBe(a);
  await page.locator('[data-mascota] .lienzo').first().click(); await page.waitForTimeout(250);
  expect(await dibujo(page)).not.toBe(a);
});

test('sin JavaScript se ve el dibujo fijo y no aparece el botón', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto('/');
  expect((await dibujo(page)).trim().length).toBeGreaterThan(200);
  await expect(page.locator('[data-mascota] .lienzo').first()).toHaveAttribute('aria-label', /.+/);
  await expect(page.locator('[data-cambiar]').first()).toBeHidden();
  await sinDesborde(page);
});
