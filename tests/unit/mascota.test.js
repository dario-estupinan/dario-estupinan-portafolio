import test from 'node:test';
import assert from 'node:assert/strict';
import { aLetras } from '../../src/scripts/mascota.js';

test('un píxel rojo pleno va a la capa de tinta y uno con verde a la de acento', () => {
  const px = new Uint8ClampedArray([255, 0, 0, 255, 255, 255, 0, 255]);
  assert.deepEqual(aLetras(px, 2, 1), { tinta: '@ \n', acento: ' @\n' });
});

test('un píxel transparente es un espacio en las dos capas', () => {
  const px = new Uint8ClampedArray([255, 0, 0, 0]);
  assert.deepEqual(aLetras(px, 1, 1), { tinta: ' \n', acento: ' \n' });
});

test('la densidad media usa una letra intermedia de la rampa', () => {
  const px = new Uint8ClampedArray([128, 0, 0, 255]);
  assert.equal(aLetras(px, 1, 1).tinta, '+\n');
});

test('cada renglón mide exactamente el número de columnas', () => {
  const { tinta, acento } = aLetras(new Uint8ClampedArray(84 * 31 * 4), 84, 31);
  for (const capa of [tinta, acento]) {
    const filas = capa.split('\n').slice(0, -1);
    assert.equal(filas.length, 31);
    assert.ok(filas.every(f => f.length === 84));
  }
});
