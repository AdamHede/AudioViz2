import StrobeLayer from '../../../src/render/layers/StrobeLayer.js';

describe('StrobeLayer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<canvas id="c" width="100" height="50"></canvas>';
  });

  test('draws white flash on beat', () => {
    const canvas = document.getElementById('c');
    const layer = new StrobeLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({ beat: true }, { strobe: true });
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  test('does nothing when strobe disabled', () => {
    const canvas = document.getElementById('c');
    const layer = new StrobeLayer(canvas);
    const ctx = canvas.getContext('2d');
    layer.render({ beat: true }, { strobe: false });
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });
});
