# 🚀 Termux Nerd Font Installer (mux-nf)

A modern, interactive, and animated CLI tool to easily install Nerd Fonts in Termux.

![Termux](https://img.shields.io/badge/Platform-Termux-orange.svg)
![Shell](https://img.shields.io/badge/Shell-Bash-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

- **Interactive Selection**: Search and choose from 70+ Nerd Fonts using `fzf`.
- **Animated UI**: Styled with ANSI colors, custom headers, and a live spinner.
- **Smart Caching**: Downloaded fonts are cached locally to save bandwidth on re-installs.
- **Automated Setup**: Automatically configures `~/.termux/font.ttf` and reloads settings.
- **Zero Configuration**: Handles dependencies (`jq`, `fzf`, `curl`, `unzip`) automatically.

## 🛠️ Installation & Usage

To get started, clone the repository and run the script:

```bash
git clone https://github.com/razaeldotexe/mux-nf.git
cd mux-nf
chmod +x install_nerdfonts.sh
./install_nerdfonts.sh
```

## 🖥️ Preview

- **Search**: Start typing the name of a font (e.g., "JetBrains", "Hack", "Fira").
- **Navigate**: Use arrow keys to browse.
- **Select**: Press Enter to download and apply.
- **Clear Cache**: Select `--- CLEAR CACHE ---` at the bottom of the list to free up storage.

## 📦 Dependencies

The script will automatically prompt to install these if missing:
- `curl` (API communication)
- `jq` (JSON parsing)
- `fzf` (Interactive menu)
- `unzip` (Font extraction)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ❤️ for the Termux community.
