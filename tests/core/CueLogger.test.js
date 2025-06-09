import CueLogger from '../../src/core/CueLogger.js';

describe('CueLogger', () => {
  let nowMock;
  beforeEach(() => {
    nowMock = jest.fn(() => 1000);
    global.performance.now = nowMock;
  });

  test('records entries with relative timestamps', () => {
    const logger = new CueLogger();
    logger.start();
    global.performance.now.mockReturnValue(1010);
    logger.addEntry(performance.now(), [0.1, 0.2]);
    const log = logger.getLog();
    expect(log.length).toBe(1);
    expect(log[0].timestamp).toBe(10);
    expect(log[0].bands).toEqual([0.1, 0.2]);
  });

  test('reset clears log', () => {
    const logger = new CueLogger();
    logger.start();
    logger.addEntry(performance.now(), [0.1]);
    expect(logger.getLog().length).toBe(1);
    logger.start();
    expect(logger.getLog().length).toBe(0);
  });
});
