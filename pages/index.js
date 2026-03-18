import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import AboutModal from '../components/AboutModal';
import ScrollingArtworks from '../components/ScrollingArtworks';
import CardStackViewer from '../components/gallery/CardStackViewer';
import BentoMockups from '../components/gallery/BentoMockups';
import Footer from '../components/Footer';
import { pieces } from '../data/pieces';

const col1 = pieces.filter(p => p.col === 1);
const col2 = pieces.filter(p => p.col === 2);
const col3 = pieces.filter(p => p.col === 3);

export default function Home() {
  const colRefs = [useRef(null), useRef(null), useRef(null)];
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showCardStack, setShowCardStack] = useState(false);
  const stackPlaceholderRef = useRef(null);
  const cardRefs = useRef([]);
  const [showingBacks, setShowingBacks] = useState(false); // Track global flip-all state

  const handleFlipAll = () => {
    const targetState = showingBacks ? 'front' : 'back';

    // Flip all cards synchronously in a single frame
    cardRefs.current.forEach(ref => {
      if (ref) ref.flipTo(targetState);
    });

    setShowingBacks(!showingBacks);
  };

  useEffect(() => {
    const cols = colRefs.map(r => r.current);
    cols.forEach((col, ci) => {
      if (!col) return;
      col.querySelectorAll('.item').forEach((item, ni) => {
        const delay = ci * 0.03 + ni * 0.07;
        setTimeout(() => {
          item.classList.add('visible');
          setTimeout(() => {
            item.style.transition = 'transform 0s';
            item.style.opacity    = '1';
            item.style.translate  = '0 0';
          }, 500);
        }, delay * 1000);
      });
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCardStack(true);
        }
      },
      { rootMargin: '200px' }
    );

    const placeholder = stackPlaceholderRef.current;
    if (placeholder) {
      observer.observe(placeholder);
    }

    return () => {
      if (placeholder) {
        observer.unobserve(placeholder);
      }
    };
  }, []);

  // Calculate global positions for unified back design
  // NOTE: Card.jsx will be updated in Task 2 to consume cardIndex and backImage props
  const allPieces = [...col1, ...col2, ...col3];
  const positionMap = new Map(allPieces.map((p, index) => [p.file, index]));
  const getCardPosition = (file) => positionMap.get(file) ?? -1;

  // Back design threshold: upper 8 cards use 01.webp, lower 7 use 02.webp
  const BACK_IMAGE_THRESHOLD = 8;

  return (
    <>
      <Navbar onAboutClick={() => setIsAboutOpen(true)} />
      <div className="layout">
        <Sidebar onFlipAll={handleFlipAll} />
        <main className="main">
          {/* Desktop: Masonry Grid */}
          <div className="desktop-artworks">
            <div className="masonry">
            <div className="col" ref={colRefs[0]}>
              {col1.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < BACK_IMAGE_THRESHOLD ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    ref={(el) => cardRefs.current[globalIndex] = el}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                    palette={p.palette}
                  />
                );
              })}
            </div>
            <div className="col" ref={colRefs[1]}>
              {col2.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < BACK_IMAGE_THRESHOLD ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    ref={(el) => cardRefs.current[globalIndex] = el}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                    palette={p.palette}
                  />
                );
              })}
            </div>
            <div className="col" ref={colRefs[2]}>
              {col3.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < BACK_IMAGE_THRESHOLD ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    ref={(el) => cardRefs.current[globalIndex] = el}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                    palette={p.palette}
                  />
                );
              })}
            </div>
          </div>
          </div>

          {/* Mobile: Bento Mockups Grid (shown first on mobile) */}
          <div className="mobile-gallery">
            <BentoMockups />
          </div>

          {/* Mobile: Scrolling Artworks (shown second on mobile) */}
          <div className="mobile-artworks">
            <ScrollingArtworks />
          </div>

          {/* Desktop: Card Stack Gallery - appears below masonry grid */}
          <div className="desktop-gallery">
            {showCardStack ? (
              <CardStackViewer />
            ) : (
              <div
                ref={stackPlaceholderRef}
                className="card-stack-placeholder"
                style={{ minHeight: '100vh' }}
              />
            )}
          </div>

          {/* Footer - completes the portfolio */}
          <Footer />
        </main>
      </div>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
