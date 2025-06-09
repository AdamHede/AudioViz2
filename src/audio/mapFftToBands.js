export function computeLogRanges(length, bands) {
  const ranges = [0];
  for (let i = 1; i <= bands; i++) {
    let idx = Math.round(Math.pow(length, i / bands)) - 1;
    idx = Math.min(idx, length - 1);
    if (idx <= ranges[i - 1]) idx = ranges[i - 1] + 1;
    ranges.push(idx);
  }
  ranges[ranges.length - 1] = length - 1;
  return ranges;
}

export function mapFftToBands(fftArray, bands) {
  const ranges = computeLogRanges(fftArray.length, bands);
  const result = new Array(bands).fill(0);
  for (let i = 0; i < bands; i++) {
    const start = ranges[i];
    const end = ranges[i + 1];
    let sum = 0;
    for (let j = start; j <= end; j++) sum += fftArray[j];
    result[i] = sum / (end - start + 1);
  }
  return result;
}
