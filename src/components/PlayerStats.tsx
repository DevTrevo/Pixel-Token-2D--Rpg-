import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Star, Trophy } from 'lucide-react';

export const PlayerStats: React.FC = () => {
  const { gameState } = useGameStore();
  const { player } = gameState;

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">{player.name}</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-red-500 rounded-full h-4"
              style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
            />
          </div>
          <span>{player.health}/{player.maxHealth}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span>Level {player.level}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className="text-blue-500" />
          <span>XP: {player.experience}</span>
        </div>
      </div>
    </div>
  );
};