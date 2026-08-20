# SVG Barcode Generator

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
- [TailwindCSS](https://tailwindcss.com/) friendly — no hardcoded fill colors on `<rect>` elements, so `fill-*` and `text-*` classes cascade freely.
- Can be used in the browser ([ES2020](https://caniuse.com/?search=es2020)) and in runtimes such as [Node.js](https://nodejs.org/), [Deno](https://deno.com/), and [Bun](https://bun.sh/).
- Works in frameworks like [React](https://react.dev/), [Vue](https://vuejs.org/), [Svelte](https://svelte.dev/), etc.
- Compatible with [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/), and should work with [NativeWind](https://www.nativewind.dev/) and [Unistyles](https://www.unistyl.es/).
- Dependency-free.
- Tree-shakeable.

## Usage

#### Basic

```ts
import SvgBarcodeGenerator from "svg-barcode-generator";

const svg = SvgBarcodeGenerator.generate("7423522549551", "ean_13");

console.log(svg); // <svg ...>...</svg>
```

#### React + Tailwind CSS

```tsx
import SvgBarcodeGenerator from "svg-barcode-generator";

export const Barcode = () => {
  const svg = SvgBarcodeGenerator.generate("7423522549551", "ean_13");
  return (
    <div className="p-6 bg-white fill-current text-black">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
```

#### Options (ITF-14)

ITF-14 supports an optional third argument to control [Bearer Bars](https://en.wikipedia.org/wiki/ITF-14#Bearer_bars) — the horizontal borders required by the GS1 standard for physical label printing. They are enabled by default.

```ts
// With bearer bars (GS1-compliant, default)
SvgBarcodeGenerator.generate("1234567890123", "itf_14");

// Without bearer bars (cleaner SVG, easier to style)
SvgBarcodeGenerator.generate("1234567890123", "itf_14", { bearerBars: false });
```

#### Coloring with Tailwind CSS

Since the generated SVG has no hardcoded colors, bars inherit the `fill` CSS property and the background is transparent. You can apply any color via Tailwind:

```tsx
// Black bars on white background
<div className="bg-white text-black fill-current">
  <div dangerouslySetInnerHTML={{ __html: svg }} />
</div>

// Dark bars on colored background
<div className="bg-yellow-100 text-gray-900 fill-current">
  <div dangerouslySetInnerHTML={{ __html: svg }} />
</div>
```

## Notes on specific formats

- **`upc_a`** — alias for `ean_13`. UPC-A (12 digits) is a subset of EAN-13 (13 digits with a leading `0`).
- **`gs1_128`** — Code 128 with an FNC1 character automatically injected at position 1. Physical scanners will prefix decoded output with `]C1` (AIM Symbology Identifier). Software decoders (e.g. ZXing) typically return raw data without this prefix.
- **`itf_14`** — Accepts 13 digits (check digit auto-calculated via Mod 10) or 14 digits directly.
- **`pharmacode`** — Accepts numeric values from `3` to `131070`.

## Materials

- [Color Selection for Barcode Symbols](https://www.barcode.graphics/upc-color-guide)
- [GS1 Barcode Types](https://www.gs1.org/standards/barcodes)
- [Barcode Symbologies – Scandit](https://www.scandit.com/products/barcode-scanning/symbologies)
- [Wikipedia – Barcode](https://en.wikipedia.org/wiki/Barcode)

## Support the project

If you see potential in this project and want to help — feel free to contribute.

You can contact me on [LinkedIn](https://www.linkedin.com/in/wasowsky/) or Discord: `avaray_`
