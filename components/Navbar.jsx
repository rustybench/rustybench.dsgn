import { useEffect, useRef, useState } from 'react';

export default function Navbar({ onAboutClick }) {
  const nameRef   = useRef(null);
  const cornerRef = useRef(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const fitText = () => {
      const name   = nameRef.current;
      const corner = cornerRef.current;
      if (!name || !corner) return;
      let size = 34;
      name.style.fontSize = size + 'px';
      const padding = 16;
      while (name.scrollWidth > corner.clientWidth - padding && size > 6) {
        size -= 0.25;
        name.style.fontSize = size + 'px';
      }
    };

    // Wait for fonts to load before fitting
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitText);
    } else {
      // Fallback: wait a bit then fit
      setTimeout(fitText, 100);
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-corner" ref={cornerRef}>
        <span className="navbar-name" ref={nameRef}>Rustybench</span>
      </div>

      <div className="navbar-links">
        <a href="#" className="active">Work</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick?.(); }}>About</a>
      </div>

      <a href="/contact.html" className="navbar-center-link" aria-label="The human behind">
        ?
      </a>

      <div className="navbar-right">
        <a href="https://instagram.com/rustybench.dsgn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <span className="navbar-time">{time}</span>
        <span className="navbar-copy">© 2026</span>
      </div>
    </nav>
  );
}
