import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';
import { PlatformConfig } from '../types';

import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export async function downloadFont(
  url: string,
  destPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download font: ${response.statusText} (${response.status})`);
  }

  const contentLength = response.headers.get('content-length');
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
  
  if (!response.body) {
    throw new Error('Response body is null');
  }

  const writer = fs.createWriteStream(destPath);
  let receivedBytes = 0;

  // Convert Web Stream to Node Readable stream
  // @ts-ignore - response.body is a web stream in Node 18+
  const readable = Readable.fromWeb(response.body);

  // Use an Async Generator to report progress without breaking backpressure
  async function* progressReporter(source: AsyncIterable<any>) {
    for await (const chunk of source) {
      receivedBytes += chunk.length;
      if (totalBytes > 0 && onProgress) {
        onProgress(receivedBytes / totalBytes);
      }
      yield chunk;
    }
  }

  // Use pipeline to automatically handle memory backpressure and prevent OOM
  await pipeline(readable, progressReporter, writer);
}

function findFilesRecursively(dir: string, extFilter: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFilesRecursively(filePath, extFilter));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extFilter.includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function installFont(zipPath: string, config: PlatformConfig): Promise<boolean> {
  const { platform, fontDest, tmpDir } = config;
  
  try {
    // Clear and create temp directory
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });

    // Extract using system unzip first (to avoid OOM on Termux), fallback to adm-zip
    try {
      await execAsync(`unzip -q -o "${zipPath}" -d "${tmpDir}"`);
    } catch (e) {
      const zip = new AdmZip(zipPath);
      await new Promise<void>((resolve, reject) => {
        zip.extractAllToAsync(tmpDir, true, false, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    const fontFiles = findFilesRecursively(tmpDir, ['.ttf', '.otf']);
    if (fontFiles.length === 0) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      return false;
    }

    if (platform === 'termux') {
      // Find the best single font file candidate for Termux
      let candidate = fontFiles.find(f => path.basename(f).toLowerCase().includes('regular'));
      if (!candidate) {
        candidate = fontFiles.find(f => f.endsWith('.ttf'));
      }
      if (!candidate) {
        candidate = fontFiles.find(f => f.endsWith('.otf'));
      }

      if (candidate) {
        const destDir = path.dirname(fontDest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(candidate, fontDest);

        // Reload Termux settings
        try {
          await execAsync('termux-reload-settings');
        } catch {
          // Ignore if termux-reload-settings is not in PATH or fails
        }
      } else {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return false;
      }
    } else if (platform === 'macos' || platform === 'linux') {
      if (!fs.existsSync(fontDest)) {
        fs.mkdirSync(fontDest, { recursive: true });
      }

      for (const file of fontFiles) {
        const targetPath = path.join(fontDest, path.basename(file));
        fs.copyFileSync(file, targetPath);
      }

      if (platform === 'linux') {
        try {
          await execAsync('fc-cache -f');
        } catch {
          // Ignore if fc-cache fails
        }
      }
    }

    // Cleanup temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return true;
  } catch (err) {
    console.error('Error installing font:', err);
    // Cleanup on error
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    return false;
  }
}
