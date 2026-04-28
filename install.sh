#!/usr/bin/env bash

# --- Configuration ---
API_URL="https://api.github.com/repos/ryanoasis/nerd-fonts/releases/latest"

# --- Colors ---
PRIMARY='\033[0;34m'
ACCENT='\033[0;36m'
SUCCESS='\033[0;32m'
ERROR='\033[0;31m'
WARNING='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

# --- Icons ---
CHECK="✔"
ARROW="❯"
INFO="ℹ"
DL="↓"
WARN="⚠"

# --- FZF Styling ---
FZF_COLORS="fg:#d0d0d0,bg:-1,hl:#5f87af,fg+:#d0d0d0,bg+:#005f87,hl+:#5fd7ff,info:#afaf87,prompt:#d7005f,pointer:#00afff,marker:#87ff00,spinner:#af5f00,header:#87afaf"

# --- Platform Detection ---
detect_platform() {
    if [[ -d "/data/data/com.termux" ]]; then
        PLATFORM="termux"
        TERMUX_DIR="$HOME/.termux"
        FONT_DEST="$TERMUX_DIR/font.ttf"
        CACHE_DIR="$TERMUX_DIR/fonts_cache"
        TMP_DIR="$TERMUX_DIR/tmp_font"
        PKG_MANAGER="pkg"
    elif [[ "$(uname)" == "Darwin" ]]; then
        PLATFORM="macos"
        FONT_DEST="$HOME/Library/Fonts/NerdFonts"
        CACHE_DIR="$HOME/.cache/mux-nf"
        TMP_DIR="/tmp/mux-nf"
        if command -v brew &> /dev/null; then
            PKG_MANAGER="brew"
        else
            PKG_MANAGER="none"
        fi
    elif [[ "$(uname)" == "Linux" ]]; then
        PLATFORM="linux"
        FONT_DEST="$HOME/.local/share/fonts/NerdFonts"
        CACHE_DIR="$HOME/.cache/mux-nf"
        TMP_DIR="/tmp/mux-nf"
        if command -v apt &> /dev/null; then
            PKG_MANAGER="apt"
        elif command -v pacman &> /dev/null; then
            PKG_MANAGER="pacman"
        elif command -v dnf &> /dev/null; then
            PKG_MANAGER="dnf"
        elif command -v yum &> /dev/null; then
            PKG_MANAGER="yum"
        elif command -v zypper &> /dev/null; then
            PKG_MANAGER="zypper"
        else
            PKG_MANAGER="none"
        fi
    else
        PLATFORM="unknown"
        FONT_DEST=""
        CACHE_DIR="/tmp/mux-nf-cache"
        TMP_DIR="/tmp/mux-nf"
        PKG_MANAGER="none"
    fi
}

# --- Cleanup ---
cleanup() {
    rm -f fonts.list fonts.list.clean
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

# --- UI Components ---
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
    echo -e "${ACCENT}${BOLD}"
    echo "   __  __ _   ___  __   _  _ ___ "
    echo "  |  \/  | | | \ \/ /  | \| | __|"
    echo "  | |\/| | |_| |>  <   | .\` | _| "
    echo "  |_|  |_|\__,_/_/\_\  |_|\_|_|  "
    echo -e "${NC}"
    echo -e "  ${PRIMARY}${BOLD}Mux-NF Font Installer${NC}"
    echo -e "  ${WARNING}Modern • Animated • Interactive${NC}"
    echo
}

