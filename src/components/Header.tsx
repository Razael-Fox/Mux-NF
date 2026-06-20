import React from 'react';
import { Box, Text } from 'ink';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { theme } from '../theme';

// Read version dynamically once
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionPath = path.join(__dirname, '..', 'VERSION');

let cliVersion = '1.0.0 Stable';
try {
  cliVersion = fs.readFileSync(versionPath, 'utf-8').trim();
} catch (e) {
  // Use default if file is missing
}

export function Header() {
  const platform = os.platform();
  const device = platform === 'android' ? 'Termux' : 
                 platform === 'darwin' ? 'macOS' :
                 platform === 'linux' ? 'Linux' : 
                 platform === 'win32' ? 'Windows' : platform;
  const arch = os.arch();

  return (
    <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor={theme.primary} paddingX={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color={theme.secondary} bold>
          {`   __  __ _   ___  __   _  _ ___ \n` +
           `  |  \\/  | | | \\ \\/ /  | \\| | __|\n` +
           `  | |\\/| | |_| |>  <   | .\\\` | _| \n` +
           `  |_|  |_|\\__,_/_/\\_\\  |_|\\_|_|  `}
        </Text>
        <Box flexDirection="column" alignItems="flex-end" justifyContent="center">
          <Text color={theme.dim}>Version <Text color={theme.success} bold>{cliVersion}</Text></Text>
          <Text color={theme.dim}>Device <Text color={theme.primary} bold>{device} {arch}</Text></Text>
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
        <Text color={theme.primary} bold>Mux-NF Manager</Text>
        <Text color={theme.warning}>Modern • Animated • Interactive</Text>
      </Box>
    </Box>
  );
}
