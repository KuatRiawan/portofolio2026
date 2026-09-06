import React, { useState, useEffect } from 'react';
import { Play, Zap, RotateCcw, Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface ControlPanelProps {
  onJoystickMove: (dx: number, dy: number) => void;
  onGrabTrigger: () => void;
  onReleaseTrigger: () => void;
  onResetTrigger: () => void;
  onAutoPickTarget: (code: string) => void;
  isGrabbing: boolean;
  selectedTargetCode: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onJoystickMove,
  onGrabTrigger,
  onReleaseTrigger,
  onResetTrigger,
  onAutoPickTarget,
  isGrabbing,
  selectedTargetCode,
}) => {
  const [joystickTilt, setJoystickTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);

  // Keyboard navigation support (Arrow Keys / WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0;
      let dy = 0;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dx = -0.04;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dx = 0.04;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dy = -0.04;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dy = 0.04;

      if (dx !== 0 || dy !== 0) {
        setJoystickTilt({ x: dx * 40, y: dy * 40 });
        onJoystickMove(dx, dy);
        soundFx.playMoveWhirr();
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        soundFx.playGrabPulse();
        onGrabTrigger();
      }
    };

    const handleKeyUp = () => {
      setJoystickTilt({ x: 0, y: 0 });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onJoystickMove, onGrabTrigger]);

  const toggleSound = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundFx.setMuted(newMute);
    if (!newMute) soundFx.playClick();
  };

  const handleJoystickPress = (dx: number, dy: number) => {
    setJoystickTilt({ x: dx * 30, y: dy * 30 });
    onJoystickMove(dx * 0.05, dy * 0.05);
    soundFx.playMoveWhirr();
    setTimeout(() => setJoystickTilt({ x: 0, y: 0 }), 150);
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Metallic Texture Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* 1. Futuristic Joystick Unit (Left 4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-950/80 rounded-xl border border-cyan-500/20 shadow-inner">
          <div className="text-[11px] font-orbitron font-bold text-cyan-400 mb-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> GANTRY GANTRY CONTROLLER
          </div>

          {/* Interactive 3D Joystick Sphere & Base */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Base Ring */}
            <div className="w-28 h-28 rounded-full border-4 border-slate-700 bg-slate-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center">
              {/* Inner Well */}
              <div className="w-20 h-20 rounded-full bg-slate-950 border border-cyan-500/30 flex items-center justify-center relative">
                
                {/* Direction Buttons */}
                <button
                  onClick={() => handleJoystickPress(0, -1)}
                  className="absolute top-1 text-xs text-cyan-400 hover:text-white transition-colors"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleJoystickPress(0, 1)}
                  className="absolute bottom-1 text-xs text-cyan-400 hover:text-white transition-colors"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleJoystickPress(-1, 0)}
                  className="absolute left-1 text-xs text-cyan-400 hover:text-white transition-colors"
                >
                  ◀
                </button>
                <button
                  onClick={() => handleJoystickPress(1, 0)}
                  className="absolute right-1 text-xs text-cyan-400 hover:text-white transition-colors"
                >
                  ▶
                </button>

                {/* Joystick Stick Stem & Knob */}
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.8)] border-2 border-white cursor-pointer transition-transform duration-100 flex items-center justify-center"
                  style={{
                    transform: `translate(${joystickTilt.x}px, ${joystickTilt.y}px)`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono mt-2">
            Use WASD or Arrow Keys
          </div>
        </div>

        {/* 2. Integrated OLED Telemetry Screen (Middle 4 cols) */}
        <div className="md:col-span-4 bg-slate-950 border-2 border-cyan-500/50 rounded-xl p-3 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)] font-mono text-xs relative flex flex-col justify-between h-44">
          
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
            <span className="text-cyan-400 font-orbitron font-bold tracking-wider text-[10px]">
              ANTI-GRAVITY CLAW MACHINE
            </span>
            <button
              onClick={toggleSound}
              className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
              title="Toggle Web Audio SFX"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

          {/* Telemetry Display Lines */}
          <div className="space-y-1.5 py-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">MAGNETIC FLUX:</span>
              <span className="text-emerald-400 font-bold">99.4% STABLE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TARGET:</span>
              <span className="text-cyan-300 font-bold animate-pulse">
                {selectedTargetCode || 'PROJECT: NURAGA'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CLAW STATE:</span>
              <span className={isGrabbing ? "text-pink-400 font-bold" : "text-cyan-400"}>
                {isGrabbing ? "MAGNETIC SUCTION ACTIVE" : "READY FOR GRAB"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">HIRE CANDIDATE:</span>
              <span className="text-amber-300 font-bold">TOP 1% DEVELOPER</span>
            </div>
          </div>

          {/* Quick Target Preset Chips */}
          <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[9px] text-slate-500">LOCK ON:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onAutoPickTarget('PROJECT: NURAGA');
                }}
                className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/50 rounded text-[9px] text-cyan-300 hover:bg-cyan-900 transition-colors"
              >
                ⭐ NURAGA
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onAutoPickTarget('MOBILE APP');
                }}
                className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[9px] text-slate-300 hover:bg-slate-800 transition-colors"
              >
                MOBILE
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onAutoPickTarget('WEB DEV');
                }}
                className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[9px] text-slate-300 hover:bg-slate-800 transition-colors"
              >
                WEB
              </button>
            </div>
          </div>
        </div>

        {/* 3. Glowing Arcade Action Buttons (Right 4 cols) */}
        <div className="md:col-span-4 flex flex-col space-y-3 justify-center">
          
          {/* GRAB Main Button */}
          <button
            onClick={() => {
              soundFx.playGrabPulse();
              onGrabTrigger();
            }}
            disabled={isGrabbing}
            className={`w-full py-3.5 px-6 rounded-xl font-orbitron font-black text-sm tracking-widest flex items-center justify-center space-x-2 transition-all duration-150 shadow-lg ${
              isGrabbing
                ? 'bg-pink-600/50 text-white cursor-not-allowed border-2 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white hover:brightness-110 active:scale-98 border-2 border-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.6)]'
            }`}
          >
            <Zap className={`w-5 h-5 ${isGrabbing ? 'animate-bounce' : ''}`} />
            <span>{isGrabbing ? 'GRABBING...' : 'GRAB CAPSULE'}</span>
          </button>

          {/* Secondary Buttons Row: RELEASE & START / AUTO */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onReleaseTrigger();
              }}
              className="py-2.5 px-3 bg-slate-800 border border-cyan-500/40 rounded-xl font-orbitron text-xs font-bold text-cyan-300 hover:bg-slate-700 hover:border-cyan-400 transition-all flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RELEASE</span>
            </button>

            <button
              onClick={() => {
                soundFx.playCoin();
                onResetTrigger();
              }}
              className="py-2.5 px-3 bg-slate-800 border border-purple-500/40 rounded-xl font-orbitron text-xs font-bold text-purple-300 hover:bg-slate-700 hover:border-purple-400 transition-all flex items-center justify-center space-x-1"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>START / RESET</span>
            </button>
          </div>

          {/* Auto-Pick Featured Project Button */}
          <button
            onClick={() => {
              soundFx.playCoin();
              onAutoPickTarget('PROJECT: NURAGA');
            }}
            className="w-full py-2 bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400/60 rounded-xl text-xs font-orbitron font-semibold text-cyan-300 hover:text-white hover:border-cyan-300 transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>AUTOPILOT: FETCH "NURAGA"</span>
          </button>

        </div>

      </div>
    </div>
  );
};
