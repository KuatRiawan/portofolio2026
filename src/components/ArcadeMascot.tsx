import React, { useState, useEffect } from 'react';
import { Sparkles, Gamepad2, X } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

export const ArcadeMascot: React.FC<ArcadeMascotProps> = ({ onScrollToArcade }) => {
  const [posX, setPosX] = useState<number>(10); // Percentage across screen width (5% to 85%)
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku ClawBot 🤖 Ayo mainkan mesin capit portofolio!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const mascotQuotes = [
    'Halo! Aku ClawBot 🤖 Ayo mainkan mesin capit portofolio Kuat!',
    'Proyek NURAGA AI K3 keren banget lho! 🚀 WA Gateway & Realtime Analytics!',
    'Kuat Riawan lulus Beasiswa Dicoding 2026 dengan Predikat Distinction! 🏆',
    'Miringkan / kocok HP kamu di arena capit untuk mengacak posisi bola! 📱',
    'Database K3 3.000+ peserta sudah dikelola otomatis! ⚡',
    'Klik tombol CAPIT untuk menangkap kapsul karya 3D! 🎯',
    'Kuat Riawan siap diajak berkembang & kerja sebagai Full-Stack Web Dev! 💼'
  ];

  // Walking Loop Animation
  useEffect(() => {
    if (isMinimized) return;

    const interval = setInterval(() => {
      setPosX((prevX) => {
        let newX = prevX;

        if (direction === 'right') {
          newX += 0.4;
          if (newX >= 82) {
            newX = 82;
            setDirection('left');
          }
        } else {
          newX -= 0.4;
          if (newX <= 8) {
            newX = 8;
            setDirection('right');
          }
        }

        return newX;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [direction, isMinimized]);

  // Periodic Speech Bubble Update
  useEffect(() => {
    if (isMinimized) return;

    const speechTimer = setInterval(() => {
      const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
      setSpeechBubble(randomQuote);
      setShowSpeech(true);

      setTimeout(() => {
        setShowSpeech(false);
      }, 5000);

    }, 12000);

    return () => clearInterval(speechTimer);
  }, [isMinimized]);

  const handleMascotClick = () => {
    soundFx.playGrabPulse();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);

    const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
    setSpeechBubble(randomQuote);
    setShowSpeech(true);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-full shadow-2xl border-2 border-amber-300 flex items-center space-x-2 animate-bounce hover:scale-105 transition-all"
        title="Tampilkan Maskot ClawBot 🤖"
      >
        <span className="text-xl">🤖</span>
        <span className="font-fredoka font-bold text-xs pr-1">ClawBot</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-3 z-40 transition-all duration-300 ease-linear pointer-events-auto select-none"
      style={{ left: `${posX}%` }}
    >
      <div className="relative group flex flex-col items-center">
        
        {/* Speech Bubble Above Mascot */}
        {showSpeech && (
          <div className="absolute bottom-20 -left-20 w-64 bg-slate-900/95 text-slate-100 border-2 border-amber-400 p-3 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs font-fredoka z-50">
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>ClawBot Says:</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeech(false);
                }}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="leading-snug text-slate-200">{speechBubble}</p>

            {onScrollToArcade && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToArcade();
                }}
                className="mt-2 w-full py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] rounded-lg border border-orange-300 flex items-center justify-center space-x-1 hover:brightness-110 active:scale-95 transition-all"
              >
                <Gamepad2 className="w-3 h-3" />
                <span>Mainkan Capit Sekarang!</span>
              </button>
            )}

            {/* Speech Pointer Arrow */}
            <div className="absolute -bottom-2 left-24 w-4 h-4 bg-slate-900 border-b-2 border-r-2 border-amber-400 rotate-45" />
          </div>
        )}

        {/* Action Controls Menu on Hover / Click */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 flex items-center space-x-1 bg-slate-900/90 border border-slate-700 p-1 rounded-xl shadow-lg backdrop-blur-xs text-[10px] font-fredoka">
          <button
            onClick={() => setIsMinimized(true)}
            className="px-2 py-0.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-md"
            title="Sembunyikan Maskot"
          >
            Sembunyikan
          </button>
        </div>

        {/* 2D Interactive Robot Mascot SVG Character */}
        <div
          onClick={handleMascotClick}
          className={`cursor-pointer transition-transform duration-200 ${
            isJumping ? '-translate-y-6 rotate-12 scale-110' : 'hover:scale-105 active:scale-95'
          } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
          title="Klik aku untuk bicara! 🤖"
        >
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
            {/* Antenna Pole & Glowing Bulb */}
            <line x1="30" y1="12" x2="30" y2="4" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="3" r="4" fill="#f59e0b" className="animate-pulse" />
            <circle cx="30" cy="3" r="2" fill="#fef08a" />

            {/* Metallic Head Helmet */}
            <rect x="12" y="12" width="36" height="24" rx="10" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            
            {/* Screen Visor Face */}
            <rect x="16" y="16" width="28" height="16" rx="6" fill="#0f172a" />
            
            {/* Animated Cyan LED Eyes */}
            <circle cx="23" cy="24" r="3.5" fill="#00f0ff" className="animate-ping" />
            <circle cx="23" cy="24" r="3" fill="#00f0ff" />
            <circle cx="37" cy="24" r="3.5" fill="#00f0ff" className="animate-ping" />
            <circle cx="37" cy="24" r="3" fill="#00f0ff" />
            
            {/* Cute Mouth Smile Arc */}
            <path d="M26 28 Q 30 31 34 28" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Neck Joint */}
            <rect x="25" y="36" width="10" height="4" fill="#64748b" />

            {/* Main Arcade Cabinet Body Core */}
            <rect x="10" y="40" width="40" height="22" rx="8" fill="#f97316" stroke="#0f172a" strokeWidth="2.5" />
            
            {/* Body Center Arcade Joystick Screen */}
            <rect x="16" y="44" width="28" height="14" rx="4" fill="#fff" stroke="#f59e0b" strokeWidth="1.5" />
            
            {/* Little Gachapon Button on Chest */}
            <circle cx="22" cy="51" r="3" fill="#ef4444" />
            <circle cx="30" cy="51" r="3" fill="#3b82f6" />
            <circle cx="38" cy="51" r="3" fill="#10b981" />

            {/* Animated Walking Feet / Legs */}
            <g className="animate-bounce" style={{ animationDuration: '0.4s' }}>
              <rect x="18" y="62" width="8" height="6" rx="3" fill="#1e293b" />
              <rect x="34" y="62" width="8" height="6" rx="3" fill="#1e293b" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
};
