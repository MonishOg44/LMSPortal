import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';

/* ──────────────────────────────────────
   Liquid Glass Panel component
   Wraps children in an Apple-style
   frosted glass surface with refraction
────────────────────────────────────── */
function GlassPanel({ children, className = '', style = {}, onClick }) {
  return (
    <div
      className={`lg-panel ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className="lg-specular" />
      <div className="lg-content">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────
   MAIN Lab Page (Tresmares Premium Style)
────────────────────────────────────── */
const TOOLS = [
  { id: 'ai',     label: 'AI Sandbox',     icon: '🤖', desc: 'Experimental AI assistant' },
  { id: 'code',   label: 'Code Runner',    icon: '⚡', desc: 'Live JavaScript executor' },
  { id: 'system', label: 'System Monitor', icon: '📡', desc: 'Live hardware telemetry' },
];

export default function Lab() {
  const { theme } = useProgress();
  const [activeTool, setActiveTool] = useState(null);

  // Futuristic background: subtle glowing mouse follower
  const glowRef = useRef(null);
  const handleMouseMove = (e) => {
    if (glowRef.current) {
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    }
  };

  return (
    <div className="serif-lab-root page-container" onMouseMove={handleMouseMove}>
      {/* Futuristic Background Additions */}
      <div ref={glowRef} className="serif-lab-bg-glow" style={{ left: '-1000px', top: '-1000px' }} />
      <div className="serif-lab-grid" />

      {/* Main Content Area */}
      <div className="serif-lab-center-wrapper">
         {!activeTool ? (
           <div className="serif-hero-content animate-fade-in">
             <h1 className="serif-hero-title">
               Every experiment.<br/> 
               <span className="serif-hero-accent">builds</span> new skills.
             </h1>
             <p className="serif-hero-subtitle">
               An experimental lab interface for rapid prototyping, real-time telemetry, and AI synthesis.
             </p>
           </div>
         ) : (
           <div className="serif-tool-modal animate-scale-up">
             <div className="serif-tool-header">
               <span>{TOOLS.find(t => t.id === activeTool)?.label}</span>
               <span style={{width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 8px var(--primary)'}} />
             </div>
             <div className="serif-tool-body">
                {activeTool === 'ai' && <AIPlayground theme={theme} />}
                {activeTool === 'code' && <CodeRunner theme={theme} />}
                {activeTool === 'system' && <SystemMonitor theme={theme} />}
             </div>
           </div>
         )}
      </div>

      {/* Bottom Dock Navigation */}
      <div className="serif-dock-wrapper">
        <div className="serif-dock">
          <button className="serif-dock-close" onClick={() => setActiveTool(null)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="serif-dock-divider" />
          {TOOLS.map(tool => (
            <button 
              key={tool.id} 
              className={`serif-dock-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   Tool 1 – AI Prompt Playground
────────────────────────────────────── */
const AI_RESPONSES = {
  default: [
    "→ Analyzing query vectors... Response synthesized.",
    "→ Neural pathways engaged. Here's what I found:",
    "→ Processing complete. Insight generated.",
  ],
  code: [
    "→ Generating code scaffold...",
    "```javascript\nconst greet = (name) => {\n  return `Hello, ${name}! 👋`;\n};\nconsole.log(greet('World'));\n```",
    "→ Code pattern recognized. Boilerplate injected.",
  ],
  design: [
    "→ Design system analysis complete.",
    "→ Suggested palette: #6366F1 (primary), #EC4899 (accent), #F8FAFC (surface)",
    "→ Typography stack: 'Inter' for body, 'Syne' for display.",
  ],
  help: [
    "→ Available commands: /code, /design, /system, /clear",
    "→ Try: 'build me a React component' or '/design color palette'",
    "→ I'm your experimental AI assistant. Just type anything!",
  ],
};

function AIPlayground({ theme }) {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'STRANGEGT // AI ASSISTANT v2.1 — ONLINE', time: new Date().toLocaleTimeString() },
    { role: 'assistant', text: 'Hello! I\'m the experimental AI sandbox. Type anything or try /help for commands.', time: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim(), time: new Date().toLocaleTimeString() };
    const query = input.trim().toLowerCase();
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let pool = AI_RESPONSES.default;
      if (query.includes('/help') || query.includes('help')) pool = AI_RESPONSES.help;
      else if (query.includes('/code') || query.includes('code') || query.includes('function') || query.includes('component')) pool = AI_RESPONSES.code;
      else if (query.includes('/design') || query.includes('design') || query.includes('color') || query.includes('palette')) pool = AI_RESPONSES.design;

      const reply = pool[Math.floor(Math.random() * pool.length)];
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: reply, time: new Date().toLocaleTimeString() }]);
    }, 1200 + Math.random() * 600);
  }, [input]);

  return (
    <div className="lab-tool-inner">
      <div className="lab-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`lab-chat-msg lab-chat-${msg.role}`}>
            {msg.role === 'user' ? (
              <div className="lab-chat-bubble lab-chat-bubble-user">{msg.text}</div>
            ) : msg.role === 'system' ? (
              <div className="lab-chat-system">{msg.text}</div>
            ) : (
              <div className="lab-chat-bubble lab-chat-bubble-ai">
                <pre className="lab-chat-pre">{msg.text}</pre>
              </div>
            )}
            {msg.role !== 'system' && <span className="lab-chat-time">{msg.time}</span>}
          </div>
        ))}
        {isTyping && (
          <div className="lab-chat-msg lab-chat-assistant">
            <div className="lab-chat-bubble lab-chat-bubble-ai lab-typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="lab-chat-input-row">
        <input
          className="lab-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything or type /help..."
          autoComplete="off"
        />
        <button className="lab-chat-send" onClick={sendMessage} aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   Tool 2 – Live Code Runner
────────────────────────────────────── */
const STARTER_CODE = `// Write JavaScript and hit RUN

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci Sequence:", results.join(", "));
console.log("Sum:", results.reduce((a, b) => a + b, 0));
`;

function CodeRunner({ theme }) {
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    const logs = [];
    const mockConsole = {
      log: (...args) => logs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }),
      error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
      warn: (...args) => logs.push({ type: 'warn', text: args.join(' ') }),
    };

    setTimeout(() => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('console', code);
        fn(mockConsole);
        setOutput([{ type: 'meta', text: `✓ Executed successfully in ${(Math.random() * 8 + 2).toFixed(1)}ms` }, ...logs]);
      } catch (err) {
        setOutput([{ type: 'error', text: `✗ ${err.message}` }]);
      }
      setIsRunning(false);
      setRunCount(c => c + 1);
    }, 400);
  };

  return (
    <div className="lab-tool-inner lab-code-runner">
      <div className="lab-code-editor-wrapper">
        <div className="lab-code-toolbar">
          <span className="lab-code-lang-badge">JavaScript</span>
          <div className="lab-code-dots">
            <span className="lab-dot dot-red" />
            <span className="lab-dot dot-yellow" />
            <span className="lab-dot dot-green" />
          </div>
        </div>
        <textarea
          className="lab-code-editor"
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          rows={12}
        />
      </div>
      <div className="lab-code-actions">
        <button
          className={`lab-run-btn ${isRunning ? 'running' : ''}`}
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <><span className="lab-spinner" /> Running...</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Run Code
            </>
          )}
        </button>
        <span className="lab-run-count">Runs: {runCount}</span>
        <button className="lab-clear-btn" onClick={() => setOutput([])}>Clear Output</button>
      </div>
      <div className="lab-code-output">
        <div className="lab-output-header">
          <span className="lab-dot dot-green" style={{ width: 6, height: 6 }} />
          <span>Console Output</span>
        </div>
        <div className="lab-output-body">
          {output.length === 0 ? (
            <span className="lab-output-empty">Hit RUN to execute your code...</span>
          ) : output.map((line, i) => (
            <div key={i} className={`lab-output-line lab-output-${line.type}`}>{line.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ──────────────────────────────────────
   Tool 4 – System Monitor
────────────────────────────────────── */
function useAnimatedValue(target, speed = 0.08) {
  const [value, setValue] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      ref.current += (target - ref.current) * speed;
      setValue(Math.round(ref.current * 10) / 10);
      if (Math.abs(ref.current - target) > 0.05) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return value;
}

function WaveformGraph({ value }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let anim;
    const tick = () => {
      setPhase(p => p + 0.12);
      anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(anim);
  }, []);

  const width = 300;
  const height = 60;
  
  // Wave phase, frequency and amplitude depends on the value
  const amplitude = Math.max(2, (value / 100) * (height / 2.2));
  const frequency = 0.05 + (value / 100) * 0.15;
  const segments = 60;
  
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const y = (height / 2) + Math.sin(i * frequency - phase) * amplitude;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const pathD = `M ${points.join(" L ")}`;

  return (
    <div className="lab-waveform-container">
      <div className="lab-waveform-grid" />
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block', position: 'relative', zIndex: 2 }}>
        {/* Glow behind the path */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.25, filter: 'blur(2px)' }}
        />
        {/* Main sharp line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const Gauge = ({ value, label, icon }) => (
  <div className="lab-gauge-card waveform-card">
    <div className="lab-gauge-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="lab-gauge-icon">{icon}</span>
        <span className="lab-gauge-label">{label}</span>
      </div>
      <span className="lab-gauge-value" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700' }}>
        {value.toFixed(1)}%
      </span>
    </div>
    <WaveformGraph value={value} />
  </div>
);

function SystemMonitor({ theme }) {
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 61, net: 78, gpu: 35 });
  const cpu = useAnimatedValue(metrics.cpu);
  const ram = useAnimatedValue(metrics.ram);
  const net = useAnimatedValue(metrics.net);
  const gpu = useAnimatedValue(metrics.gpu);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.min(95, Math.max(5, metrics.cpu + (Math.random() - 0.5) * 20)),
        ram: Math.min(90, Math.max(30, metrics.ram + (Math.random() - 0.5) * 10)),
        net: Math.min(99, Math.max(10, metrics.net + (Math.random() - 0.5) * 25)),
        gpu: Math.min(85, Math.max(5, metrics.gpu + (Math.random() - 0.5) * 15)),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [metrics]);

  const [logs, setLogs] = useState([]);
  const logMessages = [
    '[SYS] CPU thermal throttle: nominal',
    '[NET] Packet loss: 0.0%',
    '[MEM] Garbage collection pass complete',
    '[GPU] Frame buffer: stable',
    '[SEC] Firewall rule refresh: OK',
    '[CORE] Clock sync: ±0.002ms',
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const ts = new Date().toLocaleTimeString();
      setLogs(prev => [`${ts} ${msg}`, ...prev.slice(0, 9)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lab-tool-inner lab-system-monitor">
      <div className="lab-gauges">
        <Gauge value={cpu} label="CPU LOAD" icon="⚡" />
        <Gauge value={ram} label="RAM USAGE" icon="🧠" />
        <Gauge value={net} label="NET THROUGHPUT" icon="📡" />
        <Gauge value={gpu} label="GPU LOAD" icon="🎮" />
      </div>
      <div className="lab-sys-log">
        <div className="lab-sys-log-header">
          <span className="lab-dot dot-green" style={{ width: 6, height: 6, background: 'var(--primary)', boxShadow: '0 0 6px var(--primary)' }} />
          <span>Live Event Log</span>
        </div>
        <div className="lab-sys-log-body">
          {logs.length === 0 ? (
            <span className="lab-output-empty">Listening for events...</span>
          ) : logs.map((l, i) => (
            <div key={i} className={`lab-sys-log-line ${i === 0 ? 'new' : ''}`}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


