import { describe, test, expect } from 'bun:test';
import TsBarcodeGenerator from '../src/index.ts';

type CodeTypes = "upc_a" | "upc_e" | "ean_13" | "ean_8" | "code_128" | "code_93" | "code_39" | "codabar" | "itf" | "itf_14" | "gs1_128" | "msi" | "pharmacode";

const testCases: { type: CodeTypes, code: string }[] = [
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
];

describe('SVG Styling & Tailwind Compatibility', () => {
  testCases.forEach(({ type, code }) => {
    test(`[${type}] generated SVG elements should inherit CSS fill colors (no hardcoded fills)`, () => {
      const svg = TsBarcodeGenerator.generate(code, type);
      
      // We want to ensure that the <rect> elements do not have a hardcoded 'fill' attribute.
      // If a <rect> has fill="black", it would prevent Tailwind classes like 'fill-red-500' 
      // applied to the parent <svg> from cascading to the rectangles.
      
      // Use regex to find all <rect> tags
      const rectRegex = /<rect[^>]*>/g;
      const rects = svg.match(rectRegex);
      
      expect(rects).toBeDefined();
      expect(rects!.length).toBeGreaterThan(0);
      
      rects!.forEach(rect => {
        // Assert that no rect has a fill attribute
        expect(rect).not.toMatch(/fill\s*=\s*['"][^'"]*['"]/);
        // Assert that no rect has an inline style setting fill
        expect(rect).not.toMatch(/style\s*=\s*['"][^'"]*fill\s*:/);
      });
      
      // Optionally, check the SVG root as well to ensure it doesn't block inheritance
      const svgRootRegex = /<svg[^>]*>/;
      const svgRoot = svg.match(svgRootRegex)?.[0];
      expect(svgRoot).toBeDefined();
      expect(svgRoot).not.toMatch(/fill\s*=\s*['"](?!currentColor)[^'"]*['"]/);
    });
  });
});
