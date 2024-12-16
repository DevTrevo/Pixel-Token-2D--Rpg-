import React from 'react';
import { useGameStore } from '../store/gameStore';

export const CombatLog: React.FC = () => {
  const { gameState } = useGameStore();

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white w-64 h-48 overflow-y-auto">
      <h3 className="text-lg font-bold mb-2">Combat Log</h3>
      <div className="space-y-1">
        {gameState.combatLog.map((log, index) => (
          <p key={index} className="text-sm text-gray-300">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};