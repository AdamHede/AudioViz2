import { createDynamicBandMapper } from './BandMapper.js';

export default class AudioAnalyzer {
  constructor(audioCtx, numBars = 8) {
    this.audioCtx = audioCtx;
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.mapper = createDynamicBandMapper(numBars);
  }

  connect(source) {
    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  /**
   * Retrieve smoothed, normalized frequency buckets.
   * @returns {number[]} values in range [0,1]
   */
  getFrequencyBuckets() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.mapper(this.dataArray);
  }
}
