export interface Attack {
  damage: number;
  type: 'physical' | 'magical';
}

export interface CombatStats {
  attack: number;
  defense: number;
  criticalChance: number;
}