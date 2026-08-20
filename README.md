# 🦓 SVG Barcode Generator

Simple one-dimensional [barcode](https://en.wikipedia.org/wiki/Barcode) generator focused on scalability and themability.\
Created to be easy to use, lightweight, and compatible with [Tailwind CSS](https://tailwindcss.com/).

## Supported formats

| Type key | Standard | Use case |
|---|---|---|
| `upc_a` | [UPC-A](https://en.wikipedia.org/wiki/Universal_Product_Code) | Retail (North America) |
| `upc_e` | [UPC-E](https://en.wikipedia.org/wiki/Universal_Product_Code#UPC-E) | Retail, compact packaging |
| `ean_13` | [EAN-13](https://en.wikipedia.org/wiki/International_Article_Number) | Retail (worldwide) |
| `ean_8` | [EAN-8](https://en.wikipedia.org/wiki/EAN-8) | Retail, small packaging |
| `code_128` | [Code 128](https://en.wikipedia.org/wiki/Code_128) | Logistics, shipping |
| `gs1_128` | [GS1-128](https://en.wikipedia.org/wiki/GS1-128) | Supply chain, logistics (Code 128 + FNC1) |
| `code_93` | [Code 93](https://en.wikipedia.org/wiki/Code_93) | Industrial, inventory |
| `code_39` | [Code 39](https://en.wikipedia.org/wiki/Code_39) | Industrial, automotive, military |
| `itf` | [ITF (Interleaved 2 of 5)](https://en.wikipedia.org/wiki/Interleaved_2_of_5) | Warehouse, distribution |
| `itf_14` | [ITF-14](https://en.wikipedia.org/wiki/ITF-14) | Cartons, pallets (GS1 shipping containers) |
| `codabar` | [Codabar](https://en.wikipedia.org/wiki/Codabar) | Libraries, blood banks, FedEx |
| `msi` | [MSI Plessey](https://en.wikipedia.org/wiki/MSI_Barcode) | Retail shelf labels, inventory |
| `pharmacode` | [Pharmacode](https://en.wikipedia.org/wiki/Pharmacode) | Pharmaceutical packaging |

## Why use this library

- Creates responsive [SVG](https://en.wikipedia.org/wiki/SVG) graphics that adapt to parent container sizes.
- [TypeScript](https://www.typescriptlang.org/) support - includes type definitions out of the box.
- [TailwindCSS](https://tailwindcss.com/) friendly - no hardcoded colors, so `fill-*` and `text-*` classes cascade freely.
- Can be used in the browser ([ES2020](https://caniuse.com/?search=es2020)) and in runtimes such as [Node.js](https://nodejs.org/), [Deno](https://deno.com/), and [Bun](https://bun.sh/).
- Works in frameworks like [React](https://react.dev/), [Vue](https://vuejs.org/), [Svelte](https://svelte.dev/), etc.
- Compatible with [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/), and should work with [NativeWind](https://www.nativewind.dev/) and [Unistyles](https://www.unistyl.es/).
- [Tree-shakeable](https://en.wikipedia.org/wiki/Tree_shaking) - your bundler automatically removes unused formats to keep your app lightweight.
- Dependency-free.

## Installation

```bash
# using NPM
npm install svg-barcode-generator

# using PNPM
pnpm add svg-barcode-generator

# using Bun
bun add svg-barcode-generator

# using Deno
deno add npm:svg-barcode-generator
```

## Usage

### Basic

Output is a string containing the SVG markup. 

```ts
import SvgBarcodeGenerator from "svg-barcode-generator";

const svg = SvgBarcodeGenerator.generate("7423522549551", "ean_13");

console.log(svg);
```

### React + Tailwind CSS

Since the generated SVG has no hardcoded colors, bars inherit the `fill` CSS property and the background is transparent. You can apply any color using standard CSS or Tailwind classes. 

```tsx
import SvgBarcodeGenerator from "svg-barcode-generator";

export const Barcode = () => {
  const svg = SvgBarcodeGenerator.generate("7423522549551", "ean_13");
  return (
    // Classic: Black bars on white background (safest for physical scanners)
    <div className="bg-white fill-black p-6">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
```

## Notes on specific formats

- **`upc_a`** - alias for `ean_13`. UPC-A (12 digits) is a subset of EAN-13 (13 digits with a leading `0`).
- **`gs1_128`** - Code 128 with an FNC1 character automatically injected at position 1. Physical scanners will prefix decoded output with `]C1` (AIM Symbology Identifier). Software decoders (e.g. ZXing) typically return raw data without this prefix.
- **`itf_14`** - Accepts 13 digits (check digit auto-calculated via Mod 10) or 14 digits directly.
- **`pharmacode`** - Accepts numeric values from `3` to `131070`.

## Materials

- [Color Selection for Barcode Symbols](https://www.barcode.graphics/upc-color-guide)
- [Barcode Symbologies – Scandit](https://www.scandit.com/products/barcode-scanning/symbologies)
- [Wikipedia – Barcode](https://en.wikipedia.org/wiki/Barcode)

## License

This project is licensed under the [MIT License](LICENSE).
