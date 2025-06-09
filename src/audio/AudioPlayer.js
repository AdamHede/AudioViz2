export default class AudioPlayer {
  constructor() {
    this.audio = null;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.source = null;
  }

  load(file) {
    if (!file.type.startsWith('audio/')) {
      throw new Error('Invalid audio file');
    }
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(URL.createObjectURL(file));
    this.source = this.audioCtx.createMediaElementSource(this.audio);
  }

  connect(node) {
    if (this.source) {
      this.source.connect(node);
    }
  }

  play() {
    if (!this.audio) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.audio.play();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
