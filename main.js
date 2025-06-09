const fileInput = document.getElementById('fileInput');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let audio = null;
let audioCtx = null;
let source = null;
let analyser = null;
let dataArray = null;
let animationId = null;
const NUM_BARS = 8;

function initAudio(file) {
  if (audio) {
    audio.pause();
    audio = null;
  }

  audio = new Audio(URL.createObjectURL(file));
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

function getBuckets() {
  const bufferLength = analyser.frequencyBinCount;
  const buckets = new Array(NUM_BARS).fill(0);
  const ranges = [];
  for (let i = 0; i <= NUM_BARS; i++) {
    ranges.push(Math.floor(Math.pow(bufferLength, i / NUM_BARS)));
  }

  analyser.getByteFrequencyData(dataArray);

  for (let i = 0; i < NUM_BARS; i++) {
    let sum = 0;
    const start = ranges[i];
    const end = ranges[i + 1];
    for (let j = start; j < end; j++) {
      sum += dataArray[j];
    }
    buckets[i] = sum / (end - start);
  }
  return buckets;
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  const buckets = getBuckets();
  const barWidth = width / NUM_BARS;

  for (let i = 0; i < NUM_BARS; i++) {
    const magnitude = buckets[i] / 255;
    const barHeight = magnitude * height;
    ctx.fillStyle = `hsl(${i * 40}, 100%, ${50 + magnitude * 50}%)`;
    ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
  }

  animationId = requestAnimationFrame(draw);
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    initAudio(file);
    playBtn.disabled = false;
    stopBtn.disabled = false;
  }
});

playBtn.addEventListener('click', () => {
  if (!audio) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audio.play();
  if (!animationId) {
    draw();
  }
});

stopBtn.addEventListener('click', () => {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  cancelAnimationFrame(animationId);
  animationId = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Automatically open file picker on load
window.addEventListener('load', () => {
  fileInput.click();
});
