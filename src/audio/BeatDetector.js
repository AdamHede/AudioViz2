export default class BeatDetector {
  constructor({ historySize = 60, threshold = 1.2, cooldown = 200 } = {}) {
    this.historySize = historySize;
    this.threshold = threshold;
    this.cooldown = cooldown;
    this.energyHistory = [];
    this.lastBeatTime = -Infinity;
  }

  // Process band data and return true if a beat is detected
  process(bands, timestampMs) {
    const energy = bands.reduce((a, b) => a + b, 0) / bands.length;
    const avgEnergy =
      this.energyHistory.reduce((a, b) => a + b, 0) /
      (this.energyHistory.length || 1);
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }
    if (this.energyHistory.length === 1) {
      return false;
    }
    if (timestampMs - this.lastBeatTime < this.cooldown) {
      return false;
    }
    if (energy > avgEnergy * this.threshold) {
      this.lastBeatTime = timestampMs;
      return true;
    }
    return false;
  }
}
