import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class Codabar {
  private static readonly CHARACTER_ENCODINGS: { [key: string]: string } = {
    "0": "101010011",
    "1": "101011001",
    "2": "101001011",
    "3": "110010101",
    "4": "101101001",
    "5": "110101001",
    "6": "100101011",
    "7": "100101101",
    "8": "100110101",
    "9": "110100101",
    "-": "101001101",
    "$": "101100101",
    ":": "1101010011",
    "/": "1101001011",
    ".": "1101001101",
    "+": "101100110011",
    "A": "1011001001",
    "B": "1001001011",
    "C": "1010010011",
    "D": "1010011001",
  };

  private static readonly QUIET_ZONE = "0000000000";
  private static readonly INTERCHAR_GAP = "0";

  static generate(data: string): string {
    if (!this.validate(data)) {
      throw new Error("Invalid Codabar format. Must start/end with A-D and contain valid characters.");
    }
    const binary = this.generateBinary(data);
    const array = convertBinaryStringToArray(binary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, binary.length);
  }

  private static generateBinary(data: string): string {
    let binary = this.QUIET_ZONE; // Start with left quiet zone

    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      binary += this.CHARACTER_ENCODINGS[char];
      if (i !== data.length - 1) {
        binary += this.INTERCHAR_GAP;
      }
    }

    binary += this.QUIET_ZONE; // End with right quiet zone
    return binary;
  }

  static validate(data: string): boolean {
    const validChars = new Set(Object.keys(this.CHARACTER_ENCODINGS));
    const validStartEnd = new Set(["A", "B", "C", "D"]);

    return data.length >= 2 &&
      validStartEnd.has(data[0]) &&
      validStartEnd.has(data[data.length - 1]) &&
      Array.from(data).every((c) => validChars.has(c));
  }
}
