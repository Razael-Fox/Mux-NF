import os from 'os';
import path from 'path';
import fs from 'fs';
import { PlatformConfig } from '../types';

export function detectPlatform(): PlatformConfig {
  const home = os.homedir();
  
  // Termux detection: check if /data/data/com.termux exists
  if (fs.existsSync('/data/data/com.termux')) {
    const termuxDir = path.join(home, '.termux');
    const confDir = path.join(home, '.mux-nf');
    return {
      platform: 'termux',
      fontDest: path.join(termuxDir, 'font.ttf'),
      cacheDir: path.join(termuxDir, 'fonts_cache'),
      tmpDir: path.join(termuxDir, 'tmp_font'),
      logFile: path.join(confDir, 'logs.txt'),
      configFile: path.join(confDir, 'config.json'),
    };
  }
  
  const platformName = os.platform();
  if (platformName === 'darwin') {
    const confDir = path.join(home, '.config', 'mux-nf');
    return {
      platform: 'macos',
      fontDest: path.join(home, 'Library/Fonts/NerdFonts'),
      cacheDir: path.join(home, '.cache', 'mux-nf'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
      logFile: path.join(confDir, 'logs.txt'),
      configFile: path.join(confDir, 'config.json'),
    };
  } else if (platformName === 'linux') {
    const confDir = path.join(home, '.config', 'mux-nf');
    return {
      platform: 'linux',
      fontDest: path.join(home, '.local', 'share', 'fonts', 'NerdFonts'),
      cacheDir: path.join(home, '.cache', 'mux-nf'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
      logFile: path.join(confDir, 'logs.txt'),
      configFile: path.join(confDir, 'config.json'),
    };
  } else {
    return {
      platform: 'unknown',
      fontDest: '',
      cacheDir: path.join(os.tmpdir(), 'mux-nf-cache'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
      logFile: path.join(os.tmpdir(), 'mux-nf-logs.txt'),
      configFile: path.join(os.tmpdir(), 'mux-nf-config.json'),
    };
  }
}

export function ensureDirs(config: PlatformConfig) {
  if (config.cacheDir) fs.mkdirSync(config.cacheDir, { recursive: true });
  if (config.logFile) fs.mkdirSync(path.dirname(config.logFile), { recursive: true });
  if (config.configFile) fs.mkdirSync(path.dirname(config.configFile), { recursive: true });
}
