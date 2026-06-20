# Design: Mux-NF TypeScript & TUI Transition

This document outlines the design decisions and architecture of the TypeScript TUI (Terminal User Interface) version of Mux-NF.

## 1. Architecture
The CLI is written in TypeScript and utilizes a reactive architecture:
- **UI Engine**: **Ink** (React for the terminal) compiles JSX elements into ANSI escape sequences, managing screen redraws efficiently.
- **Platform Manager**: Pure Node.js API (`os`, `fs`, `child_process`) determines target paths for Termux, macOS, and Linux without shell dependencies.
- **GitHub Client**: Native `fetch` (standard in Node 18+) queries the GitHub Releases API and pulls assets.
- **Extractor**: **adm-zip** performs pure-JS file extraction, removing the need for external `unzip` system commands.

## 2. Interactive Screens (TUI)
We support two interaction styles managed via React state:
- **Main Menu**: Arrow-key selection menu featuring four actions:
  - `Install New Fonts`: Fetch and install from GitHub.
  - `Switch Active Font`: Re-extract and apply a cached font zip.
  - `Clear Cache`: Empty locally stored zip files.
  - `Exit`: Gracefully shut down the TUI.
- **Searchable List**: An autocomplete, multi-select scrolling viewport. Because Nerd Fonts offers 70+ variants, the list filters results in real-time as users type. It displays a window of up to 10 fonts, scrolling dynamically as the highlighted cursor moves.
- **Progress Screen**: During download & installation, the UI shows real-time progress using smooth block-character graphics (`██████░░░░ 60%`) and animated loader states.

## 3. Headless Mode
When command-line arguments are passed (e.g. `--font "FiraCode" --cache`), the TUI layout is bypassed. The script operates in a CLI mode, printing standard text logs directly to stdout. This makes Mux-NF highly suitable for inclusion in shell scripts and cron jobs.

## 4. Platform Specifications
- **Termux**: Installs one active font at a time (copied to `~/.termux/font.ttf`) and executes `termux-reload-settings`.
- **Desktop (macOS / Linux)**: Copies the full font family to user-local directories (`~/Library/Fonts/NerdFonts` or `~/.local/share/fonts/NerdFonts`) and updates font indexes (`fc-cache -f` on Linux).
