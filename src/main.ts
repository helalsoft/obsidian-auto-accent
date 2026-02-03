import { Plugin } from "obsidian";
import { AutoAccentSettings, DEFAULT_SETTINGS } from "./settings";
import { AutoAccentSettingTab } from "./settings-tab";
import { applyAccentColor, clearAccentColor, isSystemDarkMode } from "./accent-manager";

export default class AutoAccentPlugin extends Plugin {
  settings: AutoAccentSettings = DEFAULT_SETTINGS;
  private themeQuery: MediaQueryList | null = null;
  private boundThemeHandler: ((e: MediaQueryListEvent) => void) | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addSettingTab(new AutoAccentSettingTab(this.app, this));

    this.themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.boundThemeHandler = (e: MediaQueryListEvent) => {
      this.updateAccent(e.matches);
    };
    this.themeQuery.addEventListener("change", this.boundThemeHandler);

    this.updateAccent();
  }

  onunload(): void {
    if (this.themeQuery && this.boundThemeHandler) {
      this.themeQuery.removeEventListener("change", this.boundThemeHandler);
    }
    clearAccentColor();
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<AutoAccentSettings>);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  updateAccent(isDark?: boolean): void {
    const dark = isDark ?? isSystemDarkMode();
    const color = dark ? this.settings.darkAccent : this.settings.lightAccent;
    applyAccentColor(color);
  }
}
