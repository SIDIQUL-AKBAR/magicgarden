import { GardenCell, InventoryItem } from '../types/game';
import { motion } from 'framer-motion';

interface GardenProps {
  garden: GardenCell[];
  selectedTool: string | null;
  inventory: InventoryItem[];
  onCellClick: (cellId: number) => void;
}

export function Garden({ garden, selectedTool, inventory, onCellClick }: GardenProps) {
  const getSelectedItem = (): InventoryItem | null => {
    if (!selectedTool) return null;
    return inventory.find(item => item.id === selectedTool) || null;
  };

  const selectedItem = getSelectedItem();

  const getPlantEmoji = (plant: GardenCell['plant']): string => {
    if (!plant) return '';
    
    const stageEmojis: Record<string, string[]> = {
      '🌻': ['🌱', '🌿', '🌾', '🌻'],
      '🌹': ['🌱', '🌿', '🥀', '🌹'],
      '🌷': ['🌱', '🌿', '🌸', '🌷'],
      '💎': ['🌱', '🌿', '💠', '💎', '💎'],
      '🌙': ['🌱', '🌿', '🌑', '🌒', '🌙'],
      '⭐': ['🌱', '🌿', '✨', '💫', '⭐', '🌟'],
    };
    
    const stages = stageEmojis[plant.emoji] || ['🌱', '🌿', '🌸'];
    return stages[Math.min(plant.stage - 1, stages.length - 1)];
  };

  const getCellBackground = (cell: GardenCell): string => {
    if (cell.plant?.magical) return 'bg-purple-900';
    if (cell.watered) return 'bg-emerald-700';
    if (cell.fertilized) return 'bg-amber-800';
    return 'bg-amber-900';
  };

  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-emerald-900 bg-opacity-50 rounded-3xl border-4 border-emerald-700 shadow-2xl">
      {garden.map((cell, index) => (
        <motion.button
          key={cell.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCellClick(cell.id)}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex items-center justify-center relative transition-all ${getCellBackground(cell)} ${
            cell.plant ? 'border-emerald-400' : 'border-amber-700 border-dashed'
          } ${selectedItem ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {cell.plant && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-3xl sm:text-4xl ${cell.plant.magical ? 'animate-pulse' : ''}`}
            >
              {getPlantEmoji(cell.plant)}
            </motion.div>
          )}
          
          {cell.watered && (
            <div className="absolute -top-1 -right-1 text-xs bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
              💧
            </div>
          )}
          
          {cell.fertilized && (
            <div className="absolute -bottom-1 -right-1 text-xs bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center">
              ⚡
            </div>
          )}
          
          {!cell.plant && !selectedItem && (
            <span className="text-amber-600 text-2xl opacity-30">+</span>
          )}
          
          {selectedItem && !cell.plant && selectedItem.type === 'seed' && (
            <span className="text-amber-400 text-2xl opacity-50">🌱</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}