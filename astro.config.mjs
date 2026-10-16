// @ts-check
import { defineConfig } from 'astro/config';
import { bundledThemes } from 'shiki';

import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import { ensureContrast } from "./src/utils/contrast.mjs";

// Shiki's Solarized themes use the palette as published, where comments and
// several accents sit under 4.5:1. Shade each token colour toward black (light)
// or white (dark) until it passes against the theme's own background.
const accessible = async (name, toward) => {
  const theme = structuredClone((await bundledThemes[name]()).default);
  const bg = theme.colors["editor.background"];
  const fix = (/** @type {string} */ fg) => ensureContrast(fg, bg, toward);
  theme.colors["editor.foreground"] = fix(theme.colors["editor.foreground"]);
  for (const rule of theme.tokenColors ?? []) {
    if (rule.settings?.foreground) rule.settings.foreground = fix(rule.settings.foreground);
  }
  return theme;
};

// https://astro.build/config
export default defineConfig({
  site: "https://nateslab.cc",
  integrations: [preact(), mdx()],
  markdown: {
    // both themes are emitted; global.css swaps to the dark one under html.dark
    shikiConfig: {
      themes: {
        light: await accessible("solarized-light", "#000000"),
        dark: await accessible("solarized-dark", "#ffffff"),
      },
    },
  },
});
