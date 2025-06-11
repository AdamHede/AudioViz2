import Layer from './Layer.js';
import { createNoise3D } from 'simplex-noise';

/**
 * Animated Perlin-style noise overlay layer.
 * Not audio reactive, renders procedural noise each frame.
 */
export default class NoiseLayer extends Layer {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.noise3d = createNoise3D();
    this.time = 0;
  }

  resize() {
    const width = this.canvas.clientWidth || this.canvas.width;
    const height = this.canvas.clientHeight || this.canvas.height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(_data, settings) {
    this.resize();
    const {
      noiseEnabled,
      noiseBlend = 'overlay',
      noiseScale = 50,
      noiseSpeed = 0.01,
    } = settings;
    if (!noiseEnabled) return;

    const { width, height } = this.canvas;
    const image = this.ctx.createImageData(width, height);
    this.time += noiseSpeed;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const v = (this.noise3d(x / noiseScale, y / noiseScale, this.time) + 1) / 2;
        const c = v * 255;
        const idx = (y * width + x) * 4;
        image.data[idx] = c;
        image.data[idx + 1] = c;
        image.data[idx + 2] = c;
        image.data[idx + 3] = 255;
      }
    }
    this.ctx.globalAlpha = 0.4;
    this.ctx.globalCompositeOperation = noiseBlend;
    this.ctx.putImageData(image, 0, 0);
  }
}
