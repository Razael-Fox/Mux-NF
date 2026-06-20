import fs from 'fs';
import path from 'path';
import { FontAsset } from '../types';

const API_URL = 'https://api.github.com/repos/ryanoasis/nerd-fonts/releases/latest';

export async function fetchFontsFromGitHub(cacheDir: string): Promise<FontAsset[]> {
  const response = await fetch(API_URL, {
    headers: {
      'User-Agent': 'mux-nf/2.0.0',
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch font release: ${response.statusText} (${response.status})`);
  }

  const data = (await response.json()) as any;
  if (!data || !Array.isArray(data.assets)) {
    throw new Error('Invalid response structure from GitHub API');
  }

  const assets: FontAsset[] = data.assets
    .filter((asset: any) => asset.name && asset.name.endsWith('.zip'))
    .map((asset: any) => {
      const name = asset.name;
      const downloadUrl = asset.browser_download_url;
      const isCached = fs.existsSync(path.join(cacheDir, name));
      return { name, downloadUrl, isCached };
    });

  return assets;
}
