export default class Controls {
  constructor(fileInput, playBtn, stopBtn) {
    this.fileInput = fileInput;
    this.playBtn = playBtn;
    this.stopBtn = stopBtn;
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

  enable() {
    this.playBtn.disabled = false;
    this.stopBtn.disabled = false;
  }
}