# --- Dependency Handling ---
check_deps() {
    local deps=("curl" "jq" "fzf" "unzip")
    local missing_deps=()

    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        for dep in "${missing_deps[@]}"; do
            echo -e "${ERROR}${BOLD}${INFO} Missing dependency: $dep${NC}"
            case "$PKG_MANAGER" in
                pkg)
                    echo -e "${PRIMARY}${ARROW} Installing $dep...${NC}"
                    pkg install -y "$dep"
                    ;;
                brew)
                    echo -e "${WARNING}${ARROW} Suggestion: brew install $dep${NC}"
                    ;;
                apt)
                    echo -e "${WARNING}${ARROW} Suggestion: sudo apt install $dep${NC}"
                    ;;
                pacman)
                    echo -e "${WARNING}${ARROW} Suggestion: sudo pacman -S $dep${NC}"
                    ;;
                dnf)
                    echo -e "${WARNING}${ARROW} Suggestion: sudo dnf install $dep${NC}"
                    ;;
                yum)
                    echo -e "${WARNING}${ARROW} Suggestion: sudo yum install $dep${NC}"
                    ;;
                zypper)
                    echo -e "${WARNING}${ARROW} Suggestion: sudo zypper install $dep${NC}"
                    ;;
                *)
                    echo -e "${WARNING}${INFO} Please install '$dep' manually using your package manager.${NC}"
                    echo -e "${WARNING}${INFO} Refer to the README or the tool's website for more information.${NC}"
                    ;;
            esac
        done

        if [[ "$PLATFORM" == "termux" ]]; then
             for dep in "${missing_deps[@]}"; do
                if ! command -v "$dep" &> /dev/null; then
                    echo -e "${ERROR}${BOLD}Failed to install $dep. Please install it manually.${NC}"
                    exit 1
                fi
            done
        else
            echo -e "${ERROR}${BOLD}Please install missing dependencies and run the script again.${NC}"
            exit 1
        fi
    fi
    mkdir -p "$CACHE_DIR"
}

# --- Logic ---

fetch_fonts() {
    echo -e "${PRIMARY}${ARROW} Fetching available fonts...${NC}"
    (
        # Fetch list and check against cache for color coding
        curl -s "$API_URL" | jq -r '.assets[] | select(.name | endswith(".zip")) | .name' | while read -r font; do
            if [[ -f "$CACHE_DIR/$font" ]]; then
                echo -e "${SUCCESS}$font${NC}"
            else
                echo "$font"
            fi
        done > fonts.list
    ) &
    spinner $!
    
    if [[ ! -s fonts.list ]]; then
        echo -e "${ERROR}${BOLD}Failed to fetch font list. Check your internet connection.${NC}"
        exit 1
    fi
    echo -e "${SUCCESS}${CHECK} Found $(wc -l < fonts.list) fonts.${NC}"
}

select_font() {
    if [[ ! -t 0 ]]; then
        echo -e "${ERROR}${BOLD}Error: This script must be run in an interactive terminal.${NC}"
        rm -f fonts.list
        exit 1
    fi

    echo -e "${PRIMARY}${ARROW} Select fonts (Space to multi-select, cached fonts in ${SUCCESS}green${NC}):${NC}"
    
    SELECTED_FONTS=$(cat fonts.list | fzf -m --ansi \
        --prompt="Choose Font: " \
        --height=15 \
        --border=rounded \
        --layout=reverse \
        --bind 'space:toggle' \
        --header="Search: type name | Select: Space | Confirm: Enter | Exit: ESC" \
        --color="$FZF_COLORS")
    
    rm -f fonts.list

    if [[ -z "$SELECTED_FONTS" ]]; then
        echo -e "${WARNING}No font selected.${NC}"
        return 1
    fi
    return 0
}

download_font() {
    local font_name="$1"
    local cache_file="$CACHE_DIR/$font_name"
    if [[ -f "$cache_file" ]]; then
        echo -e "${SUCCESS}${CHECK} Using cached version: $font_name${NC}"
    else
        local download_url
        download_url=$(curl -s "$API_URL" | jq -r ".assets[] | select(.name == \"$font_name\") | .browser_download_url")
        echo -e "${PRIMARY}${DL} Downloading $font_name...${NC}"
        curl -L -# -o "$cache_file" "$download_url"
    fi
}

