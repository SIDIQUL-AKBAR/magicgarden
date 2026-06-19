import { Plant, InventoryItem, GardenCell, PlayerState } from '../types/game';

export const initialPlayer: PlayerState = {
  name: 'Gardener',
  level: 1,
  xp: 0,
  xpToNext: 100,
  energy: 100,
  maxEnergy: 100,
  gold: 50,
  gems: 5,
};

export const plantTypes: Omit<Plant, 'id' | 'stage'>[] = [
  { name: 'Sunflower', emoji: '🌻', growTime: 5000, maxStage: 4, magical: false, color: 'yellow' },
  { name: 'Rose', emoji: '🌹', growTime: 7000, maxStage: 4, magical: false, color: 'red' },
  { name: 'Tulip', emoji: '🌷', growTime: 6000, maxStage: 4, magical: false, color: 'pink' },
  { name: 'Crystal Flower', emoji: '💎', growTime: 10000, maxStage: 5, magical: true, color: 'cyan' },
  { name: 'Moon Rose', emoji: '🌙', growTime: 12000, maxStage: 5, magical: true, color: 'purple' },
  { name: 'Star Bloom', emoji: '⭐', growTime: 15000, maxStage: 6, magical: true, color: 'gold' },
];

export const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Sunflower Seed', emoji: '🌱', type: 'seed', quantity: 5, magical: false },
  { id: '2', name: 'Rose Seed', emoji: '🌱', type: 'seed', quantity: 3, magical: false },
  { id: '3', name: 'Tulip Seed', emoji: '🌱', type: 'seed', quantity: 4, magical: false },
  { id: '4', name: 'Watering Can', emoji: '🚿', type: 'tool', quantity: 1, magical: false },
  { id: '5', name: 'Magic Wand', emoji: '✨', type: 'tool', quantity: 1, magical: true },
  { id: '6', name: 'Growth Potion', emoji: '🧪', type: 'potion', quantity: 2, magical: true },
  { id: '7', name: 'Rain Spell', emoji: '🌧️', type: 'spell', quantity: 1, magical: true },
];

export const createGarden = (): GardenCell[] => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: i,
    plant: null,
    watered: false,
    fertilized: false,
  }));
};

export const createPlant = (plantType: Omit<Plant, 'id' | 'stage'>): Plant => {
  return {
    ...plantType,
    id: Math.random().toString(36).substr(2, 9),
    stage: 1,
  };
};