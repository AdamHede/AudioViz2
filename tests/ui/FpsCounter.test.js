import FpsCounter from '../../src/ui/FpsCounter.js';

describe('FpsCounter', () => {
  test('updates element after one second', () => {
    const times = [0, 100, 200, 300, 400, 1000];
    let idx = 0;
    const perf = { now: () => times[idx++] };
    document.body.innerHTML = '<div id="fps"></div>';
    const el = document.getElementById('fps');
    const counter = new FpsCounter(el, perf);
    for (let i = 0; i < times.length; i++) {
      counter.tick();
    }
    expect(el.textContent).toBe('FPS: 5');
  });

  test('reset clears text', () => {
    document.body.innerHTML = '<div id="fps"></div>';
    const el = document.getElementById('fps');
    const counter = new FpsCounter(el, { now: () => 0 });
    counter.tick();
    counter.reset();
    expect(el.textContent).toBe('FPS: 0');
  });
});
