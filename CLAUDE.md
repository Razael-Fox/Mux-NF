# Claude AI Guidelines for Mux-NF

Hello Claude! You are assisting with the Mux-NF project. Please keep the following guidelines in mind:

## Context
Mux-NF is a Next-Generation Interactive CLI Nerd Font Manager built with TypeScript and React Ink, targeting Termux, macOS, and Linux.

## Specific Instructions for Claude
1. **Type-Safe React Ink**: Provide robust, type-safe TypeScript code. Ensure React Ink components are clean, functional, and utilize hooks properly without unnecessary re-renders.
2. **Resource Management**: Pay critical attention to file system operations and memory limits. Mux-NF must run flawlessly on mobile OS environments (Termux) without OOM crashes during heavy font extractions.
3. **Architectural Consistency**: Stick to the current stack (pure Node APIs, `adm-zip`, native `fetch`). Do not introduce external dependencies like `unzip` system commands or heavy fetching libraries.
4. **Documentation**: When adding new functionality or making architectural changes, proactively suggest updates to `README.md` or `DESIGN.md`.
