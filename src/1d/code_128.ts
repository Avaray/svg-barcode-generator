import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

// CODE128.ts
interface CodeSet {
  [key: string]: { value: number; pattern: string };
}

export default class CODE128 {
  private static readonly CODE128_A: CodeSet = {
    "\u00C8": { value: 0, pattern: "11011001100" }, // NUL
    "\u00C9": { value: 1, pattern: "11001101100" }, // SOH
    "\u00CA": { value: 2, pattern: "11001100110" }, // STX
    "\u00CB": { value: 3, pattern: "10010011000" }, // ETX
    "\u00CC": { value: 4, pattern: "10010001100" }, // EOT
    "\u00CD": { value: 5, pattern: "10001001100" }, // ENQ
    "\u00CE": { value: 6, pattern: "10011001000" }, // ACK
    "\u00CF": { value: 7, pattern: "10011000100" }, // BEL
    "\u00D0": { value: 8, pattern: "10001100100" }, // BS
    "\u00D1": { value: 9, pattern: "11001001000" }, // HT
    "\u00D2": { value: 10, pattern: "11001000100" }, // LF
    "\u00D3": { value: 11, pattern: "11000100100" }, // VT
    "\u00D4": { value: 12, pattern: "10110011100" }, // FF
    "\u00D5": { value: 13, pattern: "10011011100" }, // CR
    "\u00D6": { value: 14, pattern: "10011001110" }, // SO
    "\u00D7": { value: 15, pattern: "10111001100" }, // SI
    "\u00D8": { value: 16, pattern: "10011101100" }, // DLE
    "\u00D9": { value: 17, pattern: "10011100110" }, // DC1
    "\u00DA": { value: 18, pattern: "11001110010" }, // DC2
    "\u00DB": { value: 19, pattern: "11001011100" }, // DC3
    "\u00DC": { value: 20, pattern: "11001001110" }, // DC4
    "\u00DD": { value: 21, pattern: "11011100100" }, // NAK
    "\u00DE": { value: 22, pattern: "11001110100" }, // SYN
    "\u00DF": { value: 23, pattern: "11101101110" }, // ETB
    "\u00E0": { value: 24, pattern: "11101001100" }, // CAN
    "\u00E1": { value: 25, pattern: "11100101100" }, // EM
    "\u00E2": { value: 26, pattern: "11100100110" }, // SUB
    "\u00E3": { value: 27, pattern: "11101100100" }, // ESC
    "\u00E4": { value: 28, pattern: "11100110100" }, // FS
    "\u00E5": { value: 29, pattern: "11100110010" }, // GS
    "\u00E6": { value: 30, pattern: "11011011000" }, // RS
    "\u00E7": { value: 31, pattern: "11011000110" }, // US
    " ": { value: 32, pattern: "11000110110" },
    "!": { value: 33, pattern: "10100011000" },
    '"': { value: 34, pattern: "10001011000" },
    "#": { value: 35, pattern: "10001000110" },
    "$": { value: 36, pattern: "10110001000" },
    "%": { value: 37, pattern: "10001101000" },
    "&": { value: 38, pattern: "10001100010" },
    "'": { value: 39, pattern: "11010001000" },
    "(": { value: 40, pattern: "11000101000" },
    ")": { value: 41, pattern: "11000100010" },
    "*": { value: 42, pattern: "10110111000" },
    "+": { value: 43, pattern: "10110001110" },
    ",": { value: 44, pattern: "10001101110" },
    "-": { value: 45, pattern: "10111011000" },
    ".": { value: 46, pattern: "10111000110" },
    "/": { value: 47, pattern: "10001110110" },
    "0": { value: 48, pattern: "11101110110" },
    "1": { value: 49, pattern: "11010001110" },
    "2": { value: 50, pattern: "11000101110" },
    "3": { value: 51, pattern: "11011101000" },
    "4": { value: 52, pattern: "11011100010" },
    "5": { value: 53, pattern: "11011101110" },
    "6": { value: 54, pattern: "11101011000" },
    "7": { value: 55, pattern: "11101000110" },
    "8": { value: 56, pattern: "11100010110" },
    "9": { value: 57, pattern: "11101101000" },
    ":": { value: 58, pattern: "11101100010" },
    ";": { value: 59, pattern: "11100011010" },
    "<": { value: 60, pattern: "11101111010" },
    "=": { value: 61, pattern: "11001000010" },
    ">": { value: 62, pattern: "11110001010" },
    "?": { value: 63, pattern: "10100110000" },
    "@": { value: 64, pattern: "10100001100" },
    "A": { value: 65, pattern: "10010110000" },
    "B": { value: 66, pattern: "10010000110" },
    "C": { value: 67, pattern: "10000101100" },
    "D": { value: 68, pattern: "10000100110" },
    "E": { value: 69, pattern: "10110010000" },
    "F": { value: 70, pattern: "10110000100" },
    "G": { value: 71, pattern: "10011010000" },
    "H": { value: 72, pattern: "10011000010" },
    "I": { value: 73, pattern: "10000110100" },
    "J": { value: 74, pattern: "10000110010" },
    "K": { value: 75, pattern: "11000010010" },
    "L": { value: 76, pattern: "11001010000" },
    "M": { value: 77, pattern: "11110111010" },
    "N": { value: 78, pattern: "11000010100" },
    "O": { value: 79, pattern: "10001111010" },
    "P": { value: 80, pattern: "10100111100" },
    "Q": { value: 81, pattern: "10010111100" },
    "R": { value: 82, pattern: "10010011110" },
    "S": { value: 83, pattern: "10111100100" },
    "T": { value: 84, pattern: "10011110100" },
    "U": { value: 85, pattern: "10011110010" },
    "V": { value: 86, pattern: "11110100100" },
    "W": { value: 87, pattern: "11110010100" },
    "X": { value: 88, pattern: "11110010010" },
    "Y": { value: 89, pattern: "11011011110" },
    "Z": { value: 90, pattern: "11011110110" },
    "[": { value: 91, pattern: "11110110110" },
    "\\": { value: 92, pattern: "10101111000" },
    "]": { value: 93, pattern: "10100011110" },
    "^": { value: 94, pattern: "10001011110" },
    "_": { value: 95, pattern: "10111101000" },
  };

