import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../theme';

export interface ConfirmPromptProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPrompt({ message, onConfirm, onCancel }: ConfirmPromptProps) {
  const [selected, setSelected] = useState<'no' | 'yes'>('no');
  
  useInput((input, key) => {
    if (key.leftArrow || key.rightArrow) {
      setSelected(prev => prev === 'yes' ? 'no' : 'yes');
    } else if (key.return) {
      if (selected === 'yes') onConfirm();
      else onCancel();
    } else if (input.toLowerCase() === 'y') {
      onConfirm();
    } else if (input.toLowerCase() === 'n') {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column" paddingX={2} marginY={1}>
      <Text color={theme.warning} bold>{message}</Text>
      <Box flexDirection="row" marginTop={1}>
        <Text color={selected === 'yes' ? theme.secondary : theme.text} bold={selected === 'yes'}>
          {selected === 'yes' ? ' ❯ ' : '   '}Yes
        </Text>
        <Box width={2} />
        <Text color={selected === 'no' ? theme.secondary : theme.text} bold={selected === 'no'}>
          {selected === 'no' ? ' ❯ ' : '   '}No
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={theme.dim}>Use Left/Right to select, Enter to confirm, or press Y/N</Text>
      </Box>
    </Box>
  );
}
