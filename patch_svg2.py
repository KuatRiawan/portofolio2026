import re

with open('/Users/mac/Desktop/antigravity-claw-portfolio/src/components/ArcadeMascot.tsx', 'r') as f:
    content = f.read()

# The ultra-realistic seamless 3D SVG code
new_svg = """<svg width="100%" height="100%" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
              <defs>
                {/* ── SEAMLESS 3D SHADING ── 
                    By using userSpaceOnUse, the gradient spans the entire canvas.
                    When multiple shapes (head, body, legs) use this same gradient, 
                    they blend into one completely seamless 3D object without any visible joints! 
                */}
                <radialGradient id="pentaSkinSeamless" cx="90" cy="70" r="150" fx="70" fy="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fdfdfd" />
                  <stop offset="55%" stopColor="#f1f5f9" />
                  <stop offset="80%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>
                
                {/* Blush */}
                <radialGradient id="pentaBlush" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#ff9a8b'} stopOpacity="0.9" />
                  <stop offset="40%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#ff9a8b'} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={mood === 'angry' ? '#f87171' : mood === 'love' ? '#f43f5e' : '#ff9a8b'} stopOpacity="0" />
                </radialGradient>

                <filter id="shadowBlur">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="softBlur">
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>
                
                {/* Drop shadow for 3D depth against the webpage */}
                <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
                </filter>
                
                {/* Subtle limb shadow to separate overlapping seamless shapes */}
                <filter id="limbShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.1" />
                </filter>
              </defs>
              
              {/* ── LIGHTBULB (Idea / Excited) ── */}
              {mood === 'excited' && (
                <g className="anim-bulb" transform="translate(120, 10)">
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
                
                {/* ── LEFT ARM (Raised to cheek like the reference image) ── */}
                <rect 
                  x="50" y="125" width="28" height="50" rx="14" 
                  fill="url(#pentaSkinSeamless)" filter="url(#limbShadow)"
                  style={{ 
                    transform: mood === 'thinking' ? 'rotate(110deg) translate(-20px, -70px)' : isSitting ? 'rotate(30deg) translate(15px, -15px)' : 'rotate(35deg)', 
                    transformOrigin: '64px 125px', 
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }} 
                />

                {/* ── LEGS ── */}
                <g>
                  {/* Left Leg */}
                  <rect 
                    x="85" y="195" width="26" height="30" rx="13" 
                    fill="url(#pentaSkinSeamless)" filter="url(#limbShadow)"
                    className={!isDragging && !isFalling && isWalking ? 'anim-leg-l' : ''}
                    style={{ 
                      transform: isSitting ? 'rotate(-70deg) translate(-35px, 45px)' : 'none', 
                      transformOrigin: '98px 195px', 
                      transition: isWalking ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    }} 
                  />
                  {/* Right Leg */}
                  <rect 
                    x="129" y="195" width="26" height="30" rx="13" 
                    fill="url(#pentaSkinSeamless)" filter="url(#limbShadow)"
                    className={!isDragging && !isFalling && isWalking ? 'anim-leg-r' : ''}
                    style={{ 
                      transform: isSitting ? 'rotate(70deg) translate(35px, 45px)' : 'none', 
                      transformOrigin: '142px 195px', 
                      transition: isWalking ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    }} 
                  />
                </g>

                {/* ── CHUBBY BODY (Seamless blend with head) ── */}
                <g 
                  className={!isDragging && !isFalling && isWalking ? 'anim-waddle' : ''}
                  style={{ transformOrigin: '120px 150px' }}
                >
                  <path 
                    d={isSitting 
                      ? "M 70 145 C 70 125, 170 125, 170 145 C 180 190, 155 205, 120 205 C 85 205, 60 190, 70 145 Z" 
                      : "M 80 130 C 80 120, 160 120, 160 130 C 170 185, 145 205, 120 205 C 95 205, 70 185, 80 130 Z"} 
                    fill="url(#pentaSkinSeamless)" 
                    style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />
                </g>

                {/* ── RIGHT ARM (Resting at side) ── */}
                <rect 
                  x="162" y="145" width="26" height="42" rx="13" 
                  fill="url(#pentaSkinSeamless)" filter="url(#limbShadow)"
                  className={mood === 'waving' ? 'anim-wave' : ''}
                  style={{ 
                    transform: mood === 'waving' ? 'none' : isPeeking ? 'rotate(-60deg) translate(0px, 30px)' : isSitting ? 'rotate(-30deg) translate(-15px, -15px)' : 'rotate(-25deg)', 
                    transformOrigin: '175px 145px', 
                    transition: mood === 'waving' ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }} 
                />

                {/* ── HUGE ROUND HEAD (Seamlessly overlaps body) ── */}
                <g 
                  className="head" 
                  style={{ 
                    transform: isSitting ? 'translateY(15px)' : 'none', 
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}
                >
                  <ellipse cx="120" cy="100" rx="110" ry="92" fill="url(#pentaSkinSeamless)" />
                  
                  {/* ── FACE ── */}
                  <g style={{ transform: `translate(${eyeOffset.dx}px, ${eyeOffset.dy}px)`, transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}>
                    
                    {/* Blushes (soft, horizontal ovals) */}
                    {(mood === 'happy' || mood === 'love' || mood === 'shy' || mood === 'waving' || mood === 'excited' || mood === 'thinking' || mood === 'peeking') && (
                      <g>
                        <ellipse cx="60" cy="132" rx="20" ry="12" fill="url(#pentaBlush)" transform="rotate(-6 60 132)" />
                        <ellipse cx="180" cy="132" rx="20" ry="12" fill="url(#pentaBlush)" transform="rotate(6 180 132)" />
                      </g>
                    )}
                    
                    {/* Eyes (dark slate, perfectly round) */}
                    {mood === 'dizzy' ? (
                      <g className="animate-spin" style={{ transformOrigin: '120px 115px', animationDuration: '1s' }}>
                        <path d="M 75 120 C 75 110, 95 110, 95 120 C 95 130, 65 130, 65 120 C 65 105, 105 105, 105 120" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
                        <path d="M 145 120 C 145 110, 165 110, 165 120 C 165 130, 135 130, 135 120 C 135 105, 175 105, 175 120" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
                      </g>
                    ) : mood === 'love' ? (
                      <g fill="#f43f5e">
                        <path d="M 85 115 Q 95 102 105 115 L 95 127 L 75 115 Q 80 102 85 115 Z" />
                        <path d="M 155 115 Q 165 102 175 115 L 165 127 L 145 115 Q 150 102 155 115 Z" />
                      </g>
                    ) : (mood === 'sleepy' || mood === 'charging' || mood === 'sad') ? (
                      <g fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round">
                        <path d={mood === 'sad' ? "M 75 115 Q 90 105 105 115" : "M 75 120 Q 90 125 105 120"} />
                        <path d={mood === 'sad' ? "M 135 115 Q 150 105 165 115" : "M 135 120 Q 150 125 165 120"} />
                        {mood === 'sad' && <circle cx="80" cy="135" r="5" fill="#38bdf8" stroke="none" />}
                      </g>
                    ) : mood === 'excited' ? (
                      <g fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 75 125 L 90 110 L 105 125" />
                        <path d="M 135 125 L 150 110 L 165 125" />
                      </g>
                    ) : (
                      <g fill="#1e293b">
                        <circle cx="85" cy={mood === 'thinking' ? "110" : "115"} r={mood === 'surprised' || mood === 'peeking' ? "10" : "8"} />
                        <circle cx="155" cy={mood === 'thinking' ? "110" : "115"} r={mood === 'surprised' || mood === 'peeking' ? "10" : "8"} />
                        
                        {/* Angry eyebrows */}
                        {mood === 'angry' && (
                          <g stroke="#1e293b" strokeWidth="6" strokeLinecap="round">
                            <path d="M 70 100 L 100 108" />
                            <path d="M 170 100 L 140 108" />
                            <path d="M 180 75 L 190 75 L 190 85 M 180 75 L 180 85 L 190 85" stroke="#ef4444" strokeWidth="4" fill="none" />
                          </g>
                        )}
                        
                        {/* Zzz for sleeping */}
                        {(mood === 'sleepy' || mood === 'charging') && (
                          <g stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                            <path d="M 170 65 L 190 65 L 170 85 L 190 85" />
                            <path d="M 195 45 L 210 45 L 195 60 L 210 60" strokeWidth="3" />
                          </g>
                        )}
                      </g>
                    )}
                    
                    {/* Cute Mouth (Thin, precise curve) */}
                    {mood === 'surprised' || mood === 'love' ? (
                      <ellipse cx="120" cy="135" rx="10" ry="14" fill="#1e293b" />
                    ) : mood === 'angry' || mood === 'sad' ? (
                      <path d="M 110 140 Q 120 130 130 140" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    ) : mood === 'dizzy' ? (
                      <path d="M 110 140 Q 115 130 120 140 T 130 140" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
                    ) : mood === 'thinking' ? (
                      <path d="M 115 130 Q 120 130 125 130" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    ) : (
                      <path d="M 108 132 Q 120 146 132 132" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    )}
                  </g>
                </g>
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
