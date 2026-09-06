import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Briefcase, Award, Code, Sparkles, Download, Mail, 
  Phone, Globe, MapPin, CheckCircle2, ChevronRight, Gamepad2, 
  Server, Cpu, ExternalLink, FileText
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import type { ProjectCapsule } from '../types/portfolio';
import { TechLogo } from './TechLogos';
import { ArcadeMascot } from './ArcadeMascot';
import { useApp } from '../context/AppContext';

interface LandingSectionsProps {
  onScrollToArcade: () => void;
  onSelectProject?: (project: ProjectCapsule) => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ onScrollToArcade, onSelectProject }) => {
  const { t, theme } = useApp();
  const isLight = theme === 'light';
  
  // Filter for certificates gallery
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Authentic Typewriter Effect: Typing & Deleting between phrases based on language
  const phrases = t.phrases;
  const [displayText, setDisplayText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentPhrase) {
      // Pause at full phrase for 2 seconds
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText === '') {
      // Finished deleting, move to next phrase
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    } else {
      // Typing or Deleting next character
      const speed = isDeleting ? 45 : 90;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.substring(0, displayText.length - 1)
          : currentPhrase.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx, phrases]);

  // Filter certificate & project items
  const certificatesList = PROJECTS_DATA.filter((p) => p.certificateData !== undefined);

  const filteredCerts = selectedFilter === 'ALL'
    ? certificatesList
    : selectedFilter === 'FEATURED'
    ? certificatesList.filter(c => c.category === 'FEATURED')
    : selectedFilter === 'WEB'
    ? certificatesList.filter(c => c.category === 'WEB DEV' || c.category === 'UI DESIGN')
    : selectedFilter === 'BACKEND'
    ? certificatesList.filter(c => c.category === 'API SERVICE')
    : certificatesList.filter(c => c.category === 'CLOUD DEV-OPS');

  return (
    <div className="space-y-20 pb-16">
      
      {/* SECTION 1: HERO BANNER */}
      <section id="hero" className="relative pt-8 lg:pt-16 pb-12 overflow-hidden">
        {/* Soft Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-fredoka font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.heroTag}</span>
              </div>

              <div className="min-h-[110px] xs:min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] flex items-center">
                <h1 className={`text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black font-fredoka leading-tight tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {t.greetingPrefix}{' '}
                  <span className="gradient-text-orange border-r-4 border-orange-500 pr-1">
                    {displayText}
                  </span>
                </h1>
              </div>

              <p className={`text-base sm:text-lg leading-relaxed font-sans max-w-2xl ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {t.bioPart1} <strong className="text-amber-500">{t.bioUniv}</strong> {t.bioPart2} <strong className="text-orange-500">{t.bioNuraga}</strong> {t.bioPart3} <strong className="text-emerald-500">{t.bioScript}</strong>.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onScrollToArcade}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-fredoka font-extrabold text-base rounded-2xl shadow-xl border border-orange-400 flex items-center space-x-2 transition-all active:scale-95 group"
                >
                  <Gamepad2 className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                  <span>{t.playClawBtn}</span>
                </button>

                <a
                  href="/CV_KUAT_RIAWAN.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className={`px-6 py-3.5 font-fredoka font-bold text-base rounded-2xl shadow-md border flex items-center space-x-2 transition-all active:scale-95 ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  <Download className="w-5 h-5 text-orange-500" />
                  <span>{t.downloadPdfCv}</span>
                </a>
              </div>

              {/* Contact Links Bar */}
              <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono">
                <a
                  href="mailto:kuatriawan69@gmail.com"
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-colors ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-orange-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  <span>kuatriawan69@gmail.com</span>
                </a>

                <a
                  href="tel:+6282124289987"
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-colors ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+62 821-2428-9987</span>
                </a>

                <a
                  href="https://linkedin.com/in/kuatriawan"
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-colors ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-blue-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>

            </div>

            {/* Right Hero Glass Showcase Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              
              {/* PET MASCOT: Attached to Profile Card, peeking out from top/behind card */}
              <ArcadeMascot onScrollToArcade={onScrollToArcade} />

              <div className={`glass-panel p-6 rounded-3xl border shadow-2xl relative space-y-5 animate-float-wobble z-20 ${
                isLight ? 'border-slate-300 bg-white/90' : 'border-slate-700 bg-slate-900/80'
              }`}>
                
                {/* Header Photo & IPK */}
                <div className="flex items-center space-x-4">
                  <div className="relative shrink-0">
                    <img
                      src="/profile.jpg"
                      alt="Kuat Riawan"
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-orange-500 shadow-lg"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title={t.availableForHire}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-xl font-black font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      KUAT RIAWAN
                    </h3>
                    <p className="text-xs font-bold text-orange-500 font-fredoka">
                      {t.roleSubtitle}
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.location}</span>
                    </p>
                  </div>
                </div>

                {/* Highlight Badge Card */}
                <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                  isLight ? 'bg-amber-50/90 border-amber-200 text-slate-800' : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between font-fredoka font-bold text-amber-600">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      {t.starProjectLabel}
                    </span>
                    <span className="text-[10px] text-orange-600 font-mono">{t.starProjectBadge}</span>
                  </div>
                  <p className={`leading-snug ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <strong className={isLight ? 'text-slate-900' : 'text-white'}>NURAGA - K3 AI Platform</strong>: {t.starProjectDesc}
                  </p>
                </div>

                {/* Quick Credentials Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-fredoka">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                    <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.eduBadgeLabel}</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>S1 Sistem Informasi</span>
                    <span className="text-[10px] text-blue-500 block">{t.eduBadgeUniv}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                    <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.expBadgeLabel}</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.expBadgeRole}</span>
                    <span className="text-[10px] text-emerald-500 block">{t.expBadgeCompany}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: STATS COUNTER BANNER */}
      <section className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className={`glass-panel rounded-3xl p-6 border shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${
          isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
        }`}>
          
          <div className="space-y-1">
            <div className="text-3xl font-black font-fredoka text-amber-500">15+</div>
            <div className={`text-xs font-bold font-fredoka ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{t.statGpaLabel}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t.statGpaSub}</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-fredoka text-orange-500">14+</div>
            <div className={`text-xs font-bold font-fredoka ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{t.statCertsLabel}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t.statCertsSub}</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-fredoka text-emerald-500">3.000+</div>
            <div className={`text-xs font-bold font-fredoka ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{t.statDatabaseLabel}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t.statDatabaseSub}</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-fredoka text-purple-500">2026</div>
            <div className={`text-xs font-bold font-fredoka ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{t.statScholarshipLabel}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t.statScholarshipSub}</div>
          </div>

        </div>
      </section>

      {/* SECTION 3: PENGALAMAN & PENDIDIKAN TIMELINE */}
      <section id="experience" className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-fredoka font-bold uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.expEduTag}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black font-fredoka tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.expEduTitle}
          </h2>
          <p className={`text-xs sm:text-sm font-sans ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {t.expEduDesc}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Box: Pengalaman Kerja */}
          <div className={`glass-panel p-6 rounded-3xl border space-y-6 ${
            isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className={`flex items-center space-x-3 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center border border-orange-500/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-black font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.workExpTitle}</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.workExpSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/80'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-sm font-bold font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.jobTitle}</h4>
                    <p className="text-xs text-orange-500 font-bold font-fredoka">{t.jobCompany}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {t.jobPeriod}
                  </span>
                </div>
                <ul className={`text-xs space-y-1.5 font-sans pt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.jobPoint1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.jobPoint2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.jobPoint3}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Box: Pendidikan & Sertifikasi */}
          <div id="education" className={`glass-panel p-6 rounded-3xl border space-y-6 ${
            isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className={`flex items-center space-x-3 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-black font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.eduTitle}</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.eduSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Univ Terbuka */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/80'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-sm font-bold font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.degreeTitle}</h4>
                    <p className="text-xs text-blue-500 font-bold font-fredoka">{t.degreeUniv}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 border border-emerald-500/40">
                    IPK 3.50 / 4.00
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{t.degreeDesc}</p>
              </div>

              {/* Dicoding Beasiswa */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/80'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-sm font-bold font-fredoka ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.scholarshipTitle}</h4>
                    <p className="text-xs text-amber-500 font-bold font-fredoka">{t.scholarshipSubTitle}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/40">
                    2026
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{t.scholarshipDesc}</p>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* SECTION 4: KEAHLIAN TEKNIS MATRIX */}
      <section id="skills" className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-fredoka font-bold uppercase">
            <Code className="w-3.5 h-3.5" />
            <span>{t.techTag}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black font-fredoka tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.techTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Front-End */}
          <div className={`glass-panel p-5 rounded-3xl border space-y-3 glass-card-hover ${
            isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center space-x-2 text-orange-500 font-fredoka font-bold text-sm">
              <Code className="w-4 h-4" />
              <span>{t.catFrontend}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['React.js', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'TailwindCSS', 'Vite / Webpack', 'State Management'].map((skill, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all hover:scale-105 shadow-xs ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' 
                    : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-slate-600'
                }`}>
                  <TechLogo name={skill} className="w-4 h-4 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Back-End & DB */}
          <div className={`glass-panel p-5 rounded-3xl border space-y-3 glass-card-hover ${
            isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center space-x-2 text-blue-500 font-fredoka font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>{t.catBackend}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Node.js', 'Express.js', 'PostgreSQL', 'RESTful API', 'WebSocket', 'Authentication'].map((skill, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all hover:scale-105 shadow-xs ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' 
                    : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-slate-600'
                }`}>
                  <TechLogo name={skill} className="w-4 h-4 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Cloud & AI */}
          <div className={`glass-panel p-5 rounded-3xl border space-y-3 glass-card-hover ${
            isLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center space-x-2 text-purple-500 font-fredoka font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>{t.catCloud}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['AWS Cloud', 'Gen AI & LLM Integration', 'Docker Containers', 'Git / GitHub', 'System Architecture'].map((skill, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all hover:scale-105 shadow-xs ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' 
                    : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-slate-600'
                }`}>
                  <TechLogo name={skill} className="w-4 h-4 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: GALERI 14 SERTIFIKAT RESMI */}
      <section id="certificates" className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-fredoka font-bold uppercase">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{t.certTag}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black font-fredoka tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.certTitle}
          </h2>
          <p className={`text-xs sm:text-sm font-sans ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {t.certDesc}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {[
              { id: 'ALL', label: t.filterAll },
              { id: 'FEATURED', label: t.filterFeatured },
              { id: 'WEB', label: t.filterWeb },
              { id: 'BACKEND', label: t.filterBackend },
              { id: 'CLOUD', label: t.filterCloud },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-fredoka font-bold transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                    : isLight
                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 14 Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className={`glass-panel p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between group glass-card-hover ${
                isLight ? 'bg-white/90 border-slate-300 hover:border-amber-400' : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-fredoka font-extrabold text-slate-950 uppercase tracking-wider shadow-2xs"
                    style={{ backgroundColor: cert.color }}
                  >
                    {cert.code}
                  </span>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {cert.certificateData?.issueDate || '2026'}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className={`text-base font-black font-fredoka transition-colors line-clamp-2 ${
                    isLight ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-400'
                  }`}>
                    {cert.title}
                  </h3>
                  <p className={`text-xs font-sans line-clamp-2 mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {cert.subtitle}
                  </p>
                </div>

                {/* Issuer */}
                <div className={`p-2.5 rounded-xl border text-[11px] font-fredoka ${
                  isLight ? 'bg-amber-50 border-amber-200 text-slate-700' : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}>
                  <span className={`block text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t.issuerLabel}</span>
                  <span className="font-bold text-amber-600">{cert.certificateData?.issuer}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cert.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className={`pt-3 border-t flex items-center gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                {cert.certificateData?.pdfUrl && (
                  <a
                    href={cert.certificateData.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 hover:text-amber-700 border border-amber-500/40 rounded-xl font-fredoka font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.viewPdf}</span>
                  </a>
                )}

                {onSelectProject && (
                  <button
                    onClick={() => onSelectProject(cert)}
                    className={`py-2.5 px-3 border rounded-xl font-fredoka font-bold text-xs flex items-center justify-center space-x-1 transition-colors ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Detail"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: ARCADE SHOWCASE BANNER CTA */}
      <section id="arcade" className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-4">
        <div className={`glass-panel p-8 sm:p-12 rounded-3xl border text-center space-y-6 relative overflow-hidden shadow-2xl ${
          isLight 
            ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-orange-200 text-slate-900' 
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/30 text-white'
        }`}>
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-600 text-xs font-fredoka font-bold border border-amber-500/40">
            <Gamepad2 className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{t.arcadeTag}</span>
          </div>

          <h2 className={`text-3xl sm:text-5xl font-black font-fredoka tracking-wide leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.arcadeTitlePrefix} <span className="gradient-text-orange">{t.arcadeTitleHighlight}</span>{t.arcadeTitleSuffix}
          </h2>

          <p className={`text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {t.arcadeDesc}
          </p>

          <div className="pt-2">
            <button
              onClick={onScrollToArcade}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-fredoka font-black text-lg rounded-2xl shadow-2xl border-2 border-orange-400 inline-flex items-center space-x-3 transition-all active:scale-95 group hover:scale-105"
            >
              <Gamepad2 className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>{t.arcadeOpenBtn}</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
