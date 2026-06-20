import fs from 'fs';

export interface AppConfig {
  activeProfile: string | null;
  cachedFonts: string[];
}

export function saveConfig(configFile: string, config: AppConfig) {
  try {
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  } catch (err) {
    // Silent fail
  }
}

export function loadConfig(configFile: string): AppConfig | null {
  try {
    if (!fs.existsSync(configFile)) return null;
    const content = fs.readFileSync(configFile, 'utf8');
    return JSON.parse(content) as AppConfig;
  } catch (err) {
    return null;
  }
}
