import PerlinNoiseLayer from '../../../src/render/layers/PerlinNoiseLayer.js';

describe('PerlinNoiseLayer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<canvas id="c" width="50" height="30"></canvas>';
  });

  test('draws noise when enabled', () => {
    const canvas = document.getElementById('c');
    const layer = new PerlinNoiseLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({}, { noise: { enabled: true, blend: 'overlay', scale: 50, speed: 0.01, alpha: 0.3 } });
    expect(ctx.putImageData).toHaveBeenCalled();
  });

  test('skips drawing when disabled', () => {
    const canvas = document.getElementById('c');
    const layer = new PerlinNoiseLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({}, { noise: { enabled: false } });
    expect(ctx.putImageData).not.toHaveBeenCalled();
  });
});
