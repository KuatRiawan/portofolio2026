import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Sparkles, Sun, Moon, Globe } from 'lucide-react';
import type { ProjectCapsule, ClawState } from '../types/portfolio';
import { MesinHeader } from './MesinHeader';
import { MesinChamberCanvas } from './MesinChamberCanvas';
import { MesinControlPanel } from './MesinControlPanel';
import { GuestbookModal } from './GuestbookModal';
import { useApp } from '../context/AppContext';

interface ArcadeFullscreenViewProps {
  projects: ProjectCapsule[];
  clawState: ClawState;
  onClawMove: (dx: number) => void;
  onDirectClawMove: (x: number) => void;
  onGrabTrigger: () => void;
  onClawHitBall?: () => void;
  onCapsuleCaught: (project: ProjectCapsule) => void;
  caughtProjects: ProjectCapsule[];
  onOpenDeskripsiKarya: () => void;
  onResetMachine: () => void;
  onBackToLanding: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const ArcadeFullscreenView: React.FC<ArcadeFullscreenViewProps> = ({
  projects,
  clawState,
  onClawMove,
  onDirectClawMove,
  onGrabTrigger,
  onClawHitBall,
  onCapsuleCaught,
  caughtProjects,
  onOpenDeskripsiKarya,
  onResetMachine,
  onBackToLanding,
  isAudioMuted,
  onToggleAudio
}) => {
  const [shakeCount, setShakeCount] = useState(0);
  const { theme, toggleTheme, lang, toggleLang, t, addGuestMessage } = useApp();
  const isLight = theme === 'light';
  
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  const handleShake = () => {
    setShakeCount((prev) => prev + 1);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between p-3 sm:p-6 relative overflow-x-hidden select-none transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Top Navbar */}
      <header className={`w-full max-w-[1750px] mx-auto flex items-center justify-between border rounded-2xl px-4 sm:px-8 py-3 shadow-xl backdrop-blur-md sticky top-2 z-40 transition-colors ${
        isLight ? 'bg-white/90 border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'
      }`}>
        
        {/* Left: Back Button */}
        <button
          onClick={onBackToLanding}
          className={`px-3.5 py-2 font-fredoka font-bold text-xs rounded-xl border flex items-center space-x-2 transition-all active:scale-95 shadow-xs ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>{t.backToPortfolio}</span>
        </button>

        {/* Center: Title */}
        <div className="hidden md:flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className={`font-fredoka font-black text-sm tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.portalTitle}
          </span>
        </div>

        {/* Right Actions: Language, Theme, Audio */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className={`px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs border flex items-center space-x-1 transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
            }`}
            title={lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border shadow-xs transition-colors ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Main Speaker Audio Toggle (Sunflower Track) */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border shadow-xs transition-colors ${
              !isAudioMuted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 animate-pulse'
                : isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isAudioMuted ? 'Nyalakan Musik Sunflower' : 'Matikan / Mute Musik'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>

      </header>

      {/* Main Fullscreen Arcade Cabinet Area */}
      <main className="w-full max-w-[1750px] mx-auto my-auto py-4">
        
        <div className={`border-4 rounded-[36px] shadow-2xl overflow-hidden flex flex-col border-t-8 ${
          isLight ? 'bg-white border-slate-300' : 'bg-[#f8fafc] border-slate-300'
        }`}>
          
          {/* Header */}
          <MesinHeader
            onOpenDeskripsiKarya={onOpenDeskripsiKarya}
            onOpenGuestbook={() => setIsGuestbookOpen(true)}
            onResetMachine={onResetMachine}
          />

          {/* Chamber & Pedestal */}
          <div className="p-2.5 sm:p-5 space-y-2.5 sm:space-y-4 bg-[#e2e8f0]/40 flex-1">
            
            {/* Glass Chamber Canvas */}
            <MesinChamberCanvas
              projects={projects}
              clawState={clawState}
              onClawMove={onDirectClawMove}
              onClawHitBall={onClawHitBall}
              onCapsuleCaught={onCapsuleCaught}
              caughtProjectIds={caughtProjects.map((p) => p.id)}
              shakeCount={shakeCount}
            />

            {/* Pedestal Control Panel */}
            <MesinControlPanel
              onGrabTrigger={onGrabTrigger}
              onJoystickMove={onClawMove}
              onOpenDeskripsiKarya={onOpenDeskripsiKarya}
              onResetMachine={onResetMachine}
              onShakeMachine={handleShake}
              isGrabbing={clawState.isGrabbing}
            />

          </div>

          {/* Cabinet Footer */}
          <footer className="bg-slate-100 p-2 text-center text-[10px] sm:text-xs font-fredoka font-bold text-slate-500 border-t border-slate-200 uppercase tracking-wider">
            {t.cabinetFooter}
          </footer>

        </div>

      </main>

      {/* Bottom Footer Note - Responsive instructions */}
      <footer className={`w-full max-w-4xl mx-auto text-center text-[10px] sm:text-xs font-mono py-2 px-3 ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <span className="sm:hidden">Gunakan Joystick untuk mengarahkan Capit. Tekan CAPIT untuk menangkap bola!</span>
        <span className="hidden sm:inline">{t.cabinetInstruction}</span>
      </footer>

      {/* Guestbook Modal */}
      {isGuestbookOpen && (
        <GuestbookModal 
          onClose={() => setIsGuestbookOpen(false)}
          onSubmit={(name, message) => {
            const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            addGuestMessage({
              id: `guest-${Date.now()}`,
              name,
              message,
              color: randomColor
            });
            setIsGuestbookOpen(false);
          }}
        />
      )}

    </div>
  );
};
