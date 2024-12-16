import { create } from 'zustand';
import { GameState, Position, Character } from '../types/game';
import { calculateDamage, isInRange } from '../utils/combat';
import { calculatePath } from '../utils/pathfinding';
import { getRandomPosition } from '../utils/map';
import { INITIAL_SKILLS } from '../constants/skills';
import { GAME_CONFIG } from '../constants/config';

const INITIAL_STATE: GameState = {
  player: {
    id: 'player',
    name: 'Hero',
    position: { x: 5, y: 5 },
    health: 100,
    maxHealth: 100,
    mana: 100,
    maxMana: 100,
    level: 1,
    experience: 0,
    sprite: '🧙‍♂️',
    inventory: { items: [], maxSize: 20 },
    equipment: {},
    stats: { attack: 10, defense: 5, criticalChance: 0.1 },
    skills: INITIAL_SKILLS,
    lastAttack: Date.now()
  },
  npcs: [
    {
      id: 'npc1',
      name: 'Goblin',
      position: { x: 8, y: 8 },
      health: 50,
      maxHealth: 50,
      mana: 0,
      maxMana: 0,
      level: 1,
      experience: 10,
      sprite: '👾',
      inventory: { items: [], maxSize: 5 },
      equipment: {},
      stats: { attack: 5, defense: 3, criticalChance: 0.05 },
      skills: [],
      lastAttack: Date.now()
    }
  ],
  gameMap: Array(15).fill(Array(15).fill(0)),
  combatLog: [],
  skillCooldowns: {}
};

