import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../theme';

export interface MainMenuProps {
  onSelect: (option: 'install' | 'switch' | 'clear' | 'logs' | 'backup' | 'restore' | 'exit') => void;
}

export function MainMenu({ onSelect }: MainMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const options = [
    { label: 'Install New Fonts (Fetch from GitHub)', value: 'install' as const },
    { label: 'Switch Active Font (Select from Cache)', value: 'switch' as const },
    { label: 'View Logs', value: 'logs' as const },
    { label: 'Backup Profile', value: 'backup' as const },
    { label: 'Restore Profile', value: 'restore' as const },
    { label: 'Clear Cache', value: 'clear' as const },
    { label: 'Exit', value: 'exit' as const },
  ];

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(options[selectedIndex].value);
    }
  });

  return (
    <Box flexDirection="column" paddingX={2} marginY={1}>
      <Text color={theme.accent} bold>Main Menu:</Text>
      <Box flexDirection="column" marginTop={1}>
        {options.map((opt, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <Box key={opt.value} flexDirection="row">
              <Text color={isSelected ? theme.secondary : theme.text} bold={isSelected}>
                {isSelected ? ' ❯ ' : '   '}
                {opt.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Box marginTop={1}>
        <Text color={theme.dim}>Use Arrow keys to navigate • Enter to select</Text>
      </Box>
    </Box>
  );
}
