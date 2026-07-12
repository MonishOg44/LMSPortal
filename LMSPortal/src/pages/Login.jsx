import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { X, ShieldAlert } from 'lucide-react';

export default function Login() {

console.log("API URL:", import.meta.env.VITE_API_URL);
  const { savedUsername, updateCredentials, startFuturisticTransition } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState( '');
  const [password, setPassword] = useState('');
  const [isFormExiting, setIsFormExiting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isErrorClosing, setIsErrorClosing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const from = location.state?.from?.pathname || '/';

  // Sign up state variables
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpUser, setSignUpUser] = useState('');
  const [signUpPass, setSignUpPass] = useState('');
  const [signUpError, setSignUpError] = useState(null);

  // Futuristic Boot Preloader States
  const [isBooting, setIsBooting] = useState(() => {
    return !sessionStorage.getItem('hasBooted');
  });
  const [shouldRenderBoot, setShouldRenderBoot] = useState(() => {
    return !sessionStorage.getItem('hasBooted');
  });
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([]);

  React.useEffect(() => {
    if (!shouldRenderBoot) return;

    // Prevent duplicate states on strict-mode double-mount
    const timeouts = [];

    const logSteps = [
      { delay: 250, text: "SYS_INIT // SECURING GRID PROTOCOLS..." },
      { delay: 750, text: "CALIBRATING TELEMETRY MATRIX // OK" },
      { delay: 1300, text: "VERIFYING CRYPTO SECTORS // OK" },
      { delay: 1900, text: "INITIALIZING STRANGE_SANDBOX // BOOTED" },
      { delay: 2500, text: "ESTABLISHED LOCAL SECURE PORT 5175" },
      { delay: 3100, text: "READY FOR IDENTITY HANDSHAKE..." }
    ];

    logSteps.forEach(step => {
      const t = setTimeout(() => {
        setBootLogs(prev => {
          if (prev.includes(step.text)) return prev;
          return [...prev, step.text];
        });
      }, step.delay);
      timeouts.push(t);
    });

    let prg = 0;
    const interval = setInterval(() => {
      prg += Math.floor(Math.random() * 4) + 2;
      if (prg >= 100) {
        prg = 100;
        clearInterval(interval);
        sessionStorage.setItem('hasBooted', 'true');
        const tFade = setTimeout(() => {
          setIsBooting(false);
          const tRender = setTimeout(() => {
            setShouldRenderBoot(false);
          }, 800);
          timeouts.push(tRender);
        }, 800);
        timeouts.push(tFade);
      }
      setBootProgress(prg);
    }, 100);

    return () => {
      clearInterval(interval);
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [shouldRenderBoot]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      setSignUpError('ERROR // FULL_NAME_CANNOT_BE_EMPTY');
      return;
    }
    if (!signUpUser.trim()) {
      setSignUpError('ERROR // USERNAME_CANNOT_BE_EMPTY');
      return;
    }
    if (!signUpPass.trim()) {
      setSignUpError('ERROR // PASSWORD_CANNOT_BE_EMPTY');
      return;
    }
    
   try {

  console.log(import.meta.env.VITE_API_URL);

 const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/Auth/register`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify({
      fullName: signUpName.trim(),
      username: signUpUser.trim(),
      password: signUpPass
    })
  }
);

      const data = await response.json();
      console.log("Status:", response.status);
console.log("Response:", data);

      if (!response.ok) {
        setSignUpError(`REGISTRATION_FAILED // ${data.message || 'SERVER_ERROR'}`);
        return;
      }

      // Sync state and context so credentials match for the local flow
      updateCredentials(signUpUser.trim(), signUpPass);
      setShowSignUpModal(false);
      
      // Auto-login flow
      setIsFormExiting(true);
      setIsScanning(true);
     setTimeout(() => {
  startFuturisticTransition(data, () => {
    navigate(from, { replace: true });
  });
}, 350);
    } catch {
      setSignUpError('CONNECTION_FAILED // SERVER_OFFLINE');
    }
  };

  const handleCloseError = () => {
    setIsErrorClosing(true);
    setTimeout(() => {
      setErrorMsg(null);
      setIsErrorClosing(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasError = false;
    if (!username.trim()) {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }
    
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

   try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/Auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password
      })
    }
  );

 const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);

      if (response.ok) {

          localStorage.setItem("userId", data.userId);
  localStorage.setItem("username", data.username);
  localStorage.setItem("fullName", data.fullName);
        // Sync context credentials so local features and pages function seamlessly
        updateCredentials(username.trim(), password);
        localStorage.setItem("username", username.trim());
        
        setErrorMsg(null);
        setIsErrorClosing(false);
        setUsernameError(false);
        setPasswordError(false);
        setIsFormExiting(true);
        setIsScanning(true);
        
        // Let the form exit animation start, then boot the global transition
        setTimeout(() => {
  startFuturisticTransition(data, () => {
    navigate(from, { replace: true });
  });
}, 350);
      } else {
        setIsShaking(true);
        setErrorMsg(
  `ACCESS_DENIED // ${data.message || 'SECURITY_CREDENTIAL_MISMATCH'}`
);
        setIsErrorClosing(false);
        setPassword('');
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch {
      setIsShaking(true);
      setErrorMsg('CONNECTION_FAILED // SERVER_OFFLINE');
      setIsErrorClosing(false);
      setPassword('');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="v-portfolio-container">
      {/* Dynamic Style injection for local transition animations */}
      <style>{`
        .v-center-content {
          transform: translateY(0);
          transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.45s ease, filter 0.45s ease;
        }
        .v-center-content.form-exiting {
          transform: translateY(-40px) scale(0.92);
          opacity: 0;
          filter: blur(8px);
        }
        @keyframes scannerSweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        @keyframes modalFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.95);
          }
        }
        @keyframes modalShake {
          0%, 100% { transform: translate(-50%, 0); }
          20%, 60% { transform: translate(-52%, 0); }
          40%, 80% { transform: translate(-48%, 0); }
        }
        .error-wrapper {
          width: 280px;
          max-height: 0;
          opacity: 0;
          transform: translateY(-8px);
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.25s ease;
        }
        .error-wrapper.visible {
          max-height: 140px;
          opacity: 1;
          transform: translateY(0);
          overflow: visible;
        }
        .boot-overlay {
          position: fixed;
          inset: 0;
          background: #060207;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4rem;
          color: #ffffff;
          font-family: 'Space Grotesk', sans-serif;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
          box-sizing: border-box;
        }
        .boot-overlay.boot-fadeout {
          opacity: 0;
          transform: scale(1.02);
          filter: blur(20px);
          pointer-events: none;
        }
         .boot-decal {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .boot-decal.top-left { top: 1.5rem; left: 1.5rem; border-right: none; border-bottom: none; }
        .boot-decal.top-right { top: 1.5rem; right: 1.5rem; border-left: none; border-bottom: none; }
        .boot-decal.bottom-left { bottom: 1.5rem; left: 1.5rem; border-right: none; border-top: none; }
        .boot-decal.bottom-right { bottom: 1.5rem; right: 1.5rem; border-left: none; border-top: none; }
        
        .boot-cursor {
          display: inline-block;
          width: 6px;
          height: 10px;
          background: #ffffff;
          animation: bootBlink 0.8s infinite;
          margin-left: 2px;
          vertical-align: middle;
        }
        @keyframes bootBlink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .boot-overlay {
            padding: 2.5rem 1.5rem;
          }
          .boot-decal.top-left { top: 1rem; left: 1rem; }
          .boot-decal.top-right { top: 1rem; right: 1rem; }
          .boot-decal.bottom-left { bottom: 1rem; left: 1rem; }
          .boot-decal.bottom-right { bottom: 1rem; right: 1rem; }
        }
        @media (max-width: 600px) {
          .boot-overlay {
            padding: 2rem 1.25rem;
          }
          .boot-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .boot-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          .boot-title {
            font-size: 0.75rem !important;
            letter-spacing: 0.15em !important;
          }
          .boot-subtitle {
            font-size: 0.55rem !important;
          }
          .boot-progress-title {
            font-size: 0.7rem !important;
          }
          .boot-terminal {
            padding: 1rem !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>

      {shouldRenderBoot && (
        <div className={`boot-overlay ${!isBooting ? 'boot-fadeout' : ''}`}>
          {/* Decals */}
          <div className="boot-decal top-left" />
          <div className="boot-decal top-right" />
          <div className="boot-decal bottom-left" />
          <div className="boot-decal bottom-right" />

          {/* Top Row Header */}
          <div className="boot-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="boot-title" style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.25em', color: '#ffffff', textShadow: '0 0 10px rgba(255, 255, 255, 0.4)', fontFamily: "'Space Grotesk', sans-serif" }}>STRANGEGT // SYSTEM_INITIALIZATION</span>
              <span className="boot-subtitle" style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.1em', fontFamily: "'Space Grotesk', sans-serif" }}>BOOT_SEQUENCE // SECURE_PORT_5175</span>
            </div>
            <div className="boot-status" style={{ fontFamily: 'Courier New, monospace', fontSize: '0.7rem', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', letterSpacing: '0.05em' }}>
              [ STATUS: SECURE_BOOT ]
            </div>
          </div>

          {/* Center Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2.5rem', width: '100%', margin: '2rem 0' }}>
            {/* Horizontal progress indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '600px', width: '100%', alignSelf: 'center' }}>
              <div className="boot-progress-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#ffffff' }}>
                <span className="boot-progress-title">DECRYPTING_SECTOR_MATRICES</span>
                <span style={{ color: '#ffffff', textShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}>{bootProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${bootProgress}%`, background: '#ffffff', boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)', transition: 'width 0.1s linear' }} />
              </div>
            </div>

            {/* Terminal output box */}
            <div className="boot-terminal" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1.5rem', maxHeight: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontFamily: 'Courier New, monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', width: '100%', alignSelf: 'center', boxSizing: 'border-box' }}>
              {bootLogs.map((log, index) => (
                <div key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  &gt; {log}
                </div>
              ))}
              {bootProgress < 100 && (
                <div>
                  &gt; RESOLVING CORE INTERACTION MATRIX...<span className="boot-cursor" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row Footer */}
          <div className="boot-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontFamily: "'Space Grotesk', sans-serif", width: '100%' }}>
            <span>TARGET: LOCALHOST_WORKSPACE</span>
            <span>[ HOST_HASH: STRANGEGT_8.0.16 ]</span>
            <span>SYS_VER: 2026.07.10</span>
          </div>
        </div>
      )}

      {/* Grid overlay lines */}
      <div className="v-grid-overlay">
        <div className="v-grid-col"></div>
        <div className="v-grid-col"></div>
        <div className="v-grid-col"></div>
      </div>
      <div className="v-grid-row-overlay">
        <div className="v-grid-row"></div>
        <div className="v-grid-row"></div>
      </div>

      {/* Center content container */}
      <div className={`v-center-content ${isFormExiting ? 'form-exiting' : ''}`}>
        
        <h1 className="v-main-title">
          <div className="v-title-line">
            STRANGE<span className="script-purple">gt</span>
          </div>
          <div className="v-title-line line-2">
            <span className="script-purple">T</span>ECHNOLOGIES
          </div>
        </h1>

        <div className="v-bottom-center-zone">
          
          {/* Interactive Login Area */}
          <form onSubmit={handleSubmit} noValidate className={`v-login-form ${isShaking ? 'shake-effect' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.25rem' }}>
              <input 
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameError) setUsernameError(false);
                }}
                className={`v-login-input ${usernameError ? 'error-border' : ''}`}
                placeholder="ENTER USERNAME"
                autoFocus
              />
              <div className={`error-wrapper ${usernameError ? 'visible' : ''}`}>
                <div className="futuristic-input-error">
                  <span className="error-text">CRITICAL // USERNAME_KEY_MISSING</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.25rem' }}>
              <input 
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                className={`v-login-input ${passwordError ? 'error-border' : ''}`}
                placeholder="ENTER PASSWORD"
              />
              <div className={`error-wrapper ${passwordError ? 'visible' : ''}`}>
                <div className="futuristic-input-error">
                  <span className="error-text">ACCESS_KEY_REQUIRED // SECURITY_SHIELD_ACTIVE</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '0.5rem' }}>
              <button type="submit" className="v-login-btn" style={{ width: '100%', maxWidth: '280px' }}>
                ENTER WORKSPACE &rarr;
              </button>
              <button 
                type="button" 
                className="v-signup-btn-futuristic"
                onClick={() => {
                  setSignUpName('');
                  setSignUpUser('');
                  setSignUpPass('');
                  setSignUpError(null);
                  setShowSignUpModal(true);
                }}
                style={{ width: '100%', maxWidth: '280px' }}
              >
                REGISTER IDENTITY [SIGN UP]
              </button>
            </div>
          </form>
        </div>
      </div>



      {/* Futuristic Error Alert Modal */}
      {errorMsg && (
        <div style={{
          position: 'fixed',
          top: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '420px',
          background: 'rgba(18, 10, 14, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #ef476f',
          boxShadow: '0 12px 40px rgba(239, 71, 111, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          animation: `${isErrorClosing ? 'modalFadeOut' : 'modalFadeIn'} 0.3s cubic-bezier(0.19, 1, 0.22, 1) both${isErrorClosing ? '' : ', modalShake 0.4s ease-in-out'}`,
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef476f', boxShadow: '0 0 8px #ef476f', animation: 'pulse-animation 1s infinite' }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ef476f', textTransform: 'uppercase' }}>Security Warning</span>
            </div>
            <button 
              onClick={handleCloseError}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(239, 71, 111, 0.6)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 800,
                padding: '2px 6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ef476f'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(239, 71, 111, 0.6)'}
            >
              ESC [X]
            </button>
          </div>

          {/* Error Message Details */}
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
              AUTHENTICATION_FAILURE
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
              The entered security key or access username does not match our network records. Access denied.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 71, 111, 0.12)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', color: '#ef476f', fontFamily: "'Courier New', monospace" }}>
            <span>ERR_CODE: SEC_ACCESS_DENIED_VAL_04</span>
          </div>
        </div>
      )}

      {/* Futuristic Sign Up Modal */}
      {showSignUpModal && (
        <div className="cyber-modal-overlay" onClick={() => setShowSignUpModal(false)}>
          <div className="cyber-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', color: 'var(--text-primary)' }}>
            {/* Corner tech decals */}
            <div className="cyber-modal-decal top-left" />
            <div className="cyber-modal-decal top-right" />
            <div className="cyber-modal-decal bottom-left" />
            <div className="cyber-modal-decal bottom-right" />

            {/* Close Button */}
            <button 
              className="cyber-modal-close"
              onClick={() => setShowSignUpModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              <X size={20} />
            </button>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="cyber-modal-tag">// SIGNUP_IDENTITY_PROTOCOL</div>
                <h3 className="cyber-modal-title" style={{ margin: '0.25rem 0 0 0' }}>REGISTER_NEW_WORKSPACE</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Hey there!<br></br>We're delighted to have you here. Start learning and build valuable skills for your career.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Full Name input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>FULL NAME</label>
                  <input 
                    type="text"
                    value={signUpName}
                    onChange={(e) => {
                      setSignUpName(e.target.value);
                      if (signUpError) setSignUpError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.9rem'
                    }}
                    placeholder="e.g. Monish N"
                    required
                  />
                </div>

                {/* Username input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>NEW USERNAME</label>
                  <input 
                    type="text"
                    value={signUpUser}
                    onChange={(e) => {
                      setSignUpUser(e.target.value);
                      if (signUpError) setSignUpError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.9rem'
                    }}
                    placeholder="e.g. monish"
                    required
                  />
                </div>

                {/* Password input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>NEW PASSWORD</label>
                  <input 
                    type="password"
                    value={signUpPass}
                    onChange={(e) => {
                      setSignUpPass(e.target.value);
                      if (signUpError) setSignUpError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter secure password"
                    required
                  />
                </div>

                {signUpError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 71, 111, 0.1)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#ef476f', fontFamily: "'Space Grotesk', sans-serif" }}>
                    <ShieldAlert size={16} />
                    <span>{signUpError}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSignUpModal(false)}
                  style={{ height: '40px', padding: '0 1.25rem' }}
                >
                  <span>CANCEL</span>
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ height: '40px', padding: '0 1.5rem' }}
                >
                  <span>REGISTER & ENTER</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Holographic scanner line overlay */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          background: 'linear-gradient(to bottom, transparent, rgba(255, 107, 53, 0.04) 48%, rgba(255, 107, 53, 0.35) 50%, rgba(255, 107, 53, 0.04) 52%, transparent)',
          height: '100vh',
          animation: 'scannerSweep 0.5s ease-in-out infinite'
        }} />
      )}
    </div>
  );
}
