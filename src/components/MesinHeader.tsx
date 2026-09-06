import React, { useState } from 'react';
import { Volume2, VolumeX, FolderGit2, RotateCcw } from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { useApp } from '../context/AppContext';

interface MesinHeaderProps {
  onOpenDeskripsiKarya?: () => void;
  onResetMachine?: () => void;
}

export const MesinHeader: React.FC<MesinHeaderProps> = ({
  onOpenDeskripsiKarya,
  onResetMachine
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const toggleSound = () => {
    const nextMuted = !isMuted;
    soundFx.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <header className={`w-full border-b sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-xs select-none transition-colors ${
      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-[#f8fafc] border-slate-200 text-slate-800'
    }`}>
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Rak Kapsul Button (Pojok Kiri Atas) */}
        <button
          onClick={onOpenDeskripsiKarya}
          className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-fredoka font-bold text-[10px] sm:text-xs flex items-center space-x-1 border border-amber-500 shadow-xs transition-all active:scale-95 shrink-0"
          title={t.arcadeRackBtn}
        >
          <FolderGit2 className="w-3.5 h-3.5 text-slate-900" />
          <span>{t.arcadeRackBtn}</span>
        </button>

        {/* Center Title */}
        <h1 className="text-xs sm:text-base font-black font-fredoka tracking-wide text-center truncate">
          {t.portalTitle}
        </h1>

        {/* Right Actions: Reset Button + Speaker Mute Button */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {onResetMachine && (
            <button
              onClick={() => {
                soundFx.playMoveWhirr();
                onResetMachine();
              }}
              className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 border border-rose-300 flex items-center justify-center transition-all active:scale-95 shadow-xs"
              title={t.arcadeResetBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors border border-slate-300 shadow-xs"
            title={isMuted ? 'Suara Matik' : 'Suara Hidup'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

