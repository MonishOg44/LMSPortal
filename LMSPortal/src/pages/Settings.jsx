import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Sun, Moon, User, Save, Key } from 'lucide-react';

export default function Settings() {
  const { 
    theme, 
    setTheme, 
    accentColor, 
    setAccentColor, 
    customColor, 
    setCustomColor, 
    savedUsername,
    savedPassword,
    updateCredentials,
    user, 
    updateProfile
  } = useProgress();
  const [name, setName] = useState(user?.name || 'monish');
  const [savedName, setSavedName] = useState(user?.name || 'monish');

  const [editUsername, setEditUsername] = useState(savedUsername);
  const [editPassword, setEditPassword] = useState(savedPassword);

  const [prevSavedUsername, setPrevSavedUsername] = useState(savedUsername);
  const [prevSavedPassword, setPrevSavedPassword] = useState(savedPassword);

  if (savedUsername !== prevSavedUsername) {
    setEditUsername(savedUsername);
    setPrevSavedUsername(savedUsername);
  }
  if (savedPassword !== prevSavedPassword) {
    setEditPassword(savedPassword);
    setPrevSavedPassword(savedPassword);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile(name);
    setSavedName(name.trim());
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="page-container settings-container" style={{ maxWidth: '750px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div className="page-header" style={{ textAlign: 'left', marginBottom: '3.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="status-text" style={{ fontSize: '0.75rem' }}>SYS // CONFIGURATION</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', textTransform: 'lowercase', margin: 0, color: 'var(--text-primary)' }}>workspace settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: '520px', lineHeight: 1.5 }}>
          Configure user parameters, set themes, and adjust performance preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Theme Preference Block */}
        <div className="fabric-settings-block" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Sun size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', margin: 0, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Theme Preference</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)', margin: 0 }}>Interface Mode</h4>
              <p style={{ fontSize: '0.85rem', fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>
                Currently using <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{theme === 'light' ? 'Light Cream' : 'Dark Charcoal'}</span>.
              </p>
            </div>

            <button 
              onClick={toggleTheme}
              className="btn btn-secondary"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={16} />
                  <span>SWITCH TO DARK</span>
                </>
              ) : (
                <>
                  <Sun size={16} />
                  <span>SWITCH TO LIGHT</span>
                </>
              )}
            </button>
          </div>

          {/* Color Accent Settings */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)', margin: 0 }}>Color Accent</h4>
              <p style={{ fontSize: '0.85rem', fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>
                Select a preset system color or configure a custom hex code.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { id: 'orange', label: 'Orange', hex: '#ff6b35' },
                { id: 'blue', label: 'Blue', hex: '#3a86ff' },
                { id: 'green', label: 'Green', hex: '#10b981' },
                { id: 'pink', label: 'Pink', hex: '#ff007f' },
                { id: 'purple', label: 'Purple', hex: '#9d4edd' }
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setAccentColor(preset.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    background: accentColor === preset.id ? 'var(--primary-glow)' : 'transparent',
                    border: `1px solid ${accentColor === preset.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.hex }}></span>
                  <span>{preset.label}</span>
                </button>
              ))}

              <button
                onClick={() => setAccentColor('custom')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  background: accentColor === 'custom' ? 'var(--primary-glow)' : 'transparent',
                  border: `1px solid ${accentColor === 'custom' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: accentColor === 'custom' ? customColor : 'var(--text-muted)' }}></span>
                <span>Custom</span>
              </button>

              {accentColor === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.5rem' }}>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    style={{
                      border: '1px solid var(--border-color)',
                      background: 'none',
                      width: '28px',
                      height: '28px',
                      padding: 0,
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {customColor}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Settings Block */}
        <div className="fabric-settings-block" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <User size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', margin: 0, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Student Profile</h3>
          </div>

          <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.8rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Display Name</label>
              <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                <User size={18} className="input-field-icon" style={{ left: '1.25rem', top: '50%', transform: 'translateY(-50%)', position: 'absolute', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="login-input"
                  value={name}
                  onChange={handleNameChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={name.trim() === savedName}
              style={{ 
                alignSelf: 'flex-start', 
                opacity: name.trim() === savedName ? 0.6 : 1,
                cursor: name.trim() === savedName ? 'default' : 'pointer'
              }}
            >
              <Save size={14} style={{ flexShrink: 0 }} />
              <span>SAVE PROFILE NAME</span>
              <span className="cyber-deauth-status" style={{ opacity: 0.6, marginLeft: '0.5rem' }}>[SYS_UPDATE]</span>
            </button>
          </form>
        </div>

        {/* Account Credentials Block */}
        <div className="fabric-settings-block" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Key size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', margin: 0, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Account Credentials</h3>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            updateCredentials(editUsername, editPassword);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem', width: '100%' }}>
              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="input-label" style={{ fontSize: '0.8rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Login Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="input-label" style={{ fontSize: '0.8rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>New Password</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={editUsername.trim() === savedUsername && editPassword === savedPassword}
              style={{ 
                alignSelf: 'flex-start', 
                opacity: (editUsername.trim() === savedUsername && editPassword === savedPassword) ? 0.6 : 1,
                cursor: (editUsername.trim() === savedUsername && editPassword === savedPassword) ? 'default' : 'pointer'
              }}
            >
              <Save size={14} style={{ flexShrink: 0 }} />
              <span>SAVE CREDENTIALS</span>
              <span className="cyber-deauth-status" style={{ opacity: 0.6, marginLeft: '0.5rem' }}>[SYS_UPDATE]</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
