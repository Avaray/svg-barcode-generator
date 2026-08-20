import code_128 from "./code_128.ts";

export default class GS1_128 {
  static generate(data: string): string {
    return code_128.generate(data, true);
  }
}
