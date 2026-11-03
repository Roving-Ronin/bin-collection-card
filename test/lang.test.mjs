import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

/* Every text key the card and editor ask for must exist in src/lang/en.json. */
const en = JSON.parse(readFileSync(new URL('../src/lang/en.json', import.meta.url), 'utf8'));
const has = path => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), en) !== undefined;
const srcDir = new URL('../src/', import.meta.url);
const sources = readdirSync(srcDir).filter(f => f.endsWith('.js')).map(f => [f, readFileSync(new URL(f, srcDir), 'utf8')]);

test('every literal t() key exists in en.json', () => {
  for (const [f, src] of sources)
    for (const [, key] of src.matchAll(/\bt\(['`]([a-z_.]+)['`]/g)) assert.ok(has(key), `${f}: ${key}`);
});

test('every bin colour has a bin and a bag name', async () => {
  const { BINS } = await import('../src/normalize.js');
  for (const b of BINS) { assert.ok(has(`card.bin.${b}`), b); assert.ok(has(`card.bag.${b}`), b); }
});

test('editor option groups cover every value', async () => {
  const { CONTAINERS, WEEKS, HOLIDAY_MODES } = await import('../src/normalize.js');
  for (const [g, vals] of [['container', CONTAINERS], ['weeks', WEEKS], ['holidays', HOLIDAY_MODES]])
    for (const v of vals) assert.ok(has(`editor.options.${g}.${v}`), `${g}.${v}`);
});
