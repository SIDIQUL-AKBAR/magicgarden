import { useState, useEffect, useCallback } from 'react';
import { GardenCell, PlayerState, InventoryItem, Weather } from './types/game';
import { initialPlayer, initialInventory, createGarden, createPlant, plantTypes } from './utils/gameData';
import { HUD } from './components/HUD';
import { Hotbar } from './components/Hotbar';
import { Garden } from './components/Garden';
import { QuestModal } from './components/QuestModal';
import { SettingsModal } from './components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(initialPlayer);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [garden, setGarden] = useState<GardenCell[]>(createGarden());
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather>({ type: 'sunny', duration: 60 });
  const [showQuests, setShowQuests] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Plant growth system
  useEffect(() => {
    const interval = setInterval(() => {
      setGarden(prevGarden => 
        prevGarden.map(cell => {
          if (cell.plant && cell.plant.stage < cell.plant.maxStage) {
            const growthSpeed = cell.watered ? 2 : 1;
            const fertilizedBonus = cell.fertilized ? 1 : 0;
            
            if (Math.random() < 0.1 * growthSpeed) {
              return {
                ...cell,
                plant: {
                  ...cell.plant,
                  stage: Math.min(cell.plant.stage + 1 + fertilizedBonus, cell.plant.maxStage),
                },
                watered: false,
                fertilized: false,
              };
            }
          }
          return cell;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      const weathers: Weather['type'][] = ['sunny', 'rainy', 'magical', 'starry'];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather({ type: randomWeather, duration: 60 });
      
      if (randomWeather === 'rainy') {
        showNotification('🌧️ Rain is watering all plants!');
        setGarden(prev => prev.map(cell => ({ ...cell, watered: true })));
      } else if (randomWeather === 'magical') {
        showNotification('✨ Magical weather speeds up growth!');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        energy: Math.min(prev.energy + 1, prev.maxEnergy),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCellClick = useCallback((cellId: number) => {
    const selectedItem = inventory.find(item => item.id === selectedTool);
    if (!selectedItem) return;

    setGarden(prevGarden => {
      const cell = prevGarden[cellId];
      if (!cell) return prevGarden;

      const newGarden = [...prevGarden];

      // Planting seeds
      if (selectedItem.type === 'seed' && !cell.plant) {
        if (player.energy < 5) {
          showNotification('❌ Not enough energy!');
          return prevGarden;
        }

        const seedIndex = Math.floor(Math.random() * 3);
        const plantType = plantTypes[seedIndex];
        const newPlant = createPlant(plantType);

        newGarden[cellId] = {
          ...cell,
          plant: newPlant,
        };

        setPlayer(prev => ({
          ...prev,
          energy: prev.energy - 5,
          xp: prev.xp + 10,
        }));

        setInventory(prev => 
          prev.map(item => 
            item.id === selectedTool 
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          ).filter(item => item.quantity > 0)
        );

        showNotification(`🌱 Planted ${plantType.name}!`);
        setSelectedTool(null);
      }
      // Watering
      else if (selectedItem.type === 'tool' && selectedItem.name === 'Watering Can' && cell.plant) {
        if (player.energy < 2) {
          showNotification('❌ Not enough energy!');
          return prevGarden;
        }

        newGarden[cellId] = {
          ...cell,
          watered: true,
        };

        setPlayer(prev => ({
          ...prev,
          energy: prev.energy - 2,
          xp: prev.xp + 5,
        }));

        showNotification('💧 Watered the plant!');
      }
      // Magic wand
      else if (selectedItem.type === 'tool' && selectedItem.name === 'Magic Wand' && cell.plant) {
        if (player.energy < 10) {
          showNotification('❌ Not enough energy!');
          return prevGarden;
        }

        newGarden[cellId] = {
          ...cell,
          plant: {
            ...cell.plant,
            magical: true,
          },
          fertilized: true,
        };

        setPlayer(prev => ({
          ...prev,
          energy: prev.energy - 10,
          xp: prev.xp + 15,
        }));

        showNotification('✨ Applied magic to the plant!');
      }
      // Growth potion
      else if (selectedItem.type === 'potion' && cell.plant) {
        newGarden[cellId] = {
          ...cell,
          plant: {
            ...cell.plant,
            stage: cell.plant.maxStage,
          },
        };

        setInventory(prev => 
          prev.map(item => 
            item.id === selectedTool 
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          ).filter(item => item.quantity > 0)
        );

        showNotification('🧪 Plant instantly grown!');
        setSelectedTool(null);
      }
      // Harvesting mature plants
      else if (cell.plant && cell.plant.stage >= cell.plant.maxStage) {
        const reward = cell.plant.magical ? { gold: 30, gems: 1 } : { gold: 10, gems: 0 };
        
        newGarden[cellId] = {
          ...cell,
          plant: null,
          watered: false,
          fertilized: false,
        };

        setPlayer(prev => ({
          ...prev,
          gold: prev.gold + reward.gold,
          gems: prev.gems + reward.gems,
          xp: prev.xp + (cell.plant?.magical ? 50 : 20),
        }));

        showNotification(`🎉 Harvested! +${reward.gold} gold${reward.gems ? ` +${reward.gems} gems` : ''}`);
      }

      return newGarden;
    });
  }, [inventory, selectedTool, player.energy, showNotification]);

  // Level up check
  useEffect(() => {
    if (player.xp >= player.xpToNext) {
      setPlayer(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - prev.xpToNext,
        xpToNext: Math.floor(prev.xpToNext * 1.5),
        maxEnergy: prev.maxEnergy + 10,
        energy: prev.maxEnergy + 10,
      }));
      showNotification(`🎉 Level Up! Now level ${player.level + 1}!`);
    }
  }, [player.xp, player.xpToNext, player.level, showNotification]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        weather.type === 'sunny' ? 'bg-sky-400' :
        weather.type === 'rainy' ? 'bg-slate-600' :
        weather.type === 'magical' ? 'bg-purple-500' :
        'bg-indigo-900'
      }`}>
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 text-6xl opacity-80">
          {weather.type === 'sunny' && '☀️'}
          {weather.type === 'rainy' && '🌧️'}
          {weather.type === 'magical' && '✨'}
          {weather.type === 'starry' && '🌙'}
        </div>
        
        {/* Clouds */}
        <div className="absolute top-20 left-10 text-4xl opacity-60 animate-pulse">☁️</div>
        <div className="absolute top-32 left-1/4 text-3xl opacity-50">☁️</div>
        <div className="absolute top-16 right-1/3 text-5xl opacity-40">☁️</div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <HUD 
          player={player} 
          weather={weather}
          onOpenSettings={() => setShowSettings(true)}
          onOpenQuests={() => setShowQuests(true)}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-8"
        >
          <Garden 
            garden={garden}
            selectedTool={selectedTool}
            inventory={inventory}
            onCellClick={handleCellClick}
          />
        </motion.div>

        <Hotbar 
          inventory={inventory}
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
        />
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-slate-800 bg-opacity-95 px-6 py-3 rounded-2xl border-2 border-amber-400 shadow-xl z-50"
          >
            <span className="text-amber-200 font-bold text-lg">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <QuestModal isOpen={showQuests} onClose={() => setShowQuests(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-20"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
          <span className="text-4xl">🌸</span>
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Magic Garden
          </span>
          <span className="text-4xl">🌸</span>
        </h1>
      </motion.div>
    </div>
  );
}