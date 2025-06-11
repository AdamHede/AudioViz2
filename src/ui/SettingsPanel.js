export default class SettingsPanel {
  constructor(container, settings) {
    this.settings = settings;
    this.container = container;
    this.onTextChange = null;
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
    this.noiseToggle = this.container.querySelector('#noiseToggle');
    this.noiseBlend = this.container.querySelector('#noiseBlend');
    this.noiseScale = this.container.querySelector('#noiseScale');
    this.noiseSpeed = this.container.querySelector('#noiseSpeed');
    this.textInput = this.container.querySelector('#textContent');
    this.textLabel = this.container.querySelector('#textContentLabel');

    const update = () => {
      this.settings.colorMode = this.colorMode.value;
      this.settings.intensity = parseFloat(this.intensity.value);
      this.settings.smoothing = parseFloat(this.smoothing.value);
      this.settings.strobe = this.strobe.checked;
      this.settings.strobeSensitivity = parseFloat(this.strobeSensitivity.value);
      if (this.noiseToggle) this.settings.noiseEnabled = this.noiseToggle.checked;
      if (this.noiseBlend) this.settings.noiseBlend = this.noiseBlend.value;
      if (this.noiseScale) this.settings.noiseScale = parseFloat(this.noiseScale.value);
      if (this.noiseSpeed) this.settings.noiseSpeed = parseFloat(this.noiseSpeed.value);
      if (this.textInput) {
        this.settings.textContent = this.textInput.value;
      }
    };

    ['change', 'input'].forEach(evt => {
      this.colorMode.addEventListener(evt, update);
      this.intensity.addEventListener(evt, update);
      this.smoothing.addEventListener(evt, update);
      this.strobeSensitivity.addEventListener(evt, update);
      if (this.noiseToggle) this.noiseToggle.addEventListener(evt, update);
      if (this.noiseBlend) this.noiseBlend.addEventListener(evt, update);
      if (this.noiseScale) this.noiseScale.addEventListener(evt, update);
      if (this.noiseSpeed) this.noiseSpeed.addEventListener(evt, update);
      if (this.textInput) {
        this.textInput.addEventListener(evt, e => {
          update();
          if (this.onTextChange) this.onTextChange(e.target.value);
        });
      }
    });
    this.strobe.addEventListener('change', e => {
      update();
      const show = e.target.checked;
      this.strobeSensLabel.style.display = show ? 'flex' : 'none';
    });

    update();
    this.strobeSensLabel.style.display = this.strobe.checked ? 'flex' : 'none';
    if (this.textLabel) {
      this.textLabel.style.display = 'none';
    }
  }

  /** Show or hide the text input for the 3D text scene */
  toggleTextInput(show) {
    if (this.textLabel) {
      this.textLabel.style.display = show ? 'flex' : 'none';
    }
  }

  /** Bind callback for when text content changes */
  bindTextChange(handler) {
    this.onTextChange = handler;
  }
}
