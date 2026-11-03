/* Bundles src/ (card, editor and src/lang/en.json) into the single file HACS installs: dist/bin-collection-card.js */
import { readFileSync } from 'node:fs';
import * as esbuild from 'esbuild';

// The version lives in src/bin-collection-card.js (BCC_VERSION), set from the release tag by .github/workflows/release.yml
const version = readFileSync(new URL('../src/bin-collection-card.js', import.meta.url), 'utf8').match(/^const BCC_VERSION = '([^']*)';/m)?.[1];
if (!version) throw new Error("BCC_VERSION not found in src/bin-collection-card.js");

const options = {
  entryPoints: ['src/bin-collection-card.js'],
  outfile: 'dist/bin-collection-card.js',
  bundle: true,
  format: 'esm',
  target: 'es2020',
  charset: 'utf8',
  legalComments: 'inline',
  banner: { js: `/*! bin-collection-card v${version} | https://github.com/Roving-Ronin/bin-collection-card | MIT | built from src/ — edit there, not here */` },
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
