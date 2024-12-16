import { Skill } from '../types/skills';

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    damage: 20,
    manaCost: 10,
    cooldown: 1000,
    range: 3,
    type: 'damage',
    icon: '🔥'
  },
  {
    id: 'heal',
    name: 'Heal',
    damage: -15,
    manaCost: 15,
    cooldown: 1000,
    range: 0,
    type: 'heal',
    icon: '💚'
  }
];