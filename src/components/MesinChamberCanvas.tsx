import React, { useEffect, useRef } from 'react';
import type { ProjectCapsule, ClawState } from '../types/portfolio';
import { soundFx } from '../services/soundEffects';

interface ItemPhysics {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRotation: number;
  rotationVel: number;
  project: ProjectCapsule;
}

interface MesinChamberCanvasProps {
  projects: ProjectCapsule[];
  clawState: ClawState;
  onClawMove: (x: number, y: number) => void;
  onCapsuleCaught: (project: ProjectCapsule) => void;
  caughtProjectIds: string[];
  shakeCount?: number;
}

export const MesinChamberCanvas: React.FC<MesinChamberCanvasProps> = ({
  projects,
  clawState,
  onClawMove,
  onCapsuleCaught,
  caughtProjectIds,
  shakeCount = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<ItemPhysics[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const smoothClawRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.22 });
  const shakeTimerRef = useRef<number>(0);
  const prevShakeCountRef = useRef<number>(shakeCount);

  const clawStateRef = useRef<ClawState>(clawState);
  const grabbedProjectRef = useRef<ProjectCapsule | null>(null);

  useEffect(() => {
    clawStateRef.current = clawState;

    // Trigger prize reward when claw reaches hatch and opens prongs
    if (clawState.isOpen && !clawState.isGrabbing && grabbedProjectRef.current) {
      const proj = grabbedProjectRef.current;
      grabbedProjectRef.current = null;
      clawStateRef.current.hasCapsule = false;
      clawStateRef.current.grabbedCapsuleId = null;
      onCapsuleCaught(proj);
    }
  }, [clawState, onCapsuleCaught]);

  const caughtIdsKey = caughtProjectIds.join(',');

  // Initialize ALL 15 Project Capsules resting ON THE FLOOR PILE (No Floating)
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

      const row = Math.floor(idx / itemsPerRow); // 0 (bottom floor), 1, 2
      const col = idx % itemsPerRow;

      // Floor pile coordinates: Row 0 rests directly at floor y: 0.80
      const baseY = 0.80 - row * 0.075;
      const rowOffset = (row % 2) * 0.06;
      const baseX = 0.16 + col * 0.16 + rowOffset;

      return {
        id: proj.id,
        x: Math.max(0.12, Math.min(0.88, baseX)),
        y: Math.max(0.55, Math.min(0.80, baseY)),
        vx: 0,
        vy: 0,
        baseRotation: (idx % 2 === 0 ? 1 : -1) * (0.04 + (idx % 3) * 0.03),
        rotationVel: 0,
        project: proj
      };
    });

    itemsRef.current = updatedItems;
  }, [projects, caughtIdsKey]);

  // Handle SHAKE event trigger (KOCOK MESIN)
  useEffect(() => {
    if (shakeCount > prevShakeCountRef.current) {
      prevShakeCountRef.current = shakeCount;
      shakeTimerRef.current = 45; // 45 frames of shake vibration (~0.75 sec)

      // Apply explosive upward & sideways velocity to all balls
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
        '#ff4757', // Coral Red
        '#ff9f43', // Warm Gold Orange
        '#00d2d3', // Electric Cyan
        '#10ac84', // Emerald Green
        '#5f27cd', // Deep Purple
        '#ff6b81', // Neon Pink
        '#54a0ff', // Sky Blue
        '#feca57'  // Bright Yellow
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

        // 3. Sub-step Physics Simulation for Rigid Body Balls (Gravity, Bounce & Circle-Circle Anti-Overlap)
        const items = itemsRef.current;
        const subSteps = 2; // Optimized sub-step count for 60 FPS performance
        const radius = 26; // Ball radius in px

        for (let step = 0; step < subSteps; step++) {
          items.forEach((item, i) => {
            if (currentClawState.hasCapsule && currentClawState.grabbedCapsuleId === item.id) {
              item.x = smoothClawRef.current.x;
              item.y = smoothClawRef.current.y + 0.12;
              item.vx = 0;
              item.vy = 0;
              return;
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

            // Floor boundary (yFloor ~ 0.80)
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
              const minDist = radius * 2 + 1; // 53px minimum allowed distance

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

        // 4. Render Authentic Japanese Gachapon 3D Capsules (Two-Tone Color Top, White Bottom, Center Black Seam & Silver Metal Button)
        items.forEach((item, idx) => {
          const ix = item.x * width;
          const iy = item.y * height;

          ctx.save();
          ctx.translate(ix, iy);
          ctx.rotate(item.baseRotation);

          const capRad = 27;
          const themeColor = getVibrantColor(idx, item.project.color);

          // Soft Shadow Under Ball on Floor
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.beginPath();
          ctx.ellipse(0, capRad + 3, capRad * 0.85, 5, 0, 0, Math.PI * 2);
          ctx.fill();

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

          // 4. CENTER METALLIC SILVER PUSH-BUTTON (Tombol Perak Gachapon)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-1, -1, 2, 0, Math.PI * 2);
          ctx.fill();

          // 5. Specular Crescent Arc Highlight (High-Gloss Plastic Shine)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.ellipse(-8, -14, 11, 4, -0.35, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Check claw grab suction
          const distToClaw = Math.hypot(ix - clawPixelX, iy - (clawPixelY + 30));
          if (currentClawState.isGrabbing && !currentClawState.hasCapsule && distToClaw < 60) {
            currentClawState.hasCapsule = true;
            currentClawState.grabbedCapsuleId = item.id;
            grabbedProjectRef.current = item.project;
            soundFx.playVictoryFanfare();
          }
        });

        // 5. HIGH-TECH METALLIC ROBOTIC STEEL CLAW MECHANISM
        // Top Steel Cable
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(clawPixelX, 0);
        ctx.lineTo(clawPixelX, clawPixelY);
        ctx.stroke();

        ctx.save();
        ctx.translate(clawPixelX, clawPixelY);

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

        // Heavy Metallic Top Motor Housing Cylinder (Polished Steel)
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
  }, [onCapsuleCaught]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const normX = Math.max(0.15, Math.min(0.85, mx / rect.width));
    onClawMove(normX, 0.25);
    soundFx.playMoveWhirr();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const normX = Math.max(0.15, Math.min(0.85, touchX / rect.width));
    onClawMove(normX, 0.25);
    soundFx.playMoveWhirr();
  };

  return (
    <div className="relative w-full h-[300px] xs:h-[340px] sm:h-[400px] md:h-[460px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-slate-300 bg-sky-200 shadow-xl group">
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
