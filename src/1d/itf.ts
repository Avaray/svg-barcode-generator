import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class ITF {
  // Constants
  private static readonly QUIET_ZONE = "0000000000"; // 10 modules of space
  private static readonly START_CODE = "1010"; // Narrow bar, space, bar, space
  private static readonly STOP_CODE = "1101"; // Wide bar (2), narrow space, narrow bar
  private static readonly BAR_PATTERNS: { [key: string]: number[] } = {
    "0": [1, 1, 2, 2, 1], // NNWWN
    "1": [2, 1, 1, 1, 2], // WNNNW
    "2": [1, 2, 1, 1, 2], // NWNNW
    "3": [2, 2, 1, 1, 1], // WWNNN
    "4": [1, 1, 2, 1, 2], // NNWNW
    "5": [2, 1, 2, 1, 1], // WNWNN
    "6": [1, 2, 2, 1, 1], // NWWNN
    "7": [1, 1, 1, 2, 2], // NNNWW
    "8": [2, 1, 1, 2, 1], // WNNWN
    "9": [1, 2, 1, 2, 1], // NWNWN
  };

  // Generate the SVG barcode
  static generate(data: string): string {
    if (!this.validate(data)) {
      throw new Error("Invalid ITF format. Must be numeric.");
    }

    // Ensure even number of digits by adding leading zero if necessary
    const encodedData = data.length % 2 === 0 ? data : "0" + data;

    // Build the binary string
    let binary = this.QUIET_ZONE + this.START_CODE;
    for (let i = 0; i < encodedData.length; i += 2) {
      const d1 = encodedData[i];
      const d2 = encodedData[i + 1];
      binary += this.encodePair(d1, d2);
    }
    binary += this.STOP_CODE + this.QUIET_ZONE;

    // Convert to SVG using utility functions
    const array = convertBinaryStringToArray(binary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, binary.length);
  }

  // Encode a pair of digits into a binary string
  private static encodePair(d1: string, d2: string): string {
    const barWidths = this.BAR_PATTERNS[d1];
    const spaceWidths = this.BAR_PATTERNS[d2];
    let binary = "";
    for (let i = 0; i < 5; i++) {
      binary += "1".repeat(barWidths[i]); // Bar modules
      binary += "0".repeat(spaceWidths[i]); // Space modules
    }
    return binary;
  }

  // Validate that the input is numeric
  static validate(data: string): boolean {
    return /^\d+$/.test(data);
  }
}
