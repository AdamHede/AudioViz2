import AudioAnalyzer from '../src/audio/AudioAnalyzer.js';
import { testSignal } from '../src/audio/test-audio-data.js';

function mockContext() {
  return {
    createAnalyser() {
      return {
        fftSize: 2048,
        frequencyBinCount: testSignal.length,
        getByteFrequencyData: arr => arr.set(testSignal),
        connect: () => {},
      };
    },
    destination: {},
  };
}

test('AudioAnalyzer returns normalized values between 0 and 1', () => {
  const ctx = mockContext();
  const analyzer = new AudioAnalyzer(ctx, 8);
  analyzer.connect({ connect: () => {} });
  const bands = analyzer.getSmoothedBands();
  bands.forEach(v => {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });
});
