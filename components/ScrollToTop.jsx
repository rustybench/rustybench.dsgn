import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    // Find the actual scrolling container (.main element)
    const mainContainer = document.querySelector('.main');
    if (!mainContainer) return;

    const toggleVisibility = () => {
      const scrollHeight = mainContainer.scrollHeight;
      const scrollTop = mainContainer.scrollTop;
      const clientHeight = mainContainer.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Show when near bottom of page (within 800px of footer)
      if (distanceFromBottom < 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility(); // Check on mount
    mainContainer.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility);

    return () => {
      mainContainer.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Trigger ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 1200);

    // Trigger gallery wave effect
    const mainContainer = document.querySelector('.main');
    if (mainContainer) {
      mainContainer.classList.add('gallery-wave');
      setTimeout(() => mainContainer.classList.remove('gallery-wave'), 1200);

      // Scroll to top
      mainContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <button
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <span className="scroll-arrow">↑</span>
      </button>
      {showRipple && <div className="scroll-ripple" />}
    </>
  );
}
