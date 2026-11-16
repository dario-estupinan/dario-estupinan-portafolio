import { test, expect, ANCHOS, IDIOMAS, sinDesborde, vigilar } from './ayudas.js';

const SECCIONES = ['servicios', 'ia', 'trabajos', 'datos', 'protocolo', 'sobre-mi', 'preguntas', 'contacto'];

for (const [lang, ruta] of IDIOMAS) for (const ancho of [320, ...ANCHOS]) {
  test(`página entera ${lang} a ${ancho}: sin desborde ni errores, con todas las secciones`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 800 });
    const v = vigilar(page);
    await page.goto(ruta);
    for (const id of SECCIONES) await expect(page.locator(`section#${id}`)).toHaveCount(1);
    // Recorre la página para que carguen las imágenes diferidas y se activen las animaciones ligadas al scroll.
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 700) { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(40); }
    await sinDesborde(page);
    expect(v.errores).toEqual([]);
    expect(v.externas).toEqual([]);
  });
}

test('servicios: tres paneles con su lista de serie, todos legibles al final del recorrido', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const paneles = page.locator('#servicios [data-panel]');
  await expect(paneles).toHaveCount(3);
  for (let i = 0; i < 3; i++) await expect(paneles.nth(i).locator('[data-serie] li').first()).toBeAttached();
  await page.locator('#servicios [data-panel]').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  // Aunque se apilen, el título de cada panel anterior sigue a la vista.
  for (let i = 0; i < 3; i++) await expect(paneles.nth(i).locator('h3')).toBeInViewport();
});

test('servicios: con movimiento reducido los paneles no se apilan', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('/');
  expect(await page.locator('#servicios [data-panel]').first().evaluate(e => getComputedStyle(e).position)).not.toBe('sticky');
});

test('presencia en IA: la respuesta simulada está rotulada y la frase se lee entera con movimiento reducido', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto('/');
  await expect(page.locator('#ia [data-ilustracion]')).toContainText('Ilustración');
  const opacidades = await page.locator('#ia [data-frase] span').evaluateAll(s => s.map(e => getComputedStyle(e).opacity));
  expect(opacidades.length).toBeGreaterThan(10);
  expect(opacidades.every(o => o === '1')).toBe(true);
  await expect(page.locator('#ia')).not.toContainText(/primer lugar|garantiz/i);
});

test('trabajos: tres casos grandes con sus dos capturas y seis tarjetas, sin desborde en celular', async ({ browser }) => {
  const page = await (await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 800 } })).newPage();
  await page.addInitScript(() => sessionStorage.setItem('bienvenida-vista', '1'));
  await page.goto('/');
  await expect(page.locator('#trabajos [data-trabajos] > li:not(.corte)')).toHaveCount(9);
  const grandes = page.locator('#trabajos .destacado');
  await expect(grandes).toHaveCount(3);
  for (const img of await grandes.locator('img').all()) await expect(img).toHaveAttribute('alt', /.+/);
  await expect(grandes.locator('img')).toHaveCount(6);
  await expect(grandes.first().locator('a.boton')).toHaveAttribute('href', '/trabajos/npc-guayaquil/');
  await expect(page.locator('#trabajos')).toContainText('En construcción');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

for (const [lang, raiz, carpeta] of [['es', '', 'trabajos'], ['en', '/en', 'work']])
  for (const slug of ['npc-guayaquil', 'maple-tree', 'dra-lorena-martinez', 'fiscalio'])
    for (const ancho of [360, 1440]) {
      test(`caso ${slug} (${lang}) a ${ancho}: existe, tiene título, vuelta y no desborda`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 800 });
        const v = vigilar(page);
        const r = await page.goto(`${raiz}/${carpeta}/${slug}/`);
        expect(r.status()).toBe(200);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('[data-volver]')).toHaveAttribute('href', `${raiz}/#trabajos`);
        for (const img of await page.locator('main img').all()) await expect(img).toHaveAttribute('alt', /.+/);
        await sinDesborde(page);
        expect(v.errores).toEqual([]);
      });
    }

test('datos: tablero de demostración con pestañas que cambian las cifras y sin nombres reservados', async ({ browser }) => {
  const page = await (await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 800 } })).newPage();
  await page.addInitScript(() => sessionStorage.setItem('bienvenida-vista', '1'));
  await page.goto('/');
  await expect(page.locator('#datos [data-aviso]')).toContainText('Datos de demostración');
  const pestanas = page.locator('#datos [role=tab]');
  await expect(pestanas).toHaveCount(4);
  const cifra = () => page.locator('#datos [role=tabpanel]:not([hidden]) [data-cifra]').first().textContent();
  const antes = await cifra();
  await pestanas.nth(1).tap();
  await expect(pestanas.nth(1)).toHaveAttribute('aria-selected', 'true');
  expect(await cifra()).not.toBe(antes);
  await pestanas.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  await expect(pestanas.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(pestanas.nth(2)).toBeFocused();
  await expect(page.locator('#datos [role=tabpanel]:not([hidden]) svg title')).toHaveCount(1);
  await expect(page.locator('#datos [role=tabpanel]:not([hidden]) table')).toHaveCount(1);
  const texto = (await page.locator('body').textContent()).replace(/VIAXPERTA S\.A\./, '');
  expect(texto).not.toMatch(/viaxperta|viaexperta|\bERP\b/i);
});

