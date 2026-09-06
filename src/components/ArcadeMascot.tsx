import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gamepad2, X, Move, Heart, RotateCw, CloudRain, AlertCircle, Moon, Flame } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

type MascotMood = 'happy' | 'angry' | 'dizzy' | 'sad' | 'surprised' | 'love' | 'sleepy';

export const ArcadeMascot: React.FC<ArcadeMascotProps> = ({ onScrollToArcade }) => {
  // Coordinates relative to profile card container
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 220, y: -25 });
  const [direction, setDirection] = useState<'right' | 'left'>('left');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  
  // Pause-on-click state (diem 4 detik saat diklik/dilepas)
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emotional Mood Engine (happy, angry, dizzy, sad, surprised, love, sleepy)
  const [mood, setMood] = useState<MascotMood>('happy');
  const [clickCount, setClickCount] = useState<number>(0);
  
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku Awans, tarik atau geser aku atau klik aku!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);

  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 220,
    initialPosY: -25,
  });

  const isPointerDownRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

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

  // Pause movement for 4 seconds (diem 4 detik)
  const triggerPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };

  // Active Walking & Wandering Movement Loop (Paused if isPaused)
  useEffect(() => {
    if (isDragging || isPaused || mood === 'sleepy') return;

    const walkSpeed = mood === 'angry' ? 1.3 : mood === 'dizzy' ? 0.3 : 0.45;
    const intervalTime = mood === 'angry' ? 45 : mood === 'dizzy' ? 120 : 90;

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
  }, [direction, isDragging, isPaused, mood]);

  // Periodic Random Speech Bubble
  useEffect(() => {
    if (isDragging || isPaused || mood === 'angry' || mood === 'dizzy' || mood === 'sad') return;

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
  }, [isDragging, isPaused, mood]);

  // Idle Timer -> Sleepy after 18 seconds of no interaction
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (!isDragging && !isPaused && mood === 'happy') {
        setMood('sleepy');
        setSpeechBubble('Zzz... Awans lagi istirahat sejenak...');
        setShowSpeech(true);
      }
    }, 18000);

    return () => clearTimeout(idleTimer);
  }, [mood, isDragging, isPaused]);

  // DRAG & DROP HANDLERS (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startPointer(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      startPointer(touch.clientX, touch.clientY);
    }
  };

  const startPointer = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: pos.x,
      initialPosY: pos.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isPointerDownRef.current) return;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 5 && !isDragging) {
        setIsDragging(true);
        hasMovedRef.current = true;
        soundFx.playGrabPulse();
        setMood('surprised'); // Kaget saat diangkat!
        setSpeechBubble('Waaaa! Aku terbang diangkat!');
        setShowSpeech(true);
      }

      if (isDragging) {
        setPos({
          x: dragRef.current.initialPosX + dx,
          y: dragRef.current.initialPosY + dy,
        });
      }
    };

    const handlePointerUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (hasMovedRef.current || isDragging) {
        setIsDragging(false);
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);

        triggerPause(); // Diem 4 detik setelah dilepas!

        setMood('love');
        setSpeechBubble('Hehe, terima kasih ya sudah memindahkan aku dengan lembut!');
        setShowSpeech(true);

        if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
        moodResetTimerRef.current = setTimeout(() => {
          setMood('happy');
        }, 3500);
      } else {
        // Single Click Event!
        triggerMascotClick();
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

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, pos]);

  // Click & Emotional Reaction Logic! (Ekspresi: Senang, Pusing, Sedih, Marah, Sayang, Kaget, Tidur)
  const triggerMascotClick = () => {
    soundFx.playGrabPulse();

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    // Diem dulu 4 detik saat diklik!
    triggerPause();

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 4000);

    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);

    // Cycle through rich emotional reactions based on click count & mood:
    if (mood === 'angry') {
      // Petting while angry -> calms down into love
      setMood('love');
      setSpeechBubble('Makasih ya sudah mengelus Awans, Awans gak marah lagi deh!');
      setShowSpeech(true);
      moodResetTimerRef.current = setTimeout(() => setMood('happy'), 4000);
    } else if (nextCount === 1) {
      // 1st click: Happy / Senang
      setMood('happy');
      const q = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
      setSpeechBubble(q);
      setShowSpeech(true);
    } else if (nextCount === 2) {
      // 2nd click: Dizzy / Pusing!
      setMood('dizzy');
      setSpeechBubble('Waduh! Awans pusing banget diklik terus-terusan nih!');
      setShowSpeech(true);
      moodResetTimerRef.current = setTimeout(() => setMood('happy'), 4000);
    } else if (nextCount === 3) {
      // 3rd click: Sad / Sedih...
      setMood('sad');
      setSpeechBubble('Huuu... Awans sedih, jangan dijailin terus dong...');
      setShowSpeech(true);
      moodResetTimerRef.current = setTimeout(() => setMood('happy'), 4500);
    } else if (nextCount >= 4) {
      // 4th+ click: Angry / Marah!
      setMood('angry');
      setSpeechBubble('Aduh! Awans MARAH NIH! Jangan diganggu terus dong!');
      setShowSpeech(true);

      moodResetTimerRef.current = setTimeout(() => {
        setMood('happy');
        setClickCount(0);
      }, 5000);
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
              : mood === 'dizzy'
              ? 'bg-amber-950/95 text-amber-100 border-amber-500'
              : mood === 'sad'
              ? 'bg-blue-950/95 text-blue-100 border-blue-400'
              : mood === 'love'
              ? 'bg-pink-950/95 text-pink-100 border-pink-400'
              : mood === 'surprised'
              ? 'bg-yellow-950/95 text-yellow-100 border-yellow-400'
              : mood === 'sleepy'
              ? 'bg-indigo-950/95 text-indigo-100 border-indigo-400'
              : 'bg-slate-900/95 text-slate-100 border-amber-400'
          }`}>
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider">
                {mood === 'angry' ? (
                  <Flame className="w-3 h-3 text-rose-400" />
                ) : mood === 'dizzy' ? (
                  <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
                ) : mood === 'sad' ? (
                  <CloudRain className="w-3 h-3 text-blue-400" />
                ) : mood === 'love' ? (
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                ) : mood === 'surprised' ? (
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                ) : mood === 'sleepy' ? (
                  <Moon className="w-3 h-3 text-indigo-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
                <span className={
                  mood === 'angry' ? 'text-rose-400' :
                  mood === 'dizzy' ? 'text-amber-300' :
                  mood === 'sad' ? 'text-blue-300' :
                  mood === 'love' ? 'text-pink-300' :
                  mood === 'surprised' ? 'text-yellow-300' :
                  mood === 'sleepy' ? 'text-indigo-300' :
                  'text-amber-400'
                }>
                  Awans {
                    mood === 'angry' ? '(Marah!)' :
                    mood === 'dizzy' ? '(Pusing!)' :
                    mood === 'sad' ? '(Sedih...)' :
                    mood === 'love' ? '(Sayang)' :
                    mood === 'surprised' ? '(Kaget!)' :
                    mood === 'sleepy' ? '(Tidur)' :
                    '(Senang)'
                  }
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
                : mood === 'dizzy'
                ? 'bg-amber-950 border-amber-500'
                : mood === 'sad'
                ? 'bg-blue-950 border-blue-400'
                : mood === 'love'
                ? 'bg-pink-950 border-pink-400'
                : mood === 'surprised'
                ? 'bg-yellow-950 border-yellow-400'
                : mood === 'sleepy'
                ? 'bg-indigo-950 border-indigo-400'
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
          className={`transition-transform duration-300 ${
            isDragging
              ? 'rotate-12 scale-110 drop-shadow-2xl'
              : isJumping
              ? '-translate-y-6 rotate-12 scale-110'
              : 'hover:scale-105 active:scale-95'
          } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
          title="Klik atau geser Awans!"
        >
          <svg width="85" height="95" viewBox="0 0 85 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            {/* Antenna Pole & Glowing Pulsing Bulb */}
            <line x1="42.5" y1="16" x2="42.5" y2="6" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle
              cx="42.5"
              cy="5"
              r="5"
              fill={mood === 'angry' ? '#ef4444' : mood === 'love' ? '#ec4899' : mood === 'dizzy' ? '#f59e0b' : mood === 'sad' ? '#3b82f6' : '#f59e0b'}
              className={mood === 'angry' ? 'animate-ping' : mood === 'dizzy' ? 'animate-spin' : 'animate-pulse'}
            />
            <circle cx="42.5" cy="5" r="2.5" fill="#fef08a" />

            {/* Metallic Head Helmet */}
            <rect
              x="18"
              y="16"
              width="49"
              height="32"
              rx="14"
              fill={mood === 'angry' ? '#450a0a' : mood === 'sad' ? '#1e3a8a' : mood === 'dizzy' ? '#451a03' : '#334155'}
              stroke={mood === 'angry' ? '#ef4444' : mood === 'sad' ? '#3b82f6' : mood === 'dizzy' ? '#f59e0b' : '#0f172a'}
              strokeWidth="3"
            />
            
            {/* Visor Screen */}
            <rect x="23" y="21" width="39" height="22" rx="8" fill="#0f172a" />

            {/* DYNAMIC FACIAL EXPRESSIONS (7 Expressions: Marah, Pusing, Sedih, Kaget, Sayang, Tidur, Senang) */}

            {/* 1. ANGRY FACE (Marah) */}
            {mood === 'angry' && (
              <g>
                {/* Anger Steam Cross Icon SVG above head */}
                <g className="animate-bounce">
                  <path d="M60 8 L68 8 M64 4 L64 12 M61 5 L67 11 M67 5 L61 11" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                </g>
                {/* Angry Eyebrows */}
                <line x1="26" y1="24" x2="38" y2="29" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                <line x1="58" y1="24" x2="46" y2="29" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                {/* Red Glowing Eyes */}
                <circle cx="33" cy="32" r="4" fill="#ef4444" className="animate-ping" />
                <circle cx="33" cy="32" r="3.5" fill="#ef4444" />
                <circle cx="51" cy="32" r="4" fill="#ef4444" className="animate-ping" />
                <circle cx="51" cy="32" r="3.5" fill="#ef4444" />
                {/* Sharp Pupils */}
                <line x1="33" y1="29" x2="33" y2="35" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="51" y1="29" x2="51" y2="35" stroke="#ffffff" strokeWidth="1.5" />
                {/* Jagged Teeth Mouth */}
                <path d="M31 39 L35 36 L39 39 L43 36 L47 39 L51 36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 2. DIZZY FACE (Pusing) */}
            {mood === 'dizzy' && (
              <g>
                {/* Orbiting Stars above antenna */}
                <g className="animate-spin" style={{ transformOrigin: '42.5px 5px', animationDuration: '2s' }}>
                  <polygon points="42.5,0 44,3 47,3.5 44.5,5.5 45,8.5 42.5,7 40,8.5 40.5,5.5 38,3.5 41,3" fill="#f59e0b" />
                  <polygon points="26,5 27,7 29,7 27.5,8 28,10 26,9 24,10 24.5,8 23,7 25,7" fill="#fde047" />
                  <polygon points="59,5 60,7 62,7 60.5,8 61,10 59,9 57,10 57.5,8 56,7 58,7" fill="#fde047" />
                </g>
                {/* Spiral Eyes (@ @) */}
                <path d="M30 32 A 3 3 0 1 1 34 34 A 1.5 1.5 0 1 1 32 32" stroke="#f59e0b" strokeWidth="2" fill="none" className="animate-spin" style={{ transformOrigin: '33px 32px' }} />
                <path d="M48 32 A 3 3 0 1 1 52 34 A 1.5 1.5 0 1 1 50 32" stroke="#f59e0b" strokeWidth="2" fill="none" className="animate-spin" style={{ transformOrigin: '51px 32px' }} />
                {/* Dizzy Wavy Mouth */}
                <path d="M33 39 Q 37 36 41 39 Q 45 42 49 39" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 3. SAD FACE (Sedih) */}
            {mood === 'sad' && (
              <g>
                {/* Drooping Sad Eyebrows */}
                <line x1="27" y1="26" x2="37" y2="23" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                <line x1="57" y1="26" x2="47" y2="23" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                {/* Sad Blue Eyes */}
                <circle cx="33" cy="32" r="4" fill="#3b82f6" />
                <circle cx="51" cy="32" r="4" fill="#3b82f6" />
                {/* Dropping Tear SVG */}
                <path d="M28 35 C28 35 26 39 28 41 C30 43 32 41 32 39 C32 37 28 35 28 35 Z" fill="#60a5fa" className="animate-bounce" style={{ animationDuration: '1s' }} />
                {/* Downward Sad Mouth Arc */}
                <path d="M34 40 Q 42 35 50 40" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 4. SURPRISED FACE (Kaget) */}
            {mood === 'surprised' && (
              <g>
                {/* High raised eyebrows */}
                <line x1="28" y1="23" x2="37" y2="23" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="47" y1="23" x2="56" y2="23" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                {/* Big Yellow Eyeballs */}
                <circle cx="33" cy="31" r="5.5" fill="#fde047" className="animate-ping" />
                <circle cx="33" cy="31" r="4.5" fill="#fde047" />
                <circle cx="51" cy="31" r="5.5" fill="#fde047" className="animate-ping" />
                <circle cx="51" cy="31" r="4.5" fill="#fde047" />
                {/* Black pupil centers */}
                <circle cx="33" cy="31" r="2" fill="#0f172a" />
                <circle cx="51" cy="31" r="2" fill="#0f172a" />
                {/* Open O Mouth */}
                <circle cx="42" cy="38" r="4" fill="#0f172a" stroke="#fde047" strokeWidth="2.5" />
                {/* Sweat drop on side */}
                <path d="M62 20 C62 20 59 24 61 26 C63 28 65 26 65 24 Z" fill="#38bdf8" />
              </g>
            )}

            {/* 5. LOVE FACE (Sayang) */}
            {mood === 'love' && (
              <g>
                {/* Heart Eyes */}
                <path d="M29 30 C29 27 33 27 33 30 C33 27 37 27 37 30 C37 33 33 36 33 36 C33 36 29 33 29 30 Z" fill="#ec4899" />
                <path d="M47 30 C47 27 51 27 51 30 C51 27 55 27 55 30 C55 33 51 36 51 36 C51 36 47 33 47 30 Z" fill="#ec4899" />
                {/* Pink Blush Cheeks */}
                <circle cx="26" cy="35" r="3.5" fill="#f472b6" opacity="0.7" />
                <circle cx="58" cy="35" r="3.5" fill="#f472b6" opacity="0.7" />
                {/* Cute W Mouth */}
                <path d="M35 37 Q 38 40 42 37 Q 45 40 48 37" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Floating heart SVG above head */}
                <path d="M40 2 C40 -1 42.5 -1 42.5 2 C42.5 -1 45 -1 45 2 C45 5 42.5 7 42.5 7 C42.5 7 40 5 40 2 Z" fill="#ec4899" className="animate-bounce" />
              </g>
            )}

            {/* 6. SLEEPY FACE (Tidur) */}
            {mood === 'sleepy' && (
              <g>
                {/* Closed Zzz Eyes */}
                <path d="M28 31 L32 34 L36 31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M48 31 L52 34 L56 31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Sleep Snot Bubble */}
                <circle cx="45" cy="38" r="3.5" fill="#93c5fd" opacity="0.6" className="animate-pulse" />
                {/* Floating Zzz */}
                <text x="60" y="15" fill="#94a3b8" fontSize="10" fontWeight="bold" className="animate-bounce">Z</text>
                <text x="67" y="10" fill="#94a3b8" fontSize="8" fontWeight="bold" className="animate-bounce">z</text>
              </g>
            )}

            {/* 7. DEFAULT HAPPY FACE (Senang) */}
            {mood === 'happy' && (
              <g>
                {/* Glowing Cyan Eyes */}
                <circle cx="33" cy="32" r="4.5" fill="#00f0ff" className="animate-ping" />
                <circle cx="33" cy="32" r="4" fill="#00f0ff" />
                <circle cx="51" cy="32" r="4.5" fill="#00f0ff" className="animate-ping" />
                <circle cx="51" cy="32" r="4" fill="#00f0ff" />
                <circle cx="34.5" cy="30.5" r="1.2" fill="#ffffff" />
                <circle cx="52.5" cy="30.5" r="1.2" fill="#ffffff" />
                {/* Cute Smile Arc */}
                <path d="M34 37 Q 42 43 50 37" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
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
              fill={mood === 'angry' ? '#dc2626' : mood === 'sad' ? '#1d4ed8' : mood === 'dizzy' ? '#d97706' : '#f97316'}
              stroke="#0f172a"
              strokeWidth="3"
            />
            
            {/* Body Screen / Joypad */}
            <rect x="23" y="58" width="39" height="18" rx="6" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Colorful Arcade Buttons */}
            <circle cx="31" cy="67" r="4" fill="#ef4444" />
            <circle cx="42.5" cy="67" r="4" fill="#3b82f6" />
            <circle cx="54" cy="67" r="4" fill="#10b981" />

            {/* Animated Walking Feet / Legs (Disable bounce when paused) */}
            <g className={isDragging || isPaused ? '' : 'animate-bounce'} style={{ animationDuration: mood === 'angry' ? '0.2s' : '0.4s' }}>
              <rect x="26" y="81" width="11" height="9" rx="4" fill="#1e293b" />
              <rect x="48" y="81" width="11" height="9" rx="4" fill="#1e293b" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
};
