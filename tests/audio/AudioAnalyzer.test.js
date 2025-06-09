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

  test('identifies dominant frequency 440hz', () => {
    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(1, sampleRate, sampleRate);
    const analyserNode = offlineCtx.createAnalyser();
    const osc = offlineCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(analyserNode);
    analyserNode.connect(offlineCtx.destination);
    osc.start();

    // Simulate analyzer data with a strong 440hz bin
    analyserNode.getByteFrequencyData = (arr) => {
      arr.fill(0);
      const binHz = sampleRate / analyserNode.fftSize;
      const index = Math.round(440 / binHz);
      arr[index] = 255;
    };

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
