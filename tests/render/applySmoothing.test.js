import applySmoothing from '../../src/render/applySmoothing.js';

describe('applySmoothing', () => {
  test('interpolates between values', () => {
    expect(applySmoothing(0, 1, 0.5)).toBeCloseTo(0.5);
    expect(applySmoothing(1, 0, 0.2)).toBeCloseTo(0.8);
  });
});
