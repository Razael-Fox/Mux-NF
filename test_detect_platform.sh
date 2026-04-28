#!/usr/bin/env bash
source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

detect_platform

echo "PLATFORM=$PLATFORM"
echo "TERMUX_DIR=$TERMUX_DIR"
echo "FONT_DEST=$FONT_DEST"
echo "CACHE_DIR=$CACHE_DIR"
echo "TMP_DIR=$TMP_DIR"
echo "PKG_MANAGER=$PKG_MANAGER"
