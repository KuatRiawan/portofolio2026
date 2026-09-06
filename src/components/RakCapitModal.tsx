import React from 'react';
import { X, FolderOpen, ChevronRight, Star } from 'lucide-react';
import type { ProjectCapsule } from '../types/portfolio';

interface RakCapitModalProps {
  isOpen: boolean;
  onClose: () => void;
  caughtProjects: ProjectCapsule[];
  allProjects: ProjectCapsule[];
  onSelectProject: (project: ProjectCapsule) => void;
}

export const RakCapitModal: React.FC<RakCapitModalProps> = ({
  isOpen,
  onClose,
  caughtProjects,
  allProjects,
  onSelectProject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-50 border-4 border-orange-400 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="bg-[#f97316] text-white p-4 border-b border-orange-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-6 h-6 text-yellow-200" />
            <h2 className="text-xl font-black font-fredoka tracking-wide">
              DESKRIPSI KARYA PORTOFOLIO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Status */}
        <div className="bg-amber-100 p-3 text-center text-xs font-bold font-fredoka text-amber-900 border-b border-amber-200">
          Koleksi Terkumpul: {caughtProjects.length} / {allProjects.length} Kapsul Proyek
        </div>

        {/* Inventory Items List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {allProjects.map((proj) => {
            const isCaught = caughtProjects.some((cp) => cp.id === proj.id);
            const isNuraga = proj.id === 'nuraga';

            return (
              <div
                key={proj.id}
                onClick={() => {
                  if (isCaught) {
                    onSelectProject(proj);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isCaught
                    ? 'bg-white border-orange-300 shadow-sm cursor-pointer hover:border-orange-500'
                    : 'bg-slate-200/60 border-slate-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold font-fredoka text-sm shadow-xs"
                    style={{ backgroundColor: isCaught ? proj.color : '#94a3b8' }}
                  >
                    {isCaught ? '🔴' : '🔒'}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold font-fredoka text-slate-800">
                        {proj.title}
                      </span>
                      {isNuraga && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> STAR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{proj.subtitle}</p>
                  </div>
                </div>

                <div className="text-xs font-bold font-fredoka">
                  {isCaught ? (
                    <span className="text-orange-600 flex items-center">
                      Buka <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400">Belum Dicapit</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs font-fredoka text-slate-500">
          Capit kapsul di mesin untuk membuka proyek portofolio!
        </div>

      </div>
    </div>
  );
};
