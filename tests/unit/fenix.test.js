import test from 'node:test';
import assert from 'node:assert/strict';
import { poseBienvenida, poseContacto, FUGA } from '../../src/scripts/fenix.js';

const cerca = (a, b) => a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) < 0.02, `${a} ≠ ${b}`));

test('en la bienvenida el fénix nace entero a un costado antes de irse y termina en el punto de fuga', () => {
  assert.equal(poseBienvenida(0).nace, 0);
  const listo = poseBienvenida(800), fin = poseBienvenida(2000);
  assert.equal(listo.nace, 1); assert.ok(listo.x < 0.4 && listo.e > 0.7);
  cerca([fin.x, fin.y, fin.e], [FUGA.x, FUGA.y, FUGA.e]);
});

test('en contacto llega desde el fondo hasta su destino', () => {
  const d = { x: 0.5, y: 0.52, e: 1 }, ini = poseContacto(0, d), fin = poseContacto(1100, d);
  assert.ok(ini.e < 0.05);
  cerca([fin.x, fin.y, fin.e], [d.x, d.y, d.e]);
});
