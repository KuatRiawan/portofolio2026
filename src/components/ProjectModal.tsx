import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ExternalLink, Code, Cpu, Activity, CheckCircle2, Copy, Sparkles, Layers, Terminal, Award, ShieldCheck, Download } from 'lucide-react';
import type { ProjectCapsule } from '../types/portfolio';

interface ProjectModalProps {
  project: ProjectCapsule | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'code' | 'demo' | 'certificate'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff7e5f', '#fef08a', '#38bdf8', '#a855f7']
      });
    }
  }, [project]);

  if (!project) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-50 border-4 border-orange-400 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 pb-4 border-b border-orange-600 flex items-start justify-between relative shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-md border-2 border-amber-200">
              <Code className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-fredoka font-bold uppercase bg-yellow-300 text-orange-950 shadow-2xs">
                  {project.category}
                </span>
                {project.highlightedFeature && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-fredoka font-bold bg-amber-900 text-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" /> STAR
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white font-fredoka tracking-wide mt-1">
                {project.title}
              </h2>
              <p className="text-xs text-amber-100 font-sans mt-0.5">{project.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-800 text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 text-xs font-fredoka font-bold border-b-3 transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>RINGKASAN</span>
          </button>

          {project.certificateData && (
            <button
              onClick={() => setActiveTab('certificate')}
              className={`py-2.5 px-3 text-xs font-fredoka font-bold border-b-3 transition-all flex items-center space-x-1.5 ${
                activeTab === 'certificate'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-amber-600 hover:text-amber-800 font-extrabold'
              }`}
            >
              <Award className="w-4 h-4 text-orange-500" />
              <span>SERTIFIKAT</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2.5 px-3 text-xs font-fredoka font-bold border-b-3 transition-all flex items-center space-x-1.5 ${
              activeTab === 'architecture'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>ARSITEKTUR</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-2.5 px-3 text-xs font-fredoka font-bold border-b-3 transition-all flex items-center space-x-1.5 ${
              activeTab === 'code'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>KODE</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`py-2.5 px-3 text-xs font-fredoka font-bold border-b-3 transition-all flex items-center space-x-1.5 ${
              activeTab === 'demo'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>DEMO SIMULATOR</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-white">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 text-xs leading-relaxed font-sans">
                {project.fullDescription}
              </div>

              <div>
                <h3 className="text-xs font-fredoka font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Metrics & Benchmark
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-orange-50/60 p-3 rounded-xl border border-orange-200 text-center">
                      <div className="text-base font-black font-fredoka text-orange-600">
                        {metric.value}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-fredoka font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Teknologi
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-mono font-bold text-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-fredoka font-bold text-orange-600 mb-3 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Alur Arsitektur Sistem
                </h3>
                <div className="space-y-2">
                  {project.architecture.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-fredoka text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="bg-white p-2 rounded-xl border border-slate-200 flex-1 font-mono text-[11px]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODE SNIPPET */}
          {activeTab === 'code' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Source Implementation</span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-[11px] font-fredoka font-bold flex items-center space-x-1 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 p-3 rounded-2xl font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: DEMO SIMULATOR */}
          {activeTab === 'demo' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold font-fredoka text-emerald-900">
                  Interactive Micro Sandbox
                </h3>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left font-mono text-[11px] space-y-1 text-slate-300">
                  <div className="text-emerald-400">[SYSTEM OK] Initializing {project.code}...</div>
                  <div className="text-slate-400">&gt; Status 200 OK (Latency: 12ms)</div>
                  <div className="text-cyan-300">&gt; Live worker active.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SERTIFIKAT KOMPETENSI */}
          {activeTab === 'certificate' && project.certificateData && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-5 rounded-3xl border-4 border-amber-300 shadow-xl space-y-4 relative overflow-hidden">
                {/* Certificate Watermark Stamp Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
                  <div className="flex items-center space-x-2">
                    <Award className="w-7 h-7 text-orange-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-amber-900 block font-bold">SERTIFIKAT KOMPETENSI RESMI</span>
                      <h4 className="text-xs sm:text-sm font-black font-fredoka text-amber-950">{project.certificateData.issuer}</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white font-mono shadow-xs shrink-0">
                    VERIFIED {project.certificateData.issueDate}
                  </span>
                </div>

                <div className="space-y-2 text-center py-2">
                  <p className="text-[11px] font-sans text-amber-800 uppercase tracking-wider">Diberikan Kepada:</p>
                  <h3 className="text-xl font-black font-fredoka text-slate-900 tracking-wide underline decoration-amber-400 decoration-2">
                    KUAT RIAWAN
                  </h3>
                  <p className="text-xs text-amber-900 font-bold font-sans">
                    Atas Kelulusan & Penguasaan Kompetensi pada modul:
                  </p>
                  <div className="bg-white/90 p-3 rounded-2xl border border-amber-300 font-bold font-fredoka text-sm text-orange-700 shadow-xs">
                    {project.title}
                  </div>
                </div>

                {/* Skills Verified List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-fredoka font-bold text-amber-900 uppercase tracking-wider block">Keahlian Terverifikasi:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.certificateData.skillsVerified.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-[10px] font-mono text-amber-950 font-bold">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Credential ID & Date */}
                <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-2 border-t border-amber-200">
                  <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                    <span className="text-[9px] text-amber-800 block font-mono">CREDENTIAL ID:</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{project.certificateData.credentialId}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                    <span className="text-[9px] text-amber-800 block font-mono">PERIODE TERBIT:</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px] block">{project.certificateData.issueDate}</span>
                  </div>
                </div>

                {/* Verification & PDF Download Links */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.certificateData.pdfUrl && (
                    <a
                      href={project.certificateData.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-fredoka font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95 border border-slate-700"
                    >
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>UNDUH PDF SERTIFIKAT</span>
                    </a>
                  )}
                  <a
                    href={project.certificateData.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-fredoka font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95 border border-orange-400"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFIKASI ONLINE</span>
                  </a>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="flex space-x-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-fredoka text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>GITHUB</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-fredoka text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LIVE DEMO</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-fredoka text-xs font-bold rounded-xl transition-all"
          >
            TUTUP
          </button>
        </div>

      </div>
    </div>
  );
};
