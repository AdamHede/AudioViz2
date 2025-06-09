import mapFftToVisuals from '../../src/render/mapFftToVisuals.js';

describe('mapFftToVisuals', () => {
  test('maps mid-band energy correctly', () => {
    const input = [0, 0, 255, 255, 0, 0];
    const result = mapFftToVisuals(input, 3);
    expect(result).toEqual([0, 1, 0]);
  });

  test('handles silent input', () => {
    const result = mapFftToVisuals([0, 0, 0, 0], 2);
    expect(result).toEqual([0, 0]);
  });

  test('handles maxed out input', () => {
    const input = new Array(4).fill(255);
    const result = mapFftToVisuals(input, 2);
    expect(result).toEqual([1, 1]);
  });
});
