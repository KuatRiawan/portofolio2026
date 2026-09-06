export interface CertificateData {
  issuer: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
  skillsVerified: string[];
  pdfUrl?: string;
}

export interface ProjectCapsule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'FEATURED' | 'MOBILE APP' | 'WEB DEV' | 'UI DESIGN' | 'API SERVICE' | 'AI / ML' | 'CLOUD DEV-OPS' | 'GAME DEV';
  color: string; // glowing hex/rgba
  glowColor: string;
  shape: 'sphere' | 'cube' | 'hologram' | 'octahedron';
  description: string;
  fullDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  architecture: string[];
  codeSnippet: string;
  demoUrl?: string;
  githubUrl?: string;
  highlightedFeature?: string;
  certificateData?: CertificateData;
}

export interface ClawState {
  x: number; // 0 to 1 percentage of chamber width
  y: number; // 0 to 1 percentage of chamber height (0 top, 1 bottom)
  targetX: number;
  targetY: number;
  isOpen: boolean;
  isLowering: boolean;
  isRaising: boolean;
  isGrabbing: boolean;
  hasCapsule: boolean;
  grabbedCapsuleId: string | null;
  beamActive: boolean;
}

export interface CapsulePhysics {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  pulsePhase: number;
  isGrabbed: boolean;
}
