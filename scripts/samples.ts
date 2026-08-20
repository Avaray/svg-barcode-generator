import { type GenerateOptions } from '../src/index.ts';

type CodeTypes = "upc_a" | "upc_e" | "ean_13" | "ean_8" | "code_128" | "code_93" | "code_39" | "codabar" | "itf" | "itf_14" | "gs1_128" | "msi" | "pharmacode";

export interface Sample {
  type: CodeTypes;
  code: string;
  options?: GenerateOptions;
  /** Override default filename (type name). Use when generating multiple variants of the same type. */
  filename?: string;
}

export const samples: Sample[] = [
  { type: 'ean_13',     code: '7423522549551' },
  { type: 'upc_a',     code: '012345678905' },
  { type: 'ean_8',     code: '12345670' },
  { type: 'code_128',  code: '25145024780063' },
  { type: 'code_39',   code: 'CODE39TEST' },
  { type: 'code_93',   code: 'CODE93' },
  { type: 'itf',       code: '12345678' },
  { type: 'codabar',   code: 'A1234567890B' },
  { type: 'upc_e',     code: '01234565' },
  { type: 'itf_14',    code: '1234567890123', options: { bearerBars: true },  filename: 'itf_14_with_bearer_bars' },
  { type: 'itf_14',    code: '1234567890123', options: { bearerBars: false }, filename: 'itf_14_without_bearer_bars' },
  { type: 'gs1_128',   code: '0112345678901234' },
  { type: 'msi',       code: '123456' },
  { type: 'pharmacode', code: '42' },
];
