import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Wrench, 
  Sprout, 
  Wind, 
  ShieldAlert, 
  Home, 
  ArrowLeftRight, 
  Cpu, 
  Compass, 
  GlassWater,
  Coins,
  Lock,
  Check,
  Clock,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { BuildingDefinition, BuildingType, ColonyResources, GridTile } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';

interface BuildingPaletteModalProps {
  isOpen: boolean;
  selectedTile: GridTile | null;
  resources: ColonyResources;
  researchedTechIds: string[];
  onClose: () => void;
  onConstruct: (type: BuildingType) => void;
}

export const BuildingPaletteModal: React.FC<BuildingPaletteModalProps> = ({
  isOpen,
  selectedTile,
  resources,
  researchedTechIds,
  onClose,
  onConstruct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'energy' | 'resources' | 'life_support' | 'defense' | 'special'>('all');

  if (!isOpen || !selectedTile) return null;

  const getBuildingIcon = (type: BuildingType) => {
    switch (type) {
      case 'arc_reactor': return <Zap className="w-5 h-5 text-yellow-300" />;
      case 'scrap_foundry': return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'hydroponic_dome': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'atmospheric_scrubber': return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'defense_turret': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'living_quarters': return <Home className="w-5 h-5 text-blue-400" />;
      case 'trading_depot': return <ArrowLeftRight className="w-5 h-5 text-amber-300" />;
      case 'stark_lab': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'expedition_pad': return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'cantina_lounge': return <GlassWater className="w-5 h-5 text-pink-400" />;
      case 'tva_station': return <Clock className="w-5 h-5 text-amber-300" />;
      case 'oxe_spire': return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'damage_control_depot': return <ShieldCheck className="w-5 h-5 text-yellow-400" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const buildingList = Object.values(BUILDING_DEFINITIONS).filter((b) => {
    if (b.type === 'command_center') return false; // Only one command center exists
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
              <span>CONSTRUCT SECTOR BUILDING</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono-tech">
                Sector ({selectedTile.x}, {selectedTile.y}) - {selectedTile.terrainName}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              Select an engineered structure to establish on this terrain slot.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex gap-2 p-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-xs font-mono-tech">
          {(['all', 'energy', 'resources', 'life_support', 'defense', 'special'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-cyan-500 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Building Cards */}
        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {buildingList.map((def: BuildingDefinition) => {
            const isUnlocked = def.unlockedByDefault || (def.requiredTech && researchedTechIds.includes(def.requiredTech));
            const hasScrap = resources.scrap >= def.baseCost.scrap;
            const hasVibranium = resources.vibraniumCredits >= def.baseCost.vibraniumCredits;
            const canAfford = hasScrap && hasVibranium;
            const canBuild = isUnlocked && canAfford;

            return (
              <div
                key={def.type}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  !isUnlocked 
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-60' 
                    : canAfford 
                      ? 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-lg' 
                      : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0">
                        {getBuildingIcon(def.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 font-display">
                          {def.name}
                        </h4>
                        <span className="text-[10px] uppercase text-cyan-400 font-mono-tech">
                          {def.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 font-mono-tech">
                        <Lock className="w-3 h-3" /> TECH LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {def.description}
                  </p>

                  {/* Base Stats Output */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-mono-tech">
                    {def.basePowerGen > 0 && (
                      <span className="px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-500/30">
                        +{def.basePowerGen} Power
                      </span>
                    )}
                    {def.basePowerCost > 0 && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        -{def.basePowerCost} Power Cost
                      </span>
                    )}
                    {def.baseScrapGen > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                        +{def.baseScrapGen} Scrap/s
                      </span>
                    )}
                    {def.baseFoodGen > 0 && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        +{def.baseFoodGen} Food/s
                      </span>
                    )}
                    {def.baseOxygenGen > 0 && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                        +{def.baseOxygenGen}% Oxygen
                      </span>
                    )}
                    {def.baseDefense > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                        +{def.baseDefense} Defense
                      </span>
                    )}
                    {def.baseHousing > 0 && (
                      <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">
                        +{def.baseHousing} Housing
                      </span>
                    )}
                  </div>
                </div>

                {/* Construction Cost & Action */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono-tech">
                    <span className={`flex items-center gap-1 ${hasScrap ? 'text-slate-200' : 'text-rose-400 font-bold'}`}>
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      {def.baseCost.scrap}
                    </span>
                    {def.baseCost.vibraniumCredits > 0 && (
                      <span className={`flex items-center gap-1 ${hasVibranium ? 'text-purple-300' : 'text-rose-400 font-bold'}`}>
                        <Coins className="w-3.5 h-3.5 text-purple-400" />
                        {def.baseCost.vibraniumCredits}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={!canBuild}
                    onClick={() => onConstruct(def.type)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech flex items-center gap-1.5 transition ${
                      canBuild
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {!isUnlocked ? 'LOCKED' : !canAfford ? 'INSUFFICIENT' : 'CONSTRUCT'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
