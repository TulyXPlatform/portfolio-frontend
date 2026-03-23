import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 
                    'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    if (isTouchDevice) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, [x, y, isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />
      <motion.div
        className="custom-cursor-ball"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      />
    </>
  );
};

export default CustomCursor;
