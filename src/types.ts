import { App, Vault } from "obsidian";

/**
 * Interface for internal Obsidian App properties not in the official API
 */
export interface InternalApp extends App {
    customCss: {
        setAccentColor(color: string): void;
        accentColor: string;
    };
    updateAccentColor?(): void;
}

/**
 * Interface for internal Obsidian Vault properties not in the official API
 */
export interface InternalVault extends Vault {
    configDir: string;
}
