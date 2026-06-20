# Mux-NF 🚀

<div align="center">
  <br/>
  <p><strong>A Next-Generation Interactive CLI Nerd Font Manager for Termux, macOS, and Linux.</strong></p>
</div>

## 🌟 Overview
Mux-NF is a blazing fast, memory-safe, and highly interactive Nerd Font installer built with TypeScript and React Ink. Wrapped in a premium Tokyo Night aesthetic, it provides the ultimate terminal experience.

## ✨ Features
- **🛡️ Memory-Safe (Anti-OOM):** Uses Node.js Stream Pipelines to handle massive font downloads securely on mobile OS constraints like Termux.
- **⚡ Async Extraction:** Effortlessly extracts hundreds of massive zip files in the background without freezing the TUI animations.
- **🎨 Premium UI:** Full-screen terminal navigation powered by React Ink and Tokyo Night colors.
- **💾 Smart Caching:** Switch active fonts instantly from your local cache without consuming internet quota.
- **🌐 Bilingual Support:** Native support for English and Indonesian languages.

## 🚀 Installation

Run this single magic command in your terminal:

```bash
curl -fsSL https://mux-nf.razael-fox.my.id/install | bash
```

*(Note: The script automatically detects and installs Node.js & Git if they are missing on your system)*

## 📖 Usage

- **Interactive Mode:** Simply type the command below to launch the visual menu:
  ```bash
  mux-nf
  ```
- **Headless Mode:** Quickly install specific fonts by passing arguments:
  ```bash
  mux-nf FiraCode Meslo JetBrainsMono
  ```
- **Clear Cache:** Free up storage space by running:
  ```bash
  mux-nf --clear
  ```

## 💻 Tech Stack
- [Node.js](https://nodejs.org/) (Runtime)
- TypeScript
- React Ink (Terminal UI Framework)
- Next.js & TailwindCSS (Landing Page)

## 🤝 Credits
Built with ❤️ by [Razael](https://github.com/Razael-Fox) and [Gemini](https://gemini.google.com/).
