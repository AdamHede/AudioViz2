export default class Controls {
  constructor(fileInput, playBtn, stopBtn, downloadBtn, strobeToggle) {
    this.fileInput = fileInput;
    this.playBtn = playBtn;
    this.stopBtn = stopBtn;
    this.downloadBtn = downloadBtn;
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

  bindDownload(handler) {
    this.downloadBtn.addEventListener('click', handler);
  }

  bindStrobeToggle(handler) {
    this.strobeToggle.addEventListener('change', handler);
  }

  isStrobeEnabled() {
    return this.strobeToggle.checked;
  }

  setDownloadEnabled(enabled) {
    this.downloadBtn.disabled = !enabled;
  }

  enable() {
    this.playBtn.disabled = false;
    this.stopBtn.disabled = false;
  }
}