export const useGameStore = create<{
  gameState: GameState;
  movePlayer: (direction: Position) => void;
  moveToTarget: (targetId: string | null) => void;
  attack: (targetId: string) => void;
  useSkill: (skillId: string, targetId: string) => void;
  updateMovement: () => void;
  updateCooldowns: () => void;
  regenerateMana: () => void;
  updateEnemies: () => void;
}>((set, get) => ({
  gameState: INITIAL_STATE,

  movePlayer: (direction) =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        player: {
          ...state.gameState.player,
          position: {
            x: Math.max(0, Math.min(14, state.gameState.player.position.x + direction.x)),
            y: Math.max(0, Math.min(14, state.gameState.player.position.y + direction.y))
          },
          isMoving: false,
          targetId: undefined
        }
      }
    })),

  moveToTarget: (targetId) =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        player: {
          ...state.gameState.player,
          isMoving: targetId !== null,
          targetId: targetId || undefined
        }
      }
    })),

  attack: (targetId) =>
    set((state) => {
      const target = state.gameState.npcs.find(npc => npc.id === targetId);
      if (!target || !isInRange(state.gameState.player, target)) {
        return state;
      }

      const attackResult = calculateDamage(state.gameState.player, target);
      const newHealth = Math.max(0, target.health - attackResult.damage);

      return {
        gameState: {
          ...state.gameState,
          npcs: state.gameState.npcs.map(npc =>
            npc.id === targetId
              ? { ...npc, health: newHealth }
              : npc
          ),
          combatLog: [
            `${state.gameState.player.name} hits ${target.name} for ${attackResult.damage} damage!`,
            ...state.gameState.combatLog.slice(0, 5)
          ]
        }
      };
    }),

  useSkill: (skillId: string, targetId: string) =>
    set((state) => {
      const skill = state.gameState.player.skills.find(s => s.id === skillId);
      const target = state.gameState.npcs.find(npc => npc.id === targetId);
      const cooldown = state.gameState.skillCooldowns[skillId];
      
      if (!skill || !target || (cooldown && !cooldown.isReady)) return state;
      
      if (state.gameState.player.mana < skill.manaCost) {
        return {
          gameState: {
            ...state.gameState,
            combatLog: [
              'Not enough mana!',
              ...state.gameState.combatLog
            ]
          }
        };
      }

      const newHealth = Math.max(0, target.health - skill.damage);
      const newMana = state.gameState.player.mana - skill.manaCost;

      return {
        gameState: {
          ...state.gameState,
          player: {
            ...state.gameState.player,
            mana: newMana
          },
          npcs: state.gameState.npcs.map(npc =>
            npc.id === targetId
              ? { ...npc, health: newHealth }
              : npc
          ),
          skillCooldowns: {
            ...state.gameState.skillCooldowns,
            [skillId]: {
              lastUsed: Date.now(),
              isReady: false
            }
          },
          combatLog: [
            `${state.gameState.player.name} uses ${skill.name} on ${target.name} for ${skill.damage} damage!`,
            ...state.gameState.combatLog.slice(0, 5)
          ]
        }
      };
    }),

  updateMovement: () =>
    set((state) => {
      if (!state.gameState.player.isMoving || !state.gameState.player.targetId) return state;

      const target = state.gameState.npcs.find(npc => npc.id === state.gameState.player.targetId);
      if (!target) return state;

      if (isInRange(state.gameState.player, target)) {
        get().attack(target.id);
        return state;
      }

      const path = calculatePath(state.gameState.player.position, target.position);
      if (path.length === 0) return state;

      const nextPosition = path[0];
      return {
        gameState: {
          ...state.gameState,
          player: {
            ...state.gameState.player,
            position: nextPosition
          }
        }
      };
    }),

  updateCooldowns: () =>
    set((state) => {
      const now = Date.now();
      const updatedCooldowns = { ...state.gameState.skillCooldowns };

      state.gameState.player.skills.forEach(skill => {
        const cooldown = updatedCooldowns[skill.id];
        if (cooldown && !cooldown.isReady) {
          if (now - cooldown.lastUsed >= skill.cooldown) {
            updatedCooldowns[skill.id] = { ...cooldown, isReady: true };
          }
        }
      });

      return {
        gameState: {
          ...state.gameState,
          skillCooldowns: updatedCooldowns
        }
      };
    }),

  regenerateMana: () =>
    set((state) => {
      const now = Date.now();
      const timeDiff = (now - (state.gameState.player.lastAttack || 0)) / 1000;
      const manaGain = GAME_CONFIG.manaRegenRate * timeDiff;
      
      const newMana = Math.min(
        state.gameState.player.maxMana,
        state.gameState.player.mana + manaGain
      );

      return {
        gameState: {
          ...state.gameState,
          player: {
            ...state.gameState.player,
            mana: newMana,
            lastAttack: now
          }
        }
      };
    }),

  updateEnemies: () =>
    set((state) => {
      const now = Date.now();
      let updatedNpcs = [...state.gameState.npcs];

      // Handle dead enemies
      updatedNpcs = updatedNpcs.map(npc => {
        if (npc.health <= 0) {
          const newPosition = getRandomPosition(14, 14);
          return {
            ...npc,
            health: npc.maxHealth,
            position: newPosition,
            lastAttack: now
          };
        }
        return npc;
      });

      // Handle enemy attacks
      updatedNpcs = updatedNpcs.map(npc => {
        if (npc.health > 0 && isInRange(npc, state.gameState.player)) {
          const timeSinceLastAttack = now - (npc.lastAttack || 0);
          if (timeSinceLastAttack >= GAME_CONFIG.enemyAttackInterval) {
            const damage = calculateDamage(npc, state.gameState.player);
            const newPlayerHealth = Math.max(0, state.gameState.player.health - damage.damage);

            state.gameState.combatLog.unshift(
              `${npc.name} hits ${state.gameState.player.name} for ${damage.damage} damage!`
            );

            state.gameState.player.health = newPlayerHealth;
            return { ...npc, lastAttack: now };
          }
        }
        return npc;
      });

      return {
        gameState: {
          ...state.gameState,
          npcs: updatedNpcs
        }
      };
    })
}));