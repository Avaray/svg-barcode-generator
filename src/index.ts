import upc_e from "./1d/upc_e.ts";
import ean_13 from "./1d/ean_13.ts";
import ean_8 from "./1d/ean_8.ts";
import code_128 from "./1d/code_128.ts";
import code_93 from "./1d/code_93.ts";
import code_39 from "./1d/code_39.ts";
import codabar from "./1d/codabar.ts";
import itf from "./1d/itf.ts";
import itf_14 from "./1d/itf_14.ts";
import gs1_128 from "./1d/gs1_128.ts";
import msi from "./1d/msi.ts";
import pharmacode from "./1d/pharmacode.ts";

type CodeTypes = "upc_a" | "upc_e" | "ean_13" | "ean_8" | "code_128" | "code_93" | "code_39" | "codabar" | "itf" | "itf_14" | "gs1_128" | "msi" | "pharmacode";

export default class TsBarcodeGenerator {
  public static generate(code: string, type: CodeTypes): string {
    switch (type) {
      case "upc_e":
        return upc_e.generate(code);
      case "upc_a":
      case "ean_13":
        return ean_13.generate(code);
      case "ean_8":
        return ean_8.generate(code);
      case "code_128":
        return code_128.generate(code);
      case "code_93":
        return code_93.generate(code);
      case "code_39":
        return code_39.generate(code);
      case "codabar":
        return codabar.generate(code);
      case "itf":
        return itf.generate(code);
      case "itf_14":
        return itf_14.generate(code);
      case "gs1_128":
        return gs1_128.generate(code);
      case "msi":
        return msi.generate(code);
      case "pharmacode":
        return pharmacode.generate(code);
      default:
        throw new Error(`Unsupported barcode type: ${type}`);
    }
  }
}
