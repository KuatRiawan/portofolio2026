import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { useApp } from '../context/AppContext';

export const MesinHeader: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const toggleSound = () => {
    const nextMuted = !isMuted;
    soundFx.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <header className={`w-full border-b sticky top-0 z-40 px-4 py-3 shadow-xs select-none transition-colors ${
      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-[#f8fafc] border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="w-8" />
        {/* Center Clean Title */}
        <h1 className="text-lg font-black font-fredoka tracking-wide text-center">
          {t.portalTitle}
        </h1>
        {/* Mute / Unmute Button */}
        <button
          onClick={toggleSound}
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors border border-slate-300"
          title={isMuted ? 'Suara Matik' : 'Suara Hidup'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>
    </header>
  );
};
