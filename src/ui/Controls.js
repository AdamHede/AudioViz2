export default class Controls {
  constructor(fileInput, playBtn, stopBtn, downloadBtn) {
    this.fileInput = fileInput;
    this.playBtn = playBtn;
    this.stopBtn = stopBtn;
    this.downloadBtn = downloadBtn;
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

  enable() {
    this.playBtn.disabled = false;
    this.stopBtn.disabled = false;
    this.downloadBtn.disabled = false;
  }

  setDownloadEnabled(enabled) {
    this.downloadBtn.disabled = !enabled;
  }
}
