#!/usr/bin/env bash

# =======================================================
# Mux-NF Manager - Web Installer Script
# Host this file at: https://mux-nf.razael-fox.my.id/install
# =======================================================

set -e

# Warna Terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}   Mux-NF Manager Installer${NC}"
echo -e "${BLUE}=======================================${NC}"

# 1. Deteksi Lingkungan (Termux vs Linux/Mac)
if [ -n "$PREFIX" ] && [ -d "$PREFIX" ] && [[ $PREFIX == *"com.termux"* ]]; then
  IS_TERMUX=true
  echo -e "${YELLOW}[*] Lingkungan Termux terdeteksi.${NC}"
else
  IS_TERMUX=false
  echo -e "${YELLOW}[*] Lingkungan Linux/macOS terdeteksi.${NC}"
fi

# 2. Periksa Dependensi Wajib (Node.js & Git)
echo -e "${BLUE}[*] Memeriksa dependensi sistem...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}[*] Node.js belum terinstal. Memasang Node.js...${NC}"
  if [ "$IS_TERMUX" = true ]; then
    pkg update -y && pkg install -y nodejs
  else
    echo -e "${RED}[!] Gagal: Node.js tidak ditemukan. Harap instal Node.js terlebih dahulu.${NC}"
    exit 1
  fi
fi

if ! command -v git &> /dev/null; then
  echo -e "${YELLOW}[*] Git belum terinstal. Memasang Git...${NC}"
  if [ "$IS_TERMUX" = true ]; then
    pkg install -y git
  else
    echo -e "${RED}[!] Gagal: Git tidak ditemukan. Harap instal Git terlebih dahulu.${NC}"
    exit 1
  fi
fi

# 3. Kloning Repositori Mux-NF
INSTALL_DIR="$HOME/.mux-nf"
# GANTI URL DI BAWAH INI DENGAN REPOSITORI GITHUB/SERVER KAMU:
REPO_URL="https://github.com/razaeldotexe/mux-nf.git"

echo -e "${BLUE}[*] Mengunduh Mux-NF Manager...${NC}"
if [ -d "$INSTALL_DIR" ]; then
  echo -e "${YELLOW}[*] Menemukan instalasi lama. Memperbarui...${NC}"
  cd "$INSTALL_DIR"
  git pull origin main
else
  git clone "$REPO_URL" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# 4. Instalasi Paket & Kompilasi
echo -e "${BLUE}[*] Memasang modul & Mengkompilasi CLI...${NC}"
npm install --silent
node ./node_modules/.bin/tsup src/index.tsx --format esm --minify --clean
echo '#!/usr/bin/env node' | cat - dist/index.js > temp && mv temp dist/index.js && chmod +x dist/index.js

# 5. Link secara Global
echo -e "${BLUE}[*] Mendaftarkan CLI ke sistem global...${NC}"
npm link

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}✔ Instalasi Berhasil Diselesaikan!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "Sekarang kamu bisa menjalankan CLI ini kapan saja dengan mengetik: ${YELLOW}mux-nf${NC}"
