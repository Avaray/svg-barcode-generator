import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class EAN8 {
  private static readonly LEFT_ENCODINGS: { [key: string]: string } = {
    "0": "0001101",
    "1": "0011001",
    "2": "0010011",
    "3": "0111101",
    "4": "0100011",
    "5": "0110001",
    "6": "0101111",
    "7": "0111011",
    "8": "0110111",
    "9": "0001011",
  };

  private static readonly RIGHT_ENCODINGS: { [key: string]: string } = {
    "0": "1110010",
    "1": "1100110",
    "2": "1101100",
    "3": "1000010",
    "4": "1011100",
    "5": "1001110",
    "6": "1010000",
    "7": "1000100",
    "8": "1001000",
    "9": "1110100",
  };

  private static readonly GUARD_PATTERN = "101";
  private static readonly CENTER_GUARD_PATTERN = "01010";

  static generate(data: string): string {
    if (!this.validate(data)) {
      throw new Error("Invalid EAN-8 input. Must be 8 digits with valid check digit.");
    }

    const binary = this.generateBinary(data);
    const array = convertBinaryStringToArray(binary);
    const pairs = convertToPairs(array);

    return generateSimpleSvg1D(pairs, binary.length);
  }

  private static generateBinary(data: string): string {
    const QUIET_ZONE = "0000000"; // Minimum 7 modules quiet zone for EAN
    let binary = QUIET_ZONE + this.GUARD_PATTERN;

    // First 4 digits (left side)
    for (let i = 0; i < 4; i++) {
      binary += this.LEFT_ENCODINGS[data[i]];
    }

    binary += this.CENTER_GUARD_PATTERN;

    // Last 4 digits (right side)
    for (let i = 4; i < 8; i++) {
      binary += this.RIGHT_ENCODINGS[data[i]];
    }

    binary += this.GUARD_PATTERN + QUIET_ZONE;

    return binary;
  }

  private static calculateCheckDigit(data: string): string {
    let sum = 0;

    for (let i = 0; i < 7; i++) {
      const digit = parseInt(data[i], 10);
      const weight = (i % 2 === 0) ? 3 : 1;
      sum += digit * weight;
    }

    const remainder = sum % 10;
    return ((10 - remainder) % 10).toString();
  }

  static validate(data: string): boolean {
    if (data.length !== 8 || !/^\d{8}$/.test(data)) return false;

    const checkDigit = parseInt(data[7], 10);
    return checkDigit === parseInt(this.calculateCheckDigit(data), 10);
  }

  static createFromPrefix(prefix: string): string {
    if (prefix.length !== 7 || !/^\d{7}$/.test(prefix)) {
      throw new Error("Prefix must be exactly 7 digits");
    }
    return prefix + this.calculateCheckDigit(prefix);
  }
}
