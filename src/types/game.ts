import { Inventory, Equipment } from './items';
import { CombatStats } from './combat';
import { Skill } from './skills';

export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  position: Position;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  experience: number;
  sprite: string;
  inventory: Inventory;
  equipment: Equipment;
  stats: CombatStats;
  skills: Skill[];
  isMoving?: boolean;
  targetId?: string;
  lastAttack?: number;
}

export interface GameState {
  player: Character;
  npcs: Character[];
  gameMap: number[][];
  combatLog: string[];
  skillCooldowns: Record<string, SkillState>;
}