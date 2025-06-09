/**
 * Map FFT byte data to normalized bar magnitudes.
 * @param {Array<number>|Uint8Array} fftData - raw FFT values 0-255
 * @param {number} [numBars=fftData.length] - desired number of bars
 * @returns {number[]} values normalized to range [0,1]
 */
export default function mapFftToVisuals(fftData, numBars = fftData.length) {
  if (!fftData || numBars <= 0) return [];
  const step = Math.max(1, Math.floor(fftData.length / numBars));
  const maxVal = 255;
  const bars = [];
  for (let i = 0; i < numBars; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) {
      const index = i * step + j;
      if (index >= fftData.length) break;
      sum += fftData[index];
    }
    const avg = sum / step;
    bars.push(Math.min(avg / maxVal, 1));
  }
  return bars;
}
