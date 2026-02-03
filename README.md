# Obsidian Auto Accent

Automatically switches Obsidian's accent color based on your system's light or dark theme.

## Features

- **System-Aware**: Automatically detects your system's color scheme (Light/Dark).
- **Customizable**: Set different accent colors for light and dark modes in the plugin settings.
- **Native Experience**: Integrates seamlessly with Obsidian's UI using native CSS variables.

## Installation

### From GitHub
1. Download the latest release (`obsidian-auto-accent.zip`).
2. Extract the contents into your vault's plugin folder: `<vault>/.obsidian/plugins/obsidian-auto-accent/`.
3. Reload Obsidian and enable the plugin in **Settings → Community plugins**.

### Manual Installation (Development)
1. Clone this repository.
2. Run `bun install` to install dependencies.
3. Run `bun run build` to compile the plugin.
4. Copy `main.js` and `manifest.json` to your plugin folder.

## Settings

Go to **Settings → Auto accent** to configure your preferred colors:
- **Light mode accent**: The color applied when your system is in light mode.
- **Dark mode accent**: The color applied when your system is in dark mode.

## License

This project is licensed under the [MIT License](LICENSE).
