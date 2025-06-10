// Simple energy-based beat detection
export default class BeatDetector {
  constructor(options = {}) {
    this.historySize = options.historySize ?? 43; // ~0.7s of history at 60fps
    this.threshold = options.threshold ?? 1.3; // energy multiplier to trigger
    this.cooldown = options.cooldown ?? 300; // ms between beats
    this.history = new Array(this.historySize).fill(0);
    this.index = 0;
    this.filled = false;
    this.lastBeat = -Infinity;
  }

  /**
   * Update detector with latest normalized energy level.
   * @param {number} energy value between 0 and 1
   * @param {number} [now=Date.now()] timestamp for cooldown check
   * @returns {boolean} true if beat detected
   */
  update(energy, now = Date.now()) {
    const used = this.filled ? this.historySize : this.index || 1;
    const avg = this.history.slice(0, used).reduce((s, v) => s + v, 0) / used;
    this.history[this.index] = energy;
    this.index = (this.index + 1) % this.historySize;
    if (this.index === 0) this.filled = true;

    if (now - this.lastBeat < this.cooldown) return false;
    if (this.filled && energy > avg * this.threshold) {
      this.lastBeat = now;
      return true;
    }
    return false;
  }
}
