import React, { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import fs from 'fs';
import path from 'path';
import { detectPlatform, ensureDirs } from './utils/platform';
import { parseArgs, showHelp } from './utils/args';
import { fetchFontsFromGitHub } from './utils/github';
import { downloadFont, installFont } from './utils/downloader';
import { FontAsset, PlatformConfig } from './types';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { SearchableList } from './components/SearchableList';
import { Spinner } from './components/Spinner';
import { ConfirmPrompt } from './components/ConfirmPrompt';
import { theme } from './theme';

interface AppProps {
  config: PlatformConfig;
}

function App({ config }: AppProps) {
  const [screen, setScreen] = useState<'menu' | 'fetching' | 'install-select' | 'processing' | 'switch-select' | 'clearing' | 'clear-confirm' | 'exit'>('menu');
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [selectedFontsToProcess, setSelectedFontsToProcess] = useState<FontAsset[]>([]);
  const [cachedFonts, setCachedFonts] = useState<FontAsset[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Active process state
  const [processIndex, setProcessIndex] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState<'downloading' | 'installing' | 'completed' | 'failed' | 'cooling'>('downloading');
  const [processFontName, setProcessFontName] = useState('');
  
  // Clear Cache state
  const [clearedMsg, setClearedMsg] = useState('');

  const { exit } = useApp();

  // Fetch fonts for installation
  const handleStartFetch = async () => {
    setScreen('fetching');
    setErrorMsg(null);
    try {
      const fetched = await fetchFontsFromGitHub(config.cacheDir);
      setFonts(fetched);
      setScreen('install-select');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch fonts');
      setScreen('menu');
    }
  };

  // Select fonts to install
  const handleConfirmInstall = (selected: FontAsset[]) => {
    if (selected.length === 0) {
      setScreen('menu');
      return;
    }
    setSelectedFontsToProcess(selected);
    setScreen('processing');
  };

  // Run the processing task (download and install)
  useEffect(() => {
    if (screen !== 'processing' || selectedFontsToProcess.length === 0) return;
    
    let active = true;
    
    const processAll = async () => {
      for (let i = 0; i < selectedFontsToProcess.length; i++) {
        if (!active) break;
        const font = selectedFontsToProcess[i];
        
        setProcessIndex(i);
        setProcessFontName(font.name);
        
        const zipPath = path.join(config.cacheDir, font.name);
        
        // 1. Download if not cached
        if (!fs.existsSync(zipPath)) {
          setProcessStatus('downloading');
          setProcessProgress(0);
          try {
            await downloadFont(font.downloadUrl, zipPath, (prog) => {
              if (active) setProcessProgress(prog);
            });
          } catch (err) {
            if (active) {
              setProcessStatus('failed');
              await new Promise(r => setTimeout(r, 2000));
            }
            continue;
          }
        } else {
          setProcessProgress(1.0);
        }

        // 2. Install
        if (!active) break;
        setProcessStatus('installing');
        const success = await installFont(zipPath, config);
        
        if (!success && active) {
          setProcessStatus('failed');
          await new Promise(r => setTimeout(r, 2000));
        }

        // Add cooling down period if there are more fonts to process
        if (i < selectedFontsToProcess.length - 1 && active) {
          setProcessStatus('cooling');
          await new Promise(r => setTimeout(r, 3000));
        }
      }

      if (active) {
        setProcessStatus('completed');
        // Return to menu after 2 seconds
        await new Promise(r => setTimeout(r, 2000));
        setScreen('menu');
      }
    };

    processAll();

    return () => {
      active = false;
    };
  }, [screen, selectedFontsToProcess]);

  // Load cache for switching
  const handleStartSwitch = () => {
    setErrorMsg(null);
    try {
      if (!fs.existsSync(config.cacheDir)) {
        fs.mkdirSync(config.cacheDir, { recursive: true });
      }
      const files = fs.readdirSync(config.cacheDir).filter(f => f.endsWith('.zip'));
      if (files.length === 0) {
        setErrorMsg('No fonts found in cache. Please install new fonts first.');
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }
      
      const cached = files.map(f => ({
        name: f,
        downloadUrl: '',
        isCached: true,
      }));
      setCachedFonts(cached);
      setScreen('switch-select');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read cache');
    }
  };

  // Confirm Switch font
  const handleConfirmSwitch = (selected: FontAsset[]) => {
    if (selected.length === 0) {
      setScreen('menu');
      return;
    }
    const font = selected[0];
    setSelectedFontsToProcess([font]);
    setScreen('processing');
  };

  // Handle Clear Cache
  useEffect(() => {
    if (screen !== 'clearing') return;
    
    const runClear = async () => {
      try {
        if (fs.existsSync(config.cacheDir)) {
          const files = fs.readdirSync(config.cacheDir);
          for (const file of files) {
            fs.rmSync(path.join(config.cacheDir, file), { recursive: true, force: true });
          }
        }
        setClearedMsg('Cache cleared successfully!');
      } catch (err: any) {
        setClearedMsg(`Failed to clear cache: ${err.message}`);
      }
      
      await new Promise(r => setTimeout(r, 1500));
      setScreen('menu');
      setClearedMsg('');
    };

    runClear();
  }, [screen]);

  // Handle exit
  useEffect(() => {
    if (screen === 'exit') {
      exit();
    }
  }, [screen, exit]);

  // Render different states
  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      
      {errorMsg && (
        <Box paddingX={2} marginY={1} borderStyle="round" borderColor={theme.error}>
          <Text color={theme.error} bold>Error: {errorMsg}</Text>
        </Box>
      )}

      {screen === 'menu' && (
        <MainMenu
          onSelect={(option) => {
            if (option === 'install') handleStartFetch();
            else if (option === 'switch') handleStartSwitch();
            else if (option === 'clear') setScreen('clear-confirm');
            else if (option === 'exit') setScreen('exit');
          }}
        />
      )}

      {screen === 'fetching' && (
        <Box paddingX={2} marginY={1}>
          <Spinner label="Fetching font list from GitHub..." />
        </Box>
      )}

      {screen === 'install-select' && (
        <SearchableList
          title="Select Fonts to Install (Space to select multiple, cached in green)"
          fonts={fonts}
          isMultiSelect={true}
          onConfirm={handleConfirmInstall}
          onCancel={() => setScreen('menu')}
        />
      )}

      {screen === 'switch-select' && (
        <SearchableList
          title="Select a Cached Font to Activate"
          fonts={cachedFonts}
          isMultiSelect={false}
          onConfirm={handleConfirmSwitch}
          onCancel={() => setScreen('menu')}
        />
      )}

      {screen === 'processing' && (
        <Box flexDirection="column" paddingX={2} marginY={1}>
          <Text color={theme.accent} bold>Processing Fonts:</Text>
          <Box flexDirection="column" marginY={1} borderStyle="round" borderColor={theme.secondary} padding={1}>
            <Text bold>
              [{processIndex + 1}/{selectedFontsToProcess.length}] {processFontName}
            </Text>
            
            <Box marginTop={1}>
              {processStatus === 'downloading' && (
                <Box flexDirection="column">
                  <Text color={theme.warning}>Downloading zip package...</Text>
                  <ProgressBar progress={processProgress} />
                </Box>
              )}
              {processStatus === 'installing' && (
                <Spinner label="Extracting and installing font family..." color={theme.warning} />
              )}
              {processStatus === 'cooling' && (
                <Spinner label="Cooling down RAM and CPU... (Menunggu ruang RAM dan CPU...)" color={theme.primary} />
              )}
              {processStatus === 'completed' && (
                <Text color={theme.success} bold>✔ Completed processing all fonts!</Text>
              )}
              {processStatus === 'failed' && (
                <Text color={theme.error} bold>✘ Failed to process font.</Text>
              )}
            </Box>
          </Box>
          
          {config.platform === 'termux' && selectedFontsToProcess.length > 1 && (
            <Box borderStyle="round" borderColor={theme.warning} paddingX={1} marginTop={1}>
              <Text color={theme.warning}>
                Note: On Termux, only one font is active at a time. All selected will be cached, but only the last one will be active.
              </Text>
            </Box>
          )}
        </Box>
      )}

      {screen === 'clearing' && (
        <Box paddingX={2} marginY={1}>
          <Spinner label={clearedMsg || 'Clearing cache directory...'} />
        </Box>
      )}

      {screen === 'clear-confirm' && (
        <ConfirmPrompt
          message="Are you sure you want to clear the font cache?"
          onConfirm={() => setScreen('clearing')}
          onCancel={() => setScreen('menu')}
        />
      )}
    </Box>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const width = 30;
  const completedWidth = Math.round(width * progress);
  const remainingWidth = width - completedWidth;
  const percentage = Math.round(progress * 100);
  
  return (
    <Box flexDirection="row" marginTop={1}>
      <Text color={theme.secondary} bold>
        {'█'.repeat(completedWidth)}
        <Text color={theme.dim}>{'░'.repeat(remainingWidth)}</Text>
        {` ${percentage}%`}
      </Text>
    </Box>
  );
}

async function main() {
  const config = detectPlatform();
  ensureDirs(config);

  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.help) {
    showHelp();
    process.exit(0);
  }

  if (parsed.clearCache) {
    console.log('Clearing cache...');
    if (fs.existsSync(config.cacheDir)) {
      const files = fs.readdirSync(config.cacheDir);
      for (const file of files) {
        fs.rmSync(path.join(config.cacheDir, file), { recursive: true, force: true });
      }
    }
    console.log('Cache cleared.');
    if (parsed.fonts.length === 0) {
      process.exit(0);
    }
  }

  if (parsed.fonts.length > 0) {
    console.log('Fetching available fonts from GitHub...');
    let availableFonts: FontAsset[] = [];
    try {
      availableFonts = await fetchFontsFromGitHub(config.cacheDir);
    } catch (err: any) {
      console.error('Error fetching font list:', err.message);
      process.exit(1);
    }

    console.log(`Matching specified fonts...`);
    const matches: FontAsset[] = [];
    for (const fontName of parsed.fonts) {
      const nameLower = fontName.toLowerCase();
      const matched = availableFonts.find(f => {
        const fn = f.name.toLowerCase();
        return fn === nameLower || fn === `${nameLower}.zip` || fn.startsWith(nameLower);
      });

      if (matched) {
        matches.push(matched);
      } else {
        console.error(`Warning: Font not found matching "${fontName}"`);
      }
    }

    if (matches.length === 0) {
      console.error('No matching fonts found to install.');
      process.exit(1);
    }

    console.log(`Starting installation of ${matches.length} fonts...`);
    for (let i = 0; i < matches.length; i++) {
      const font = matches[i];
      console.log(`[${i + 1}/${matches.length}] Processing: ${font.name}`);
      const zipPath = path.join(config.cacheDir, font.name);

      if (!fs.existsSync(zipPath)) {
        console.log(`Downloading ${font.name}...`);
        try {
          await downloadFont(font.downloadUrl, zipPath, (prog) => {
            const pct = Math.round(prog * 100);
            process.stdout.write(`\rProgress: ${pct}%`);
          });
          process.stdout.write('\n');
        } catch (err: any) {
          console.error(`Failed to download ${font.name}: ${err.message}`);
          continue;
        }
      } else {
        console.log('Using cached zip file.');
      }

      console.log('Installing...');
      const success = await installFont(zipPath, config);
      if (success) {
        console.log(`Successfully installed ${font.name}`);
      } else {
        console.error(`Failed to install ${font.name}`);
      }

      if (i < matches.length - 1) {
        console.log('Menunggu RAM dan CPU untuk memberi ruang sebelum font berikutnya...');
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    console.log('All done!');
    process.exit(0);
  }

  // Interactive Mode
  // Enter alternate screen buffer to prevent scroll duplication
  process.stdout.write('\x1b[?1049h');
  
  const { waitUntilExit } = render(<App config={config} />);
  
  await waitUntilExit();
  
  // Exit alternate screen buffer
  process.stdout.write('\x1b[?1049l');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.stdout.write('\x1b[?1049l'); // Ensure we exit alt screen on fatal error
  process.exit(1);
});
