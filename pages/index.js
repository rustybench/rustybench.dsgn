import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { pieces } from '../data/pieces';

const col1 = pieces.filter(p => p.col === 1);
const col2 = pieces.filter(p => p.col === 2);
const col3 = pieces.filter(p => p.col === 3);

export default function Home() {
  const colRefs = [useRef(null), useRef(null), useRef(null)];

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

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <div className="masonry">
            <div className="col" ref={colRefs[0]}>
              {col1.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
            <div className="col" ref={colRefs[1]}>
              {col2.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
            <div className="col" ref={colRefs[2]}>
              {col3.map(p => <Card key={p.file} title={p.title} file={p.file} />)}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
