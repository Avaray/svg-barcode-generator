# SVG Barcode Generator

Simple [barcode](https://en.wikipedia.org/wiki/Barcode) generator focused on scaleability and themability.\
Created to be easy to use, lightweight, and compatible with [Tailwind CSS](Tailwind).

## Supported code formats

- [upc_a](https://en.wikipedia.org/wiki/Universal_Product_Code)
- [ean_13](https://en.wikipedia.org/wiki/International_Article_Number)
- [code_128](https://en.wikipedia.org/wiki/Code_128)
- [code_93](https://en.wikipedia.org/wiki/Code_93)
- [code_39](https://en.wikipedia.org/wiki/Code_39)

## Why to use this library

- Creates responsive [SVG](https://en.wikipedia.org/wiki/SVG) graphics that adapt to parent container sizes.
- Is [TailwindCSS](https://tailwindcss.com/) friendly (you can easily apply foreground and background colors).
- Can be used in the browser ([ES2017](https://caniuse.com/?search=es2017)) and in runtimes such as
  [Node](https://nodejs.org/), [Deno](https://deno.com/), and [Bun](https://bun.sh/).
- Can be used in frameworks like [React](https://react.dev/), [Vue](https://vuejs.org/), and
  [Svelte](https://svelte.dev/).
- Can be used in [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/). Should be compatible with
  [NativeWind](https://www.nativewind.dev/) and [Unistyles](https://www.unistyl.es/).
- Is compatible with
  [Barcode Detection API codes](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats).
- Is dependency-free.
- Is easy to use.

## Why you shouldn't use this library

- It has not been battle-tested yet.
- Whether the project will be developed further depends on my willingness to work.

## Idea

Among the libraries available on [NPM](https://www.npmjs.com/), none met my needs. Some lacked
[tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking), others required complex configurations
just to generate decent looking SVG, and some applied colors that couldn’t be easily overridden with Tailwind. So, I
decided to create my own library.

## Where it can be used

I see potential in applications related to [loyalty cards](https://en.wikipedia.org/wiki/Loyalty_program). Generating
codes on the client side can slightly reduce the load on servers.

## Usage

#### Common

```ts
import TsBarcodeGenerator from "simple-barcode-generator";

const barcode = TsBarcodeGenerator.generate("7423522549551", "ean_13");

console.log(barcode);
```

#### React + TailwindCSS

```ts
import TsBarcodeGenerator from "simple-barcode-generator";

export const YourComponent = () => {
  const barcode = TsBarcodeGenerator.generate("7423522549551", "ean_13");
  return (
    <div className="p-6 bg-white fill-current text-black">
      <div dangerouslySetInnerHTML={{ __html: barcode }} />
    </div>
  );
};
```

## Materials you can check before use

- [Color Selection for Barcode Symbols](https://www.barcode.graphics/upc-color-guide)
- [Barcode Symbology](https://www.scandit.com/products/barcode-scanning/symbologies)
- [Wikipedia.org/Barcode](https://en.wikipedia.org/wiki/Barcode)

## Support the project

If you see potential in this project and want to help - feel free to contribute.

You can contact me on [LinkedIn](https://www.linkedin.com/in/wasowsky/) or Discord: `avaray_`
