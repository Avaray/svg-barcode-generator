import { Resvg } from '@resvg/resvg-js';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import TsBarcodeGenerator from '../src/index.ts';
import { samples } from './samples.ts';

const outDir = join(import.meta.dir, '../samples/png');

function svgToPng(svg: string): Buffer {
  const normalisedSvg = svg
    .replace(/width="100%"/, 'width="800"')
    .replace(/height="100%"/, 'height="200"');

  const QUIET_ZONE_PX = 40;
  const totalW = 800 + QUIET_ZONE_PX * 2;
  const totalH = 200 + QUIET_ZONE_PX * 2;
  const wrappedSvg = [
    `<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">`,
    `  <rect width="100%" height="100%" fill="white"/>`,
    `  <g transform="translate(${QUIET_ZONE_PX}, ${QUIET_ZONE_PX})">`,
    normalisedSvg,
    `  </g>`,
    `</svg>`,
  ].join('\n');

  const resvg = new Resvg(wrappedSvg, { background: 'white' });
  return resvg.render().asPng() as unknown as Buffer;
}

async function run() {
  await mkdir(outDir, { recursive: true });

  for (const { type, code, options, filename } of samples) {
    const outputName = filename ?? type;
    console.log(`Generating ${outputName}.png...`);
    const svg = TsBarcodeGenerator.generate(code, type, options);
    const pngData = svgToPng(svg);
    await Bun.write(join(outDir, `${outputName}.png`), pngData);
  }

  console.log(`\nDone! ${samples.length} files written to /samples/png`);
}

run();
