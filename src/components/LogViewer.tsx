import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../theme';
import { readLogs, clearLogs } from '../utils/logger';

export interface LogViewerProps {
  logFile: string;
  onClose: () => void;
}

export function LogViewer({ logFile, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs(readLogs(logFile));
  }, [logFile]);

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onClose();
    } else if (input === 'c') {
      clearLogs(logFile);
      setLogs([]);
    }
  });

  const displayLogs = logs.slice(-15); // Show last 15 logs

  return (
    <Box flexDirection="column" paddingX={2} marginY={1}>
      <Text color={theme.accent} bold>Activity Logs:</Text>
      <Box flexDirection="column" borderStyle="round" borderColor={theme.secondary} padding={1}>
        {displayLogs.length === 0 ? (
          <Text color={theme.dim}>No logs found.</Text>
        ) : (
          displayLogs.map((log, i) => <Text key={i}>{log}</Text>)
        )}
      </Box>
      <Box marginTop={1}>
        <Text color={theme.dim}>Press [q] or [esc] to go back • [c] to clear logs</Text>
      </Box>
    </Box>
  );
}
