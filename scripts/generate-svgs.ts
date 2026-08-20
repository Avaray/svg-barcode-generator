import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import TsBarcodeGenerator from '../src/index.ts';
import { samples } from './samples.ts';

const outDir = join(import.meta.dir, '../samples/svg');

async function run() {
  await mkdir(outDir, { recursive: true });

  for (const { type, code, options, filename } of samples) {
    const outputName = filename ?? type;
    console.log(`Generating ${outputName}.svg...`);
    const svg = TsBarcodeGenerator.generate(code, type, options);
    await writeFile(join(outDir, `${outputName}.svg`), svg, 'utf-8');
  }

  console.log(`\nDone! ${samples.length} files written to /samples/svg`);
}

run();
