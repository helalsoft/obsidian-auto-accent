import { App } from "obsidian";
import { InternalApp, InternalVault } from "./types";

/**
 * Checks if Obsidian is currently in dark mode
 */
export function isDarkMode(): boolean {
  return document.body.classList.contains("theme-dark");
}

/**
 * Converts a hex color to HSL values
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || result.length < 4) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1]!, 16) / 255;
  let g = parseInt(result[2]!, 16) / 255;
  let b = parseInt(result[3]!, 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Applies the accent color using Obsidian's internal API or fallback
 */
export async function applyAccentColor(app: App, hex: string): Promise<void> {
  const internalApp = app as InternalApp;
  try {
    // 1. Try internal API
    if (internalApp.customCss && typeof internalApp.customCss.setAccentColor === 'function') {
        if (internalApp.customCss.accentColor?.toLowerCase() === hex.toLowerCase()) return;
        internalApp.customCss.setAccentColor(hex);
        return;
    }
    
    // 2. Fallback: Manual CSS + Config Update
    console.debug("Auto Accent: customCss API missing. Using fallback.");
    
    // Apply visual styles immediately
    const { h, s, l } = hexToHsl(hex);
    document.body.style.setProperty("--accent-h", h.toString());
    document.body.style.setProperty("--accent-s", `${s}%`);
    document.body.style.setProperty("--accent-l", `${l}%`);

    // Persist to appearance.json
    const configDir = (app.vault as InternalVault).configDir;
    const configPath = `${configDir}/appearance.json`;
    
    try {
        let config: Record<string, unknown> = {};
        if (await app.vault.adapter.exists(configPath)) {
             const content = await app.vault.adapter.read(configPath);
             config = JSON.parse(content) as Record<string, unknown>;
        }
        
        if (config.accentColor !== hex) {
            config.accentColor = hex;
            await app.vault.adapter.write(configPath, JSON.stringify(config, null, 2));
            console.debug("Auto Accent: Updated appearance.json");
            
            // Try to trigger internal reload if possible, otherwise CSS vars handle it for now
            internalApp.updateAccentColor?.(); 
        }
    } catch (err) {
        console.error("Auto Accent: Failed to update appearance.json", err);
    }

  } catch (e) {
      console.error("Auto Accent: Failed to set accent color", e);
  }
}
