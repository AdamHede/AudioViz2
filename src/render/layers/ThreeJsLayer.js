import Layer from './Layer.js';
import VisualizerThree from '../VisualizerThree.js';

export default class ThreeJsLayer extends Layer {
  constructor(canvas, numBars, text = 'AudioViz') {
    super();
    this.visualizer = new VisualizerThree(canvas, numBars, text);
  }

  render(data, settings) {
    const { buckets, beat } = data;
    this.visualizer.drawFrame(buckets, settings, beat);
  }
}
