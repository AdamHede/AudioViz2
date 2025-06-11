export default class SettingsPanel {
  constructor(container, settings) {
    this.settings = settings;
    this.container = container;
    this.init();
  }

  // Setup listeners to keep settings in sync with UI controls
  init() {
    this.colorMode = this.container.querySelector('#colorMode');
    this.intensity = this.container.querySelector('#intensity');
    this.smoothing = this.container.querySelector('#smoothing');
    this.strobe = this.container.querySelector('#strobeToggle');
    this.strobeSensitivity = this.container.querySelector('#strobeSensitivity');
    this.strobeSensLabel = this.container.querySelector('#strobeSensitivityLabel');
    this.noise = this.container.querySelector('#noiseToggle');
    this.noiseBlend = this.container.querySelector('#noiseBlend');
    this.noiseScale = this.container.querySelector('#noiseScale');
    this.noiseSpeed = this.container.querySelector('#noiseSpeed');
    this.noiseAlpha = this.container.querySelector('#noiseAlpha');

    const update = () => {
      this.settings.colorMode = this.colorMode.value;
      this.settings.intensity = parseFloat(this.intensity.value);
      this.settings.smoothing = parseFloat(this.smoothing.value);
      this.settings.strobe = this.strobe.checked;
      this.settings.strobeSensitivity = parseFloat(this.strobeSensitivity.value);
      this.settings.noise.enabled = this.noise.checked;
      this.settings.noise.blend = this.noiseBlend.value;
      this.settings.noise.scale = parseFloat(this.noiseScale.value);
      this.settings.noise.speed = parseFloat(this.noiseSpeed.value);
      this.settings.noise.alpha = parseFloat(this.noiseAlpha.value);
    };

    ['change', 'input'].forEach(evt => {
      this.colorMode.addEventListener(evt, update);
      this.intensity.addEventListener(evt, update);
      this.smoothing.addEventListener(evt, update);
      this.strobeSensitivity.addEventListener(evt, update);
      this.noiseBlend.addEventListener(evt, update);
      this.noiseScale.addEventListener(evt, update);
      this.noiseSpeed.addEventListener(evt, update);
      this.noiseAlpha.addEventListener(evt, update);
    });
    this.strobe.addEventListener('change', e => {
      update();
      const show = e.target.checked;
      this.strobeSensLabel.style.display = show ? 'flex' : 'none';
    });
    this.noise.addEventListener('change', update);

    update();
    this.strobeSensLabel.style.display = this.strobe.checked ? 'flex' : 'none';
  }
}
