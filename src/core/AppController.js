import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import VisualizerCanvas from '../render/VisualizerCanvas.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, canvas } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn);
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.visualizer = new VisualizerCanvas(canvas, SceneConfig.NUM_BARS);
    this.bindEvents();
  }

  bindEvents() {
    this.controls.bindLoad(file => {
      this.player.load(file);
      // Connect the player's source through the analyzer to the speakers
      this.analyzer.connect(this.player.source);
      this.controls.enable();
    });
    this.controls.bindPlay(() => {
      this.player.play();
      if (!this.visualizer.animationId) {
        this.visualizer.start(() => this.analyzer.getFrequencyBuckets());
      }
    });
    this.controls.bindStop(() => {
      this.player.stop();
      this.visualizer.stop();
    });
  }
}
