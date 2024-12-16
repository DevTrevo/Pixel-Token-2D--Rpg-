import { Character } from '../types/game';
import { Attack } from '../types/combat';

export const calculateDamage = (attacker: Character, defender: Character): Attack => {
  const baseDamage = attacker.stats.attack - defender.stats.defense;
  const isCritical = Math.random() < attacker.stats.criticalChance;
  const damage = Math.max(1, baseDamage * (isCritical ? 2 : 1));

  return {
    damage: Math.floor(damage),
    type: 'physical'
  };
};

export const isInRange = (attacker: Character, target: Character, range: number = 1): boolean => {
  const dx = Math.abs(attacker.position.x - target.position.x);
  const dy = Math.abs(attacker.position.y - target.position.y);
  return dx <= range && dy <= range;
};