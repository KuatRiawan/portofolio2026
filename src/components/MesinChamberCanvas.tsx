import React, { useEffect, useRef, useState } from 'react';
import type { ProjectCapsule, ClawState, GuestMessage } from '../types/portfolio';
import { useApp } from '../context/AppContext';
import { soundFx } from '../services/soundEffects';

interface ItemPhysics {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRotation: number;
  rotationVel: number;
  type: 'project' | 'guest';
  project?: ProjectCapsule;
  guestMessage?: GuestMessage;
}

interface MesinChamberCanvasProps {
  projects: ProjectCapsule[];
  clawState: ClawState;
  onClawMove: (x: number, y: number) => void;
  onClawHitBall?: (hitY?: number) => void;
  onCapsuleCaught: (project: ProjectCapsule) => void;
  onGuestMessageCaught?: (guestMessage: GuestMessage) => void;
  caughtProjectIds: string[];
  shakeCount?: number;
}

export const MesinChamberCanvas: React.FC<MesinChamberCanvasProps> = ({
  projects,
  clawState,
  onClawMove: _onClawMove,
  onClawHitBall,
  onCapsuleCaught,
  onGuestMessageCaught,
  caughtProjectIds,
  shakeCount = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<ItemPhysics[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const smoothClawRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.14 });
  const shakeTimerRef = useRef<number>(0);
  const prevShakeCountRef = useRef<number>(shakeCount);

  // Phone Gyroscope / Tilt Sensor Ref & State
  const tiltXRef = useRef<number>(0);
  const [, setIsGyroActive] = useState<boolean>(false);

  const clawStateRef = useRef<ClawState>(clawState);
  const grabbedProjectRef = useRef<ProjectCapsule | null>(null);

  const { guestMessages } = useApp();
  const guestMessagesCountRef = useRef(guestMessages.length);
  // Track which guest message IDs have already been caught so they don't reappear
  const caughtGuestIdsRef = useRef<Set<string>>(new Set());

  // Helper to request iOS Motion & Orientation permissions on user interaction
  const requestSensorPermission = () => {
    if (typeof window === 'undefined') return;

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission().then((res) => {
        if (res === 'granted') setIsGyroActive(true);
      }).catch(() => {});
    }

    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission().catch(() => {});
    }
  };

  // Device Orientation (Phone Tilt Gyroscope Sensor) Listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.gamma !== undefined) {
        const tilt = Math.max(-1, Math.min(1, e.gamma / 25));
        tiltXRef.current = tilt;
        if (Math.abs(e.gamma) > 3) {
          setIsGyroActive(true);
        }
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Device Motion Sensor Listener for Physical Phone Shaking (Kocok HP)
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastTime = Date.now();

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 90) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;

        const speed = (Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime) * 10000;

        if (speed > 750) {
          // Physical Phone Shake detected -> Toss balls upward!
          itemsRef.current.forEach((item) => {
            item.vy = -(0.06 + Math.random() * 0.09);
            item.vx = (Math.random() - 0.5) * 0.08;
            item.rotationVel = (Math.random() - 0.5) * 0.15;
          });
          soundFx.playMoveWhirr();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  useEffect(() => {
    clawStateRef.current = clawState;

    // Trigger prize reward when claw reaches hatch and opens prongs
    if (clawState.isOpen && !clawState.isGrabbing && grabbedProjectRef.current) {
      const proj = grabbedProjectRef.current;
      grabbedProjectRef.current = null;
      clawStateRef.current.hasCapsule = false;
      clawStateRef.current.grabbedCapsuleId = null;
      
      if ('message' in proj) {
        // Mark this guest message as permanently caught so it won't reappear
        caughtGuestIdsRef.current.add(proj.id);
        // Remove from canvas items
        itemsRef.current = itemsRef.current.filter((item) => item.id !== proj.id);
        
        // Caught a guest message
        if (onGuestMessageCaught) {
          onGuestMessageCaught(proj as unknown as GuestMessage);
        } else {
          setTimeout(() => {
            alert(`Pesan Tamu ditangkap!\nDari: ${(proj as any).name}\n\n"${(proj as any).message}"`);
          }, 500);
        }
      } else {
        onCapsuleCaught(proj as ProjectCapsule);
      }
    }
  }, [clawState, onCapsuleCaught]);

  const caughtIdsKey = caughtProjectIds.join(',');

  // Initialize ALL 15 Project Capsules resting ON THE FLOOR PILE
  useEffect(() => {
    const remainingProjects = projects.filter(
      (p) => !caughtProjectIds.includes(p.id) || grabbedProjectRef.current?.id === p.id
    );
    const existingMap = new Map(itemsRef.current.map((item) => [item.id, item]));

    const itemsPerRow = 5;

    const updatedItems: ItemPhysics[] = remainingProjects.map((proj, idx) => {
      const existing = existingMap.get(proj.id);
      if (existing) {
        return existing;
      }

      const row = Math.floor(idx / itemsPerRow);
      const col = idx % itemsPerRow;

      const baseY = 0.80 - row * 0.055;
      const rowOffset = (row % 2) * 0.06;
      const baseX = 0.16 + col * 0.16 + rowOffset;

      return {
        id: proj.id,
        x: Math.max(0.12, Math.min(0.88, baseX)),
        y: Math.max(0.60, Math.min(0.80, baseY)),
        vx: 0,
        vy: 0,
        baseRotation: (idx % 2 === 0 ? 1 : -1) * (0.04 + (idx % 3) * 0.03),
        rotationVel: 0,
        type: 'project' as const,
        project: proj
      };
    });

    // Preserve guest messages that are currently in the chamber
    const guestItems = itemsRef.current.filter((item) => item.type === 'guest');
    const existingGuestIds = new Set(guestItems.map(g => g.id));

    // Add guest messages that exist in state but aren't in the canvas yet (happens if fetched before mount)
    const initialGuestItems = guestMessages
      .filter(msg => !existingGuestIds.has(msg.id) && !caughtGuestIdsRef.current.has(msg.id))
      .map((msg) => ({
        id: msg.id,
        x: Math.max(0.2, Math.min(0.8, 0.2 + Math.random() * 0.6)),
        y: Math.max(0.5, Math.min(0.8, 0.5 + Math.random() * 0.3)),
        vx: 0,
        vy: 0,
        baseRotation: Math.random() * Math.PI,
        rotationVel: 0,
        type: 'guest' as const,
        guestMessage: msg
      }));

    itemsRef.current = [...updatedItems, ...guestItems, ...initialGuestItems];
  }, [projects, caughtIdsKey]); // we deliberately don't add guestMessages here so it only runs on mount or project changes

  // Handle new guest messages dropping in
  useEffect(() => {
    if (guestMessages.length > guestMessagesCountRef.current) {
      const newMessages = guestMessages.slice(guestMessagesCountRef.current);
      
      newMessages.forEach((msg) => {
        itemsRef.current.push({
          id: msg.id,
          x: 0.3 + Math.random() * 0.4,
          y: -0.1, // Drop from above
          vx: (Math.random() - 0.5) * 0.05,
          vy: 0,
          baseRotation: Math.random() * Math.PI,
          rotationVel: (Math.random() - 0.5) * 0.2,
          type: 'guest',
          guestMessage: msg
        });
      });
      
      guestMessagesCountRef.current = guestMessages.length;
      soundFx.playMoveWhirr(); // Sound when dropping
    }
  }, [guestMessages]);

  // Handle SHAKE event trigger (KOCOK MESIN button)
  useEffect(() => {
    if (shakeCount > prevShakeCountRef.current) {
      prevShakeCountRef.current = shakeCount;
      shakeTimerRef.current = 45;

      itemsRef.current.forEach((item) => {
        item.vy = -(0.06 + Math.random() * 0.09);
        item.vx = (Math.random() - 0.5) * 0.08;
        item.rotationVel = (Math.random() - 0.5) * 0.15;
      });
    }
  }, [shakeCount]);

  // Main 60 FPS Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getVibrantColor = (idx: number, color?: string) => {
      const defaultColors = [
        '#ff4757',
        '#ff9f43',
        '#00d2d3',
        '#10ac84',
        '#5f27cd',
        '#ff6b81',
        '#54a0ff',
        '#feca57'
      ];
      return color || defaultColors[idx % defaultColors.length];
    };

    const render = () => {
      try {
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth || 360;
        const height = canvas.clientHeight || 460;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
        }

        const currentClawState = clawStateRef.current;

        ctx.save();
        ctx.scale(dpr, dpr);

        // Screen Shake Offset when shaking
        let shakeOffsetX = 0;
        let shakeOffsetY = 0;
        if (shakeTimerRef.current > 0) {
          shakeTimerRef.current -= 1;
          shakeOffsetX = (Math.random() - 0.5) * 10;
          shakeOffsetY = (Math.random() - 0.5) * 10;
        }
        ctx.translate(shakeOffsetX, shakeOffsetY);

        ctx.clearRect(-20, -20, width + 40, height + 40);

        // 1. Bright & Clean Arcade Chamber Sky Blue Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#c7d2fe');
        bgGrad.addColorStop(0.3, '#bae6fd');
        bgGrad.addColorStop(0.8, '#e0f2fe');
        bgGrad.addColorStop(1, '#f0f9ff');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(-10, -10, width + 20, height + 20);

        // Glass reflections on cabinet sides
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(45, 0);
        ctx.lineTo(15, height);
        ctx.lineTo(0, height);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width - 45, 0);
        ctx.lineTo(width - 15, height);
        ctx.lineTo(width, height);
        ctx.fill();

        // Floor Platform
        const floorGrad = ctx.createLinearGradient(0, height * 0.83, 0, height);
        floorGrad.addColorStop(0, '#cbd5e1');
        floorGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(-10, height * 0.84, width + 20, height * 0.16 + 10);

        // Floor Rim Highlight Line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.84);
        ctx.lineTo(width, height * 0.84);
        ctx.stroke();

        // 2. Smooth Claw Position Interpolation
        smoothClawRef.current.x += (currentClawState.x - smoothClawRef.current.x) * 0.12;
        smoothClawRef.current.y += (currentClawState.y - smoothClawRef.current.y) * 0.12;

        const clawPixelX = smoothClawRef.current.x * width;
        const clawPixelY = smoothClawRef.current.y * height;

        // Laser Aim Beam from Claw to Floor
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(clawPixelX, clawPixelY + 20);
        ctx.lineTo(clawPixelX, height * 0.84);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Floor Laser Dot
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(clawPixelX, height * 0.84, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Sub-step Physics Simulation for Rigid Body Balls
        const items = itemsRef.current;
        const subSteps = 2;
        const radius = Math.min(24, Math.max(16, width * 0.052));

        for (let step = 0; step < subSteps; step++) {
          items.forEach((item, i) => {
            if (currentClawState.hasCapsule && currentClawState.grabbedCapsuleId === item.id) {
              item.x = smoothClawRef.current.x;
              item.y = smoothClawRef.current.y + 0.12;
              item.vx = 0;
              item.vy = 0;
              return;
            }

            // Phone Gyroscope / Tilt sensor force (Roll balls left or right)
            if (tiltXRef.current !== 0) {
              item.vx += (tiltXRef.current * 0.0035) / subSteps;
              item.rotationVel += (tiltXRef.current * 0.01) / subSteps;
            }

            // Gravity
            item.vy += 0.0015;
            item.x += item.vx / subSteps;
            item.y += item.vy / subSteps;
            item.baseRotation += item.rotationVel / subSteps;

            // Friction
            item.vx *= 0.98;
            item.vy *= 0.98;
            item.rotationVel *= 0.95;

            // Floor boundary
            const floorY = 0.80;
            if (item.y > floorY) {
              item.y = floorY;
              item.vy = -item.vy * 0.2;
              item.vx *= 0.8;
            }

            // Left/Right Walls
            if (item.x < 0.12) {
              item.x = 0.12;
              item.vx = -item.vx * 0.4;
            }
            if (item.x > 0.88) {
              item.x = 0.88;
              item.vx = -item.vx * 0.4;
            }

            // Circle-to-Circle Anti-Overlap Collision Resolution
            for (let j = i + 1; j < items.length; j++) {
              const other = items[j];
              if (currentClawState.hasCapsule && currentClawState.grabbedCapsuleId === other.id) continue;

              const dx = (other.x - item.x) * width;
              const dy = (other.y - item.y) * height;
              const dist = Math.hypot(dx, dy);
              const minDist = radius * 2 + 1;

              if (dist > 0 && dist < minDist) {
                const overlap = (minDist - dist) / dist;
                const pushX = (dx * overlap * 0.5) / width;
                const pushY = (dy * overlap * 0.5) / height;

                item.x -= pushX;
                item.y -= pushY;
                other.x += pushX;
                other.y += pushY;

                // Transfer velocity
                const tempVx = item.vx;
                const tempVy = item.vy;
                item.vx = other.vx * 0.5;
                item.vy = other.vy * 0.5;
                other.vx = tempVx * 0.5;
                other.vy = tempVy * 0.5;
              }
            }
          });
        }

        // 4. Render Authentic Japanese Gachapon 3D Capsules (No ground shadow)
        items.forEach((item, idx) => {
          const ix = item.x * width;
          const iy = item.y * height;

          ctx.save();
          ctx.translate(ix, iy);
          ctx.rotate(item.baseRotation);

          const capRad = radius + 1;
          const themeColor = item.type === 'guest' && item.guestMessage 
            ? item.guestMessage.color 
            : getVibrantColor(idx, item.project?.color);

          // 1. TOP HALF DOME - High-Gloss Vibrant Color Plastic
          ctx.fillStyle = themeColor;
          ctx.beginPath();
          ctx.arc(0, 0, capRad, Math.PI, Math.PI * 2);
          ctx.fill();

          // 2. BOTTOM HALF DOME - High-Gloss Pearl White Plastic
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(0, 0, capRad, 0, Math.PI);
          ctx.fill();

          // Outer Ball Outline Border
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, capRad, 0, Math.PI * 2);
          ctx.stroke();

          // 3. CENTER BLACK SEAM BAND
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-capRad + 1, -3, (capRad - 1) * 2, 6);

          // 4. CENTER METALLIC SILVER PUSH-BUTTON
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-1, -1, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // 5. Specular Crescent Arc Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.ellipse(-capRad * 0.3, -capRad * 0.5, capRad * 0.4, capRad * 0.15, -0.35, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();

          // Check claw grab suction - Stop lowering immediately on ball contact!
          const distToClaw = Math.hypot(ix - clawPixelX, iy - (clawPixelY + 30));
          if (currentClawState.isGrabbing && currentClawState.isLowering && !currentClawState.hasCapsule && distToClaw < 55) {
            currentClawState.hasCapsule = true;
            currentClawState.grabbedCapsuleId = item.id;
            // Hack for now: if guest, we don't have project. Let's pass a dummy or prevent grab.
            // But we actually WANT them to grab the guest message!
            // Wait, grabbedProjectRef is typed as ProjectCapsule | null. 
            // We can just set grabbedProjectRef.current = item.project || (item.guestMessage as any);
            grabbedProjectRef.current = item.project || (item.guestMessage as any);
            
            // LOCK Y IMMEDIATELY to current smooth claw Y so it CANNOT continue moving down!
            currentClawState.y = smoothClawRef.current.y;
            currentClawState.targetY = smoothClawRef.current.y;
            currentClawState.isLowering = false;
            currentClawState.isOpen = false;

            soundFx.playVictoryFanfare();
            if (onClawHitBall) {
              onClawHitBall(smoothClawRef.current.y);
            }
          }
        });

        // 5. HIGH-TECH METALLIC ROBOTIC STEEL CLAW MECHANISM
        // Responsive Claw Scaling for Mobile screens
        const clawScale = Math.min(1.0, Math.max(0.72, width / 520));

        // Top Steel Cable
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4 * clawScale;
        ctx.beginPath();
        ctx.moveTo(clawPixelX, 0);
        ctx.lineTo(clawPixelX, clawPixelY);
        ctx.stroke();

        ctx.save();
        ctx.translate(clawPixelX, clawPixelY);
        ctx.scale(clawScale, clawScale);

        if (currentClawState.hasCapsule || currentClawState.isGrabbing) {
          const grabGlow = ctx.createRadialGradient(0, 30, 5, 0, 30, 50);
          grabGlow.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
          grabGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
          grabGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = grabGlow;
          ctx.beginPath();
          ctx.arc(0, 30, 50, 0, Math.PI * 2);
          ctx.fill();
        }

        // Heavy Metallic Top Motor Housing Cylinder
        const motorGrad = ctx.createLinearGradient(-24, 0, 24, 0);
        motorGrad.addColorStop(0, '#334155');
        motorGrad.addColorStop(0.3, '#94a3b8');
        motorGrad.addColorStop(0.6, '#cbd5e1');
        motorGrad.addColorStop(0.9, '#475569');

        ctx.fillStyle = motorGrad;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-24, -18, 48, 30, 10);
        } else {
          ctx.rect(-24, -18, 48, 30);
        }
        ctx.fill();
        ctx.stroke();

        // LED Lamp Indicator
        ctx.fillStyle = currentClawState.isGrabbing ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, -3, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Piston block
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-10, 12, 20, 8);

        // 2 Steel Prongs
        const isOpen = currentClawState.isOpen;
        const prongs = [
          { startX: -12, dir: -1, openAngle: isOpen ? 16 : 3 },
          { startX: 12, dir: 1, openAngle: isOpen ? 16 : 3 }
        ];

        prongs.forEach((p) => {
          ctx.save();
          ctx.translate(p.startX, 16);

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 5.5;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            p.dir * (20 + p.openAngle), 
            22, 
            p.dir * (5 - (isOpen ? 2 : 0)), 
            44
          );
          ctx.stroke();

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.dir * (5 - (isOpen ? 2 : 0)), 44, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        ctx.restore();
        ctx.restore();
      } catch (err) {
        console.error('Canvas render error:', err);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [onCapsuleCaught, onClawHitBall]);

  // Touch & Click on canvas request iOS sensor permissions ONLY (Does NOT move claw - Joystick ONLY navigation)
  const handleCanvasClick = () => {
    requestSensorPermission();
  };

  const handleTouchMove = () => {
    requestSensorPermission();
  };

  const [showTiltHint, setShowTiltHint] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTiltHint(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[420px] xs:h-[460px] sm:h-[480px] md:h-[520px] lg:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-slate-300 bg-sky-200 shadow-xl group">
      {/* Mobile Motion & Tilt Sensor Notification Hint Banner */}
      {showTiltHint && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xs bg-slate-900/95 text-white border-2 border-amber-400 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 animate-bounce">
          <div className="text-xs font-fredoka font-bold">
            <span className="text-amber-400 block text-[11px] font-black uppercase tracking-wider">SENSOR GERAK HP</span>
            <span className="text-slate-200 text-[10px] leading-tight block">Miringkan atau kocok HP kamu untuk mengacak posisi bola.</span>
          </div>
          <button
            onClick={() => {
              requestSensorPermission();
              setShowTiltHint(false);
            }}
            className="text-slate-400 hover:text-white text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 shrink-0 active:scale-95"
          >
            OK
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        className="w-full h-full cursor-crosshair touch-none"
      />
    </div>
  );
};

