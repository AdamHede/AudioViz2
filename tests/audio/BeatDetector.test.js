import BeatDetector from '../../src/audio/BeatDetector.js';

describe('BeatDetector', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('detects rising energy with cooldown', () => {
    const detector = new BeatDetector({ historySize: 4, threshold: 1.5, cooldown: 200 });
    for (let i = 0; i < 4; i++) {
      expect(detector.update(0.1, Date.now())).toBe(false);
      jest.advanceTimersByTime(16);
    }
    jest.advanceTimersByTime(16);
    expect(detector.update(0.3, Date.now())).toBe(true);
    jest.advanceTimersByTime(16);
    expect(detector.update(0.3, Date.now())).toBe(false);
  });
});
