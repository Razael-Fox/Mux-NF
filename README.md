# 🚀 Mux-NF: Multi-Platform Nerd Font Installer

A modern, interactive, and animated CLI tool to easily install Nerd Fonts on Termux, Linux, and macOS.

![Platform](https://img.shields.io/badge/Platform-Termux%20%7C%20Linux%20%7C%20macOS-orange.svg)
![Shell](https://img.shields.io/badge/Shell-Bash-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

- **Multi-Platform Support**: Works seamlessly on Termux, Linux, and macOS.
- **Interactive Selection**: Search and choose from 70+ Nerd Fonts using `fzf`.
- **Modern UI**: Styled with ANSI colors, a compact header, and a live spinner.
- **Smart Caching**: Downloaded fonts are cached locally to save bandwidth on re-installs.
- **Intelligent Dependency Detection**: Automatically detects and helps install missing dependencies (`jq`, `fzf`, `curl`, `unzip`).
- **Automated Setup**: 
    - **Termux**: Configures `~/.termux/font.ttf` and reloads settings.
    - **Desktop**: Installs the full font family and updates font cache.

## 🛠️ Installation & Usage

To get started, clone the repository and run the script:

```bash
git clone https://github.com/razaeldotexe/mux-nf.git
cd mux-nf
chmod +x install.sh
./install.sh
```

### 🎮 Main Menu
The script now features a central hub for all operations:
1. **Install New Fonts**: Fetch the latest list from GitHub and select fonts to download.
2. **Switch Active Font**: Quickly swap between fonts you've already downloaded.
3. **Clear Cache**: Remove all cached fonts to free up space.

### ⌨️ Interactive Selection
When installing new fonts:
- **Search**: Start typing to filter the list.
- **Multi-Select**: Press `Tab` to select multiple fonts at once.
- **Color Coding**:
    - <span style="color:green">**Green**</span>: Font is already cached locally.
    - <span style="color:blue">**Blue**</span>: Currently selected for installation.
- **Confirm**: Press `Enter` to begin processing your selection.

> **Note for Termux users**: While you can download and cache multiple fonts, Termux only supports one active font at a time. The last font in your selection will be set as active, but you can use the "Switch Active Font" menu to change it anytime!

## 📦 Dependencies

The script requires the following tools:
- `curl` (API communication)
- `jq` (JSON parsing)
- `fzf` (Interactive menu)
- `unzip` (Font extraction)

On **Termux**, the script will automatically install these for you. On other platforms, it will suggest the appropriate command for your package manager.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ❤️ for the community.
