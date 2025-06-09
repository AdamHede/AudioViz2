import BeatDetector from '../../src/audio/BeatDetector.js';

describe('BeatDetector', () => {
  test('detects energy spike as beat and respects cooldown', () => {
    const det = new BeatDetector({ historySize: 3, threshold: 1.2, cooldown: 200 });
    // warm up history with constant energy
    expect(det.process([0.5, 0.5], 0)).toBe(false);
    expect(det.process([0.5, 0.5], 16)).toBe(false);
    expect(det.process([0.5, 0.5], 32)).toBe(false);
    // big spike
    expect(det.process([1, 1], 48)).toBe(true);
    // within cooldown
    expect(det.process([1, 1], 100)).toBe(false);
    // baseline energy to adjust average
    expect(det.process([0.4, 0.4], 200)).toBe(false);
    // after cooldown and with spike
    expect(det.process([1, 1], 300)).toBe(true);
  });
});
