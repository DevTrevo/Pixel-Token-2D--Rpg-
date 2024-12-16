export interface Skill {
  id: string;
  name: string;
  damage: number;
  manaCost: number;
  cooldown: number;
  range: number;
  type: 'damage' | 'heal' | 'buff';
  icon: string;
}

export interface SkillState {
  lastUsed: number;
  isReady: boolean;
}