import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

export default class EAN13 {
  private static readonly START_MARKER = "101";
  private static readonly MIDDLE_MARKER = "01010";
  private static readonly END_MARKER = "101";

  // Odd parity (L-code) — same as in the original
  private static readonly LEFT_ODD: { [key: string]: string } = {
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

  // Even parity (G-code) — the bitwise complement of L-code, reversed
  private static readonly LEFT_EVEN: { [key: string]: string } = {
    "0": "0100111",
    "1": "0110011",
    "2": "0011011",
    "3": "0100001",
    "4": "0011101",
    "5": "0111001",
    "6": "0000101",
    "7": "0010001",
    "8": "0001001",
    "9": "0010111",
  };

  private static readonly RIGHT_PARITY: { [key: string]: string } = {
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

  /**
   * EAN-13 left-half parity table.
   * Row index = first (system) digit. 'O' = odd (L-code), 'E' = even (G-code).
   */
  private static readonly FIRST_DIGIT_PARITY: string[] = [
    "OOOOOO", // 0
    "OOEOEE", // 1
    "OOEEOE", // 2
    "OOEEEO", // 3
    "OEOOEE", // 4
    "OEEOOE", // 5
    "OEEEOO", // 6
    "OEOEOE", // 7
    "OEOEEO", // 8
    "OEEOEO", // 9
  ];

  private static encodeLeft(digit: string, parity: "O" | "E"): string {
    return parity === "O" ? this.LEFT_ODD[digit] : this.LEFT_EVEN[digit];
  }

  private static generateBinaryRepresentation(data: string): string {
    // data is exactly 13 digits (validated before calling this)
    const firstDigit = data[0];
    const parityPattern = this.FIRST_DIGIT_PARITY[parseInt(firstDigit)];

    // Left 6 digits: positions 1–6, encoded with parity from first digit
    let leftSection = "";
    for (let i = 0; i < 6; i++) {
      const parity = parityPattern[i] as "O" | "E";
      leftSection += this.encodeLeft(data[i + 1], parity);
    }

    // Right 6 digits: positions 7–12, always RIGHT parity
    let rightSection = "";
    for (let i = 7; i <= 12; i++) {
      rightSection += this.RIGHT_PARITY[data[i]];
    }

    const QUIET_ZONE_LEFT = "00000000000"; // 11 modules
    const QUIET_ZONE_RIGHT = "0000000"; // 7 modules

    return (
      QUIET_ZONE_LEFT +
      this.START_MARKER +
      leftSection +
      this.MIDDLE_MARKER +
      rightSection +
      this.END_MARKER +
      QUIET_ZONE_RIGHT
    );
  }

  public static generate(data: string): string {
    if (!this.validate(data)) throw new Error("Invalid EAN-13 barcode");
    // Normalise to 13 digits (allow 12-digit input without check digit)
    if (data.length === 12) {
      const digits = data.split("").map(Number);
      data = data + this.calculateChecksum(digits);
    }
    const binaryRepresentation = this.generateBinaryRepresentation(data);
    const arrayRepresentation = convertBinaryStringToArray(binaryRepresentation);
    const groupedPairs = convertToPairs(arrayRepresentation);
    return generateSimpleSvg1D(groupedPairs, binaryRepresentation.length);
  }

  public static validate(data: string): boolean {
    if (!/^\d{12,13}$/.test(data)) return false;
    if (data.length === 12) return true; // 12-digit input — we compute check digit
    const digits = data.split("").map(Number);
    const checksum = this.calculateChecksum(digits.slice(0, 12));
    return checksum === digits[12];
  }

  private static calculateChecksum(digits: number[]): number {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    const mod = sum % 10;
    return mod === 0 ? 0 : 10 - mod;
  }
}
