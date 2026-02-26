import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import AboutModal from '../components/AboutModal';
import CardStackViewer from '../components/gallery/CardStackViewer';
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
  const allPieces = [...col1, ...col2, ...col3];
  const getCardPosition = (file) => {
    return allPieces.findIndex(p => p.file === file);
  };

  return (
    <>
      <Navbar onAboutClick={() => setIsAboutOpen(true)} />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <div className="masonry">
            <div className="col" ref={colRefs[0]}>
              {col1.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < 8 ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                  />
                );
              })}
            </div>
            <div className="col" ref={colRefs[1]}>
              {col2.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < 8 ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                  />
                );
              })}
            </div>
            <div className="col" ref={colRefs[2]}>
              {col3.map((p, index) => {
                const globalIndex = getCardPosition(p.file);
                const backImage = globalIndex < 8 ? '01' : '02';
                return (
                  <Card
                    key={p.file}
                    title={p.title}
                    file={p.file}
                    isPriority={index < 2}
                    cardIndex={globalIndex}
                    backImage={backImage}
                  />
                );
              })}
            </div>
          </div>

          {/* Card Stack Gallery - appears below masonry grid */}
          {showCardStack ? (
            <CardStackViewer />
          ) : (
            <div
              ref={stackPlaceholderRef}
              className="card-stack-placeholder"
              style={{ minHeight: '100vh' }}
            />
          )}

          {/* Footer - completes the portfolio */}
          <Footer />
        </main>
      </div>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
