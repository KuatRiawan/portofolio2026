import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ProjectCapsule, ClawState, CapsulePhysics } from '../types/portfolio';
import { soundFx } from '../services/soundEffects';

interface ZeroGravityCanvasProps {
  projects: ProjectCapsule[];
  clawState: ClawState;
  onClawMove: (x: number, y: number) => void;
  onCapsuleCaught: (project: ProjectCapsule) => void;
  targetProjectCode?: string;
}

export const ZeroGravityCanvas: React.FC<ZeroGravityCanvasProps> = ({
  projects,
  clawState,
  onClawMove,
  onCapsuleCaught,
  targetProjectCode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store capsule physics state
  const capsulesRef = useRef<CapsulePhysics[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [hoveredCapsule, setHoveredCapsule] = useState<ProjectCapsule | null>(null);

  // Initialize capsule positions inside zero-g chamber
  useEffect(() => {
    const initialCapsules: CapsulePhysics[] = projects.map((p, index) => {
      // Space out around center
      const angle = (index / projects.length) * Math.PI * 2;
      const dist = 120 + Math.random() * 80;
      return {
        id: p.id,
        x: 0.5 + (Math.cos(angle) * dist) / 600,
        y: 0.5 + (Math.sin(angle) * dist) / 500,
        vx: (Math.random() - 0.5) * 0.0015,
        vy: (Math.random() - 0.5) * 0.0015,
        radius: p.id === 'nuraga' ? 34 : 28,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        isGrabbed: false
      };
    });
    capsulesRef.current = initialCapsules;
  }, [projects]);

  // Main Render & Physics Loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp drawing
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Zero-G Chamber Background Grid & Reflections
    ctx.clearRect(0, 0, width, height);

    // Dark sleek glass chamber background gradient
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 50,
      width * 0.5, height * 0.5, width * 0.7
    );
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.6, '#090d16');
    bgGrad.addColorStop(1, '#030712');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines on back glass wall
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Floating Zero-G Ambient Dust Particles
    const time = Date.now() * 0.001;
    for (let i = 0; i < 25; i++) {
      const px = (Math.sin(i * 1.7 + time * 0.5) * 0.5 + 0.5) * width;
      const py = (Math.cos(i * 2.3 + time * 0.3) * 0.45 + 0.5) * height;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.3)' : 'rgba(168, 85, 247, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Prize Drop Chute at Bottom-Left Corner
    const chuteWidth = 110;
    const chuteHeight = 90;
    const chuteX = 25;
    const chuteY = height - chuteHeight - 15;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(chuteX, chuteY, chuteWidth, chuteHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Chute neon label
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 10px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRIZE HATCH', chuteX + chuteWidth / 2, chuteY + 24);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Outfit, sans-serif';
    ctx.fillText('DROP TARGET', chuteX + chuteWidth / 2, chuteY + 42);

    // Glowing laser border in chute
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(chuteX + 10, chuteY + 50, chuteWidth - 20, 28);
    ctx.setLineDash([]);

    // 4. Update & Render Floating Project Capsules
    const clawPixelX = clawState.x * width;
    const clawPixelY = clawState.y * height;

    capsulesRef.current.forEach((capPhysics) => {
      const proj = projects.find((p) => p.id === capPhysics.id);
      if (!proj) return;

      // If grabbed by claw, latch directly onto claw tip
      if (capPhysics.isGrabbed && clawState.hasCapsule) {
        capPhysics.x = clawState.x;
        capPhysics.y = clawState.y + 0.08;
        capPhysics.vx = 0;
        capPhysics.vy = 0;
      } else {
        // Zero-G buoyant movement & subtle drifting
        capPhysics.pulsePhase += 0.03;
        capPhysics.rotation += capPhysics.vRot;

        // Apply zero-g buoyancy wobble
        capPhysics.vx += Math.sin(time + capPhysics.pulsePhase) * 0.00008;
        capPhysics.vy += Math.cos(time * 0.9 + capPhysics.pulsePhase) * 0.00008;

        // Damping (space drag)
        capPhysics.vx *= 0.992;
        capPhysics.vy *= 0.992;

        // Move position
        capPhysics.x += capPhysics.vx;
        capPhysics.y += capPhysics.vy;

        // Wall collisions (bounce softly)
        const radX = capPhysics.radius / width;
        const radY = capPhysics.radius / height;

        if (capPhysics.x - radX < 0.06) {
          capPhysics.x = 0.06 + radX;
          capPhysics.vx *= -0.8;
        }
        if (capPhysics.x + radX > 0.94) {
          capPhysics.x = 0.94 - radX;
          capPhysics.vx *= -0.8;
        }
        if (capPhysics.y - radY < 0.12) {
          capPhysics.y = 0.12 + radY;
          capPhysics.vy *= -0.8;
        }
        if (capPhysics.y + radY > 0.88) {
          capPhysics.y = 0.88 - radY;
          capPhysics.vy *= -0.8;
        }
      }

      // Check distance to claw beam when claw is lowering / grabbing
      const capPixelX = capPhysics.x * width;
      const capPixelY = capPhysics.y * height;
      const distToClaw = Math.hypot(capPixelX - clawPixelX, capPixelY - (clawPixelY + 30));

      if (clawState.isGrabbing && !clawState.hasCapsule && distToClaw < capPhysics.radius + 35) {
        // Suction capture!
        capPhysics.isGrabbed = true;
        clawState.hasCapsule = true;
        clawState.grabbedCapsuleId = proj.id;
        soundFx.playVictoryFanfare();

        // Trigger capture callback after breve delay when returned to prize hatch
      }

      // Render Capsule Body
      ctx.save();
      ctx.translate(capPixelX, capPixelY);

      // Glowing aura
      const isTarget = targetProjectCode && proj.code.toLowerCase().includes(targetProjectCode.toLowerCase());
      const pulseGlow = Math.sin(capPhysics.pulsePhase) * 6 + 18;

      const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, capPhysics.radius + pulseGlow);
      glowGrad.addColorStop(0, proj.glowColor);
      glowGrad.addColorStop(0.7, proj.glowColor.replace('0.8', '0.2'));
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, capPhysics.radius + pulseGlow, 0, Math.PI * 2);
      ctx.fill();

      // Capsule shape container
      ctx.rotate(capPhysics.rotation);

      if (proj.shape === 'sphere') {
        // Glass Sphere Capsule
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = isTarget ? 3.5 : 2;
        ctx.beginPath();
        ctx.arc(0, 0, capPhysics.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner core glow
        ctx.fillStyle = proj.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, capPhysics.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      } else if (proj.shape === 'cube') {
        // Holographic Cube Capsule
        const side = capPhysics.radius * 1.6;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = isTarget ? 3.5 : 2;
        ctx.beginPath();
        ctx.roundRect(-side / 2, -side / 2, side, side, 8);
        ctx.fill();
        ctx.stroke();
      } else if (proj.shape === 'octahedron') {
        // Diamond / Octahedron shape
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = isTarget ? 3.5 : 2;
        ctx.beginPath();
        const r = capPhysics.radius * 1.1;
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Hologram Sphere with ring
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, capPhysics.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Outer saturn ring
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, capPhysics.radius * 1.5, capPhysics.radius * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore(); // Undo rotation for text label alignment

      // Render Text Badge on top of capsule
      ctx.save();
      ctx.translate(capPixelX, capPixelY);

      // Label background pill
      ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
      ctx.strokeStyle = proj.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-42, -capPhysics.radius - 18, 84, 16, 8);
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 8.5px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(proj.code, 0, -capPhysics.radius - 6);

      // Subtext miniature
      ctx.fillStyle = proj.color;
      ctx.font = 'bold 9px Outfit, sans-serif';
      ctx.fillText(proj.category, 0, 4);

      ctx.restore();
    });

    // 5. Check if claw with grabbed capsule reached Prize Hatch
    if (clawState.hasCapsule && clawState.grabbedCapsuleId) {
      const distToChute = Math.hypot(clawPixelX - (chuteX + chuteWidth / 2), clawPixelY - (chuteY + 30));
      if (distToChute < 60) {
        const caughtProj = projects.find((p) => p.id === clawState.grabbedCapsuleId);
        if (caughtProj) {
          onCapsuleCaught(caughtProj);
        }
        clawState.hasCapsule = false;
        clawState.grabbedCapsuleId = null;
      }
    }

    // 6. Render Magnetic Gantry & Claw Mechanism
    // Top Gantry Magnetic Rail
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, 18);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(0, 16, width, 3);
    ctx.shadowBlur = 0;

    // Motor Carriage sliding X
    const carriageWidth = 60;
    const carriageHeight = 24;
    const carriageX = clawPixelX - carriageWidth / 2;

    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(carriageX, 4, carriageWidth, carriageHeight, 4);
    ctx.fill();
    ctx.stroke();

    // LED status light on carriage
    ctx.fillStyle = clawState.isGrabbing ? '#ec4899' : '#00f0ff';
    ctx.beginPath();
    ctx.arc(clawPixelX, 16, 4, 0, Math.PI * 2);
    ctx.fill();

    // Coiled cable extending down to claw head
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(clawPixelX, carriageHeight + 4);

    const segments = 12;
    const cableLength = clawPixelY - (carriageHeight + 4);
    for (let s = 0; s <= segments; s++) {
      const cy = (carriageHeight + 4) + (s / segments) * cableLength;
      const cx = clawPixelX + (s % 2 === 0 ? 6 : -6);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(clawPixelX, clawPixelY);
    ctx.stroke();

    // Claw Tractor Beam Field when lowering/grabbing
    if (clawState.beamActive || clawState.isLowering || clawState.isGrabbing) {
      const beamGrad = ctx.createLinearGradient(clawPixelX, clawPixelY, clawPixelX, height);
      beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
      beamGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.2)');
      beamGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(clawPixelX - 15, clawPixelY + 20);
      ctx.lineTo(clawPixelX + 15, clawPixelY + 20);
      ctx.lineTo(clawPixelX + 65, height);
      ctx.lineTo(clawPixelX - 65, height);
      ctx.closePath();
      ctx.fill();
    }

    // Claw Head Base Hub
    ctx.save();
    ctx.translate(clawPixelX, clawPixelY);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner glowing power core
    ctx.fillStyle = clawState.hasCapsule ? '#ec4899' : '#00f0ff';
    ctx.shadowColor = clawState.hasCapsule ? '#ec4899' : '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3 Metallic Mechanical Prongs
    const prongAngleOffset = clawState.isOpen ? 0.35 : 0.08;

    [-0.6 + prongAngleOffset, 0, 0.6 - prongAngleOffset].forEach((angle) => {
      ctx.save();
      ctx.rotate(angle);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(angle > 0 ? 12 : angle < 0 ? -12 : 0, 32);
      ctx.lineTo(angle > 0 ? 6 : angle < 0 ? -6 : 0, 48);
      ctx.stroke();

      // Energy tip at prong tip
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(angle > 0 ? 6 : angle < 0 ? -6 : 0, 48, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();

    // 7. Glass Cabinet Reflection Lines & Frame Edge Lights
    // Left & Right LED Neon Strips
    const edgeGlow = Math.sin(time * 3) * 0.2 + 0.8;
    ctx.strokeStyle = `rgba(0, 240, 255, ${edgeGlow})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // Glass sheen light reflection overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, 0);
    ctx.lineTo(width * 0.6, 0);
    ctx.lineTo(width * 0.1, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Request next animation loop frame
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [projects, clawState, targetProjectCode, onCapsuleCaught]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderFrame]);

  // Handle Mouse Hover / Tap interaction on canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check if hovering over floating capsule
    const found = projects.find((p) => {
      const capPhys = capsulesRef.current.find((cp) => cp.id === p.id);
      if (!capPhys) return false;
      const dist = Math.hypot(mx - capPhys.x * rect.width, my - capPhys.y * rect.height);
      return dist < capPhys.radius + 10;
    });

    setHoveredCapsule(found || null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const normX = Math.max(0.1, Math.min(0.9, mx / rect.width));
    const normY = Math.max(0.2, Math.min(0.8, my / rect.height));

    onClawMove(normX, normY);
    soundFx.playMoveWhirr();
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-[0_0_50px_rgba(0,240,255,0.15)] group">
      {/* HTML5 Canvas Physics Engine */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Floating Hover Card Tooltip */}
      {hoveredCapsule && (
        <div className="absolute top-4 right-4 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-400/50 p-3 rounded-xl shadow-2xl max-w-xs transition-all duration-200">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: hoveredCapsule.color }}
            />
            <span className="text-xs font-orbitron font-bold text-cyan-300">
              {hoveredCapsule.code}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white mt-1">{hoveredCapsule.title}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{hoveredCapsule.description}</p>
          <div className="mt-2 text-[10px] text-cyan-400 font-mono">
            Click to aim magnetic claw 🎯
          </div>
        </div>
      )}

      {/* Top Glass Header Overlay */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-950/80 backdrop-blur-sm border-b border-cyan-500/20 px-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-orbitron font-bold text-cyan-400 tracking-wider">
            ZERO-G CHAMBER // MAGNETIC REACTION FIELD
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          STATUS: <span className="text-emerald-400">ACTIVE LEVITATION</span>
        </div>
      </div>
    </div>
  );
};
