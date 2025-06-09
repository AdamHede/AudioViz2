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
    this.strobe = this.container.querySelector('#strobe');

    const update = () => {
      this.settings.colorMode = this.colorMode.value;
      this.settings.intensity = parseFloat(this.intensity.value);
      this.settings.smoothing = parseFloat(this.smoothing.value);
      this.settings.strobe = this.strobe.checked;
    };

    ['change', 'input'].forEach(evt => {
      this.colorMode.addEventListener(evt, update);
      this.intensity.addEventListener(evt, update);
      this.smoothing.addEventListener(evt, update);
    });
    this.strobe.addEventListener('change', update);

    update();
  }
}
