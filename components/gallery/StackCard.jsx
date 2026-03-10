import { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function StackCard({ image, index, total, isSpread, onClick }) {
  const prevIsSpread = useRef(isSpread);

  useEffect(() => {
    prevIsSpread.current = isSpread;
  }, [isSpread]);

  const getStackStyle = () => {
    // Determine animation direction for reverse stagger
    const wasSpread = prevIsSpread.current;
    const isCollapsing = wasSpread && !isSpread;

    // Calculate delay - reverse order when collapsing
    const delay = isCollapsing
      ? (total - 1 - index) * 0.04  // Last card first (15, 14, 13...)
      : index * 0.04;               // First card first (0, 1, 2...)

    if (!isSpread) {
      // Stacked: subtle offset to show depth (first image on top)
      return {
        transform: `translateY(${index * -2}px) translateX(${index * 1}px)`,
        zIndex: total - index,
        transitionDelay: `${delay}s`,
      };
    } else {
      // Spread: arrange in a circle (first image stays on top)
      const radius = 280; // Circle radius in pixels
      const angleStep = (2 * Math.PI) / total;
      const angle = angleStep * index - Math.PI / 2; // Start from top (12 o'clock)

      const xPos = Math.cos(angle) * radius;
      const yPos = Math.sin(angle) * radius;
      const rotationDegrees = (angle * 180 / Math.PI) + 90; // Radial rotation

      return {
        transform: `translateX(${xPos}px) translateY(${yPos}px) rotate(${rotationDegrees}deg)`,
        zIndex: 100 + (total - index), // First card on top, each subsequent under the previous
        transitionDelay: `${delay}s`,
      };
    }
  };

  return (
    <div
      className={`stack-card ${isSpread ? 'spread' : ''}`}
      style={getStackStyle()}
      onClick={onClick}
    >
      <div className="stack-card-inner">
        <Image
          src={image.src}
          alt={image.title}
          fill
          sizes="300px"
          style={{ objectFit: 'cover' }}
          loading={index > 2 ? "lazy" : undefined}
          priority={index <= 2}
        />
      </div>
    </div>
  );
}
