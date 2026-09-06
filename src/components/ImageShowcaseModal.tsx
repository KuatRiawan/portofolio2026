import React from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export const ImageShowcaseModal: React.FC<ImageShowcaseModalProps> = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.3)]">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <span className="font-orbitron font-bold text-sm text-cyan-300">
              EXHIBIT PHOTOGRAPH // JAKARTA TECH EXPO 2026
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* High Res Image Render */}
        <div className="relative p-2 bg-slate-950 flex items-center justify-center max-h-[80vh] overflow-hidden">
          <img
            src={imageSrc}
            alt="Futuristic Anti-Gravity Claw Machine Developer Portfolio Exhibit"
            className="max-h-[75vh] w-auto object-contain rounded-2xl border border-cyan-500/30 shadow-2xl"
          />
        </div>

        {/* Caption Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Cinematic render of brushed metal cabinet, zero-g floating project capsules & neon LED accents</span>
          </div>
          <div className="text-cyan-400">PROJECT: NURAGA IN CLAW TARGET LOCK</div>
        </div>

      </div>
    </div>
  );
};