  private static readonly CODE128_B: CodeSet = {
    " ": { value: 0, pattern: "11011001100" },
    "!": { value: 1, pattern: "11001101100" },
    '"': { value: 2, pattern: "11001100110" },
    "#": { value: 3, pattern: "10010011000" },
    "$": { value: 4, pattern: "10010001100" },
    "%": { value: 5, pattern: "10001001100" },
    "&": { value: 6, pattern: "10011001000" },
    "'": { value: 7, pattern: "10011000100" },
    "(": { value: 8, pattern: "10001100100" },
    ")": { value: 9, pattern: "11001001000" },
    "*": { value: 10, pattern: "11001000100" },
    "+": { value: 11, pattern: "11000100100" },
    ",": { value: 12, pattern: "10110011100" },
    "-": { value: 13, pattern: "10011011100" },
    ".": { value: 14, pattern: "10011001110" },
    "/": { value: 15, pattern: "10111001100" },
    "0": { value: 16, pattern: "10011101100" },
    "1": { value: 17, pattern: "10011100110" },
    "2": { value: 18, pattern: "11001110010" },
    "3": { value: 19, pattern: "11001011100" },
    "4": { value: 20, pattern: "11001001110" },
    "5": { value: 21, pattern: "11011100100" },
    "6": { value: 22, pattern: "11001110100" },
    "7": { value: 23, pattern: "11101101110" },
    "8": { value: 24, pattern: "11101001100" },
    "9": { value: 25, pattern: "11100101100" },
    ":": { value: 26, pattern: "11100100110" },
    ";": { value: 27, pattern: "11101100100" },
    "<": { value: 28, pattern: "11100110100" },
    "=": { value: 29, pattern: "11100110010" },
    ">": { value: 30, pattern: "11011011000" },
    "?": { value: 31, pattern: "11011000110" },
    "@": { value: 32, pattern: "11000110110" },
    "A": { value: 33, pattern: "10100011000" },
    "B": { value: 34, pattern: "10001011000" },
    "C": { value: 35, pattern: "10001000110" },
    "D": { value: 36, pattern: "10110001000" },
    "E": { value: 37, pattern: "10001101000" },
    "F": { value: 38, pattern: "10001100010" },
    "G": { value: 39, pattern: "11010001000" },
    "H": { value: 40, pattern: "11000101000" },
    "I": { value: 41, pattern: "11000100010" },
    "J": { value: 42, pattern: "10110111000" },
    "K": { value: 43, pattern: "10110001110" },
    "L": { value: 44, pattern: "10001101110" },
    "M": { value: 45, pattern: "10111011000" },
    "N": { value: 46, pattern: "10111000110" },
    "O": { value: 47, pattern: "10001110110" },
    "P": { value: 48, pattern: "11101110110" },
    "Q": { value: 49, pattern: "11010001110" },
    "R": { value: 50, pattern: "11000101110" },
    "S": { value: 51, pattern: "11011101000" },
    "T": { value: 52, pattern: "11011100010" },
    "U": { value: 53, pattern: "11011101110" },
    "V": { value: 54, pattern: "11101011000" },
    "W": { value: 55, pattern: "11101000110" },
    "X": { value: 56, pattern: "11100010110" },
    "Y": { value: 57, pattern: "11101101000" },
    "Z": { value: 58, pattern: "11101100010" },
    "[": { value: 59, pattern: "11100011010" },
    "\\": { value: 60, pattern: "11101111010" },
    "]": { value: 61, pattern: "11001000010" },
    "^": { value: 62, pattern: "11110001010" },
    "_": { value: 63, pattern: "10100110000" },
    "`": { value: 64, pattern: "10100001100" },
    "a": { value: 65, pattern: "10010110000" },
    "b": { value: 66, pattern: "10010000110" },
    "c": { value: 67, pattern: "10000101100" },
    "d": { value: 68, pattern: "10000100110" },
    "e": { value: 69, pattern: "10110010000" },
    "f": { value: 70, pattern: "10110000100" },
    "g": { value: 71, pattern: "10011010000" },
    "h": { value: 72, pattern: "10011000010" },
    "i": { value: 73, pattern: "10000110100" },
    "j": { value: 74, pattern: "10000110010" },
    "k": { value: 75, pattern: "11000010010" },
    "l": { value: 76, pattern: "11001010000" },
    "m": { value: 77, pattern: "11110111010" },
    "n": { value: 78, pattern: "11000010100" },
    "o": { value: 79, pattern: "10001111010" },
    "p": { value: 80, pattern: "10100111100" },
    "q": { value: 81, pattern: "10010111100" },
    "r": { value: 82, pattern: "10010011110" },
    "s": { value: 83, pattern: "10111100100" },
    "t": { value: 84, pattern: "10011110100" },
    "u": { value: 85, pattern: "10011110010" },
    "v": { value: 86, pattern: "11110100100" },
    "w": { value: 87, pattern: "11110010100" },
    "x": { value: 88, pattern: "11110010010" },
    "y": { value: 89, pattern: "11011011110" },
    "z": { value: 90, pattern: "11011110110" },
    "{": { value: 91, pattern: "11110110110" },
    "|": { value: 92, pattern: "10101111000" },
    "}": { value: 93, pattern: "10100011110" },
    "~": { value: 94, pattern: "10001011110" },
    "\u007F": { value: 95, pattern: "10111101000" }, // DEL
  };

