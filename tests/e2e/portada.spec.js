import { test, expect, ANCHOS, IDIOMAS, sinDesborde } from './ayudas.js';
import { test as crudo } from '@playwright/test';

for (const [lang, ruta] of IDIOMAS) for (const ancho of [320, ...ANCHOS]) {
  test(`portada ${lang} a ${ancho}: nada desborda y lo principal está dentro de la ventana`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 800 });
    await page.goto(ruta);
    await sinDesborde(page);
    for (const sel of ['#portada h1', '#portada [data-principal]', '#portada [data-mascota]']) {
      const c = await page.locator(sel).boundingBox();
      expect(c.x, sel).toBeGreaterThanOrEqual(0);
      expect(c.x + c.width, sel).toBeLessThanOrEqual(ancho + 1);
    }
  });
}

test('con la letra al 200 % en una ventana de 640 px (zoom) nada desborda', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 700 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html{font-size:200%}' });
  await page.waitForTimeout(300);
  await sinDesborde(page);
});

test('el botón principal abre WhatsApp con el número y un mensaje ya escrito', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('#portada [data-principal]').getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/593994556815\?text=.+/);
});

test('la cinta tiene pausa visible de 44 px y se detiene al pulsarla', async ({ page }) => {
  await page.goto('/');
  const pausa = page.locator('#portada [data-pausa]');
  const c = await pausa.boundingBox();
  expect(Math.min(c.width, c.height)).toBeGreaterThanOrEqual(44);
  const estado = () => page.locator('#portada [data-pista]').evaluate(e => getComputedStyle(e).animationPlayState);
  expect(await estado()).toBe('running');
  await pausa.click();
  expect(await estado()).toBe('paused');
  await expect(pausa).toHaveAttribute('aria-pressed', 'true');
});

test('con movimiento reducido la cinta arranca en pausa', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto('/');
  await expect(page.locator('#portada [data-pausa]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('#portada [data-pista]').evaluate(e => getComputedStyle(e).animationPlayState)).toBe('paused');
});

test('en celular el menú es un diálogo que se abre, se cierra con Escape y devuelve el foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const abrir = page.locator('[data-menu-abrir]'), menu = page.locator('dialog#menu');
  await expect(abrir).toBeVisible();
  await abrir.click();
  await expect(menu).toBeVisible();
  expect(await menu.evaluate(d => d.matches(':modal'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(abrir).toBeFocused();
  await abrir.click();
  await menu.locator('a[href="#trabajos"]').click();
  await expect(menu).toBeHidden();
});

for (const [lang, ruta] of IDIOMAS) {
  test(`la barra de escritorio (${lang}) deja 48 px libres en su ancho mínimo`, async ({ page }) => {
    await page.setViewportSize({ width: 992, height: 800 });
    await page.goto(ruta);
    await expect(page.locator('[data-menu-abrir]')).toBeHidden();
    const libre = await page.locator('header[data-nav] .fila').evaluate(f => {
      const s = getComputedStyle(f), ancho = f.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
      return ancho - [...f.children].filter(h => h.offsetParent).reduce((a, h) => a + h.getBoundingClientRect().width, 0);
    });
    expect(libre).toBeGreaterThanOrEqual(48);
  });
}

test('el enlace de idioma lleva a la misma sección en la otra lengua', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/#trabajos');
  await page.waitForTimeout(600);
  await expect(page.locator('header[data-nav] [data-idioma]')).toHaveAttribute('href', '/en/#trabajos');
});

crudo.describe('bienvenida', () => {
  crudo('aparece una vez por sesión, se quita con un toque y no bloquea el desplazamiento', async ({ page }) => {
    await page.goto('/');
    const capa = page.locator('div[data-bienvenida]');
    await expect(capa).toBeVisible();
    await capa.click();
    await expect(capa).toBeHidden();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await page.reload();
    await expect(capa).toBeHidden();
  });
  crudo('se retira sola aunque nadie la toque', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('div[data-bienvenida]')).toBeHidden({ timeout: 8000 });
  });
  crudo('no aparece con movimiento reducido', async ({ browser }) => {
    const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
    await page.goto('/');
    await expect(page.locator('div[data-bienvenida]')).toBeHidden();
  });
  crudo('no aparece sin JavaScript', async ({ browser }) => {
    const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
    await page.goto('/');
    await expect(page.locator('div[data-bienvenida]')).toBeHidden();
    await expect(page.locator('#portada h1')).toBeVisible();
  });
});
