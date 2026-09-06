import React from 'react';
import { Camera, Terminal, Mail, Award, CheckCircle, Gamepad2 } from 'lucide-react';

interface ExpoHeaderProps {
  onOpenPhotoModal: () => void;
}

export const ExpoHeader: React.FC<ExpoHeaderProps> = ({ onOpenPhotoModal }) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-40 px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300 font-orbitron font-black text-sm">
              <Gamepad2 className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-400 tracking-wider">
                KUAT RIAWAN PORTFOLIO
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                EXHIBIT #402
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <span>Anti-Gravity Arcade Cabinet</span>
              <span>•</span>
              <span className="text-cyan-400">Jakarta Tech Expo 2026</span>
            </p>
          </div>
        </div>

        {/* Developer Stats Pills */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ROLE:</span>
            <span className="text-white font-bold">Senior AI Systems Architect</span>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">FLAGSHIP:</span>
            <span className="text-cyan-300 font-bold">PROJECT NURAGA</span>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">AVAILABLE FOR HIRE</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPhotoModal}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-orbitron text-xs font-bold rounded-xl border border-cyan-500/40 flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXHIBIT PHOTO</span>
          </button>

          <a
            href="mailto:contact@developer.dev?subject=Hiring%20Inquiry%20via%20Anti-Gravity%20Claw%20Exhibit"
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-orbitron text-xs font-black rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center space-x-1.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>HIRE DEVELOPER</span>
          </a>
        </div>

      </div>
    </header>
  );
};
