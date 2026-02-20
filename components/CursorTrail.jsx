import { useEffect } from 'react';

const TRAIL_COUNT = 22;

export default function CursorTrail() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:998;mix-blend-mode:screen;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -999, y: -999 };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -999, y: -999 }));

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener('mousemove', onMove);

    let frame = 0;
    let raf;

    function tick() {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x;
        trail[i].y = trail[i - 1].y;
      }
      trail[0].x += (mouse.x - trail[0].x) * 0.28;
      trail[0].y += (mouse.y - trail[0].y) * 0.28;

      for (let i = 0; i < trail.length; i++) {
        const t     = i / trail.length;
        const alpha = 0.55 * (1 - t) * (1 - t);
        if (alpha < 0.005) continue;
        const size = 5 * (1 - t * 0.7);
        const wx   = trail[i].x + Math.sin(frame * 0.04 + i) * 0.6;
        const wy   = trail[i].y + Math.cos(frame * 0.03 + i) * 0.6;
        const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, size * 2.2);
        grad.addColorStop(0,   `rgba(184,150,90,${(alpha * 0.9).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(160,110,60,${(alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1,   'rgba(100,60,20,0)');
        ctx.beginPath();
        ctx.ellipse(
          wx, wy,
          size * (1 + Math.sin(frame * 0.07 + i) * 0.15),
          size * (0.55 + Math.cos(frame * 0.05 + i) * 0.1),
          Math.sin(i * 0.8) * 0.8,
          0, Math.PI * 2
        );
        ctx.fillStyle = grad;
        ctx.fill();
      }
      frame++;
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.remove();
    };
  }, []);

  return null;
}
