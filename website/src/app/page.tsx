"use client";

import React, { useState } from 'react';
import { ShieldCheck, Zap, Palette, Save, Copy, Globe } from 'lucide-react';

const dict = {
  en: {
    navFeat: "Features",
    navInst: "Installation",
    heroTitleA: "Level up your ",
    heroTitleB: "Terminal",
    heroTitleC: " Experience.",
    heroSub: "Next-generation interactive CLI Nerd Font manager. Built with TypeScript & React Ink for the ultimate TUI experience.",
    btnInstall: "Start Installation",
    btnFeat: "Explore Features",
    termVer: "Version",
    termMenu: "Main Menu:",
    termOpt1: "❯ Install New Fonts (Fetch from GitHub)",
    termOpt2: "  Switch Active Font (Select from Cache)",
    termOpt3: "  Clear Cache",
    termOpt4: "  Exit",
    featTitleA: "Core ",
    featTitleB: "Advantages",
    featSub: "Designed to run lightning-fast without sacrificing memory stability on mobile OS.",
    feat1: "Anti-OOM",
    feat1Desc: "Stream Pipeline for safe downloads without RAM overflow risks.",
    feat2: "Async Extract",
    feat2Desc: "Extracts hundreds of massive zip files without blocking CLI animations.",
    feat3: "Premium UI",
    feat3Desc: "Tokyo Night + React Ink TUI for eye-pleasing interactive navigation.",
    feat4: "Smart Caching",
    feat4Desc: "Switch fonts anytime without consuming internet quota again.",
    instTitleA: "One Command, ",
    instTitleB: "Thousands of Fonts",
    instSub: "No manual installation needed. Just run this magic command in your Termux, macOS, or Linux terminal.",
    instNote: "✨ Automatically detects and installs Node.js & Git if missing.",
    footerA: "Built with ",
    footerB: " by ",
    footerC: " and "
  },
  id: {
    navFeat: "Fitur",
    navInst: "Instalasi",
    heroTitleA: "Tingkatkan Pengalaman ",
    heroTitleB: "Terminal",
    heroTitleC: " Anda.",
    heroSub: "Manajer Nerd Font berbasis CLI interaktif generasi baru. Dibangun dengan TypeScript & React Ink untuk pengalaman TUI paling mutakhir.",
    btnInstall: "Mulai Instalasi",
    btnFeat: "Jelajahi Fitur",
    termVer: "Versi",
    termMenu: "Menu Utama:",
    termOpt1: "❯ Instal Font Baru (Ambil dari GitHub)",
    termOpt2: "  Ganti Font Aktif (Pilih dari Cache)",
    termOpt3: "  Bersihkan Cache",
    termOpt4: "  Keluar",
    featTitleA: "Keunggulan ",
    featTitleB: "Utama",
    featSub: "Dirancang untuk bekerja secepat kilat tanpa mengorbankan stabilitas memori di OS seluler.",
    feat1: "Anti-OOM",
    feat1Desc: "Stream Pipeline untuk unduhan aman tanpa risiko RAM meluap.",
    feat2: "Async Extract",
    feat2Desc: "Mengekstrak ratusan file zip raksasa tanpa memblokir animasi CLI.",
    feat3: "Premium UI",
    feat3Desc: "Tokyo Night + React Ink TUI untuk navigasi interaktif memanjakan mata.",
    feat4: "Smart Caching",
    feat4Desc: "Bebas ganti font kapan saja tanpa menyedot kuota internet lagi.",
    instTitleA: "Satu Perintah, ",
    instTitleB: "Ribuan Font",
    instSub: "Tidak perlu instalasi manual. Cukup jalankan perintah sakti ini di terminal Termux, macOS, atau Linux kamu.",
    instNote: "✨ Otomatis mendeteksi Node.js & Git dan menginstalnya jika belum ada.",
    footerA: "Dibuat dengan ",
    footerB: " oleh ",
    footerC: " dan "
  }
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const t = dict[lang];

  return (
    <div className="min-h-screen bg-[#1a1b26] text-[#c0caf5] font-sans selection:bg-[#7aa2f7] selection:text-white relative overflow-x-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-[#7aa2f7] rounded-full mix-blend-screen filter blur-[100px] sm:blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-[#bb9af7] rounded-full mix-blend-screen filter blur-[100px] sm:blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#1a1b26]/70 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Mux-NF<span className="text-[#bb9af7]">.</span>
          </div>
          <ul className="flex space-x-3 sm:space-x-6 lg:space-x-8 items-center text-xs sm:text-sm font-medium">
            <li className="hidden md:block"><a href="#features" className="hover:text-[#7aa2f7] transition-colors">{t.navFeat}</a></li>
            <li className="hidden md:block"><a href="#installation" className="hover:text-[#7aa2f7] transition-colors">{t.navInst}</a></li>
            <li>
              <button 
                onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[#c0caf5]"
                title="Toggle Language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-bold">{lang}</span>
              </button>
            </li>
            <li>
              <a href="https://github.com/razaeldotexe/mux-nf" target="_blank" rel="noreferrer" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#7aa2f7] text-[#7aa2f7] hover:bg-[#7aa2f7] hover:text-[#1a1b26] transition-all font-bold">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center min-h-[75vh]">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight text-white">
              {t.heroTitleA} <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7]">{t.heroTitleB}</span>{t.heroTitleC}
            </h1>
            <p className="text-base sm:text-lg text-[#787c99] leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t.heroSub}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
              <a href="#installation" className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#7aa2f7] text-[#1a1b26] font-bold hover:bg-[#7dcfff] hover:-translate-y-1 transition-all shadow-[0_0_20px_rgba(122,162,247,0.3)]">
                {t.btnInstall}
              </a>
              <a href="#features" className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium">
                {t.btnFeat}
              </a>
            </div>
          </div>

          {/* Terminal Mockup */}
          <div className="relative group w-full max-w-full sm:max-w-lg mx-auto mt-8 lg:mt-0 lg:ml-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#16161e] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {/* Terminal Window Header */}
              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1b26] border-b border-white/5">
                <div className="flex space-x-1.5 sm:space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#f7768e]"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#e0af68]"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#9ece6a]"></div>
                </div>
                <div className="mx-auto text-[10px] sm:text-xs font-mono text-[#565f89]">user@termux:~</div>
              </div>
              {/* Terminal Window Body */}
              <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-sm leading-relaxed overflow-x-auto scrollbar-hide">
                <p><span className="text-[#9ece6a]">user@termux</span> <span className="text-[#7aa2f7]">~</span> $ mux-nf</p>
                <div className="mt-3 sm:mt-4">
                  <pre className="text-[#7dcfff] font-bold leading-tight text-[8px] sm:text-xs md:text-sm">
{`   __  __ _   ___  __   _  _ ___ 
  |  \\/  | | | \\ \\/ /  | \\| | __|
  | |\\/| | |_| |>  <   | .\\\` | _| 
  |_|  |_|\\__,_/_/\\_\\  |_|\\_|_|  `}
                  </pre>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-[#7aa2f7] font-bold">Mux-NF Manager</span>
                    <span className="mt-1 sm:mt-0"><span className="text-[#565f89]">{t.termVer}</span> <span className="text-[#9ece6a] font-bold">1.0.0 Stable</span></span>
                  </div>
                  <p className="text-[#e0af68] mt-1 mb-3 sm:mb-4">Modern • Animated • Interactive</p>
                  
                  <p className="text-[#bb9af7] font-bold">{t.termMenu}</p>
                  <p className="text-[#7dcfff] font-bold">{t.termOpt1}</p>
                  <p className="text-[#c0caf5]">{t.termOpt2}</p>
                  <p className="text-[#c0caf5]">{t.termOpt3}</p>
                  <p className="text-[#c0caf5]">{t.termOpt4}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 lg:py-32">
          <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{t.featTitleA}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bb9af7] to-[#7dcfff]">{t.featTitleB}</span></h2>
            <p className="text-[#787c99] max-w-2xl mx-auto text-base sm:text-lg">{t.featSub}</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#7aa2f7]" />, title: t.feat1, desc: t.feat1Desc },
              { icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-[#e0af68]" />, title: t.feat2, desc: t.feat2Desc },
              { icon: <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-[#bb9af7]" />, title: t.feat3, desc: t.feat3Desc },
              { icon: <Save className="w-8 h-8 sm:w-10 sm:h-10 text-[#9ece6a]" />, title: t.feat4, desc: t.feat4Desc }
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:bg-white/10 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm group">
                <div className="mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{f.title}</h3>
                <p className="text-sm sm:text-base text-[#787c99] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Installation Section */}
        <section id="installation" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="bg-gradient-to-br from-[#1a1b26] to-[#16161e] border border-white/10 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#7dcfff] rounded-full mix-blend-screen filter blur-[100px] sm:blur-[120px] opacity-10"></div>
            
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">{t.instTitleA}<span className="text-[#7dcfff]">{t.instTitleB}</span></h2>
              <p className="text-sm sm:text-base text-[#787c99] mb-8 sm:mb-10 lg:text-lg">{t.instSub}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-black/50 border border-white/10 rounded-xl p-3 sm:p-4 max-w-2xl mx-auto font-mono text-xs sm:text-sm shadow-inner group">
              <code className="text-[#9ece6a] break-all sm:break-normal text-left flex-1 mb-3 sm:mb-0 w-full">
                <span className="text-[#565f89] select-none mr-2 sm:mr-3">$</span>
                curl -fsSL https://mux-nf.razael-fox.my.id/install | bash
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText('curl -fsSL https://mux-nf.razael-fox.my.id/install | bash')}
                className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-sans text-xs transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <p className="text-center text-xs sm:text-sm text-[#565f89] mt-5 sm:mt-6 font-medium">{t.instNote}</p>
          </div>
        </section>

      </main>
      
      <footer className="border-t border-white/5 py-8 sm:py-10 mt-6 sm:mt-10 text-center text-[#565f89] text-xs sm:text-sm">
        <p className="mb-2">
          {t.footerA} <a href="https://nodejs.org/" target="_blank" rel="noreferrer" className="text-[#9ece6a] hover:text-[#7dcfff] hover:underline transition-colors font-semibold">NodeJS</a>{t.footerB}<a href="https://github.com/Razael-Fox" target="_blank" rel="noreferrer" className="text-white hover:text-[#7aa2f7] hover:underline transition-colors font-bold">Razael</a>{t.footerC}<a href="https://gemini.google.com/" target="_blank" rel="noreferrer" className="text-[#7aa2f7] hover:text-[#bb9af7] hover:underline transition-colors font-semibold">Gemini</a>.
        </p>
        <p>Mux-NF © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}
