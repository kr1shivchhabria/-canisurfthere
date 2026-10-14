// turns a score (0 to 100) into a color.
// hsl hue 0 is red and hue 120 is green, so score * 1.2 slides from red to green.
export function scoreColor(score, lightness = 40) {
  if (score == null) return '#8aa3b5'; // grey when there is no data
  return `hsl(${Math.round(score * 1.2)}, 72%, ${lightness}%)`;
}