install_font() {
    local zip_path="$1"
    local zip_name=$(basename "$zip_path")
    echo -e "${PRIMARY}${ARROW} Extracting and installing $zip_name...${NC}"
    
    # Record current state for validation
    local old_ts=0
    if [[ "$PLATFORM" == "termux" && -f "$FONT_DEST" ]]; then
        old_ts=$(stat -c %Y "$FONT_DEST" 2>/dev/null || stat -f %m "$FONT_DEST" 2>/dev/null || echo 0)
    fi

    rm -rf "$TMP_DIR"
    mkdir -p "$TMP_DIR"
    unzip -q -o "$zip_path" -d "$TMP_DIR"

    local success=false
    case "$PLATFORM" in
        termux)
            # Find the best candidate for Termux (single file)
            local candidate
            candidate=$(find "$TMP_DIR" -type f -iname "*Regular*.ttf" | head -n 1)
            [[ -z "$candidate" ]] && candidate=$(find "$TMP_DIR" -type f -iname "*.ttf" | head -n 1)
            [[ -z "$candidate" ]] && candidate=$(find "$TMP_DIR" -type f -iname "*.otf" | head -n 1)

            if [[ -n "$candidate" ]]; then
                mkdir -p "$(dirname "$FONT_DEST")"
                cp "$candidate" "$FONT_DEST"
                
                # Validation
                if [[ -f "$FONT_DEST" ]]; then
                    local new_ts=$(stat -c %Y "$FONT_DEST" 2>/dev/null || stat -f %m "$FONT_DEST" 2>/dev/null || echo 0)
                    if [[ "$new_ts" -gt "$old_ts" || "$old_ts" -eq 0 ]]; then
                        success=true
                    fi
                fi

                if [[ "$success" == "true" ]]; then
                    echo -e "${SUCCESS}${CHECK} Installed to $FONT_DEST${NC}"
                    if command -v termux-reload-settings &> /dev/null; then
                        termux-reload-settings
                        echo -e "${SUCCESS}${CHECK} Termux settings reloaded!${NC}"
                    fi
                else
                    echo -e "${ERROR}${BOLD}Error: Failed to update $FONT_DEST${NC}"
                fi
            else
                echo -e "${ERROR}${BOLD}Error: No font files found in the zip.${NC}"
            fi
            ;;
        macos|linux)
            mkdir -p "$FONT_DEST"
            # On desktop, we usually want all fonts in the family
            find "$TMP_DIR" -type f \( -name "*.ttf" -o -name "*.otf" \) -exec cp {} "$FONT_DEST/" \;
            
            # Validation: check if any file was copied
            if [[ -d "$FONT_DEST" && -n "$(ls -A "$FONT_DEST" 2>/dev/null)" ]]; then
                success=true
            fi

            if [[ "$success" == "true" ]]; then
                echo -e "${SUCCESS}${CHECK} Installed to $FONT_DEST${NC}"
                if [[ "$PLATFORM" == "linux" ]]; then
                    if command -v fc-cache &> /dev/null; then
                        fc-cache -f
                        echo -e "${SUCCESS}${CHECK} Font cache updated!${NC}"
                    fi
                fi
            else
                echo -e "${ERROR}${BOLD}Error: Failed to install fonts to $FONT_DEST${NC}"
            fi
            ;;
        *)
            echo -e "${ERROR}${BOLD}Unsupported platform for automatic installation.${NC}"
            echo -e "Fonts extracted to: $TMP_DIR"
            ;;
    esac

    rm -rf "$TMP_DIR"
    [[ "$success" == "true" ]] && return 0 || return 1
}

# --- Argument Parsing ---
show_help() {
    echo -e "${PRIMARY}${BOLD}Mux-NF Font Installer - Usage${NC}"
    echo -e "  ./install.sh [options]"
    echo
    echo -e "${BOLD}Options:${NC}"
    echo -e "  --font <list>    Specify one or more fonts to install (comma-separated)."
    echo -e "                   Example: --font \"JetBrainsMono,RobotoMono\""
    echo -e "  --cache          Clear the font cache before proceeding."
    echo -e "  --help           Display this help message."
    echo
    echo -e "${BOLD}Interactive Mode:${NC}"
    echo -e "  If no arguments are provided, the script starts in interactive mode."
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --font)
                ARG_FONTS="$2"
                shift 2
                ;;
            --cache)
                ARG_CLEAR_CACHE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${ERROR}Unknown argument: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# --- Menu System ---
main_menu() {
    echo -e "${PRIMARY}${BOLD}Main Menu:${NC}"
    echo -e "  1) ${ACCENT}Install New Fonts${NC} (Fetch from GitHub)"
    echo -e "  2) ${ACCENT}Switch Active Font${NC} (Select from Cache)"
    echo -e "  3) ${ACCENT}Clear Cache${NC}"
    echo -e "  4) ${ACCENT}Exit${NC}"
    echo
    echo -ne "  ${PRIMARY}${ARROW} Select an option [1-4]: ${NC}"
    read choice
    case "$choice" in
        1) install_new_fonts ;;
        2) switch_font ;;
        3) clear_cache ;;
        4) exit 0 ;;
        *) echo -e "${ERROR}Invalid option.${NC}"; sleep 1 ;;
    esac
}

