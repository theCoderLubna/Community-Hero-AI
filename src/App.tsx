import React, { useState, useEffect } from "react";
import HackathonHub from "./components/HackathonHub";
import MainAppPrototype from "./components/MainAppPrototype";
import { Sparkles, BookOpen, Sun, Moon, Github } from "lucide-react";

export default function App() {
  const [showDocs, setShowDocs] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-bg-app text-text-primary transition-colors duration-200 ${isDark ? "dark" : ""}`}>
      
      {/* Universal Master Switcher Header */}
      <header className="bg-bg-card border-b border-border-subtle px-4 md:px-6 py-2 md:py-3 flex items-center justify-between gap-3 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9.5 md:h-9.5 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 border-2 md:border-3 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black text-text-primary tracking-tight leading-none flex items-center gap-1">
              COMMUNITY HERO <span className="text-indigo-600 italic font-bold">AI</span>
            </h1>
            <span className="text-[9px] md:text-[10px] text-text-secondary font-bold font-mono tracking-wider uppercase mt-1 block">Smart City Resolution Grid</span>
          </div>
        </div>

        {/* Center: Live App Indicator with Sparkles Badge (Hidden on mobile for maximum space) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-1.5 rounded-xl border border-indigo-100/30">
            <span className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              🚀 Live App
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 px-3 py-1.5 rounded-xl border border-purple-200/20 shadow-sm shrink-0">
            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-mono tracking-tight flex items-center gap-1 uppercase">
              <Sparkles className="w-3 text-amber-500 animate-pulse" />
              ✨ Powered by Gemini AI
            </span>
          </div>
        </div>

        {/* Right side controls: Theme, Github, Docs Button */}
        <div className="flex items-center gap-2">
          {/* GitHub Icon Link */}
          <a
            href="https://github.com/google-gemini"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl bg-bg-panel border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-app transition-all duration-200 shadow-sm shrink-0"
            aria-label="View source code on GitHub"
            id="btn-github-link"
          >
            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs font-bold pr-1 hidden lg:inline">GitHub</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl bg-bg-panel border border-border-subtle text-text-primary hover:bg-bg-app transition-all duration-200 shadow-sm cursor-pointer shrink-0"
            aria-label="Toggle dark mode"
            id="btn-theme-toggle"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span className="text-xs font-bold pr-1 hidden md:inline">Light Beige</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                <span className="text-xs font-bold pr-1 hidden md:inline">Slate Dark</span>
              </>
            )}
          </button>

          {/* Technical Docs Button */}
          <button
            onClick={() => setShowDocs(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-600/15 font-bold text-[10px] sm:text-xs shrink-0 cursor-pointer"
            id="btn-docs-trigger"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden min-[380px]:inline">Technical Docs</span>
            <span className="inline min-[380px]:hidden">Docs</span>
          </button>

          <div className="hidden xl:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold bg-bg-panel text-text-primary border border-border-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Judge V3.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden relative">
        <MainAppPrototype />

        {/* Technical Docs Drawer Modal */}
        {showDocs && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full h-full flex flex-col">
              <HackathonHub onClose={() => setShowDocs(false)} />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
