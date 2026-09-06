import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, Heart, RotateCw, CloudRain, AlertCircle, Moon, Flame, Send, 
  MessageSquare, FileText, Home 
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

type MascotMood = 'happy' | 'angry' | 'dizzy' | 'sad' | 'surprised' | 'love' | 'sleepy' | 'charging';

export const ArcadeMascot: React.FC<ArcadeMascotProps> = () => {
  // Kiko the Digital Companion Fox Position
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 140) : 220,
    y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 160) : 400,
  }));
  const [direction, setDirection] = useState<'right' | 'left'>('left');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [battery, setBattery] = useState<number>(90);
  
  // Pause-on-click state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emotional Mood Engine
  const [mood, setMood] = useState<MascotMood>('happy');
  
  const [speechBubble, setSpeechBubble] = useState<string>('Yo! Gue Kiko, teman digital Kuat Riawan! Portfolio-nya mau dijelajahin bareng?');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);

  // Tail Click Easter Egg Counter
  const [tailClicks, setTailClicks] = useState<number>(0);

  // Cursor & Pupil Tracking
  const [eyeOffset, setEyeOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Section Tracking State
  const [currentSection, setCurrentSection] = useState<string>('hero');

  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 220,
    initialPosY: 400,
  });

  const isPointerDownRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  // Physics & Scroll Velocity
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const shakeCountRef = useRef<number>(0);
  const lastDirectionRef = useRef<'left' | 'right' | null>(null);

  const moodResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef<number>(0);

  // Kiko Personality Banter Quotes (Strictly Zero Emojis)
  const personalityQuotes = [
    'Lu ngapain dah? Tanya Kiko aja di tombol chat!',
    'Project NURAGA AI Platform K3 karya paling keren Kuat Riawan!',
    'Jangan cuma liat-liat, yuk kontak Kuat Riawan!',
    'Skill Kuat lengkap: React, TypeScript, Python, Node.js & BigQuery AI!',
    'CV Kuat Riawan ada di tombol atas, yuk download!',
    'Kiko bisa nemenin kamu jalan-jalan di semua section portofolio!',
    'Beasiswa Dicoding 2026 Distinction & S1 Sistem Informasi UT!'
  ];

  // First Entrance Animation & Greeting
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setSpeechBubble('Yo! Gue Kiko, teman digital Kuat Riawan!');
      setShowSpeech(true);
      setTimeout(() => {
        setSpeechBubble('Portfolio-nya mau dijelajahin bareng?');
      }, 3500);
    }, 1000);
    return () => clearTimeout(introTimer);
  }, []);

  // Battery Drain & Charging Loop
  useEffect(() => {
    const batInterval = setInterval(() => {
      setBattery((prev) => {
        if (isCharging) {
          const next = Math.min(100, prev + 5);
          if (next === 100 && mood === 'charging') {
            setMood('happy');
            setIsCharging(false);
            setSpeechBubble('Batrai Kiko sudah 100% penuh! Siap keliling lagi!');
            setShowSpeech(true);
          }
          return next;
        }
        const next = Math.max(5, prev - 1);
        if (next < 15 && mood === 'happy') {
          setSpeechBubble('Batrai Kiko sisa ' + next + '% nih! Klik KIKO HOME untuk ngecas!');
          setShowSpeech(true);
        }
        return next;
      });
    }, 12000);
    return () => clearInterval(batInterval);
  }, [isCharging, mood]);

  // Cursor Tracking Loop (Kiko nengok kursor & flee if fast)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mascotCenterX = pos.x + 45;
      const mascotCenterY = pos.y + 50;
      const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
      const dist = Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY);

      if (dist < 350) {
        const offsetDist = Math.min(dist / 60, 4);
        setEyeOffset({
          dx: Math.cos(angle) * offsetDist,
          dy: Math.sin(angle) * offsetDist,
        });
      } else {
        setEyeOffset({ dx: 0, dy: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pos]);

  // Scroll Velocity & Section Detection Loop
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;

      if (diff > 35 && !isRunning && !isDragging) {
        setIsRunning(true);
        setSpeechBubble('Buset, santai dikit! Kiko lari!');
        setShowSpeech(true);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (isRunning) {
          setIsRunning(false);
          setSpeechBubble('Buset, santai dikit.');
          setShowSpeech(true);
        }
      }, 400);

      // Section Awareness Check
      const sections = ['hero', 'experience', 'education', 'skills', 'certificates', 'projects', 'contact'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
            if (currentSection !== sec) {
              setCurrentSection(sec);
              triggerSectionComment(sec);
            }
            break;
          }
        }
      }

      // Footer Check
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        if (currentSection !== 'footer') {
          setCurrentSection('footer');
          setMood('love');
          setSpeechBubble('Sudah di paling bawah nih! Yuk kontak Kuat Riawan!');
          setShowSpeech(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isRunning, isDragging, currentSection]);

  const triggerSectionComment = (section: string) => {
    triggerPause();
    if (section === 'hero') {
      setMood('happy');
      setSpeechBubble('Ini orangnya btw. Gue bisa ceritain tentang Kuat kalau mau.');
    } else if (section === 'experience') {
      setMood('happy');
      setSpeechBubble('Yang ini pengalaman kerjanya di PT Upaya Riksa Patra!');
    } else if (section === 'education') {
      setMood('sleepy');
      setSpeechBubble('Kuat kuliah S1 Sistem Informasi & Beasiswa Dicoding 2026 Distinction!');
    } else if (section === 'skills') {
      setMood('love');
      setSpeechBubble('Yang ini sering dipake: React, TypeScript, Python & BigQuery!');
    } else if (section === 'certificates') {
      setMood('surprised');
      setSpeechBubble('Bukti bukan bacot. Sertifikat Beasiswa Dicoding 2026 Distinction Kuat 100% Valid!');
    } else if (section === 'projects') {
      setMood('happy');
      setSpeechBubble('Lumayan nih project-nya! NURAGA AI Platform K3 karya favorit Kuat!');
    } else if (section === 'contact') {
      setMood('love');
      setSpeechBubble('Yuk kirim pesan atau email ke Kuat Riawan!');
    }
    setShowSpeech(true);
  };

  // AI Query Processor
  const processQuery = (queryText: string) => {
    soundFx.playGrabPulse();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
    triggerPause();

    const msg = queryText.toLowerCase().trim();
    setChatInput('');
    setIsChatOpen(false);

    let reply = '';
    if (msg.includes('proyek') || msg.includes('project') || msg.includes('karya') || msg.includes('nuraga')) {
      setMood('happy');
      reply = 'Project utama Kuat Riawan adalah NURAGA AI Platform K3 dengan WA Gateway & Analytics!';
    } else if (msg.includes('skill') || msg.includes('kemampuan') || msg.includes('bisa') || msg.includes('bahasa')) {
      setMood('love');
      reply = 'Kuat Riawan menguasai React, Node.js, TypeScript, Python, BigQuery & Otomasi AI!';
    } else if (msg.includes('kontak') || msg.includes('email') || msg.includes('wa') || msg.includes('hubungi')) {
      setMood('happy');
      reply = 'Kontak Kuat Riawan: kuatriawan69@gmail.com | WA: +62 821-2428-9987!';
    } else if (msg.includes('dicoding') || msg.includes('kuliah') || msg.includes('pendidikan') || msg.includes('ut')) {
      setMood('happy');
      reply = 'Kuat Riawan lulus Beasiswa Dicoding 2026 Distinction & S1 Sistem Informasi Terbuka!';
    } else if (msg.includes('siapa') || msg.includes('nama') || msg.includes('kiko') || msg.includes('kenalin')) {
      setMood('love');
      reply = 'Gue Kiko, rubah digital pendamping portofolio Kuat Riawan! Salam kenal ya!';
    } else if (msg.includes('cv') || msg.includes('resume') || msg.includes('download')) {
      setMood('happy');
      reply = 'CV Kuat Riawan bisa langsung diunduh dari tombol Resume / CV di navbar!';
    } else if (msg.includes('marah') || msg.includes('kesel') || msg.includes('jahat')) {
      setMood('sad');
      reply = 'Jangan galak-galak dong, Kiko kan baik hati...';
    } else if (msg.includes('lucu') || msg.includes('keren') || msg.includes('hebat') || msg.includes('suka')) {
      setMood('love');
      reply = 'Makasih banyak ya! Kiko makin betah sama kamu!';
    } else {
      setMood('happy');
      reply = `Kiko paham! "${msg}" -> Kuat Riawan siap diajak berkembang & kerja sebagai Web Dev!`;
    }

    setSpeechBubble(reply);
    setShowSpeech(true);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!chatInput.trim()) return;
    processQuery(chatInput);
  };

  const triggerPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // Active Walking & Wandering Loop
  useEffect(() => {
    if (isDragging || isPaused || isCharging || mood === 'sleepy') return;

    const walkSpeed = isRunning ? 2.5 : mood === 'angry' ? 1.4 : mood === 'dizzy' ? 0.3 : 0.45;
    const intervalTime = isRunning ? 25 : mood === 'angry' ? 40 : mood === 'dizzy' ? 120 : 90;

    const interval = setInterval(() => {
      setPos((prevPos) => {
        let newX = prevPos.x;
        const maxWalkX = Math.max(50, (typeof window !== 'undefined' ? window.innerWidth : 400) - 110);

        if (direction === 'left') {
          newX -= walkSpeed * 3;
          if (newX <= 15) {
            newX = 15;
            setDirection('right');
          }
        } else {
          newX += walkSpeed * 3;
          if (newX >= maxWalkX) {
            newX = maxWalkX;
            setDirection('left');
          }
        }

        return { x: newX, y: prevPos.y };
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [direction, isDragging, isPaused, isCharging, mood, isRunning]);

  // Periodic Random Banter
  useEffect(() => {
    if (isDragging || isPaused || isCharging || mood === 'angry' || mood === 'dizzy' || mood === 'sad') return;

    const speechTimer = setInterval(() => {
      if (mood === 'happy') {
        const q = personalityQuotes[Math.floor(Math.random() * personalityQuotes.length)];
        setSpeechBubble(q);
        setShowSpeech(true);

        setTimeout(() => {
          setShowSpeech(false);
        }, 4500);
      }
    }, 12000);

    return () => clearInterval(speechTimer);
  }, [isDragging, isPaused, isCharging, mood]);

  // Long Idle Check (Lu ngapain dah?)
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (!isDragging && !isPaused && !isCharging && mood === 'happy') {
        setMood('sleepy');
        setSpeechBubble('Lu ngapain dah? Kiko tidur dulu ya...');
        setShowSpeech(true);
      }
    }, 18000);

    return () => clearTimeout(idleTimer);
  }, [mood, isDragging, isPaused, isCharging]);

  // Drag & Pointer Handlers
  const startPointer = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    shakeCountRef.current = 0;
    lastDirectionRef.current = null;
    velocityRef.current = { vx: 0, vy: 0 };
    lastPointerRef.current = { x: clientX, y: clientY, time: Date.now() };

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
      const now = Date.now();
      const dt = Math.max(now - lastPointerRef.current.time, 10);

      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 5 && !isDragging) {
        setIsDragging(true);
        hasMovedRef.current = true;
        soundFx.playGrabPulse();
        setMood('surprised');
        setSpeechBubble('Waaaa! Kiko terbang diangkat!');
        setShowSpeech(true);
      }

      if (isDragging) {
        const moveDx = clientX - lastPointerRef.current.x;
        const moveDy = clientY - lastPointerRef.current.y;
        velocityRef.current = { vx: moveDx / dt, vy: moveDy / dt };

        if (Math.abs(moveDx) > 8) {
          const currentDir = moveDx > 0 ? 'right' : 'left';
          if (lastDirectionRef.current && lastDirectionRef.current !== currentDir) {
            shakeCountRef.current += 1;
            if (shakeCountRef.current >= 3) {
              setMood('dizzy');
              setSpeechBubble('Waduh... Kiko dikocok-kocok pusing banget!');
              setShowSpeech(true);
            }
          }
          lastDirectionRef.current = currentDir;
        }

        const clampedX = Math.max(10, Math.min((window.innerWidth || 400) - 95, dragRef.current.initialPosX + dx));
        const clampedY = Math.max(10, Math.min((window.innerHeight || 600) - 105, dragRef.current.initialPosY + dy));
        setPos({ x: clampedX, y: clampedY });
      }

      lastPointerRef.current = { x: clientX, y: clientY, time: now };
    };

    const handlePointerUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (hasMovedRef.current || isDragging) {
        setIsDragging(false);
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);

        triggerPause();

        const throwSpeed = Math.hypot(velocityRef.current.vx, velocityRef.current.vy);
        const wasShaken = shakeCountRef.current >= 3;

        shakeCountRef.current = 0;
        lastDirectionRef.current = null;

        if (wasShaken) {
          setMood('dizzy');
          setSpeechBubble('Aduh... Kiko pusing akibat dikocok-kocok!');
          setShowSpeech(true);
        } else if (throwSpeed > 0.6) {
          setMood('angry');
          setSpeechBubble('WOI! Jangan dilempar-lempar dong!');
          setShowSpeech(true);
        } else {
          setMood('love');
          setSpeechBubble('Hehe, terima kasih sudah mindahin Kiko dengan lembut!');
          setShowSpeech(true);
        }

        if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
        moodResetTimerRef.current = setTimeout(() => {
          setMood('happy');
        }, 3500);
      } else {
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

  // Single Click Event
  const triggerMascotClick = () => {
    soundFx.playGrabPulse();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
    triggerPause();

    if (!isChatOpen) {
      setSpeechBubble('Ngobrol sama gue?');
      setShowSpeech(true);
    }
  };

  // Double Click Event (WOI!)
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playGrabPulse();
    setIsJumping(true);
    setMood('angry');
    setSpeechBubble('WOI!');
    setShowSpeech(true);
    triggerPause();
  };

  // Right Click Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContextMenuOpen(true);
  };

  // Tail Click Easter Egg (5x click -> WOI JANGAN PEGANG EKOR GUE!)
  const handleTailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextClicks = tailClicks + 1;
    setTailClicks(nextClicks);

    if (nextClicks >= 5) {
      soundFx.playGrabPulse();
      setTailClicks(0);
      setMood('angry');
      setIsRunning(true);
      setSpeechBubble('WOI JANGAN PEGANG EKOR GUE!');
      setShowSpeech(true);
      triggerPause();
      setTimeout(() => setIsRunning(false), 2000);
    }
  };

  // Fly / Walk Home to KIKO HOME
  const triggerKikoHome = () => {
    setIsCharging(true);
    setMood('charging');
    setIsContextMenuOpen(false);
    setPos({
      x: Math.max(10, (window.innerWidth || 400) - 140),
      y: Math.max(10, (window.innerHeight || 600) - 150),
    });
    setSpeechBubble('Zzz... Kiko istirahat dulu di KIKO HOME...');
    setShowSpeech(true);
  };

  return (
    <>
      {/* Floating KIKO HOME Charging Station Dock (Bottom Right) */}
      <div 
        onClick={triggerKikoHome}
        className="fixed bottom-4 right-4 z-[9990] bg-slate-950/90 border-2 border-orange-500/80 hover:border-orange-400 p-2 rounded-2xl shadow-2xl backdrop-blur-md cursor-pointer flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 text-xs text-orange-300 font-fredoka group"
        title="Klik untuk membawa Kiko pulang ke KIKO HOME"
      >
        <div className="relative p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-sm">
          <Home className={`w-4 h-4 ${isCharging ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
          {isCharging && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping border border-white" />}
        </div>
        <div className="flex flex-col text-[10px] font-mono leading-tight pr-1">
          <span className="font-bold uppercase tracking-wider text-orange-200">KIKO HOME</span>
          <span className="text-slate-400">Energi: {battery}%</span>
        </div>
      </div>

      {/* Right Click Context Menu Overlay */}
      {isContextMenuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[10000] bg-slate-950/95 border-2 border-orange-500/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl text-xs font-fredoka text-slate-100 flex flex-col gap-1.5 w-52 animate-fade-in"
          style={{
            left: Math.min(pos.x + 20, (window.innerWidth || 400) - 220),
            top: Math.min(pos.y + 20, (window.innerHeight || 600) - 220),
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" /> Menu Kiko
            </span>
            <button onClick={() => setIsContextMenuOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => {
              setIsContextMenuOpen(false);
              setIsChatOpen(true);
              triggerPause();
            }}
            className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left rounded-lg text-[11px] text-amber-300 flex items-center gap-2 font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Ngobrol sama Kiko
          </button>
          <button
            onClick={triggerKikoHome}
            className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left rounded-lg text-[11px] text-orange-300 flex items-center gap-2 font-bold"
          >
            <Home className="w-3.5 h-3.5 text-orange-400" /> Pulang ke KIKO HOME
          </button>
          <button
            onClick={() => {
              setIsContextMenuOpen(false);
              setMood('sleepy');
              setSpeechBubble('Zzz... Kiko tidur dulu ya...');
              setShowSpeech(true);
            }}
            className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left rounded-lg text-[11px] text-indigo-300 flex items-center gap-2 font-bold"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" /> Istirahat / Tidur
          </button>
          <a
            href="https://linkedin.com/in/kuatriawan"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsContextMenuOpen(false)}
            className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left rounded-lg text-[11px] text-blue-300 flex items-center gap-2 font-bold"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Lihat CV Kuat Riawan
          </a>
        </div>
      )}

      {/* Main Kiko Fox Mascot Wrapper */}
      <div
        className={`fixed transition-all ${
          isDragging ? 'duration-0 z-[9999] scale-110 cursor-grabbing' : 'duration-700 ease-in-out z-[9999] cursor-grab'
        } select-none pointer-events-auto`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          top: 0,
          left: 0,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          startPointer(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) startPointer(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group flex flex-col items-center">
          
          {/* Speech Bubble */}
          {showSpeech && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className={`absolute ${
                pos.y < 170 ? 'top-26' : '-top-44'
              } -left-14 w-64 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs font-fredoka z-[9999] pointer-events-auto border-2 ${
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
                : mood === 'charging'
                ? 'bg-orange-950/95 text-orange-100 border-orange-400'
                : 'bg-slate-900/95 text-slate-100 border-orange-400'
            }`}>
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider">
                  {mood === 'angry' ? (
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                  ) : mood === 'dizzy' ? (
                    <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : mood === 'sad' ? (
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  ) : mood === 'love' ? (
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  ) : mood === 'surprised' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                  ) : mood === 'sleepy' ? (
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  ) : mood === 'charging' ? (
                    <Home className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  )}
                  <span className={
                    mood === 'angry' ? 'text-rose-400' :
                    mood === 'dizzy' ? 'text-amber-300' :
                    mood === 'sad' ? 'text-blue-300' :
                    mood === 'love' ? 'text-pink-300' :
                    mood === 'surprised' ? 'text-yellow-300' :
                    mood === 'sleepy' ? 'text-indigo-300' :
                    mood === 'charging' ? 'text-orange-300' :
                    'text-orange-400'
                  }>
                    Kiko Fox AI
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeech(false);
                  }}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <p className="leading-snug text-[11px] mb-2">{speechBubble}</p>

              {/* Interactive AI Chat Trigger or Input Column */}
              {!isChatOpen ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(true);
                    triggerPause();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-3 bg-orange-500/20 hover:bg-orange-500/35 border border-orange-400/50 hover:border-orange-400 text-orange-300 hover:text-orange-200 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                  <span>Tekan untuk mengobrol</span>
                </button>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <form onSubmit={handleChatSubmit} className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Tanya Kiko..."
                      className="w-full px-2.5 py-1 bg-slate-950/90 border border-orange-400/60 focus:border-orange-400 text-slate-100 placeholder-slate-400 text-[10px] rounded-lg outline-none font-sans"
                    />
                    <button
                      type="submit"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="p-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white rounded-lg transition-all font-bold flex items-center justify-center shrink-0 active:scale-95 border border-orange-300 shadow-xs cursor-pointer"
                      title="Kirim pesan ke Kiko"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChatOpen(false);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-white rounded-lg transition-all"
                      title="Batal"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </form>

                  {/* Quick Action Choices */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Siapa Kuat Riawan?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Siapa Kuat?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Project-nya apa?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Project-nya apa?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Skill-nya apa?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Skill-nya apa?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Pengalamannya?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Pengalamannya?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Pendidikan?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Pendidikan?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Download CV');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Download CV
                    </button>
                  </div>
                </div>
              )}

              {/* Speech Pointer Arrow */}
              <div className={`absolute ${
                pos.y < 170 ? '-top-2 left-20 border-t-2 border-l-2' : '-bottom-2 left-20 border-b-2 border-r-2'
              } w-3.5 h-3.5 rotate-45 ${
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
                  : mood === 'charging'
                  ? 'bg-orange-950 border-orange-400'
                  : 'bg-slate-900 border-orange-400'
              }`} />
            </div>
          )}

          {/* 3D DIGITAL COMPANION FOX SVG AVATAR (KIKO) */}
          <div
            className={`transition-transform duration-300 ${
              isDragging
                ? 'rotate-12 scale-110 drop-shadow-2xl'
                : isJumping
                ? '-translate-y-6 rotate-12 scale-110'
                : isRunning
                ? 'scale-110 -translate-y-2'
                : isHovered
                ? 'scale-110'
                : 'hover:scale-105 active:scale-95'
            } ${direction === 'left' ? '-scale-x-100' : 'scale-x-100'}`}
            title="Klik atau geser Kiko!"
          >
            <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              <defs>
                {/* Warm 3D Orange Fur Radial Gradient */}
                <radialGradient id="foxHeadFur" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="60%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </radialGradient>

                {/* Real Pixar-style Warm Amber Animal Eye Iris */}
                <radialGradient id="foxAmberEye" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="80%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#451a03" />
                </radialGradient>

                {/* Soft Fluffy White Fur Gradient */}
                <linearGradient id="whiteFurGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#ffedd5" />
                </linearGradient>
              </defs>

              {/* FLUFFY FOX TAIL (Clickable Easter Egg!) */}
              <g onClick={handleTailClick} className="cursor-pointer group/tail">
                <path
                  d="M60 52 C76 42 90 48 86 68 C83 83 68 86 54 76 C47 70 52 58 60 52 Z"
                  fill="url(#foxHeadFur)"
                  className={mood === 'love' || isHovered ? 'animate-bounce' : ''}
                />
                {/* Dark Navy Tail Accent */}
                <path d="M72 49 C78 47 84 53 82 63 C80 69 75 72 70 67 Z" fill="#0f172a" />
                {/* Fluffy White Tail Tip */}
                <path d="M78 59 C85 62 82 72 75 74 C72 71 74 65 78 59 Z" fill="url(#whiteFurGrad)" />
              </g>

              {/* FOX POINTY EARS */}
              {/* Left Ear */}
              <path d="M22 28 C 14 18 10 2 24 6 C 28 12 30 20 32 26 Z" fill="url(#foxHeadFur)" stroke="#0f172a" strokeWidth="2.5" />
              <path d="M20 25 C 15 17 12 7 21 9 C 24 13 25 19 27 23 Z" fill="#0f172a" />
              <path d="M22 23 C 18 17 16 10 21 11 C 23 14 24 18 25 21 Z" fill="#fdba74" />

              {/* Right Ear */}
              <path d="M68 28 C 76 18 80 2 66 6 C 62 12 60 20 58 26 Z" fill="url(#foxHeadFur)" stroke="#0f172a" strokeWidth="2.5" />
              <path d="M70 25 C 75 17 78 7 69 9 C 66 13 65 19 63 23 Z" fill="#0f172a" />
              <path d="M68 23 C 72 17 74 10 69 11 C 67 14 66 18 65 21 Z" fill="#fdba74" />

              {/* WARM ORANGE 3D ANIMAL FOX HEAD */}
              <circle cx="45" cy="32" r="22" fill="url(#foxHeadFur)" stroke="#0f172a" strokeWidth="3" />
              
              {/* FLUFFY WHITE CHEEKS & MUZZLE */}
              <path d="M23 32 Q 20 46 45 47 Q 70 46 67 32 Q 68 47 45 48 Q 22 47 23 32 Z" fill="url(#whiteFurGrad)" />
              <ellipse cx="45" cy="38" rx="12" ry="7" fill="url(#whiteFurGrad)" />
              
              {/* CUTE ANIMAL NOSE */}
              <ellipse cx="45" cy="35.5" rx="3.5" ry="2.5" fill="#0f172a" />
              <ellipse cx="44" cy="34.8" rx="1.2" ry="0.7" fill="#ffffff" opacity="0.6" />

              {/* REAL ANIMAL AMBER EYES & FACIAL EXPRESSIONS */}

              {/* CHARGING MODE */}
              {mood === 'charging' && (
                <g>
                  <path d="M30 28 Q 34 32 38 28" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M52 28 Q 56 32 60 28" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M41 40 Q 45 43 49 40" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* ANGRY FACE */}
              {mood === 'angry' && (
                <g>
                  <line x1="26" y1="20" x2="38" y2="25" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <line x1="64" y1="20" x2="52" y2="25" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="34" cy="28" r="4.5" fill="#dc2626" />
                  <circle cx="56" cy="28" r="4.5" fill="#dc2626" />
                  <circle cx="34" cy="28" r="2" fill="#0f172a" />
                  <circle cx="56" cy="28" r="2" fill="#0f172a" />
                  <path d="M38 41 L42 37 L46 41 L50 37 L54 41" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* DIZZY FACE */}
              {mood === 'dizzy' && (
                <g>
                  <g className="animate-spin" style={{ transformOrigin: '45px 5px', animationDuration: '2s' }}>
                    <polygon points="45,0 46.5,3 49.5,3.5 47,5.5 47.5,8.5 45,7 42.5,8.5 43,5.5 40.5,3.5 43.5,3" fill="#f59e0b" />
                  </g>
                  <path d="M30 28 A 3 3 0 1 1 34 30 A 1.5 1.5 0 1 1 32 28" stroke="#d97706" strokeWidth="2.5" fill="none" className="animate-spin" style={{ transformOrigin: '32px 28px' }} />
                  <path d="M54 28 A 3 3 0 1 1 58 30 A 1.5 1.5 0 1 1 56 28" stroke="#d97706" strokeWidth="2.5" fill="none" className="animate-spin" style={{ transformOrigin: '56px 28px' }} />
                  <path d="M38 40 Q 45 36 52 40" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SAD FACE */}
              {mood === 'sad' && (
                <g>
                  <line x1="26" y1="22" x2="38" y2="19" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <line x1="64" y1="22" x2="52" y2="19" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="34" cy="28" r="4.5" fill="url(#foxAmberEye)" />
                  <circle cx="56" cy="28" r="4.5" fill="url(#foxAmberEye)" />
                  <path d="M38 42 Q 45 37 52 42" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SURPRISED FACE */}
              {mood === 'surprised' && (
                <g>
                  <circle cx="34" cy="27" r="5.5" fill="url(#foxAmberEye)" />
                  <circle cx="56" cy="27" r="5.5" fill="url(#foxAmberEye)" />
                  <circle cx="34" cy="27" r="2.5" fill="#0f172a" />
                  <circle cx="56" cy="27" r="2.5" fill="#0f172a" />
                  <circle cx="45" cy="39" r="3.5" fill="#0f172a" />
                </g>
              )}

              {/* LOVE FACE */}
              {mood === 'love' && (
                <g>
                  <path d="M30 26 C30 23 34 23 34 26 C34 23 38 23 38 26 C38 29 34 32 34 32 C34 32 30 29 30 26 Z" fill="#ec4899" />
                  <path d="M52 26 C52 23 56 23 56 26 C56 23 60 23 60 26 C60 29 56 32 56 32 C56 32 52 29 52 26 Z" fill="#ec4899" />
                  <circle cx="25" cy="33" r="3.5" fill="#f472b6" opacity="0.7" />
                  <circle cx="65" cy="33" r="3.5" fill="#f472b6" opacity="0.7" />
                  <path d="M38 38 Q 41 41 45 38 Q 48 41 52 38" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SLEEPY FACE */}
              {mood === 'sleepy' && (
                <g>
                  <path d="M29 28 L34 31 L39 28" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M51 28 L56 31 L61 28" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="48" cy="38" r="3.5" fill="#93c5fd" opacity="0.6" className="animate-pulse" />
                  <text x="66" y="14" fill="#94a3b8" fontSize="10" fontWeight="bold" className="animate-bounce">Z</text>
                  <text x="73" y="9" fill="#94a3b8" fontSize="8" fontWeight="bold" className="animate-bounce">z</text>
                </g>
              )}

              {/* DEFAULT HAPPY FACE WITH WARM AMBER ANIMAL EYES & CURSOR TRACKING */}
              {mood === 'happy' && (
                <g>
                  <circle cx="34" cy="28" r="5.5" fill="url(#foxAmberEye)" />
                  <circle cx="56" cy="28" r="5.5" fill="url(#foxAmberEye)" />
                  {/* Pupils tracking cursor */}
                  <circle cx={34 + eyeOffset.dx} cy={28 + eyeOffset.dy} r="2.5" fill="#0f172a" />
                  <circle cx={56 + eyeOffset.dx} cy={28 + eyeOffset.dy} r="2.5" fill="#0f172a" />
                  {/* Double Catchlight Reflections */}
                  <circle cx={35.5 + eyeOffset.dx} cy={26.5 + eyeOffset.dy} r="1.2" fill="#ffffff" />
                  <circle cx={57.5 + eyeOffset.dx} cy={26.5 + eyeOffset.dy} r="1.2" fill="#ffffff" />
                  <circle cx={33 + eyeOffset.dx} cy={29.5 + eyeOffset.dy} r="0.6" fill="#ffffff" opacity="0.7" />
                  <circle cx={55 + eyeOffset.dx} cy={29.5 + eyeOffset.dy} r="0.6" fill="#ffffff" opacity="0.7" />
                  {/* Pink Cheek Blush */}
                  <circle cx="24" cy="33" r="3" fill="#f472b6" opacity="0.5" />
                  <circle cx="66" cy="33" r="3" fill="#f472b6" opacity="0.5" />
                  {/* Cute Smile Arc */}
                  <path d="M37 38 Q 45 44 53 38" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SOFT CHEST FUR TUFT */}
              <path d="M42 46 L45 52 L48 46 L51 50 L45 44 L39 50 Z" fill="url(#whiteFurGrad)" />

              {/* SOFT PEAR-SHAPED ORGANIC ANIMAL BODY */}
              <path
                d="M25 50 Q 18 78 45 78 Q 72 78 65 50 Q 45 54 25 50 Z"
                fill={mood === 'angry' ? '#dc2626' : mood === 'sad' ? '#1d4ed8' : mood === 'dizzy' ? '#d97706' : 'url(#foxHeadFur)'}
                stroke="#0f172a"
                strokeWidth="3"
              />
              
              {/* FLUFFY WHITE CHEST / BELLY */}
              <ellipse cx="45" cy="65" rx="13" ry="10" fill="url(#whiteFurGrad)" />

              {/* SOFT DARK NAVY ANIMAL PAWS */}
              <ellipse cx="36" cy="67" rx="3.5" ry="3" fill="#0f172a" />
              <ellipse cx="54" cy="67" rx="3.5" ry="3" fill="#0f172a" />

              {/* ANIMATED ROUND ANIMAL FEET */}
              <g className={isDragging || isPaused ? '' : 'animate-bounce'} style={{ animationDuration: isRunning ? '0.15s' : mood === 'angry' ? '0.2s' : '0.4s' }}>
                <ellipse cx="34" cy="85" rx="5.5" ry="4" fill="#0f172a" />
                <ellipse cx="56" cy="85" rx="5.5" ry="4" fill="#0f172a" />
              </g>
            </svg>
          </div>

        </div>
      </div>
    </>
  );
};
