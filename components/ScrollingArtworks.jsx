import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { pieces } from '../data/pieces';

export default function ScrollingArtworks() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const autoCloseTimer = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const startAutoCloseTimer = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    autoCloseTimer.current = setTimeout(() => {
      setFullscreenIndex(null);
    }, 3000);
  };

  const handleImageClick = (piece) => {
    const index = pieces.findIndex(p => p.file === piece.file);
    setFullscreenIndex(index);
    startAutoCloseTimer();
  };

  const handleCloseFullscreen = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    setFullscreenIndex(null);
  };

  const handleNext = () => {
    setFullscreenIndex((prev) => (prev + 1) % pieces.length);
    startAutoCloseTimer();
  };

  const handlePrev = () => {
    setFullscreenIndex((prev) => (prev === 0 ? pieces.length - 1 : prev - 1));
    startAutoCloseTimer();
  };

  const handleTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div className="scrolling-artworks-container">
        {/* All 15 artworks in one row scrolling right */}
        <div className="scroll-row scroll-right">
          <div className="scroll-track">
            {/* Duplicate pieces twice for infinite scroll (reduced for performance) */}
            {[...pieces, ...pieces].map((piece, index) => (
              <div
                key={`artwork-${index}`}
                className="scroll-item"
                onClick={() => handleImageClick(piece)}
              >
                <Image
                  src={`/images/${piece.file}`}
                  alt={piece.title}
                  width={400}
                  height={533}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  loading="eager"
                  quality={85}
                  sizes="280px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgZmlsbD0iIzExMTAwOSIvPjwvc3ZnPg=="
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {fullscreenIndex !== null && (
        <div
          className="mobile-peek-overlay peek-artwork"
          onClick={handleCloseFullscreen}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mobile-peek-image">
            <img
              src={`/images/${pieces[fullscreenIndex].file}`}
              alt={pieces[fullscreenIndex].title}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="mobile-peek-counter">
            {String(fullscreenIndex + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}
          </div>
          <div className="mobile-peek-timer" />
        </div>
      )}
    </>
  );
}
