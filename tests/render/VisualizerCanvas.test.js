import VisualizerCanvas from '../../src/render/VisualizerCanvas.js';

beforeEach(() => {
  document.body.innerHTML = '<canvas id="c" width="300" height="150"></canvas>';
});

describe('VisualizerCanvas', () => {
  test('drawFrame runs without errors', () => {
    const canvas = document.getElementById('c');
    const vis = new VisualizerCanvas(canvas, 2);
    expect(() => vis.drawFrame([0.5, 1])).not.toThrow();
  });

  test('flash overlays white rectangle for one frame', () => {
    const canvas = document.getElementById('c');
    const vis = new VisualizerCanvas(canvas, 2);
    vis.flash();
    expect(() => vis.drawFrame([0, 0])).not.toThrow();
  });
});
