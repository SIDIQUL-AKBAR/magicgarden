export interface Plant {
  id: string;
  name: string;
  emoji: string;
  growTime: number;
  stage: number;
  maxStage: number;
  magical: boolean;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  type: 'seed' | 'tool' | 'potion' | 'spell';
  quantity: number;
  magical: boolean;
}

export interface GardenCell {
  id: number;
  plant: Plant | null;
  watered: boolean;
  fertilized: boolean;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  gems: number;
}

export interface Weather {
  type: 'sunny' | 'rainy' | 'magical' | 'starry';
  duration: number;
}