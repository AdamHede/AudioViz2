// Exponential smoothing for bar animations
export default function applySmoothing(prev, current, strength) {
  return prev * (1 - strength) + current * strength;
}
