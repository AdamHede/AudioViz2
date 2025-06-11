import Layer from './Layer.js';

export default class StrobeLayer extends Layer {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.alpha = 0.8;
    this.blendMode = 'source-over';
    this.enabled = true;
  }

  resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(data, settings) {
    this.resize();
    const { beat } = data;
    const { strobe } = settings;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!strobe || !beat) return;
    this.ctx.globalAlpha = this.alpha;
    this.ctx.globalCompositeOperation = this.blendMode;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
