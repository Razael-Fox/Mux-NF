#!/usr/bin/env bash
source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

# Mock command to simulate missing 'fzf'
command() {
    if [[ "$2" == "fzf" ]]; then
        return 1
    fi
    builtin command "$@"
}

# Mock pkg to avoid actual installation
pkg() {
    echo "MOCKED: pkg $@"
}

detect_platform
check_deps
