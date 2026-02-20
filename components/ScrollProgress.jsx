import { useEffect } from 'react';

export default function ScrollProgress() {
  useEffect(() => {
    // Create progress bar element
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--gold);z-index:250;pointer-events:none;width:0%;transition:width 0.1s ease-out;box-shadow:0 0 10px rgba(184,150,90,0.5);';
    document.body.appendChild(bar);

    // Find scrollable container
    const scrollContainer = document.querySelector('.main');
    if (!scrollContainer) {
      console.warn('ScrollProgress: .main container not found');
      return () => bar.remove();
    }

    // Update progress on scroll
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    // Initial update
    updateProgress();

    // Listen to scroll
    scrollContainer.addEventListener('scroll', updateProgress, { passive: true });

    // Cleanup
    return () => {
      scrollContainer.removeEventListener('scroll', updateProgress);
      bar.remove();
    };
  }, []);

  return null;
}
