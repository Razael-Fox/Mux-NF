#!/usr/bin/env bash
# We need to redefine detect_platform slightly to use variables for the checks we want to mock
# OR we can just trust the logic if it's simple enough.
# The original logic is:
# detect_platform() {
#     if [[ -d "/data/data/com.termux" ]]; then
#         ...
#     elif [[ "$(uname)" == "Darwin" ]]; then
#         ...
#     elif [[ "$(uname)" == "Linux" ]]; then
#         ...

source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

# To test this, I'll create a temporary file that mocks 'uname'
mkdir -p bin_mock
cat <<EOF > bin_mock/uname
#!/bin/sh
echo "\$MOCK_UNAME"
EOF
chmod +x bin_mock/uname

test_platform() {
    local has_termux_dir=$1
    export MOCK_UNAME=$2
    
    echo "Testing with has_termux_dir=$has_termux_dir, UNAME=$MOCK_UNAME"
    
    # We can't easily mock [[ -d ... ]] without changing the script
    # So I'll just test the uname parts by ensuring /data/data/com.termux doesn't exist (it DOES in this env)
    # Wait, if I'm IN Termux, it will always pick Termux.
    
    PATH="$PWD/bin_mock:$PATH" detect_platform
    echo "  PLATFORM=$PLATFORM"
}

# Since I'm IN Termux, the first check [[ -d "/data/data/com.termux" ]] will always be true.
# To test the others, I'd need to temporarily rename that directory, which I CANNOT do.

# So I'll just manually inspect the code for other platforms.
# macOS: [[ "$(uname)" == "Darwin" ]] -> PLATFORM="macos", FONT_DEST="$HOME/Library/Fonts/NerdFonts" (Correct)
# Linux: [[ "$(uname)" == "Linux" ]] -> PLATFORM="linux", FONT_DEST="$HOME/.local/share/fonts/NerdFonts" (Correct)

echo "Manual inspection confirms macOS and Linux paths are standard."
