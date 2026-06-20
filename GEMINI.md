# Gemini AI Guidelines for Mux-NF

Hello Gemini! You are assisting with the Mux-NF project. Please follow these specific guidelines:

## Context
Mux-NF is an interactive CLI Nerd Font Manager built with TypeScript and React Ink, supporting Termux, macOS, and Linux.

## Specific Instructions for Gemini
1. **Deep Code Understanding**: Use your file reading and searching tools to thoroughly understand the React Ink architecture and existing `adm-zip` / native `fetch` implementations before making changes.
2. **Memory Safety Focus**: When suggesting features or bug fixes involving file downloads or zip extractions, always ensure the solution uses streams and is memory-safe for Termux environments.
3. **Terminal UI**: When generating new UI components, adhere to the Tokyo Night theme and use standard `ink` components to maintain a premium feel.
4. **Cross-Platform Awareness**: Provide code that seamlessly handles the distinct font installation directories and reload commands (e.g., `termux-reload-settings` vs `fc-cache -f`).
