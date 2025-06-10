import VisualizerCanvas from '../../src/render/VisualizerCanvas.js';

beforeEach(() => {
  document.body.innerHTML = '<canvas id="c" width="300" height="150"></canvas>';
});

describe('VisualizerCanvas', () => {
  test('drawFrame runs without errors', () => {
    const canvas = document.getElementById('c');
    const vis = new VisualizerCanvas(canvas, 2);
    const settings = { colorMode: 'Rainbow', intensity: 1, smoothing: 0.2, strobe: false };
    expect(() => vis.drawFrame([0.5, 1], settings, false)).not.toThrow();
  });
});
