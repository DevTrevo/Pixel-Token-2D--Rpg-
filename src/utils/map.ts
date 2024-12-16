export const getRandomPosition = (maxX: number, maxY: number): { x: number; y: number } => {
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY)
  };
};