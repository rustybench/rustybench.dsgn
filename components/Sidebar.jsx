export default function Sidebar({ onFlipAll }) {
  return (
    <aside className="sidebar">
      <span className="sidebar-scroll-text">scroll</span>
      {onFlipAll && (
        <button
          onClick={onFlipAll}
          className="flip-all-button"
          aria-label="Flip all cards"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="7" y="7" width="10" height="10" rx="1" ry="1"/>
            <line x1="12" y1="7" x2="12" y2="17"/>
            <line x1="7" y1="12" x2="17" y2="12"/>
          </svg>
          <span>flip all</span>
        </button>
      )}
    </aside>
  );
}
