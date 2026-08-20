import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class Pharmacode {
  static generate(data: string): string {
    if (!/^\d+$/.test(data)) {
      throw new Error("Invalid Pharmacode format. Must be numeric.");
    }

    let value = parseInt(data, 10);
    if (value < 3 || value > 131070) {
      throw new Error("Pharmacode value must be between 3 and 131070.");
    }

    let binary = "";
    while (value > 0) {
      if (value % 2 === 0) {
        binary = "110" + binary; // Thick bar + space
        value = (value - 2) / 2;
      } else {
        binary = "10" + binary;  // Thin bar + space
        value = (value - 1) / 2;
      }
    }

    // Remove the trailing space
    binary = binary.slice(0, -1);

    const QUIET_ZONE = "00000"; // Standard padding
    const fullBinary = QUIET_ZONE + binary + QUIET_ZONE;

    const array = convertBinaryStringToArray(fullBinary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, fullBinary.length);
  }
}
