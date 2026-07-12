import { useEffect, useRef } from 'react';

export default function LogoutOverlay({ progress, phase, logs, isDelete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Handle high-DPI scaling
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newCols = Math.floor(width / 20);
      drops.length = newCols;
      for (let x = 0; x < newCols; x++) {
        if (drops[x] === undefined) {
          drops[x] = Math.random() * -100;
        }
      }
    };
    window.addEventListener('resize', resize);

    // Get primary theme color
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#ff6b35';

    // Particle definitions
    const particles = [];
    const particleCount = 280;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(width, height) * 0.7 + 50;
      particles.push({
        angle,
        dist,
        speed: (Math.random() * 0.015 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
        radialSpeed: Math.random() * 1.5 + 0.8,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.25,
        prevX: 0,
        prevY: 0
      });
    }

    // Binary code rain setup
    const columns = Math.floor(width / 20);
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100;
    }

    // Shockwaves triggered during progress milestones
    const shockwaves = [];
    let lastProgressMile = 0;

    const draw = () => {
      // Draw semi-transparent black background to preserve trails
      ctx.fillStyle = 'rgba(3, 3, 7, 0.18)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw futuristic grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw red matrix code rain
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.font = '10px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() < 0.5 ? '0' : '1';
        const x = i * 20;
        const y = drops[i] * 20;
        
        ctx.fillText(text, x, y);
        drops[i] += 0.35 + (progress * 0.012);
        
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      // Check if we need to emit a new shockwave
      if (progress > lastProgressMile + 18) {
        shockwaves.push({
          radius: 15,
          maxRadius: Math.max(width, height) * 0.7,
          alpha: 1.0,
          color: primaryColor
        });
        lastProgressMile = Math.floor(progress);
      }

      // Draw and update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        sw.radius += 8;
        sw.alpha -= 0.015;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw central singularity core (size scales with progress)
      const coreRadius = 24 + (progress * 0.45);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, primaryColor);
      grad.addColorStop(0.7, 'rgba(3, 3, 7, 0.3)');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Render and update particles
      particles.forEach(p => {
        const speedFactor = 1 + (progress * 0.07);
        const radialFactor = 1 + (progress * 0.18);

        p.prevX = cx + Math.cos(p.angle) * p.dist;
        p.prevY = cy + Math.sin(p.angle) * p.dist;

        p.angle += p.speed * speedFactor;
        p.dist -= p.radialSpeed * radialFactor;

        const curX = cx + Math.cos(p.angle) * p.dist;
        const curY = cy + Math.sin(p.angle) * p.dist;

        // Draw particle trail line
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(curX, curY);
        ctx.stroke();

        // Reset particle if swallowed by core singularity
        if (p.dist <= coreRadius) {
          p.dist = Math.random() * Math.max(width, height) * 0.65 + coreRadius;
          p.angle = Math.random() * Math.PI * 2;
          p.alpha = Math.random() * 0.5 + 0.25;
        }
      });
      ctx.globalAlpha = 1.0;

      // Draw vectors, telemetry rings, brackets around core
      const t = Date.now() * 0.001;

      // Inner thin HUD ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 95, t, t + Math.PI * 1.6);
      ctx.stroke();

      // Outer dashed HUD ring
      ctx.strokeStyle = primaryColor;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, 130, -t * 0.7, -t * 0.7 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw subtle ticks/markers on the HUD rings
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let j = 0; j < 4; j++) {
        const tickAngle = t * 0.2 + (j * Math.PI / 2);
        const tx = cx + Math.cos(tickAngle) * 130;
        const ty = cy + Math.sin(tickAngle) * 130;
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw fullscreen glitch strips occasionally
      if (Math.random() < 0.045) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.fillRect(0, Math.random() * height, width, Math.random() * 12);
      }
      if (Math.random() < 0.02) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; // Red warning bar
        ctx.fillRect(0, Math.random() * height, width, Math.random() * 5);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [progress]);

  return (
    <div className={`logout-overlay-container ${phase === 'collapsing' ? 'crt-collapse-active' : ''}`}>
      <canvas ref={canvasRef} className="logout-vortex-canvas" />
      
      {/* HUD Telemetry Center */}
      <div className="logout-hud-center">
        <svg className="logout-hud-svg" viewBox="0 0 240 240" width="240" height="240">
          <circle cx="120" cy="120" r="110" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="2.5" fill="none" />
          <circle 
            cx="120" 
            cy="120" 
            r="110" 
            stroke="#ef4444" 
            strokeWidth="3.5" 
            fill="none" 
            strokeDasharray="691.15"
            strokeDashoffset={691.15 - (691.15 * progress) / 100}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.1s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))'
            }}
          />
        </svg>
        <div className="hud-corner-brackets tl"></div>
        <div className="hud-corner-brackets tr"></div>
        <div className="hud-corner-brackets bl"></div>
        <div className="hud-corner-brackets br"></div>

        <div className="logout-warning-header">
          <span style={{ animation: 'blink-warning 0.5s infinite alternate', marginRight: '0.4rem' }}>⚠️</span> 
          {isDelete ? 'SYSTEM_PURGE // TOTAL_SHRED' : 'SYSTEM_PURGE // DE-AUTH'}
        </div>
        <div className="logout-percentage-display">
          {progress.toString().padStart(3, '0')}%
        </div>
        <div className="logout-status-msg">
          {isDelete ? (
            progress < 40 ? 'SYS // SHREDDING PROFILE IDENTITIES...' : 
            progress < 85 ? 'CORE // WIPING METRICS & CREDENTIALS...' : 
            'SYS // PURGING SYSTEM PERSISTENCE'
          ) : (
            progress < 40 ? 'SYS // REVOKING AUTH KEYS...' : 
            progress < 85 ? 'CORE // SHREDDING CACHE BLOCKS...' : 
            'SYS // TERMINATING NEURAL MATRIX'
          )}
        </div>
      </div>

      {/* Cyber terminal logs feed */}
      <div className="cyber-logs-panel logout-logs">
        {logs.map((log, idx) => (
          <div key={idx} className={`cyber-log-item ${idx === logs.length - 1 ? 'highlight' : ''}`}>
            {log}
          </div>
        ))}
      </div>

      {/* Ambient HUD Telemetry Borders */}
      <div className="cyber-hud-decor hud-top-left">{isDelete ? '[IDENTITY_PURGING]' : '[AUTH_REVOKING_SEC]'}</div>
      <div className="cyber-hud-decor hud-top-right">{isDelete ? '[TOTAL_WIPE_ACTIVE]' : '[NODE_DISCONN_7A]'}</div>
      <div className="cyber-hud-decor hud-bottom-right">{isDelete ? '[SHREDDING_USER_DATA]' : '[CLEARING_SESSION]'}</div>
    </div>
  );
}
