jest.mock('three', () => {
  const mockRender = jest.fn();
  const mockAdd = jest.fn();
  return {
    WebGLRenderer: jest.fn(() => ({
      setSize: jest.fn(),
      render: mockRender,
    })),
    Scene: jest.fn(() => ({ add: mockAdd })),
    PerspectiveCamera: jest.fn(() => ({
      position: { z: 0 },
      updateProjectionMatrix: jest.fn(),
    })),
    BoxGeometry: jest.fn(),
    MeshBasicMaterial: jest.fn(() => ({ color: {} })),
    Mesh: jest.fn(() => ({
      scale: { y: 1 },
      position: { x: 0, y: 0 },
      material: { color: {} },
    })),
    Color: jest.fn(() => ({})),
  };
});

import VisualizerThree from '../../src/render/VisualizerThree.js';

describe('VisualizerThree', () => {
  beforeEach(() => {
    document.body.innerHTML = '<canvas id="c" width="300" height="150"></canvas>';
  });

  test('drawFrame runs without errors', () => {
    const canvas = document.getElementById('c');
    const vis = new VisualizerThree(canvas, 2);
    const settings = { colorMode: 'Rainbow', intensity: 1, smoothing: 0.2, strobe: false };
    expect(() => vis.drawFrame([0.5, 1], settings, false)).not.toThrow();
  });

  test('tunnel scene does not throw', () => {
    const canvas = document.getElementById('c');
    const vis = new VisualizerThree(canvas, 2);
    const settings = { colorMode: 'Rainbow', intensity: 1, smoothing: 0.2, strobe: false };
    vis.setScene('tunnel');
    expect(() => vis.drawFrame([0.5, 1], settings, false)).not.toThrow();
  });
});

