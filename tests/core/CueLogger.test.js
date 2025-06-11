import CueLogger from '../../src/core/CueLogger.js';

describe('CueLogger', () => {
  test('records rounded band data with timestamps', () => {
    const logger = new CueLogger(5);
    logger.reset(0);
    logger.logFrame([0.1234, 0.5678], 50);
    logger.logFrame([0.9, 0.1], 100);
    const log = logger.getLog();
    expect(log.length).toBe(2);
    expect(log[0]).toEqual({ timestamp: 50, bands: [0.12, 0.57] });
  });
});
