"use client";

import { useEffect, useRef, useState } from 'react';


const MagneticElements = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const [score, setScore] = useState(0);
  const targetRef = useRef({ x: 100, y: 100 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsFollowing(true);
    };

    const animate = () => {
      if (!orbRef.current) return;

      const currentX = position.x;
      const currentY = position.y;
      const targetX = targetRef.current.x;
      const targetY = targetRef.current.y;

      // Calculate distance to mouse
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        // Move towards mouse with easing
        const speed = Math.min(distance * 0.02, 8);
        const newX = currentX + (dx / distance) * speed;
        const newY = currentY + (dy / distance) * speed;

        setPosition({ x: newX, y: newY });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => {
      const orbRect = orbRef.current?.getBoundingClientRect();
      if (!orbRect) return;

      // Check if click is within orb bounds
      if (
        e.clientX >= orbRect.left &&
        e.clientX <= orbRect.right &&
        e.clientY >= orbRect.top &&
        e.clientY <= orbRect.bottom
      ) {
        setIsCaught(true);
        setScore(prev => prev + 1);

        // Reset after animation
        setTimeout(() => {
          setIsCaught(false);
          // Move to random position
          setPosition({
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100),
          });
        }, 1000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position]);

  return (
    <>
      <div
        ref={orbRef}
        className={`fixed w-16 h-16 rounded-full cursor-pointer transition-all duration-300 z-10 ${
          isCaught
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-125 shadow-2xl'
            : 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg hover:shadow-xl'
        }`}
        style={{
          left: position.x - 32,
          top: position.y - 32,
          transform: `translate(-50%, -50%) ${isFollowing ? 'scale(1.1)' : 'scale(1)'}`,
        }}
      >
        <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
            isCaught
              ? 'bg-yellow-300 scale-110'
              : 'bg-white/40'
          }`} />
        </div>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full blur-md transition-all duration-300 ${
          isCaught
            ? 'bg-yellow-400/50 scale-150'
            : 'bg-blue-400/30 scale-110'
        }`} />
      </div>

      {/* Score display */}
      <div className="fixed top-4 right-4 bg-gray-900/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm z-20">
        <div className="text-sm font-medium">Score: {score}</div>
        <div className="text-xs text-gray-300">Click the orb!</div>
      </div>
    </>
  );
};

export default MagneticElements;