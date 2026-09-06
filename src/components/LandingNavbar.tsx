import React, { useState } from 'react';
import { Volume2, VolumeX, Download, Gamepad2, User, Briefcase, GraduationCap, Code2, Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingNavbarProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenArcade: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onScrollToSection,
  onOpenArcade,
  isAudioMuted,
  onToggleAudio
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, lang, toggleLang, t } = useApp();
  const isLight = theme === 'light';

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 select-none ${
      isLight ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/80 border-slate-800/80 text-white'
    }`}>
      <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onScrollToSection('hero')}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-800 overflow-hidden shadow-lg border-2 border-orange-400 group-hover:scale-105 transition-transform shrink-0">
            <img src="/profile.jpg" alt="Kuat Riawan" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className={`font-fredoka font-black text-sm sm:text-base tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                KUAT RIAWAN
              </span>
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                {t.availableForHire}
              </span>
            </div>
            <span className={`text-[9px] sm:text-[10px] font-mono block -mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.roleSubtitle}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-3 xl:space-x-4 text-xs font-fredoka">
          <button
            onClick={() => onScrollToSection('hero')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.navAbout}</span>
          </button>

          <button
            onClick={onOpenArcade}
            className="px-3 py-2 rounded-xl text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Gamepad2 className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{t.navPortfolio}</span>
          </button>

          <button
            onClick={() => onScrollToSection('experience')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.navExperience}</span>
          </button>

          <button
            onClick={() => onScrollToSection('education')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            <span>{t.navEducation}</span>
          </button>

          <button
            onClick={() => onScrollToSection('certificates')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.navCertificates}</span>
          </button>

          <button
            onClick={() => onScrollToSection('skills')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.navSkills}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Language Switcher Button (ID / EN) */}
          <button
            onClick={toggleLang}
            className={`px-2 sm:px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs border flex items-center space-x-1 transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
            }`}
            title={lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 rounded-xl border shadow-sm transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={theme === 'dark' ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Main Speaker Audio Button (Toggles Sunflower Background Track) */}
          <button
            onClick={onToggleAudio}
            className={`p-1.5 sm:p-2 rounded-xl border shadow-sm transition-all flex items-center space-x-1 ${
              !isAudioMuted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 animate-pulse'
                : isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isAudioMuted ? 'Nyalakan Musik Sunflower' : 'Matikan / Mute Musik'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* Unduh CV Primary CTA (Desktop & Tablet) */}
          <a
            href="/CV_KUAT_RIAWAN.pdf"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-fredoka font-bold text-xs rounded-xl shadow-lg border border-orange-400 items-center space-x-1.5 transition-all active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="text-white">{t.navDownloadCv}</span>
          </a>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 sm:p-2 rounded-xl border shadow-sm transition-colors md:hidden ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
            }`}
            title="Menu Navigasi Mobile"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5 text-orange-500" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-2 backdrop-blur-xl transition-all ${
          isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xl' : 'bg-slate-900/95 border-slate-800 text-white shadow-2xl'
        }`}>
          <button
            onClick={() => { onScrollToSection('hero'); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-medium hover:bg-orange-500/10 text-left transition-colors"
          >
            <User className="w-4 h-4 text-orange-500" />
            <span>{t.navAbout}</span>
          </button>

          <button
            onClick={() => { onOpenArcade(); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 text-left transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{t.navPortfolio}</span>
          </button>

          <button
            onClick={() => { onScrollToSection('experience'); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-medium hover:bg-blue-500/10 text-left transition-colors"
          >
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>{t.navExperience}</span>
          </button>

          <button
            onClick={() => { onScrollToSection('education'); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-medium hover:bg-purple-500/10 text-left transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>{t.navEducation}</span>
          </button>

          <button
            onClick={() => { onScrollToSection('certificates'); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-medium hover:bg-amber-500/10 text-left transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>{t.navCertificates}</span>
          </button>

          <button
            onClick={() => { onScrollToSection('skills'); setIsMobileMenuOpen(false); }}
            className="w-full px-4 py-2.5 rounded-xl flex items-center space-x-3 font-fredoka text-sm font-medium hover:bg-emerald-500/10 text-left transition-colors"
          >
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>{t.navSkills}</span>
          </button>

          {/* Mobile CV Download CTA */}
          <div className="pt-2">
            <a
              href="/CV_KUAT_RIAWAN.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-fredoka font-bold text-xs rounded-xl shadow-md border border-orange-400 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{t.navDownloadCv}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
