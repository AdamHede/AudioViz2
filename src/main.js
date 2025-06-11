import AppController from './core/AppController.js';

window.addEventListener('DOMContentLoaded', () => {
  const elements = {
    fileInput: document.getElementById('fileInput'),
    playBtn: document.getElementById('playBtn'),
    stopBtn: document.getElementById('stopBtn'),
    downloadBtn: document.getElementById('downloadCue'),
    canvas: document.getElementById('canvas'),
    overlay: document.getElementById('overlay'),
    settingsPanel: document.getElementById('settingsPanel'),
    fpsDisplay: document.getElementById('fpsDisplay'),
    sceneButtons: document.getElementById('sceneButtons'),
  };
  new AppController(elements);
});
