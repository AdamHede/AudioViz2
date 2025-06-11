// Simple energy-based beat detection with adjustable parameters
export default class BeatDetector {
  constructor(options = {}) {
    if (typeof options === 'number') {
      options = { cooldown: options };
    }
    this.historySize = options.historySize ?? 43; // ~0.7s at 60fps
    this.threshold = options.threshold ?? 1.3; // energy multiplier
    this.cooldown = options.cooldown ?? 300; // ms between beats
    this.history = [];
    this.lastBeat = -Infinity;
  }

  /**
   * Update detector with energy or band values; returns true if a beat is detected
   * @param {number|Array<number>} energyOrBands single energy value or array of band values
   * @param {number} [now=Date.now()] timestamp for cooldown check
   * @returns {boolean} true if beat detected
   */
  update(energyOrBands, now = Date.now()) {
    const energy = Array.isArray(energyOrBands)
      ? energyOrBands.reduce((s, v) => s + v, 0) / energyOrBands.length
      : energyOrBands;

    if (this.history.length >= this.historySize) this.history.shift();
    this.history.push(energy);
    const avg = this.history.reduce((s, v) => s + v, 0) / this.history.length;

    if (now - this.lastBeat < this.cooldown) return false;
    if (energy > avg * this.threshold) {
      this.lastBeat = now;
      return true;
    }
    return false;
  }
}
