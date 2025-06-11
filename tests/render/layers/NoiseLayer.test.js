import NoiseLayer from '../../../src/render/layers/NoiseLayer.js';

describe('NoiseLayer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<canvas id="c" width="10" height="10"></canvas>';
  });

  test('renders noise when enabled', () => {
    const canvas = document.getElementById('c');
    const layer = new NoiseLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({}, { noiseEnabled: true, noiseBlend: 'overlay', noiseScale: 20, noiseSpeed: 0 });
    expect(ctx.putImageData).toHaveBeenCalled();
  });

  test('skips when disabled', () => {
    const canvas = document.getElementById('c');
    const layer = new NoiseLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({}, { noiseEnabled: false });
    expect(ctx.putImageData).not.toHaveBeenCalled();
  });
});
