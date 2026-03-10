import { useEffect } from 'react';

export default function FullscreenViewer({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  const currentImage = images[currentIndex];

  return (
    <div className="fs-overlay">
      <div className="fs-backdrop" onClick={onClose} />

      <div className="fs-content">
        {/* Top bar with title and counter */}
        <div className="fs-header">
          <h2 className="fs-title">{currentImage.title}</h2>
          <div className="fs-counter">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </div>

        {/* Main image */}
        <div className="fs-image-container">
          <img
            src={currentImage.src}
            alt={currentImage.title}
            className="fs-image"
          />
        </div>

        {/* Navigation buttons */}
        <button
          className="fs-nav fs-prev"
          onClick={onPrev}
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className="fs-nav fs-next"
          onClick={onNext}
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 4L14 10L8 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Close button */}
        <button className="fs-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
