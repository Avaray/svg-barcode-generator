import { Resvg } from '@resvg/resvg-js';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import TsBarcodeGenerator from '../src/index.ts';

const samples = [
  { type: 'ean_13', code: '7423522549551' },
  { type: 'upc_a', code: '012345678905' },
  { type: 'ean_8', code: '12345670' },
  { type: 'code_128', code: '25145024780063' },
  { type: 'code_39', code: 'CODE39TEST' },
  { type: 'code_93', code: 'CODE93' },
  { type: 'itf', code: '12345678' },
  { type: 'codabar', code: 'A1234567890B' },
  { type: 'upc_e', code: '01234565' },
  { type: 'itf_14', code: '1234567890123' },
  { type: 'gs1_128', code: '0112345678901234' },
  { type: 'msi', code: '123456' },
  { type: 'pharmacode', code: '131070' }
] as const;

const outDir = join(import.meta.dir, '../samples');

async function run() {
  await mkdir(outDir, { recursive: true });

  for (const { type, code } of samples) {
    console.log(`Generating ${type}.png...`);
    const svg = TsBarcodeGenerator.generate(code, type);
    
    const normalisedSvg = svg
      .replace(/width="100%"/, 'width="800"')
      .replace(/height="100%"/, 'height="200"');
    
    // Add white background and quiet zone to the SVG before rendering to PNG
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
    const pngData = resvg.render().asPng();
    
    await Bun.write(join(outDir, `${type}.png`), pngData);
  }
  
  console.log('All samples generated in /samples folder!');
}

run();
