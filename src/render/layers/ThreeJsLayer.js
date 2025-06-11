import Layer from './Layer.js';
import VisualizerThree from '../VisualizerThree.js';

export default class ThreeJsLayer extends Layer {
  constructor(canvas, numBars) {
    super();
    this.visualizer = new VisualizerThree(canvas, numBars);
  }

  render(data, settings) {
    const { buckets, beat } = data;
    this.visualizer.drawFrame(buckets, settings, beat);
  }
}
