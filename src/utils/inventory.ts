import { Item, Inventory } from '../types/items';

export const addItemToInventory = (inventory: Inventory, item: Item): boolean => {
  if (inventory.items.length >= inventory.maxSize) {
    return false;
  }
  inventory.items.push(item);
  return true;
};

export const removeItemFromInventory = (inventory: Inventory, itemId: string): Item | undefined => {
  const index = inventory.items.findIndex(item => item.id === itemId);
  if (index === -1) return undefined;
  return inventory.items.splice(index, 1)[0];
};