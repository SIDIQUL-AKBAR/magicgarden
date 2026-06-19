import { useState } from 'react';
import { InventoryItem } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface HotbarProps {
  inventory: InventoryItem[];
  selectedTool: string | null;
  onSelectTool: (id: string | null) => void;
}

export function Hotbar({ inventory, selectedTool, onSelectTool }: HotbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const quickItems = inventory.slice(0, 6);
  const seeds = inventory.filter(item => item.type === 'seed');
  const tools = inventory.filter(item => item.type === 'tool');
  const potions = inventory.filter(item => item.type === 'potion');
  const spells = inventory.filter(item => item.type === 'spell');

  const categories = [
    { name: 'Seeds', items: seeds, icon: '🌱' },
    { name: 'Tools', items: tools, icon: '🔧' },
    { name: 'Potions', items: potions, icon: '🧪' },
    { name: 'Spells', items: spells, icon: '✨' },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-800 bg-opacity-95 rounded-2xl p-4 border-2 border-slate-500 shadow-2xl min-w-96"
          >
            <div className="flex gap-4">
              {categories.map(cat => (
                <div key={cat.name} className="flex flex-col items-center">
                  <span className="text-slate-300 text-xs mb-2 flex items-center gap-1">
                    <span>{cat.icon}</span>
                    {cat.name}
                  </span>
                  <div className="flex flex-col gap-2">
                    {cat.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTool(item.id);
                          setIsExpanded(false);
                        }}
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                          selectedTool === item.id 
                            ? 'bg-emerald-500 border-2 border-emerald-300 scale-110' 
                            : 'bg-slate-700 border-2 border-slate-500 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-xs text-slate-300">{item.quantity}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 bg-slate-800 bg-opacity-90 rounded-2xl p-2 border-2 border-slate-500 shadow-xl">
        {quickItems.map((item, index) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTool(selectedTool === item.id ? null : item.id)}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
              selectedTool === item.id 
                ? 'bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50' 
                : 'bg-slate-700 border-2 border-slate-500 hover:border-slate-400'
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-xs text-slate-300">{item.quantity}</span>
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-xl bg-amber-600 border-2 border-amber-400 flex items-center justify-center hover:bg-amber-500 transition-colors"
        >
          <span className="text-xl">{isExpanded ? '✕' : '⋯'}</span>
        </motion.button>
      </div>
    </div>
  );
}