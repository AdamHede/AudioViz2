import AppController from './core/AppController.js';

window.addEventListener('DOMContentLoaded', () => {
  const elements = {
    fileInput: document.getElementById('fileInput'),
    playBtn: document.getElementById('playBtn'),
    stopBtn: document.getElementById('stopBtn'),
    strobeToggle: document.getElementById('strobeToggle'),
    canvas: document.getElementById('canvas'),
  };
  new AppController(elements);
});
