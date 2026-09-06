import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ProjectCapsule, ClawState } from '../types/portfolio';
import { soundFx } from '../services/soundEffects';

interface ThreeDChamberProps {
  projects: ProjectCapsule[];
  clawState: ClawState;
  onClawMove: (x: number, y: number) => void;
  onCapsuleCaught: (project: ProjectCapsule) => void;
  targetProjectCode?: string;
  cameraPreset?: 'front' | 'claw' | 'interior';
}

export const ThreeDChamber: React.FC<ThreeDChamberProps> = ({
  projects,
  clawState,
  onClawMove,
  onCapsuleCaught,
  targetProjectCode,
  cameraPreset = 'front'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCapsule, setHoveredCapsule] = useState<ProjectCapsule | null>(null);

  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // 3D Objects
  const clawGroupRef = useRef<THREE.Group | null>(null);
  const cableMeshRef = useRef<THREE.Mesh | null>(null);
  const energyConeRef = useRef<THREE.Mesh | null>(null);
  const prongsRef = useRef<THREE.Group[]>([]);
  const capsuleMeshesRef = useRef<{ mesh: THREE.Group; project: ProjectCapsule; initialY: number; phase: number }[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Create Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 12);
    cameraRef.current = camera;

    // 2. WebGL Renderer with Shadows & Anti-Aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight('#1e293b', 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 2.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Cyan Neon Light Bar
    const cyanLight = new THREE.PointLight('#00f0ff', 4, 12);
    cyanLight.position.set(-3, 6, 3);
    scene.add(cyanLight);

    // Purple Neon Light Bar
    const purpleLight = new THREE.PointLight('#a855f7', 4, 12);
    purpleLight.position.set(3, 6, 3);
    scene.add(purpleLight);

    // Pink Neon Light Bar
    const pinkLight = new THREE.PointLight('#ec4899', 3, 10);
    pinkLight.position.set(0, 0, 4);
    scene.add(pinkLight);

    // 5. Build 3D Arcade Cabinet
    // Cabinet Dimensions: Width 6, Height 7, Depth 5
    const cabinetGroup = new THREE.Group();

    // Metallic Brushed Frame Pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      metalness: 0.9,
      roughness: 0.2
    });

    const pillarGeo = new THREE.BoxGeometry(0.25, 7, 0.25);
    [
      [-3, 3.5, 2.5],
      [3, 3.5, 2.5],
      [-3, 3.5, -2.5],
      [3, 3.5, -2.5]
    ].forEach(([px, py, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, py, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      cabinetGroup.add(pillar);
    });

    // Cabinet Top Hood Header & Bottom Base
    const frameMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8, roughness: 0.3 });
    const topHood = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.8, 5.4), frameMat);
    topHood.position.set(0, 7.2, 0);
    cabinetGroup.add(topHood);

    const baseFloor = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 5.4), frameMat);
    baseFloor.position.set(0, 0.2, 0);
    baseFloor.receiveShadow = true;
    cabinetGroup.add(baseFloor);

    // Glowing Neon Light Strips along pillars
    const neonGeo = new THREE.CylinderGeometry(0.06, 0.06, 6.8);
    const cyanNeonMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });
    const purpleNeonMat = new THREE.MeshBasicMaterial({ color: '#a855f7' });

    const leftNeon = new THREE.Mesh(neonGeo, cyanNeonMat);
    leftNeon.position.set(-2.9, 3.5, 2.4);
    cabinetGroup.add(leftNeon);

    const rightNeon = new THREE.Mesh(neonGeo, purpleNeonMat);
    rightNeon.position.set(2.9, 3.5, 2.4);
    cabinetGroup.add(rightNeon);

    // Glass Enclosure Walls
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      reflectivity: 0.9
    });

    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(6, 6.6), glassMat);
    frontGlass.position.set(0, 3.5, 2.5);
    cabinetGroup.add(frontGlass);

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6.6),
      new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.6 })
    );
    backWall.position.set(0, 3.5, -2.5);
    cabinetGroup.add(backWall);

    // Grid pattern on back wall
    const gridHelper = new THREE.GridHelper(6, 12, '#00f0ff', '#1e293b');
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 3.5, -2.48);
    cabinetGroup.add(gridHelper);

    // Prize Hatch 3D Chute in Bottom Corner
    const chuteGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const chuteMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.7, roughness: 0.3 });
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.position.set(-2, 0.8, 1.5);
    cabinetGroup.add(chute);

    scene.add(cabinetGroup);

    // 6. Build 3D Gantry & Magnetic Claw
    const clawGroup = new THREE.Group();
    clawGroupRef.current = clawGroup;

    // Gantry Rail Top Track
    const railMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.9, roughness: 0.1 });
    const railX = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.8), railMat);
    railX.rotation.z = Math.PI / 2;
    railX.position.set(0, 6.6, 0);
    scene.add(railX);

    // Motor Carriage sliding X/Z
    const carriageMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8, roughness: 0.2 });
    const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), carriageMat);
    carriage.position.set(0, 6.6, 0);
    clawGroup.add(carriage);

    // Coiled Power Cable / Rod Y
    const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 2);
    const cableMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.5 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    cableMesh.position.set(0, 5.6, 0);
    cableMeshRef.current = cableMesh;
    clawGroup.add(cableMesh);

    // Main Claw Hub Base
    const hubMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.9, roughness: 0.1 });
    const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16), hubMat);
    hubMesh.position.set(0, 4.5, 0);
    clawGroup.add(hubMesh);

    // Glowing Power Core Light inside Claw Hub
    const clawCoreLight = new THREE.PointLight('#00f0ff', 3, 4);
    clawCoreLight.position.set(0, 4.4, 0);
    clawGroup.add(clawCoreLight);

    // 3 Metallic Mechanical Prongs
    prongsRef.current = [];
    const prongMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.9, roughness: 0.2 });

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const prongGroup = new THREE.Group();
      prongGroup.position.set(Math.cos(angle) * 0.3, 4.3, Math.sin(angle) * 0.3);
      prongGroup.rotation.y = angle;

      const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), prongMat);
      upperArm.position.set(0, -0.25, 0);
      upperArm.rotation.z = -0.3;
      prongGroup.add(upperArm);

      const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), prongMat);
      lowerArm.position.set(0.1, -0.6, 0);
      lowerArm.rotation.z = 0.5;
      prongGroup.add(lowerArm);

      clawGroup.add(prongGroup);
      prongsRef.current.push(prongGroup);
    }

    // Glowing Conical Energy Beam Tractor Field
    const coneGeo = new THREE.ConeGeometry(1.8, 4.5, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const energyCone = new THREE.Mesh(coneGeo, coneMat);
    energyCone.position.set(0, 2.2, 0);
    energyCone.visible = false;
    energyConeRef.current = energyCone;
    clawGroup.add(energyCone);

    scene.add(clawGroup);

    // 7. Render 3D Zero-G Floating Project Capsules
    capsuleMeshesRef.current = [];

    projects.forEach((proj, idx) => {
      const capGroup = new THREE.Group();

      // Geometry selection
      let geo: THREE.BufferGeometry;
      if (proj.shape === 'sphere') geo = new THREE.SphereGeometry(0.48, 32, 32);
      else if (proj.shape === 'cube') geo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      else geo = new THREE.OctahedronGeometry(0.55);

      const mat = new THREE.MeshPhysicalMaterial({
        color: proj.color,
        emissive: proj.color,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1.0
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      capGroup.add(mesh);

      // Inner Core Glow Light
      const pointLight = new THREE.PointLight(proj.color, 1.5, 3);
      capGroup.add(pointLight);

      // 3D Floating Label Canvas Texture
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
      const lctx = labelCanvas.getContext('2d');
      if (lctx) {
        lctx.fillStyle = '#030712';
        lctx.fillRect(0, 0, 256, 64);
        lctx.strokeStyle = proj.color;
        lctx.lineWidth = 4;
        lctx.strokeRect(2, 2, 252, 60);
        lctx.fillStyle = '#ffffff';
        lctx.font = 'bold 22px monospace';
        lctx.textAlign = 'center';
        lctx.fillText(proj.code, 128, 40);
      }

      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const spriteMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.35, 1);
      sprite.position.set(0, 0.75, 0);
      capGroup.add(sprite);

      // Initial Floating Positions
      const angle = (idx / projects.length) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.8;
      const initialY = 2.2 + Math.random() * 2.2;

      capGroup.position.set(Math.cos(angle) * radius, initialY, Math.sin(angle) * radius);
      scene.add(capGroup);

      capsuleMeshesRef.current.push({
        mesh: capGroup,
        project: proj,
        initialY,
        phase: Math.random() * Math.PI * 2
      });
    });

    // 8. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundProj: ProjectCapsule | null = null;

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent) {
          const matched = capsuleMeshesRef.current.find((c) => c.mesh === parent);
          if (matched) {
            foundProj = matched.project;
            break;
          }
          parent = parent.parent;
        }
        if (foundProj) break;
      }

      setHoveredCapsule(foundProj);
    };

    const handleClick = () => {
      if (hoveredCapsule) {
        const matched = capsuleMeshesRef.current.find((c) => c.project.id === hoveredCapsule.id);
        if (matched) {
          // Normalize X position from -2.5..2.5 to 0.1..0.9
          const normX = (matched.mesh.position.x + 2.5) / 5;
          const normY = (4.5 - matched.mesh.position.y) / 4;
          onClawMove(normX, normY);
          soundFx.playMoveWhirr();
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('click', handleClick);

    // 9. Main Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Zero-G Floating Capsule Physics Loop
      capsuleMeshesRef.current.forEach(({ mesh, project, initialY, phase }) => {
        mesh.position.y = initialY + Math.sin(time * 1.5 + phase) * 0.25;
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;

        // Scale highlight if target match
        const isTarget = targetProjectCode && project.code.toLowerCase().includes(targetProjectCode.toLowerCase());
        const targetScale = isTarget ? 1.25 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      // Update 3D Claw Position based on clawState
      if (clawGroupRef.current) {
        const targetX = (clawState.x - 0.5) * 5; // map 0..1 to -2.5..2.5
        const targetY = 6.6 - clawState.y * 5;   // map 0..1 Y down

        clawGroupRef.current.position.x = THREE.MathUtils.lerp(clawGroupRef.current.position.x, targetX, 0.1);
        clawGroupRef.current.position.y = THREE.MathUtils.lerp(clawGroupRef.current.position.y, targetY - 4.5, 0.1);

        // Adjust Cable scale to connect top rail to claw base
        if (cableMeshRef.current) {
          const distY = 6.6 - clawGroupRef.current.position.y - 4.5;
          cableMeshRef.current.scale.y = Math.max(0.2, distY / 2);
          cableMeshRef.current.position.y = 4.5 + distY / 2;
        }
      }

      // Tractor Beam Field visibility & pulse
      if (energyConeRef.current) {
        energyConeRef.current.visible = clawState.beamActive || clawState.isLowering || clawState.isGrabbing;
        if (energyConeRef.current.visible) {
          (energyConeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(time * 10) * 0.1;
        }
      }

      // Claw Prong opening & closing
      prongsRef.current.forEach((prong) => {
        const targetRot = clawState.isOpen ? 0.3 : 0.05;
        prong.rotation.z = THREE.MathUtils.lerp(prong.rotation.z, targetRot, 0.15);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [projects, clawState, onClawMove, onCapsuleCaught]);

  // Handle Camera Presets
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (cameraPreset === 'claw') {
      camera.position.set(0, 5.5, 6);
      controls.target.set(0, 4.5, 0);
    } else if (cameraPreset === 'interior') {
      camera.position.set(0, 3, 4);
      controls.target.set(0, 2.5, 0);
    } else {
      camera.position.set(0, 3.5, 12);
      controls.target.set(0, 3, 0);
    }
    controls.update();
  }, [cameraPreset]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-[0_0_60px_rgba(0,240,255,0.2)] group">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hovered 3D Capsule Card Tooltip */}
      {hoveredCapsule && (
        <div className="absolute top-4 right-4 pointer-events-none bg-slate-900/90 backdrop-blur-xl border border-cyan-400/60 p-4 rounded-2xl shadow-2xl max-w-xs animate-fade-in z-20">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: hoveredCapsule.color }} />
            <span className="text-xs font-orbitron font-bold text-cyan-300">
              {hoveredCapsule.code}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-1">{hoveredCapsule.title}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{hoveredCapsule.description}</p>
          <div className="mt-2 text-[10px] text-cyan-400 font-mono">
            Click 3D Capsule to Lock Gantry Claw 🎯
          </div>
        </div>
      )}

      {/* Top Glass Header Overlay */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30 px-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-orbitron font-bold text-cyan-300 tracking-wider">
            3D WEBGL ZERO-G CHAMBER // THREE.JS ENGINE
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          3D SHADERS: <span className="text-emerald-400 font-bold">PBR & TRANSMISSION READY</span>
        </div>
      </div>
    </div>
  );
};
