import React from 'react';

const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const DiscordIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8732.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="fabric-footer">
      <div className="footer-grid">
        {/* Left Side: Brand and Status */}
        <div className="footer-brand-section">
          <div className="footer-brand-title">strangegt technologies</div>
          <p className="footer-brand-desc">
            creative engineering lab & advanced web architecture learning platform.
          </p>
          <div className="footer-status-indicator">
            <span className="pulse-dot"></span>
            <span className="status-text">SYSTEMS STATUS // OPERATIONAL</span>
          </div>
        </div>

        {/* Right Side: Columns */}
        <div className="footer-links-grid">
          <div className="footer-column">
            <div className="footer-col-title">PATHWAYS</div>
            <a href="/" className="footer-link">Development</a>
            <a href="/" className="footer-link">Design Systems</a>
            <a href="/" className="footer-link">Marketing</a>
          </div>
          
          <div className="footer-column">
            <div className="footer-col-title">SYSTEM</div>
            <a href="/profile" className="footer-link">Profile</a>
            <a href="/settings" className="footer-link">Settings</a>
            <a href="/" className="footer-link">Workspace</a>
          </div>

          <div className="footer-column">
            <div className="footer-col-title">SOCIALS</div>
            <a 
              href="https://www.instagram.com/strangegtlive/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link footer-social-link"
            >
              <InstagramIcon size={14} /> Instagram
            </a>
            <a 
              href="https://www.youtube.com/@strangegtlivebgmi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link footer-social-link"
            >
              <YoutubeIcon size={14} /> YouTube
            </a>
            <a 
              href="https://discord.gg/QXSQnxgDMW" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link footer-social-link"
            >
              <DiscordIcon size={14} /> Discord
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Metadata bar */}
      <div className="footer-metadata-bar">
        <div className="footer-copy">
          &copy; 2026 STRANGEGT. ALL RIGHTS RESERVED.
        </div>
        <div className="footer-coordinates">
          CHAMB&Eacute;RY // FRANCE // 45.5646&deg; N, 5.9178&deg; E
        </div>
      </div>
    </footer>
  );
}
