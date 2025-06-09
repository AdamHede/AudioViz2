import AppController from './core/AppController.js';

window.addEventListener('DOMContentLoaded', () => {
  const elements = {
    fileInput: document.getElementById('fileInput'),
    playBtn: document.getElementById('playBtn'),
    stopBtn: document.getElementById('stopBtn'),
    canvas: document.getElementById('canvas'),
  };
  new AppController(elements);
});
