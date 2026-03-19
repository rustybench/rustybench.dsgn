import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Split into two columns - odd/even distribution for balanced flow
const columnLeft = [
  { id: 1, src: '/images/mockupimgs/1.webp', width: 1600, height: 2133 },
  { id: 3, src: '/images/mockupimgs/3.webp', width: 1600, height: 2133 },
  { id: 5, src: '/images/mockupimgs/5.webp', width: 1600, height: 2400 },
  { id: 7, src: '/images/mockupimgs/7.webp', width: 2400, height: 1600 },
  { id: 9, src: '/images/mockupimgs/9.webp', width: 1600, height: 2400 },
  { id: 11, src: '/images/mockupimgs/11.webp', width: 1600, height: 2133 },
  { id: 13, src: '/images/mockupimgs/13.webp', width: 2400, height: 1600 },
  { id: 15, src: '/images/mockupimgs/15.webp', width: 2400, height: 1600 },
  { id: 17, src: '/images/mockupimgs/17.webp', width: 2400, height: 1600 },
];

const columnRight = [
  { id: 2, src: '/images/mockupimgs/2.webp', width: 1600, height: 2400 },
  { id: 4, src: '/images/mockupimgs/4.webp', width: 2400, height: 1600 },
  { id: 6, src: '/images/mockupimgs/6.webp', width: 1600, height: 2133 },
  { id: 8, src: '/images/mockupimgs/8.webp', width: 1600, height: 2133 },
  { id: 10, src: '/images/mockupimgs/10.webp', width: 2400, height: 1600 },
  { id: 12, src: '/images/mockupimgs/12.webp', width: 2400, height: 1600 },
  { id: 14, src: '/images/mockupimgs/14.webp', width: 1600, height: 2400 },
  { id: 16, src: '/images/mockupimgs/16.webp', width: 2400, height: 1600 },
  { id: 18, src: '/images/mockupimgs/18.webp', width: 2400, height: 1600 },
];

// Combine all images for navigation
const allImages = [...columnLeft, ...columnRight].sort((a, b) => a.id - b.id);

export default function BentoMockups() {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const itemRefs = useRef({});
  const autoCloseTimer = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  // Simple fade-in animation on scroll (desktop only for performance)
  useEffect(() => {
    // Skip animations on mobile for better performance
    if (window.innerWidth <= 640) {
      // Mark all items as visible immediately on mobile
      const allIds = [...columnLeft, ...columnRight].map(img => String(img.id));
      setVisibleItems(new Set(allIds));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const startAutoCloseTimer = () => {
    // Don't start timer if user has already swiped
    if (hasInteracted) return;

    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    autoCloseTimer.current = setTimeout(() => {
      setFullscreenIndex(null);
    }, 3000);
  };

  const handleImageClick = (img) => {
    const index = allImages.findIndex(i => i.id === img.id);
    setFullscreenIndex(index);
    setHasInteracted(false); // Reset interaction flag for new image
    startAutoCloseTimer();
  };

  const handleCloseFullscreen = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    setFullscreenIndex(null);
  };

  const handleNext = () => {
    setHasInteracted(true); // User swiped, disable timer
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    setFullscreenIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setHasInteracted(true); // User swiped, disable timer
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    setFullscreenIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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
      <div className="masonry-mockups">
        <div className="masonry-column">
          {columnLeft.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => (itemRefs.current[img.id] = el)}
              data-id={img.id}
              className={`masonry-item ${visibleItems.has(String(img.id)) ? 'visible' : ''}`}
              onClick={() => handleImageClick(img)}
            >
              <Image
                src={img.src}
                alt={`Mockup ${img.id}`}
                width={img.width}
                height={img.height}
                style={{ width: '100%', height: 'auto' }}
                loading="eager"
                quality={85}
                sizes="(max-width: 640px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzExMTAwOSIvPjwvc3ZnPg=="
              />
            </div>
          ))}
        </div>
        <div className="masonry-column">
          {columnRight.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => (itemRefs.current[img.id] = el)}
              data-id={img.id}
              className={`masonry-item ${visibleItems.has(String(img.id)) ? 'visible' : ''}`}
              onClick={() => handleImageClick(img)}
            >
              <Image
                src={img.src}
                alt={`Mockup ${img.id}`}
                width={img.width}
                height={img.height}
                style={{ width: '100%', height: 'auto' }}
                loading="eager"
                quality={85}
                sizes="(max-width: 640px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzExMTAwOSIvPjwvc3ZnPg=="
              />
            </div>
          ))}
        </div>
      </div>

      {fullscreenIndex !== null && (
        <div
          className="mobile-peek-overlay peek-mockup"
          onClick={handleCloseFullscreen}
        >
          <div className="mobile-peek-image">
            <img
              src={allImages[fullscreenIndex].src}
              alt={`Mockup ${allImages[fullscreenIndex].id}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="mobile-peek-counter">
            {String(fullscreenIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
          </div>
          <div className="mobile-peek-timer" />

          {/* Navigation arrows */}
          <button
            className="mobile-nav-arrow mobile-nav-left"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="mobile-nav-arrow mobile-nav-right"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}