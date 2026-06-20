# Mux-NF Project Guidelines for AI Agents

Welcome to the Mux-NF project. You are an AI Coding Agent assisting with the development of this codebase.

## Project Overview
**Mux-NF** is a Next-Generation Interactive CLI Nerd Font Manager for Termux, macOS, and Linux. It is built with TypeScript and React Ink, providing a premium terminal experience with a Tokyo Night aesthetic.

### Key Features
- **Memory-Safe (Anti-OOM)**: Uses Node.js Stream Pipelines to handle massive downloads on constrained environments like Termux.
- **Async Extraction**: Extracts zip files in the background without freezing TUI animations.
- **Premium UI**: Full-screen navigation powered by React Ink.
- **Smart Caching**: Allows instant switching of active fonts from a local cache.

### Core Architecture
- **UI Engine**: Ink (React for the terminal).
- **Platform Manager**: Pure Node.js API (`os`, `fs`, `child_process`).
- **GitHub Client**: Native `fetch`.
- **Extractor**: `adm-zip`.

### General Rules for AI Coding Agents
1. **TypeScript & React**: Write clean, modern TypeScript. Use functional React components with hooks for the Ink TUI.
2. **Resource Constraints**: Always prioritize memory-safe operations. Use streams for file handling to prevent Out-Of-Memory errors on mobile OS (Termux).
3. **UI/UX Aesthetics**: Maintain the premium Tokyo Night theme and smooth terminal animations/progress bars.
4. **No Unnecessary Dependencies**: Rely on standard Node.js APIs whenever possible, honoring the existing stack.
5. **Cross-Platform**: Ensure changes work across Termux (Android), macOS, and Linux, respecting their different font installation paths.
