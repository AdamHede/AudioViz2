export default class VisualizerCanvas {
  constructor(canvas, numBars) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.numBars = numBars;
    this.animationId = null;
    this.shouldFlash = false;
  }

  drawFrame(buckets) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);
    const barWidth = width / this.numBars;
    for (let i = 0; i < this.numBars; i++) {
      const magnitude = buckets[i]; // already normalized 0-1
      const barHeight = magnitude * height;
      this.ctx.fillStyle = `hsl(${i * 40}, 100%, ${50 + magnitude * 50}%)`;
      this.ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
    if (this.shouldFlash) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.fillRect(0, 0, width, height);
      this.shouldFlash = false;
    }
  }

  start(drawFn) {
    const loop = () => {
      this.drawFrame(drawFn());
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  flash() {
    this.shouldFlash = true;
  }
}
