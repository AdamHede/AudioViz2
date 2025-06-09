export default class BeatDetector {
  constructor({ historySize = 43, threshold = 1.3, cooldown = 300, timeFn = () => performance.now() } = {}) {
    this.historySize = historySize;
    this.threshold = threshold;
    this.cooldown = cooldown;
    this.timeFn = timeFn;
    this.history = [];
    this.lastBeat = -Infinity;
  }

  /**
   * Update detector with new energy buckets and detect a beat.
   * @param {number[]} buckets - normalized energy values
   * @returns {boolean} true if a beat is detected
   */
  update(buckets) {
    if (!buckets || buckets.length === 0) return false;
    const energy = buckets.reduce((s, v) => s + v, 0) / buckets.length;
    this.history.push(energy);
    if (this.history.length > this.historySize) this.history.shift();
    const avg = this.history.reduce((s, v) => s + v, 0) / this.history.length;
    const now = this.timeFn();
    if (energy > avg * this.threshold && now - this.lastBeat >= this.cooldown) {
      this.lastBeat = now;
      return true;
    }
    return false;
  }
}
