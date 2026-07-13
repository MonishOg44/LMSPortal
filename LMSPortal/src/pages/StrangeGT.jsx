import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, ArrowUpRight, LayoutDashboard } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', sub: '01' },
  { label: 'About', sub: '02' },
  { label: 'Services', sub: '03' },
  { label: 'Contact', sub: '04' },
];

export default function StrangeGT() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);
  // Skip enter animation if Navbar already played the transition
  const [entering, setEntering] = useState(
    () => sessionStorage.getItem('sgt-nav-transition') !== '1'
  );
  const [exiting, setExiting] = useState(false);
  const [exitingToCollab, setExitingToCollab] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleCollabClick = () => {
    setExitingToCollab(true);
    setTimeout(() => {
      navigate('/collab');
    }, 1500);
  };

  useEffect(() => {
    // Clear the nav-transition flag so refreshes show the animation
    sessionStorage.removeItem('sgt-nav-transition');
    const t = setTimeout(() => setMounted(true), 30);
    // Only set the dismiss timer if we are actually showing the enter overlay
    let t2;
    if (entering) {
      t2 = setTimeout(() => setEntering(false), 4500);
    }
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const sections = {
    home: <HomeSection onCollabClick={handleCollabClick} />,
    about: <AboutSection />,
    services: <ServicesSection />,
    contact: <ContactSection />,
  };


  return (
    <>
      {/* ─── FULLSCREEN MENU OVERLAY ─── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: menuOpen ? 'all' : 'none' }}>
        {/* Dark backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(1,43,29,0.98)',
          backdropFilter: 'blur(20px)',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.77,0,0.175,1)',
        }} />

        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }} />

        {/* Menu content */}
        <div ref={menuRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute', top: '2rem', right: '2rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', width: 52, height: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#ffffff',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.7)',
              transition: 'opacity 0.4s ease 0.35s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s',
            }}
          >
            <X size={20} />
          </button>

          {/* Nav items */}
          <nav>
            {NAV_LINKS.map((link, i) => (
              <div
                key={link.label}
                onClick={() => { setActiveTab(link.label.toLowerCase()); setMenuOpen(false); }}
                className="sgt-menu-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: '2rem',
                  cursor: 'pointer',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.55s ease ${0.1 + i * 0.08}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s`,
                  borderBottom: '1px solid rgba(242,207,67,0.1)',
                  padding: '1.6rem 0',
                }}
              >
                <span style={{
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '0.65rem', fontWeight: 700,
                  color: '#f2cf43', letterSpacing: '0.2em',
                  minWidth: 30,
                }}>
                  {link.sub}
                </span>
                <span className="sgt-menu-label" style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                  fontWeight: 900, color: '#ffffff',
                  lineHeight: 1, letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  transition: 'color 0.25s ease, letter-spacing 0.3s ease',
                }}>
                  {link.label}
                </span>
                <ArrowUpRight size={26} className="sgt-menu-arrow" style={{
                  marginLeft: 'auto', color: 'rgba(255,255,255,0.18)',
                  transition: 'color 0.25s ease, transform 0.3s ease',
                }} />
              </div>
            ))}
          </nav>

          {/* Bottom bar */}
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '8vw', right: '8vw',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.55s',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
          }}>
            <span>©2026 STRANGEGT TECHNOLOGIES</span>
            <span>CREATIVE DIRECTION // PRODUCTION</span>
          </div>
        </div>
      </div>

      {/* ─── PAGE ─── */}
      <div style={{
        position: 'relative', width: '100vw', minHeight: '100vh',
        background: '#eceae5',
        overflowX: 'hidden',
        /* Hide scrollbar completely – scroll still works via mouse wheel */
        overflowY: 'scroll',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE */
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
      className="sgt-page"
      >
        {/* ── HEADER ── */}
        <header className="sgt-header" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          /* Frosted glass blur so scrolling content goes BEHIND it */
          background: 'rgba(236,234,229,0.72)',
          backdropFilter: 'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          borderBottom: '1px solid rgba(1,43,29,0.06)',
          transition: 'background 0.3s ease',
        }}>
          {/* Dashboard back button */}
          <button
            onClick={() => {
              setExiting(true);
              setTimeout(() => navigate('/'), 3400);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '0.85rem',
              color: '#012b1d', letterSpacing: '0.04em',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s ease',
              padding: 0,
            }}
            className="sgt-dash-btn"
          >
            <LayoutDashboard size={15} />
            <span className="sgt-dash-text">Dashboard</span>
          </button>

          {/* Centre active tab pill — with Creative Studio subtitle */}
          <div className="sgt-center-pill" style={{
            background: '#012b1d', borderRadius: '9999px',
            fontFamily: "'Space Grotesk', monospace",
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#f2cf43', display: 'inline-block',
                animation: 'sgt-pulse 2s infinite',
              }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{activeTab}</span>
            </div>
            <span className="sgt-center-sub" style={{ fontSize: '0.52rem', color: 'rgba(242,207,67,0.6)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Creative Studio — Est. 2026</span>
          </div>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: '#012b1d', border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'flex-end',
            }}
            className="sgt-hamburger-btn"
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#ffffff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 14, height: 2, background: '#f2cf43', borderRadius: 2 }} />
          </button>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ paddingTop: '5.5rem' }}>
          {sections[activeTab]}
        </main>

        {/* ── ENTER / EXIT TRANSITION OVERLAYS ── */}
        {entering && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}>
            {/* Left panel */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
              background: '#000000',
              animation: 'sgt-panel-left 3.8s cubic-bezier(0.77,0,0.175,1) forwards',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(242,207,67,0.03) 3px, rgba(242,207,67,0.03) 4px)' }} />
            </div>
            {/* Right panel */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
              background: '#000000',
              animation: 'sgt-panel-right 3.8s cubic-bezier(0.77,0,0.175,1) forwards',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(242,207,67,0.03) 3px, rgba(242,207,67,0.03) 4px)' }} />
            </div>
            {/* Center HUD logo */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
              animation: 'sgt-hud-fade 3.8s ease forwards',
            }}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span style={{ fontFamily: "'Pirata One', cursive", fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 400, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', textShadow: '0 2px 18px rgba(0,0,0,0.7)' }}>Strange</span>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 400, color: '#ff4655', letterSpacing: '0.02em', textTransform: 'uppercase' }}>GT</span>
                <span style={{ fontFamily: "'Pirata One', cursive", fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 400, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', textShadow: '0 2px 18px rgba(0,0,0,0.7)' }}> Studio</span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.65rem', color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', textShadow: '0 0 12px rgba(255,255,255,0.4)' }}>INITIALISING STUDIO...</div>
              <div style={{ width: 200, height: 1, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden', marginTop: 12 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#ffffff', boxShadow: '0 0 8px rgba(255,255,255,0.5)', animation: 'sgt-loadbar 3.2s ease-out 0.3s forwards', width: '0%' }} />
              </div>
            </div>
          </div>
        )}

        {exiting && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}>
            {/* Top panel */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
              background: '#000000', transformOrigin: 'top',
              animation: 'sgt-exit-top 2.2s cubic-bezier(0.77,0,0.175,1) 0.5s both',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(242,207,67,0.03) 3px, rgba(242,207,67,0.03) 4px)' }} />
            </div>
            {/* Bottom panel */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
              background: '#000000', transformOrigin: 'bottom',
              animation: 'sgt-exit-bottom 2.2s cubic-bezier(0.77,0,0.175,1) 0.5s both',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(242,207,67,0.03) 3px, rgba(242,207,67,0.03) 4px)' }} />
            </div>
            {/* Glitch text */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'sgt-exit-text 1.8s ease forwards',
            }}>
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.7rem', color: '#fffefcff', letterSpacing: '0.35em', textTransform: 'uppercase' }}>RETURNING TO DASHBOARD</span>
            </div>
          </div>
        )}

        {exitingToCollab && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'all',
            background: '#000000', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
            animation: 'sgt-warp-fade 0.4s ease-out both'
          }}>
            {/* Digital grid line scanning */}
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,70,85,0.08) 2px, rgba(255,70,85,0.08) 4px)', pointerEvents: 'none' }} />
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              border: '2px solid rgba(255,70,85,0.3)',
              borderTopColor: '#ff4655',
              animation: 'sgt-warp-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: '80%', height: '80%', borderRadius: '50%',
                border: '1px dashed rgba(242,207,67,0.3)',
                borderBottomColor: '#f2cf43',
                animation: 'sgt-warp-spin-reverse 0.8s linear infinite',
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 10 }}>
              <div style={{
                fontFamily: "'Space Grotesk', monospace", fontSize: '0.85rem', color: '#ff4655',
                letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(255,70,85,0.6)', animation: 'sgt-warp-glitch 1.5s infinite'
              }}>
                INITIALIZING TRANSACTION...
              </div>
              <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
                SECURING END-TO-END UPI CHANNEL
              </div>
            </div>
          </div>
        )}

        {/* ── GLOBAL STYLES ── */}
        <style>{`
          /* Hide webkit scrollbar */
          .sgt-page::-webkit-scrollbar { display: none; }

          /* ── ENTER: left/right panels split open ── */
          @keyframes sgt-panel-left {
            0%   { transform: translateX(0); opacity: 1; }
            78%  { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(-102%); opacity: 0; }
          }
          @keyframes sgt-panel-right {
            0%   { transform: translateX(0); opacity: 1; }
            78%  { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(102%); opacity: 0; }
          }
          @keyframes sgt-hud-fade {
            0%   { opacity: 0; }
            8%   { opacity: 1; }
            68%  { opacity: 1; }
            90%  { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes sgt-loadbar {
            0%   { width: 0%; }
            100% { width: 100%; }
          }

          /* ── EXIT: top/bottom panels close inward ── */
          @keyframes sgt-exit-top {
            0%   { transform: scaleY(0); }
            100% { transform: scaleY(1); }
          }
          @keyframes sgt-exit-bottom {
            0%   { transform: scaleY(0); }
            100% { transform: scaleY(1); }
          }
           @keyframes sgt-exit-text {
            0%   { opacity: 0; }
            35%  { opacity: 0; }
            65%  { opacity: 1; }
            100% { opacity: 1; }
          }

          @keyframes sgt-warp-fade {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes sgt-warp-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes sgt-warp-spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes sgt-warp-glitch {
            0%, 100% { transform: skew(0deg); }
            20% { transform: skew(-3deg); }
            40% { transform: skew(3deg); }
            60% { transform: skew(-1deg); }
            80% { transform: skew(2deg); }
          }

          @keyframes sgt-pulse {
            0%, 100% { opacity: 0.35; transform: scale(0.8); }
            50%       { opacity: 1;    transform: scale(1); }
          }
          @keyframes sgt-float-back {
            0%, 100% { transform: rotate(12deg) translate(30px, -40px); }
            50%       { transform: rotate(10deg) translate(30px, -52px); }
          }
          @keyframes sgt-float-front {
            0%, 100% { transform: rotate(-4deg) translate(-15px, 35px); }
            50%       { transform: rotate(-5.5deg) translate(-15px, 25px); }
          }

          .sgt-dash-btn:hover { opacity: 0.55 !important; }

          /* SVG path draw-on animation */
          @keyframes sgt-draw-path {
            to { stroke-dashoffset: 0; }
          }

          .sgt-menu-item:hover .sgt-menu-label {
            color: #f2cf43 !important;
            letter-spacing: 0.01em !important;
          }
          .sgt-menu-item:hover .sgt-menu-arrow {
            color: #f2cf43 !important;
            transform: translate(5px, -5px) !important;
          }

          .sgt-collab-btn:hover {
            background: #012b1d !important;
            color: #f2cf43 !important;
            box-shadow: 0 10px 35px rgba(1,43,29,0.25) !important;
            transform: translateY(-2px) !important;
          }

          .sgt-services-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            min-height: 480px;
            flex: 1;
          }
          .sgt-service-tile {
            padding: 3rem;
            transition: filter 0.3s ease;
          }
          .sgt-service-tile:hover { filter: brightness(1.1); }

          .sgt-home-cards {
            position: relative;
            width: 280px;
            height: 200px;
            flex-shrink: 0;
          }
          .sgt-home-card-back {
            position: absolute;
            width: 240px;
            height: 155px;
            border-radius: 22px;
            background: linear-gradient(135deg, #f0714b 0%, #4ca2a8 55%, #2f3e46 100%);
            box-shadow: 0 24px 60px rgba(0,0,0,0.18);
            animation: sgt-float-back 7s ease-in-out infinite;
            right: 0;
            top: 0;
            z-index: 1;
            overflow: hidden;
          }
          .sgt-home-card-front {
            position: absolute;
            width: 240px;
            height: 155px;
            border-radius: 22px;
            background: linear-gradient(160deg, #c8d8cf 0%, #e0eae6 100%);
            box-shadow: 0 28px 65px rgba(0,0,0,0.16);
            animation: sgt-float-front 7s ease-in-out infinite;
            right: 28px;
            top: 36px;
            z-index: 2;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 16px;
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .sgt-header {
              padding: 0.75rem 1rem !important;
            }
            .sgt-dash-text {
              display: none !important;
            }
            .sgt-center-sub {
              display: none !important;
            }
            .sgt-services-grid {
              grid-template-columns: 1fr !important;
              min-height: auto !important;
            }
            .sgt-service-tile {
              padding: 1.75rem 1.5rem !important;
            }
            .sgt-service-tile h3 {
              margin-bottom: 0.5rem !important;
            }
          }

          @media (max-width: 480px) {
            .sgt-home-cards {
              width: 220px !important;
              height: 160px !important;
            }
            .sgt-home-card-back {
              width: 185px !important;
              height: 120px !important;
            }
            .sgt-home-card-front {
              width: 185px !important;
              height: 120px !important;
              right: 20px !important;
              top: 28px !important;
              padding: 10px !important;
            }
            .sgt-home-card-front div:nth-child(2) {
              padding: 6px 10px !important;
              border-radius: 8px !important;
            }
            .sgt-home-card-front div:nth-child(2) div:first-child {
              font-size: 0.52rem !important;
            }
            .sgt-home-card-front div:nth-child(2) div:last-child {
              font-size: 0.46rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   HOME SECTION
══════════════════════════════════════════════════════ */
function HomeSection({ onCollabClick }) {
  return (
    <section style={{
      minHeight: 'calc(100vh - 5.5rem)',
      background: '#eceae5',
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '3rem 5vw 2rem',
      boxSizing: 'border-box',
    }}>

      {/* Background watermark wrapper to prevent overflow without clipping floating cards */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(12rem, 28vw, 24rem)',
          fontWeight: 900, lineHeight: 1,
          color: 'rgba(1,43,29,0.04)',
          userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.06em', whiteSpace: 'nowrap',
        }}>SGT</div>
      </div>

      {/* ── Row 1: cards only ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', zIndex: 1 }}>

        {/* Floating stacked cards — top right */}
        <div className="sgt-home-cards">
          {/* Back card */}
          <div className="sgt-home-card-back">
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 55%)' }} />
          </div>
          {/* Front card */}
          <div className="sgt-home-card-front">
            <div style={{ position: 'absolute', width: 70, height: 110, background: 'rgba(0,0,0,0.55)', borderRadius: '50%', filter: 'blur(18px)', right: 38, top: 10, transform: 'rotate(-8deg)' }} />
            <div style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 12, padding: '9px 13px', zIndex: 3 }}>
              <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#012b1d' }}>strangegt studio</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.58rem', color: '#3b5247', marginTop: 3 }}>Creative Direction // Production</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Giant headline ── */}
      <div style={{ zIndex: 1, margin: '1.5rem 0 2rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.4rem, 11vw, 10rem)',
          fontWeight: 900, lineHeight: 0.88,
          letterSpacing: '-0.04em', color: '#012b1d',
          textTransform: 'uppercase', margin: 0,
        }}>
          BRINGING YOUR<br />
          <em style={{ fontStyle: 'italic', WebkitTextStroke: '2px #012b1d', WebkitTextFillColor: 'transparent' }}>VISION</em>
          <span style={{ color: '#f32e2eff' }}> TO</span> LIFE.
        </h1>
      </div>

      {/* ── Row 3: subtext + CTA ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', zIndex: 1 }}>
        <div style={{ maxWidth: 440 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
            lineHeight: 1.55, color: '#012b1d',
            margin: '0 0 0.6rem 0', fontWeight: 700, fontStyle: 'italic',
          }}>
            Imagination meets engineering.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.85rem, 1.3vw, 0.98rem)',
            lineHeight: 1.85, color: '#4a6358',
            margin: 0, fontWeight: 400,
          }}>
            We craft brand experiences that move people — blending strategy, storytelling,
            and living interfaces that grow with your business.
          </p>
        </div>

        <button className="sgt-collab-btn" onClick={onCollabClick} style={{
          background: '#f83737ff', color: '#012b1d', border: 'none',
          padding: '15px 36px', borderRadius: '9999px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.92rem', fontWeight: 800, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 10,
          boxShadow: '0 10px 35px rgba(250, 243, 243, 0.45)',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          letterSpacing: '0.02em', flexShrink: 0,
        }}>
          Support the Creator
          <ArrowRight size={17} />
        </button>
      </div>

      {/* ── Footer strip (original style) ── */}
      <div style={{
        marginTop: '2.5rem',
        borderTop: '1px solid rgba(1,43,29,0.1)',
        paddingTop: '1.25rem',
        display: 'flex', flexWrap: 'wrap',
        gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Space Grotesk', monospace",
        fontSize: '0.65rem', color: 'rgba(1,43,29,0.38)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        zIndex: 1,
      }}>
        <span>©2026 strangegt technologies</span>
        <span>/creating since 2026</span>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   ABOUT SECTION
══════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section style={{ minHeight: 'calc(100vh - 5.5rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Dark hero band */}
      <div style={{ background: '#012b1d', padding: '5rem 4vw 4rem', position: 'relative', overflow: 'hidden', flex: '0 0 auto' }}>
        <div style={{
          position: 'absolute', right: '-3rem', top: '-4rem',
          fontFamily: "'Playfair Display', serif", fontSize: '20rem', fontWeight: 900,
          color: 'rgba(255,255,255,0.03)', userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.06em',
        }}>A</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>

          {/* Title + doodles cluster */}
          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 900, lineHeight: 0.88,
              letterSpacing: '-0.04em', color: '#ffffff', textTransform: 'uppercase', margin: 0,
            }}>
              ABOUT<br />
              <span style={{ WebkitTextStroke: '2px rgba(242,207,67,0.6)', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>US.</span>
            </h2>

            {/* Wavy underline beneath ABOUT */}
            <svg viewBox="0 0 200 12" fill="none" style={{ width: '100%', marginTop: 6, opacity: 0.25 }}>
              <path d="M 0,6 C 25,0 50,12 75,6 C 100,0 125,12 150,6 C 175,0 195,10 200,6"
                stroke="#f2cf43" strokeWidth="2" strokeLinecap="round" fill="none"
                style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'sgt-draw-path 1.2s ease 0.2s forwards' }}
              />
            </svg>

            {/* Floating gold dot cluster */}
            <svg style={{ position: 'absolute', top: '-0.8rem', right: '-2.5rem', opacity: 0.5 }} width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="8" cy="8" r="3" fill="#f2cf43"/>
              <circle cx="22" cy="5" r="1.8" fill="#f2cf43" opacity="0.5"/>
              <circle cx="30" cy="16" r="2.5" fill="#f2cf43" opacity="0.7"/>
              <circle cx="16" cy="28" r="1.5" fill="#f2cf43" opacity="0.4"/>
            </svg>
          </div>

          {/* Right side: arrow + body text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 420 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              We are a creative engineering studio sitting at the intersection of engineering and art — where every system we build feels alive.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ num: '01', label: 'Who we are' }, { num: '02', label: 'Our philosophy' }, { num: '03', label: 'Founded 2026' }].map((s, i) => (
            <div key={s.num} style={{ flex: '1 1 160px', padding: '1.5rem 2rem', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.6rem', color: '#f2cf43', letterSpacing: '0.2em', marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards on cream */}
      <div style={{ flex: 1, background: '#eceae5', padding: '4rem 4vw', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {[
          { num: '01', title: 'Who we are', body: 'strangegt technologies is a creative engineering studio designing systems that feel organic, highly interactive, and completely responsive.', bg: '#012b1d', color: '#ffffff', accent: '#f2cf43' },
          { num: '02', title: 'Our philosophy', body: 'We believe interfaces should feel alive. Every pixel, transition, and interaction is intentional — crafted to pull users into an experience.', bg: '#f2cf43', color: '#012b1d', accent: '#012b1d' },
          { num: '03', title: 'Founded 2026', body: 'A young studio with senior-level ambition. Our work spans liquid UI systems, real-time dashboards, and custom AI-integrated tools.', bg: 'rgba(1,43,29,0.05)', color: '#012b1d', accent: '#012b1d', border: '1.5px solid rgba(1,43,29,0.1)' },
        ].map((card, i) => (
          <div key={card.num}
            style={{ flex: '1 1 240px', background: card.bg, border: card.border, borderRadius: 24, padding: '2.2rem', transform: i === 1 ? 'translateY(-16px)' : 'none', boxShadow: card.bg === '#f2cf43' ? '0 20px 50px rgba(242,207,67,0.25)' : card.bg === '#012b1d' ? '0 20px 50px rgba(1,43,29,0.18)' : 'none', transition: 'transform 0.35s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = i === 1 ? 'translateY(-24px)' : 'translateY(-8px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = i === 1 ? 'translateY(-16px)' : 'none'; }}
          >
            <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', color: card.accent, opacity: 0.7, marginBottom: '1.2rem' }}>{card.num}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 800, color: card.color, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{card.title}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", color: card.color, opacity: 0.7, lineHeight: 1.72, fontSize: '0.9rem', margin: 0 }}>{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICES SECTION
══════════════════════════════════════════════════════ */
function ServicesSection() {
  const items = [
    { label: 'Refractive Interface Design', desc: 'Liquid glass, SVG waveforms, dynamic transitions.', tag: 'UI / MOTION', bg: '#012b1d', color: '#fff' },
    { label: 'Real-time Telemetry', desc: 'Live hardware metrics & animated visualization engines.', tag: 'ENGINEERING', bg: '#f2cf43', color: '#012b1d' },
    { label: 'Brand Strategy', desc: 'Positioning, storytelling frameworks, identity systems.', tag: 'STRATEGY', bg: 'rgba(1,43,29,0.05)', color: '#012b1d', border: '1.5px solid rgba(1,43,29,0.1)' },
    { label: 'AI Integration', desc: 'Custom LLM pipelines, smart UX triggers, data surfaces.', tag: 'AI / ML', bg: '#2f3e46', color: '#fff' },
  ];
  return (
    <section style={{ minHeight: 'calc(100vh - 5.5rem)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '4rem 4vw 2.5rem', background: '#eceae5', position: 'relative', overflow: 'hidden' }}>

        {/* Doodle: large faint circle top-right */}
        <svg style={{ position: 'absolute', top: '-3rem', right: '-3rem', opacity: 0.05 }} width="220" height="220" viewBox="0 0 220 220" fill="none">
          <circle cx="110" cy="110" r="105" stroke="#012b1d" strokeWidth="3"/>
          <circle cx="110" cy="110" r="75" stroke="#012b1d" strokeWidth="1.5"/>
        </svg>

        {/* Doodle: 3 small dots scattered */}
        <div style={{ position: 'absolute', top: '1.8rem', right: '6vw', display: 'flex', gap: 7, opacity: 0.25 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#012b1d' }}/>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#012b1d' }}/>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#012b1d' }}/>
        </div>

        {/* Doodle: cross mark bottom-left */}
        <svg style={{ position: 'absolute', bottom: '1.5rem', left: '3vw', opacity: 0.12 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="2" y1="2" x2="18" y2="18" stroke="#012b1d" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18" y1="2" x2="2" y2="18" stroke="#012b1d" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Title block */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', color: '#012b1d', textTransform: 'uppercase' }}>
              SERV<span style={{ fontStyle: 'italic' }}>ICES</span><span style={{ color: '#f2cf43' }}>.</span>
            </div>
            {/* Wavy underline */}
            <svg viewBox="0 0 220 12" fill="none" style={{ width: '100%', marginTop: 8, opacity: 0.3 }}>
              <path d="M 0,6 C 30,0 55,12 80,6 C 105,0 130,12 160,6 C 185,0 210,10 220,6"
                stroke="#f2cf43" strokeWidth="2.2" strokeLinecap="round" fill="none"
                style={{ strokeDasharray: 240, strokeDashoffset: 240, animation: 'sgt-draw-path 1.2s ease 0.2s forwards' }}
              />
            </svg>
          </div>

        </div>
      </div>
      <div className="sgt-services-grid">
        {items.map((item, i) => (
          <div key={item.label} className="sgt-service-tile"
            style={{ background: item.bg, border: item.border, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'filter 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
          >
            <div style={{ position: 'absolute', bottom: '-1.5rem', right: '1rem', fontFamily: "'Playfair Display', serif", fontSize: '9rem', fontWeight: 900, lineHeight: 1, color: item.color === '#fff' ? 'rgba(255,255,255,0.05)' : 'rgba(1,43,29,0.05)', userSelect: 'none', pointerEvents: 'none' }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: item.color, opacity: 0.5, border: `1px solid ${item.color === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(1,43,29,0.2)'}`, padding: '4px 10px', borderRadius: '9999px' }}>{item.tag}</span>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: item.color === '#fff' ? 'rgba(255,255,255,0.1)' : 'rgba(1,43,29,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color={item.color} />
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '0 0 0.75rem 0' }}>{item.label}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: item.color, opacity: 0.65, margin: 0, lineHeight: 1.6, maxWidth: 280 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   CONTACT SECTION — 3D Rotating Card
══════════════════════════════════════════════════════ */
function ContactSection() {
  const cardRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const autoRotRef = React.useRef({ y: 0, x: 8 });
  const dragRef = React.useRef({ dragging: false, startX: 0, startY: 0, rotX: 8, rotY: 0 });
  const [isDark, setIsDark] = React.useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const [rotX, setRotX] = React.useState(8);
  const [rotY, setRotY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  // Sync dark mode
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Auto-rotate loop
  React.useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      if (!dragRef.current.dragging) {
        autoRotRef.current.y += 0.35;
        setRotY(autoRotRef.current.y);
        setRotX(autoRotRef.current.x);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  // Mouse drag handlers
  const onMouseDown = (e) => {
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      rotX: autoRotRef.current.x,
      rotY: autoRotRef.current.y,
    };
    setDragging(true);
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newRotY = dragRef.current.rotY + dx * 0.45;
    const newRotX = Math.max(-35, Math.min(35, dragRef.current.rotX - dy * 0.45));
    autoRotRef.current = { x: newRotX, y: newRotY };
    setRotX(newRotX);
    setRotY(newRotY);
  };
  const onMouseUp = () => {
    dragRef.current.dragging = false;
    setDragging(false);
  };

  // Touch drag handlers
  const onTouchStart = (e) => {
    const t = e.touches[0];
    dragRef.current = {
      dragging: true,
      startX: t.clientX,
      startY: t.clientY,
      rotX: autoRotRef.current.x,
      rotY: autoRotRef.current.y,
    };
  };
  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    const newRotY = dragRef.current.rotY + dx * 0.45;
    const newRotX = Math.max(-35, Math.min(35, dragRef.current.rotX - dy * 0.45));
    autoRotRef.current = { x: newRotX, y: newRotY };
    setRotX(newRotX);
    setRotY(newRotY);
  };
  const onTouchEnd = () => { dragRef.current.dragging = false; };

  // Theme-aware colors
  const bg        = isDark ? '#0e0d12' : '#eceae5';
  const textPrimary = isDark ? '#ffffff' : '#012b1d';
  const textMuted   = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(1,43,29,0.38)';
  const borderCol   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(1,43,29,0.08)';

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 480);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardW = isMobile ? Math.min(320, window.innerWidth - 32) : 380;
  const cardH = isMobile ? (cardW * 230) / 380 : 230;

  const normalizedRotY = ((rotY % 360) + 360) % 360;
  const showBack = normalizedRotY > 90 && normalizedRotY < 270;

  const faceBase = {
    position: 'absolute', width: '100%', height: '100%',
    borderRadius: isMobile ? 18 : 26, backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  return (
    <section
      style={{ minHeight: 'calc(100vh - 5.5rem)', background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4rem 5vw 2.5rem', boxSizing: 'border-box', transition: 'background 0.4s ease' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Heading */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Title */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.04em', color: textPrimary, textTransform: 'uppercase', transition: 'color 0.4s ease' }}>
              GET IN<br />
              <span style={{ WebkitTextStroke: `2px ${textPrimary}`, WebkitTextFillColor: 'transparent', fontStyle: 'italic', transition: 'all 0.4s ease' }}>TOUCH.</span>
            </div>
            {/* Wavy underline */}
            <svg viewBox="0 0 230 12" fill="none" style={{ width: '100%', marginTop: 8, opacity: isDark ? 0.3 : 0.2 }}>
              <path d="M 0,6 C 30,0 55,12 85,6 C 115,0 140,12 170,6 C 195,0 215,10 230,6"
                stroke={isDark ? '#f2cf43' : '#012b1d'} strokeWidth="2" strokeLinecap="round" fill="none"
                style={{ strokeDasharray: 250, strokeDashoffset: 250, animation: 'sgt-draw-path 1.2s ease 0.2s forwards' }}
              />
            </svg>
            {/* Gold dot cluster */}
            <div style={{ position: 'absolute', top: '-0.5rem', right: '-2rem', display: 'flex', gap: 5, opacity: 0.55 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f2cf43' }}/>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f2cf43', marginTop: -1 }}/>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f2cf43', marginTop: 2 }}/>
            </div>
          </div>

          {/* 4-point sparkle star */}
          <svg style={{ marginTop: '1.2rem', opacity: isDark ? 0.45 : 0.18, flexShrink: 0, animation: 'sgt-float-front 5s ease-in-out infinite' }} width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2 L15.5 12.5 L26 8 L16.5 15 L24 22 L14 17.5 L6 24 L12 16 L2 10 L12.5 13 Z" fill={isDark ? '#f2cf43' : '#012b1d'} opacity="0.8"/>
          </svg>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: textMuted, marginTop: '1.5rem', maxWidth: 420, lineHeight: 1.75, transition: 'color 0.4s ease' }}>
          Have a project in mind? Flip the card and let’s start something great together.
        </p>
      </div>

      {/* 3D Card Stage */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <div
          style={{ perspective: '900px', perspectiveOrigin: '50% 50%', width: cardW, height: cardH, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <div
            ref={cardRef}
            style={{
              width: '100%', height: '100%', position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: dragging ? 'none' : 'transform 0.05s linear',
            }}
          >
            {/* ── FRONT FACE ── */}
            <div style={{ 
              ...faceBase, 
              background: 'linear-gradient(135deg, #4d050a 0%, #9e0e1b 60%, #ff4655 100%)', 
              boxShadow: '0 40px 100px rgba(158,14,27,0.5), inset 0 1px 0 rgba(255,255,255,0.08)', 
              overflow: 'hidden',
              visibility: showBack ? 'hidden' : 'visible',
              opacity: showBack ? 0 : 1,
              transition: 'opacity 0.15s ease'
            }}>
              {/* Sheen overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
              {/* Noise grain */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', pointerEvents: 'none' }} />
              {/* Glowing dot */}
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,207,67,0.18) 0%, transparent 70%)', top: -60, right: -30, pointerEvents: 'none' }} />
              
              {/* Vertical stripes on the right side */}
              <div style={{ position: 'absolute', top: 0, right: isMobile ? 44 : 60, bottom: 0, width: isMobile ? 10 : 14, background: '#ffffff', opacity: 1, zIndex: 1 }} />
              <div style={{ position: 'absolute', top: 0, right: isMobile ? 26 : 36, bottom: 0, width: isMobile ? 3 : 4, background: '#ffffff', opacity: 1, zIndex: 1 }} />

              {/* Logo chip */}
              <div style={{ position: 'absolute', top: isMobile ? 14 : 22, left: isMobile ? 16 : 24, display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, zIndex: 2 }}>
                <div style={{ width: isMobile ? 8 : 10, height: isMobile ? 8 : 10, borderRadius: '50%', background: '#f2cf43', boxShadow: '0 0 10px rgba(242,207,67,0.7)', animation: 'sgt-pulse 2s infinite' }} />
                <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: isMobile ? '0.52rem' : '0.6rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#f2cf43' }}>strangegt</span>
              </div>
              {/* Chip icon */}
              <div style={{ position: 'absolute', bottom: isMobile ? 55 : 75, left: isMobile ? 16 : 24, zIndex: 2 }}>
                <div style={{ width: isMobile ? 34 : 42, height: isMobile ? 26 : 32, borderRadius: 5, border: '1.5px solid rgba(242,207,67,0.35)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 2, padding: 3, boxSizing: 'border-box' }}>
                  {Array(9).fill(0).map((_,i) => <div key={i} style={{ borderRadius: 1, background: i % 2 === 0 ? 'rgba(242,207,67,0.3)' : 'rgba(242,207,67,0.1)' }} />)}
                </div>
              </div>
              {/* Card number */}
              <div style={{ position: 'absolute', bottom: isMobile ? 14 : 22, left: isMobile ? 16 : 24, zIndex: 2 }}>
                <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: isMobile ? '0.85rem' : '1.05rem', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.85)' }}>9940252059</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '0.48rem' : '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>strangegt technologies · creative studio</div>
              </div>
              {/* Wave lines */}
              <svg style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.06, zIndex: 2 }} width="160" height="120" viewBox="0 0 160 120">
                <path d="M0 80 Q40 40 80 80 Q120 120 160 80" fill="none" stroke="white" strokeWidth="2"/>
                <path d="M0 60 Q40 20 80 60 Q120 100 160 60" fill="none" stroke="white" strokeWidth="2"/>
                <path d="M0 40 Q40 0 80 40 Q120 80 160 40" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </div>

            {/* ── BACK FACE ── */}
            <div style={{ 
              ...faceBase, 
              background: isDark ? '#18161f' : '#f2cf43', 
              transform: 'rotateY(180deg)', 
              overflow: 'hidden', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.25)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: isMobile ? '1.2rem 1.4rem' : '2rem 2.2rem', 
              boxSizing: 'border-box', 
              transition: 'background 0.4s ease, opacity 0.15s ease',
              visibility: showBack ? 'visible' : 'hidden',
              opacity: showBack ? 1 : 0
            }}>
              {/* Sheen */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 50%)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: isMobile ? '0.52rem' : '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(1,43,29,0.45)', marginBottom: isMobile ? '0.6rem' : '1rem' }}>Drop us a like</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.15rem' : '1.55rem', fontWeight: 800, color: isDark ? '#ffffff' : '#012b1d', lineHeight: 1.2, marginBottom: isMobile ? '0.8rem' : '1.2rem', transition: 'color 0.4s ease', wordBreak: 'break-all' }}>
                monish2005n@gmail.com
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem', flexWrap: 'wrap' }}>
                {['Instagram', 'LinkedIn', 'YouTube'].map(s => (
                  <span key={s} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: isMobile ? '4px 8px' : '5px 12px', borderRadius: '9999px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(1,43,29,0.2)'}`, color: isDark ? 'rgba(255,255,255,0.7)' : '#012b1d', cursor: 'pointer', transition: 'all 0.3s ease' }}>{s}</span>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 22, fontFamily: "'Space Grotesk', monospace", fontSize: '0.52rem', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(1,43,29,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>est. 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.6rem', color: textMuted, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'color 0.4s ease' }}>
          drag to rotate · auto-spinning · flip to see contact
        </span>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${borderCol}`, paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Space Grotesk', monospace", fontSize: '0.65rem', color: textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.4s ease' }}>
        <span>©2026 strangegt technologies</span>
        <span>/creating since 2026</span>
      </div>
    </section>
  );
}
