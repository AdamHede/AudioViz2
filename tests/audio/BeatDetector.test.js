import BeatDetector from '../../src/audio/BeatDetector.js';

describe('BeatDetector', () => {
  test('detects spikes and respects cooldown', () => {
    const times = [0, 100, 200, 400];
    let idx = 0;
    const detector = new BeatDetector({ historySize: 3, threshold: 1.2, cooldown: 300, timeFn: () => times[idx++] });

    expect(detector.update([0, 0, 0])).toBe(false); // initial silence
    expect(detector.update([1, 1, 1])).toBe(true);  // first spike triggers
    expect(detector.update([0, 0, 0])).toBe(false); // low energy
    expect(detector.update([1, 1, 1])).toBe(true);  // second spike after cooldown
  });
});
