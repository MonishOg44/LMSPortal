import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan } from 'lucide-react';

/* ── Info rows — defined before component to avoid ReferenceError ── */
const infoRows = [
  { label: 'Recipient', value: 'Monish' },
  { label: 'Platform',  value: 'Google Pay (GPay)' },
  { label: 'Method',    value: 'UPI / QR Scan' },
  { label: 'Studio',    value: 'StrangeGT Technologies' },
  { label: 'Est.',      value: '2026' },
];

/* ── Google "G" colourful logo rendered as SVG ── */
function GPAYLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* Multi-colour G */}
      <svg width="52" height="52" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4"
          d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1
             0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11
             0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
        <path fill="#34A853"
          d="M6.3 14.7l7 5.1C15.1 16 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1
             29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
        <path fill="#FBBC05"
          d="M24 46c5.5 0 10.5-1.9 14.3-5l-6.6-5.5C29.5 37.1 26.9 38 24 38c-5.8 0-10.6-3.9
             -12.3-9.3l-7 5.4C8.3 41.7 15.6 46 24 46z"/>
        <path fill="#EA4335"
          d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.5C42.2 36.3 45 31 45 24c0
             -1.3-.2-2.7-.5-4z"/>
      </svg>

      {/* "Pay" text */}
      <div>
        <div style={{
          fontFamily: "'Product Sans', 'Google Sans', 'Inter', sans-serif",
          fontSize: '2.2rem', fontWeight: 500,
          color: '#ffffff', lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>Pay</div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.55rem', letterSpacing: '0.28em',
          color: '#ffffff',
          opacity: 0.85,
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>Google</div>
      </div>
    </div>
  );
}

/* ── Corner HUD bracket ── */
function HUDCorner({ pos, color }) {
  const borderStyles = {
    tl: { borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, top: 12, left: 12, borderRadius: '6px 0 0 0' },
    tr: { borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, top: 12, right: 12, borderRadius: '0 6px 0 0' },
    bl: { borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, bottom: 12, left: 12, borderRadius: '0 0 0 6px' },
    br: { borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, bottom: 12, right: 12, borderRadius: '0 0 6px 0' },
  }[pos];
  return (
    <div style={{
      position: 'absolute', width: 22, height: 22,
      ...borderStyles,
    }} />
  );
}

