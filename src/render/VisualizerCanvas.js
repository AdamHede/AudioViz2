import applySmoothing from './applySmoothing.js';


export default class VisualizerCanvas {
  constructor(canvas, numBars) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.numBars = numBars;
    this.animationId = null;
    this.prev = new Array(numBars).fill(0);
    this.scene = 'bars';
  }

  /**
   * Map bar index and settings to a display color.
   * @param {number} index - bar index
   * @param {string} colorMode - selected color mode
   * @param {number[]} buckets - current frequency buckets
   * @returns {string} CSS color
   */
  getColor(index, colorMode, buckets) {
    if (colorMode === 'Rainbow') {
      const hue = (index / this.numBars) * 360;
      return `hsl(${hue}, 100%, 50%)`;
    }
    if (colorMode === 'Bass') {
      const hue = buckets[0] * 200;
      return `hsl(${hue}, 100%, 50%)`;
    }
    return '#fff';
  }

  /**
   * Change the active scene.
   * @param {string} scene - scene identifier
   */
  setScene(scene) {
    this.scene = scene;
    this.prev.fill(0);
  }

  drawBars(buckets, settings, beat = false) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    const { colorMode, intensity, smoothing, strobe } = settings;

    if (strobe && beat) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
      this.ctx.fillRect(0, 0, width, height);
      return;
    }

    this.ctx.clearRect(0, 0, width, height);
    const barWidth = width / this.numBars;
    for (let i = 0; i < this.numBars; i++) {
      const current = Math.min(buckets[i] * intensity, 1);
      const barHeight = applySmoothing(current, this.prev[i], smoothing) * height;
      this.prev[i] = barHeight / height;
      const fill = this.getColor(i, colorMode, buckets);
      this.ctx.fillStyle = fill;
      this.ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
  }

  drawTunnel(buckets, settings, beat = false) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    const { colorMode, intensity, smoothing, strobe } = settings;

    if (strobe && beat) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
      this.ctx.fillRect(0, 0, width, height);
      return;
    }

    this.ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy);
    const angleStep = (Math.PI * 2) / this.numBars;
    this.ctx.lineWidth = 2;
    for (let i = 0; i < this.numBars; i++) {
      const current = Math.min(buckets[i] * intensity, 1);
      const radius = applySmoothing(current, this.prev[i], smoothing) * maxRadius;
      this.prev[i] = radius / maxRadius;
      const angle = i * angleStep;
      this.ctx.strokeStyle = this.getColor(i, colorMode, buckets);
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      this.ctx.stroke();
    }
  }

  drawFrame(buckets, settings, beat = false) {
    if (this.scene === 'tunnel') {
      this.drawTunnel(buckets, settings, beat);
    } else {
      this.drawBars(buckets, settings, beat);
    }
  }

  start(drawFn, settings, fpsCounter = null, onFrame = null) {
    const loop = () => {
      if (fpsCounter) fpsCounter.tick();
      const buckets = drawFn();
      const beat = onFrame ? onFrame(buckets) : false;
      this.drawFrame(buckets, settings, beat);
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }
}
