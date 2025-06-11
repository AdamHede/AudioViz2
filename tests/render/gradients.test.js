import { gradients, colorAt } from '../../src/render/gradients.js';

describe('gradient library', () => {
  test('contains at least 10 gradients', () => {
    expect(Object.keys(gradients).length).toBeGreaterThanOrEqual(10);
  });

  test('colorAt interpolates first and last colors', () => {
    const name = 'Sunset';
    const first = colorAt(name, 0);
    const last = colorAt(name, 1);
    expect(first).toBe(gradients[name][0]);
    expect(last).toBe(gradients[name][gradients[name].length - 1]);
  });
});
