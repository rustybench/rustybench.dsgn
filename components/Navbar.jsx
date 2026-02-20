import { useEffect, useRef } from 'react';

export default function Navbar() {
  const nameRef   = useRef(null);
  const cornerRef = useRef(null);

  useEffect(() => {
    const name   = nameRef.current;
    const corner = cornerRef.current;
    if (!name || !corner) return;
    let size = 20;
    name.style.fontSize = size + 'px';
    const padding = 16;
    while (name.scrollWidth > corner.clientWidth - padding && size > 6) {
      size -= 0.25;
      name.style.fontSize = size + 'px';
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-corner" ref={cornerRef}>
        <span className="navbar-name" ref={nameRef}>Rustybench</span>
      </div>

      <div className="navbar-links">
        <a href="#" className="active">Work</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <div className="navbar-right">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="Behance">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.5 11.5c1.1 0 2-.9 2-2s-.9-2-2-2H4v4h3.5zm.3 2H4v4.5h3.8c1.3 0 2.2-.9 2.2-2.2 0-1.3-1-2.3-2.2-2.3zm6.2-2c-1.5 0-2.5 1-2.7 2.5h5.4c-.1-1.5-1.1-2.5-2.7-2.5zM2 4h8.5c2 0 3.5 1.3 3.5 3.2 0 1.2-.6 2.2-1.5 2.7 1.2.4 2 1.5 2 2.8 0 2.2-1.7 3.8-4 3.8H2V4zm12.5 1.5h6v1.2h-6V5.5zm1.5 5.5c2.5 0 4 1.7 4 4.2 0 .3 0 .5-.1.8h-7.8c.2 1.5 1.2 2.3 2.8 2.3.8 0 1.6-.3 2.1-.9l1.5.9c-.8 1-2 1.7-3.6 1.7-2.5 0-4.4-1.8-4.4-4.5 0-2.7 1.9-4.5 4.5-4.5z"/>
          </svg>
        </a>
        <span className="navbar-copy">© 2026</span>
      </div>
    </nav>
  );
}
