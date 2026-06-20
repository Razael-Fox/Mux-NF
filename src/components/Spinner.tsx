import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import { theme } from '../theme';

export interface SpinnerProps {
  label?: string;
  color?: string;
}

export function Spinner({ label = 'Loading', color = theme.secondary }: SpinnerProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <Text>
      <Text color={color} bold>{frames[frameIndex]}</Text> <Text color={theme.text}>{label}</Text>
    </Text>
  );
}
