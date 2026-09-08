import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { soundFx } from '../services/soundEffects';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

export type MascotMood = 'happy' | 'angry' | 'dizzy' | 'sad' | 'surprised' | 'love' | 'sleepy' | 'charging' | 'excited' | 'thinking' | 'shy' | 'sitting' | 'waving' | 'peeking';

// The 3D Model Component inside the Canvas
function MascotModel({ mood, isDragging, isFalling, isWalking, facingRight, eyeOffset, theme }: { 
  mood: MascotMood; 
  isDragging: boolean;
  isFalling: boolean;
  isWalking: boolean;
  facingRight: boolean;
  eyeOffset: { dx: number, dy: number };
  theme: string;
}) {
  const group = useRef<THREE.Group>(null);
  
  const modelPath = theme === 'dark' ? '/Karakter/black_mascot.glb' : '/Karakter/white_mascot_fixed.glb';
  const { scene, animations } = useGLTF(modelPath) as any;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const action = actions[actionNames[0]];
      if (action) action.reset().fadeIn(0.2).play();
    }
  }, [actions, theme]);

  useEffect(() => {
    // No need to manually toggle visibility anymore since each file only contains one character!
  }, [theme, scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const targetRotation = new THREE.Euler(0, 0, 0);
    const targetPosition = new THREE.Vector3(0, -0.4, 0);
    const time = state.clock.getElapsedTime();

    // Base looking direction (eyeOffset gives us dx/dy based on cursor)
    targetRotation.y = (eyeOffset.dx / 10) * 0.3;
    targetRotation.x = (eyeOffset.dy / 10) * 0.3;

    if (isDragging) {
      targetPosition.y = 0.5;
      targetRotation.x = 0.2;
    } else if (isFalling) {
      targetPosition.y = THREE.MathUtils.lerp(group.current.position.y, -0.4, delta * 10);
      targetRotation.x = -0.1;
    } else if (isWalking) {
      targetPosition.y = -0.4 + Math.abs(Math.sin(time * 10)) * 0.1;
      targetRotation.y += facingRight ? Math.PI / 2 : -Math.PI / 2;
    } else if (mood === 'sad') {
      targetRotation.x = 0.5;
    } else if (mood === 'dizzy') {
      targetRotation.y = time * 5; // Spin slowly
    } else if (mood === 'excited' || mood === 'waving') {
      targetPosition.y = -0.4 + Math.abs(Math.sin(time * 15)) * 0.2;
      targetRotation.x = -0.2;
    }

    // Apply rotation smoothing
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation.y, delta * 5);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotation.x, delta * 5);
    
    // Apply position smoothing
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetPosition.y, delta * 5);

    // Dynamic facial expressions based on mood (MorphTargets)
    scene.traverse((node: any) => {

      if (node.isMesh && node.morphTargetInfluences) {
        // Reset all morphs
        for(let i=0; i<node.morphTargetInfluences.length; i++) {
          node.morphTargetInfluences[i] = THREE.MathUtils.lerp(node.morphTargetInfluences[i], 0, delta * 15);
        }
        
        let targetIndex = -1;
        if (mood === 'happy') targetIndex = 0;
        else if (mood === 'excited') targetIndex = 1;
        else if (mood === 'angry') targetIndex = 2;
        else if (mood === 'dizzy') targetIndex = 3;
        else if (mood === 'sad') targetIndex = 4;
        else if (mood === 'surprised') targetIndex = 5;
        else if (mood === 'sleepy' || mood === 'charging') targetIndex = 6;
        else if (mood === 'shy') targetIndex = 7;
        else if (mood === 'waving') targetIndex = 8;
        
        if (targetIndex >= 0 && node.morphTargetInfluences && targetIndex < node.morphTargetInfluences.length) {
           // Reduce intensity to 0.15 so it doesn't open its mouth too wide
           node.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(node.morphTargetInfluences[targetIndex] || 0, 0.15, delta * 15);
        }
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      {/* Adjusted scale so it fits nicely on the screen */}
      <group rotation={[0, 0, 0]}>
        <primitive 
          object={scene} 
          scale={3} 
          position={[0, -0.4, 0]} 
        />
      </group>
    </group>
  );
}

// Preload to avoid jitter
useGLTF.preload('/Karakter/black_mascot.glb');
useGLTF.preload('/Karakter/white_mascot_fixed.glb');

export const ArcadeMascot: React.FC<ArcadeMascotProps> = () => {
  const { theme, toggleTheme } = useApp();

  // ─── STATE ───
  const [mood, setMood] = useState<MascotMood>('happy');
  const [isHovered, setIsHovered] = useState(false);
  const [nearbyElementContext, setNearbyElementContext] = useState<string | null>(null);
  
  // Accessories State
  const [accessory, setAccessory] = useState<'none' | 'helmet' | 'glasses' | 'labcoat'>('none');
  
  // Position & Movement
  const [pos, setPos] = useState({ x: -1000, y: -1000 }); 
  const [targetPos, setTargetPos] = useState<{x: number, y: number} | null>(null);
  const [facingRight, setFacingRight] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  
  // Cursor Tracking for Parallax
  const [eyeOffset, setEyeOffset] = useState({ dx: 0, dy: 0 });

  // Mascot Quotes categorized by interaction type
  const IDLE_QUOTES = useMemo(() => [
    "Ara-ara… Mau liat-liat portofolio\natau mau liat yang lain, Master?",
    "Portofolio ini mengandung konten dewasa:\nDewasa-nya beban hidup.",
    "Buka portofolio ini cuma boleh kalau umur\nkamu udah siap nanggung risiko ketagihan.",
    "Yamkudasai! Jangan liat-liat terus,\nnanti ujungnya desah...",
    "Irasshaimase~! Di sini semuanya polos,\nkecuali pikiran kamu.",
    "Kok didiemin? Jarinya pegal ya,\natau udah keluar duluan?",
    "Sentuh aku dong... Masa cuma diliatin,\nemang aku pajangan toko bagus?",
    "Sumbu aku dingin nih, butuh\nsentuhan hangat dari jarimu... UwU"
  ], []);

  const SHAKE_QUOTES = useMemo(() => [
    "Ah-ah-ah! Pelan-pelan kocoknya,\nnanti cairan aku basah!",
    "Nnn~ Jangan dikocok terus,\nnanti keluar ledakan crot!",
    "Kocok terus bang sampai berbusa! Kimochiii~!",
    "Aduh pusing... Otak aku kocak,\nsumbu aku kocok!",
    "Yamkudasai! Lu kira aku botol\nmarjan marjan-an dikocok-kocok?!",
    "Ahn~ Goyangannya mantap,\nbikin sumbu aku makin tegang!"
  ], []);
  
  const CLICK_QUOTES = useMemo(() => [
    "AHNN! Jangan pengang daerah situ,\nsensitif!",
    "Totolan ke-5 gratis desahan! Dameee~!",
    "Sekali klik mendesah, dua kali\nklik meledak, tiga kali klik hamil!",
    "Aduh jarinya liar banget,\nmau dipencet sampai crot ya?",
    "Pencet aku Mas, pencet!\nJangan kasih kendor!",
    "Kih-kimochi~ Terus Kak, di sebelah\nsitu agak geli sikit!"
  ], []);

  const DRAG_QUOTES = useMemo(() => [
    "KYAAA~! Jangan diangkat,\naku gak pakai celana dalam!",
    "Mau dibawa ke mana aku?!\nAku masih polos, belum siap dinikahi!",
    "Pegangannya kenceng banget... Mau diajak\nmain di ranjang portofolio ya?",
    "Lepasin! Nanti sumbu aku kepegang\nterus meledak di dalam (ruangan)!",
    "Ara-ara... Tinggal angkat,\ngantung, lalu... ahhh~",
    "Turunin aku! Nanti tumpah\nsemua benih-benih ke-asbun-an aku!"
  ], []);

  const [currentQuote, setCurrentQuote] = useState(IDLE_QUOTES[0]);
  const [currentShakeQuote, setCurrentShakeQuote] = useState(SHAKE_QUOTES[0]);
  const [currentClickQuote, setCurrentClickQuote] = useState(CLICK_QUOTES[0]);
  const [currentDragQuote, setCurrentDragQuote] = useState(DRAG_QUOTES[0]);

  useEffect(() => {
    // Typing animation for idle quotes
    const typingInterval = setInterval(() => {
      if (mood === 'happy') {
        const randomIndex = Math.floor(Math.random() * IDLE_QUOTES.length);
        setCurrentQuote(IDLE_QUOTES[randomIndex]);
      }
    }, 5000);
    return () => clearInterval(typingInterval);
  }, [IDLE_QUOTES, mood]);
  
  // Dragging & Physics
  const [isDragging, setIsDragging] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
  const homeBasePos = { x: 40, y: window.innerHeight - 170 };
  
  // Theme Transition
  const [isThemeJumping, setIsThemeJumping] = useState(false);
  const [themeJumpPhase, setThemeJumpPhase] = useState<'none' | 'jumping' | 'dropping'>('none');
  const [curtainTargetTheme, setCurtainTargetTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const handleThemeJump = () => {
      if (isDragging || isFalling || isWalking) return;
      
      const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
      setCurtainTargetTheme(isCurrentlyLight ? 'dark' : 'light');
      
      setIsThemeJumping(true);
      setThemeJumpPhase('jumping');
      
      // Step 1: Jump to top center quickly
      setPos({ x: window.innerWidth / 2 - 100, y: -50 });
      setMood('surprised');
      
      // Step 2: Drop all the way down below screen to "pull" the curtain
      setTimeout(() => {
        setThemeJumpPhase('dropping');
        // Drop far below the screen to drag the curtain down with it
        setPos({ x: window.innerWidth / 2 - 100, y: window.innerHeight * 2 + 500 });
        setMood('happy');
      }, 800); // 800ms jump up duration
      
      // Step 3: Reset after the drop finishes
      setTimeout(() => {
        setIsThemeJumping(false);
        setThemeJumpPhase('none');
        setPos(homeBasePos);
      }, 800 + 1500); // 1500ms drop duration
    };
    
    window.addEventListener('mascot-theme-jump', handleThemeJump);
    return () => window.removeEventListener('mascot-theme-jump', handleThemeJump);
  }, [isDragging, isFalling, isWalking, homeBasePos]);
  
  // ─── REFS ───
  const mascotRef = useRef<HTMLDivElement>(null);
  const moodResetTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  
  // Drag Physics Tracking
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const velocities = useRef<{vx: number, vy: number}[]>([]);
  const shakeCount = useRef(0);

  // ─── HELPER: Check Nearby Elements ───
  const checkNearbyElements = (currentX: number, currentY: number) => {
    // Only check if not dragging or falling
    const elements = document.querySelectorAll('a, button, [class*="project"], [class*="card"]');
    let found = false;
    
    // Convert mascot pos to center
    const mx = currentX + 70;
    const my = currentY + 80;
    
    elements.forEach(el => {
      if (found) return;
      const rect = el.getBoundingClientRect();
      // Expand rect slightly for proximity
      if (mx > rect.left - 50 && mx < rect.right + 50 && my > rect.top - 50 && my < rect.bottom + 50) {
        found = true;
        
        // Contextual strings
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('github') || text.includes('code')) {
          setNearbyElementContext("Mau liat kode sumbernya?");
        } else if (text.includes('demo') || text.includes('main')) {
          setNearbyElementContext("Ayo kita mainkan ini!");
        } else {
          setNearbyElementContext("Mau liat yang ini?");
        }
      }
    });
    
    if (found) {
      setMood('thinking');
    } else {
      setNearbyElementContext(null);
      if (mood === 'thinking') setMood('happy');
    }
  };

  // ─── IDLE AI (Wandering) ───
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isDragging || isWalking || isFalling || isRecovering) return;
    
    idleTimerRef.current = setTimeout(() => {
      // Walk to a random position
      const rx = Math.max(50, Math.random() * (window.innerWidth - 250));
      const ry = Math.max(50, Math.random() * (window.innerHeight - 250));
      
      setTargetPos({ x: rx, y: ry });
      setFacingRight(rx > pos.x);
      setIsWalking(true);
      setMood(Math.random() > 0.5 ? 'happy' : 'excited');
      setNearbyElementContext(null);
      try { soundFx.playMoveWhirr(); } catch(e) {}
    }, 3000 + Math.random() * 2000); // 3 to 5 seconds interval
  };

  useEffect(() => {
    // Start at home base
    setPos({ x: homeBasePos.x, y: homeBasePos.y });
    setMood('charging');
    
    const resizeHandler = () => {
      homeBasePos.y = window.innerHeight - 170;
    };
    
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    
    const scrollHandler = () => {
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const dt = currentTime - lastScrollTime;
      
      if (dt > 20) {
         const speed = Math.abs(currentScrollY - lastScrollY) / dt;
         if (speed > 2.5) {
            setMood('dizzy');
         }
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    const handleMascotSpeak = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNearbyElementContext(detail);
      setMood('thinking');
    };
    
    const handleMascotSpeakClear = () => {
      setNearbyElementContext(null);
      setMood('happy');
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('mascot-speak', handleMascotSpeak);
    window.addEventListener('mascot-speak-clear', handleMascotSpeakClear);
    
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mascot-speak', handleMascotSpeak);
      window.removeEventListener('mascot-speak-clear', handleMascotSpeakClear);
    };
  }, []);

  // ─── Mouse Look & Pet Mode Tracking ───
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current || isDragging || isFalling || isRecovering) return;
      
      if (isWalking) {
         return;
      }
      
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Wake up from charging/sleepy if cursor is close
      if ((mood === 'sleepy' || mood === 'sitting' || mood === 'charging') && distance < 200) {
        setMood('happy');
      }
      
      // Parallax Eye Offset (subtle fake 3D tracking)
      const maxOffset = 10;
      const ex = Math.max(-maxOffset, Math.min(maxOffset, deltaX / 30));
      const ey = Math.max(-maxOffset, Math.min(maxOffset, deltaY / 30));
      setEyeOffset({ dx: ex, dy: ey });
      
      // Look at direction
      if (distance > 100 && mood !== 'peeking') {
        setFacingRight(deltaX > 0);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, isFalling, isRecovering, isWalking, mood, facingRight, pos]);

  // ─── Click-to-Walk ───
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      resetIdleTimer();
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('#mascot-container') || target.closest('#home-base-container')) {
        return;
      }
      
      if (isDragging || isFalling) return;
      
      const tx = e.pageX - 100; 
      const ty = e.pageY - 120; 
      
      setTargetPos({ x: tx, y: ty });
      setFacingRight(tx > pos.x);
      setIsWalking(true);
      setMood('happy');
      setNearbyElementContext(null); // Clear context while walking
      soundFx.playMoveWhirr();
    };
    
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [pos.x, isDragging, isFalling]);

  // ─── Walking Loop ───
  useEffect(() => {
    if (!targetPos || !isWalking) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const walkStep = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      setPos(currentPos => {
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
          setIsWalking(false);
          setTargetPos(null);
          
          // If returned home
          if (Math.abs(targetPos.x - homeBasePos.x) < 10 && Math.abs(targetPos.y - homeBasePos.y) < 10) {
            setMood('charging');
          } else {
            // Check elements when stopped
            checkNearbyElements(targetPos.x, targetPos.y);
          }
          
          resetIdleTimer();
          return targetPos;
        }
        
        const speed = 0.7; // Faster speed to match the "Run" animation
        const move = speed * dt;
        
        const ratio = Math.min(move / distance, 1);
        return {
          x: currentPos.x + dx * ratio,
          y: currentPos.y + dy * ratio
        };
      });
      
      if (isWalking) {
        animationFrameId = requestAnimationFrame(walkStep);
      }
    };
    
    animationFrameId = requestAnimationFrame(walkStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos, isWalking]);

  // ─── DRAG & PHYSICS ───
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsWalking(false);
    setTargetPos(null);
    setIsFalling(false);
    setIsRecovering(false);
    
    dragStart.current = { x: e.pageX, y: e.pageY };
    posStart.current = { ...pos };
    lastMousePos.current = { x: e.pageX, y: e.pageY, time: performance.now() };
    velocities.current = [];
    shakeCount.current = 0;
    
    mascotRef.current?.setPointerCapture(e.pointerId);
    soundFx.playMoveWhirr();
    setMood('surprised');
    const randomDrag = Math.floor(Math.random() * DRAG_QUOTES.length);
    setCurrentDragQuote(DRAG_QUOTES[randomDrag]);
    
    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const dx = e.pageX - dragStart.current.x;
    const dy = e.pageY - dragStart.current.y;
    
    const now = performance.now();
    const dt = now - lastMousePos.current.time;
    if (dt > 0) {
      const vx = (e.pageX - lastMousePos.current.x) / dt;
      const vy = (e.pageY - lastMousePos.current.y) / dt;
      velocities.current.push({ vx, vy });
      if (velocities.current.length > 5) velocities.current.shift();
      
      if (velocities.current.length >= 3) {
        const v1 = velocities.current[velocities.current.length - 2].vx;
        const v2 = velocities.current[velocities.current.length - 1].vx;
        if (Math.sign(v1) !== Math.sign(v2) && Math.abs(v1) > 1 && Math.abs(v2) > 1) {
          shakeCount.current++;
        }
      }
      
      if (shakeCount.current > 4) {
        setMood('dizzy');
        const randomShake = Math.floor(Math.random() * SHAKE_QUOTES.length);
        setCurrentShakeQuote(SHAKE_QUOTES[randomShake]);
      }
    }
    
    lastMousePos.current = { x: e.pageX, y: e.pageY, time: now };

    setPos({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    mascotRef.current?.releasePointerCapture(e.pointerId);
    resetIdleTimer();
    
    // Check if dragged to edge for peeking
    if (pos.x < window.scrollX - 10) {
      setPos(p => ({ ...p, x: window.scrollX - 30 }));
      setMood('peeking');
      setFacingRight(true);
      return;
    } else if (pos.x > window.innerWidth - 110) {
      setPos(p => ({ ...p, x: window.innerWidth - 110 }));
      setMood('peeking');
      setFacingRight(false);
      return;
    }
    
    // If dropped at home base
    if (Math.abs(pos.x - homeBasePos.x) < 50 && Math.abs(pos.y - homeBasePos.y) < 50) {
      setPos({ x: homeBasePos.x, y: homeBasePos.y });
      setMood('charging');
      return;
    }
    
    // Check if dropped at top right for Dark Mode switch
    if (pos.x > window.innerWidth - 200 && pos.y < 150) {
      toggleTheme();
      setMood('excited');
      soundFx.playCoin();
      return;
    }
    
    let avgVx = 0, avgVy = 0;
    if (velocities.current.length > 0) {
      avgVx = velocities.current.reduce((s, v) => s + v.vx, 0) / velocities.current.length;
      avgVy = velocities.current.reduce((s, v) => s + v.vy, 0) / velocities.current.length;
    }
    
    const speed = Math.sqrt(avgVx * avgVx + avgVy * avgVy);
    
    if (speed > 2.5) {
      // THROWN!
      soundFx.playGrabPulse();
      setMood('angry');
      setIsFalling(true);
      
      const throwDuration = 500;
      const startX = pos.x;
      const startY = pos.y;
      const targetX = Math.max(0, Math.min(window.innerWidth - 100, startX + avgVx * throwDuration));
      const targetY = window.innerHeight - 150;
      
      let startTime = performance.now();
      const throwAnim = (time: number) => {
        const progress = Math.min((time - startTime) / throwDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setPos({
          x: startX + (targetX - startX) * easeOut,
          y: startY + (targetY - startY) * Math.min(progress * 1.5, 1) 
        });
        
        if (progress < 1) {
          requestAnimationFrame(throwAnim);
        } else {
          setIsFalling(false);
          setIsRecovering(true);
          soundFx.playCoin(); 
          setTimeout(() => {
            setIsRecovering(false);
            setMood('happy');
            resetIdleTimer();
          }, 2000);
        }
      };
      requestAnimationFrame(throwAnim);
      
    } else {
      soundFx.playMoveWhirr();
      if (mood === 'dizzy') {
        setIsRecovering(true);
        setTimeout(() => {
          setIsRecovering(false);
          setMood('happy');
        }, 3000);
      } else {
        setMood('happy');
        checkNearbyElements(pos.x, pos.y);
      }
    }
  };

  const clickCount = useRef(0);
  const handleBellyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging || isWalking || isFalling) return;
    
    clickCount.current++;
    
    // Set a random click quote
    const randomClick = Math.floor(Math.random() * CLICK_QUOTES.length);
    setCurrentClickQuote(CLICK_QUOTES[randomClick]);
    
    if (clickCount.current >= 3) {
      setMood('angry');
      soundFx.playGrabPulse();
      setTimeout(() => clickCount.current = 0, 3000);
    } else {
      setMood('excited');
      soundFx.playCoin();
    }
    
    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
    moodResetTimerRef.current = setTimeout(() => {
      setMood('happy');
      resetIdleTimer();
    }, 2000);
  };
  
  const handleMouseEnter = () => {
    if (isDragging || isWalking || isFalling || isRecovering || mood === 'peeking') return;
    setIsHovered(true);
    if (mood === 'happy' || mood === 'sitting' || mood === 'sleepy' || mood === 'charging') {
      setMood('waving');
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (mood === 'waving') {
      setMood('happy');
      resetIdleTimer();
    }
  };

  if (pos.x === -1000) return null;

  const isPeeking = mood === 'peeking';

  return (
    <>

      <div 
        id="mascot-container"
        className="fixed z-[99999] select-none touch-none"
        style={{ 
          left: pos.x,
          top: pos.y,
          transition: isThemeJumping 
            ? (themeJumpPhase === 'jumping' 
               ? 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
               : 'all 1.5s cubic-bezier(0.5, 0, 0.1, 1)')
            : 'none',
          width: 200,
          height: 240
        }}
      >
        {/* The Curtain Attached ABOVE Bombom */}
        {isThemeJumping && (
          <div 
            className={`absolute bottom-full left-1/2 -translate-x-1/2 w-[200vw] flex flex-col items-center justify-end overflow-hidden ${
              curtainTargetTheme === 'dark'
                ? 'border-b-[8px] border-slate-700' 
                : 'border-b-[8px] border-slate-400'
            }`}
            style={{ 
              height: '200vh', // extra tall to ensure no gaps
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 16px, rgba(0,0,0,0.15) 17px, rgba(0,0,0,0.3) 20px), linear-gradient(to bottom, ${
                curtainTargetTheme === 'dark' ? '#0f172a, #020617' : '#f8fafc, #cbd5e1'
              })`
            }}
          >
            {/* The Rope */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-40 rounded shadow-xl translate-y-24 border ${
              curtainTargetTheme === 'dark' ? 'bg-amber-900 border-amber-950' : 'bg-amber-600 border-amber-800'
            }`}>
              {/* Rope Handle/Knot */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-inherit border inherit shadow-md"></div>
            </div>
          </div>
        )}
        <div className="relative w-full h-full group flex flex-col items-center justify-end">
          

          
          {/* ── SPEECH BUBBLE ── */}
          <div 
            className={`absolute top-12 bg-white/90 backdrop-blur text-slate-800 text-xs font-medium px-4 py-2 rounded-2xl rounded-bl-sm shadow-xl border border-white/50 transition-all duration-300 origin-bottom-left z-10 whitespace-pre-wrap text-center leading-relaxed
              ${(isHovered || mood === 'thinking' || mood === 'excited' || mood === 'angry' || mood === 'surprised' || mood === 'dizzy') && !isPeeking ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
            `}
            style={{ width: 'max-content', left: '75%' }}
          >
            {mood === 'happy' && currentQuote}
            {mood === 'excited' && currentClickQuote}
            {mood === 'thinking' && (nearbyElementContext || 'Hmm... menarik nih 🤔')}
            {mood === 'angry' && currentClickQuote}
            {mood === 'dizzy' && currentShakeQuote}
            {mood === 'sad' && 'Jangan pergi... 💧'}
            {mood === 'surprised' && currentDragQuote}
            {mood === 'love' && 'Sensasi kliknya enak banget... Terus, Kak, jangan berhenti!'}
            {mood === 'shy' && 'Yamete! Kulit hitamku licin, nanti jarimu terpleset ke hati.'}
            {mood === 'sleepy' && 'Zzz... cape nih'}
            {mood === 'sitting' && 'Lagi istirahat bentar...'}
            {mood === 'waving' && 'Aduuh, sentuhan kamu bikin sumbu aku makin panas...'}
            {mood === 'charging' && 'Mengisi daya... ⚡'}

            {/* Accessory Toggles inside the speech bubble when hovered */}
            <div className={`mt-2 pt-2 border-t flex items-center justify-center gap-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); setAccessory(prev => prev === 'helmet' ? 'none' : 'helmet'); }}
                className={`p-1.5 rounded-lg border shadow-sm transition-all ${accessory === 'helmet' ? 'bg-amber-100 border-amber-400 scale-110' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                title="Helm Proyek K3"
              >
                👷
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setAccessory(prev => prev === 'glasses' ? 'none' : 'glasses'); }}
                className={`p-1.5 rounded-lg border shadow-sm transition-all ${accessory === 'glasses' ? 'bg-slate-200 border-slate-500 scale-110' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                title="Kacamata Hacker"
              >
                🕶️
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setAccessory(prev => prev === 'labcoat' ? 'none' : 'labcoat'); }}
                className={`p-1.5 rounded-lg border shadow-sm transition-all ${accessory === 'labcoat' ? 'bg-cyan-100 border-cyan-400 scale-110' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                title="Jas Lab AI"
              >
                🥼
              </button>
            </div>
          </div>
          
          {/* ── 3D MODEL CANVAS ── */}
          <div
            ref={mascotRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleBellyClick}
            className="w-full h-full cursor-grab active:cursor-grabbing drop-shadow-[0_8px_16px_rgba(15,23,42,0.25)] z-10"
            style={{
               clipPath: isPeeking ? 'inset(0 0 0 50%)' : 'none',
               transform: isPeeking ? 'translateX(-30px)' : 'none'
            }}
          >
            <Canvas camera={{ position: [0, 1, 5], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-5, 5, 5]} intensity={0.5} />
              
              <Suspense fallback={null}>
                <MascotModel 
                  key={theme}
                  mood={mood}
                  isDragging={isDragging}
                  isFalling={isFalling}
                  isWalking={isWalking}
                  facingRight={facingRight}
                  eyeOffset={eyeOffset}
                  theme={theme}
                />
              </Suspense>
              
              {/* Subtle drop shadow underneath the 3D model */}
              <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={5} blur={2} far={4} />
            </Canvas>

            {/* 2D SVG Overlays for Accessories (Absolutely positioned over Canvas) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ transform: `translateY(${isWalking ? -10 : isDragging ? -40 : isFalling ? 20 : 0}px)` }}>
              {accessory === 'helmet' && (
                <svg width="120" height="80" viewBox="0 0 100 100" className="absolute top-[25%] drop-shadow-lg transition-transform duration-300" style={{ transform: `rotate(${eyeOffset.dx * 0.1}deg) translateX(${eyeOffset.dx * 0.5}px)` }}>
                  {/* Yellow Hard Hat */}
                  <path d="M 10,60 Q 50,10 90,60 L 95,60 Q 98,60 98,65 Q 98,70 90,70 L 10,70 Q 2,70 2,65 Q 2,60 5,60 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="3"/>
                  {/* Hat Ridge */}
                  <path d="M 45,60 L 45,30 Q 50,25 55,30 L 55,60 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2"/>
                </svg>
              )}
              {accessory === 'glasses' && (
                <svg width="100" height="40" viewBox="0 0 100 40" className="absolute top-[48%] drop-shadow-md transition-transform duration-300" style={{ transform: `rotate(${eyeOffset.dx * 0.1}deg) translateX(${eyeOffset.dx * 0.8}px)` }}>
                  {/* Pixelated Hacker Glasses */}
                  <path d="M 10,15 L 45,15 L 45,25 L 35,25 L 35,35 L 20,35 L 20,25 L 10,25 Z" fill="#111827"/>
                  <path d="M 55,15 L 90,15 L 90,25 L 80,25 L 80,35 L 65,35 L 65,25 L 55,25 Z" fill="#111827"/>
                  {/* Bridge */}
                  <rect x="45" y="15" width="10" height="5" fill="#111827"/>
                  {/* Glare */}
                  <rect x="15" y="18" width="8" height="4" fill="#ffffff" opacity="0.8"/>
                  <rect x="60" y="18" width="8" height="4" fill="#ffffff" opacity="0.8"/>
                </svg>
              )}
              {accessory === 'labcoat' && (
                <svg width="160" height="120" viewBox="0 0 160 120" className="absolute top-[58%] drop-shadow-lg transition-transform duration-300" style={{ transform: `translateX(${eyeOffset.dx * 0.3}px)` }}>
                  {/* White Lab Coat Lapels */}
                  <path d="M 40,20 L 70,60 L 70,110 L 30,110 L 20,80 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3"/>
                  <path d="M 120,20 L 90,60 L 90,110 L 130,110 L 140,80 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3"/>
                  {/* Collar */}
                  <path d="M 40,20 L 60,40 L 75,20 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                  <path d="M 120,20 L 100,40 L 85,20 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                  {/* Pocket */}
                  <rect x="35" y="75" width="20" height="25" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="2"/>
                  <path d="M 40,75 L 40,85" stroke="#3b82f6" strokeWidth="2"/> {/* Blue pen */}
                  <path d="M 45,75 L 45,82" stroke="#ef4444" strokeWidth="2"/> {/* Red pen */}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
