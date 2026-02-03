/**
 * Converts a hex color to HSL values
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { h: 0, s: 0, l: 0 };
  }

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Checks if the system is in dark mode
 */
export function isSystemDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Applies the accent color by setting CSS variables on document body
 */
export function applyAccentColor(hex: string): void {
  const { h, s, l } = hexToHsl(hex);
  document.body.style.setProperty("--accent-h", h.toString());
  document.body.style.setProperty("--accent-s", `${s}%`);
  document.body.style.setProperty("--accent-l", `${l}%`);
}

/**
 * Clears custom accent color styles
 */
export function clearAccentColor(): void {
  document.body.style.removeProperty("--accent-h");
  document.body.style.removeProperty("--accent-s");
  document.body.style.removeProperty("--accent-l");
}
