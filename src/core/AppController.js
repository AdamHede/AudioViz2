import AudioPlayer from '../audio/AudioPlayer.js';
import AudioAnalyzer from '../audio/AudioAnalyzer.js';
import BeatDetector from '../audio/BeatDetector.js';
import mapSensitivityToThreshold from '../audio/mapSensitivityToThreshold.js';
import LayerManager from '../render/layers/LayerManager.js';
import ThreeJsLayer from '../render/layers/ThreeJsLayer.js';
import StrobeLayer from '../render/layers/StrobeLayer.js';
import NoiseLayer from '../render/layers/NoiseLayer.js';
import SceneConfig from '../render/SceneConfig.js';
import Controls from '../ui/Controls.js';
import SettingsPanel from '../ui/SettingsPanel.js';
import FpsCounter from '../ui/FpsCounter.js';
import SceneButtons from '../ui/SceneButtons.js';
import CueLogger from './CueLogger.js';

export default class AppController {
  constructor(elements) {
    const { fileInput, playBtn, stopBtn, downloadBtn, canvas, overlay, noiseCanvas, settingsPanel, fpsDisplay, sceneButtons } = elements;
    this.controls = new Controls(fileInput, playBtn, stopBtn, downloadBtn);
    this.canvas = canvas;
    this.settings = {
      colorMode: 'Rainbow',
      intensity: 1,
      bgColor: '#000000',
      smoothing: 0.2,
      strobe: false,
      strobeSensitivity: 50,
      textContent: 'AudioViz',
      noiseEnabled: false,
      noiseBlend: 'overlay',
      noiseScale: 50,
      noiseSpeed: 0.01,
    };
    this.settingsPanel = new SettingsPanel(settingsPanel, this.settings);
    this.canvas.style.backgroundColor = this.settings.bgColor;
    this.player = new AudioPlayer();
    this.analyzer = new AudioAnalyzer(this.player.audioCtx, SceneConfig.NUM_BARS);
    this.threeLayer = new ThreeJsLayer(canvas, SceneConfig.NUM_BARS, this.settings.textContent);
    this.noiseLayer = new NoiseLayer(noiseCanvas);
    this.strobeLayer = new StrobeLayer(overlay);
    this.layerManager = new LayerManager([this.threeLayer, this.noiseLayer, this.strobeLayer]);
    this.fpsCounter = new FpsCounter(fpsDisplay);
    this.sceneButtons = new SceneButtons(sceneButtons);
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
      if (!this.layerManager.animationId) {
        this.fpsCounter.reset();
        this.layerManager.start(
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
      this.layerManager.stop();
      this.fpsCounter.reset();
      this.controls.setDownloadEnabled(true);
    });
    this.controls.bindDownload(() => {
      this.cueLogger.download();
    });

    this.sceneButtons.bindSceneChange(scene => {
      this.threeLayer.visualizer.setScene(scene);
      this.settingsPanel.toggleTextInput(scene === 'text');
      if (scene === 'text') {
        this.threeLayer.visualizer.setText(this.settings.textContent);
      }
    });

    this.settingsPanel.bindTextChange(text => {
      this.threeLayer.visualizer.setText(text);
    });

    this.settingsPanel.bindBgColorChange(color => {
      this.canvas.style.backgroundColor = color;
    });
  }
}
