import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gamepad2, X, Move } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

export const ArcadeMascot: React.FC<ArcadeMascotProps> = ({ onScrollToArcade }) => {
  // Coordinates relative to profile card container
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 220, y: -40 });
  const [direction, setDirection] = useState<'right' | 'left'>('left');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasBeenDragged, setHasBeenDragged] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku ClawBot 🤖 Tarik/geser aku atau klik aku!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);

  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 220,
    initialPosY: -40,
  });

  const mascotQuotes = [
    'Ssshh... Aku ngumpet di belakang kartu profil Kuat Riawan! 🤫🤖',
    'Kamu bisa angkat & geser aku ke mana saja lho! ✋✨',
    'Proyek NURAGA AI K3 keren banget! 🚀 WA Gateway & Analytics!',
    'Kuat Riawan lulus Beasiswa Dicoding 2026 Predikat Distinction! 🏆',
    'Miringkan / kocok HP kamu di arena capit untuk mengacak posisi bola! 📱',
    'Database K3 3.000+ peserta sudah dikelola otomatis! ⚡',
    'Kuat Riawan siap diajak berkembang & kerja sebagai Full-Stack Web Dev! 💼'
  ];

  // Random Wandering around Card Edges (only if user hasn't custom-dragged it recently)
  useEffect(() => {
    if (isDragging || hasBeenDragged) return;

    // Card edge anchor spots (relative to top-left of Profile Card container)
    const anchorSpots = [
      { x: 240, y: -42, dir: 'left' },
      { x: 40, y: -42, dir: 'right' },
      { x: 320, y: 30, dir: 'left' },
      { x: 140, y: -46, dir: 'right' },
      { x: 280, y: -42, dir: 'left' },
    ];

    let spotIdx = 0;
    const interval = setInterval(() => {
      spotIdx = (spotIdx + 1) % anchorSpots.length;
      const spot = anchorSpots[spotIdx];
      setPos({ x: spot.x, y: spot.y });
      setDirection(spot.dir as 'left' | 'right');

      // Random chance to speak while wandering
      if (Math.random() > 0.4) {
        const q = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
        setSpeechBubble(q);
        setShowSpeech(true);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isDragging, hasBeenDragged]);

  // DRAG & DROP HANDLERS (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }
  };

  const startDrag = (clientX: number, clientY: number) => {
    soundFx.playGrabPulse();
    setIsDragging(true);
    setHasBeenDragged(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: pos.x,
      initialPosY: pos.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      setPos({
        x: dragRef.current.initialPosX + dx,
        y: dragRef.current.initialPosY + dy,
      });
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
        setSpeechBubble('Asik! Makasih udah mindahin aku! 🤖✨');
        setShowSpeech(true);
      }
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handlePointerUp();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, pos.x, pos.y]);

  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    soundFx.playGrabPulse();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    const q = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
    setSpeechBubble(q);
    setShowSpeech(true);
  };

  return (
    <div
      className={`absolute transition-all ${
        isDragging ? 'duration-0 z-50 scale-110 cursor-grabbing' : 'duration-700 ease-in-out z-10 cursor-grab'
      } select-none pointer-events-auto`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        top: 0,
        left: 0,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative group flex flex-col items-center">
        
        {/* Speech Bubble Above Pet Mascot */}
        {showSpeech && (
          <div className="absolute -top-24 -left-14 w-56 bg-slate-900/95 text-slate-100 border-2 border-amber-400 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs font-fredoka z-50 pointer-events-auto">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ClawBot 🤖</span>
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
            
            <p className="leading-snug text-slate-200 text-[11px]">{speechBubble}</p>

            {onScrollToArcade && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToArcade();
                }}
                className="mt-2 w-full py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] rounded-lg border border-orange-300 flex items-center justify-center space-x-1 hover:brightness-110 active:scale-95 transition-all shadow-xs"
              >
                <Gamepad2 className="w-3 h-3" />
                <span>Mainkan Capit Karya!</span>
              </button>
            )}

            {/* Speech Pointer Arrow */}
            <div className="absolute -bottom-2 left-20 w-3.5 h-3.5 bg-slate-900 border-b-2 border-r-2 border-amber-400 rotate-45" />
          </div>
        )}

        {/* Drag Hint Indicator on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-slate-900/90 text-amber-400 border border-slate-700 rounded-full text-[9px] font-fredoka flex items-center space-x-1 whitespace-nowrap shadow-md">
          <Move className="w-3 h-3" />
          <span>Angkat & Geser Aku!</span>
        </div>

        {/* 2D Interactive Robot Pet SVG Character */}
        <div
          onClick={handleMascotClick}
          className={`transition-transform duration-300 ${
            isDragging
              ? 'rotate-12 scale-110 drop-shadow-2xl'
              : isJumping
              ? '-translate-y-6 rotate-12 scale-110'
              : 'hover:scale-105 active:scale-95'
          } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
          title="Tarik untuk memindahkan ClawBot! 🤖"
        >
          <svg width="80" height="90" viewBox="0 0 85 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            {/* Antenna Pole & Glowing Pulsing Bulb */}
            <line x1="42.5" y1="16" x2="42.5" y2="6" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="42.5" cy="5" r="5" fill="#f59e0b" className={isDragging ? "animate-ping" : "animate-pulse"} />
            <circle cx="42.5" cy="5" r="2.5" fill="#fef08a" />

            {/* Metallic Head Helmet */}
            <rect x="18" y="16" width="49" height="32" rx="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
            
            {/* Visor Screen */}
            <rect x="23" y="21" width="39" height="22" rx="8" fill="#0f172a" />
            
            {/* Glowing Cyan Eyes */}
            <circle cx="33" cy="32" r="4.5" fill="#00f0ff" className={isDragging ? "animate-ping" : ""} />
            <circle cx="33" cy="32" r="4" fill="#00f0ff" />
            <circle cx="52" cy="32" r="4.5" fill="#00f0ff" className={isDragging ? "animate-ping" : ""} />
            <circle cx="52" cy="32" r="4" fill="#00f0ff" />
            
            {/* Cute Smile Arc */}
            <path d={isDragging ? "M33 39 Q 42.5 45 52 39" : "M36 37 Q 42.5 41 49 37"} stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Neck Joint */}
            <rect x="36" y="48" width="13" height="5" fill="#64748b" />

            {/* Arcade Body Core */}
            <rect x="15" y="53" width="55" height="28" rx="10" fill="#f97316" stroke="#0f172a" strokeWidth="3" />
            
            {/* Body Screen / Joypad */}
            <rect x="23" y="58" width="39" height="18" rx="6" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Colorful Arcade Buttons */}
            <circle cx="31" cy="67" r="4" fill="#ef4444" />
            <circle cx="42.5" cy="67" r="4" fill="#3b82f6" />
            <circle cx="54" cy="67" r="4" fill="#10b981" />

            {/* Animated Feet / Legs */}
            <g className={isDragging ? "animate-bounce" : ""} style={{ animationDuration: '0.2s' }}>
              <rect x="26" y="81" width="11" height="9" rx="4" fill="#1e293b" />
              <rect x="48" y="81" width="11" height="9" rx="4" fill="#1e293b" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
};
