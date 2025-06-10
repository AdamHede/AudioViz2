import AppController from './core/AppController.js';

window.addEventListener('DOMContentLoaded', () => {
  const elements = {
    fileInput: document.getElementById('fileInput'),
    playBtn: document.getElementById('playBtn'),
    stopBtn: document.getElementById('stopBtn'),
    downloadBtn: document.getElementById('downloadCue'),
    canvas: document.getElementById('canvas'),
    settingsPanel: document.getElementById('settingsPanel'),
  };
  new AppController(elements);
});
