import { createDynamicBandMapper } from '../../src/audio/BandMapper.js';

describe('createDynamicBandMapper', () => {
  test('maps silent and loud inputs to expected ranges', () => {
    const map = createDynamicBandMapper(2, { smoothing: 0.8, decay: 0.9 });
    const silent = new Uint8Array(16).fill(0);
    const loud = new Uint8Array(16).fill(255);

    const first = map(silent);
    expect(first).toEqual([0, 0]);

    const second = map(loud);
    expect(second[0]).toBeGreaterThan(0.1); // rises from zero with smoothing
    expect(second[1]).toBeGreaterThan(0.1);

    const third = map(silent);
    expect(third[0]).toBeGreaterThan(0); // smoothing keeps some energy
  });
});
