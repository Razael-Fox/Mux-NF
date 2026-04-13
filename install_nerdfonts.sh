#!/data/data/com.termux/files/usr/bin/bash

# --- Configuration ---
API_URL="https://api.github.com/repos/ryanoasis/nerd-fonts/releases/latest"
TERMUX_DIR="$HOME/.termux"
FONT_PATH="$TERMUX_DIR/font.ttf"
CACHE_DIR="$TERMUX_DIR/fonts_cache"
TMP_DIR="$TERMUX_DIR/tmp_font"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

# --- Icons ---
CHECK="✔"
ARROW="➜"
INFO="ℹ"
DL="󰇚"

# --- Functions ---

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while kill -0 "$pid" 2>/dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

header() {
    clear
    echo -e "${CYAN}${BOLD}"
    echo "  ███╗   ██╗███████╗██████╗ ██████╗     ███████╗ ██████╗ ███╗   ██╗████████╗███████╗"
    echo "  ████╗  ██║██╔════╝██╔══██╗██╔══██╗    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝"
    echo "  ██╔██╗ ██║█████╗  ██████╔╝██║  ██║    █████╗  ██║   ██║██╔██╗ ██║   ██║   ███████╗"
    echo "  ██║╚██╗██║██╔══╝  ██╔══██╗██║  ██║    ██╔══╝  ██║   ██║██║╚██╗██║   ██║   ╚════██║"
    echo "  ██║ ╚████║███████╗██║  ██║██████╔╝    ██║     ╚██████╔╝██║ ╚████║   ██║   ███████║"
    echo "  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝"
    echo -e "${NC}"
    echo -e "          ${BLUE}${BOLD}Termux Nerd Font Installer${NC}"
    echo -e "          ${YELLOW}Modern • Animated • Interactive${NC}"
    echo
}

check_deps() {
    local deps=("curl" "jq" "fzf" "unzip")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo -e "${RED}${BOLD}${INFO} Installing dependency: $dep...${NC}"
            pkg install -y "$dep"
        fi
    done
    mkdir -p "$CACHE_DIR"
}

main() {
    header
    check_deps

    echo -e "${BLUE}${ARROW} Fetching available fonts...${NC}"
    (
        curl -s "$API_URL" | jq -r '.assets[] | select(.name | endswith(".zip")) | .name' > fonts.list
        echo "--- CLEAR CACHE ---" >> fonts.list
    ) &
    spinner $!
    
    if [[ ! -s fonts.list ]]; then
        echo -e "${RED}${BOLD}Failed to fetch font list. Check your internet connection.${NC}"
        exit 1
    fi

    echo -e "${GREEN}${CHECK} Found $(($(wc -l < fonts.list) - 1)) fonts.${NC}"
    
    if [[ ! -t 0 ]]; then
        echo -e "${RED}${BOLD}Error: This script must be run in an interactive terminal.${NC}"
        rm fonts.list
        exit 1
    fi

    echo -e "${BLUE}${ARROW} Select a font (cached fonts will be reused):${NC}"
    
    SELECTED_FONT=$(cat fonts.list | fzf --prompt="Choose Font: " --height=15 --border --color="fg:#d0d0d0,bg:-1,hl:#5f87af,fg+:#d0d0d0,bg+:#262626,hl+:#5fd7ff,info:#afaf87,prompt:#d7005f,pointer:#af5f00,marker:#87ff00,spinner:#af5f00,header:#87afaf")
    
    rm fonts.list

    if [[ -z "$SELECTED_FONT" ]]; then
        echo -e "${YELLOW}No font selected. Exiting.${NC}"
        exit 0
    fi

    if [[ "$SELECTED_FONT" == "--- CLEAR CACHE ---" ]]; then
        echo -e "${YELLOW}${INFO} Clearing font cache...${NC}"
        rm -rf "$CACHE_DIR"/*
        echo -e "${GREEN}${CHECK} Cache cleared!${NC}"
        exit 0
    fi

    CACHE_FILE="$CACHE_DIR/$SELECTED_FONT"

    if [[ -f "$CACHE_FILE" ]]; then
        echo -e "${GREEN}${CHECK} Using cached version: $SELECTED_FONT${NC}"
    else
        DOWNLOAD_URL=$(curl -s "$API_URL" | jq -r ".assets[] | select(.name == \"$SELECTED_FONT\") | .browser_download_url")
        echo -e "${BLUE}${DL} Downloading $SELECTED_FONT...${NC}"
        curl -L -o "$CACHE_FILE" "$DOWNLOAD_URL"
    fi

    echo -e "${BLUE}${ARROW} Extracting and installing...${NC}"
    rm -rf "$TMP_DIR"
    mkdir -p "$TMP_DIR"
    unzip -q -o "$CACHE_FILE" -d "$TMP_DIR"

    # Find the best candidate recursively
    CANDIDATE=$(find "$TMP_DIR" -type f -iname "*Regular*.ttf" | head -n 1)
    [[ -z "$CANDIDATE" ]] && CANDIDATE=$(find "$TMP_DIR" -type f -iname "*.ttf" | head -n 1)
    [[ -z "$CANDIDATE" ]] && CANDIDATE=$(find "$TMP_DIR" -type f -iname "*.otf" | head -n 1)

    if [[ -n "$CANDIDATE" ]]; then
        mkdir -p "$TERMUX_DIR"
        cp "$CANDIDATE" "$FONT_PATH"
        echo -e "${GREEN}${CHECK} Installed to $FONT_PATH${NC}"
        termux-reload-settings
        echo -e "${GREEN}${CHECK} Termux settings reloaded!${NC}"
    else
        echo -e "${RED}${BOLD}Error: No font files found in the zip.${NC}"
    fi

    rm -rf "$TMP_DIR"
    echo
    echo -e "${CYAN}${BOLD}Installation Complete! 🎉${NC}"
}

main
