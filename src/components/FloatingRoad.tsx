import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const sections = [
  { label: 'Home', id: 'hero-section', y: 15 },
  { label: 'Experience', id: 'experience-section', y: 45 },
  { label: 'Projects', id: 'projects-section', y: 75 },
  { label: 'Skills', id: 'skills-section', y: 105 },
  { label: 'Blog', id: 'blog-section', y: 135 },
  { label: 'Contact', id: 'contact-section', y: 165 },
];

const FloatingRoad: React.FC = () => {
  const location = useLocation();
  const [activeId, setActiveId] = useState('hero-section');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let current = 'hero-section';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPos) {
          current = s.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="floating-road">
      <svg className="road-path-vert" viewBox="0 0 140 200" preserveAspectRatio="none">
        <path
          d="M 25 0 
             C 25 7, 45 7, 45 15 
             C 45 30, 15 30, 15 45 
             C 15 60, 45 60, 45 75 
             C 45 90, 15 90, 15 105 
             C 15 120, 45 120, 45 135 
             C 45 150, 15 150, 15 165 
             C 15 190, 25 190, 25 200"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray="6 3"
          className="road-line-vert"
        />
        {sections.map((s, i) => {
          const pointX = (i % 2 === 0 ? 45 : 15);
          return (
            <g key={s.id} className={`road-point-vert ${activeId === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>
              <circle
                cx={pointX}
                cy={s.y}
                r={activeId === s.id ? 6 : 4}
                fill={activeId === s.id ? 'var(--secondary)' : 'var(--bg)'}
                stroke="var(--primary)"
                strokeWidth="2"
                style={{ transition: 'all 0.3s' }}
              />
              <text
                x={pointX + 12}
                y={s.y + 4}
                className="road-label-vert"
                textAnchor="start"
                style={{
                  fill: activeId === s.id ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: activeId === s.id ? 'bold' : 'normal',
                  opacity: activeId === s.id ? 1 : 0.6,
                }}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FloatingRoad;
