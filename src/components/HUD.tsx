import { PlayerState, Weather } from '../types/game';
import { Heart, Shield, Star, Settings } from 'lucide-react';

interface HUDProps {
  player: PlayerState;
  weather: Weather;
  onOpenSettings: () => void;
  onOpenQuests: () => void;
}

export function HUD({ player, weather, onOpenSettings, onOpenQuests }: HUDProps) {
  const weatherEmojis = {
    sunny: '☀️',
    rainy: '🌧️',
    magical: '✨',
    starry: '🌟',
  };

  return (
    <>
      {/* Top Left - Player Info */}
      <div className="absolute top-4 left-4 flex items-center gap-3 bg-emerald-800 bg-opacity-90 rounded-2xl p-3 border-2 border-emerald-400 shadow-lg">
        <div className="w-12 h-12 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl">
          🧙
        </div>
        <div className="flex flex-col">
          <span className="text-amber-100 font-bold text-sm">{player.name}</span>
          <div className="flex items-center gap-1">
            <span className="text-emerald-300 text-xs">Lv.{player.level}</span>
            <div className="w-16 h-2 bg-emerald-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300"
                style={{ width: `${(player.xp / player.xpToNext) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 bg-amber-500 bg-opacity-30 rounded-lg px-2 py-1">
          <span className="text-amber-300 text-lg">💎</span>
          <span className="text-amber-100 font-bold text-sm">{player.gems}</span>
        </div>
      </div>

      {/* Top Right - Settings & Quests */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={onOpenQuests}
          className="w-10 h-10 bg-amber-500 bg-opacity-90 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg hover:scale-110 transition-transform"
        >
          <span className="text-xl">📜</span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-10 h-10 bg-slate-600 bg-opacity-90 rounded-xl flex items-center justify-center border-2 border-slate-400 shadow-lg hover:scale-110 transition-transform"
        >
          <Settings className="w-5 h-5 text-slate-200" />
        </button>
      </div>

      {/* Bottom Left - Energy & Weather */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-2">
        <div className="bg-slate-800 bg-opacity-90 rounded-xl p-3 border-2 border-slate-500 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-slate-200 text-xs font-bold">Energy</span>
          </div>
          <div className="w-24 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-300"
              style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
            />
          </div>
          <span className="text-slate-300 text-xs">{player.energy}/{player.maxEnergy}</span>
        </div>
        
        <div className="bg-indigo-800 bg-opacity-90 rounded-xl p-2 border-2 border-indigo-400 shadow-lg flex items-center gap-2">
          <span className="text-2xl">{weatherEmojis[weather.type]}</span>
          <span className="text-indigo-200 text-xs capitalize">{weather.type}</span>
        </div>
      </div>

      {/* Bottom Right - Gold */}
      <div className="absolute bottom-20 right-4 bg-amber-600 bg-opacity-90 rounded-xl px-4 py-2 border-2 border-amber-400 shadow-lg flex items-center gap-2">
        <span className="text-2xl">🪙</span>
        <span className="text-amber-100 font-bold">{player.gold}</span>
      </div>
    </>
  );
}