export default class FpsCounter {
  constructor(element, perf = performance) {
    this.element = element;
    this.perf = perf;
    this.frames = 0;
    this.lastTime = this.perf.now();
  }

  /**
   * Increment frame count and update DOM when a second passes.
   */
  tick() {
    this.frames += 1;
    const now = this.perf.now();
    const delta = now - this.lastTime;
    if (delta >= 1000) {
      const fps = Math.round((this.frames * 1000) / delta);
      this.element.textContent = `FPS: ${fps}`;
      this.frames = 0;
      this.lastTime = now;
    }
  }

  reset() {
    this.frames = 0;
    this.lastTime = this.perf.now();
    this.element.textContent = 'FPS: 0';
  }
}
