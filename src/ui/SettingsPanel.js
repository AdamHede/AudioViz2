export default class SettingsPanel {
  constructor(container, settings, canvas) {
    this.settings = settings;
    this.container = container;
    this.canvas = canvas;
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
    this.bgColor = this.container.querySelector('#bgColor');

    const update = () => {
      this.settings.colorMode = this.colorMode.value;
      this.settings.intensity = parseFloat(this.intensity.value);
      this.settings.smoothing = parseFloat(this.smoothing.value);
      this.settings.strobe = this.strobe.checked;
      this.settings.strobeSensitivity = parseFloat(this.strobeSensitivity.value);
      this.settings.bgColor = this.bgColor.value;
      if (this.canvas) {
        this.canvas.style.backgroundColor = this.bgColor.value;
      }
    };

    ['change', 'input'].forEach(evt => {
      this.colorMode.addEventListener(evt, update);
      this.intensity.addEventListener(evt, update);
      this.smoothing.addEventListener(evt, update);
      this.strobeSensitivity.addEventListener(evt, update);
      this.bgColor.addEventListener(evt, update);
    });
    this.strobe.addEventListener('change', e => {
      update();
      const show = e.target.checked;
      this.strobeSensLabel.style.display = show ? 'flex' : 'none';
    });

    update();
    this.strobeSensLabel.style.display = this.strobe.checked ? 'flex' : 'none';
  }
}
