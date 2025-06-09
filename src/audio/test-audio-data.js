// Basic mock data for unit tests or demos
export const testSignal = new Uint8Array([
  10, 30, 50, 80, 90, 120, 150, 200,
]);

export function getTestBuckets(numBars = 8) {
  return Array.from({ length: numBars }, (_, i) => testSignal[i % testSignal.length]);
}
