export default class LayerManager {
  constructor(layers = []) {
    this.layers = layers;
    this.animationId = null;
    this.lastTime = 0;
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  start(drawFn, settings, fpsCounter = null, onFrame = null) {
    const loop = (now) => {
      if (fpsCounter) fpsCounter.tick();
      const deltaTime = this.lastTime ? now - this.lastTime : 0;
      this.lastTime = now;
      const buckets = drawFn();
      const beat = onFrame ? onFrame(buckets) : false;
      const data = { buckets, beat, deltaTime };
      this.layers.forEach((layer) => layer.render(data, settings));
      this.animationId = requestAnimationFrame(loop);
    };
    loop(performance.now());
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }
}
