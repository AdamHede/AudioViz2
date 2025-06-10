export default class BeatDetector {
  constructor(cooldownMs = 200) {
    this.cooldownMs = cooldownMs;
    this.energyHistory = [];
    this.lastBeatTime = -Infinity;
  }

  // Update detector with new band values; returns true if a beat is detected
  update(bandValues, time = performance.now()) {
    const energy = bandValues.reduce((s, v) => s + v, 0) / bandValues.length;
    if (this.energyHistory.length >= 60) this.energyHistory.shift();
    this.energyHistory.push(energy);
    const avg = this.energyHistory.reduce((s, v) => s + v, 0) / this.energyHistory.length;
    const isBeat = energy > avg * 1.2 && (time - this.lastBeatTime) > this.cooldownMs;
    if (isBeat) this.lastBeatTime = time;
    return isBeat;
  }
}
