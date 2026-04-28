#!/usr/bin/env bash
source /data/data/com.termux/files/home/mux-nf/install.sh > /dev/null 2>&1

detect_platform
fetch_fonts
head -n 5 fonts.list
