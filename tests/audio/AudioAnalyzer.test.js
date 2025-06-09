import AudioAnalyzer from '../../src/audio/AudioAnalyzer.js';

describe('AudioAnalyzer', () => {
  test('default config', () => {
    const ctx = {
      createAnalyser: jest.fn(() => ({
        fftSize: 0,
        getByteFrequencyData: jest.fn(),
        connect: jest.fn(),
        frequencyBinCount: 1024,
      })),
    };
    const analyzer = new AudioAnalyzer(ctx, 8);
    expect(ctx.createAnalyser).toHaveBeenCalled();
    expect(analyzer.analyser.fftSize).toBe(2048);
  });

  test('identifies dominant frequency 440hz', async () => {
    const sampleRate = 44100;
    const analyserNode = {
      fftSize: 2048,
      frequencyBinCount: 1024,
      connect: jest.fn(),
      getByteFrequencyData: jest.fn((arr) => {
        arr.fill(0);
        const binHz = sampleRate / 2048;
        const index = Math.round(440 / binHz);
        arr[index] = 255;
      }),
    };
    const offlineCtx = {
      createOscillator: () => ({ connect: jest.fn(), start: jest.fn() }),
      createAnalyser: () => analyserNode,
      destination: {},
    };
    const osc = offlineCtx.createOscillator();
    osc.connect(analyserNode);
    analyserNode.connect(offlineCtx.destination);
    osc.start();
    const data = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(data);
    let maxIndex = 0;
    data.forEach((v, i) => {
      if (v > data[maxIndex]) maxIndex = i;
    });
    const binHz = sampleRate / analyserNode.fftSize;
    const freq = maxIndex * binHz;
    expect(freq).toBeGreaterThan(430);
    expect(freq).toBeLessThan(450);
  });
});
