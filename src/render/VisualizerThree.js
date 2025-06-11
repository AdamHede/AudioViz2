import * as THREE from 'three';
import applySmoothing from './applySmoothing.js';

/**
 * Three.js based visualizer with a bars scene.
 * The tunnel scene is currently a no-op placeholder.
 */
export default class VisualizerThree {
  constructor(canvas, numBars) {
    this.canvas = canvas;
    this.numBars = numBars;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.bars = [];
    this.prev = new Array(numBars).fill(0);
    this.activeScene = 'bars';
    this.initBars();
  }

  /** Initialize bar meshes and add them to the scene */
  initBars() {
    const spacing = 1.2;
    for (let i = 0; i < this.numBars; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - this.numBars / 2) * spacing;
      this.scene.add(mesh);
      this.bars.push(mesh);
    }
  }

  /** Map bar index and settings to a display color */
  getColor(index, colorMode, buckets) {
    if (colorMode === 'Rainbow') {
      const hue = (index / this.numBars) * 360;
      return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    }
    if (colorMode === 'Bass') {
      const hue = buckets[0] * 200;
      return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    }
    return new THREE.Color('#ffffff');
  }

  /** Set the active scene */
  setScene(scene) {
    this.activeScene = scene;
    this.prev.fill(0);
  }

  resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    if (this.camera.updateProjectionMatrix) {
      this.camera.updateProjectionMatrix();
    }
  }

  drawBars(buckets, settings) {
    this.resize();
    const { colorMode, intensity, smoothing } = settings;
    for (let i = 0; i < this.numBars; i++) {
      const current = Math.min(buckets[i] * intensity, 1);
      const height = applySmoothing(this.prev[i], current, smoothing) * 4 + 0.1;
      this.prev[i] = height / 4;
      const bar = this.bars[i];
      bar.scale.y = height;
      bar.position.y = height / 2 - 0.5;
      bar.material.color = this.getColor(i, colorMode, buckets);
    }
    this.renderer.render(this.scene, this.camera);
  }

  drawTunnel() {
    this.resize();
    this.renderer.render(this.scene, this.camera);
  }

  drawFrame(buckets, settings, beat = false) {
    if (this.activeScene === 'tunnel') {
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
