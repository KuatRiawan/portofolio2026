import React, { useState, useEffect } from 'react';
import { Sparkles, Gamepad2, X, Pause, Play } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
  isAbsolute?: boolean;
}

export const ArcadeMascot: React.FC<ArcadeMascotProps> = ({ onScrollToArcade, isAbsolute = true }) => {
  const [posX, setPosX] = useState<number>(15); // Percentage across container width (5% to 85%)
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false); // Interactive stop/pause walking on click!
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku ClawBot 🤖 Aku lagi jalan-jalan di area highlight. Klik aku untuk berhenti & bicara!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const mascotQuotes = [
    'Ssshh... Aku lagi sembunyi di belakang kartu portofolio Kuat! 🤫🤖',
    'Halo! Aku ClawBot 🤖 Klik aku lagi kalau mau aku jalan-jalan lagi!',
    'Proyek NURAGA AI K3 keren banget lho! 🚀 WA Gateway & Realtime Analytics!',
    'Kuat Riawan lulus Beasiswa Dicoding 2026 dengan Predikat Distinction! 🏆',
    'Miringkan / kocok HP kamu di arena capit untuk mengacak posisi bola! 📱',
    'Database K3 3.000+ peserta sudah dikelola otomatis! ⚡',
    'Klik tombol CAPIT untuk menangkap kapsul karya 3D! 🎯',
    'Kuat Riawan siap diajak berkembang & kerja sebagai Full-Stack Web Dev! 💼'
  ];

  // Walking Loop Animation (Paused if isPaused or isMinimized)
  useEffect(() => {
    if (isMinimized || isPaused) return;

    const interval = setInterval(() => {
      setPosX((prevX) => {
        let newX = prevX;

        if (direction === 'right') {
          newX += 0.35;
          if (newX >= 84) {
            newX = 84;
            setDirection('left');
          }
        } else {
          newX -= 0.35;
          if (newX <= 6) {
            newX = 6;
            setDirection('right');
          }
        }

        return newX;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, isMinimized, isPaused]);

  // Periodic Speech Bubble Update
  useEffect(() => {
    if (isMinimized) return;

    const speechTimer = setInterval(() => {
      if (!isPaused) {
        const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
        setSpeechBubble(randomQuote);
        setShowSpeech(true);

        setTimeout(() => {
          setShowSpeech(false);
        }, 5000);
      }
    }, 12000);

    return () => clearInterval(speechTimer);
  }, [isMinimized, isPaused]);

  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playGrabPulse();
    
    // Toggle paused state on click!
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    if (nextPaused) {
      setSpeechBubble('Aku berhenti sejenak di sini! ⏸️ Klik aku lagi kalau mau aku jalan-jalan lagi! 🚶‍♂️🤖');
    } else {
      const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
      setSpeechBubble(randomQuote);
    }
    setShowSpeech(true);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="absolute bottom-2 right-4 z-40 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full shadow-xl border border-amber-300 flex items-center space-x-1.5 animate-bounce hover:scale-105 transition-all text-xs font-fredoka font-bold"
        title="Tampilkan Maskot ClawBot 🤖"
      >
        <span>🤖</span>
        <span>ClawBot</span>
      </button>
    );
  }

  const containerPositionStyle = isAbsolute
    ? "absolute bottom-1 z-10 transition-all duration-200 ease-linear pointer-events-auto select-none"
    : "fixed bottom-3 z-40 transition-all duration-200 ease-linear pointer-events-auto select-none";

  return (
    <div
      className={containerPositionStyle}
      style={{ left: `${posX}%` }}
    >
      <div className="relative group flex flex-col items-center">
        
        {/* Speech Bubble Above Mascot */}
        {showSpeech && (
          <div className="absolute bottom-20 -left-20 w-64 bg-slate-900/95 text-slate-100 border-2 border-amber-400 p-3 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs font-fredoka z-50 pointer-events-auto">
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>ClawBot {isPaused ? '(Berhenti ⏸️)' : '(Jalan-jalan 🚶‍♂️)'}</span>
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

            <div className="flex items-center gap-1.5 mt-2">
              <button
                onClick={handleMascotClick}
                className={`flex-1 py-1 px-2 rounded-lg font-bold text-[10px] border flex items-center justify-center space-x-1 transition-all ${
                  isPaused 
                    ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600'
                    : 'bg-amber-500 text-slate-950 border-amber-300 hover:bg-amber-600'
                }`}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{isPaused ? 'Jalan Lagi' : 'Berhenti'}</span>
              </button>

              {onScrollToArcade && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onScrollToArcade();
                  }}
                  className="py-1 px-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] rounded-lg border border-orange-300 flex items-center justify-center space-x-1 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Gamepad2 className="w-3 h-3" />
                  <span>Main Capit</span>
                </button>
              )}
            </div>

            {/* Speech Pointer Arrow */}
            <div className="absolute -bottom-2 left-24 w-4 h-4 bg-slate-900 border-b-2 border-r-2 border-amber-400 rotate-45" />
          </div>
        )}

        {/* Status Tooltip on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 flex items-center space-x-1 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-xl shadow-lg backdrop-blur-xs text-[10px] font-fredoka text-amber-400 whitespace-nowrap">
          <span>{isPaused ? '⏸️ Klik untuk jalan' : '🚶‍♂️ Klik untuk berhenti'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="ml-1 text-slate-400 hover:text-rose-400"
            title="Sembunyikan"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* 2D Interactive Robot Mascot SVG Character */}
        <div
          onClick={handleMascotClick}
          className={`cursor-pointer transition-transform duration-200 ${
            isJumping ? '-translate-y-6 rotate-12 scale-110' : 'hover:scale-105 active:scale-95'
          } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
          title={isPaused ? "Klik untuk jalan lagi! 🤖" : "Klik untuk berhenti sejenak! 🤖"}
        >
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
            {/* Antenna Pole & Glowing Bulb */}
            <line x1="30" y1="12" x2="30" y2="4" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="3" r="4" fill={isPaused ? "#ef4444" : "#f59e0b"} className={isPaused ? "" : "animate-pulse"} />
            <circle cx="30" cy="3" r="2" fill="#fef08a" />

            {/* Metallic Head Helmet */}
            <rect x="12" y="12" width="36" height="24" rx="10" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            
            {/* Screen Visor Face */}
            <rect x="16" y="16" width="28" height="16" rx="6" fill="#0f172a" />
            
            {/* Animated Cyan LED Eyes */}
            <circle cx="23" cy="24" r="3.5" fill="#00f0ff" className={isPaused ? "" : "animate-ping"} />
            <circle cx="23" cy="24" r="3" fill="#00f0ff" />
            <circle cx="37" cy="24" r="3.5" fill="#00f0ff" className={isPaused ? "" : "animate-ping"} />
            <circle cx="37" cy="24" r="3" fill="#00f0ff" />
            
            {/* Cute Mouth Smile Arc */}
            <path d={isPaused ? "M24 29 Q 30 27 36 29" : "M26 28 Q 30 31 34 28"} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />

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

            {/* Animated Walking Feet / Legs (Bounce only when walking) */}
            <g className={isPaused ? "" : "animate-bounce"} style={{ animationDuration: '0.4s' }}>
              <rect x="18" y="62" width="8" height="6" rx="3" fill="#1e293b" />
              <rect x="34" y="62" width="8" height="6" rx="3" fill="#1e293b" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
};
