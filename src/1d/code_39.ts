import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class Code39 {
  private static readonly CHARACTER_ENCODINGS: { [key: string]: string } = {
    "0": "101001101101",
    "1": "110100101011",
    "2": "101100101011",
    "3": "110110010101",
    "4": "101001101011",
    "5": "110100110101",
    "6": "101100110101",
    "7": "101001011011",
    "8": "110100101101",
    "9": "101100101101",
    "A": "110101001011",
    "B": "101101001011",
    "C": "110110100101",
    "D": "101011001011",
    "E": "110101100101",
    "F": "101101100101",
    "G": "101010011011",
    "H": "110101001101",
    "I": "101101001101",
    "J": "101011001101",
    "K": "110101010011",
    "L": "101101010011",
    "M": "110110101001",
    "N": "101011010011",
    "O": "110101101001",
    "P": "101101101001",
    "Q": "101010110011",
    "R": "110101011001",
    "S": "101101011001",
    "T": "101011011001",
    "U": "110010101011",
    "V": "100110101011",
    "W": "110011010101",
    "X": "100101101011",
    "Y": "110010110101",
    "Z": "100110110101",
    "-": "100101011011",
    ".": "110010101101",
    " ": "100110101101",
    "$": "100100100101",
    "/": "100100101001",
    "+": "100101001001",
    "%": "101001001001",
    "*": "100101101101", // Start/Stop character
  };

  private static generateBinaryRepresentation(data: string): string {
    const QUIET_ZONE = "0000000000"; // 10 narrow modules each side (standard minimum)
    // Add start/stop characters
    const fullData = `*${data}*`;

    let binary = QUIET_ZONE;
    for (const char of fullData) {
      const encoding = this.CHARACTER_ENCODINGS[char];
      if (!encoding) {
        throw new Error(`Invalid character in Code 39: ${char}`);
      }
      binary += encoding + "0"; // Add inter-character gap
    }

    // Remove last extra gap and add trailing quiet zone
    return binary.slice(0, -1) + QUIET_ZONE;
  }

  public static generate(data: string): string {
    if (!this.validate(data)) {
      throw new Error("Invalid Code 39 barcode data");
    }

    const binary = this.generateBinaryRepresentation(data.toUpperCase());
    const array = convertBinaryStringToArray(binary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, binary.length);
  }

  public static validate(data: string): boolean {
    const validChars = new Set(Object.keys(this.CHARACTER_ENCODINGS));
    // Explicitly disallow asterisk in data
    validChars.delete("*");

    return data.toUpperCase().split("").every((char) => validChars.has(char) && char !== "*");
  }
}
