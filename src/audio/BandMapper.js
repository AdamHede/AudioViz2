// Map FFT data into smoothed, normalized energy bands
export function createDynamicBandMapper(numBands = 8, options = {}) {
  const smoothing = options.smoothing ?? 0.8; // smoothing factor for temporal averaging
  const decay = options.decay ?? 0.98; // decay rate for tracking min/max

  const minLevels = new Array(numBands).fill(Infinity);
  const maxLevels = new Array(numBands).fill(0);
  const prev = new Array(numBands).fill(0);

  /**
   * Group FFT bins into logarithmic bands using simple power scale.
   * @param {Uint8Array} fftData - raw byte frequency data
   * @returns {number[]} average magnitude per band
   */
  function getBands(fftData) {
    const len = fftData.length;
    const ranges = [];
    for (let i = 0; i <= numBands; i++) {
      ranges.push(Math.floor(Math.pow(len, i / numBands)));
    }
    const bands = new Array(numBands).fill(0);
    for (let i = 0; i < numBands; i++) {
      let sum = 0;
      const start = ranges[i];
      const end = Math.max(start + 1, ranges[i + 1]);
      for (let j = start; j < end; j++) sum += fftData[j];
      bands[i] = sum / (end - start);
    }
    return bands;
  }

  /**
   * Map fft data to normalized, smoothed band energies.
   * @param {Uint8Array} fftData - analyser byte data
   * @returns {number[]} values between 0 and 1
   */
  return function map(fftData) {
    const bands = getBands(fftData);
    return bands.map((val, i) => {
      if (minLevels[i] === Infinity) minLevels[i] = val;
      // update peak levels with decay to adapt over time
      maxLevels[i] = Math.max(val, maxLevels[i] * decay);
      if (val < minLevels[i]) {
        minLevels[i] = val;
      } else {
        minLevels[i] = minLevels[i] * decay + val * (1 - decay);
      }
      if (maxLevels[i] - minLevels[i] < 1) maxLevels[i] = minLevels[i] + 1;
      const norm = (val - minLevels[i]) / (maxLevels[i] - minLevels[i]);
      prev[i] = prev[i] * smoothing + norm * (1 - smoothing);
      return prev[i];
    });
  };
}
