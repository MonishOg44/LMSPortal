import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { ArrowLeft, Zap, Sparkles, Award } from 'lucide-react';

const RANKS = [
  { id: 1, name: 'Bronze',    threshold: 0,    color: '#c07830', symbol: 'Ⅰ', desc: 'Your journey begins. Every legend starts here.' },
  { id: 2, name: 'Silver',    threshold: 50,   color: '#718096', symbol: 'Ⅱ', desc: 'Consistency is your weapon. Keep going.' },
  { id: 3, name: 'Gold',      threshold: 100,  color: '#c8a000', symbol: 'Ⅲ', desc: 'The grind is paying off. Brilliance achieved.' },
  { id: 4, name: 'Diamond',   threshold: 200,  color: '#0099cc', symbol: 'Ⅳ', desc: 'Clarity and precision. You\'re unstoppable.' },
  { id: 5, name: 'Crown',     threshold: 350,  color: '#8b5cf6', symbol: 'Ⅴ', desc: 'Royalty in the making. Wear it well.' },
  { id: 6, name: 'Elite',     threshold: 500,  color: '#ea580c', symbol: 'Ⅵ', desc: 'Above the rest. Performance is your identity.' },
  { id: 7, name: 'Dominator', threshold: 700,  color: '#dc2626', symbol: 'Ⅶ', desc: 'Fear is for others. You dominate every field.' },
  { id: 8, name: 'Conqueror', threshold: 950,  color: '#0d9488', symbol: 'Ⅷ', desc: 'Conquest complete. The battlefield is yours.' },
  { id: 9, name: 'Legend',    threshold: 1250, color: '#db2777', symbol: 'Ⅸ', desc: 'Immortal. Your name echoes through the system.' },
];

const PERKS = {
  Bronze: 'Access to basic academy modules. System telemetry tracking activated.',
  Silver: 'Access to intermediate sandbox labs. Unlocked Silver level custom profile color.',
  Gold: 'Priority support response channels. Exclusive beta access to new course material.',
  Diamond: '1-on-1 development mentorship session monthly. Advanced terminal analyzer tool.',
  Crown: 'Custom title in strangeGT directory. Beta compiler access and highlighted badge.',
  Elite: 'Direct communication channel to core engineers. Reward store special discounts.',
  Dominator: 'Exclusive developer hackathon invitations. Featured profile in the database.',
  Conqueror: 'Design advisory board voting rights. Co-author official academy modules.',
  Legend: 'Immortalized on the Hall of Legends. All future course modules free forever.',
};

const RANK_VISUALS = {
  Bronze: {
    bgLight: '#faf7f2',
    bgDark: '#0e0c0b',
    accentLight: '#4d3019',
    accentDark: '#e3be98',
    tagline: 'YOUR JOURNEY INCEPTION',
    slogan: ['BRONZE', 'MEETS', 'INITIATIVE'],
    metallicGradient: 'linear-gradient(135deg, #4d3019 0%, #8c6239 50%, #c07830 100%)',
  },
  Silver: {
    bgLight: '#f4f6f9',
    bgDark: '#0a0c0e',
    accentLight: '#27303f',
    accentDark: '#cbd5e1',
    tagline: 'CONSISTENCY IS THE WEAPON',
    slogan: ['SILVER', 'MEETS', 'STABILITY'],
    metallicGradient: 'linear-gradient(135deg, #1e293b 0%, #718096 50%, #cbd5e1 100%)',
  },
  Gold: {
    bgLight: '#fcfaf2',
    bgDark: '#0d0c0a',
    accentLight: '#6b3205',
    accentDark: '#fbbf24',
    tagline: 'THE GRIND BECOMES BRILLIANCE',
    slogan: ['GOLD', 'MEETS', 'MASTERY'],
    metallicGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #ffd700 100%)',
  },
  Diamond: {
    bgLight: '#f3f9fc',
    bgDark: '#080d12',
    accentLight: '#075985',
    accentDark: '#38bdf8',
    tagline: 'CLARITY AND PRECISION',
    slogan: ['DIAMOND', 'MEETS', 'PRECISION'],
    metallicGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)',
  },
  Crown: {
    bgLight: '#f9f6fc',
    bgDark: '#0d0a14',
    accentLight: '#4c1d95',
    accentDark: '#c084fc',
    tagline: 'ROYALTY IN THE MAKING',
    slogan: ['CROWN', 'MEETS', 'DOMINION'],
    metallicGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)',
  },
  Elite: {
    bgLight: '#fdf8f5',
    bgDark: '#120b08',
    accentLight: '#7c2d12',
    accentDark: '#fdba74',
    tagline: 'PERFORMANCE IS IDENTITY',
    slogan: ['ELITE', 'MEETS', 'STATUS'],
    metallicGradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fdba74 100%)',
  },
  Dominator: {
    bgLight: '#fdf5f5',
    bgDark: '#140808',
    accentLight: '#7f1d1d',
    accentDark: '#fca5a5',
    tagline: 'FEAR IS FOR OTHERS',
    slogan: ['DOMINATOR', 'MEETS', 'POWER'],
    metallicGradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #fca5a5 100%)',
  },
  Conqueror: {
    bgLight: '#f2faf8',
    bgDark: '#060d0c',
    accentLight: '#115e59',
    accentDark: '#2dd4bf',
    tagline: 'THE BATTLEFIELD IS YOURS',
    slogan: ['CONQUEROR', 'MEETS', 'VICTORY'],
    metallicGradient: 'linear-gradient(135deg, #115e59 0%, #0d9488 50%, #2dd4bf 100%)',
  },
  Legend: {
    bgLight: '#fdf8f9',
    bgDark: '#0b060c',
    accentLight: '#4a044e',
    accentDark: '#ff7bd5',
    tagline: 'IMMORTAL IN THE SYSTEM',
    slogan: ['LEGEND', 'MEETS', 'ETERNITY'],
    metallicGradient: 'linear-gradient(135deg, #ff60bf 0%, #ff6e8b 50%, #ff3276 100%)',
  },
};

