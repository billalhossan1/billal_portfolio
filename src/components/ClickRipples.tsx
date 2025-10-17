"use client";

import { useEffect, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const ClickRipples = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: 0,
        opacity: 1,
      };

      setRipples(prev => [...prev, newRipple]);

      // Animate the ripple
      const animate = () => {
        setRipples(prev =>
          prev.map(ripple =>
            ripple.id === newRipple.id
              ? { ...ripple, size: ripple.size + 2, opacity: ripple.opacity - 0.02 }
              : ripple
          ).filter(ripple => ripple.opacity > 0)
        );

        if (newRipple.size < 100) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 border-blue-400/50"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            opacity: ripple.opacity,
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
};

export default ClickRipples;