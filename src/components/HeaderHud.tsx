import React from 'react';
import { 
  Zap, 
  Wrench, 
  Sprout, 
  Wind, 
  Coins, 
  Users, 
  Smile, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  BookOpen,
  ScrollText,
  AlertTriangle,
  Clock,
  Globe,
  Film
} from 'lucide-react';
import { ColonyResources, ResourceRates } from '../types';

interface HeaderHudProps {
  resources: ColonyResources;
  rates: ResourceRates;
  cycle: number;
  gameSpeed: number;
  isMuted: boolean;
  activeCrisis: boolean;
  onSetSpeed: (speed: number) => void;
  onToggleMute: () => void;
  onOpenLog: () => void;
  onOpenGuide: () => void;
  onResetColony: () => void;
  onOpenMultiverseConvergence?: () => void;
  onOpenEndgameEncore?: () => void;
}

export const HeaderHud: React.FC<HeaderHudProps> = ({
  resources,
  rates,
  cycle,
  gameSpeed,
  isMuted,
  activeCrisis,
  onSetSpeed,
  onToggleMute,
  onOpenLog,
  onOpenGuide,
  onResetColony,
  onOpenMultiverseConvergence,
  onOpenEndgameEncore,
}) => {
  const getMoraleColor = (val: number) => {
    if (val >= 75) return 'text-emerald-400';
    if (val >= 45) return 'text-amber-400';
    return 'text-rose-500 font-bold animate-pulse';
  };

  const getMoraleStatus = (val: number) => {
    if (val >= 80) return 'Thriving';
    if (val >= 50) return 'Stable';
    if (val >= 30) return 'Unrest';
    return 'Rebellion';
  };

  const getOxygenColor = (val: number) => {
    if (val >= 60) return 'text-cyan-400';
    if (val >= 30) return 'text-amber-400';
    return 'text-rose-500 font-bold animate-pulse';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-md px-3 sm:px-6 py-2 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title, Cycle & Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-wider text-slate-100 font-display uppercase">
                  Sakaar Outpost
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-mono-tech">
                  SECTOR 4
                </span>
                {onOpenMultiverseConvergence && (
                  <button
                    onClick={onOpenMultiverseConvergence}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded bg-gradient-to-r from-red-950 to-emerald-950 text-red-300 border border-red-500/60 font-mono-tech animate-pulse hover:border-red-400 hover:text-white transition cursor-pointer shadow-sm shadow-red-950"
                    title="Multiverse is Collapsing! Click to open Battleworld War Room"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="font-bold tracking-wider">MULTIVERSE COLLAPSING</span>
                  </button>
                )}
                {onOpenEndgameEncore && (
                  <button
                    id="endgame-encore-header-btn"
                    onClick={onOpenEndgameEncore}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-900/90 via-purple-900/90 to-indigo-950 text-amber-200 border border-amber-400/80 font-mono-tech hover:border-amber-300 hover:text-white hover:scale-105 transition cursor-pointer shadow-sm shadow-purple-950"
                    title="Avengers: Endgame Encore releases this weekend! Click for Theatrical Celebration Protocols"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="font-bold tracking-wider uppercase">ENDGAME ENCORE THIS WEEKEND</span>
                  </button>
                )}
                {activeCrisis && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/50 animate-pulse font-mono-tech">
                    <AlertTriangle className="w-3 h-3" /> CRISIS ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono-tech flex items-center gap-2">
                <span>SOL CYCLE <strong className="text-cyan-300 font-semibold">{cycle}</strong></span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-300/90">Dystopian Wasteland Protocol</span>
              </p>
            </div>
          </div>

          {/* Speed & Audio controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => onSetSpeed(gameSpeed === 0 ? 1 : 0)}
              className={`p-1.5 rounded transition ${gameSpeed === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              title={gameSpeed === 0 ? 'Resume Game' : 'Pause Game'}
            >
              {gameSpeed === 0 ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSetSpeed(1)}
              className={`px-2 py-1 text-xs font-mono-tech rounded transition ${gameSpeed === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              1x
            </button>
            <button
              onClick={() => onSetSpeed(2)}
              className={`px-2 py-1 text-xs font-mono-tech rounded transition ${gameSpeed === 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              2x
            </button>
            <button
              onClick={() => onSetSpeed(3)}
              className={`px-2 py-1 text-xs font-mono-tech rounded transition ${gameSpeed === 3 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              3x
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition"
              title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenLog}
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition"
              title="Colony Dispatches & Logs"
            >
              <ScrollText className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenGuide}
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition"
              title="Survival Operations Guide"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onResetColony}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
              title="Restart Colony"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resources Metrics Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-xs">
          {/* Arc Power */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Power: ${Math.round(resources.power)} / ${resources.maxPower} MW. Net: ${rates.powerNet >= 0 ? '+' : ''}${Math.round(rates.powerNet)}/s`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Zap className={`w-3.5 h-3.5 ${rates.powerNet < 0 ? 'text-amber-400' : 'text-yellow-400'}`} />
              <span className="font-mono-tech">POWER</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`font-mono-tech font-bold ${resources.power <= 20 ? 'text-rose-400' : 'text-slate-100'}`}>
                {Math.round(resources.power)}
              </span>
              <span className={`text-[10px] font-mono-tech ${rates.powerNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {rates.powerNet >= 0 ? `+${Math.round(rates.powerNet)}` : Math.round(rates.powerNet)}
              </span>
            </div>
          </div>

          {/* Scrap */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Scrap: ${Math.round(resources.scrap)} / ${resources.maxScrap}. Net: +${Math.round(rates.scrapNet)}/s`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono-tech">SCRAP</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono-tech font-bold text-slate-100">
                {Math.round(resources.scrap)}
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400">
                +{Math.round(rates.scrapNet)}
              </span>
            </div>
          </div>

          {/* Hydro-Rations */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Food Rations: ${Math.round(resources.food)} / ${resources.maxFood}. Net: ${rates.foodNet >= 0 ? '+' : ''}${Math.round(rates.foodNet)}/s`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono-tech">RATIONS</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`font-mono-tech font-bold ${resources.food <= 15 ? 'text-rose-400' : 'text-slate-100'}`}>
                {Math.round(resources.food)}
              </span>
              <span className={`text-[10px] font-mono-tech ${rates.foodNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {rates.foodNet >= 0 ? `+${Math.round(rates.foodNet)}` : Math.round(rates.foodNet)}
              </span>
            </div>
          </div>

          {/* Atmospheric O2 */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Atmospheric Clean Oxygen: ${Math.round(resources.oxygen)}%`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono-tech">OXYGEN</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`font-mono-tech font-bold ${getOxygenColor(resources.oxygen)}`}>
                {Math.round(resources.oxygen)}%
              </span>
              <span className={`text-[10px] font-mono-tech ${rates.oxygenChange >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                {rates.oxygenChange >= 0 ? `+${rates.oxygenChange.toFixed(1)}` : rates.oxygenChange.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Vibranium Credits */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Cosmic Vibranium Units: ${Math.round(resources.vibraniumCredits)}`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Coins className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono-tech">UNITS</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono-tech font-bold text-purple-300">
                {Math.round(resources.vibraniumCredits)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono-tech">cr</span>
            </div>
          </div>

          {/* Population */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Population: ${resources.population} / ${resources.maxPopulation} capacity. Free workers: ${resources.population - resources.assignedWorkers}`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono-tech">PEOPLE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono-tech font-bold text-slate-100">
                {resources.population}
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech">
                /{resources.maxPopulation}
              </span>
            </div>
          </div>

          {/* Morale */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Colony Morale: ${Math.round(resources.morale)}% (${getMoraleStatus(resources.morale)})`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Smile className="w-3.5 h-3.5 text-yellow-300" />
              <span className="font-mono-tech">MORALE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`font-mono-tech font-bold ${getMoraleColor(resources.morale)}`}>
                {Math.round(resources.morale)}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech hidden xl:inline">
                {getMoraleStatus(resources.morale)}
              </span>
            </div>
          </div>

          {/* Defense Rating */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Defense Rating: ${resources.defenseRating}. Protects against raiders & storms.`}>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono-tech">DEFENSE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono-tech font-bold text-rose-300">
                {resources.defenseRating}
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech">pts</span>
            </div>
          </div>

          {/* Chrono-Cores */}
          <div className="flex flex-col px-1.5 py-0.5 border-r border-slate-800/60" title={`Chrono-Cores: ${resources.chronoCores}. Premium multiversal energy harvested from alternate realities.`}>
            <div className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono-tech text-slate-400">CORES</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono-tech font-bold text-cyan-300">
                {resources.chronoCores}
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech">tva</span>
            </div>
          </div>

          {/* Multiverse Incursion Threat */}
          <div className="flex flex-col px-1.5 py-0.5" title={`Multiverse Incursion Threat: ${Math.round(resources.incursionThreat)}%. Higher risk triggers multiversal anomalies and dimensional crises.`}>
            <div className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono-tech">INCURSION</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`font-mono-tech font-bold ${
                resources.incursionThreat >= 60 ? 'text-rose-500 animate-pulse' : resources.incursionThreat >= 35 ? 'text-amber-400' : 'text-purple-300'
              }`}>
                {Math.round(resources.incursionThreat)}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech">risk</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
