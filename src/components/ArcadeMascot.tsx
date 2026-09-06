import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gamepad2, X, Move, Frown, Heart } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

type MascotMood = 'happy' | 'angry' | 'surprised' | 'love' | 'sleepy';

export const ArcadeMascot: React.FC<ArcadeMascotProps> = ({ onScrollToArcade }) => {
  // Coordinates relative to profile card container
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 220, y: -25 });
  const [direction, setDirection] = useState<'right' | 'left'>('left');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  
  // Emotional Mood Engine
  const [mood, setMood] = useState<MascotMood>('happy');
  const [clickCount, setClickCount] = useState<number>(0);
  
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku ClawBot, tarik atau geser aku atau klik aku!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);

  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 220,
    initialPosY: -25,
  });

  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mascotQuotes = [
    'Ssshh... Aku ngumpet di belakang kartu profil Kuat Riawan!',
    'Kamu bisa angkat dan geser aku ke mana saja lho!',
    'Proyek NURAGA AI K3 keren banget! Ada WA Gateway dan Analytics!',
    'Kuat Riawan lulus Beasiswa Dicoding 2026 Predikat Distinction!',
    'Miringkan atau kocok HP kamu di arena capit untuk mengacak posisi bola!',
    'Database K3 3.000+ peserta sudah dikelola otomatis!',
    'Kuat Riawan siap diajak berkembang dan kerja sebagai Full-Stack Web Dev!'
  ];

  // Active Walking & Wandering Movement Loop
  useEffect(() => {
    if (isDragging || mood === 'sleepy') return;

    const walkSpeed = mood === 'angry' ? 1.2 : 0.45;
    const intervalTime = mood === 'angry' ? 50 : 90;

    const interval = setInterval(() => {
      setPos((prevPos) => {
        let newX = prevPos.x;

        if (direction === 'left') {
          newX -= walkSpeed * 3;
          if (newX <= 10) {
            newX = 10;
            setDirection('right');
          }
        } else {
          newX += walkSpeed * 3;
          if (newX >= 320) {
            newX = 320;
            setDirection('left');
          }
        }

        return { x: newX, y: prevPos.y };
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [direction, isDragging, mood]);

  // Periodic Random Speech Bubble
  useEffect(() => {
    if (isDragging || mood === 'angry') return;

    const speechTimer = setInterval(() => {
      if (mood === 'happy') {
        const q = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
        setSpeechBubble(q);
        setShowSpeech(true);

        setTimeout(() => {
          setShowSpeech(false);
        }, 4500);
      }
    }, 11000);

    return () => clearInterval(speechTimer);
  }, [isDragging, mood]);

  // Idle Timer -> Sleepy after 18 seconds of no interaction
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (!isDragging && mood === 'happy') {
        setMood('sleepy');
        setSpeechBubble('Zzz... ClawBot lagi istirahat sejenak...');
        setShowSpeech(true);
      }
    }, 18000);

    return () => clearTimeout(idleTimer);
  }, [mood, isDragging]);

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
    setMood('surprised'); // Kaget saat diangkat!
    setSpeechBubble('Waaaa! Aku terbang diangkat!');
    setShowSpeech(true);

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
        
        // After drop: Love mood!
        setMood('love');
        setSpeechBubble('Hehe, terima kasih ya sudah memindahkan aku dengan lembut!');
        setShowSpeech(true);

        // Reset to happy after 3.5s
        if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
        moodResetTimerRef.current = setTimeout(() => {
          setMood('happy');
        }, 3500);
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
  }, [isDragging]);

  // Click & Emotional Reaction Logic!
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    soundFx.playGrabPulse();

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2500);

    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);

    // React based on click count & current mood
    if (nextCount >= 3) {
      // ANGRY MOOD!
      setMood('angry');
      setSpeechBubble('Aduh! Jangan diganggu atau dicliki terus dong! ClawBot kesel nih!');
      setShowSpeech(true);

      moodResetTimerRef.current = setTimeout(() => {
        setMood('happy');
        setClickCount(0);
      }, 5000);
    } else if (mood === 'angry') {
      // Petting while angry -> calms down into love
      setMood('love');
      setSpeechBubble('Ya sudah deh, terima kasih sudah mengelus aku!');
      setShowSpeech(true);

      moodResetTimerRef.current = setTimeout(() => {
        setMood('happy');
      }, 3500);
    } else {
      // Normal Happy / Love click
      setMood('happy');
      const q = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
      setSpeechBubble(q);
      setShowSpeech(true);
    }
  };

  return (
    <div
      className={`absolute transition-all ${
        isDragging ? 'duration-0 z-50 scale-110 cursor-grabbing' : 'duration-700 ease-in-out z-30 cursor-grab'
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
          <div className={`absolute -top-24 -left-14 w-56 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs font-fredoka z-50 pointer-events-auto border-2 ${
            mood === 'angry'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500'
              : mood === 'love'
              ? 'bg-pink-950/95 text-pink-100 border-pink-400'
              : mood === 'surprised'
              ? 'bg-amber-950/95 text-amber-100 border-amber-400'
              : 'bg-slate-900/95 text-slate-100 border-amber-400'
          }`}>
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider">
                {mood === 'angry' ? (
                  <Frown className="w-3 h-3 text-rose-400" />
                ) : mood === 'love' ? (
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
                <span className={mood === 'angry' ? 'text-rose-400' : mood === 'love' ? 'text-pink-300' : 'text-amber-400'}>
                  ClawBot {mood === 'angry' ? '(Marah!)' : mood === 'love' ? '(Sayang)' : mood === 'surprised' ? '(Kaget!)' : ''}
                </span>
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
            
            <p className="leading-snug text-[11px]">{speechBubble}</p>

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
            <div className={`absolute -bottom-2 left-20 w-3.5 h-3.5 border-b-2 border-r-2 rotate-45 ${
              mood === 'angry'
                ? 'bg-rose-950 border-rose-500'
                : mood === 'love'
                ? 'bg-pink-950 border-pink-400'
                : 'bg-slate-900 border-amber-400'
            }`} />
          </div>
        )}

        {/* Drag Hint Indicator on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 bg-slate-900/90 text-amber-400 border border-slate-700 rounded-full text-[9px] font-fredoka flex items-center space-x-1 whitespace-nowrap shadow-md">
          <Move className="w-3 h-3" />
          <span>Angkat & Geser Aku!</span>
        </div>

        {/* 2D Interactive Robot Pet SVG Character with Dynamic Expressions */}
        <div
          onClick={handleMascotClick}
          className={`transition-transform duration-300 ${
            isDragging
              ? 'rotate-12 scale-110 drop-shadow-2xl'
              : isJumping
              ? '-translate-y-6 rotate-12 scale-110'
              : 'hover:scale-105 active:scale-95'
          } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
          title="Klik atau geser ClawBot!"
        >
          <svg width="85" height="95" viewBox="0 0 85 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            {/* Antenna Pole & Glowing Pulsing Bulb */}
            <line x1="42.5" y1="16" x2="42.5" y2="6" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle
              cx="42.5"
              cy="5"
              r="5"
              fill={mood === 'angry' ? '#ef4444' : mood === 'love' ? '#ec4899' : '#f59e0b'}
              className={mood === 'angry' ? 'animate-ping' : 'animate-pulse'}
            />
            <circle cx="42.5" cy="5" r="2.5" fill="#fef08a" />

            {/* Metallic Head Helmet */}
            <rect
              x="18"
              y="16"
              width="49"
              height="32"
              rx="14"
              fill={mood === 'angry' ? '#450a0a' : '#334155'}
              stroke={mood === 'angry' ? '#ef4444' : '#0f172a'}
              strokeWidth="3"
            />
            
            {/* Visor Screen */}
            <rect x="23" y="21" width="39" height="22" rx="8" fill="#0f172a" />

            {/* DYNAMIC FACIAL EXPRESSIONS */}

            {/* 1. ANGRY FACE */}
            {mood === 'angry' && (
              <g>
                {/* Angry Eyebrows */}
                <line x1="27" y1="25" x2="37" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                <line x1="57" y1="25" x2="47" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                {/* Red Glowing Eyes */}
                <circle cx="33" cy="32" r="3.5" fill="#ef4444" className="animate-ping" />
                <circle cx="33" cy="32" r="3" fill="#ef4444" />
                <circle cx="51" cy="32" r="3.5" fill="#ef4444" className="animate-ping" />
                <circle cx="51" cy="32" r="3" fill="#ef4444" />
                {/* Jagged Mouth */}
                <path d="M33 39 L37 36 L41 39 L45 36 L49 39" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 2. SURPRISED FACE */}
            {mood === 'surprised' && (
              <g>
                {/* Big Yellow Eyeballs */}
                <circle cx="33" cy="31" r="5.5" fill="#fde047" className="animate-ping" />
                <circle cx="33" cy="31" r="4.5" fill="#fde047" />
                <circle cx="51" cy="31" r="5.5" fill="#fde047" className="animate-ping" />
                <circle cx="51" cy="31" r="4.5" fill="#fde047" />
                {/* Open O Mouth */}
                <circle cx="42" cy="38" r="3.5" fill="none" stroke="#fde047" strokeWidth="2.5" />
              </g>
            )}

            {/* 3. LOVE / HEART FACE */}
            {mood === 'love' && (
              <g>
                {/* Heart Eyes */}
                <path d="M30 30 C30 27 34 27 34 30 C34 27 38 27 38 30 C38 33 34 36 34 36 C34 36 30 33 30 30 Z" fill="#ec4899" />
                <path d="M48 30 C48 27 52 27 52 30 C52 27 56 27 56 30 C56 33 52 36 52 36 C52 36 48 33 48 30 Z" fill="#ec4899" />
                {/* Pink Blush Cheeks */}
                <circle cx="27" cy="35" r="3" fill="#f472b6" opacity="0.6" />
                <circle cx="57" cy="35" r="3" fill="#f472b6" opacity="0.6" />
                {/* Cute W Mouth */}
                <path d="M36 37 Q 39 40 42 37 Q 46 40 48 37" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 4. SLEEPY FACE */}
            {mood === 'sleepy' && (
              <g>
                {/* Closed Zzz Eyes */}
                <line x1="28" y1="31" x2="36" y2="31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="48" y1="31" x2="56" y2="31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Sleepy Circle Mouth */}
                <circle cx="42" cy="37" r="2.5" fill="#94a3b8" />
              </g>
            )}

            {/* 5. DEFAULT HAPPY FACE */}
            {mood === 'happy' && (
              <g>
                {/* Glowing Cyan Eyes */}
                <circle cx="33" cy="32" r="4.5" fill="#00f0ff" className="animate-ping" />
                <circle cx="33" cy="32" r="4" fill="#00f0ff" />
                <circle cx="51" cy="32" r="4.5" fill="#00f0ff" className="animate-ping" />
                <circle cx="51" cy="32" r="4" fill="#00f0ff" />
                {/* Cute Smile Arc */}
                <path d="M36 37 Q 42 41 48 37" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Neck Joint */}
            <rect x="36" y="48" width="13" height="5" fill="#64748b" />

            {/* Arcade Body Core */}
            <rect
              x="15"
              y="53"
              width="55"
              height="28"
              rx="10"
              fill={mood === 'angry' ? '#dc2626' : '#f97316'}
              stroke="#0f172a"
              strokeWidth="3"
            />
            
            {/* Body Screen / Joypad */}
            <rect x="23" y="58" width="39" height="18" rx="6" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Colorful Arcade Buttons */}
            <circle cx="31" cy="67" r="4" fill="#ef4444" />
            <circle cx="42.5" cy="67" r="4" fill="#3b82f6" />
            <circle cx="54" cy="67" r="4" fill="#10b981" />

            {/* Animated Walking Feet / Legs */}
            <g className={isDragging ? 'animate-bounce' : 'animate-bounce'} style={{ animationDuration: mood === 'angry' ? '0.2s' : '0.4s' }}>
              <rect x="26" y="81" width="11" height="9" rx="4" fill="#1e293b" />
              <rect x="48" y="81" width="11" height="9" rx="4" fill="#1e293b" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
};
