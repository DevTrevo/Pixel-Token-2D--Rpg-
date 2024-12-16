export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion';
  value: number;
  sprite: string;
}

export interface Inventory {
  items: Item[];
  maxSize: number;
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
}