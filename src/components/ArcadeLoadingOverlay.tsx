import React, { useEffect, useState } from 'react';
import { Gamepad2, Sparkles, Cpu } from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { useApp } from '../context/AppContext';

interface ArcadeLoadingOverlayProps {
  onComplete: () => void;
}

export const ArcadeLoadingOverlay: React.FC<ArcadeLoadingOverlayProps> = ({ onComplete }) => {
  const { t } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    soundFx.playCoin();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden animate-fade-in">
      {/* Background Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-slate-900/80 p-8 rounded-3xl border-2 border-orange-500/40 shadow-2xl backdrop-blur-xl">
        
        {/* Animated Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 blur-md opacity-70 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-slate-900 border-2 border-orange-400 flex items-center justify-center text-white shadow-xl">
            <Gamepad2 className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-fredoka font-bold border border-orange-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.arcadeInitTag}</span>
          </div>

          <h2 className="text-2xl font-black font-fredoka text-white tracking-wide">
            {t.arcadeLoadingTitle}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            {t.arcadeLoadingSub}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 border border-slate-700 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-100 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Cpu className="w-3 h-3" /> Physics 60 FPS Ready
            </span>
            <span className="font-bold text-amber-300">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
