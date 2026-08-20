import { convertBinaryStringToArray, convertToPairs, generateSimpleSvg1D } from "../utils.ts";

interface BarcodeOptions {
  text?: string;
  displayValue?: boolean;
  fontSize?: number;
  width?: number;
  height?: number;
  textMargin?: number;
}

class Barcode {
  protected data: string;
  protected text: string;
  protected options: BarcodeOptions;

  constructor(data: string, options: BarcodeOptions = {}) {
    this.data = data;
    this.text = options.text || data;
    this.options = options;
  }
}

const EXPANSIONS = [
  "XX00000XXX",
  "XX10000XXX",
  "XX20000XXX",
  "XXX00000XX",
  "XXXX00000X",
  "XXXXX00005",
  "XXXXX00006",
  "XXXXX00007",
  "XXXXX00008",
  "XXXXX00009",
];

const PARITIES = [
  ["EEEOOO", "OOOEEE"],
  ["EEOEOO", "OOEOEE"],
  ["EEOOEO", "OOEEOE"],
  ["EEOOOE", "OOEEEO"],
  ["EOEEOO", "OEOOEE"],
  ["EOOEEO", "OEEOOE"],
  ["EOOOEE", "OEEEOO"],
  ["EOEOEO", "OEOEOE"],
  ["EOEOOE", "OEOEEO"],
  ["EOOEOE", "OEEOEO"],
];

const LEFT_ENCODINGS: Record<string, string> = {
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

const EVEN_ENCODINGS: Record<string, string> = {
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

export default class UPCE extends Barcode {
  private middleDigits!: string; // Definite assignment assertion
  private upcA!: string; // Definite assignment assertion

  constructor(data: string, options: BarcodeOptions = {}) {
    super(data, options);
    this.validateAndInitialize(data);
  }

  private validateAndInitialize(data: string): void {
    if (/^[0-9]{6}$/.test(data)) {
      this.middleDigits = data;
      this.upcA = this.expandToUPCA(data, "0");
      this.text = `${this.upcA[0]}${data}${this.upcA[11]}`;
    } else if (/^[01][0-9]{7}$/.test(data)) {
      this.middleDigits = data.substring(1, 7);
      this.upcA = this.expandToUPCA(this.middleDigits, data[0]);
      if (this.upcA[11] !== data[7]) throw new Error("Checksum mismatch");
      this.text = data;
    } else {
      throw new Error("Invalid UPC-E format");
    }
  }

  static generate(data: string): string {
    const upce = new UPCE(data, { text: data });
    const binary = upce.encode();
    const fullBinary = "00000000000000000000" + binary + "00000000000000000000";
    const array = convertBinaryStringToArray(fullBinary);
    const pairs = convertToPairs(array);
    return generateSimpleSvg1D(pairs, fullBinary.length);
  }

  private encode(): string {
    const numberSystem = this.text[0];
    const checkDigit = this.text[7];
    const parity = PARITIES[parseInt(checkDigit)][parseInt(numberSystem)];

    let binary = "101"; // Start guard
    for (let i = 0; i < 6; i++) {
      const digit = this.middleDigits[i];
      // Corrected parity handling: O = left, E = right
      const encoding = parity[i] === "O" ? LEFT_ENCODINGS[digit] : EVEN_ENCODINGS[digit];
      binary += encoding;
    }
    binary += "010101"; // End guard
    return binary;
  }

  private expandToUPCA(middleDigits: string, numberSystem: string): string {
    const lastDigit = parseInt(middleDigits[5], 10);
    let upca = numberSystem;
    let digitIndex = 0;

    for (const c of EXPANSIONS[lastDigit]) {
      upca += c === "X" ? middleDigits[digitIndex++] : c;
    }

    return upca + this.calculateChecksum(upca);
  }

  private calculateChecksum(upcaPrefix: string): string {
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      sum += parseInt(upcaPrefix[i], 10) * (i % 2 === 0 ? 3 : 1);
    }
    return ((10 - (sum % 10)) % 10).toString();
  }

  static createFromPrefix(prefix: string): string {
    if (!/^[0-9]{7}$/.test(prefix)) throw new Error("Invalid 7-digit prefix");
    const expanded = new UPCE(prefix + "0", {}).expandToUPCA(
      prefix.substring(1),
      prefix[0],
    );
    return prefix + expanded[11];
  }

  valid(): boolean {
    return /^[01][0-9]{7}$/.test(this.data) && this.data === this.text;
  }
}
