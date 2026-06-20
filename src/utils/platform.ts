import os from 'os';
import path from 'path';
import fs from 'fs';
import { PlatformConfig } from '../types';

export function detectPlatform(): PlatformConfig {
  const home = os.homedir();
  
  // Termux detection: check if /data/data/com.termux exists
  if (fs.existsSync('/data/data/com.termux')) {
    const termuxDir = path.join(home, '.termux');
    return {
      platform: 'termux',
      fontDest: path.join(termuxDir, 'font.ttf'),
      cacheDir: path.join(termuxDir, 'fonts_cache'),
      tmpDir: path.join(termuxDir, 'tmp_font'),
    };
  }
  
  const platformName = os.platform();
  if (platformName === 'darwin') {
    return {
      platform: 'macos',
      fontDest: path.join(home, 'Library/Fonts/NerdFonts'),
      cacheDir: path.join(home, '.cache', 'mux-nf'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
    };
  } else if (platformName === 'linux') {
    return {
      platform: 'linux',
      fontDest: path.join(home, '.local', 'share', 'fonts', 'NerdFonts'),
      cacheDir: path.join(home, '.cache', 'mux-nf'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
    };
  } else {
    return {
      platform: 'unknown',
      fontDest: '',
      cacheDir: path.join(os.tmpdir(), 'mux-nf-cache'),
      tmpDir: path.join(os.tmpdir(), 'mux-nf'),
    };
  }
}

export function ensureDirs(config: PlatformConfig) {
  if (config.cacheDir) {
    fs.mkdirSync(config.cacheDir, { recursive: true });
  }
}