  private static readonly CODE128_C: CodeSet = {};
  private static readonly START_A = "11010000100";
  private static readonly START_B = "11010010000";
  private static readonly START_C = "11010011100";
  private static readonly STOP_PATTERN = "1100011101011";

  static generate(data: string, useGS1: boolean = false): string {
    const { startCode, encodedData, checksum } = this.autoEncode(data, useGS1);
    const QUIET_ZONE = "0000000000"; // 10 modules each side (Code-128 standard)
    const binary = [
      QUIET_ZONE,
      startCode.pattern,
      ...encodedData.map((c) => c.pattern),
      this.getPatternForValue(checksum),
      this.STOP_PATTERN,
      QUIET_ZONE,
    ].join("");

    return generateSimpleSvg1D(convertToPairs(convertBinaryStringToArray(binary)), binary.length);
  }

  private static autoEncode(data: string, useGS1: boolean): {
    startCode: { value: number; pattern: string };
    encodedData: { value: number; pattern: string }[];
    checksum: number;
  } {
    if (/^\d{2,}$/.test(data) && data.length % 2 === 0) {
      return this.encodeC(data, useGS1);
    }
    return this.encodeB(data, useGS1);
  }

  private static encodeB(data: string, useGS1: boolean) {
    const start = { value: 104, pattern: this.START_B };
    let sum = start.value;
    const encoded = [];
    
    let position = 1;
    if (useGS1) {
      const fnc1 = { value: 102, pattern: "11110101110" };
      sum += fnc1.value * position++;
      encoded.push(fnc1);
    }

    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const entry = this.CODE128_B[char];
      if (!entry) throw new Error(`Invalid CODE128-B character: ${char}`);

      sum += entry.value * position++;
      encoded.push(entry);
    }

    const checksum = sum % 103;
    return { startCode: start, encodedData: encoded, checksum };
  }

  private static encodeC(data: string, useGS1: boolean) {
    const start = { value: 105, pattern: this.START_C };
    let sum = start.value;
    const encoded = [];

    let position = 1;
    if (useGS1) {
      const fnc1 = { value: 102, pattern: "11110101110" };
      sum += fnc1.value * position++;
      encoded.push(fnc1);
    }

    for (let i = 0; i < data.length; i += 2) {
      const pair = data.substr(i, 2);
      const value = parseInt(pair, 10);
      const pattern = this.getPatternForValue(value);

      sum += value * position++;
      encoded.push({ value, pattern });
    }

    const checksum = sum % 103;
    return { startCode: start, encodedData: encoded, checksum };
  }

  private static readonly MISSING_PATTERNS: { [key: number]: string } = {
    96: "10111100010",
    97: "11110101000",
    98: "11110100010",
    99: "10111011110",
    100: "10111101110",
    101: "11101011110",
    102: "11110101110",
  };

  private static getPatternForValue(value: number): string {
    if (this.MISSING_PATTERNS[value]) {
      return this.MISSING_PATTERNS[value];
    }
    // Search all code sets for the value
    const find = (set: CodeSet) => Object.entries(set).find(([, entry]) => entry.value === value);

    return find(this.CODE128_A)?.[1].pattern ||
      find(this.CODE128_B)?.[1].pattern ||
      find(this.CODE128_C)?.[1].pattern ||
      this.STOP_PATTERN;
  }
}
