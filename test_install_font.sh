#!/usr/bin/env bash
source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

detect_platform
SELECTED_FONT="TestFont.zip"
CACHE_FILE="$CACHE_DIR/$SELECTED_FONT"

mkdir -p "$CACHE_DIR"
touch "$CACHE_FILE"

# Mock unzip
unzip() {
    mkdir -p "$TMP_DIR"
    touch "$TMP_DIR/TestFont-Regular.ttf"
}

rm -f "$FONT_DEST"
install_font

if [[ -f "$FONT_DEST" ]]; then
    echo "SUCCESS: Font installed to $FONT_DEST"
else
    echo "FAILURE: Font not found at $FONT_DEST"
fi

# Cleanup test artifacts
rm -rf test_zip_content
rm -f "$CACHE_FILE"
rm -f "$FONT_DEST"
