import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import VisualizerCanvas from '../render/VisualizerCanvas.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';
import SettingsPanel from '../ui/SettingsPanel.js';
import FpsCounter from '../ui/FpsCounter.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, canvas, settingsPanel, fpsDisplay } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn);
    this.settings = {
      colorMode: 'Rainbow',
      intensity: 1,
      smoothing: 0.2,
      strobe: false,
    };
    new SettingsPanel(settingsPanel, this.settings);
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.visualizer = new VisualizerCanvas(canvas, SceneConfig.NUM_BARS);
    this.fpsCounter = new FpsCounter(fpsDisplay);
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
        this.fpsCounter.reset();
        this.visualizer.start(
          () => this.analyzer.getFrequencyBuckets(),
          this.settings,
          this.fpsCounter
        );
      }
    });
    this.controls.bindStop(() => {
      this.player.stop();
      this.visualizer.stop();
      this.fpsCounter.reset();
    });
  }
}
