#!/usr/bin/env bash
source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

test_platform() {
    local mock_dir=$1
    local mock_uname=$2
    
    echo "Testing with DIR=$mock_dir, UNAME=$mock_uname"
    
    # Mock [[ -d ... ]] and uname
    detect_platform() {
        if [[ "$mock_dir" == "/data/data/com.termux" ]]; then
            PLATFORM="termux"
            TERMUX_DIR="$HOME/.termux"
            FONT_DEST="$TERMUX_DIR/font.ttf"
            CACHE_DIR="$TERMUX_DIR/fonts_cache"
            TMP_DIR="$TERMUX_DIR/tmp_font"
            PKG_MANAGER="pkg"
        elif [[ "$mock_uname" == "Darwin" ]]; then
            PLATFORM="macos"
            FONT_DEST="$HOME/Library/Fonts/NerdFonts"
            CACHE_DIR="$HOME/.cache/mux-nf"
            TMP_DIR="/tmp/mux-nf"
            PKG_MANAGER="brew" # Simplified for test
        elif [[ "$mock_uname" == "Linux" ]]; then
            PLATFORM="linux"
            FONT_DEST="$HOME/.local/share/fonts/NerdFonts"
            CACHE_DIR="$HOME/.cache/mux-nf"
            TMP_DIR="/tmp/mux-nf"
            PKG_MANAGER="apt" # Simplified for test
        else
            PLATFORM="unknown"
        fi
    }

    detect_platform
    echo "  PLATFORM=$PLATFORM"
    echo "  FONT_DEST=$FONT_DEST"
}

test_platform "/data/data/com.termux" "Linux"
test_platform "/home/user" "Darwin"
test_platform "/home/user" "Linux"
test_platform "/home/user" "Unknown"
