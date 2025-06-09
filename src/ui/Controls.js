export default class Controls {
  constructor(fileInput, playBtn, stopBtn, strobeToggle) {
    this.fileInput = fileInput;
    this.playBtn = playBtn;
    this.stopBtn = stopBtn;
    this.strobeToggle = strobeToggle;
  }

  bindLoad(handler) {
    this.fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handler(file);
    });
  }

  bindPlay(handler) {
    this.playBtn.addEventListener('click', handler);
  }

  bindStop(handler) {
    this.stopBtn.addEventListener('click', handler);
  }

  bindStrobeChange(handler) {
    if (this.strobeToggle) {
      this.strobeToggle.addEventListener('change', e => handler(e.target.checked));
      handler(this.strobeToggle.checked);
    }
  }

  enable() {
    this.playBtn.disabled = false;
    this.stopBtn.disabled = false;
  }
}
