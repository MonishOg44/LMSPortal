import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

// Helper Component: Interactive Constellation Map
function InteractiveConstellation() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 200, y: 100, active: false });
  
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      });
    }
  };

  const handleMouseLeave = () => {
    setMouse(prev => ({ ...prev, active: false }));
  };

  const nodes = [
    { id: 1, baseX: 60, baseY: 40 },
    { id: 2, baseX: 150, baseY: 75 },
    { id: 3, baseX: 240, baseY: 35 },
    { id: 4, baseX: 330, baseY: 70 },
    { id: 5, baseX: 90, baseY: 145 },
    { id: 6, baseX: 210, baseY: 130 },
    { id: 7, baseX: 310, baseY: 155 }
  ];

  return (
    <div 
      className="crd-constellation-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="crd-constellation-label">COGNITIVE INTEGRATION FIELD</div>
      <svg className="crd-constellation-svg" viewBox="0 0 400 200">
        <line x1="0" y1="100" x2="400" y2="100" stroke="var(--crd-border)" strokeWidth="0.5" strokeDasharray="6, 6" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="var(--crd-border)" strokeWidth="0.5" strokeDasharray="6, 6" />
        
        <line className="crd-const-line" x1="60" y1="40" x2="150" y2="75" />
        <line className="crd-const-line" x1="150" y1="75" x2="240" y2="35" />
        <line className="crd-const-line" x1="240" y1="35" x2="330" y2="70" />
        <line className="crd-const-line" x1="150" y1="75" x2="210" y2="130" />
        <line className="crd-const-line" x1="210" y1="130" x2="310" y2="155" />
        <line className="crd-const-line" x1="90" y1="145" x2="60" y2="40" />
        <line className="crd-const-line" x1="210" y1="130" x2="90" y2="145" />
        <line className="crd-const-line" x1="330" y1="70" x2="310" y2="155" />
        
        <circle className="crd-const-node crd-node-1" cx="60" cy="40" r="4.5" />
        <circle className="crd-const-node crd-node-2" cx="150" cy="75" r="5" />
        <circle className="crd-const-node crd-node-3" cx="240" cy="35" r="4" />
        <circle className="crd-const-node crd-node-4" cx="330" cy="70" r="5.5" />
        <circle className="crd-const-node crd-node-5" cx="90" cy="145" r="4.5" />
        <circle className="crd-const-node crd-node-6" cx="210" cy="130" r="6" />
        <circle className="crd-const-node crd-node-7" cx="310" cy="155" r="4" />

        {mouse.active && (
          <>
            <circle cx={mouse.x} cy={mouse.y} r="10" fill="none" stroke="var(--crd-accent)" strokeWidth="1" opacity="0.6" className="crd-mouse-pulse" />
            <circle cx={mouse.x} cy={mouse.y} r="2" fill="var(--crd-accent)" />
            {nodes.map(node => {
              const dx = mouse.x - node.baseX;
              const dy = mouse.y - node.baseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                return (
                  <line 
                    key={node.id}
                    x1={mouse.x} 
                    y1={mouse.y} 
                    x2={node.baseX} 
                    y2={node.baseY} 
                    stroke="var(--crd-accent)" 
                    strokeWidth={(1 - dist / 120) * 1.5}
                    opacity={(1 - dist / 120) * 0.75}
                    strokeDasharray="3, 3"
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </svg>
    </div>
  );
}

export default function Navbar() {
  const { theme } = useProgress();
  const [transitioning, setTransitioning] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [creditsPhase, setCreditsPhase] = useState('out'); // out | in
  const [scrollY, setScrollY] = useState(0);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    coreLoad: 88,
    integrity: 100,
    uptime: '00:00:00'
  });
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Telemetry loop for the interactive HUD console
  useEffect(() => {
    if (!creditsOpen) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTelemetry({
        fps: Math.floor(58 + Math.random() * 4),
        coreLoad: Math.floor(82 + Math.random() * 12),
        integrity: Math.floor(99 + Math.random() * 2),
        uptime: new Date(Date.now() - startTime).toISOString().substr(11, 8)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [creditsOpen]);

  // Setup scroll-reveal IntersectionObserver
  useEffect(() => {
    if (!creditsOpen) return;
    
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('crd-reveal--active');
          }
        });
      }, { threshold: 0.1 });

      const revealElements = document.querySelectorAll('.crd-reveal');
      revealElements.forEach(el => observer.observe(el));

      return () => {
        revealElements.forEach(el => observer.unobserve(el));
        observer.disconnect();
      };
    }, 120);

    return () => clearTimeout(timeout);
  }, [creditsOpen]);

  const goToStrangeGT = () => {
    setTransitioning(true);
    sessionStorage.setItem('sgt-nav-transition', '1');
    setTimeout(() => navigate('/strangegt'), 3500);
  };

  const openCredits = () => {
    setCreditsOpen(true);
    setScrollY(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCreditsPhase('in');
      });
    });
  };

  const closeCredits = () => {
    setCreditsPhase('out');
    setTimeout(() => setCreditsOpen(false), 1200);
  };

  const backToMenu = () => {
    setCreditsPhase('out');
    setTimeout(() => {
      setCreditsOpen(false);
      navigate('/');
    }, 1100);
  };

  // Smooth scroll to second section
  const scrollToDiscover = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll events inside credits overlay for smooth parallax
  const handleScroll = (e) => {
    if (e.target) {
      setScrollY(e.target.scrollTop);
    }
  };

  // Calculate parallax offsets based on scroll position
  const watermarkOffset = scrollY * 0.15;
  const waveOffset = scrollY * 0.25;

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-capsule">
        <button onClick={openCredits} className="navbar-logo-circle crd-trigger" aria-label="Credits">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M2 12h20M20.5 9c-2.5 1.5-5 2.2-8.5 2.2S6.5 10.5 3.5 9" transform="rotate(-15 12 12)"/>
          </svg>
        </button>

        <div className="navbar-links-group">
          <NavLink to="/" className={({isActive})=>`navbar-capsule-link ${isActive?'active':''}`} end><span>Menu</span></NavLink>
          <NavLink to="/profile" className={({isActive})=>`navbar-capsule-link ${isActive?'active':''}`}><span>Profile</span></NavLink>
          <NavLink to="/settings" className={({isActive})=>`navbar-capsule-link ${isActive?'active':''}`}><span>Settings</span></NavLink>
          <NavLink to="/lab" className={({isActive})=>`navbar-capsule-link ${isActive?'active':''}`}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.4rem'}}>Lab<span className="live-dot-pulse"/></span>
          </NavLink>
        </div>

        <button onClick={goToStrangeGT} style={{background:'none',border:'none',padding:0,cursor:'pointer',color:'inherit'}}>
          <div className="navbar-badge-capsule">
            <span className="navbar-badge-text">
              strangegt<span className="navbar-badge-text-desktop"> technologies</span>
            </span>
          </div>
        </button>
      </nav>

      {/* ── CREDITS FULLSCREEN OVERLAY ── */}
      {creditsOpen && (
        <div 
          className={`crd-page crd-page--${creditsPhase}`} 
          data-theme={theme}
          onScroll={handleScroll}
          ref={scrollContainerRef}
        >
          {/* SVG brush distortion filter */}
          <svg style={{ display: 'none' }}>
            <defs>
              <filter id="crd-brush-distort">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          {/* Background Grid */}
          <div className="crd-grid-overlay" />
          <div className="crd-plus-decor top-left">+</div>
          <div className="crd-plus-decor top-right">+</div>
          <div className="crd-plus-decor bottom-left">+</div>
          <div className="crd-plus-decor bottom-right">+</div>

          {/* Margins HUD decorative tags */}
          <div className="crd-decor-tag left-side-1">[ CORE_DIAGNOSTICS_MODULE_01 ]</div>
          <div className="crd-decor-tag left-side-2">CLOCK_SPEED: 4.80GHz</div>
          <div className="crd-decor-tag right-side-1">LOC: 12.9716 // 77.5946</div>
          <div className="crd-decor-tag right-side-2">SYS_MONITOR_ONLINE_v2.0</div>

          {/* Fixed Header Bar for instant navigation */}
          <div className="crd-fixed-header">
            <div className="crd-header-title">
              <span className="crd-header-title-brand">STRANGEGT // </span>
              CREATOR CREDITS
            </div>
          </div>

          {/* Wavy Sine Curve */}
          <div className="crd-wave-wrapper" style={{ transform: `translateY(${-waveOffset}px)` }}>
            <svg className="crd-wave-svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100" fill="none" stroke="var(--crd-accent)" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Section 1: Hero Section */}
          <section className="crd-section crd-hero-section">
            {/* Giant Background Watermark */}
            <div className="crd-watermark" style={{ transform: `translate(-50%, calc(-50% - ${watermarkOffset}px))` }}>
              STRANGEGT
            </div>

            {/* Rotating Line Flower */}
            <div className="crd-flower-container">
              <svg className="crd-flower-svg" viewBox="0 0 200 200">
                <path d="M100,10 C120,45 130,45 155,25 C145,55 145,65 180,70 C150,85 145,95 165,125 C135,115 125,120 120,155 C105,125 95,125 75,155 C85,125 85,115 50,110 C80,95 85,85 65,55 C95,65 105,60 100,10 Z" fill="none" stroke="var(--crd-flower-color)" strokeWidth="1.5" />
                <path d="M100,30 C112,56 120,56 138,42 C131,64 131,71 156,75 C134,86 131,93 145,115 C123,107 116,111 112,138 C102,115 94,115 80,138 C87,115 87,107 61,103 C83,92 86,85 71,63 C93,71 100,67 100,30 Z" fill="none" stroke="var(--crd-flower-color)" strokeWidth="1" opacity="0.6" />
              </svg>
            </div>

            {/* Accent Badges */}
            <div className="crd-badge crd-badge--tl">
              <span className="crd-badge-bar" />
              <span className="crd-badge-text">CREATIVE SYSTEM V1.0</span>
            </div>
            <div className="crd-badge crd-badge--tr">
              <span className="crd-badge-bar" />
              <span className="crd-badge-text">EST. 2026</span>
            </div>

            {/* Central Typography Block */}
            <div className="crd-hero-content crd-reveal">
              <div className="crd-hero-overline">ARCHITECTED BY</div>
              <h1 className="crd-hero-title">MONISH</h1>
              <div className="crd-hero-underline">
                <span className="crd-line" />
                <span className="crd-line-label">CREATIVE ARCHITECT // LEAD ENGINEER</span>
                <span className="crd-line" />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="crd-scroll-down" onClick={scrollToDiscover} style={{ cursor: 'pointer' }}>
              <span className="crd-scroll-text">SCROLL TO DISCOVER</span>
              <svg className="crd-scroll-arrow" width="10" height="24" viewBox="0 0 10 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="0" x2="5" y2="20" />
                <polyline points="1 16 5 20 9 16" />
              </svg>
            </div>
          </section>

          {/* ── DOUBLE-DIRECTIONAL SLANTED MARQUEE (Fills the visual gap beautifully) ── */}
          <div className="crd-marquee-section crd-reveal">
            <div className="crd-marquee-row crd-marquee-row--left">
              <div className="crd-marquee-inner">
                <span className="crd-marquee-text">STRANGEGT CREATIVE ENGINE • MONISH • CREATIVE ARCHITECT • LEAD ENGINEER • </span>
                <span className="crd-marquee-text">STRANGEGT CREATIVE ENGINE • MONISH • CREATIVE ARCHITECT • LEAD ENGINEER • </span>
              </div>
            </div>
            <div className="crd-marquee-row crd-marquee-row--right">
              <div className="crd-marquee-inner">
                <span className="crd-marquee-text">SYSTEM STATUS: ACTIVE • 100% DESIGN PRECISION • NO COMPROMISES • </span>
                <span className="crd-marquee-text">SYSTEM STATUS: ACTIVE • 100% DESIGN PRECISION • NO COMPROMISES • </span>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive HUD & Interactive Constellation */}
          <section className="crd-section crd-showcase-section">
            <div className="crd-showcase-layout">
              {/* Dynamic HUD Visualizer Console */}
              <div className="crd-hud-console crd-reveal">
                <div className="crd-hud-topbar">
                  <div className="crd-hud-status"><span className="crd-hud-ping-dot" />SYS_CORE_ACTIVE</div>
                  <div className="crd-hud-title">STRANGEGT ENGINE CORE</div>
                </div>
                
                <div className="crd-hud-content">
                  <div className="crd-hud-ring-wrapper">
                    <svg className="crd-hud-gear" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--crd-accent)" strokeWidth="1.5" strokeDasharray="6, 8" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="var(--crd-accent)" strokeWidth="1" strokeDasharray="30, 10" className="crd-gear-reverse" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="var(--crd-accent)" strokeWidth="2" strokeDasharray="5, 5" />
                      <path d="M50,15 L50,85 M15,50 L85,50" stroke="var(--crd-accent)" strokeWidth="0.5" opacity="0.4" />
                    </svg>
                  </div>

                  <div className="crd-hud-data">
                    <div className="crd-hud-row">
                      <span className="crd-hud-label">ENGINE INTEL</span>
                      <span className="crd-hud-val">{telemetry.integrity}%</span>
                    </div>
                    <div className="crd-hud-row">
                      <span className="crd-hud-label">RENDER SPEED</span>
                      <span className="crd-hud-val">{telemetry.fps} FPS</span>
                    </div>
                    <div className="crd-hud-row">
                      <span className="crd-hud-label">PROCESS LOAD</span>
                      <span className="crd-hud-val">{telemetry.coreLoad}% CAPACITY</span>
                    </div>
                    <div className="crd-hud-row">
                      <span className="crd-hud-label">UPTIME TICK</span>
                      <span className="crd-hud-val">{telemetry.uptime}</span>
                    </div>
                  </div>
                </div>

                <div className="crd-hud-terminal">
                  <div className="crd-terminal-line">&gt; LOADING CREATIVE STACK CONFIG... DONE</div>
                  <div className="crd-terminal-line">&gt; ESTABLISHING LIGHT-MODE/DARK-MODE ADAPTER... OK</div>
                  <div className="crd-terminal-line">&gt; INJECTING MONISH DESIGN DIRECTIVES [100% HUMAN]</div>
                </div>
              </div>

              {/* Text detail block + Interactive Particle Constellation */}
              <div className="crd-showcase-text crd-reveal">
                <div className="crd-showcase-tag">THE MANIFESTO</div>
                <h2 className="crd-showcase-heading">Crafting Without Constraints</h2>
                <p className="crd-showcase-paragraph">
                  Every interaction, from the liquid glass navbar to the cognitive glitch transitions, is designed and engineered by hand. This site is built with pure creative intention and technical precision — no shortcuts, no compromises.
                </p>
                
                <InteractiveConstellation />
              </div>
            </div>
          </section>

          {/* Section 3: Tech Stack & System Close */}
          <section className="crd-section crd-tech-section">
            <div className="crd-tech-content crd-reveal">
              <div className="crd-tech-overline">DEVELOPER PROFILE</div>
              <h2 className="crd-tech-heading">Technical Stack</h2>
              <div className="crd-tech-grid">
                {['React 18', 'Vite', 'CSS Keyframes', 'Glassmorphism', 'HUD Layouts', 'React Router', 'Dynamic Styling', 'Brutalist Design'].map((tech) => (
                  <div className="crd-tech-card" key={tech}>
                    <span className="crd-tech-card-dot" />
                    <span className="crd-tech-card-text">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar with action items */}
            <div className="crd-footer-actions crd-reveal">
              <button className="crd-action-btn crd-action-btn--back" onClick={backToMenu}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6}}><polyline points="15 18 9 12 15 6"/></svg>
                BACK TO MENU
              </button>
              <div className="crd-copyright">© 2026 STRANGEGT</div>
            </div>
          </section>
        </div>
      )}

      {/* ── SGT TRANSITION ── */}
      {transitioning && (
        <div style={{position:'fixed',inset:0,zIndex:99999,pointerEvents:'none',fontFamily:"'Space Grotesk',monospace"}}>
          <div style={{position:'absolute',top:0,left:0,width:'50%',height:'100%',background:'#000',animation:'sgt-nb-panel-left 3.8s ease-in-out forwards'}}>
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(242,207,67,.03) 3px,rgba(242,207,67,.03) 4px)'}}/>
          </div>
          <div style={{position:'absolute',top:0,right:0,width:'50%',height:'100%',background:'#000',animation:'sgt-nb-panel-right 3.8s ease-in-out forwards'}}>
            <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(242,207,67,.03) 3px,rgba(242,207,67,.03) 4px)'}}/>
          </div>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,animation:'sgt-nb-hud 3.8s ease forwards'}}>
            <div style={{textAlign:'center',lineHeight:1}}>
              <span style={{fontFamily:"'Pirata One',cursive",fontSize:'clamp(2.5rem,7vw,5.5rem)',fontWeight:400,color:'#fff',letterSpacing:'0.04em',textTransform:'uppercase',textShadow:'0 2px 18px rgba(0,0,0,0.7)'}}>Strange</span>
              <span style={{fontFamily:"'Anton',sans-serif",fontSize:'clamp(2.5rem,7vw,5.5rem)',fontWeight:400,color:'#ff4655',letterSpacing:'0.02em',textTransform:'uppercase'}}>GT</span>
              <span style={{fontFamily:"'Pirata One',cursive",fontSize:'clamp(2.5rem,7vw,5.5rem)',fontWeight:400,color:'#fff',letterSpacing:'0.04em',textTransform:'uppercase',textShadow:'0 2px 18px rgba(0,0,0,0.7)'}}> Studio</span>
            </div>
            <div style={{fontSize:'0.6rem',color:'#f7f7f7',letterSpacing:'0.3em',textTransform:'uppercase'}}>LAUNCHING STUDIO...</div>
            <div style={{width:160,height:1,background:'rgba(242,207,67,.2)',position:'relative',overflow:'hidden',marginTop:6}}>
              <div style={{position:'absolute',left:0,top:0,height:'100%',background:'#f9f9f9',animation:'sgt-nb-bar 2.4s ease-out 0.4s forwards',width:'0%'}}/>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Nav Transition ── */
        @keyframes sgt-nb-panel-left{0%{transform:translateX(-102%)}50%{transform:translateX(0)}100%{transform:translateX(0)}}
        @keyframes sgt-nb-panel-right{0%{transform:translateX(102%)}50%{transform:translateX(0)}100%{transform:translateX(0)}}
        @keyframes sgt-nb-hud{0%{opacity:0}25%{opacity:0}42%{opacity:1}88%{opacity:1}100%{opacity:0}}
        @keyframes sgt-nb-bar{0%{width:0%}100%{width:100%}}

        /* ── Trigger Orb ── */
        .crd-trigger {
          cursor:pointer; border:none;
          transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, color 0.35s;
        }
        .crd-trigger:hover {
          transform:rotate(220deg) scale(1.18);
          box-shadow:0 0 24px var(--primary,#ff4655), 0 0 60px rgba(255,70,85,.15);
          color:var(--primary,#ff4655);
        }

        /* ══ CREDITS SCROLLING PAGE ══ */
        .crd-page {
          position:fixed; inset:0; z-index:100000;
          overflow-y:auto; overflow-x:hidden;
          scroll-behavior:smooth;
          display:flex; flex-direction:column;
          pointer-events: auto !important;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */

          /* --- Adaptive Color Theme Variables --- */
          --crd-bg: var(--bg-primary, #FAF9F6);
          --crd-fg: var(--text-primary, #1A1A1E);
          --crd-watermark: rgba(0, 0, 0, 0.03);
          --crd-accent: var(--primary, #ff6b35);
          --crd-flower-color: rgba(0, 0, 0, 0.07);
          --crd-border: color-mix(in srgb, var(--crd-accent) 18%, transparent);
          --crd-grid:   color-mix(in srgb, var(--crd-accent) 8%,  transparent);
          --crd-text-muted: rgba(0, 0, 0, 0.45);
          --crd-card-bg: rgba(0, 0, 0, 0.03);

          background: var(--crd-bg);
          color: var(--crd-fg);
          font-family:'Space Grotesk', monospace;
          transition: background 0.4s ease, color 0.4s ease;
        }

        /* Dark mode overrides */
        .crd-page[data-theme='dark'],
        [data-theme='dark'] .crd-page {
          --crd-bg: var(--bg-primary, #121118);
          --crd-fg: var(--text-primary, #eae8e3);
          --crd-watermark: rgba(255, 255, 255, 0.015);
          --crd-accent: var(--primary, #f0e8e4ff);
          --crd-flower-color: rgba(255, 255, 255, 0.07);
          --crd-border: color-mix(in srgb, var(--crd-accent) 22%, transparent);
          --crd-grid:   color-mix(in srgb, var(--crd-accent) 10%, transparent);
          --crd-text-muted: rgba(255, 255, 255, 0.45);
          --crd-card-bg: rgba(255, 255, 255, 0.03);
        }

        /* Fade in/out — replaces clip-path circle wipe which showed the page beneath */
        .crd-page--out {
          opacity: 0;
          pointer-events: none !important;
          transition: opacity 0.35s ease;
        }
        .crd-page--in {
          opacity: 1;
          transition: opacity 0.35s ease;
        }

        /* Hide scrollbars but preserve scrolling */
        .crd-page::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Fixed Top Header bar */
        .crd-fixed-header {
          position: fixed; top: 0; left: 0; right: 0; height: 60px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 40px; z-index: 10; pointer-events: auto;
          border-bottom: 1px solid var(--crd-border);
          backdrop-filter: blur(10px);
          background: color-mix(in srgb, var(--crd-bg) 75%, transparent);
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        .crd-header-title {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
          color: var(--crd-text-muted);
          text-align: center;
        }

        .crd-header-btn {
          background: transparent; border: 1px solid var(--crd-border);
          color: var(--crd-fg); font-family: 'Space Grotesk', monospace;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em;
          padding: 6px 14px; border-radius: 3px; cursor: pointer;
          transition: all 0.2s ease;
          display: flex; align-items: center;
          z-index: 20;
        }
        .crd-header-btn:hover {
          background: var(--crd-fg); color: var(--crd-bg);
          border-color: var(--crd-fg);
        }

        /* Grid Background styling */
        .crd-grid-overlay {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(var(--crd-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--crd-grid) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* Decor elements — accent-synced */
        .crd-plus-decor {
          position: fixed; font-size: 16px; font-weight: 400;
          color: var(--crd-accent); opacity: 0.45; pointer-events: none;
        }
        .crd-plus-decor.top-left { top: 80px; left: 20px; }
        .crd-plus-decor.top-right { top: 80px; right: 20px; }
        .crd-plus-decor.bottom-left { bottom: 20px; left: 20px; }
        .crd-plus-decor.bottom-right { bottom: 20px; right: 20px; }

        /* Marginal HUD decorative tags — accent-synced */
        .crd-decor-tag {
          position: fixed; font-size: 0.52rem; font-weight: 700;
          letter-spacing: 0.25em; color: var(--crd-accent);
          text-transform: uppercase; writing-mode: vertical-lr;
          opacity: 0.4; pointer-events: none; z-index: 5;
        }
        .crd-decor-tag.left-side-1 { left: 16px; top: 120px; }
        .crd-decor-tag.left-side-2 { left: 16px; bottom: 80px; }
        .crd-decor-tag.right-side-1 { right: 16px; top: 120px; transform: rotate(180deg); }
        .crd-decor-tag.right-side-2 { right: 16px; bottom: 80px; transform: rotate(180deg); }

        /* Wavy Sine Curve animation */
        .crd-wave-wrapper {
          position: absolute; top: 40%; left: 0; right: 0; height: 100px;
          pointer-events: none; opacity: 0.75;
        }
        .crd-wave-svg {
          width: 100%; height: 100%;
        }

        /* Sections structure */
        .crd-section {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 6rem 4vw; border-bottom: 1px solid var(--crd-border);
          box-sizing: border-box;
          flex-shrink: 0;
        }

        /* ── SECTION 1: HERO ── */
        .crd-hero-section {
          overflow: hidden;
        }

        /* Giant watermark background */
        .crd-watermark {
          position: absolute; top: 50%; left: 50%;
          font-family: 'Anton', sans-serif;
          font-size: clamp(8rem, 20vw, 18rem);
          font-weight: 400; color: var(--crd-watermark);
          letter-spacing: -0.04em; white-space: nowrap;
          pointer-events: none; user-select: none;
          z-index: 1; transition: transform 0.1s ease-out;
        }

        /* Smooth rotating background flower */
        .crd-flower-container {
          position: absolute; top: 50%; left: 50%;
          width: clamp(280px, 45vw, 600px); height: clamp(280px, 45vw, 600px);
          pointer-events: none; z-index: 2;
          animation: crd-flower-pulse-rotate 22s infinite ease-in-out;
        }
        .crd-flower-svg {
          width: 100%; height: 100%;
        }
        @keyframes crd-flower-pulse-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.96); }
          50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.04); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(0.96); }
        }

        /* Badges */
        .crd-badge {
          position: absolute; display: flex; align-items: center; gap: 8px;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .crd-badge--tl { top: 90px; left: 40px; }
        .crd-badge--tr { top: 90px; right: 40px; }
        .crd-badge-bar {
          width: 8px; height: 12px; background: var(--crd-accent);
        }
        .crd-badge-text {
          background: var(--crd-fg); color: var(--crd-bg);
          padding: 3px 8px; border-radius: 2px;
        }

        /* Central title card */
        .crd-hero-content {
          position: relative; z-index: 3; text-align: center;
        }
        .crd-hero-overline {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.35em;
          color: var(--crd-text-muted); text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        /* ── ULTRA-PREMIUM SMOOTH CHANNEL GLITCH ── */
        .crd-hero-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(5rem, 12vw, 10rem);
          font-weight: 400; line-height: 1; margin: 0;
          color: var(--crd-fg); letter-spacing: 0.01em;
          position: relative;
          filter: url(#crd-brush-distort);
          animation: premium-glow-glitch 6s infinite ease-in-out;
        }

        @keyframes premium-glow-glitch {
          0%, 18%, 23%, 48%, 53%, 78%, 83%, 100% {
            text-shadow: 
              0.5px 0 0 rgba(255, 0, 85, 0.15),
              -0.5px 0 0 rgba(0, 255, 255, 0.15);
            transform: translate3d(0, 0, 0) skewX(0deg);
          }
          19% {
            text-shadow: 
              2.5px 0.5px 0 var(--crd-accent),
              -2.5px -0.5px 0 #ff007f;
            transform: translate3d(-1.5px, 0.5px, 0) skewX(-3deg);
          }
          20% {
            text-shadow: 
              -2.5px -0.5px 0 var(--crd-accent),
              2.5px 0.5px 0 #00ffff;
            transform: translate3d(1.5px, -0.5px, 0) skewX(3deg);
          }
          21% {
            text-shadow: 
              1.5px -1px 0 var(--crd-accent),
              -1.5px 1px 0 #ff007f;
            transform: translate3d(-0.5px, -0.5px, 0) skewX(-1deg);
          }
          22% {
            text-shadow: none;
            transform: translate3d(0, 0, 0) skewX(0deg);
          }
          49% {
            text-shadow: 
              3px 0 0 var(--crd-accent),
              -3px 0 0 #00ffff;
            transform: translate3d(-1px, 1px, 0) skewX(-2deg);
          }
          50% {
            text-shadow: 
              -3px 0 0 var(--crd-accent),
              3px 0 0 #ff007f;
            transform: translate3d(1px, -1px, 0) skewX(2deg);
          }
          51% {
            text-shadow: 
              2px -0.5px 0 var(--crd-accent),
              -2px 0.5px 0 #00ffff;
            transform: translate3d(-0.5px, 0, 0) skewX(-1deg);
          }
          52% {
            text-shadow: none;
            transform: translate3d(0, 0, 0) skewX(0deg);
          }
          79% {
            text-shadow: 
              2.5px 0.5px 0 var(--crd-accent),
              -2.5px -0.5px 0 #ff007f;
            transform: translate3d(-1.5px, 0.5px, 0) skewX(-3deg);
          }
          80% {
            text-shadow: 
              -2.5px -0.5px 0 var(--crd-accent),
              2.5px 0.5px 0 #00ffff;
            transform: translate3d(1.5px, -0.5px, 0) skewX(3deg);
          }
          81% {
            text-shadow: 
              1.5px -1px 0 var(--crd-accent),
              -1.5px 1px 0 #ff007f;
            transform: translate3d(-0.5px, -0.5px, 0) skewX(-1deg);
          }
          82% {
            text-shadow: none;
            transform: translate3d(0, 0, 0) skewX(0deg);
          }
        }

        .crd-hero-underline {
          display: flex; align-items: center; gap: 1.5rem; margin-top: 1.5rem;
        }
        .crd-hero-underline .crd-line {
          width: 80px; height: 1px; background: var(--crd-border);
        }
        .crd-line-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em;
          color: var(--crd-text-muted); text-transform: uppercase;
        }

        /* Scroll indicator */
        .crd-scroll-down {
          position: absolute; bottom: 40px; display: flex; flex-direction: column;
          align-items: center; gap: 8px; z-index: 3;
        }
        .crd-scroll-text {
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em;
          color: var(--crd-text-muted);
        }
        .crd-scroll-arrow {
          animation: scroll-bob 2s infinite ease-in-out;
          color: var(--crd-accent);
        }

        /* ── SEAMLESS SLANTED DOUBLE MARQUEE ── */
        .crd-marquee-section {
          width: 100%; overflow: hidden; padding: 3.5rem 0;
          display: flex; flex-direction: column; gap: 1.5rem;
          background: var(--crd-card-bg);
          border-top: 1px solid var(--crd-border);
          border-bottom: 1px solid var(--crd-border);
          position: relative; z-index: 2;
        }
        .crd-marquee-row {
          display: flex; overflow: hidden; user-select: none;
          font-family: 'Space Grotesk', monospace; font-weight: 700;
          font-size: clamp(1rem, 2.5vw, 1.8rem);
          line-height: 1; letter-spacing: 0.05em;
          text-transform: uppercase; white-space: nowrap;
        }
        .crd-marquee-row--left {
          transform: rotate(-1deg);
          color: var(--crd-fg);
        }
        .crd-marquee-row--right {
          transform: rotate(1deg);
          color: var(--crd-accent);
        }
        .crd-marquee-inner {
          display: flex; width: max-content;
          animation: crd-marquee-run 25s infinite linear;
        }
        .crd-marquee-row--right .crd-marquee-inner {
          animation: crd-marquee-run-reverse 25s infinite linear;
        }
        .crd-marquee-text {
          padding-right: 3rem;
        }
        @keyframes crd-marquee-run {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes crd-marquee-run-reverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        /* ── SECTION 2: SHOWCASE ── */
        .crd-showcase-layout {
          max-width: 1100px; width: 100%;
          display: flex; align-items: center; justify-content: center;
          gap: 5vw; z-index: 2;
        }

        /* HUD Console */
        .crd-hud-console {
          flex-shrink: 0; width: clamp(280px, 35vw, 460px);
          background: rgba(0, 0, 0, 0.04); border: 1px solid var(--crd-border);
          border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 10px 40px rgba(0,0,0,0.02); transition: all 0.3s ease;
        }
        .crd-page[data-theme='dark'] .crd-hud-console {
          background: rgba(255, 255, 255, 0.02);
          box-shadow: 0 15px 50px rgba(0,0,0,0.3);
        }
        .crd-hud-console:hover {
          border-color: var(--crd-accent);
          transform: translateY(-4px);
        }

        .crd-hud-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; background: rgba(0,0,0,0.06);
          border-bottom: 1px solid var(--crd-border);
        }
        .crd-page[data-theme='dark'] .crd-hud-topbar {
          background: rgba(255,255,255,0.04);
        }
        .crd-hud-status {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
          display: flex; align-items: center; gap: 6px;
        }
        .crd-hud-ping-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--crd-accent); animation: ping-glow 1.5s infinite ease-in-out;
        }
        .crd-hud-title {
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.15em;
          color: var(--crd-text-muted);
        }

        .crd-hud-content {
          padding: 24px; display: flex; align-items: center; gap: 24px;
          border-bottom: 1px solid var(--crd-border);
        }
        .crd-hud-ring-wrapper {
          width: 80px; height: 80px; flex-shrink: 0;
        }
        .crd-hud-gear {
          width: 100%; height: 100%;
          animation: spin-gear 12s infinite linear;
          color: var(--crd-accent);
        }
        .crd-gear-reverse {
          animation: spin-gear-rev 8s infinite linear;
          transform-origin: 50px 50px;
        }

        .crd-hud-data {
          flex: 1; display: flex; flex-direction: column; gap: 8px;
        }
        .crd-hud-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.65rem; border-bottom: 1px dashed var(--crd-border);
          padding-bottom: 4px;
        }
        .crd-hud-label {
          color: var(--crd-text-muted); font-weight: 600;
        }
        .crd-hud-val {
          font-weight: 700; color: var(--crd-fg);
        }

        .crd-hud-terminal {
          background: rgba(0,0,0,0.1); padding: 12px 16px;
          font-family: monospace; font-size: 0.52rem; line-height: 1.6;
          color: var(--crd-text-muted); text-align: left;
        }
        .crd-page[data-theme='dark'] .crd-hud-terminal {
          background: rgba(0,0,0,0.4);
        }
        .crd-terminal-line {
          overflow: hidden; white-space: nowrap;
        }

        /* Right text side */
        .crd-showcase-text {
          flex: 1; max-width: 520px;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .crd-showcase-tag {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em;
          color: var(--crd-accent); text-transform: uppercase;
        }
        .crd-showcase-heading {
          font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
          line-height: 1.1; margin: 0; color: var(--crd-fg);
          font-family: 'Space Grotesk', sans-serif;
        }
        .crd-showcase-paragraph {
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          line-height: 1.7; color: var(--crd-text-muted); margin: 0;
        }

        /* ── INTERACTIVE CONSTELLATION GRAPH ── */
        .crd-constellation-container {
          margin-top: 1rem; padding: 1.5rem;
          border: 1px dashed var(--crd-border); border-radius: 6px;
          background: rgba(0, 0, 0, 0.01); position: relative;
          transition: all 0.3s ease;
        }
        .crd-page[data-theme='dark'] .crd-constellation-container {
          background: rgba(255, 255, 255, 0.01);
        }
        .crd-constellation-container:hover {
          border-color: var(--crd-accent);
          background: rgba(0, 0, 0, 0.03);
        }
        .crd-page[data-theme='dark'] .crd-constellation-container:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .crd-constellation-label {
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em;
          color: var(--crd-text-muted); text-transform: uppercase;
          margin-bottom: 0.75rem; text-align: left;
        }
        .crd-constellation-svg {
          width: 100%; height: auto; display: block;
        }
        .crd-const-line {
          stroke: var(--crd-border); stroke-width: 0.8; opacity: 0.45;
        }
        .crd-const-node {
          fill: var(--crd-fg); stroke: var(--crd-bg); stroke-width: 1.5;
        }
        .crd-node-1 { animation: float-n1 4s infinite ease-in-out alternate; }
        .crd-node-2 { animation: float-n2 5s infinite ease-in-out alternate; }
        .crd-node-3 { animation: float-n3 6s infinite ease-in-out alternate; }
        .crd-node-4 { animation: float-n4 4.5s infinite ease-in-out alternate; }
        .crd-node-5 { animation: float-n1 5.5s infinite ease-in-out alternate; }
        .crd-node-6 { animation: float-n2 6.5s infinite ease-in-out alternate; }
        .crd-node-7 { animation: float-n3 4.2s infinite ease-in-out alternate; }

        @keyframes float-n1 { 0% { transform: translate(0, 0); } 100% { transform: translate(5px, 8px); } }
        @keyframes float-n2 { 0% { transform: translate(0, 0); } 100% { transform: translate(-8px, 5px); } }
        @keyframes float-n3 { 0% { transform: translate(0, 0); } 100% { transform: translate(7px, -4px); } }
        @keyframes float-n4 { 0% { transform: translate(0, 0); } 100% { transform: translate(-5px, -7px); } }

        .crd-mouse-pulse {
          animation: pulse-ring 1.5s infinite ease-out;
          transform-origin: center;
        }

        /* ── ULTRA-PREMIUM 3D SCROLL REVEAL EFFECTS ── */
        .crd-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.97) rotateX(3deg);
          transform-origin: top center;
          transition: 
            opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), 
            transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .crd-reveal--active {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
        }

        /* ── SECTION 3: TECH STACK & ACTIONS ── */
        .crd-tech-section {
          justify-content: space-between;
          padding-bottom: 2rem;
        }
        .crd-tech-content {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          max-width: 800px; width: 100%; margin-top: 4vh;
        }
        .crd-tech-overline {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.3em;
          color: var(--crd-text-muted); text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .crd-tech-heading {
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800;
          margin: 0 0 2rem 0; color: var(--crd-fg);
        }
        .crd-tech-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem; width: 100%;
        }
        .crd-tech-card {
          background: var(--crd-card-bg); border: 1px solid var(--crd-border);
          padding: 1.25rem 1rem; border-radius: 4px; display: flex;
          align-items: center; gap: 10px; transition: all 0.25s ease;
        }
        .crd-tech-card:hover {
          background: var(--crd-fg); color: var(--crd-bg);
          border-color: var(--crd-fg); transform: translateY(-2px);
        }
        .crd-tech-card-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--crd-accent);
        }
        .crd-tech-card-text {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Actions bottom row */
        .crd-footer-actions {
          width: 100%; max-width: 1200px;
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 2rem; border-top: 1px solid var(--crd-border);
          margin-top: 6vh;
        }
        .crd-action-btn {
          font-family: 'Space Grotesk', monospace; font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 12px 24px; border-radius: 3px; cursor: pointer;
          transition: all 0.2s ease;
        }
        .crd-action-btn--back {
          background: transparent; border: 1px solid var(--crd-border);
          color: var(--crd-text-muted); display: flex; align-items: center; gap: 8px;
        }
        .crd-action-btn--back:hover {
          background: var(--crd-fg); color: var(--crd-bg);
          border-color: var(--crd-fg); transform: translateX(-4px);
        }
        .crd-copyright {
          font-size: 0.6rem; letter-spacing: 0.15em; color: var(--crd-text-muted);
        }

        /* Responsive overrides */
        @media(max-width:900px){
          .crd-showcase-layout { flex-direction: column; text-align: center; gap: 2.5rem; }
          .crd-showcase-text { align-items: center; }
          .crd-tech-grid { grid-template-columns: repeat(2, 1fr); }
          .crd-fixed-header { padding: 0 20px; }
          .crd-decor-tag { display: none; }
        }

        @media(max-width:600px){
          .crd-tech-grid { grid-template-columns: 1fr; }
          .crd-badge--tl, .crd-badge--tr { display: none; }
          .crd-footer-actions { flex-direction: column; gap: 1.5rem; }
          .crd-hud-content{
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
}


.crd-hud-ring-wrapper{
    width:80px;
    height:80px;
}

.crd-hud-ring-wrapper{
    width:65px;
    height:65px;
}


.crd-hud-row{
    font-size:0.58rem;
}
    .crd-hud-terminal{
    font-size:0.52rem;
    padding:12px; 16px;
    font-family: monospace;
    line-height: 1.6;
    color: var(--crd-txt-muted);


}


.crd-hud-console{
    width:100%;
    max-width:380px;
}

.crd-hud-content{
    flex-direction:column;
    align-items:center;
    text-align:center;
    gap:18px;
}

.crd-hud-ring-wrapper{
    width:65px;
    height:65px;
}

.crd-hud-row{
    font-size:.58rem;
     display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
}

    .crd-hud-row{
   display:flex;
   justify-content:space-between;
   align-items:center;

   border-bottom:1px dashed var(--crd-border);
   padding-bottom:4px;
}

.crd-hud-label{
    color:varr(--crd-text-muted);
    font-weight:600;
min-width:0;
    flex:1;
}
.crd-hud-val{
    width:120px;
    text-align:right;
    flex-shrink:0;
    font-variant-numeric:tabular-nums;
}

          /* Mobile optimization for fixed header */
          .crd-fixed-header {
            padding: 0 16px;
            height: 56px;
          }

          .crd-hud-console{
    width:100%;
    max-width:380px;
}
          .crd-header-title-brand {
            display: none;
          }
          .crd-header-title {
            font-size: 0.58rem;
            letter-spacing: 0.12em;
          }
        }
      `}</style>
    </div>
  );
}
