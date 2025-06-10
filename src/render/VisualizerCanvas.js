import applySmoothing from './applySmoothing.js';

export default class VisualizerCanvas {
  constructor(canvas, numBars) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.numBars = numBars;
    this.animationId = null;
    this.prev = new Array(numBars).fill(0);
    this.prevBeat = false;
  }

  drawFrame(buckets, settings) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    const { colorMode, intensity, smoothing, strobe } = settings;

    const beat = buckets[0] > 0.8 && !this.prevBeat;
    this.prevBeat = buckets[0] > 0.8;

    if (strobe && beat) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, width, height);
      return;
    }

    this.ctx.clearRect(0, 0, width, height);
    const barWidth = width / this.numBars;
    for (let i = 0; i < this.numBars; i++) {
      const current = Math.min(buckets[i] * intensity, 1);
      const mag = applySmoothing(this.prev[i], current, smoothing);
      this.prev[i] = mag;
      const barHeight = mag * height;

      let fill = 'white';
      if (colorMode === 'Rainbow') {
        fill = `hsl(${i * 40}, 100%, ${50 + mag * 50}%)`;
      } else if (colorMode === 'Bass') {
        const hue = buckets[0] * 200;
        fill = `hsl(${hue}, 100%, 50%)`;
      }
      this.ctx.fillStyle = fill;
      this.ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
  }

  start(drawFn, settings, fpsCounter = null) {
    const loop = () => {
      if (fpsCounter) fpsCounter.tick();
      this.drawFrame(drawFn(), settings);
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
