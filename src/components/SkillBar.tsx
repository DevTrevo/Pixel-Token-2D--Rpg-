import React from 'react';
import { useGameStore } from '../store/gameStore';

export const SkillBar: React.FC = () => {
  const { gameState, useSkill } = useGameStore();
  const { player, skillCooldowns } = gameState;

  if (!player || !player.skills) {
    return null;
  }

  const handleSkillClick = (skillId: string) => {
    if (player.targetId) {
      useSkill(skillId, player.targetId);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex gap-2">
        {player.skills.map((skill) => {
          const cooldown = skillCooldowns[skill.id];
          const isReady = !cooldown || cooldown.isReady;
          const hasEnoughMana = player.mana >= skill.manaCost;

          return (
            <button
              key={skill.id}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl relative
                ${isReady && hasEnoughMana ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 opacity-50'}`}
              onClick={() => handleSkillClick(skill.id)}
              disabled={!isReady || !hasEnoughMana}
            >
              {skill.icon}
              {!hasEnoughMana && (
                <div className="absolute -bottom-2 left-0 w-full text-xs text-red-500">
                  No mana
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};