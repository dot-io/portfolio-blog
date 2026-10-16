// WCAG 2 contrast helpers. Used by astro.config.mjs to lift Shiki's Solarized
// token colours to AA, and the source of the adjusted accents in global.css.

const channels = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const toHex = (rgb) =>
  "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

const luminance = (hex) => {
  const [r, g, b] = channels(hex)
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Mix `fg` toward `toward` in 1% steps (the same sRGB interpolation as CSS
// color-mix) until it reaches `min` against `bg`. Colours that already pass
// come back unchanged, so the palette moves only as far as it has to.
export const ensureContrast = (fg, bg, toward, min = 4.5) => {
  const from = channels(fg.slice(0, 7));
  const to = channels(toward);
  for (let pct = 0; pct <= 100; pct += 1) {
    const mixed = toHex(from.map((c, i) => c + ((to[i] - c) * pct) / 100));
    // a hair of margin so browser rounding cannot tip a colour under the line
    if (contrast(mixed, bg) >= min + 0.05) return mixed;
  }
  return toward;
};
