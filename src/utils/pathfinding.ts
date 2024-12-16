import { Position } from '../types/game';

export const calculatePath = (start: Position, end: Position): Position[] => {
  const path: Position[] = [];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Simple direct path calculation
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 1; i <= steps; i++) {
    path.push({
      x: start.x + Math.round((dx * i) / steps),
      y: start.y + Math.round((dy * i) / steps)
    });
  }
  
  return path;
};