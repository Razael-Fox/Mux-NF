# Design: Mux-NF Multi-Font Support & Management

## 1. Menu System
Add a main menu to separate the different actions:
- `1) Install New Fonts` (Fetch from GitHub)
- `2) Switch Active Font` (Select from Cache)
- `3) Clear Cache`
- `4) Exit`

## 2. Multi-Font Selection
- Use `fzf -m` in the "Install" section.
- Iterate through the selected array for download and extraction.
- Termux: If multiple are selected, install all to cache, but apply only the last one as active.

## 3. UI: Color-Coded List
- When listing fonts from GitHub, check if they exist in `CACHE_DIR`.
- If cached, color the name **Green** (`\033[0;32m`).
- Use `fzf --ansi` to render these colors.
- "Blue" selection will be the default `fzf` highlight color (can be customized).

## 4. Switching System
- The "Switch Active Font" menu lists files in `CACHE_DIR`.
- Selecting one calls the `install_font` logic directly on the cached zip.
- This allows rapid switching between fonts already downloaded.

## 5. Technical Changes
- `download_font` will now accept a font name.
- `install_font` will now accept a path to a zip file.
- `select_font` will return a list of fonts.
