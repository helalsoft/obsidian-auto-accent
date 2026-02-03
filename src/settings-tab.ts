import { App, PluginSettingTab, Setting } from "obsidian";
import type AutoAccentPlugin from "./main";

export class AutoAccentSettingTab extends PluginSettingTab {
  plugin: AutoAccentPlugin;

  constructor(app: App, plugin: AutoAccentPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setHeading().setName("Auto accent settings");

    new Setting(containerEl)
      .setName("Light mode accent")
      .setDesc("Accent color used when system is in light mode")
      .addColorPicker((color) =>
        color
          .setValue(this.plugin.settings.lightAccent)
          .onChange(async (value) => {
            this.plugin.settings.lightAccent = value;
            await this.plugin.saveSettings();
            this.plugin.updateAccent();
          })
      );

    new Setting(containerEl)
      .setName("Dark mode accent")
      .setDesc("Accent color used when system is in dark mode")
      .addColorPicker((color) =>
        color
          .setValue(this.plugin.settings.darkAccent)
          .onChange(async (value) => {
            this.plugin.settings.darkAccent = value;
            await this.plugin.saveSettings();
            this.plugin.updateAccent();
          })
      );
  }
}
