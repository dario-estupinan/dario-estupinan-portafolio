import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { trabajos } from '../../src/data/trabajos.js';

const leer = l => JSON.parse(readFileSync(new URL(`../../src/i18n/${l}.json`, import.meta.url), 'utf8'));
const es = leer('es'), en = leer('en');

// Rutas de todas las hojas: 'portada.lista.0.1' → texto
const hojas = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? hojas(v, `${pre}${k}.`) : [[`${pre}${k}`, v]]));
// Lo que es igual en las dos lenguas a propósito: nombres propios, marcas, anclas y códigos.
const IGUALES = /^(sitio\.nombre|nav\.enlaces\.\d+\.0|portada\.ficha\.2|portada\.lista\.1\.1|portada\.cinta\.[12]|servicios\.items\.\d+\.ancla|servicios\.items\.0\.ejemplo|sobre\.linea\.\d+\.2|sobre\.herramientas\.\d+|pie\.derechos|contacto\.cinta\.[23]|sobre\.linea\.0\.1|sobre\.linea\.[12]\.0)$/;

test('español e inglés tienen exactamente las mismas claves y ninguna vacía', () => {
  const a = hojas(es), b = hojas(en);
  assert.deepEqual(a.map(x => x[0]), b.map(x => x[0]));
  for (const [k, v] of [...a, ...b]) assert.ok(String(v).trim(), `vacío: ${k}`);
});

test('ningún texto en inglés quedó sin traducir', () => {
  const b = Object.fromEntries(hojas(en));
  const sinTraducir = hojas(es).filter(([k, v]) => b[k] === v && !IGUALES.test(k)).map(x => x[0]);
  assert.deepEqual(sinTraducir, []);
});

test('cada trabajo tiene sus textos en las dos lenguas y sin voseo', () => {
  for (const w of trabajos) {
    for (const campo of ['tipo', 'resumen', ...(w.caso ? ['necesidad', 'hecho'] : [])]) {
      assert.ok(w[campo]?.es && w[campo]?.en, `${w.slug}.${campo}`);
      assert.notDeepEqual(w[campo].es, w[campo].en, `${w.slug}.${campo} sin traducir`);
    }
  }
  const todo = JSON.stringify(es) + JSON.stringify(trabajos.map(w => [w.resumen.es, w.necesidad?.es, w.hecho?.es]));
  assert.doesNotMatch(todo, /\b(elegí|reservá|escribime|contame|mirá|tenés|querés|podés|acá)\b/i);
});
