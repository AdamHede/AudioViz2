import mapSensitivityToThreshold from '../../src/audio/mapSensitivityToThreshold.js';

describe('mapSensitivityToThreshold', () => {
  test('returns Infinity for 0 sensitivity', () => {
    const result = mapSensitivityToThreshold(0);
    expect(result).toBe(Infinity);
  });

  test('returns 0 for 100 sensitivity', () => {
    const result = mapSensitivityToThreshold(100);
    expect(result).toBe(0);
  });

  test('scales linearly in between', () => {
    const result = mapSensitivityToThreshold(50);
    expect(result).toBeCloseTo(0.65);
  });
});
