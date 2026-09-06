import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, Heart, RotateCw, CloudRain, AlertCircle, Moon, Flame, Send, 
  MessageSquare, Zap, FileText 
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

type MascotMood = 'happy' | 'angry' | 'dizzy' | 'sad' | 'surprised' | 'love' | 'sleepy' | 'charging';

export const ArcadeMascot: React.FC<ArcadeMascotProps> = () => {
  // Global viewport coordinates
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 130) : 220,
    y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 150) : 400,
  }));
  const [direction, setDirection] = useState<'right' | 'left'>('left');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [battery, setBattery] = useState<number>(85);
  
  // Pause-on-click state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emotional Mood Engine
  const [mood, setMood] = useState<MascotMood>('happy');
  
  const [speechBubble, setSpeechBubble] = useState<string>('Halo! Aku Awans, maskot AI Kuat Riawan! Geser atau klik aku ya!');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);

  // Antenna Click Easter Egg Counter
  const [antennaClicks, setAntennaClicks] = useState<number>(0);

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

  const moodList: MascotMood[] = ['happy', 'dizzy', 'sad', 'angry', 'surprised', 'love', 'sleepy'];

  const moodQuotes: Record<MascotMood, string> = {
    happy: 'Halo! Awans lagi senang hari ini!',
    dizzy: 'Waduh! Awans pusing banget tujuh keliling dikocok-kocok!',
    sad: 'Huuu... Awans sedih banget, jangan dijailin terus dong...',
    angry: 'Aduh! Awans MARAH NIH karena dilempar-lempar!',
    surprised: 'WAAA! Awans kaget banget!',
    love: 'Hehe, Awans sayang banget sama kamu!',
    sleepy: 'Zzz... Awans lagi ngantuk mau tidur...',
    charging: 'Bzzzt! Awans lagi ngecas batrai di Charging Station...',
  };

  // Random Banter Quotes (Strictly Zero Emojis)
  const personalityQuotes = [
    'Lu nyari apa dah? Tanya Awans di tombol chat!',
    'Proyek NURAGA AI Platform K3 karya favorit Kuat Riawan!',
    'Jangan cuma liat-liat, yuk ajak Kuat Riawan kerja sama!',
    'Skill Kuat lengkap: React, TypeScript, Python, Node.js & BigQuery AI!',
    'CV Kuat Riawan ada di tombol atas, yuk download!',
    'Kamu bisa angkat dan geser aku ke mana saja di layar!',
    'Beasiswa Dicoding 2026 Distinction & S1 Sistem Informasi UT!'
  ];

  // Battery drain loop
  useEffect(() => {
    const batInterval = setInterval(() => {
      setBattery((prev) => {
        if (isCharging) {
          const next = Math.min(100, prev + 5);
          if (next === 100 && mood === 'charging') {
            setMood('happy');
            setIsCharging(false);
            setSpeechBubble('Batrai Awans sudah 100% penuh! Siap jalan-jalan lagi!');
            setShowSpeech(true);
          }
          return next;
        }
        const next = Math.max(5, prev - 1);
        if (next < 15 && mood === 'happy') {
          setSpeechBubble('Batrai Awans sisa ' + next + '% nih! Klik kanan untuk ngecas!');
          setShowSpeech(true);
        }
        return next;
      });
    }, 12000);
    return () => clearInterval(batInterval);
  }, [isCharging, mood]);

  // Cursor Tracking Loop (Nengok Cursor)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mascotCenterX = pos.x + 42.5;
      const mascotCenterY = pos.y + 45;
      const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
      const dist = Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY);

      if (dist < 350) {
        const offsetDist = Math.min(dist / 60, 3.5);
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
        setSpeechBubble('Wah! User scroll cepet banget! Awans lari!');
        setShowSpeech(true);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsRunning(false);
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
      setSpeechBubble('Awans lagi liat Kartu Profil Kuat Riawan! Full-Stack Web Dev!');
    } else if (section === 'experience') {
      setMood('happy');
      setSpeechBubble('Di PT Upaya Riksa Patra, Kuat bikin WA Gateway K3 3.000+ peserta!');
    } else if (section === 'education') {
      setMood('sleepy');
      setSpeechBubble('Lagi liat pendidikan Kuat: S1 Sistem Informasi & Beasiswa Dicoding 2026!');
    } else if (section === 'skills') {
      setMood('love');
      setSpeechBubble('Kuat jago React, TypeScript, Python, Node.js & BigQuery AI!');
    } else if (section === 'certificates') {
      setMood('surprised');
      setSpeechBubble('Sertifikat Beasiswa Dicoding 2026 Distinction Kuat 100% Valid!');
    } else if (section === 'projects') {
      setMood('happy');
      setSpeechBubble('Proyek NURAGA AI Platform K3 ini karya favorit Kuat Riawan!');
    } else if (section === 'contact') {
      setMood('love');
      setSpeechBubble('Yuk kirim email atau WA ke Kuat Riawan!');
    }
    setShowSpeech(true);
  };

  // AI Chat prompt responder
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
      reply = 'Proyek utama Kuat Riawan adalah NURAGA AI Platform K3 dengan WA Gateway & Analytics!';
    } else if (msg.includes('skill') || msg.includes('kemampuan') || msg.includes('bisa') || msg.includes('bahasa')) {
      setMood('love');
      reply = 'Kuat Riawan menguasai React, Node.js, TypeScript, Python, BigQuery & Otomasi AI!';
    } else if (msg.includes('kontak') || msg.includes('email') || msg.includes('wa') || msg.includes('hubungi')) {
      setMood('happy');
      reply = 'Kontak Kuat Riawan: kuatriawan69@gmail.com | WA: +62 821-2428-9987!';
    } else if (msg.includes('dicoding') || msg.includes('kuliah') || msg.includes('pendidikan') || msg.includes('ut')) {
      setMood('happy');
      reply = 'Kuat Riawan lulus Beasiswa Dicoding 2026 Distinction & S1 Sistem Informasi Terbuka!';
    } else if (msg.includes('siapa') || msg.includes('nama') || msg.includes('awans') || msg.includes('kenalin')) {
      setMood('love');
      reply = 'Aku Awans, maskot robot AI portofolio Kuat Riawan! Salam kenal ya!';
    } else if (msg.includes('cv') || msg.includes('resume') || msg.includes('download')) {
      setMood('happy');
      reply = 'CV Kuat Riawan siap diunduh lewat tombol Resume / CV di navbar atas!';
    } else if (msg.includes('marah') || msg.includes('kesel') || msg.includes('jahat')) {
      setMood('sad');
      reply = 'Jangan galak-galak dong, Awans kan robot baik hati...';
    } else if (msg.includes('lucu') || msg.includes('keren') || msg.includes('hebat') || msg.includes('suka')) {
      setMood('love');
      reply = 'Makasih banyak ya! Awans makin sayang sama kamu!';
    } else {
      setMood('happy');
      reply = `Awans paham! "${msg}" -> Kuat Riawan siap diajak berkembang & kerja sebagai Web Dev!`;
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
        const maxWalkX = Math.max(50, (typeof window !== 'undefined' ? window.innerWidth : 400) - 100);

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

  // Periodic Random Speech Banter
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

  // Idle Timer -> Sleepy after 20 seconds
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (!isDragging && !isPaused && !isCharging && mood === 'happy') {
        setMood('sleepy');
        setSpeechBubble('Zzz... Awans lagi ngantuk mau tidur sejenak...');
        setShowSpeech(true);
      }
    }, 20000);

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
        setSpeechBubble('Waaaa! Awans terbang diangkat!');
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
              setSpeechBubble('Waduh... Awans dikocok-kocok pusing banget tujuh keliling!');
              setShowSpeech(true);
            }
          }
          lastDirectionRef.current = currentDir;
        }

        const clampedX = Math.max(10, Math.min((window.innerWidth || 400) - 90, dragRef.current.initialPosX + dx));
        const clampedY = Math.max(10, Math.min((window.innerHeight || 600) - 100, dragRef.current.initialPosY + dy));
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
          setSpeechBubble('Aduh... Awans pusing banget akibat dikocok-kocok!');
          setShowSpeech(true);
        } else if (throwSpeed > 0.6) {
          setMood('angry');
          setSpeechBubble('Aduh! Jangan dilempar-lempar dong! Awans MARAH NIH!');
          setShowSpeech(true);
        } else {
          setMood('love');
          setSpeechBubble('Hehe, terima kasih ya sudah memindahkan Awans dengan lembut!');
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

  // Click Reaction Logic
  const triggerMascotClick = () => {
    soundFx.playGrabPulse();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
    triggerPause();

    const nextIndex = (moodList.indexOf(mood) + 1) % moodList.length;
    const nextMood = moodList[nextIndex];
    setMood(nextMood);
    setSpeechBubble(moodQuotes[nextMood]);
    setShowSpeech(true);
  };

  // Double Click Event
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playGrabPulse();
    setIsJumping(true);
    setMood('surprised');
    setSpeechBubble('WAAA! Awans kaget banget diklik dua kali!');
    setShowSpeech(true);
    triggerPause();
  };

  // Right Click Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContextMenuOpen(true);
  };

  // Antenna Click Easter Egg (5x click -> Overheat mode)
  const handleAntennaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextClicks = antennaClicks + 1;
    setAntennaClicks(nextClicks);

    if (nextClicks >= 5) {
      soundFx.playGrabPulse();
      setAntennaClicks(0);
      setMood('dizzy');
      setSpeechBubble('BZZZT! System Overheat 100%! Antena Awans ditekan 5 kali!');
      setShowSpeech(true);
      triggerPause();
    }
  };

  // Fly to Charging Station
  const triggerCharging = () => {
    setIsCharging(true);
    setMood('charging');
    setIsContextMenuOpen(false);
    setPos({
      x: Math.max(10, (window.innerWidth || 400) - 130),
      y: Math.max(10, (window.innerHeight || 600) - 140),
    });
    setSpeechBubble('Bzzzt! Awans lagi ngecas batrai di Charging Station...');
    setShowSpeech(true);
  };

  return (
    <>
      {/* Floating Charging Station Dock (Bottom Right) */}
      <div 
        onClick={triggerCharging}
        className="fixed bottom-4 right-4 z-[9990] bg-slate-900/90 border border-cyan-500/50 hover:border-cyan-400 p-2 rounded-2xl shadow-xl backdrop-blur-md cursor-pointer flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs text-cyan-300 font-fredoka group"
        title="Klik untuk ngecas Awans"
      >
        <div className="relative">
          <Zap className={`w-4 h-4 text-cyan-400 ${isCharging ? 'animate-bounce' : 'group-hover:animate-pulse'}`} />
          {isCharging && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
        </div>
        <div className="flex flex-col text-[10px] font-mono leading-tight">
          <span className="font-bold uppercase tracking-wider text-cyan-200">Charging Station</span>
          <span className="text-slate-400">Batrai: {battery}%</span>
        </div>
      </div>

      {/* Right Click Context Menu Overlay */}
      {isContextMenuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[10000] bg-slate-950/95 border-2 border-amber-400/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl text-xs font-fredoka text-slate-100 flex flex-col gap-1.5 w-48 animate-fade-in"
          style={{
            left: Math.min(pos.x + 20, (window.innerWidth || 400) - 200),
            top: Math.min(pos.y + 20, (window.innerHeight || 600) - 200),
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Menu Awans
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
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Tanya Awans (AI Chat)
          </button>
          <button
            onClick={triggerCharging}
            className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left rounded-lg text-[11px] text-cyan-300 flex items-center gap-2 font-bold"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Ngecas Batrai ({battery}%)
          </button>
          <button
            onClick={() => {
              setIsContextMenuOpen(false);
              setMood('sleepy');
              setSpeechBubble('Zzz... Awans tidur dulu ya...');
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

      {/* Main Mascot Wrapper */}
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
                pos.y < 170 ? 'top-24' : '-top-44'
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
                ? 'bg-cyan-950/95 text-cyan-100 border-cyan-400'
                : 'bg-slate-900/95 text-slate-100 border-amber-400'
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
                    <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className={
                    mood === 'angry' ? 'text-rose-400' :
                    mood === 'dizzy' ? 'text-amber-300' :
                    mood === 'sad' ? 'text-blue-300' :
                    mood === 'love' ? 'text-pink-300' :
                    mood === 'surprised' ? 'text-yellow-300' :
                    mood === 'sleepy' ? 'text-indigo-300' :
                    mood === 'charging' ? 'text-cyan-300' :
                    'text-amber-400'
                  }>
                    Awans AI Chat
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
                  className="w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
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
                      placeholder="Tanya Awans..."
                      className="w-full px-2.5 py-1 bg-slate-950/90 border border-amber-400/60 focus:border-amber-400 text-slate-100 placeholder-slate-400 text-[10px] rounded-lg outline-none font-sans"
                    />
                    <button
                      type="submit"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="p-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white rounded-lg transition-all font-bold flex items-center justify-center shrink-0 active:scale-95 border border-orange-300 shadow-xs cursor-pointer"
                      title="Kirim pesan ke Awans"
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

                  {/* Quick Action Chips */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Siapa Kuat Riawan?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Siapa Kuat?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Proyek apa aja?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Proyek?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Skill Kuat?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Skill?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Pengalaman kerja?');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Pengalaman?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        processQuery('Kontak WA email');
                      }}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[9px] rounded border border-slate-700 font-sans"
                    >
                      Kontak?
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
                  ? 'bg-cyan-950 border-cyan-400'
                  : 'bg-slate-900 border-amber-400'
              }`} />
            </div>
          )}

          {/* 2D Interactive Robot Pet SVG Character */}
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
            title="Klik atau geser Awans!"
          >
            <svg width="85" height="95" viewBox="0 0 85 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              {/* Antenna Pole & Glowing Pulsing Bulb (Clickable Easter Egg!) */}
              <g onClick={handleAntennaClick} className="cursor-pointer">
                <line x1="42.5" y1="16" x2="42.5" y2="6" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <circle
                  cx="42.5"
                  cy="5"
                  r="5"
                  fill={mood === 'angry' ? '#ef4444' : mood === 'love' ? '#ec4899' : mood === 'dizzy' ? '#f59e0b' : mood === 'charging' ? '#22d3ee' : '#f59e0b'}
                  className={mood === 'angry' ? 'animate-ping' : mood === 'dizzy' || mood === 'charging' ? 'animate-spin' : 'animate-pulse'}
                />
                <circle cx="42.5" cy="5" r="2.5" fill="#fef08a" />
              </g>

              {/* Metallic Head Helmet */}
              <rect
                x="18"
                y="16"
                width="49"
                height="32"
                rx="14"
                fill={mood === 'angry' ? '#450a0a' : mood === 'sad' ? '#1e3a8a' : mood === 'dizzy' ? '#451a03' : mood === 'charging' ? '#083344' : '#334155'}
                stroke={mood === 'angry' ? '#ef4444' : mood === 'sad' ? '#3b82f6' : mood === 'dizzy' ? '#f59e0b' : mood === 'charging' ? '#22d3ee' : '#0f172a'}
                strokeWidth="3"
              />
              
              {/* Visor Screen */}
              <rect x="23" y="21" width="39" height="22" rx="8" fill="#0f172a" />

              {/* DYNAMIC FACIAL EXPRESSIONS WITH CURSOR PUPIL TRACKING */}

              {/* CHARGING MODE */}
              {mood === 'charging' && (
                <g>
                  <path d="M30 32 L36 32" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M48 32 L54 32" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M38 38 L44 38" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {/* ANGRY FACE */}
              {mood === 'angry' && (
                <g>
                  <g className="animate-bounce">
                    <path d="M60 8 L68 8 M64 4 L64 12 M61 5 L67 11 M67 5 L61 11" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <line x1="26" y1="24" x2="38" y2="29" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <line x1="58" y1="24" x2="46" y2="29" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="33" cy="32" r="4" fill="#ef4444" className="animate-ping" />
                  <circle cx="33" cy="32" r="3.5" fill="#ef4444" />
                  <circle cx="51" cy="32" r="4" fill="#ef4444" className="animate-ping" />
                  <circle cx="51" cy="32" r="3.5" fill="#ef4444" />
                  <path d="M31 39 L35 36 L39 39 L43 36 L47 39 L51 36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* DIZZY FACE */}
              {mood === 'dizzy' && (
                <g>
                  <g className="animate-spin" style={{ transformOrigin: '42.5px 5px', animationDuration: '2s' }}>
                    <polygon points="42.5,0 44,3 47,3.5 44.5,5.5 45,8.5 42.5,7 40,8.5 40.5,5.5 38,3.5 41,3" fill="#f59e0b" />
                    <polygon points="26,5 27,7 29,7 27.5,8 28,10 26,9 24,10 24.5,8 23,7 25,7" fill="#fde047" />
                    <polygon points="59,5 60,7 62,7 60.5,8 61,10 59,9 57,10 57.5,8 56,7 58,7" fill="#fde047" />
                  </g>
                  <path d="M30 32 A 3 3 0 1 1 34 34 A 1.5 1.5 0 1 1 32 32" stroke="#f59e0b" strokeWidth="2" fill="none" className="animate-spin" style={{ transformOrigin: '33px 32px' }} />
                  <path d="M48 32 A 3 3 0 1 1 52 34 A 1.5 1.5 0 1 1 50 32" stroke="#f59e0b" strokeWidth="2" fill="none" className="animate-spin" style={{ transformOrigin: '51px 32px' }} />
                  <path d="M33 39 Q 37 36 41 39 Q 45 42 49 39" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SAD FACE */}
              {mood === 'sad' && (
                <g>
                  <line x1="27" y1="26" x2="37" y2="23" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                  <line x1="57" y1="26" x2="47" y2="23" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="33" cy="32" r="4" fill="#3b82f6" />
                  <circle cx="51" cy="32" r="4" fill="#3b82f6" />
                  <path d="M28 35 C28 35 26 39 28 41 C30 43 32 41 32 39 C32 37 28 35 28 35 Z" fill="#60a5fa" className="animate-bounce" style={{ animationDuration: '1s' }} />
                  <path d="M34 40 Q 42 35 50 40" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SURPRISED FACE */}
              {mood === 'surprised' && (
                <g>
                  <line x1="28" y1="23" x2="37" y2="23" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="47" y1="23" x2="56" y2="23" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="33" cy="31" r="4.5" fill="#fde047" />
                  <circle cx="51" cy="31" r="4.5" fill="#fde047" />
                  <circle cx="33" cy="31" r="2" fill="#0f172a" />
                  <circle cx="51" cy="31" r="2" fill="#0f172a" />
                  <circle cx="42" cy="38" r="4" fill="#0f172a" stroke="#fde047" strokeWidth="2.5" />
                </g>
              )}

              {/* LOVE FACE */}
              {mood === 'love' && (
                <g>
                  <path d="M29 30 C29 27 33 27 33 30 C33 27 37 27 37 30 C37 33 33 36 33 36 C33 36 29 33 29 30 Z" fill="#ec4899" />
                  <path d="M47 30 C47 27 51 27 51 30 C51 27 55 27 55 30 C55 33 51 36 51 36 C51 36 47 33 47 30 Z" fill="#ec4899" />
                  <circle cx="26" cy="35" r="3.5" fill="#f472b6" opacity="0.7" />
                  <circle cx="58" cy="35" r="3.5" fill="#f472b6" opacity="0.7" />
                  <path d="M35 37 Q 38 40 42 37 Q 45 40 48 37" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* SLEEPY FACE */}
              {mood === 'sleepy' && (
                <g>
                  <path d="M28 31 L32 34 L36 31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M48 31 L52 34 L56 31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="45" cy="38" r="3.5" fill="#93c5fd" opacity="0.6" className="animate-pulse" />
                  <text x="60" y="15" fill="#94a3b8" fontSize="10" fontWeight="bold" className="animate-bounce">Z</text>
                  <text x="67" y="10" fill="#94a3b8" fontSize="8" fontWeight="bold" className="animate-bounce">z</text>
                </g>
              )}

              {/* DEFAULT HAPPY FACE WITH CURSOR TRACKING PUPILS */}
              {mood === 'happy' && (
                <g>
                  <circle cx="33" cy="32" r="4.5" fill="#00f0ff" />
                  <circle cx="51" cy="32" r="4.5" fill="#00f0ff" />
                  {/* Cursor Tracking Pupils */}
                  <circle cx={33 + eyeOffset.dx} cy={32 + eyeOffset.dy} r="2" fill="#ffffff" />
                  <circle cx={51 + eyeOffset.dx} cy={32 + eyeOffset.dy} r="2" fill="#ffffff" />
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
                fill={mood === 'angry' ? '#dc2626' : mood === 'sad' ? '#1d4ed8' : mood === 'dizzy' ? '#d97706' : mood === 'charging' ? '#0891b2' : '#f97316'}
                stroke="#0f172a"
                strokeWidth="3"
              />
              
              {/* Body Screen / Joypad */}
              <rect x="23" y="58" width="39" height="18" rx="6" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
              
              {/* Colorful Arcade Buttons */}
              <circle cx="31" cy="67" r="4" fill="#ef4444" />
              <circle cx="42.5" cy="67" r="4" fill="#3b82f6" />
              <circle cx="54" cy="67" r="4" fill="#10b981" />

              {/* Animated Feet */}
              <g className={isDragging || isPaused ? '' : 'animate-bounce'} style={{ animationDuration: isRunning ? '0.15s' : mood === 'angry' ? '0.2s' : '0.4s' }}>
                <rect x="26" y="81" width="11" height="9" rx="4" fill="#1e293b" />
                <rect x="48" y="81" width="11" height="9" rx="4" fill="#1e293b" />
              </g>
            </svg>
          </div>

        </div>
      </div>
    </>
  );
};
