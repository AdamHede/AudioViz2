import Layer from './Layer.js';

// Simple Perlin noise generator
class Perlin {
  constructor() {
    this.p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    for (let i = 0; i < 256; i++) {
      const j = (Math.random() * 256) | 0;
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }
    for (let i = 0; i < 256; i++) this.p[i + 256] = this.p[i];
  }
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  lerp(a, b, t) {
    return a + t * (b - a);
  }
  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;
    return this.lerp(
      this.lerp(
        this.lerp(this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z), u),
        this.lerp(this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z), u),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }
}

export default class PerlinNoiseLayer extends Layer {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.perlin = new Perlin();
    this.time = 0;
    this.imageData = null;
  }

  resize() {
    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    this.canvas.width = width;
    this.canvas.height = height;
    this.imageData = this.ctx.createImageData(width, height);
  }

  // Draw animated perlin noise
  render(_data, settings) {
    this.resize();
    const opts = settings.noise;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!opts || !opts.enabled) return;
    const { blend, scale, speed, alpha } = opts;
    const { width, height } = this.canvas;
    this.ctx.globalCompositeOperation = blend;
    this.ctx.globalAlpha = alpha;
    this.time += speed;
    const img = this.imageData;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const v = (this.perlin.noise(x / scale, y / scale, this.time) + 1) * 0.5;
        const c = Math.floor(v * 255);
        const idx = (y * width + x) * 4;
        img.data[idx] = c;
        img.data[idx + 1] = c;
        img.data[idx + 2] = c;
        img.data[idx + 3] = 255;
      }
    }
    this.ctx.putImageData(img, 0, 0);
  }
}
