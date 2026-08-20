import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class MSI {
  private static readonly START = "110";
  private static readonly STOP = "1001";
  
  static generate(data: string): string {
    if (!/^\d+$/.test(data)) {
      throw new Error("Invalid MSI Plessey format. Must be numeric.");
    }

    let binary = this.START;

    for (const char of data) {
      const num = parseInt(char, 10);
      let bits = num.toString(2).padStart(4, "0");
      // Map each bit: 0 -> 100, 1 -> 110
      for (const bit of bits) {
        binary += bit === "0" ? "100" : "110";
      }
    }

    binary += this.STOP;

    const QUIET_ZONE = "0000000000"; // 10 modules
    const fullBinary = QUIET_ZONE + binary + QUIET_ZONE;

    const array = convertBinaryStringToArray(fullBinary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, fullBinary.length);
  }
}
