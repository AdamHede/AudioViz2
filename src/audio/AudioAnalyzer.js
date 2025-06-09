import { mapFftToBands } from './mapFftToBands.js';

// Handles FFT analysis and mapping to normalized, smoothed bands
export default class AudioAnalyzer {
  constructor(audioCtx, numBands = 8) {
    this.audioCtx = audioCtx;
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.numBands = numBands;
    this.maxLevels = new Array(numBands).fill(0);
    this.minLevels = new Array(numBands).fill(255);
    this.smoothBands = new Array(numBands).fill(0);
  }

  connect(source) {
    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  // Returns normalized and smoothed band energies (0–1)
  getSmoothedBands() {
    this.analyser.getByteFrequencyData(this.dataArray);
    const rawBands = mapFftToBands(this.dataArray, this.numBands);
    const out = new Array(this.numBands);
    for (let i = 0; i < this.numBands; i++) {
      const energy = rawBands[i];
      // update dynamic range using peak-following
      this.maxLevels[i] = Math.max(energy, this.maxLevels[i] * 0.98);
      this.minLevels[i] = Math.min(energy, this.minLevels[i] * 0.98 + energy * 0.02);
      const range = this.maxLevels[i] - this.minLevels[i] || 1;
      const normalized = (energy - this.minLevels[i]) / range;
      // temporal smoothing
      this.smoothBands[i] = this.smoothBands[i] * 0.8 + normalized * 0.2;
      out[i] = this.smoothBands[i];
    }
    return out;
  }
}
