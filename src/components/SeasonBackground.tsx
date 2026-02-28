import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ──────────────────────────────────────────────────────────
   Season-specific animated background layers.
   Sits at z-index: -2, below tsparticles at z-index: -1.
   ────────────────────────────────────────────────────────── */
const SeasonBackground: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    if (theme === 'light') buildLight(container);
    else buildDark(container);

    return () => { container.innerHTML = ''; };
  }, [theme]);

  return <div ref={containerRef} className="season-bg" aria-hidden="true" />;
};

/* ── LIGHT: White greenish professional vibe ── */
function buildLight(el: HTMLDivElement) {
  // Very subtle floating green particles
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      width:2px;
      height:2px;
      background:rgba(16, 185, 129, 0.2);
      border-radius:50%;
      animation:floatSoft ${10 + Math.random() * 10}s infinite alternate;
    `;
    el.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatSoft { from { transform: translate(0,0); } to { transform: translate(30px, 30px); } }
  `;
  el.appendChild(style);
}

/* ── DARK: Green neon grid ── */
function buildDark(el: HTMLDivElement) {
  const grid = document.createElement('div');
  grid.className = 'neon-grid';
  el.appendChild(grid);

  for (let i = 0; i < 12; i++) {
    const col = document.createElement('div');
    col.style.cssText = `
          position:absolute;
          top:-20px;
          left:${5 + i * 8}%;
          font-family:monospace;
          font-size:0.7rem;
          color:rgba(0, 255, 136, 0.1);
          writing-mode:vertical-rl;
          animation:binaryRain ${8 + i * 2}s ${Math.random() * 5}s linear infinite;
          white-space:nowrap;
        `;
    col.textContent = '10110101001010110'.repeat(10);
    el.appendChild(col);
  }
}

export default SeasonBackground;
