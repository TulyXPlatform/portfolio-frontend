import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import type { SeasonTheme } from '../context/ThemeContext';

const HangingBulb: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Physics for the bulb
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 1 inch rope approx 96px
  // Approx 1 inch rope
  const ROPE_LENGTH = 65;

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotate = useTransform(springX, [-50, 50], [-20, 20]);

  const themes: SeasonTheme[] = ['dark', 'light'];

  const handlePull = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className="hanging-bulb-container">
      {/* The Rope SVG - parented over the floating road */}
      <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', width: '100%', height: '100px' }}>
        <motion.line
          x1="9"
          y1="0"
          x2={useTransform(springX, (val) => 9 + val)}
          y2={useTransform(springY, (val) => ROPE_LENGTH + val - 4)}
          stroke="#777"
          strokeWidth="3"
        />
      </svg>

      {/* The Bulb - centered at the 9px mark within the 18px container */}
      <motion.div
        drag
        dragConstraints={{ top: 0, left: -6, right: 6, bottom: 15 }}
        dragElastic={0.05}
        onDragEnd={() => {
          if (y.get() > 10) handlePull();
          x.set(0);
          y.set(0);
        }}
        onDrag={(_, info) => {
          x.set(info.offset.x);
          y.set(info.offset.y);
        }}
        style={{
          x: springX,
          y: springY,
          rotate,
          position: 'absolute',
          top: ROPE_LENGTH,
          left: 0,
          cursor: 'grab',
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'all'
        }}
        className={`bulb-main ${theme}`}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="bulb-connector" style={{ width: '8px', height: '6px', background: '#444', borderRadius: '2px 2px 0 0', marginBottom: '-2px' }} />
        <div className="bulb-glass" />
      </motion.div>
    </div >
  );
};

export default HangingBulb;
