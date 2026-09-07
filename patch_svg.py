import re

with open('/Users/mac/Desktop/antigravity-claw-portfolio/src/components/ArcadeMascot.tsx', 'r') as f:
    content = f.read()

# The new ultra-realistic 3D SVG code
new_svg = """<svg width="100%" height="100%" viewBox="0 0 200 240" style={{ overflow: 'visible' }}>
              <defs>
                {/* 3D Core Gradients */}
                <radialGradient id="pentaHead" cx="35%" cy="30%" r="70%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fdfdfd" />
                  <stop offset="60%" stopColor="#f1f5f9" />
                  <stop offset="85%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>
                <radialGradient id="pentaBody" cx="40%" cy="40%" r="70%" fx="35%" fy="35%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="85%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>
                <radialGradient id="pentaLimbs" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#fdfdfd" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>
                
                {/* Cheek Blushes - softer & tilted */}
                <radialGradient id="pentaBlush" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#fecdd3'} stopOpacity="0.8" />
                  <stop offset="40%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#fecdd3'} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#fecdd3'} stopOpacity="0" />
                </radialGradient>
                
                {/* Ambient Occlusion (Inner Shadows & Neck Shadow) */}
                <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                </linearGradient>

                <filter id="shadowBlur">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="softBlur">
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>
                
                {/* Drop shadow for 3D depth */}
                <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.15" />
                </filter>
              </defs>
              
              {/* ── LIGHTBULB (Idea / Excited) ── */}
              {mood === 'excited' && (
                <g className="anim-bulb" transform="translate(100, 10)">
                  <path d="M-8,-15 C-15,-15 -20,-8 -20,0 C-20,6 -15,10 -12,15 L-12,20 L12,20 L12,15 C15,10 20,6 20,0 C20,-8 15,-15 8,-15 Z" fill="#fbbf24" />
                  <rect x="-8" y="20" width="16" height="5" rx="2" fill="#d97706" />
                  <circle cx="0" cy="27" r="4" fill="#92400e" />
                  {/* Glow */}
                  <circle cx="0" cy="0" r="35" fill="#fef08a" opacity="0.4" filter="url(#shadowBlur)" />
                  {/* Rays */}
                  <path d="M0,-25 L0,-35 M-20,-20 L-28,-28 M20,-20 L28,-28 M-25,0 L-35,0 M25,0 L35,0" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}

              <g filter="url(#dropShadow)">
                
                {/* ── LEFT ARM (Behind Body) ── */}
                <path 
                  d="M 35 130 C 25 130, 20 160, 30 170 C 40 180, 45 140, 45 130 Z" 
                  fill="url(#pentaLimbs)" 
                  style={{ 
                    transform: mood === 'thinking' ? 'rotate(110deg) translate(-20px, -70px)' : isSitting ? 'rotate(30deg) translate(15px, -15px)' : 'rotate(20deg)', 
                    transformOrigin: '40px 130px', 
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }} 
                />

                {/* ── LEGS ── */}
                <g>
                  {/* Left Leg */}
                  <path 
                    d="M 65 180 C 65 210, 85 210, 85 180 Z" 
                    fill="url(#pentaLimbs)" 
                    className={!isDragging && !isFalling && isWalking ? 'anim-leg-l' : ''}
                    style={{ 
                      transform: isSitting ? 'rotate(-70deg) translate(-35px, 45px)' : 'none', 
                      transformOrigin: '75px 180px', 
                      transition: isWalking ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    }} 
                  />
                  {/* Right Leg */}
                  <path 
                    d="M 115 180 C 115 210, 135 210, 135 180 Z" 
                    fill="url(#pentaLimbs)" 
                    className={!isDragging && !isFalling && isWalking ? 'anim-leg-r' : ''}
                    style={{ 
                      transform: isSitting ? 'rotate(70deg) translate(35px, 45px)' : 'none', 
                      transformOrigin: '125px 180px', 
                      transition: isWalking ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    }} 
                  />
                </g>

                {/* ── CHUBBY BODY ── */}
                <g 
                  className={!isDragging && !isFalling && isWalking ? 'anim-waddle' : ''}
                  style={{ transformOrigin: '100px 150px' }}
                >
                  <path 
                    d={isSitting 
                      ? "M 50 145 C 50 125, 150 125, 150 145 C 160 190, 135 200, 100 200 C 65 200, 40 190, 50 145 Z" 
                      : "M 60 130 C 60 120, 140 120, 140 130 C 148 175, 125 190, 100 190 C 75 190, 52 175, 60 130 Z"} 
                    fill="url(#pentaBody)" 
                    style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />
                  
                  {/* Neck Shadow (Ambient Occlusion from Head) */}
                  <path 
                    d={isSitting 
                      ? "M 55 142 Q 100 162 145 142 L 140 152 Q 100 172 60 152 Z" 
                      : "M 62 128 Q 100 148 138 128 L 134 138 Q 100 158 66 138 Z"} 
                    fill="url(#neckShadow)" filter="url(#softBlur)" 
                    style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />
                </g>

                {/* ── HEAD ── */}
                <g 
                  className="head" 
                  style={{ 
                    transform: isSitting ? 'translateY(15px)' : 'none', 
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}
                >
                  {/* Organic squashed sphere for head */}
                  <path 
                    d="M 5 80 C 5 20, 195 20, 195 80 C 195 145, 160 160, 100 160 C 40 160, 5 145, 5 80 Z" 
                    fill="url(#pentaHead)" 
                  />
                  
                  {/* ── FACE ── */}
                  <g style={{ transform: `translate(${eyeOffset.dx}px, ${eyeOffset.dy}px)`, transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}>
                    
                    {/* Blushes (tilted outwards for cuteness) */}
                    {(mood === 'happy' || mood === 'love' || mood === 'shy' || mood === 'waving' || mood === 'excited' || mood === 'thinking' || mood === 'peeking') && (
                      <g>
                        <ellipse cx="40" cy="105" rx="18" ry="11" fill="url(#pentaBlush)" transform="rotate(-8 40 105)" />
                        <ellipse cx="160" cy="105" rx="18" ry="11" fill="url(#pentaBlush)" transform="rotate(8 160 105)" />
                      </g>
                    )}
                    
                    {/* Eyes */}
                    {mood === 'dizzy' ? (
                      <g className="animate-spin" style={{ transformOrigin: '100px 95px', animationDuration: '1s' }}>
                        <path d="M 45 100 C 45 90, 65 90, 65 100 C 65 110, 35 110, 35 100 C 35 85, 75 85, 75 100" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <path d="M 125 100 C 125 90, 145 90, 145 100 C 145 110, 115 110, 115 100 C 115 85, 155 85, 155 100" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
                      </g>
                    ) : mood === 'love' ? (
                      <g fill="#f43f5e">
                        <path d="M 55 98 Q 65 85 75 98 L 65 110 L 45 98 Q 50 85 55 98 Z" />
                        <path d="M 135 98 Q 145 85 155 98 L 145 110 L 125 98 Q 130 85 135 98 Z" />
                      </g>
                    ) : (mood === 'sleepy' || mood === 'charging' || mood === 'sad') ? (
                      <g fill="none" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round">
                        <path d={mood === 'sad' ? "M 45 95 Q 60 85 75 95" : "M 45 100 Q 60 105 75 100"} />
                        <path d={mood === 'sad' ? "M 125 95 Q 140 85 155 95" : "M 125 100 Q 140 105 155 100"} />
                        {mood === 'sad' && <circle cx="50" cy="115" r="4" fill="#38bdf8" stroke="none" />}
                      </g>
                    ) : mood === 'excited' ? (
                      <g fill="none" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 45 105 L 60 90 L 75 105" />
                        <path d="M 125 105 L 140 90 L 155 105" />
                      </g>
                    ) : (
                      <g fill="#0f172a">
                        <circle cx="60" cy={mood === 'thinking' ? "90" : "95"} r={mood === 'surprised' || mood === 'peeking' ? "8.5" : "7.5"} />
                        <circle cx="140" cy={mood === 'thinking' ? "90" : "95"} r={mood === 'surprised' || mood === 'peeking' ? "8.5" : "7.5"} />
                        
                        {/* Angry eyebrows */}
                        {mood === 'angry' && (
                          <g stroke="#0f172a" strokeWidth="5" strokeLinecap="round">
                            <path d="M 40 85 L 70 92" />
                            <path d="M 160 85 L 130 92" />
                            {/* Angry vein icon */}
                            <path d="M 165 60 L 175 60 L 175 70 M 165 60 L 165 70 L 175 70" stroke="#ef4444" strokeWidth="3" fill="none" />
                          </g>
                        )}
                        
                        {/* Zzz for sleeping */}
                        {(mood === 'sleepy' || mood === 'charging') && (
                          <g stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                            <path d="M 155 55 L 170 55 L 155 70 L 170 70" />
                            <path d="M 175 35 L 185 35 L 175 45 L 185 45" strokeWidth="2" />
                          </g>
                        )}
                      </g>
                    )}
                    
                    {/* Cute Mouth */}
                    {mood === 'surprised' || mood === 'love' ? (
                      <ellipse cx="100" cy="115" rx="8" ry="12" fill="#0f172a" />
                    ) : mood === 'angry' || mood === 'sad' ? (
                      <path d="M 92 120 Q 100 112 108 120" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                    ) : mood === 'dizzy' ? (
                      <path d="M 90 120 Q 95 110 100 120 T 110 120" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
                    ) : mood === 'thinking' ? (
                      <path d="M 95 110 Q 100 110 105 110" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" fill="none" />
                    ) : (
                      <path d="M 90 112 Q 100 124 110 112" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                    )}
                  </g>
                </g>

                {/* ── RIGHT ARM (In Front) ── */}
                <path 
                  d="M 155 130 C 145 130, 140 160, 150 170 C 160 180, 165 140, 165 130 Z" 
                  fill="url(#pentaLimbs)" 
                  className={mood === 'waving' ? 'anim-wave' : ''}
                  style={{ 
                    transform: mood === 'waving' ? 'none' : isPeeking ? 'rotate(-60deg) translate(0px, 30px)' : isSitting ? 'rotate(-30deg) translate(-15px, -15px)' : 'rotate(-20deg)', 
                    transformOrigin: '160px 130px', 
                    transition: mood === 'waving' ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }} 
                />
              </g>
            </svg>"""

# Using regex to replace the SVG block
start_tag = r'<svg width="100%" height="100%" viewBox="0 0 200 240"'
end_tag = r'</svg>'

import re
pattern = re.compile(f"{re.escape(start_tag)}.*?{re.escape(end_tag)}", re.DOTALL)
new_content = pattern.sub(new_svg.replace('\\', '\\\\'), content)

with open('/Users/mac/Desktop/antigravity-claw-portfolio/src/components/ArcadeMascot.tsx', 'w') as f:
    f.write(new_content)
