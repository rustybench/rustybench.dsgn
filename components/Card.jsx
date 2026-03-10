import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import ColorPalette from './ColorPalette';

const TILT_MAX = 10;

const Card = forwardRef(function Card({ title, file, isPriority = false, cardIndex = 0, backImage = '01', palette = null }, ref) {
  const itemRef  = useRef(null);
  const frontRef = useRef(null);
  const backRef  = useRef(null);
  const flipFnRef = useRef(null);
  const flippedRef = useRef(false); // Track flipped state for imperative access

  useEffect(() => {
    const card  = itemRef.current;
    const front = frontRef.current;
    const back  = backRef.current;
    if (!card || !front || !back) return;

    let flipped  = flippedRef.current; // Initialize from shared ref
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

    function onClick(e) {
      // Don't flip if clicking on color palette
      if (e && e.target && e.target.closest('.color-palette')) return;

      tx = 0; ty = 0; cx = 0; cy = 0;
      hovering = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      flipped = !flipped;
      flippedRef.current = flipped; // Update shared ref
      card.classList.toggle('flipped', flipped);
      card.style.transition = 'transform 0.75s cubic-bezier(0.4,0.2,0.2,1)';
      setTransform();
      setTimeout(() => { card.style.transition = 'transform 0s'; }, 780);
    }

    // Store flip function for imperative access
    flipFnRef.current = onClick;

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

  // Expose flipTo method and DOM element to parent via ref
  useImperativeHandle(ref, () => ({
    flipTo: (targetState) => {
      if (!itemRef.current) return;

      const shouldBeFlipped = targetState === 'back';
      // Only flip if changing to a different state
      if (flippedRef.current !== shouldBeFlipped && flipFnRef.current) {
        flipFnRef.current(); // Trigger the flip animation
      }
    },
    getElement: () => itemRef.current
  }));

  const src = `/images/${file}`;

  return (
    <div className="item" ref={itemRef}>
      <div className="card-front" ref={frontRef}>
        <Image
          src={src}
          alt={title}
          width={1000}
          height={1200}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ width: '100%', height: 'auto' }}
          priority={isPriority}
        />
        <span className="flip-hint">flip</span>
      </div>
      <div className="card-back" ref={backRef}>
        {palette && <ColorPalette colors={palette} />}
        <span className="return-hint">close</span>
      </div>
    </div>
  );
});

export default Card;
