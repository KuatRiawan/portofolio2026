import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import type { GuestMessage } from '../types/portfolio';
import { useApp } from '../context/AppContext';

interface GuestMessageViewModalProps {
  message: GuestMessage | null;
  onClose: () => void;
}

export const GuestMessageViewModal: React.FC<GuestMessageViewModalProps> = ({ message, onClose }) => {
  const { removeGuestMessage } = useApp();

  useEffect(() => {
    if (message) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [message.color, '#ffffff', '#fcd34d']
      });
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-sm bg-slate-50 border-4 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        style={{ borderColor: message.color }}
      >
        
        {/* Top Header Banner */}
        <div 
          className="text-white p-5 pb-4 flex items-start justify-between relative shadow-xs"
          style={{ backgroundColor: message.color }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md border-2 border-white/30">
              <MessageSquare className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-fredoka font-bold uppercase bg-white/30 text-white shadow-2xs backdrop-blur-sm">
                  PESAN TAMU
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-fredoka font-bold bg-yellow-400 text-yellow-950 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-orange-600" /> RARE
                </span>
              </div>
              <h2 className="text-xl font-black text-white font-fredoka tracking-wide mt-1 truncate max-w-[200px]">
                {message.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 bg-white flex-1 space-y-4">
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black font-fredoka text-white shadow-lg border-4 border-white"
              style={{ backgroundColor: message.color }}
            >
              {message.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-full relative">
              {/* Quote marks decoration */}
              <div 
                className="absolute -top-3 -left-2 text-4xl font-serif leading-none"
                style={{ color: message.color, opacity: 0.3 }}
              >
                "
              </div>
              
              <p className="text-sm font-sans text-slate-700 leading-relaxed font-medium relative z-10">
                {message.message}
              </p>
              
              <div 
                className="absolute -bottom-5 -right-2 text-4xl font-serif leading-none"
                style={{ color: message.color, opacity: 0.3 }}
              >
                "
              </div>
            </div>
          </div>
          
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm("Hapus pesan tamu ini selamanya?")) {
                removeGuestMessage(message.id);
                onClose();
              }
            }}
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-fredoka text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center space-x-1"
            title="Hapus pesan ini (Admin)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>HAPUS</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-fredoka text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            SIMPAN KAPSUL
          </button>
        </div>

      </div>
    </div>
  );
};
