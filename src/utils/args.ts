import { CLIArgs } from '../types';

export function parseArgs(args: string[]): CLIArgs {
  const result: CLIArgs = {
    fonts: [],
    clearCache: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--cache' || arg === '-c') {
      result.clearCache = true;
    } else if (arg === '--font' || arg === '-f') {
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        result.fonts = nextArg
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0);
        i++;
      }
    }
  }

  return result;
}

export function showHelp() {
  console.log(`
🚀 Mux-NF: Multi-Platform Nerd Font Installer (TypeScript Version)

Usage:
  mux-nf [options]

Options:
  -f, --font <list>  Specify one or more fonts to install (comma-separated).
                     Example: mux-nf --font "JetBrainsMono,RobotoMono"
  -c, --cache        Clear the font cache before proceeding.
  -h, --help         Display this help message.

Interactive Mode:
  If no options (or only --cache) are provided, the interactive TUI main menu will launch.
`);
}
