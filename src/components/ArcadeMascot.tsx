import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../services/soundEffects';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ArcadeMascotProps {
  onScrollToArcade?: () => void;
}

export type MascotMood = 'happy' | 'angry' | 'dizzy' | 'sad' | 'surprised' | 'love' | 'sleepy' | 'charging' | 'excited' | 'thinking' | 'shy' | 'sitting' | 'waving' | 'peeking';

// The 3D Model Component inside the Canvas
function MascotModel({ mood, isDragging, isFalling, isWalking, facingRight, eyeOffset }: { 
  mood: MascotMood; 
  isDragging: boolean;
  isFalling: boolean;
  isWalking: boolean;
  facingRight: boolean;
  eyeOffset: { dx: number, dy: number };
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/Karakter/ssrbs_2.0_hololive.glb') as any;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const action = actions[actionNames[0]];
      if (action) action.reset().fadeIn(0.2).play();
    }
  }, [actions]);


  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smooth target rotations
    const targetRotation = new THREE.Euler(0, 0, 0);
    const targetPosition = new THREE.Vector3(0, -0.4, 0); // Base position - adjusted to center model better
    const time = state.clock.getElapsedTime();

    // Base looking direction (eyeOffset gives us dx/dy based on cursor)
    targetRotation.y = (eyeOffset.dx / 10) * 0.3;
    targetRotation.x = (eyeOffset.dy / 10) * 0.2;

    if (isDragging) {
      targetRotation.z = Math.sin(time * 15) * 0.2; // Wiggle when dragged
      targetRotation.x += 0.2;
      targetPosition.y = 0; // Lift up slightly
    } else if (isFalling) {
      targetRotation.z = time * 10; // Spin while falling!
    } else if (isWalking) {
      // Face the direction of walking
      targetRotation.y += facingRight ? Math.PI / 2 : -Math.PI / 2;
      // Very strong bobbing and waddling animation so it's obviously moving
      targetPosition.y = -0.4 + Math.abs(Math.sin(time * 15)) * 0.3;
      targetRotation.z = Math.sin(time * 15) * 0.4; // Rock side to side strongly
      targetRotation.x = Math.sin(time * 15) * 0.1; // Lean forward/back
    } else if (mood === 'sleepy' || mood === 'charging') {
      targetRotation.x = 0.3; // Nodding off
      targetPosition.y = -0.6;
    } else if (mood === 'dizzy') {
      targetRotation.y = time * 5; // Spin slowly
    } else if (mood === 'excited' || mood === 'waving') {
      targetPosition.y = -0.4 + Math.abs(Math.sin(time * 15)) * 0.2;
    } else if (mood === 'peeking') {
      targetRotation.y = facingRight ? Math.PI / 2 : -Math.PI / 2;
    }
    
    // Smooth damp towards target
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotation.x, 5, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotation.y, 5, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetRotation.z, 5, delta);
    
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetPosition.x, 5, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetPosition.y, 5, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetPosition.z, 5, delta);
    
    // Apply Morph Targets (Expressions) and hide extra characters
    scene.traverse((node: any) => {
      // Hide the black and green SSRBs (they use names starting with Object_10, 11, 16)
      if (node.isMesh && (node.name.startsWith('Object_10') || node.name.startsWith('Object_11') || node.name.startsWith('Object_16'))) {
        node.visible = false;
      }
      
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
        
        if (targetIndex >= 0 && targetIndex < node.morphTargetInfluences.length) {
           node.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(node.morphTargetInfluences[targetIndex], 1, delta * 15);
        }
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      {/* Adjusted scale so it fits nicely on the screen */}
      <group rotation={[0, 0, 0]}>
        <primitive object={scene} scale={3} position={[0, -0.4, 0]} />
      </group>
    </group>
  );
}

// Preload to avoid jitter
useGLTF.preload('/Karakter/ssrbs_2.0_hololive.glb');

