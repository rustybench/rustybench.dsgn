export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <div className="modal-content">
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>

          <h1 id="about-title">About Rustybench</h1>

          <div className="modal-body">
            <p>
              Rustybench is a multidisciplinary artist and designer exploring the
              intersection of traditional aesthetics and contemporary digital media.
            </p>

            <p>
              Through a distinctive dark luxury visual language, each piece captures
              moments of tension between the mystical and the tangible, the ancient
              and the modern.
            </p>

            <p>
              Working primarily with digital illustration, print design, and mixed media,
              Rustybench creates work that invites contemplation and demands attention.
            </p>

            <h2>Philosophy</h2>
            <p>
              "In darkness, we find the gold that shimmers brightest. In stillness,
              the cosmic dance becomes visible."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
