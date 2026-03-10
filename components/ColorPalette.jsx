import { useState } from 'react';

export default function ColorPalette({ colors }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (hex, index, e) => {
    e.stopPropagation(); // Prevent card flip
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="color-palette" onClick={(e) => e.stopPropagation()}>
      <div className="palette-header">
        <span className="palette-label">Color Palette</span>
      </div>
      <div className="palette-grid">
        {colors.map((color, i) => (
          <div
            key={i}
            className="palette-item"
            onClick={(e) => handleCopy(color.hex, i, e)}
            role="button"
            tabIndex={0}
            aria-label={`Copy ${color.hex}`}
          >
            <div
              className="palette-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <div className="palette-hex">
              {color.hex}
            </div>
            {copiedIndex === i && (
              <div className="palette-copied">Copied!</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