const getPerkShortName = (name) => {
  const map = {
    Bronze: 'Basic Modules',
    Silver: 'Sandbox Labs',
    Gold: 'Priority Support',
    Diamond: 'Mentorship',
    Crown: 'Custom Title',
    Elite: 'Reward Store',
    Dominator: 'Hackathons',
    Conqueror: 'Advisory Board',
    Legend: 'Free Modules',
  };
  return map[name] || 'Perks Unlocked';
};

export default function RankPage() {
  const navigate = useNavigate();
  const { timeSpent, streak, getCertificates, theme } = useProgress();
  const certs = getCertificates();
  const completedCount = certs.length;
  const rankScore = Math.round((timeSpent / 60) * 10 + completedCount * 20 + streak * 5);
  
  const curIdx   = RANKS.reduce((f, r, i) => rankScore >= r.threshold ? i : f, 0);
  
  // State variables
  const [displayIdx, setDisplayIdx] = useState(curIdx);
  const [transitionState, setTransitionState] = useState('idle'); // 'idle' | 'leaving' | 'entering'
  const [pageEntering, setPageEntering] = useState(true);
  const [direction, setDirection] = useState('right'); // 'left' | 'right'
  const [counter, setCounter] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Swipe gesture variables
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const minSwipeDistance = 50;

  // On mount page-in animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageEntering(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Update counter score
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.ceil(rankScore / 40));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, rankScore);
      setCounter(cur);
      if (cur >= rankScore) clearInterval(iv);
    }, 15);
    return () => clearInterval(iv);
  }, [rankScore]);

  // Mouse Parallax Track
  const handleMouseMove = useCallback((e) => {
    if (transitionState !== 'idle') return; // Pause updates during rank changes
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, [transitionState]);

  // Mouse swipe (drag) handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    if (e.target.closest('button') || e.target.closest('a')) return;
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (dragStartX === null) return;
    const distance = dragStartX - e.clientX;
    const minDragDistance = 60;

    if (distance > minDragDistance) {
      handleNav(displayIdx + 1);
    } else if (distance < -minDragDistance) {
      handleNav(displayIdx - 1);
    }
    setDragStartX(null);
  };

  // Reset mouse position when mouse leaves the page
  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 });
    setDragStartX(null);
  };

  // Premium transition handler
  const handleNav = useCallback((newIdx) => {
    if (newIdx < 0 || newIdx >= RANKS.length || newIdx === displayIdx) return;
    setDirection(newIdx > displayIdx ? 'right' : 'left');
    setTransitionState('leaving');
    setMouse({ x: 0, y: 0 }); // Center parallax elements prior to transitioning
    
    setTimeout(() => {
      setDisplayIdx(newIdx);
      setTransitionState('entering');
      
      setTimeout(() => {
        setTransitionState('idle');
      }, 40);
    }, 220);
  }, [displayIdx]);

  const handleBack = () => {
    setTransitionState('exiting-page');
    setTimeout(() => navigate('/profile'), 600);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handleNav(displayIdx - 1);
      } else if (e.key === 'ArrowRight') {
        handleNav(displayIdx + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayIdx, transitionState, handleNav]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNav(displayIdx + 1);
    } else if (isRightSwipe) {
      handleNav(displayIdx - 1);
    }
  };

  const displayRank = RANKS[displayIdx];
  const nextRank = RANKS[displayIdx + 1] || null;
  const isUnlocked = rankScore >= displayRank.threshold;

  const progressToNext = nextRank
    ? ((rankScore - displayRank.threshold) /
        (nextRank.threshold - displayRank.threshold)) * 100
    : 100;

  const activeVisual = RANK_VISUALS[displayRank.name] || RANK_VISUALS.Bronze;
  const currentBg = theme === 'dark' ? activeVisual.bgDark : activeVisual.bgLight;
  const currentAccent = theme === 'dark' ? activeVisual.accentDark : activeVisual.accentLight;
  const currentBadgeBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff';
  
  // Calculate dynamic atmospheric aura color base (soft glowing backdrop mesh)
  const dynamicAuraColor = theme === 'dark' ? `${displayRank.color}22` : `${displayRank.color}15`;

  const exitTranslate = direction === 'right' ? '-45px' : '45px';
  const enterTranslate = direction === 'right' ? '45px' : '-45px';

  return (
    <div 
      className={`rank-matcha-root transition--${transitionState} dir--${direction} ${pageEntering ? 'page-entering' : ''}`}
      style={{ 
        backgroundColor: currentBg, 
        color: currentAccent,
        '--accent-color': currentAccent,
        '--bg-color': currentBg,
        '--badge-bg': currentBadgeBg,
        '--aura-color': dynamicAuraColor,
        '--exit-translate': exitTranslate,
        '--enter-translate': enterTranslate
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,900;1,400;1,900&family=Caveat:wght@400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@800&display=swap');

        .rank-matcha-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 1.5rem 1rem;
          transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          overflow-y: auto; /* Always allow vertical scrolling when vertical space overflows */
          overflow-x: hidden;
          font-family: 'Space Grotesk', sans-serif;
          
          /* Organic mesh glow backdrops */
          background-image: radial-gradient(circle at 50% 50%, var(--aura-color) 0%, transparent 68%);
        }

        /* High-end Film Grain Overlay - placed at very top but non-interactive */
        .noise-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          pointer-events: none;
          z-index: 99;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        [data-theme='dark'] .noise-overlay {
          opacity: 0.045;
        }

        @media (min-width: 768px) {
          .rank-matcha-root {
            padding: 1.5rem 2rem;
          }
        }

        @media (min-width: 1025px) {
          .rank-matcha-root {
            padding: 2rem 3.5rem;
          }
        }

        /* Tech HUD Corner Braces - ultra thin and minimalist */
        .hud-corner-brace {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid var(--accent-color);
          opacity: 0.15;
          pointer-events: none;
          z-index: 10;
        }
        .brace-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
        .brace-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
        .brace-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
        .brace-br { bottom: 20px; right: 20px; border-left: none; border-top: none; }

        /* Giant Watermark Roman Numeral - z-index updated to sit in background */
        .giant-watermark-num {
          position: absolute;
          top: 52%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 26vw;
          font-family: 'Instrument Serif', serif;
          font-weight: 900;
          font-style: italic;
          pointer-events: none;
          z-index: 1; 
          line-height: 1;
          text-align: center;
          transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Celestial Astronomical Trajectory Lines - placed behind content wrapper */
        .bg-orbital-paths {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 1;
        }

        .bg-orbit {
          position: absolute;
          border: 1px solid var(--accent-color);
          border-radius: 50%;
          opacity: 0.025;
          transition: all 0.8s ease;
        }

        [data-theme='dark'] .bg-orbit {
          opacity: 0.05;
        }

        .orbit-1 { width: 500px; height: 500px; }
        .orbit-2 { width: 820px; height: 820px; }
        .orbit-3 { width: 1140px; height: 1140px; }

        .rank-matcha-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          opacity: 0.8;
          min-height: 50px;
          z-index: 10;
        }

        .rank-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: 700;
          letter-spacing: inherit;
          color: inherit;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .rank-back-btn:hover {
          transform: translateX(-4px);
        }

        .rank-header-title {
          text-transform: uppercase;
          text-align: center;
        }

        .rank-theme-indicator {
          text-transform: uppercase;
        }

        /* Container acts as a safe stacking context anchor */
        .rank-matcha-container {
          position: relative;
          z-index: 10;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start; /* Start naturally from the top when overflowing */
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 0;
        }

        /* Content wrapper that hardware accelerates transitions */
        .rank-matcha-content-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: auto 0; /* Auto margins center vertically when space exists, but snap to top when height overflows */
          min-height: min-content;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        /* Slide Transition states */
        .transition--leaving .rank-matcha-content-wrapper {
          opacity: 0;
          transform: translate3d(var(--exit-translate), 0, 0) scale(0.97);
          transition: transform 0.22s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.22s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .transition--entering .rank-matcha-content-wrapper {
          opacity: 0;
          transform: translate3d(var(--enter-translate), 0, 0) scale(0.97);
          transition: none !important;
        }

        .transition--idle .rank-matcha-content-wrapper {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .rank-matcha-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2rem;
        }

        .rank-matcha-title {
          font-family: 'Instrument Serif', 'Playfair Display', serif;
          font-size: clamp(3.8rem, 11vw, 9.5rem);
          font-style: italic;
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -3px;
          margin: 0;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: lowercase;
        }

        .rank-matcha-btn {
          margin-top: 1.5rem;
          padding: 0.55rem 1.5rem;
          border-radius: 99px;
          border: 1.5px solid currentColor;
          background: transparent;
          color: inherit;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .rank-matcha-btn:hover {
          background: var(--accent-color);
          color: var(--bg-color);
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .rank-matcha-grid {
          display: grid;
          grid-template-columns: 1fr 300px 1.2fr;
          align-items: center;
          gap: 2rem;
          width: 100%;
          transition: all 0.5s ease;
        }

        .rank-matcha-left {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          height: 100%;
          justify-content: center;
        }

        .handwritten-pointer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: inherit;
          font-family: 'Caveat', cursive;
          font-size: 1.5rem;
          line-height: 1;
          transform: rotate(-6deg) translate(-10px, -15px);
          opacity: 0.95;
          width: 100%;
          max-width: 180px;
        }

        .handwritten-arrow {
          margin-top: 4px;
          transform: scaleX(-1) rotate(15deg);
        }

        .badges-arc-container {
          position: relative;
          width: 220px;
          height: 320px;
        }

        .badges-arc-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          color: inherit;
        }

        .arc-badge {
          position: absolute;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge-1 {
          top: 10%;
          right: 10%;
        }

        .badge-2 {
          top: 45%;
          left: 5%;
        }

        .badge-3 {
          top: 80%;
          right: 10%;
        }

        .badge-card {
          width: 105px;
          height: 120px;
          border-radius: 12px;
          background: color-mix(in srgb, var(--badge-bg) 60%, transparent);
          border: 1.5px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          box-shadow: 
            0 12px 30px rgba(0, 0, 0, 0.05),
            inset 0 1px 1px color-mix(in srgb, var(--accent-color) 15%, transparent);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 8px 10px 10px;
          box-sizing: border-box;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }

        /* Subtle Corner Braces for the individual tech cards */
        .badge-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-radius: 12px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent-color) 40%, transparent) 0%, transparent 40%, transparent 60%, color-mix(in srgb, var(--accent-color) 40%, transparent) 100%) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.4;
          transition: opacity 0.4s ease;
        }

        /* Shimmer reflection glint effect on hover */
        .badge-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          transform: skewX(-20deg);
          transition: none;
        }

        .badge-card:hover::after {
          left: 150%;
          transition: left 0.7s ease-in-out;
        }

        .badge-card:hover {
          transform: translateY(-5px) scale(1.04);
          box-shadow: 
            0 16px 35px rgba(0, 0, 0, 0.08),
            0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent);
          border-color: var(--accent-color);
        }

        .badge-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 2px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .badge-card-index {
          font-size: 0.55rem;
          font-weight: 700;
          opacity: 0.4;
          letter-spacing: 0.05em;
        }

        /* Tiny status dot indicating unlocked / active status */
        .badge-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-color);
          box-shadow: 0 0 8px var(--accent-color);
          position: relative;
        }

        .badge-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          opacity: 0.85;
          margin: 2px 0;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge-card:hover .badge-card-icon {
          transform: rotate(12deg) scale(1.15);
          opacity: 1;
        }

        .badge-value {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          line-height: 1.1;
          color: inherit;
          text-align: center;
          letter-spacing: -0.01em;
          margin-top: 1px;
        }

        .badge-value.font-benefit {
          font-size: 0.6rem;
          font-weight: 800;
          line-height: 1.2;
          max-width: 90px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-transform: uppercase;
        }

        .badge-label {
          font-size: 0.52rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          opacity: 0.55;
          margin-top: 2px;
          color: inherit;
          text-align: center;
        }

        .badge-card:hover .badge-label {
          opacity: 0.85;
          color: var(--accent-color);
        }

        .rank-matcha-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* 10,000 Dollar Premium Medallion Styles */
        .medal-container {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .medal-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid var(--accent-color);
          pointer-events: none;
          transition: all 0.8s ease;
        }

        .ring-outer {
          width: 320px;
          height: 320px;
          border-style: dashed;
          opacity: 0.22;
          animation: spin-clockwise 25s linear infinite;
        }

        .ring-mid {
          width: 270px;
          height: 270px;
          border-width: 1.5px;
          border-style: double;
          opacity: 0.12;
          animation: spin-counter-clockwise 18s linear infinite;
        }

        .ring-inner {
          width: 220px;
          height: 220px;
          border-style: dotted;
          opacity: 0.4;
          animation: spin-clockwise 12s linear infinite;
        }

        /* Floating orbital particles */
        .orbital-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          opacity: 0.7;
          filter: blur(0.5px);
          pointer-events: none;
          animation: orbit 8s linear infinite;
        }

        .p1 {
          animation-duration: 6s;
          animation-delay: 0s;
          top: 10%;
          left: 20%;
        }
        .p2 {
          animation-duration: 9s;
          animation-delay: -3s;
          bottom: 15%;
          right: 10%;
        }
        .p3 {
          animation-duration: 12s;
          animation-delay: -6s;
          top: 70%;
          left: 5%;
        }

        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(125px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(125px) rotate(-360deg); }
        }

        /* 3D Medal Body */
        .medal-3d-body {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          z-index: 2;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          cursor: pointer;
        }

        .medal-rim {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 8px; /* Thickness of rim */
          box-shadow: 
            inset 0 4px 10px rgba(255,255,255,0.4), 
            inset 0 -4px 10px rgba(0,0,0,0.4),
            0 15px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .medal-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          transition: background 0.8s ease;
        }

        .medal-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.45;
        }

        .medal-shield {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          box-shadow: 
            0 10px 25px rgba(0,0,0,0.3), 
            inset 0 2px 5px rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transform: translateZ(25px); /* Pop out in 3D */
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .medal-symbol {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 2.2rem;
          color: #ffffff;
          text-shadow: 0 3px 6px rgba(0,0,0,0.4);
        }

        .medal-gloss {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 65%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 4;
          transform: rotate(45deg);
          transition: transform 0.1s ease-out;
        }

        .medal-aura {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
          transition: background 0.8s ease;
        }

        [data-theme='dark'] .medal-aura {
          opacity: 0.32;
          filter: blur(80px);
        }

        .rank-matcha-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding-left: 1.5rem;
        }

        .slogan-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 1.5rem;
        }

        .slogan-word {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 4.8vw, 4rem);
          font-weight: 800;
          line-height: 0.85;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .slogan-word.word-1 {
          color: #ffffff;
          text-shadow: 1.5px 1.5px 0 var(--accent-color), -1.5px -1.5px 0 var(--accent-color), 1.5px -1.5px 0 var(--accent-color), -1.5px 1.5px 0 var(--accent-color);
        }

        [data-theme='dark'] .slogan-word.word-1 {
          color: var(--accent-color);
          text-shadow: none;
        }

        .slogan-word.word-2, .slogan-word.word-3 {
          color: var(--accent-color);
        }

        .description-paragraph {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
          opacity: 0.85;
          max-width: 380px;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 340px;
          width: 100%;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .progress-track-wrapper {
          width: 100%;
          height: 3px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 99px;
          overflow: hidden;
        }

        [data-theme='dark'] .progress-track-wrapper {
          background: rgba(255, 255, 255, 0.1);
        }

        .progress-fill-bar {
          height: 100%;
          background: var(--accent-color);
          border-radius: 99px;
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .score-summary {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          opacity: 0.8;
          margin-top: 2px;
        }

        .rank-matcha-footer {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          padding-top: 1rem;
          min-height: 50px;
          z-index: 10;
        }

        .navigation-hints {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.6;
          text-align: center;
        }

        .rank-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dot-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          transform: scale(1.3);
        }

        .dot-btn.locked {
          opacity: 0.4;
        }

        .transition--exiting-page {
          animation: pageSlideOut 0.6s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        @keyframes pageSlideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-40px); opacity: 0; filter: blur(10px); }
        }

        /* Page Entry Animations */
        .page-entering .rank-matcha-header {
          animation: slideDownIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .page-entering .rank-matcha-top {
          animation: centerScaleIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .page-entering .rank-matcha-grid {
          animation: slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .page-entering .rank-matcha-footer {
          animation: slideUpIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideDownIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideUpIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes centerScaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* ==========================================================================
           RESPONSIVE STYLE SHEETS & BREAKPOINTS
           ========================================================================== */

        /* HEIGHT-BASED RESPONSIVENESS (for smaller vertical screens / laptops) */
        @media (max-height: 850px) {
          .rank-matcha-top {
            margin-bottom: 1rem;
          }
          .rank-matcha-title {
            font-size: clamp(3.5rem, 8vw, 7rem) !important;
          }
          .slogan-word {
            font-size: clamp(1.8rem, 3.5vw, 3rem) !important;
          }
          .medal-container {
            width: 230px !important;
            height: 230px !important;
          }
          .medal-3d-body {
            width: 150px !important;
            height: 150px !important;
          }
          .ring-outer { width: 270px !important; height: 270px !important; }
          .ring-mid { width: 230px !important; height: 230px !important; }
          .ring-inner { width: 190px !important; height: 190px !important; }
          .badges-arc-container {
            height: 260px !important;
          }
          .badge-card {
            width: 88px !important;
            height: 102px !important;
            padding: 6px 8px 8px !important;
          }
          .badge-card-icon svg {
            width: 15px !important;
            height: 15px !important;
          }
          .badge-value {
            font-size: 0.8rem !important;
          }
          .badge-value.font-benefit {
            font-size: 0.52rem !important;
            max-width: 72px !important;
          }
          .badge-label {
            font-size: 0.46rem !important;
          }
          .description-paragraph {
            margin-bottom: 1.2rem;
          }
        }
        
        @media (max-height: 720px) {
          .rank-matcha-top {
            margin-bottom: 0.5rem;
          }
          .rank-matcha-title {
            font-size: clamp(3rem, 6vw, 5.5rem) !important;
          }
          .slogan-word {
            font-size: clamp(1.5rem, 3vw, 2.4rem) !important;
          }
          .medal-container {
            width: 190px !important;
            height: 190px !important;
          }
          .medal-3d-body {
            width: 120px !important;
            height: 120px !important;
          }
          .ring-outer { width: 220px !important; height: 220px !important; }
          .ring-mid { width: 190px !important; height: 190px !important; }
          .ring-inner { width: 160px !important; height: 160px !important; }
          .badges-arc-container {
            height: 200px !important;
            width: 160px !important;
          }
          .badge-card {
            width: 78px !important;
            height: 92px !important;
            padding: 5px 6px 6px !important;
          }
          .badge-card-icon svg {
            width: 13px !important;
            height: 13px !important;
          }
          .badge-value {
            font-size: 0.72rem !important;
          }
          .badge-value.font-benefit {
            font-size: 0.48rem !important;
            max-width: 66px !important;
          }
          .badge-label {
            font-size: 0.42rem !important;
          }
          .description-paragraph {
            margin-bottom: 0.8rem !important;
          }
        }

        /* WIDTH-BASED RESPONSIVENESS */

        /* Mid-sized Screens / Small Desktops (1025px - 1280px) */
        @media (max-width: 1280px) and (min-width: 1025px) {
          .rank-matcha-grid {
            grid-template-columns: 1fr 260px 1fr;
            gap: 1.5rem;
          }
          .rank-matcha-title {
            font-size: clamp(4rem, 8vw, 7.5rem);
          }
          .slogan-word {
            font-size: clamp(2rem, 3.8vw, 3.2rem);
          }
          .medal-container {
            width: 250px;
            height: 250px;
          }
          .medal-3d-body {
            width: 160px;
            height: 160px;
          }
          .ring-outer { width: 290px; height: 290px; }
          .ring-mid { width: 250px; height: 250px; }
          .ring-inner { width: 200px; height: 200px; }
          .badges-arc-container {
            width: 190px;
            height: 280px;
          }
          .badge-card {
            width: 95px;
            height: 110px;
            padding: 6px 8px 8px;
          }
          .badge-value {
            font-size: 0.85rem;
          }
          .badge-value.font-benefit {
            font-size: 0.56rem;
            max-width: 80px;
          }
          .badge-label {
            font-size: 0.48rem;
          }
        }

        /* Tablets & Mobile Screens (<= 1024px) */
        @media (max-width: 1024px) {
          .rank-matcha-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
          }
          .rank-matcha-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            order: 2;
            height: auto;
          }
          .handwritten-pointer {
            align-items: center;
            transform: rotate(0) translate(0);
            margin-bottom: 1rem;
            max-width: 100%;
          }
          .handwritten-arrow {
            display: none;
          }
          .badges-arc-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 1.5rem;
            width: 100%;
            height: auto;
          }
          .badges-arc-line {
            display: none;
          }
          .arc-badge {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
          }
          .badge-card {
            width: 95px;
            height: 110px;
            padding: 6px 8px 8px;
          }
          .badge-value {
            font-size: 0.85rem;
          }
          .badge-value.font-benefit {
            font-size: 0.56rem;
            max-width: 80px;
          }
          .badge-label {
            font-size: 0.48rem;
          }
          .rank-matcha-center {
            order: 1;
            margin: 1.5rem 0;
          }
          .medal-container {
            width: 220px;
            height: 220px;
          }
          .medal-3d-body {
            width: 150px;
            height: 150px;
          }
          .medal-shield {
            width: 76px;
            height: 76px;
          }
          .medal-symbol {
            font-size: 1.8rem;
          }
          .ring-outer { width: 250px; height: 250px; }
          .ring-mid { width: 210px; height: 210px; }
          .ring-inner { width: 170px; height: 170px; }
          .rank-matcha-right {
            order: 3;
            align-items: center;
            padding-left: 0;
          }
          .slogan-container {
            align-items: center;
            margin-bottom: 1.2rem;
          }
          .description-paragraph {
            max-width: 100%;
            margin-bottom: 1.5rem;
          }
          .progress-section {
            max-width: 100%;
          }
        }

        /* Responsive behavior for header */
        @media (max-width: 850px) {
          .rank-header-title {
            display: none;
          }
        }

        /* Mobile specific adjustments (<= 480px) */
        @media (max-width: 480px) {
          .rank-matcha-title {
            font-size: 3.5rem !important;
            letter-spacing: -1.5px;
          }
          .slogan-word {
            font-size: 2.2rem !important;
          }
          .badge-card {
            width: 86px;
            height: 100px;
            padding: 6px 8px 8px;
          }
          .badge-value {
            font-size: 0.78rem;
          }
          .badge-value.font-benefit {
            font-size: 0.52rem;
            max-width: 70px;
          }
          .badge-label {
            font-size: 0.45rem;
          }
        }
      `}</style>

      {/* FILM GRAIN TEXTURE */}
      <div className="noise-overlay" />

      {/* TECH DECALS CORNERS */}
      <div className="hud-corner-brace brace-tl" />
      <div className="hud-corner-brace brace-tr" />
      <div className="hud-corner-brace brace-bl" />
      <div className="hud-corner-brace brace-br" />

      {/* GIANT WATERMARK - placed at z-index: 1 with fade-out in transit */}
      <div 
        className="giant-watermark-num"
        style={{ 
          transform: `translate(calc(-50% + ${mouse.x * -18}px), calc(-50% + ${mouse.y * -10}px))`,
          opacity: transitionState !== 'idle' ? 0 : (theme === 'dark' ? 0.06 : 0.035),
          color: currentAccent
        }}
      >
        {displayRank.symbol}
      </div>

      {/* CELESTIAL ORBITS */}
      <div className="bg-orbital-paths">
        <div 
          className="bg-orbit orbit-1" 
          style={{ transform: `translate(${mouse.x * -35}px, ${mouse.y * -20}px)` }}
        />
        <div 
          className="bg-orbit orbit-2" 
          style={{ transform: `translate(${mouse.x * -25}px, ${mouse.y * -14}px)` }}
        />
        <div 
          className="bg-orbit orbit-3" 
          style={{ transform: `translate(${mouse.x * -15}px, ${mouse.y * -8}px)` }}
        />
      </div>

      {/* HEADER SECTION */}
      <header className="rank-matcha-header">
        <button className="rank-back-btn" onClick={handleBack}>
          <ArrowLeft size={15} style={{ strokeWidth: 2.5 }} />
          <span>Back to Profile</span>
        </button>
        <span className="rank-header-title">Ranking System</span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="rank-matcha-container">
        
        {/* Unified sliding content wrapper */}
        <div className="rank-matcha-content-wrapper">
          
          {/* Title & Badge button */}
          <div className="rank-matcha-top">
            <h1 
              className="rank-matcha-title"
              style={{ transform: `translate(${mouse.x * 12}px, ${mouse.y * 6}px)` }}
            >
              {displayRank.name}
            </h1>
            <button 
              className="rank-matcha-btn"
              onClick={() => handleNav(displayIdx + 1)}
            >
              <span>{isUnlocked ? '↗ Active Rank' : `↗ Unlock at ${displayRank.threshold} XP`}</span>
            </button>
          </div>

          {/* 3-Column Content Layout */}
          <div className="rank-matcha-grid">
            
            {/* Left Column: Stats & Perks */}
            <div className="rank-matcha-left">
              <div className="handwritten-pointer">
                <span>certified perks</span>
                <svg className="handwritten-arrow" viewBox="0 0 100 40" width="70" height="30">
                  <path 
                    d="M10,10 Q50,35 90,15" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3" 
                  />
                  <path 
                    d="M90,15 L78,16 M90,15 L86,27" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                  />
                </svg>
              </div>

              <div className="badges-arc-container">
                <svg className="badges-arc-line" viewBox="0 0 200 300" width="200" height="300" fill="none">
                  <path d="M180,30 Q80,150 180,270" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                </svg>
                
                <div className="arc-badge badge-1" style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }}>
                  <div className="badge-card">
                    <div className="badge-card-header">
                      <span className="badge-card-index">[ 01 ]</span>
                      <span className="badge-status-dot" />
                    </div>
                    <div className="badge-card-icon">
                      <Zap size={18} strokeWidth={2.5} />
                    </div>
                    <span className="badge-value">{displayRank.threshold}</span>
                    <span className="badge-label">XP Req</span>
                  </div>
                </div>

                <div className="arc-badge badge-2" style={{ transform: `translate(${mouse.x * -6}px, ${mouse.y * 4}px)` }}>
                  <div className="badge-card">
                    <div className="badge-card-header">
                      <span className="badge-card-index">[ 02 ]</span>
                      <span className="badge-status-dot" />
                    </div>
                    <div className="badge-card-icon">
                      <Sparkles size={18} strokeWidth={2.5} />
                    </div>
                    <span className="badge-value font-benefit">
                      {getPerkShortName(displayRank.name)}
                    </span>
                    <span className="badge-label">Benefit</span>
                  </div>
                </div>

                <div className="arc-badge badge-3" style={{ transform: `translate(${mouse.x * 4}px, ${mouse.y * -6}px)` }}>
                  <div className="badge-card">
                    <div className="badge-card-header">
                      <span className="badge-card-index">[ 03 ]</span>
                      <span className="badge-status-dot" />
                    </div>
                    <div className="badge-card-icon">
                      <Award size={18} strokeWidth={2.5} />
                    </div>
                    <span className="badge-value">{displayRank.symbol}</span>
                    <span className="badge-label">Tier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: Interactive 3D Medal */}
            <div className="rank-matcha-center">
              <div className="medal-container">
                {/* Spinning circular background elements */}
                <div className="medal-ring ring-outer" />
                <div className="medal-ring ring-mid" />
                <div className="medal-ring ring-inner" />
                
                {/* Floating orbiters */}
                <div className="orbital-particle p1" style={{ background: displayRank.color }} />
                <div className="orbital-particle p2" style={{ background: displayRank.color }} />
                <div className="orbital-particle p3" style={{ background: displayRank.color }} />
                
                {/* 3D Medal Body */}
                <div 
                  className="medal-3d-body"
                  style={{
                    transform: `rotateY(${mouse.x * 22}deg) rotateX(${mouse.y * -22}deg)`,
                    boxShadow: `0 30px 60px rgba(0, 0, 0, 0.4), 0 0 50px ${displayRank.color}33`
                  }}
                >
                  <div className="medal-rim" style={{ background: activeVisual.metallicGradient }}>
                    <div className="medal-core" style={{ background: theme === 'dark' ? '#0f0f13' : '#faf9f6' }}>
                      <div className="medal-pattern">
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.3" />
                          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
                          <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.25" opacity="0.2" />
                        </svg>
                      </div>

                      <div className="medal-shield" style={{ background: activeVisual.metallicGradient }}>
                        <span className="medal-symbol">{displayRank.symbol}</span>
                      </div>

                      <div 
                        className="medal-gloss" 
                        style={{ transform: `translateX(${mouse.x * 50}px) translateY(${mouse.y * 50}px) rotate(45deg)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Backglow blur aura */}
                <div className="medal-aura" style={{ background: displayRank.color }} />
              </div>
            </div>

            {/* Right Column: Slogan & Details */}
            <div className="rank-matcha-right">
              <div 
                className="slogan-container"
                style={{ transform: `translate(${mouse.x * -8}px, ${mouse.y * -4}px)` }}
              >
                <h2 className="slogan-word word-1">{activeVisual.slogan[0]}</h2>
                <h2 className="slogan-word word-2">{activeVisual.slogan[1]}</h2>
                <h2 className="slogan-word word-3">{activeVisual.slogan[2]}</h2>
              </div>

              <p className="description-paragraph">
                {displayRank.desc} {PERKS[displayRank.name]}
              </p>

              <div className="progress-section">
                <div className="progress-label-row">
                  <span>Progress compiling</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <div className="progress-track-wrapper">
                  <div 
                    className="progress-fill-bar"
                    style={{ width: `${isUnlocked ? progressToNext : 0}%` }}
                  />
                </div>
                <div className="score-summary">
                  <span>Score: {counter} XP</span>
                  <span>Next: {nextRank ? `${nextRank.threshold} XP` : 'MAX TIER'}</span>
                </div>
              </div>
            </div>

          </div>
          
        </div>

      </main>

      {/* FOOTER CONTROLS */}
      <footer className="rank-matcha-footer">
        <div className="navigation-hints">
          <span>← Swipe left/right or use arrow keys to navigate ranks →</span>
        </div>
        <div className="rank-dots">
          {RANKS.map((r, idx) => (
            <button 
              key={r.id}
              className={`dot-btn ${idx === displayIdx ? 'active' : ''} ${rankScore >= r.threshold ? 'unlocked' : 'locked'}`}
              onClick={() => handleNav(idx)}
              title={r.name}
            />
          ))}
        </div>
      </footer>

    </div>
  );
}
