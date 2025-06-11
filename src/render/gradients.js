// Color gradient library accessible across the app
// Each gradient is an array of hex color stops
export const gradients = {
  Sunset: ['#ff5e6c', '#ffc371'],
  Ocean: ['#2193b0', '#6dd5ed'],
  Forest: ['#5a3f37', '#2c7744'],
  Fire: ['#f83600', '#f9d423'],
  Sky: ['#2980b9', '#6dd5fa'],
  Candy: ['#d3959b', '#bfe6ba'],
  Heatmap: ['#ff9966', '#ff5e62'],
  Pastel: ['#a1c4fd', '#c2e9fb'],
  Neon: ['#00f260', '#0575e6'],
  Aurora: ['#da4453', '#89216b'],
};

// Convert hex color to RGB object
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Convert RGB object back to hex string
function rgbToHex({ r, g, b }) {
  const toHex = v => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Get interpolated color from gradient.
 * @param {string} name - gradient name
 * @param {number} t - value between 0 and 1
 * @returns {string} hex color
 */
export function colorAt(name, t) {
  const stops = gradients[name];
  if (!stops) return '#ffffff';
  const n = stops.length - 1;
  const pos = Math.min(Math.max(t, 0), 1) * n;
  const i = Math.floor(pos);
  const frac = pos - i;
  const c1 = hexToRgb(stops[i]);
  const c2 = hexToRgb(stops[Math.min(i + 1, n)]);
  const rgb = {
    r: Math.round(c1.r + (c2.r - c1.r) * frac),
    g: Math.round(c1.g + (c2.g - c1.g) * frac),
    b: Math.round(c1.b + (c2.b - c1.b) * frac),
  };
  return rgbToHex(rgb);
}
