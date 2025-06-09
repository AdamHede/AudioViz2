import { mapFftToBands } from '../src/audio/mapFftToBands.js';
import { testSignal } from '../src/audio/test-audio-data.js';

test('mapFftToBands groups data into 8 bands', () => {
  const result = mapFftToBands(testSignal, 8);
  expect(result).toHaveLength(8);
  // simple check: output values should be numbers
  result.forEach(v => expect(typeof v).toBe('number'));
});