export default function CollabPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const infoRows = [
    { label: 'Recipient',  value: 'Monish' },
    { label: 'Platform',   value: 'Google Pay (GPay)' },
    { label: 'Method',     value: 'UPI / QR Scan' },
    { label: 'Studio',     value: 'StrangeGT Technologies' },
    { label: 'Est.',       value: '2026' },
  ];

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: '#090909ff',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.8s ease',
      fontFamily: "'Space Grotesk', monospace",
    }}>

      {/* ── Grid background ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(242,207,67,0.015) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(242,207,67,0.015) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* ── Scanlines ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      }} />

      {/* ── Radial glows ── */}
      <div style={{ position: 'absolute', top: -220, left: -180, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,67,53,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -220, right: -180, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,168,83,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,188,5,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {/* ── HEADER ── */}
      <header className="collab-header" style={{
        position: 'relative', zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Left: Back button */}
        <button
          onClick={() => navigate('/strangegt')}
          className="collab-back-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9999,
            color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
            fontSize: '0.7rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {/* Right: Payment Portal capsule */}
        <div className="collab-portal-capsule" style={{
          background: 'rgba(66,133,244,0.12)',
          border: '1px solid rgba(66,133,244,0.25)',
          borderRadius: 9999,
          fontSize: '0.62rem', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
          boxShadow: '0 0 15px rgba(66,133,244,0.15)',
        }}>
          ● Payment Portal
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="collab-main" style={{
        position: 'relative', zIndex: 20,
      }}>

        {/* ─── LEFT: GPay logo + QR card ─── */}
        <div className="collab-left-pane" style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
        }}>

          {/* GPay Logo */}
          <GPAYLogo />

          {/* QR Card */}
          <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 28,
            padding: '2.2rem',
            backdropFilter: 'blur(24px)',
            boxShadow:
              '0 0 0 1px rgba(66,133,244,0.15),' +
              '0 0 50px rgba(66,133,244,0.12),' +
              '0 0 100px rgba(66,133,244,0.06),' +
              'inset 0 1px 0 rgba(255,255,255,0.07)',
          }}>
            {/* HUD corner brackets */}
            <HUDCorner pos="tl" color="#4285F4" />
            <HUDCorner pos="tr" color="#EA4335" />
            <HUDCorner pos="bl" color="#34A853" />
            <HUDCorner pos="br" color="#FBBC05" />

            {/* Animated scan line */}
            <div style={{
              position: 'absolute', left: 28, right: 28,
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, #4285F4 30%, #34A853 70%, transparent 100%)',
              borderRadius: 2,
              animation: 'collab-scanline 2.8s ease-in-out infinite',
              zIndex: 6, pointerEvents: 'none',
            }} />

            {/* QR code image — user must place their QR at /public/gpay-qr.png */}
            <div style={{ position: 'relative', zIndex: 4 }}>
              <img
                src={`${import.meta.env.BASE_URL}gpay-qr.png`}
                alt="GPay QR Code – Scan to pay Monish"
                style={{
                  display: 'block',
                  width: 268, height: 268,
                  borderRadius: 14,
                  objectFit: 'contain',
                }}
                onError={e => {
                  e.target.style.display = 'none';
                  document.getElementById('qr-fallback').style.display = 'flex';
                }}
              />
              {/* Fallback shown if image not found */}
              <div id="qr-fallback" style={{
                display: 'none', width: 268, height: 268,
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 14, borderRadius: 14,
                border: '2px dashed rgba(66,133,244,0.3)',
                color: 'rgba(255,255,255,0.25)',
                fontSize: '0.7rem', textAlign: 'center', letterSpacing: '0.1em',
                lineHeight: 1.7,
              }}>
                <Scan size={44} style={{ opacity: 0.35 }} />
                <span>Place your QR code at<br /><strong style={{ color: 'rgba(255,255,255,0.45)' }}>/public/gpay-qr.png</strong></span>
              </div>
            </div>
          </div>

          {/* StrangeGT Studio brand tag below QR */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9999,
            }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Strange</span>
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: '0.7rem',
                color: '#ff4655',
                padding: '1px 5px',
                background: 'rgba(255, 70, 85, 0.1)',
                border: '1px solid rgba(255, 70, 85, 0.3)',
                borderRadius: 3,
                letterSpacing: '0.05em',
              }}>GT</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>STUDIO</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Info panel ─── */}
        <div className="collab-right-pane" style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(32px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s',
        }}>

          {/* Heading */}
          <div>
            <div style={{
              fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#4285F4', marginBottom: 14,
            }}>
              // Payment Request
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
              fontWeight: 800, color: '#ffffff',
              margin: 0, lineHeight: 1.15, letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              SUPPORT THE<br />
              CREATOR.
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.88rem', lineHeight: 1.75,
              color: 'rgba(255, 255, 255, 0.35)',
              marginTop: 14, marginBottom: 0,
            }}>
              Scan the QR code to initiate a payment via Google Pay. Works with any UPI-enabled app.
            </p>
          </div>

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {infoRows.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.85rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(24px)',
                  transition: `opacity 0.6s ease ${0.35 + i * 0.1}s, transform 0.7s ease ${0.35 + i * 0.1}s`,
                }}
              >
                <span style={{
                  fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                }}>{row.label}</span>
                <span style={{
                  fontSize: '0.88rem', fontWeight: 600, color: '#ffffff',
                  letterSpacing: '0.02em',
                }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Action note */}
          <div style={{
            background: 'rgba(66,133,244,0.08)',
            border: '1px solid rgba(66,133,244,0.18)',
            borderRadius: 14, padding: '1rem 1.2rem',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34A853', flexShrink: 0, boxShadow: '0 0 8px rgba(52,168,83,0.7)', animation: 'collab-pulse 2s ease infinite' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Payments are processed securely through Google Pay's UPI infrastructure.
            </span>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="collab-footer" style={{
        position: 'relative', zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        fontSize: '0.6rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
      }}>
        <span>©2026 StrangeGT Technologies</span>
        <span>Secure · UPI · Verified</span>
      </footer>

      {/* ── KEYFRAMES & RESPONSIVE STYLES ── */}
      <style>{`
        @keyframes collab-scanline {
          0%   { top: 28px;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: calc(100% - 30px); opacity: 0; }
        }
        @keyframes collab-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }

        .collab-header {
          padding: 1.4rem 2.8rem;
        }
        .collab-main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4.5rem;
          padding: 2.5rem 2rem;
          max-width: 1000px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          flex: 1;
        }
        .collab-left-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.8rem;
          flex: 1;
          min-width: 300px;
          box-sizing: border-box;
        }
        .collab-right-pane {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          flex: 1;
          min-width: 320px;
          max-width: 420px;
          box-sizing: border-box;
        }
        .collab-portal-capsule {
          padding: 6px 18px;
        }
        .collab-back-btn {
          padding: 8px 20px;
        }
        .collab-footer {
          padding: 1rem 2.8rem;
        }

        @media (max-width: 900px) {
          .collab-header {
            padding: 1.2rem 1.5rem;
          }
          .collab-main {
            flex-direction: column;
            gap: 3rem;
            padding: 2rem 1.5rem;
          }
          .collab-left-pane {
            min-width: 100%;
          }
          .collab-right-pane {
            min-width: 100%;
            max-width: 100%;
          }
          .collab-footer {
            padding: 1.2rem 1.5rem;
            flex-direction: column;
            gap: 0.8rem;
            text-align: center;
          }
        }

        @media (max-width: 360px) {
          .collab-main img {
            width: 220px !important;
            height: 220px !important;
          }
          #qr-fallback {
            width: 220px !important;
            height: 220px !important;
          }
          .collab-portal-capsule {
            padding: 6px 12px;
            font-size: 0.55rem !important;
          }
          .collab-back-btn {
            padding: 6px 14px;
            font-size: 0.65rem !important;
          }
        }
      `}</style>
    </div>
  );
}


