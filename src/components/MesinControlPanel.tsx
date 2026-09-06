import React, { useState, useRef } from 'react';
import { FolderGit2 } from 'lucide-react';
import { soundFx } from '../services/soundEffects';
import { useApp } from '../context/AppContext';

interface MesinControlPanelProps {
  onGrabTrigger: () => void;
  onJoystickMove: (dx: number, dy: number) => void;
  onOpenDeskripsiKarya: () => void;
  onResetMachine?: () => void;
  onShakeMachine?: () => void;
  isGrabbing: boolean;
}

export const MesinControlPanel: React.FC<MesinControlPanelProps> = ({
  onGrabTrigger,
  onJoystickMove,
  onOpenDeskripsiKarya,
  onShakeMachine,
  isGrabbing
}) => {
  const { t } = useApp();
  const [joystickTilt, setJoystickTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleJoystickPress = (dx: number, dy: number) => {
    setJoystickTilt({ x: dx * 20, y: dy * 20 });
    onJoystickMove(dx * 0.08, dy * 0.08);
    soundFx.playMoveWhirr();
    setTimeout(() => setJoystickTilt({ x: 0, y: 0 }), 150);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoystickPos(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateJoystickPos(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setJoystickTilt({ x: 0, y: 0 });
  };

  const updateJoystickPos = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = 30;

    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const tiltX = Math.cos(angle) * clampedDist;
    const tiltY = Math.sin(angle) * clampedDist;

    setJoystickTilt({ x: tiltX, y: tiltY });

    const normX = Math.cos(angle) * (clampedDist / maxRadius);
    onJoystickMove(normX * 0.08, 0);
    soundFx.playMoveWhirr();
  };

  return (
    <div className="w-full bg-[#cbd5e1] border-2 sm:border-4 border-slate-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl relative space-y-3 sm:space-y-4 select-none">
      
      {/* Top Arcade Pedestal Surface: Sleek 3D Joystick & CAPIT Button */}
      <div className="bg-[#94a3b8]/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-slate-400 flex items-center justify-between sm:justify-around gap-2 relative">
        
        {/* Center Interactive Joystick Knob with integrated arrow indicators */}
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-400 border-2 sm:border-4 border-slate-500 shadow-inner flex items-center justify-center relative">
            <div
              ref={joystickRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-600 flex items-center justify-center relative cursor-grab active:cursor-grabbing touch-none"
            >
              <button
                onClick={() => handleJoystickPress(-1, 0)}
                className="absolute left-0.5 text-[9px] text-slate-300 hover:text-white z-10 font-bold"
              >
                ◀
              </button>
              <button
                onClick={() => handleJoystickPress(1, 0)}
                className="absolute right-0.5 text-[9px] text-slate-300 hover:text-white z-10 font-bold"
              >
                ▶
              </button>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#ff8c00] to-[#e64a19] border-2 border-white shadow-md transition-transform duration-75 pointer-events-none"
                style={{ transform: `translate(${joystickTilt.x}px, ${joystickTilt.y}px)` }}
              />
            </div>
          </div>
          <span className="text-[9px] sm:text-[10px] font-fredoka font-bold text-slate-700 mt-1 uppercase tracking-wider">
            {t.arcadeMoveJoystick}
          </span>
        </div>

        {/* Right Large Pill CAPIT Button */}
        <button
          onClick={() => {
            soundFx.playGrabPulse();
            onGrabTrigger();
          }}
          disabled={isGrabbing}
          className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl font-fredoka font-black text-xl sm:text-2xl tracking-wider text-white border-2 sm:border-4 border-orange-300 shadow-xl transition-all ${
            isGrabbing
              ? 'bg-slate-400 cursor-not-allowed opacity-60'
              : 'btn-capit-3d hover:brightness-110 active:scale-95'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{t.arcadeGrabBtn}</span>
          </div>
        </button>

      </div>

      {/* Bottom Bar: DESKRIPSI KARYA (Left), KOCOK MESIN & RESET (Right) - Hidden on Mobile (hidden sm:flex) to maximize claw chamber height */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 pt-1">
        
        {/* Bottom-Left DESKRIPSI KARYA Badge */}
        <div
          onClick={onOpenDeskripsiKarya}
          className="bg-gradient-to-b from-rose-500 to-red-600 text-white p-2.5 rounded-2xl border-2 border-rose-300 shadow-lg cursor-pointer hover:brightness-110 transition-all w-32 text-center group"
        >
          <div className="text-[9px] font-fredoka font-bold uppercase tracking-wider text-yellow-200">
            {t.arcadeRackBtn}
          </div>
          <div className="w-9 h-9 mx-auto my-1 bg-amber-400 rounded-xl border border-amber-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <FolderGit2 className="w-5 h-5 text-slate-900" />
          </div>
          <div className="bg-white text-rose-700 text-[8.5px] font-bold font-fredoka py-0.5 px-1 rounded-lg border border-rose-300 uppercase shadow-2xs">
            SELENGKAPNYA
          </div>
        </div>

        {/* Action Buttons Right Group: KOCOK MESIN */}
        <div className="flex items-center space-x-2">
          {onShakeMachine && (
            <button
              onClick={() => {
                soundFx.playMoveWhirr();
                onShakeMachine();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-md flex items-center space-x-1.5 font-fredoka font-bold text-xs transition-transform active:scale-95"
              title="Kocok mesin agar kelereng bola terpental"
            >
              <span>{t.arcadeShakeBtn}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
