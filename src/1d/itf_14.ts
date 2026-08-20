import { convertBinaryStringToArray, convertToPairs } from "../utils.ts";

export default class ITF_14 {
  private static readonly QUIET_ZONE = "0000000000"; // 10 modules of space
  private static readonly START_CODE = "1010";
  private static readonly STOP_CODE = "1101";
  private static readonly BAR_PATTERNS: { [key: string]: number[] } = {
    "0": [1, 1, 2, 2, 1],
    "1": [2, 1, 1, 1, 2],
    "2": [1, 2, 1, 1, 2],
    "3": [2, 2, 1, 1, 1],
    "4": [1, 1, 2, 1, 2],
    "5": [2, 1, 2, 1, 1],
    "6": [1, 2, 2, 1, 1],
    "7": [1, 1, 1, 2, 2],
    "8": [2, 1, 1, 2, 1],
    "9": [1, 2, 1, 2, 1],
  };

  static generate(data: string): string {
    if (!/^\d+$/.test(data)) {
      throw new Error("Invalid ITF-14 format. Must be numeric.");
    }

    let encodedData = data;

    if (encodedData.length === 13) {
      // Calculate Mod 10 check digit
      encodedData += this.calculateCheckDigit(encodedData);
    } else if (encodedData.length !== 14) {
      // Pad to 14 digits with leading zeros
      encodedData = encodedData.padStart(14, "0");
    }

    let binary = this.QUIET_ZONE + this.START_CODE;
    for (let i = 0; i < encodedData.length; i += 2) {
      binary += this.encodePair(encodedData[i], encodedData[i + 1]);
    }
    binary += this.STOP_CODE + this.QUIET_ZONE;

    const array = convertBinaryStringToArray(binary);
    const pairs = convertToPairs(array);
    const totalModules = binary.length;

    // Bearer bar standard thickness is roughly 4.8 * module width.
    // Let's use 5 modules thickness.
    // SVG total height is typically 100%. Bearer bars take top and bottom.
    // But since percentages are easier, we can just draw them.
    // However, SVG percentage height doesn't allow fixed module width unless viewBox is used.
    // We'll just draw top and bottom rects occupying some vertical percentage.

    const widthPerUnit = 100 / totalModules;
    
    // Draw the main barcode rects in the center
    const rectangles = pairs.map(([position, width]) => {
      const x = (position * widthPerUnit).toFixed(3);
      const w = (width * widthPerUnit).toFixed(3);
      return `<rect x="${x}%" y="10%" width="${w}%" height="80%"/>`;
    });

    // Add horizontal Bearer Bars
    // Top border
    rectangles.push(`<rect x="0" y="0" width="100%" height="10%"/>`);
    // Bottom border
    rectangles.push(`<rect x="0" y="90%" width="100%" height="10%"/>`);

    return `<svg width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rectangles.join("")}</svg>`;
  }

  private static encodePair(d1: string, d2: string): string {
    const barWidths = this.BAR_PATTERNS[d1];
    const spaceWidths = this.BAR_PATTERNS[d2];
    let binary = "";
    for (let i = 0; i < 5; i++) {
      binary += "1".repeat(barWidths[i]);
      binary += "0".repeat(spaceWidths[i]);
    }
    return binary;
  }

  private static calculateCheckDigit(data: string): string {
    let sum = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      const num = parseInt(data[i], 10);
      sum += (data.length - i) % 2 !== 0 ? num * 3 : num;
    }
    const remainder = sum % 10;
    return remainder === 0 ? "0" : (10 - remainder).toString();
  }
}
