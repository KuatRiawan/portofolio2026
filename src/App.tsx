import { useState, useCallback, useEffect, useRef } from 'react';
import { PROJECTS_DATA } from './data/projectsData';
import type { ProjectCapsule, ClawState } from './types/portfolio';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingSections } from './components/LandingSections';
import { ArcadeLoadingOverlay } from './components/ArcadeLoadingOverlay';
import { ArcadeFullscreenView } from './components/ArcadeFullscreenView';
import { ArcadeMascot } from './components/ArcadeMascot';
import { ProjectModal } from './components/ProjectModal';
import { RakCapitModal } from './components/RakCapitModal';
import { soundFx } from './services/soundEffects';
import { useApp } from './context/AppContext';

export function App() {
  const { t, theme } = useApp();
  const [projects] = useState<ProjectCapsule[]>(PROJECTS_DATA);
  const [selectedProject, setSelectedProject] = useState<ProjectCapsule | null>(null);
  const [isRakCapitOpen, setIsRakCapitOpen] = useState(false);
  const [caughtProjects, setCaughtProjects] = useState<ProjectCapsule[]>([]);

  // Sunflower Background Track Audio State (Controlled by Top-Right Speaker Icon)
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioIframeRef = useRef<HTMLIFrameElement>(null);

  const toggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const nextMuted = !prev;
      soundFx.setMuted(nextMuted);

      if (audioIframeRef.current?.contentWindow) {
        const command = nextMuted ? 'mute' : 'unMute';
        audioIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      }
      return nextMuted;
    });
  }, []);

  // Guarantee audio unMute & play on first user interaction if browser blocked autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioIframeRef.current?.contentWindow && !isAudioMuted) {
        audioIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
          '*'
        );
        audioIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
          '*'
        );
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isAudioMuted]);

  // Navigation View Modes: 'landing' or 'arcade'
  const [viewMode, setViewMode] = useState<'landing' | 'arcade'>('landing');
  const [isLoadingArcade, setIsLoadingArcade] = useState(false);

  // Claw State
  const [clawState, setClawState] = useState<ClawState>({
    x: 0.5,
    y: 0.15,
    targetX: 0.5,
    targetY: 0.15,
    isOpen: true,
    isLowering: false,
    isRaising: false,
    isGrabbing: false,
    hasCapsule: false,
    grabbedCapsuleId: null,
    beamActive: false
  });

  const handleOpenArcadeFullscreen = () => {
    setIsLoadingArcade(true);
  };

  const handleLoadingComplete = () => {
    setIsLoadingArcade(false);
    setViewMode('arcade');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (viewMode === 'arcade') {
      setViewMode('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Joystick / Touch X Movement
  const handleClawMove = useCallback((dx: number) => {
    setClawState((prev) => {
      if (prev.isGrabbing) return prev;
      const newX = Math.max(0.15, Math.min(0.85, prev.x + dx));
      return { ...prev, x: newX, targetX: newX };
    });
  }, []);

  const handleDirectClawMove = useCallback((x: number) => {
    setClawState((prev) => {
      if (prev.isGrabbing) return prev;
      return { ...prev, x };
    });
  }, []);

  // Keyboard navigation support (Arrow Keys, A/D, Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleClawMove(-0.06);
        soundFx.playMoveWhirr();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleClawMove(0.06);
        soundFx.playMoveWhirr();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        executeGrabSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClawMove]);

  const grabTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClawHitBall = useCallback((hitY?: number) => {
    if (grabTimeoutRef.current) {
      clearTimeout(grabTimeoutRef.current);
      grabTimeoutRef.current = null;
    }

    setClawState((prev) => {
      const lockY = hitY !== undefined ? hitY : prev.y;
      return {
        ...prev,
        y: lockY,
        targetY: lockY,
        isLowering: false,
        isOpen: false
      };
    });

    setTimeout(() => {
      setClawState((prev) => ({
        ...prev,
        y: 0.15,
        targetY: 0.15,
        isRaising: true
      }));

      setTimeout(() => {
        setClawState((prev) => ({
          ...prev,
          x: 0.15,
          targetX: 0.15,
          isRaising: false,
          isGrabbing: false,
          isOpen: true,
          beamActive: false
        }));
      }, 800);
    }, 350);
  }, []);

  // Trigger Claw Lower & Grab Sequence with smooth multi-phase animation
  const executeGrabSequence = () => {
    if (clawState.isGrabbing) return;
    soundFx.playGrabPulse();

    // Step 1: Lower claw down to floor Y: 0.76
    setClawState((prev) => ({
      ...prev,
      isGrabbing: true,
      isLowering: true,
      isOpen: true,
      y: 0.76
    }));

    // Step 2: If reaches floor without hitting high ball (850ms)
    grabTimeoutRef.current = setTimeout(() => {
      setClawState((prev) => ({
        ...prev,
        isOpen: false,
        isLowering: false
      }));

      // Step 3: Raise claw back up to top Y: 0.15 (400ms pause + 800ms lift)
      setTimeout(() => {
        setClawState((prev) => ({
          ...prev,
          y: 0.15,
          isRaising: true
        }));

        // Step 4: Move claw left to Prize Hatch X: 0.15 (800ms)
        setTimeout(() => {
          setClawState((prev) => ({
            ...prev,
            x: 0.15,
            isRaising: false,
            isGrabbing: false,
            isOpen: true,
            beamActive: false
          }));
        }, 800);

      }, 500);

    }, 850);
  };

  const handleCapsuleCaught = useCallback((project: ProjectCapsule) => {
    setCaughtProjects((prev) => {
      if (!prev.some((p) => p.id === project.id)) {
        return [...prev, project];
      }
      return prev;
    });
    setSelectedProject(project);
  }, []);

  const handleResetMachine = () => {
    setCaughtProjects([]);
    setClawState({
      x: 0.5,
      y: 0.22,
      targetX: 0.5,
      targetY: 0.22,
      isOpen: true,
      isLowering: false,
      isRaising: false,
      isGrabbing: false,
      hasCapsule: false,
      grabbedCapsuleId: null,
      beamActive: false
    });
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-300 w-full max-w-full ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0f172a] text-slate-100'}`}>
      
      {/* Background YouTube Autoplay Audio Player for Post Malone, Swae Lee - Sunflower */}
      <iframe
        ref={audioIframeRef}
        id="sunflower-global-yt-audio"
        width="1"
        height="1"
        src="https://www.youtube-nocookie.com/embed/ApXoWvfEYVU?enablejsapi=1&autoplay=1&loop=1&playlist=ApXoWvfEYVU"
        title="Sunflower Background Audio"
        allow="autoplay"
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      />

      {/* 1. Loading Overlay Animation */}
      {isLoadingArcade && (
        <ArcadeLoadingOverlay onComplete={handleLoadingComplete} />
      )}

      {/* 2. Page Mode A: Fullscreen Arcade View */}
      {viewMode === 'arcade' ? (
        <ArcadeFullscreenView
          projects={projects}
          clawState={clawState}
          onClawMove={handleClawMove}
          onDirectClawMove={handleDirectClawMove}
          onGrabTrigger={executeGrabSequence}
          onClawHitBall={handleClawHitBall}
          onCapsuleCaught={handleCapsuleCaught}
          caughtProjects={caughtProjects}
          onOpenDeskripsiKarya={() => setIsRakCapitOpen(true)}
          onResetMachine={handleResetMachine}
          onBackToLanding={handleBackToLanding}
          isAudioMuted={isAudioMuted}
          onToggleAudio={toggleAudio}
        />
      ) : (
        /* 3. Page Mode B: Main Landing Page View */
        <>
          <LandingNavbar
            onScrollToSection={scrollToSection}
            onOpenArcade={handleOpenArcadeFullscreen}
            isAudioMuted={isAudioMuted}
            onToggleAudio={toggleAudio}
          />

          <main className="flex-1 pt-16">
            <LandingSections
              onScrollToArcade={handleOpenArcadeFullscreen}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />
          </main>

          {/* Global Landing Footer */}
          <footer className={`border-t py-10 text-center text-xs font-mono space-y-3 transition-colors duration-300 ${theme === 'light' ? 'bg-slate-200/80 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800/80 text-slate-500'}`}>
            <div className="flex justify-center space-x-6 font-fredoka text-xs">
              <button onClick={() => scrollToSection('hero')} className="hover:text-orange-500 transition-colors">{t.navAbout}</button>
              <button onClick={() => handleOpenArcadeFullscreen()} className="hover:text-amber-500 transition-colors">{t.navPortfolio}</button>
              <button onClick={() => scrollToSection('experience')} className="hover:text-blue-500 transition-colors">{t.navExperience}</button>
              <button onClick={() => scrollToSection('skills')} className="hover:text-emerald-500 transition-colors">{t.navSkills}</button>
            </div>
            <p className="text-[11px]">
              © {new Date().getFullYear()} {t.footerRights}
            </p>
          </footer>
        </>
      )}

      {/* Modals */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      
      <RakCapitModal
        isOpen={isRakCapitOpen}
        onClose={() => setIsRakCapitOpen(false)}
        caughtProjects={caughtProjects}
        allProjects={projects}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Global Fixed Floating Pet Mascot Awans (Only in Landing) */}
      {viewMode !== 'arcade' && (
        <ArcadeMascot onScrollToArcade={handleOpenArcadeFullscreen} />
      )}

    </div>
  );
}

export default App;
