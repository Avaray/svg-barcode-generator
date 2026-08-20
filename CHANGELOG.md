# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Multi-target bundling configuration with `tsdown` for ESM (`dist/index.mjs`), CommonJS (`dist/index.cjs`), and Browser (`dist/index.iife.js`).
- TypeScript declaration generation configured natively with `tsdown` (`bun run build`).
- UPC-E barcode generation support (`src/1d/upc_e.ts`).
- Automated barcode verification test suite using `bun:test`, `@zxing/library`, and `@resvg/resvg-js` (`tests/barcode.test.ts`).
- `shape-rendering="crispEdges"` on SVG root element to ensure crisp bar rendering across renderers.

### Changed
- Migrated runtime, dependency management, and test runner from Deno to Bun.
- Rewrote EAN-13 encoding logic to use the first system digit to determine parity patterns (L-code and G-code tables).
- Standardized leading and trailing quiet zones across barcode generators (EAN-8, EAN-13, Code-39, Code-93, Codabar, ITF, UPC-E).
- Updated SVG coordinate generation in `src/utils.ts` to preserve trailing quiet zones via explicit `totalModules` sizing.

### Fixed
- Fixed missing pattern definitions for character values 96 to 102 (FNC and shift characters) in Code-128.
- Fixed Code-39 stop character corruption caused by an unintended extra termination bar.
- Fixed Codabar character encoding table for swapped start/stop and punctuation patterns.
- Fixed UPC-E parity tables to use Even parity encodings (G-code) instead of Right encodings.

### Removed
- Removed Deno configuration and lockfiles (`deno.json`, `deno.lock`).
- Removed legacy `pnpm-lock.yaml`.
