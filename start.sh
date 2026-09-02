#!/usr/bin/env bash

# Bootstrap script to run the TypeScript TUI CLI

# Detect package manager
detect_pkg_manager() {
    if [[ -d "/data/data/com.termux" ]]; then
        PKG_MANAGER="pkg"
    elif [[ "$(uname)" == "Darwin" ]]; then
        PKG_MANAGER="brew"
    elif [[ "$(uname)" == "Linux" ]]; then
        if command -v apt &> /dev/null; then
            PKG_MANAGER="apt"
        elif command -v pacman &> /dev/null; then
            PKG_MANAGER="pacman"
        elif command -v dnf &> /dev/null; then
            PKG_MANAGER="dnf"
        else
            PKG_MANAGER="none"
        fi
    else
        PKG_MANAGER="none"
    fi
}

detect_pkg_manager

# Ensure Node.js and NPM are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "Node.js and NPM are required to run Mux-NF."
    case "$PKG_MANAGER" in
        pkg)
            echo "Installing Node.js..."
            pkg install -y nodejs
            ;;
        brew)
            echo "Please install Node.js via Homebrew: brew install node"
            exit 1
            ;;
        apt)
            echo "Please install Node.js: sudo apt install -y nodejs npm"
            exit 1
            ;;
        *)
            echo "Please install Node.js using your package manager."
            exit 1
            ;;
    esac
fi

# Ensure dependencies are installed
if [[ ! -d "node_modules" ]]; then
    echo "Installing project dependencies..."
    npm install
fi

# Build project if not built
if [[ ! -f "dist/index.js" ]]; then
    echo "Building project..."
    node ./node_modules/.bin/tsup src/index.tsx --format esm --minify --clean && \
    echo '#!/usr/bin/env node' | cat - dist/index.js > temp && \
    mv temp dist/index.js && \
    chmod +x dist/index.js
fi

# Run the TypeScript TUI CLI passing all arguments
exec node dist/index.js "$@"
