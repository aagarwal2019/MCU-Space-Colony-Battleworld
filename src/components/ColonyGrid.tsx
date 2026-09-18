import React from 'react';
import { 
  Plus, 
  Radio, 
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
  AlertTriangle,
  Flame,
  Activity,
  Clock,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { ColonyBuilding, GridTile, MCUHero } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';

interface ColonyGridProps {
  tiles: GridTile[];
  buildings: ColonyBuilding[];
  heroes: MCUHero[];
  onSelectTile: (tile: GridTile) => void;
  onSelectBuilding: (building: ColonyBuilding) => void;
}

export const ColonyGrid: React.FC<ColonyGridProps> = ({
  tiles,
  buildings,
  heroes,
  onSelectTile,
  onSelectBuilding,
}) => {
  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'command_center': return <Radio className="w-5 h-5 text-cyan-300" />;
      case 'arc_reactor': return <Zap className="w-5 h-5 text-yellow-300 fill-yellow-400/20" />;
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
      default: return <Activity className="w-5 h-5 text-slate-300" />;
    }
  };

  const getCategoryBorder = (category?: string) => {
    switch (category) {
      case 'energy': return 'border-yellow-500/40 hover:border-yellow-400 shadow-yellow-500/10';
      case 'life_support': return 'border-emerald-500/40 hover:border-emerald-400 shadow-emerald-500/10';
      case 'resources': return 'border-amber-500/40 hover:border-amber-400 shadow-amber-500/10';
      case 'defense': return 'border-rose-500/40 hover:border-rose-400 shadow-rose-500/10';
      case 'special': return 'border-purple-500/40 hover:border-purple-400 shadow-purple-500/10';
      default: return 'border-cyan-500/40 hover:border-cyan-400';
    }
  };

  const getTerrainBg = (terrain: string) => {
    switch (terrain) {
      case 'toxic_fissure': return 'bg-emerald-950/20 border-emerald-900/30';
      case 'geothermal_vent': return 'bg-amber-950/20 border-amber-900/30';
      case 'shipwreck_hulk': return 'bg-blue-950/20 border-blue-900/30';
      case 'ruined_arena': return 'bg-purple-950/20 border-purple-900/30';
      case 'crystal_vein': return 'bg-cyan-950/20 border-cyan-900/30';
      default: return 'bg-slate-900/40 border-slate-800/60';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-sm sm:text-base font-bold text-slate-200 font-display tracking-wider uppercase">
            Sakaar Surface Sector Grid (5x4)
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> ONLINE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> OFFLINE / LOW POWER
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> DAMAGED
          </span>
        </div>
      </div>

      {/* Tactical Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20 shadow-2xl relative scifi-grid">
        {tiles.map((tile) => {
          const building = buildings.find((b) => b.id === tile.buildingId);
          const definition = building ? BUILDING_DEFINITIONS[building.type] : null;
          const assignedHero = building?.assignedHeroId 
            ? heroes.find(h => h.id === building.assignedHeroId)
            : null;

          if (building && definition) {
            const isDamaged = building.health < building.maxHealth;
            const isOffline = !building.isOperating;

            return (
              <div
                key={`${tile.x}-${tile.y}`}
                onClick={() => onSelectBuilding(building)}
                className={`relative group cursor-pointer h-36 rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 bg-slate-900/90 shadow-lg ${getCategoryBorder(definition.category)} ${isDamaged ? 'ring-2 ring-rose-500/60 animate-pulse' : ''}`}
              >
                {/* Top header inside building tile */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-sm">
                      {getBuildingIcon(building.type)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-100 truncate font-display">
                        {definition.name}
                      </h4>
                      <span className="text-[10px] text-cyan-400 font-mono-tech block">
                        MK-{building.level === 1 ? 'I' : building.level === 2 ? 'II' : 'III'}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {isDamaged ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Damaged! Click to repair" />
                  ) : isOffline ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Offline (Insufficient Arc Power)" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" title="Operating at full capacity" />
                  )}
                </div>

                {/* Center: Hero Station Chief / Worker info */}
                <div className="my-1 flex items-center justify-between">
                  {assignedHero ? (
                    <div 
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] max-w-full truncate"
                      title={`Station Chief: ${assignedHero.heroName} (${assignedHero.affinityDescription})`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: assignedHero.accentColor }} 
                      />
                      <span className="text-slate-200 font-medium truncate font-mono-tech">
                        {assignedHero.heroName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic font-mono-tech">
                      No Station Chief
                    </span>
                  )}

                  <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-300 border border-slate-800">
                    {building.assignedWorkers}/{definition.maxWorkers} wrk
                  </span>
                </div>

                {/* Bottom Stats or Health bar */}
                <div>
                  {isDamaged ? (
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-rose-900/50">
                      <div 
                        className="bg-rose-500 h-full rounded-full transition-all" 
                        style={{ width: `${(building.health / building.maxHealth) * 100}%` }} 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                      <span>SEC ({tile.x},{tile.y})</span>
                      {definition.basePowerGen > 0 && (
                        <span className="text-yellow-400 font-bold">+{definition.basePowerGen * building.level} MW</span>
                      )}
                      {definition.baseScrapGen > 0 && (
                        <span className="text-amber-400 font-bold">+{definition.baseScrapGen * building.level}/s</span>
                      )}
                      {definition.baseFoodGen > 0 && (
                        <span className="text-emerald-400 font-bold">+{definition.baseFoodGen * building.level}/s</span>
                      )}
                      {definition.baseOxygenGen > 0 && (
                        <span className="text-cyan-400 font-bold">+{definition.baseOxygenGen * building.level}%</span>
                      )}
                      {definition.baseDefense > 0 && (
                        <span className="text-rose-400 font-bold">+{definition.baseDefense * building.level} def</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Empty Tile
          return (
            <div
              key={`${tile.x}-${tile.y}`}
              onClick={() => onSelectTile(tile)}
              className={`group cursor-pointer h-36 rounded-xl border border-dashed flex flex-col justify-between p-3 transition-all duration-200 hover:border-cyan-400/80 hover:bg-slate-900/70 ${getTerrainBg(tile.terrain)}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                <span>SEC ({tile.x},{tile.y})</span>
                {tile.hazardLevel > 0 && (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Flame className="w-3 h-3" /> HAZARD
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center justify-center my-auto text-center">
                <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/60 transition group-hover:scale-110">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 mt-1 font-display">
                  Build Sector
                </span>
                <span className="text-[10px] text-slate-400 font-mono-tech capitalize">
                  {tile.terrainName}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono-tech flex justify-between">
                <span>{tile.scrapYieldBonus > 0 ? `+${tile.scrapYieldBonus}% Scrap` : ''}</span>
                <span>{tile.powerYieldBonus > 0 ? `+${tile.powerYieldBonus}% Power` : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
