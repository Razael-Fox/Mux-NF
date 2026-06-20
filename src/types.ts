export type Platform = 'termux' | 'macos' | 'linux' | 'unknown';

export interface PlatformConfig {
  platform: Platform;
  fontDest: string;
  cacheDir: string;
  tmpDir: string;
}

export interface FontAsset {
  name: string;
  downloadUrl: string;
  isCached: boolean;
}

export interface CLIArgs {
  fonts: string[];
  clearCache: boolean;
  help: boolean;
}
