import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestModal({ isOpen, onClose }: QuestModalProps) {
  if (!isOpen) return null;

  const quests = [
    { id: 1, name: 'Plant 3 Sunflowers', progress: 2, total: 3, reward: '🪙 20', completed: false },
    { id: 2, name: 'Water 5 plants', progress: 5, total: 5, reward: '💎 2', completed: true },
    { id: 3, name: 'Grow a magical plant', progress: 0, total: 1, reward: '🪙 50', completed: false },
    { id: 4, name: 'Harvest 10 plants', progress: 7, total: 10, reward: '⭐ 1', completed: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-slate-800 rounded-3xl p-6 max-w-md w-full border-4 border-slate-600 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2">
            <span>📜</span> Daily Quests
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="space-y-3">
          {quests.map(quest => (
            <div 
              key={quest.id}
              className={`p-3 rounded-xl ${quest.completed ? 'bg-emerald-800 border-2 border-emerald-500' : 'bg-slate-700 border-2 border-slate-600'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${quest.completed ? 'text-emerald-200 line-through' : 'text-slate-200'}`}>
                  {quest.name}
                </span>
                <span className="text-amber-300 text-sm">{quest.reward}</span>
              </div>
              <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${quest.completed ? 'bg-emerald-400' : 'bg-amber-500'}`}
                  style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                {quest.progress}/{quest.total}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}