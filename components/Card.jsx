import { useEffect, useRef } from 'react';

const TILT_MAX = 10;

export default function Card({ title, file }) {
  const itemRef  = useRef(null);
  const frontRef = useRef(null);
  const backRef  = useRef(null);

  useEffect(() => {
    const card  = itemRef.current;
    const front = frontRef.current;
    const back  = backRef.current;
    if (!card || !front || !back) return;

    let flipped  = false;
    let raf      = null;
    let cx = 0, cy = 0, tx = 0, ty = 0, hovering = false;
    const lerp = (a, b, t) => a + (b - a) * t;

    back.style.transform = 'rotateY(180deg)';
    card.style.transformStyle = 'preserve-3d';
    front.style.backfaceVisibility = 'hidden';
    back.style.backfaceVisibility  = 'hidden';

    function setTransform() {
      if (flipped) {
        card.style.transform = `perspective(1000px) rotateX(${cy.toFixed(2)}deg) rotateY(${(cx + 180).toFixed(2)}deg)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      }
    }

    function tick() {
      cx = lerp(cx, tx, 0.1);
      cy = lerp(cy, ty, 0.1);
      setTransform();
      const settled = Math.abs(cx - tx) < 0.01 && Math.abs(cy - ty) < 0.01;
      if (!settled || hovering) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    function onEnter() {
      hovering = true;
      card.style.transition = 'transform 0s';
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const r = card.getBoundingClientRect();
      tx =  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * TILT_MAX;
      ty = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * TILT_MAX;
    }

    function onLeave() {
      hovering = false;
      tx = 0; ty = 0;
      card.style.transition = 'transform 0s';
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onClick() {
      tx = 0; ty = 0; cx = 0; cy = 0;
      hovering = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      flipped = !flipped;
      card.classList.toggle('flipped', flipped);
      card.style.transition = 'transform 0.75s cubic-bezier(0.4,0.2,0.2,1)';
      setTransform();
      setTimeout(() => { card.style.transition = 'transform 0s'; }, 780);
    }

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('click',      onClick);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mousemove',  onMove);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('click',      onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const src = `/images/${file}`;

  return (
    <div className="item" ref={itemRef}>
      <div className="card-front" ref={frontRef}>
        <img src={src} alt={title} loading="lazy" />
        <span className="flip-hint">flip</span>
      </div>
      <div className="card-back" ref={backRef}>
        <img className="back-blur" src={src} alt="" aria-hidden="true" />
        <div className="future-overlay">
          <div className="fo-rule" />
          <span className="fo-text">future mock-up</span>
          <div className="fo-rule" />
        </div>
        <span className="return-hint">close</span>
      </div>
    </div>
  );
}
