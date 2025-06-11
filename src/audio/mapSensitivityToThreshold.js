export default function mapSensitivityToThreshold(value, base = 1.3) {
  if (value <= 0) return Infinity; // 0 => never triggers
  if (value >= 100) return 0; // 100 => always triggers
  return base * (1 - value / 100);
}
