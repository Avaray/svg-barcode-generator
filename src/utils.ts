export function convertBinaryStringToArray(binaryString: string): number[] {
  return binaryString.split("").map((char) => parseInt(char, 10));
}

// Basically this function takes an array of 1s and 0s and converts it to an array of arrays of pairs of numbers.
// Each pair represents a bar of a certain width. Each pair will be one <rect> element in the SVG.
// input: [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1]
// output: [ [ 0, 5 ], [ 9, 2 ], [ 12, 1 ], [ 15, 3 ] ]
export function convertToPairs(bars: number[]): [number, number][] {
  const pairs: [number, number][] = [];
  let start: number | null = null;

  bars.forEach((value, index) => {
    if (value === 1) {
      if (start === null) start = index;
    } else if (start !== null) {
      pairs.push([start, index - start]);
      start = null;
    }
  });

  if (start !== null) {
    pairs.push([start, bars.length - start]);
  }

  return pairs;
}

/**
 * Generates a minimal SVG containing only black bars (rects).
 * White space is implied by the gaps between rects.
 *
 * @param groupedPairs  Output of convertToPairs — [startModule, widthModules][]
 * @param totalModules  Total number of modules in the binary string (incl. quiet zones).
 *                      When provided, percentages are calculated against this value so
 *                      leading and trailing quiet zones are preserved correctly.
 *                      Defaults to the end of the last bar when omitted.
 */
export function generateSimpleSvg1D(
  groupedPairs: [number, number][],
  totalModules?: number,
): string {
  const maxWidth =
    totalModules ??
    groupedPairs.reduce((max, [pos, width]) => Math.max(max, pos + width), 0);

  const widthPerUnit = 100 / maxWidth;

  const rectangles = groupedPairs.map(([position, width]) => {
    const x = (position * widthPerUnit).toFixed(3);
    const w = (width * widthPerUnit).toFixed(3);
    return `<rect x="${x}%" width="${w}%" height="100%"/>`;
  });

  return `<svg width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${
    rectangles.join("")
  }</svg>`;
}
