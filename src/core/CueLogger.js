export default class CueLogger {
  constructor() {
    this.log = [];
    this.startTime = null;
  }

  // Reset the log and mark the start time
  start() {
    this.log = [];
    this.startTime = performance.now();
  }

  // Append a cue entry
  addEntry(timestampMs, bands) {
    if (this.startTime === null) return;
    const entry = {
      timestamp: timestampMs - this.startTime,
      bands: bands.map(v => Math.round(v * 100) / 100),
    };
    this.log.push(entry);
  }

  // Retrieve log data
  getLog() {
    return this.log;
  }

  // Trigger download of the log as a file
  download() {
    const date = new Date().toISOString().replace(/:/g, '-');
    const blob = new Blob([JSON.stringify(this.log)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visual_cue_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
