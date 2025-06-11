export default class CueLogger {
  constructor(maxEntries = 36000) {
    this.maxEntries = maxEntries;
    this.reset();
  }

  // Reset log and mark a new start time
  reset(startTime = performance.now()) {
    this.startTime = startTime;
    this.log = [];
  }

  // Record band values for the current frame
  logFrame(bands, time = performance.now()) {
    if (this.log.length >= this.maxEntries) return;
    const timestamp = Math.round(time - this.startTime);
    const rounded = bands.map(v => Number(v.toFixed(2)));
    this.log.push({ timestamp, bands: rounded });
  }

  // Retrieve the full log
  getLog() {
    return this.log;
  }

  // Download the log as a JSON file
  download() {
    const pad = n => String(n).padStart(2, '0');
    const d = new Date();
    const name = `visual_cue_${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}.json`;
    const blob = new Blob([JSON.stringify(this.log)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
}
