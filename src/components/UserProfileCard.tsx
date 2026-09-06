import React from 'react';
import { MapPin, Mail, Phone, GraduationCap, Briefcase, Award, Download, Code2, Sparkles, CheckCircle2, Globe } from 'lucide-react';

export const UserProfileCard: React.FC = () => {
  return (
    <aside className="w-full bg-[#f8fafc] border-4 border-slate-300 rounded-[36px] shadow-2xl p-5 space-y-5 select-none border-t-8 flex flex-col justify-between">
      
      {/* Header Profile Info */}
      <div className="space-y-4">
        
        {/* Profile Avatar & Badge */}
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0">
            <img
              src="/profile.jpg"
              alt="Kuat Riawan"
              className="w-20 h-20 rounded-3xl object-cover border-4 border-orange-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title="Available for hire">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black font-fredoka text-slate-800 tracking-wide">
                KUAT RIAWAN
              </h2>
            </div>
            <p className="text-xs font-bold font-fredoka text-orange-600">
              Junior Full Stack Web Developer
            </p>
            <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Jakarta, Indonesia</span>
            </p>
          </div>
        </div>

        {/* Short Bio Summary */}
        <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-sans shadow-2xs">
          <span className="font-bold font-fredoka text-amber-950">Mahasiswa Sistem Informasi</span> dengan 6 tahun rekam jejak manajemen operasional K3. Pengembang platform <strong className="text-orange-700">NURAGA - Integrated Safety Intelligence</strong> (K3 AI & WhatsApp Gateway).
        </div>

        {/* Contact Links */}
        <div className="space-y-1.5 text-xs font-sans">
          <a
            href="mailto:kuatriawan69@gmail.com"
            className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 text-slate-700 hover:border-orange-400 transition-colors shadow-2xs"
          >
            <Mail className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="truncate font-mono text-[11px]">kuatriawan69@gmail.com</span>
          </a>
          <a
            href="tel:+6282124289987"
            className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 text-slate-700 hover:border-orange-400 transition-colors shadow-2xs"
          >
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-mono text-[11px]">+62 821-2428-9987</span>
          </a>
          <a
            href="https://linkedin.com/in/kuatriawan"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 text-slate-700 hover:border-orange-400 transition-colors shadow-2xs"
          >
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-mono text-[11px]">linkedin.com/in/kuatriawan</span>
          </a>
        </div>

        {/* Education Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-fredoka font-bold text-slate-800">
            <div className="flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Universitas Terbuka</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full border border-blue-300">
              S1 Sistem Informasi
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Maret 2024 - Sekarang</p>
        </div>

        {/* Work Experience */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-xs font-fredoka font-bold text-slate-800">
            <Briefcase className="w-4 h-4 text-orange-500" />
            <span>PT Upaya Riksa Patra</span>
          </div>
          <p className="text-[11px] font-bold text-slate-700">Training Officer (2020 - Sekarang)</p>
          <p className="text-[10px] text-slate-500 leading-tight">
            • Mengelola & memvalidasi database 3.000+ peserta pelatihan K3.<br />
            • PIC Operasional Pelatihan & Administrasi OJT.
          </p>
        </div>

        {/* Technical Skills Badges */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-fredoka font-bold text-slate-700">
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Keahlian Teknis</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'WebSocket', 'AWS Cloud & Gen AI', 'REST API', 'JavaScript', 'HTML5/CSS3'].map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-200 border border-slate-300 rounded-lg text-[10px] font-mono font-bold text-slate-800">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications Highlights */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-fredoka font-bold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sertifikasi Kompetensi</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-600 font-sans">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
              <span>Dicoding Coding Camp 2026 (Full-Stack Beasiswa)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
              <span>Belajar Membuat Aplikasi Web dengan React</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Belajar Fundamental Back-End dengan JavaScript</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Belajar Dasar Cloud dan Gen AI di AWS</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons: Download CV */}
      <div className="pt-2">
        <a
          href="/CV_KUAT_RIAWAN.pdf"
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white font-fredoka font-extrabold text-xs rounded-2xl shadow-lg border-2 border-orange-400 flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>UNDUH CV KUAT RIAWAN (PDF)</span>
        </a>
      </div>

    </aside>
  );
};
