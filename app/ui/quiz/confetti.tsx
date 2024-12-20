// components/Confetti.tsx
import React, { useEffect, useState } from 'react';

const Confetti = ({ count = 900 }: { count?: number }) => {
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: number; x: number; y: number; color: string; duration: number }>
  >([]);

  useEffect(() => {
    const generateConfetti = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 200 - 100, // Random horizontal offset (-100 to 100 vw)
      y: Math.random() * 200 - 100, // Random vertical offset (-100 to 100 vh)
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
      duration: Math.random() * 0.5 + 0.5, // Random duration (0.5s to 1s)
    }));
    setConfettiPieces(generateConfetti);

    // Clear confetti after 10 seconds
    const timeout = setTimeout(() => setConfettiPieces([]), 1000);

    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-4 rounded transition-transform duration-300 ease-out"
          style={{
            backgroundColor: piece.color,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`,
            animation: `random-move ${piece.duration}s ease-out, fade-out 10s linear`,
            '--x': `${piece.x}vw`,
            '--y': `${piece.y}vh`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default Confetti;
