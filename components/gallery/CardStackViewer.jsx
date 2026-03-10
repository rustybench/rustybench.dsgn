import { useState, useEffect } from 'react';
import StackCard from './StackCard';
import FullscreenViewer from './FullscreenViewer';

// Mockup gallery images
const galleryImages = [
  { id: 'mockup-1', title: 'Mockup 1', src: '/images/mockupimgs/1.webp' },
  { id: 'mockup-2', title: 'Mockup 2', src: '/images/mockupimgs/2.webp' },
  { id: 'mockup-3', title: 'Mockup 3', src: '/images/mockupimgs/3.webp' },
  { id: 'mockup-4', title: 'Mockup 4', src: '/images/mockupimgs/4.webp' },
  { id: 'mockup-5', title: 'Mockup 5', src: '/images/mockupimgs/5.webp' },
  { id: 'mockup-6', title: 'Mockup 6', src: '/images/mockupimgs/6.webp' },
  { id: 'mockup-7', title: 'Mockup 7', src: '/images/mockupimgs/7.webp' },
  { id: 'mockup-8', title: 'Mockup 8', src: '/images/mockupimgs/8.webp' },
  { id: 'mockup-9', title: 'Mockup 9', src: '/images/mockupimgs/9.webp' },
  { id: 'mockup-10', title: 'Mockup 10', src: '/images/mockupimgs/10.webp' },
  { id: 'mockup-11', title: 'Mockup 11', src: '/images/mockupimgs/11.webp' },
  { id: 'mockup-12', title: 'Mockup 12', src: '/images/mockupimgs/12.webp' },
  { id: 'mockup-13', title: 'Mockup 13', src: '/images/mockupimgs/13.webp' },
  { id: 'mockup-14', title: 'Mockup 14', src: '/images/mockupimgs/14.webp' },
  { id: 'mockup-15', title: 'Mockup 15', src: '/images/mockupimgs/15.webp' },
  { id: 'mockup-16', title: 'Mockup 16', src: '/images/mockupimgs/16.webp' },
  { id: 'mockup-17', title: 'Mockup 17', src: '/images/mockupimgs/17.webp' },
  { id: 'mockup-18', title: 'Mockup 18', src: '/images/mockupimgs/18.webp' },
];

export default function CardStackViewer() {
  const [isSpread, setIsSpread] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  // Handle escape key to close fullscreen or circle
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (fullscreenIndex !== null) {
          setFullscreenIndex(null);
        } else if (isSpread) {
          setIsSpread(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenIndex, isSpread]);

  const handleStackClick = () => {
    if (!isSpread) {
      setIsSpread(true);
    }
  };

  const handleCenterClick = (e) => {
    e.stopPropagation();
    setIsSpread(false);
  };

  const handleCardClick = (index) => {
    if (isSpread) {
      setFullscreenIndex(index);
    }
  };

  const handleCloseFullscreen = () => {
    setFullscreenIndex(null);
  };

  const handleNext = () => {
    setFullscreenIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setFullscreenIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="card-stack-scene">
        <div className="stack-container" onClick={!isSpread ? handleStackClick : undefined}>
          <div className={`card-stack ${isSpread ? 'spread' : ''}`}>
            {galleryImages.map((img, index) => (
              <StackCard
                key={img.id}
                image={img}
                index={index}
                total={galleryImages.length}
                isSpread={isSpread}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>

          {isSpread && (
            <div className="circle-center" onClick={handleCenterClick}>
              <div className="center-icon">×</div>
            </div>
          )}
        </div>
      </div>

      {fullscreenIndex !== null && (
        <FullscreenViewer
          images={galleryImages}
          currentIndex={fullscreenIndex}
          onClose={handleCloseFullscreen}
          onNext={handleNext}
          onPrev={handlePrev}
          onSelect={setFullscreenIndex}
        />
      )}
    </>
  );
}
