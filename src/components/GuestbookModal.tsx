import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GuestbookModalProps {
  onClose: () => void;
  onSubmit: (name: string, message: string) => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({ onClose, onSubmit }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    onSubmit(name.trim(), message.trim());
    setName('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md p-6 rounded-3xl border-4 shadow-2xl transform transition-all ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-600 text-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black font-fredoka text-indigo-500">Tinggalkan Pesan</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 font-fredoka">Nama Anda</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cth: Budi"
              maxLength={15}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-indigo-500 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 font-fredoka">Pesan Singkat</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pesan untuk portofolio ini..."
              rows={3}
              maxLength={60}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>
          <button 
            type="submit"
            disabled={!name.trim() || !message.trim()}
            className="w-full py-3 mt-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold font-fredoka flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Pesan ke Mesin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
