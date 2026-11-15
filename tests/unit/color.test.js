import test from 'node:test';
import assert from 'node:assert/strict';
import { contraste } from '../../src/lib/color.js';

test('negro sobre blanco da 21', () => assert.equal(contraste('#000000', '#FFFFFF'), 21));
test('la paleta cumple el contraste medido en la especificación', () => {
  assert.ok(contraste('#ECEBF8', '#22308F') >= 9);      // lila sobre cobalto
  assert.ok(contraste('#C9F26B', '#22308F') >= 8.5);    // lima sobre cobalto
  assert.ok(contraste('#0F1026', '#FF7A66') >= 7);      // tinta sobre coral
  assert.ok(contraste('#0F1026', '#C9F26B') >= 14);     // tinta sobre lima
  assert.ok(contraste('#0F1026', '#ECEBF8') >= 15);     // tinta sobre lila
  assert.ok(contraste('#22308F', '#C9F26B') >= 8.5);    // cobalto sobre lima
});