export const ArcadeMascot: React.FC<ArcadeMascotProps> = () => {
  // ─── STATE ───
  const [mood, setMood] = useState<MascotMood>('happy');
  const [isHovered, setIsHovered] = useState(false);
  const [nearbyElementContext, setNearbyElementContext] = useState<string | null>(null);
  
  // Position & Movement
  const [pos, setPos] = useState({ x: -1000, y: -1000 }); 
  const [targetPos, setTargetPos] = useState<{x: number, y: number} | null>(null);
  const [facingRight, setFacingRight] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  
  // Cursor Tracking for Parallax
  const [eyeOffset, setEyeOffset] = useState({ dx: 0, dy: 0 });
  
  // Dragging & Physics
  const [isDragging, setIsDragging] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
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
  
  const homeBasePos = { x: 40, y: window.innerHeight - 170 };

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
      // 70% chance to walk somewhere randomly, 30% to just change mood
      if (Math.random() > 0.3) {
         const rx = Math.max(50, Math.random() * (window.innerWidth - 250));
         const ry = Math.max(50, Math.random() * (window.innerHeight - 250));
         
         setTargetPos({ x: rx, y: ry });
         setFacingRight(rx > pos.x);
         setIsWalking(true);
         setMood(Math.random() > 0.5 ? 'happy' : 'excited');
         setNearbyElementContext(null);
         try { soundFx.playMoveWhirr(); } catch(e) {}
      } else {
        const actions: MascotMood[] = ['sitting', 'sleepy', 'happy', 'thinking', 'waving'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        setMood(action);
      }
    }, 4000 + Math.random() * 3000); // 4 to 7 seconds interval
  };

  useEffect(() => {
    // Start at home base
    setPos({ x: homeBasePos.x, y: homeBasePos.y });
    setMood('charging');
    
    const resizeHandler = () => {
      homeBasePos.y = window.innerHeight - 170;
    };
    window.addEventListener('resize', resizeHandler);
    
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // ─── Cursor wake-up & Parallax ───
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      resetIdleTimer();
      if (!mascotRef.current || isDragging || isFalling || isRecovering || isWalking) return;
      
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
  }, [isDragging, isFalling, isRecovering, isWalking, mood, facingRight]);

  // ─── Click-to-Walk ───
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      resetIdleTimer();
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('#mascot-container') || target.closest('#home-base-container')) {
        return;
      }
      
      if (isDragging || isFalling) return;
      
      const tx = e.clientX - 100; 
      const ty = e.clientY - 120; 
      
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
    
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...pos };
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocities.current = [];
    shakeCount.current = 0;
    
    mascotRef.current?.setPointerCapture(e.pointerId);
    soundFx.playMoveWhirr();
    setMood('surprised');
    
    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const now = performance.now();
    const dt = now - lastMousePos.current.time;
    if (dt > 0) {
      const vx = (e.clientX - lastMousePos.current.x) / dt;
      const vy = (e.clientY - lastMousePos.current.y) / dt;
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
      }
    }
    
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

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
    if (pos.x < -10) {
      setPos(p => ({ ...p, x: -30 }));
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
        className="fixed z-50 select-none touch-none"
        style={{ 
          left: pos.x,
          top: pos.y,
          width: 200,
          height: 240
        }}
      >
        <div className="relative w-full h-full group flex flex-col items-center justify-end">
          
          {/* ── SPEECH BUBBLE ── */}
          <div 
            className={`absolute top-12 bg-white/90 backdrop-blur text-slate-800 text-xs font-medium px-4 py-2 rounded-2xl rounded-bl-sm shadow-xl border border-white/50 transition-all duration-300 origin-bottom-left z-10 
              ${(isHovered || mood === 'thinking' || mood === 'excited' || mood === 'angry') && !isDragging && !isFalling && !isPeeking ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
            `}
            style={{ width: 'max-content', left: '75%' }}
          >
            {mood === 'happy' && 'Halo! 👋'}
            {mood === 'excited' && 'YAY! Keren banget! ✨'}
            {mood === 'thinking' && (nearbyElementContext || 'Hmm... menarik nih 🤔')}
            {mood === 'angry' && 'HENTIKAN! 💢'}
            {mood === 'dizzy' && 'Pusing pusing pusing 😵‍💫'}
            {mood === 'sad' && 'Jangan pergi... 💧'}
            {mood === 'surprised' && 'WAAA! 😲'}
            {mood === 'love' && 'Aku suka ini! ♥️'}
            {mood === 'shy' && 'A-aku malu... 👉👈'}
            {mood === 'sleepy' && 'Zzz... cape nih'}
            {mood === 'sitting' && 'Lagi istirahat bentar...'}
            {mood === 'waving' && 'Halo halo! Sini main! 👋'}
            {mood === 'charging' && 'Mengisi daya... ⚡'}
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
            title="Penta Mascot 3D"
            style={{
               clipPath: isPeeking ? 'inset(0 0 0 50%)' : 'none',
               transform: isPeeking ? 'translateX(-30px)' : 'none'
            }}
          >
            <Canvas camera={{ position: [0, 1, 5], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-5, 5, 5]} intensity={0.5} />
              
              <MascotModel 
                mood={mood}
                isDragging={isDragging}
                isFalling={isFalling}
                isWalking={isWalking}
                facingRight={facingRight}
                eyeOffset={eyeOffset}
              />
              
              {/* Subtle drop shadow underneath the 3D model */}
              <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={5} blur={2} far={4} />
            </Canvas>
          </div>
        </div>
      </div>
    </>
  );
};
