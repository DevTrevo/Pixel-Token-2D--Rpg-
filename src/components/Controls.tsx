import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const Controls: React.FC = () => {
  const { movePlayer } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          movePlayer({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          movePlayer({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          movePlayer({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  return (
    <div className="grid grid-cols-3 gap-2 w-48">
      <div />
      <button
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => movePlayer({ x: 0, y: -1 })}
      >
        <ArrowUp />
      </button>
      <div />
      <button
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => movePlayer({ x: -1, y: 0 })}
      >
        <ArrowLeft />
      </button>
      <button
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => movePlayer({ x: 0, y: 1 })}
      >
        <ArrowDown />
      </button>
      <button
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => movePlayer({ x: 1, y: 0 })}
      >
        <ArrowRight />
      </button>
    </div>
  );
};