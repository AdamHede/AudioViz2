import BeatDetector from '../../src/audio/BeatDetector.js';

describe('BeatDetector', () => {
  test('detects rising energy as a beat', () => {
    const detector = new BeatDetector(0);
    // Fill history with low energy
    for (let i = 0; i < 60; i++) {
      detector.update([0.1, 0.1], i * 16);
    }
    const beat = detector.update([1, 1], 1000);
    expect(beat).toBe(true);
    // Immediately following frame should not trigger due to cooldown 0? Actually 0 -> not; but we set 0 to disable so we expect true again when energy still high
    const next = detector.update([0.1, 0.1], 1010);
    expect(next).toBe(false);
  });
});
