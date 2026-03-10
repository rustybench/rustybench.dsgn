import { useEffect } from 'react';

export default function AboutModal({ isOpen, onClose }) {
  // Wrapper to remove focus before closing
  const handleClose = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="modal-container" role="dialog" aria-modal="true" aria-label="About Rustybench">
        <div className="modal-content">
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>

          <img
            src="/images/about.webp"
            alt="Rustybench"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </>
  );
}
