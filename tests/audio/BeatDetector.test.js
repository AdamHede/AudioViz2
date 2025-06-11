import BeatDetector from '../../src/audio/BeatDetector.js';

describe('BeatDetector', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('detects rising energy as a beat with single energy value', () => {
    const detector = new BeatDetector();
    // Build energy history with low values
    for (let i = 0; i < 4; i++) {
      expect(detector.update(0.1, Date.now())).toBe(false);
      jest.advanceTimersByTime(16);
    }
    jest.advanceTimersByTime(16);
    expect(detector.update(0.3, Date.now())).toBe(true);
    jest.advanceTimersByTime(16);
    expect(detector.update(0.3, Date.now())).toBe(false);
  });

  test('detects rising energy as a beat with band array', () => {
    const detector = new BeatDetector(0); // No cooldown for testing
    // Fill history with low energy
    for (let i = 0; i < 60; i++) {
      detector.update([0.1, 0.1], i * 16);
    }
    const beat = detector.update([1, 1], 1000);
    expect(beat).toBe(true);
    // Next frame should not trigger due to energy dropping
    const next = detector.update([0.1, 0.1], 1010);
    expect(next).toBe(false);
  });

  test('respects cooldown period', () => {
    const detector = new BeatDetector({ cooldown: 200 });
    // Trigger first beat
    for (let i = 0; i < 50; i++) {
      detector.update(0.1, i * 16);
    }
    expect(detector.update(0.3, 800)).toBe(true);
    
    // Should not trigger again within cooldown
    expect(detector.update(0.3, 900)).toBe(false);
    
    // Should trigger after cooldown
    expect(detector.update(0.3, 1100)).toBe(true);
  });
});