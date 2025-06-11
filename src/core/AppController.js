import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import BeatDetector from '../audio/BeatDetector.js';
import mapSensitivityToThreshold from '../audio/mapSensitivityToThreshold.js';
import VisualizerCanvas from '../render/VisualizerCanvas.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';
import SettingsPanel from '../ui/SettingsPanel.js';
import FpsCounter from '../ui/FpsCounter.js';
import CueLogger from './CueLogger.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, downloadBtn, canvas, settingsPanel, fpsDisplay } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn, downloadBtn);
    this.settings = {
      colorMode: 'Rainbow',
      intensity: 1,
      smoothing: 0.2,
      strobe: false,
      strobeSensitivity: 50,
    };
    new SettingsPanel(settingsPanel, this.settings);
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.visualizer = new VisualizerCanvas(canvas, SceneConfig.NUM_BARS);
    this.fpsCounter = new FpsCounter(fpsDisplay);
    this.cueLogger = new CueLogger();
    this.beatDetector = new BeatDetector();
    this.animationId = null;
    this.bindEvents();
  }

  bindEvents() {
    this.controls.bindLoad(file => {
      try {
        this.player.load(file);
        // Connect the player's source through the analyzer to the speakers
        this.analyzer.connect(this.player.source);
        this.controls.enable();
        this.controls.setDownloadEnabled(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
      }
    });
    this.controls.bindPlay(() => {
      this.player.play();
      this.cueLogger.reset();
      if (!this.visualizer.animationId) {
        this.fpsCounter.reset();
        this.visualizer.start(
          () => this.analyzer.getFrequencyBuckets(),
          this.settings,
          this.fpsCounter,
          buckets => {
            this.beatDetector.threshold = mapSensitivityToThreshold(
              this.settings.strobeSensitivity
            );
            const beat = this.beatDetector.update(buckets);
            this.cueLogger.logFrame(buckets);
            return beat;
          }
        );
      }
      this.controls.setDownloadEnabled(false);
    });
    this.controls.bindStop(() => {
      this.player.stop();
      this.visualizer.stop();
      this.fpsCounter.reset();
      this.controls.setDownloadEnabled(true);
    });
    this.controls.bindDownload(() => {
      this.cueLogger.download();
    });
  }
}