test('protocolo: siete pasos en orden, con la promesa de respuesta y sin importes', async ({ page }) => {
  await page.goto('/');
  const pasos = page.locator('#protocolo [data-paso] h3');
  await expect(pasos).toHaveText(['Primer contacto', 'Evaluación de necesidades', 'Reunión agendada', 'Propuesta escrita', 'Desarrollo con avances visibles', 'Entrega con capacitación y manual', 'Acompañamiento']);
  await expect(page.locator('#protocolo')).toContainText('Respondo en una hora en horario laboral');
  expect(await page.locator('main').textContent()).not.toMatch(/[$€]|USD\s*\d|\d\s*dólares/);
});

test('sobre mí, preguntas y contacto', async ({ page }) => {
  await page.goto('/');
  expect((await page.locator('main').textContent()).match(/VIAXPERTA/g)).toHaveLength(1);
  await expect(page.locator('#sobre-mi img')).toHaveAttribute('alt', /Darío/);
  const sello = page.locator('#sobre-mi [data-sello-pausa]');
  await sello.click();
  expect(await page.locator('#sobre-mi [data-sello]').evaluate(e => getComputedStyle(e).animationPlayState)).toBe('paused');
  const pregunta = page.locator('#preguntas details').first();
  await pregunta.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(pregunta).toHaveAttribute('open', '');
  const c = page.locator('#contacto');
  expect(await c.locator('a[href^="https://wa.me/593994556815"]').count()).toBeGreaterThan(0);
  await expect(c.locator('a[href="mailto:dario.estupinand@hotmail.com"]')).toHaveCount(1);
  await expect(c.locator('a[href="https://www.linkedin.com/in/dario-estupinan"]')).toHaveCount(1);
  await expect(c.locator('a[href="https://github.com/dario-estupinan"]')).toHaveCount(1);
});

test('todo objetivo táctil de la página mide al menos 44 px en celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const chicos = await page.evaluate(() => [...document.querySelectorAll('main a, main button, main summary, header a, header button, footer a')]
    .filter(e => e.getClientRects().length && !e.closest('p, li p'))
    .map(e => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.className).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter(x => x.h < 44 || x.w < 44));
  expect(chicos, JSON.stringify(chicos)).toEqual([]);
});

test('presencia en IA: el asistente simulado responde solo al entrar en pantalla y al tocar cada caso, sin saltos', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('bienvenida-vista', '1'));
  await page.goto('/');
  const fig = page.locator('#ia [data-agente]'), resp = fig.locator('[data-respuesta]');
  await fig.scrollIntoViewIfNeeded();
  const alto = (await fig.boundingBox()).height;
  await expect(fig).toHaveAttribute('data-modo', 'sin');
  await expect(resp).toHaveText(/Horno Lento hace tortas.*WhatsApp\.$/, { timeout: 15000 });
  await expect(fig).toHaveAttribute('data-modo', 'con');
  await fig.locator('[data-ver="sin"]').click();
  await expect(resp).toHaveText(/^No encuentro información suficiente.*zona\.$/, { timeout: 10000 });
  expect(Math.abs((await fig.boundingBox()).height - alto)).toBeLessThanOrEqual(1);
});

test('presencia en IA: con movimiento reducido el asistente cambia de caso al instante', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto('/');
  const fig = page.locator('#ia [data-agente]');
  await expect(fig.locator('[data-respuesta]')).toHaveText(/Horno Lento/);
  await fig.locator('[data-ver="sin"]').click();
  await expect(fig.locator('[data-respuesta]')).toHaveText(/^No encuentro/, { timeout: 500 });
});

test('«Hablemos» está a la vista en celular y lleva a Contacto, donde llega el fénix', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 700 });
  await page.goto('/');
  const boton = page.locator('header[data-nav] .hablar'), lienzo = page.locator('#contacto canvas');
  await expect(boton).toBeInViewport();
  await boton.click();
  await expect(lienzo).toBeInViewport();
  // El ave se pintó: hay puntos en el lienzo.
  await expect.poll(() => lienzo.evaluate(c => c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some(v => v))).toBe(true);
  await sinDesborde(page);
});

test('los trabajos se revelan al entrar en pantalla y sin animación están a la vista desde el principio', async ({ page, browser }) => {
  await page.goto('/');
  const ultima = page.locator('#trabajos .tarjeta').last();
  await expect(ultima).toHaveCSS('opacity', '0');
  await ultima.scrollIntoViewIfNeeded();
  await expect(ultima).toHaveCSS('opacity', '1');
  const quieta = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await quieta.goto('/');
  await expect(quieta.locator('#trabajos .tarjeta').last()).toHaveCSS('opacity', '1');
});
