import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import BeatDetector from '../audio/BeatDetector.js';
import VisualizerCanvas from '../render/VisualizerCanvas.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, strobeToggle, canvas } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn, strobeToggle);
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.visualizer = new VisualizerCanvas(canvas, SceneConfig.NUM_BARS);
    this.beatDetector = new BeatDetector();
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
        this.visualizer.start(
          () => this.analyzer.getFrequencyBuckets(),
          buckets => {
            if (this.beatDetector.update(buckets)) {
              this.visualizer.triggerFlash();
            }
          }
        );
      }
    });
    this.controls.bindStop(() => {
      this.player.stop();
      this.visualizer.stop();
    });

    this.controls.bindStrobeChange(enabled => {
      this.visualizer.setStrobe(enabled);
    });
  }
}
