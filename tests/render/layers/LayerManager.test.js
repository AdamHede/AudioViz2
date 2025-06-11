import LayerManager from '../../../src/render/layers/LayerManager.js';

describe('LayerManager', () => {
  test('renders layers with data', () => {
    const layer = { render: jest.fn() };
    const manager = new LayerManager([layer]);
    let called = false;
    global.requestAnimationFrame = cb => {
      if (!called) {
        called = true;
        cb(0);
      }
      return 1;
    };
    global.cancelAnimationFrame = jest.fn();

    manager.start(() => [0.2], {}, null, () => true);
    expect(layer.render).toHaveBeenCalledWith({ buckets: [0.2], beat: true, deltaTime: 0 }, {});
    manager.stop();
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });
});
