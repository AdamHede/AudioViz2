import { OfflineAudioContext } from 'standardized-audio-context';
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

  test.skip('identifies dominant frequency 440hz', async () => {
    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(1, sampleRate, sampleRate);
    const osc = offlineCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440;
    const analyserNode = offlineCtx.createAnalyser();
    analyserNode.fftSize = 2048;
    osc.connect(analyserNode);
    analyserNode.connect(offlineCtx.destination);
    osc.start();
    await offlineCtx.startRendering();
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
