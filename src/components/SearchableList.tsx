import React, { useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { FontAsset } from '../types';
import { theme } from '../theme';

export interface SearchableListProps {
  fonts: FontAsset[];
  isMultiSelect: boolean;
  onConfirm: (selected: FontAsset[]) => void;
  onCancel: () => void;
  title: string;
}

export function SearchableList({
  fonts,
  isMultiSelect,
  onConfirm,
  onCancel,
  title,
}: SearchableListProps) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const WINDOW_SIZE = 10;

  // Filter fonts based on query
  const filteredFonts = useMemo(() => {
    return fonts.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  }, [fonts, query]);

  // Adjust scroll offset when filtered fonts change
  const currentFilteredCount = filteredFonts.length;

  useInput((input, key) => {
    if (key.upArrow) {
      if (currentFilteredCount === 0) return;
      setHighlightedIndex(prev => {
        const next = prev > 0 ? prev - 1 : currentFilteredCount - 1;
        if (next === currentFilteredCount - 1) {
          setScrollOffset(Math.max(0, currentFilteredCount - WINDOW_SIZE));
        } else if (next < scrollOffset) {
          setScrollOffset(next);
        }
        return next;
      });
    } else if (key.downArrow) {
      if (currentFilteredCount === 0) return;
      setHighlightedIndex(prev => {
        const next = prev < currentFilteredCount - 1 ? prev + 1 : 0;
        if (next === 0) {
          setScrollOffset(0);
        } else if (next >= scrollOffset + WINDOW_SIZE) {
          setScrollOffset(next - WINDOW_SIZE + 1);
        }
        return next;
      });
    } else if (key.escape) {
      onCancel();
    } else if (key.return) {
      if (isMultiSelect) {
        // Return selected fonts
        const selected = fonts.filter(f => selectedNames.has(f.name));
        onConfirm(selected);
      } else {
        // In single-select, return the currently highlighted font
        if (currentFilteredCount > 0) {
          onConfirm([filteredFonts[highlightedIndex]]);
        }
      }
    } else if (input === ' ') {
      if (isMultiSelect && currentFilteredCount > 0) {
        const font = filteredFonts[highlightedIndex];
        setSelectedNames(prev => {
          const next = new Set(prev);
          if (next.has(font.name)) {
            next.delete(font.name);
          } else {
            next.add(font.name);
          }
          return next;
        });
      }
    } else if (key.backspace || key.delete) {
      setQuery(prev => prev.slice(0, -1));
      setHighlightedIndex(0);
      setScrollOffset(0);
    } else if (input && !key.ctrl && !key.meta && input !== '\r' && input !== '\n' && input !== '\t') {
      setQuery(prev => prev + input);
      setHighlightedIndex(0);
      setScrollOffset(0);
    }
  });

  const visibleFonts = filteredFonts.slice(scrollOffset, scrollOffset + WINDOW_SIZE);

  return (
    <Box flexDirection="column" paddingX={2} marginY={1}>
      <Text color={theme.warning} bold>{title}</Text>
      
      {/* Search Input Box */}
      <Box flexDirection="row" marginY={1} borderStyle="round" borderColor={theme.dim} paddingX={1}>
        <Text color={theme.secondary} bold>Search: </Text>
        <Text color={theme.text}>{query}</Text>
        <Text color={theme.dim}>{query === '' ? ' (type to filter...)' : ''}</Text>
      </Box>

      {/* List Headers */}
      {currentFilteredCount > 0 ? (
        <Box flexDirection="column" minHeight={WINDOW_SIZE}>
          {visibleFonts.map((font, index) => {
            const actualIndex = scrollOffset + index;
            const isHighlighted = actualIndex === highlightedIndex;
            const isSelected = selectedNames.has(font.name);
            
            let nameColor = theme.text;
            if (font.isCached) {
              nameColor = theme.success;
            }
            if (isHighlighted) {
              nameColor = theme.secondary;
            }

            return (
              <Box key={font.name} flexDirection="row">
                <Text color={theme.secondary}>{isHighlighted ? ' ❯ ' : '   '}</Text>
                
                {isMultiSelect && (
                  <Text color={isSelected ? theme.secondary : theme.dim}>
                    {isSelected ? '● ' : '○ '}
                  </Text>
                )}
                
                <Text color={nameColor} bold={isHighlighted}>
                  {font.name}
                </Text>
                
                {font.isCached && !isHighlighted && (
                  <Text color={theme.success} dimColor> (cached)</Text>
                )}
                {font.isCached && isHighlighted && (
                  <Text color={theme.secondary} dimColor> (cached)</Text>
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box flexDirection="column" minHeight={WINDOW_SIZE}>
          <Text color={theme.error}>No matching fonts found.</Text>
        </Box>
      )}

      {/* Footer Instructions */}
      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.dim}>
          {isMultiSelect
            ? 'Arrow keys: Navigate • Space: Toggle selection • Enter: Confirm & Install'
            : 'Arrow keys: Navigate • Enter: Confirm selection'}
        </Text>
        <Text color={theme.dim}>
          Esc: Back to main menu
        </Text>
        {currentFilteredCount > WINDOW_SIZE && (
          <Box marginTop={1}>
            <Text color={theme.primary}>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + WINDOW_SIZE, currentFilteredCount)} of {currentFilteredCount} fonts
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
