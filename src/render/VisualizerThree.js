import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import applySmoothing from './applySmoothing.js';

/**
 * Three.js based visualizer with both bar and tunnel scenes.
 * The tunnel scene renders a moving 3D pipeline that reacts to music.
 */
export default class VisualizerThree {
  constructor(canvas, numBars, text = 'AudioViz') {
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
    this.tunnelRings = [];
    this.prev = new Array(numBars).fill(0);
    this.activeScene = 'bars';
    this.hueOffset = 0;
    this.tunnelSegments = 20;
    this.tunnelSpacing = 0.7;
    this.tunnelSpeed = 0.05;
    this.initBars();
    this.initTunnel();
    this.textMesh = null;
    this.font = null;
    this.pendingText = text;
    this.initBars();
    this.initText(text);
  }

  /** Initialize bar meshes and add them to the scene */
  initBars() {
    const spacing = 1.2;
    for (let i = 0; i < this.numBars; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - this.numBars / 2) * spacing;
      mesh.visible = this.activeScene === 'bars';
      this.scene.add(mesh);
      this.bars.push(mesh);
    }
  }

  /** Initialize tunnel ring meshes */
  initTunnel() {
    const inner = 2.8; // inner radius for hexagon ring
    const outer = 3; // outer radius for hexagon ring
    for (let i = 0; i < this.tunnelSegments; i++) {
      const geometry = new THREE.RingGeometry(inner, outer, 6);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.z = -i * this.tunnelSpacing;
      mesh.visible = this.activeScene === 'tunnel';
      this.scene.add(mesh);
      this.tunnelRings.push(mesh);
    }
  }

  /** Load font and create 3D text mesh */
  initText(text) {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', font => {
      this.font = font;
      this.setText(text || this.pendingText);
      this.pendingText = null;
    });
  }

  /** Update the displayed 3D text */
  setText(text) {
    if (this.font) {
      if (this.textMesh) this.scene.remove(this.textMesh);
      const geometry = new TextGeometry(text, {
        font: this.font,
        size: 1,
        height: 0.2,
      });
      geometry.center();
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
      this.textMesh = new THREE.Mesh(geometry, material);
      this.textMesh.visible = this.activeScene === 'text';
      this.scene.add(this.textMesh);
    } else {
      this.pendingText = text;
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
    if (scene === 'tunnel') {
      this.camera.position.z = 0;
    } else {
      this.camera.position.z = 5;
    }
    // Update visibility for scene objects
    this.bars.forEach(bar => {
      bar.visible = scene === 'bars';
    });
    this.tunnelRings.forEach(ring => {
      ring.visible = scene === 'tunnel';
    });
    if (this.textMesh) {
      this.textMesh.visible = scene === 'text';
    }
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

  drawTunnel(buckets, settings) {
    this.resize();
    const energy = buckets.reduce((s, v) => s + v, 0) / buckets.length;
    const scale = 1 + energy * settings.intensity;
    for (const ring of this.tunnelRings) {
      ring.scale.setScalar(scale);
    }
    this.renderer.render(this.scene, this.camera);
  }

  /** Animate 3D text rotation and bounce */
  drawText(buckets, settings, beat = false) {
    this.resize();
    if (!this.textMesh) return;
    const { intensity, smoothing } = settings;
    const current = Math.min(buckets[0] * intensity, 1);
    const value = applySmoothing(this.prev[0], current, smoothing);
    this.prev[0] = value;
    this.textMesh.rotation.y += 0.01;
    this.textMesh.position.y = value + (beat ? 0.2 : 0);
    this.renderer.render(this.scene, this.camera);
  }

  drawFrame(buckets, settings, beat = false) {
    if (this.activeScene === 'tunnel') {
      this.drawTunnel(buckets, settings, beat);
    } else if (this.activeScene === 'text') {
      this.drawText(buckets, settings, beat);
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