install_new_fonts() {
    header
    fetch_fonts
    if select_font; then
        # SELECTED_FONTS is a newline-separated string
        local count=$(echo "$SELECTED_FONTS" | grep -c '^')
        
        if [[ "$PLATFORM" == "termux" && $count -gt 1 ]]; then
            echo -e "${WARNING}${WARN} Note: You selected $count fonts. On Termux, only one font can be active at a time.${NC}"
            echo -e "${WARNING}${INFO} All selected fonts will be cached, but only the last one will be set as active.${NC}"
            echo -e "${WARNING}${INFO} You can use 'Switch Active Font' later to change it.${NC}"
            echo
            sleep 3
        fi

        local current=0
        while IFS= read -r font; do
            [[ -z "$font" ]] && continue
            # Strip ANSI colors
            font=$(echo "$font" | sed 's/\x1b\[[0-9;]*m//g')
            ((current++))
            echo -e "${PRIMARY}${BOLD}[$current/$count] Processing: $font${NC}"
            download_font "$font"
            install_font "$CACHE_DIR/$font"
        done <<< "$SELECTED_FONTS"
        echo -e "\n${SUCCESS}${CHECK} All selected fonts processed!${NC}"
        sleep 2
    fi
}

switch_font() {
    header
    local cached_fonts=$(ls "$CACHE_DIR" 2>/dev/null)
    if [[ -z "$cached_fonts" ]]; then
        echo -e "${WARNING}${INFO} No fonts in cache. Install some first!${NC}"
        sleep 2
        return
    fi

    echo -e "${PRIMARY}${ARROW} Select a font from cache to activate:${NC}"
    local selected=$(ls "$CACHE_DIR" | fzf --prompt="Switch to: " --height=15 --border=rounded --layout=reverse --header="Select a font to activate | Exit: ESC" --color="$FZF_COLORS")
    
    if [[ -n "$selected" ]]; then
        if install_font "$CACHE_DIR/$selected"; then
            echo -e "${SUCCESS}${CHECK} Switched to $selected!${NC}"
        else
            echo -e "${ERROR}${BOLD}Failed to switch font.${NC}"
        fi
        sleep 2
    fi
}

clear_cache() {
    header
    echo -e "${WARNING}${INFO} Clearing font cache...${NC}"
    rm -rf "$CACHE_DIR"/*
    echo -e "${SUCCESS}${CHECK} Cache cleared!${NC}"
    sleep 2
}

main() {
    detect_platform
    check_deps
    parse_args "$@"

    if [[ "$ARG_CLEAR_CACHE" == "true" ]]; then
        echo -e "${WARNING}${INFO} Clearing font cache...${NC}"
        rm -rf "$CACHE_DIR"/*
        echo -e "${SUCCESS}${CHECK} Cache cleared!${NC}"
        [[ -z "$ARG_FONTS" ]] && sleep 1
    fi

    if [[ -n "$ARG_FONTS" ]]; then
        fetch_fonts
        # Split by comma and trim whitespace
        IFS=',' read -ra fonts_raw <<< "$ARG_FONTS"
        local fonts=()
        for f in "${fonts_raw[@]}"; do
            f=$(echo "$f" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
            [[ -n "$f" ]] && fonts+=("$f")
        done

        local count=${#fonts[@]}
        local current=0

        # Create a clean list without ANSI colors for matching
        sed 's/\x1b\[[0-9;]*m//g' fonts.list > fonts.list.clean

        for font in "${fonts[@]}"; do
            ((current++))
            # Try to find the exact match or append .zip
            local target_font=""
            if grep -Fxq "$font" fonts.list.clean; then
                target_font="$font"
            elif grep -Fxq "$font.zip" fonts.list.clean; then
                target_font="$font.zip"
            else
                # Try case-insensitive match
                target_font=$(grep -iE "^${font}(\.zip)?$" fonts.list.clean | head -n 1)
            fi

            if [[ -n "$target_font" ]]; then
                echo -e "${PRIMARY}${BOLD}[$current/$count] Processing: $target_font${NC}"
                download_font "$target_font"
                install_font "$CACHE_DIR/$target_font"
            else
                echo -e "${ERROR}Font not found: $font${NC}"
            fi
        done
        rm -f fonts.list.clean
        echo -e "\n${SUCCESS}${CHECK} All specified fonts processed!${NC}"
        exit 0
    fi

    while true; do
        header
        main_menu
    done
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
