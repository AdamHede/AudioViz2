export default class AudioAnalyzer {
  constructor(audioCtx, numBars = 8) {
    this.audioCtx = audioCtx;
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.numBars = numBars;
  }

  connect(source) {
    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  getFrequencyBuckets() {
    const bufferLength = this.analyser.frequencyBinCount;
    const buckets = new Array(this.numBars).fill(0);
    const ranges = [];
    for (let i = 0; i <= this.numBars; i++) {
      ranges.push(Math.floor(Math.pow(bufferLength, i / this.numBars)));
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    for (let i = 0; i < this.numBars; i++) {
      let sum = 0;
      const start = ranges[i];
      const end = ranges[i + 1];
      for (let j = start; j < end; j++) {
        sum += this.dataArray[j];
      }
      buckets[i] = sum / (end - start);
    }
    return buckets;
  }
}
