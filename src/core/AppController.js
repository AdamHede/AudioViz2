import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import BeatDetector from '../audio/BeatDetector.js';
import VisualizerCanvas from '../render/VisualizerCanvas.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';
import CueLogger from './CueLogger.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, downloadCueBtn, strobeToggle, canvas } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn, downloadCueBtn, strobeToggle);
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.visualizer = new VisualizerCanvas(canvas, SceneConfig.NUM_BARS);
    this.logger = new CueLogger();
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
      this.logger.start();
      this.controls.setDownloadEnabled(false);
      this.player.play();
      if (!this.visualizer.animationId) {
        this.visualizer.start(() => {
          const bands = this.analyzer.getFrequencyBuckets();
          const now = performance.now();
          this.logger.addEntry(now, bands);
          if (this.beatDetector.process(bands, now) && this.controls.isStrobeEnabled()) {
            this.visualizer.flash();
          }
          return bands;
        });
      }
    });

    this.controls.bindStop(() => {
      this.player.stop();
      this.visualizer.stop();
      this.controls.setDownloadEnabled(true);
    });

    this.controls.bindDownload(() => this.logger.download());
    this.controls.bindStrobeToggle(() => {});
  }
}
