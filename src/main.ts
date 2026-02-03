import { Plugin } from "obsidian";
import { AutoAccentSettings, DEFAULT_SETTINGS } from "./settings";
import { AutoAccentSettingTab } from "./settings-tab";
import { applyAccentColor, isDarkMode } from "./accent-manager";

export default class AutoAccentPlugin extends Plugin {
  settings: AutoAccentSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    console.debug("Loading Obsidian Auto Accent Plugin");
    try {
        await this.loadSettings();

        this.addSettingTab(new AutoAccentSettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            console.debug("Auto Accent: Layout ready, initializing...");
            this.registerEvent(
              this.app.workspace.on("css-change", () => {
                console.debug("Auto Accent: CSS change detected");
                this.updateAccent();
              })
            );

            this.updateAccent();
        });
    } catch (e) {
        console.error("Auto Accent: Failed to load", e);
    }
  }

  onunload(): void {
    // No specific cleanup needed as we rely on Obsidian's internal state
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<AutoAccentSettings>);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  updateAccent(): void {
    const dark = isDarkMode();
    const color = dark ? this.settings.darkAccent : this.settings.lightAccent;
    void applyAccentColor(this.app, color);
  }
}
