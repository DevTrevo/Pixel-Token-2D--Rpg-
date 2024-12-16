import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_CONFIG } from '../constants/config';

export const GameMap: React.FC = () => {
  const { gameState, moveToTarget, updateMovement, updateCooldowns, regenerateMana, updateEnemies } = useGameStore();
  const { player, npcs } = gameState;

  useEffect(() => {
    const interval = setInterval(() => {
      updateMovement();
      updateCooldowns();
      regenerateMana();
      updateEnemies();
    }, GAME_CONFIG.skillCheckInterval);

    return () => clearInterval(interval);
  }, [updateMovement, updateCooldowns, regenerateMana, updateEnemies]);

  // Create the map grid
  const mapGrid = Array(GAME_CONFIG.mapHeight).fill(null).map(() => 
    Array(GAME_CONFIG.mapWidth).fill(null)
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GAME_CONFIG.tileSize);
    const y = Math.floor((e.clientY - rect.top) / GAME_CONFIG.tileSize);
    
    if (x >= 0 && x < GAME_CONFIG.mapWidth && y >= 0 && y < GAME_CONFIG.mapHeight) {
      const clickedNpc = npcs.find(npc => npc.position.x === x && npc.position.y === y);
      if (clickedNpc) {
        moveToTarget(clickedNpc.id);
      } else {
        moveToTarget(null);
      }
    }
  };

  return (
    <div 
      className="relative bg-green-900 rounded-lg overflow-hidden"
      style={{
        width: GAME_CONFIG.mapWidth * GAME_CONFIG.tileSize,
        height: GAME_CONFIG.mapHeight * GAME_CONFIG.tileSize
      }}
      onClick={handleMapClick}
    >
      {/* Render map tiles */}
      {mapGrid.map((row, y) =>
        row.map((_, x) => (
          <div
            key={`${x}-${y}`}
            className="absolute border border-green-800 bg-green-950/30"
            style={{
              left: x * GAME_CONFIG.tileSize,
              top: y * GAME_CONFIG.tileSize,
              width: GAME_CONFIG.tileSize,
              height: GAME_CONFIG.tileSize
            }}
          />
        ))
      )}
      
      {/* Render player */}
      <div
        className="absolute text-4xl transition-all duration-100 flex items-center justify-center"
        style={{
          left: player.position.x * GAME_CONFIG.tileSize,
          top: player.position.y * GAME_CONFIG.tileSize,
          width: GAME_CONFIG.tileSize,
          height: GAME_CONFIG.tileSize
        }}
      >
        {player.sprite}
        {/* Player health bar */}
        <div className="absolute -top-2 left-0 w-full h-1 bg-gray-700 rounded">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          />
        </div>
      </div>

      {/* Render NPCs */}
      {npcs.map((npc) => (
        <div
          key={npc.id}
          className={`absolute text-4xl transition-all duration-100 cursor-pointer 
            hover:scale-110 flex items-center justify-center
            ${player.targetId === npc.id ? 'ring-2 ring-red-500' : ''}`}
          style={{
            left: npc.position.x * GAME_CONFIG.tileSize,
            top: npc.position.y * GAME_CONFIG.tileSize,
            width: GAME_CONFIG.tileSize,
            height: GAME_CONFIG.tileSize
          }}
          onClick={(e) => {
            e.stopPropagation();
            moveToTarget(npc.id);
          }}
        >
          {npc.sprite}
          {/* NPC health bar */}
          <div className="absolute -top-2 left-0 w-full h-1 bg-gray-700 rounded">
            <div
              className="h-full bg-red-500 rounded"
              style={{ width: `${(npc.health / npc.maxHealth) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};