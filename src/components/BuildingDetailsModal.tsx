import React from 'react';
import { 
  X, 
  ArrowUpCircle, 
  Wrench, 
  Coins, 
  UserCheck, 
  Users, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ColonyBuilding, ColonyResources, MCUHero } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';

interface BuildingDetailsModalProps {
  isOpen: boolean;
  building: ColonyBuilding | null;
  resources: ColonyResources;
  heroes: MCUHero[];
  researchedTechIds?: string[];
  onClose: () => void;
  onUpgrade: (buildingId: string) => void;
  onRepair: (buildingId: string) => void;
  onAssignHero: (buildingId: string, heroId: string | null) => void;
  onChangeWorkers: (buildingId: string, delta: number) => void;
  onDemolish: (buildingId: string) => void;
}

export const BuildingDetailsModal: React.FC<BuildingDetailsModalProps> = ({
  isOpen,
  building,
  resources,
  heroes,
  researchedTechIds = [],
  onClose,
  onUpgrade,
  onRepair,
  onAssignHero,
  onChangeWorkers,
  onDemolish,
}) => {
  if (!isOpen || !building) return null;

  const definition = BUILDING_DEFINITIONS[building.type];
  if (!definition) return null;

  const assignedHero = building.assignedHeroId 
    ? heroes.find(h => h.id === building.assignedHeroId)
    : null;

  // Upgrade costs
  const upgradeScrapCost = Math.round(definition.baseCost.scrap * (building.level + 0.5));
  const upgradeVibraniumCost = Math.round(Math.max(15, definition.baseCost.vibraniumCredits * 1.5 * building.level));
  const canUpgrade = building.level < building.maxLevel && 
                     resources.scrap >= upgradeScrapCost && 
                     resources.vibraniumCredits >= upgradeVibraniumCost;

  const hasDodcDiscount = researchedTechIds.includes('dodc_salvage_protocol');
  const baseRepairCost = Math.round((1 - building.health / building.maxHealth) * definition.baseCost.scrap * 0.75);
  const repairScrapCost = hasDodcDiscount ? Math.round(baseRepairCost * 0.5) : baseRepairCost;
  const isDamaged = building.health < building.maxHealth;
  const canRepair = isDamaged && resources.scrap >= repairScrapCost;

  const freeWorkers = resources.population - resources.assignedWorkers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 font-display">
                {definition.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono-tech">
                MK-{building.level === 1 ? 'I' : building.level === 2 ? 'II' : 'III'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech">
              Sector ({building.gridX}, {building.gridY}) | Status: {building.isOperating ? 'Online' : 'Offline'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Health & Status Warning */}
          {isDamaged && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Structural Damage: {building.health} / {building.maxHealth} HP</span>
              </div>
              <button
                disabled={!canRepair}
                onClick={() => onRepair(building.id)}
                className={`px-3 py-1 rounded-lg font-bold font-mono-tech flex items-center gap-1 text-xs transition ${
                  canRepair
                    ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" /> REPAIR ({repairScrapCost} Scrap)
              </button>
            </div>
          )}

          {/* Description & Current Yield */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <p className="text-slate-300">{definition.description}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono-tech text-xs">
              {definition.basePowerGen > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">POWER GEN</span>
                  <span className="text-yellow-400 font-bold text-sm">
                    +{Math.round(definition.basePowerGen * building.level * (assignedHero?.buildingAffinity === building.type ? 1.65 : 1))} MW
                  </span>
                </div>
              )}
              {definition.basePowerCost > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">POWER DEMAND</span>
                  <span className="text-slate-300 font-bold text-sm">
                    -{definition.basePowerCost} MW
                  </span>
                </div>
              )}
              {definition.baseScrapGen > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SCRAP RECOVERY</span>
                  <span className="text-amber-400 font-bold text-sm">
                    +{Math.round(definition.baseScrapGen * building.level * (1 + building.assignedWorkers * 0.25) * (assignedHero?.buildingAffinity === building.type ? 1.8 : 1))}/s
                  </span>
                </div>
              )}
              {definition.baseFoodGen > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">FOOD RATIONS</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    +{Math.round(definition.baseFoodGen * building.level * (1 + building.assignedWorkers * 0.25) * (assignedHero?.buildingAffinity === building.type ? 1.7 : 1))}/s
                  </span>
                </div>
              )}
              {definition.baseOxygenGen > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">OXYGEN PURITY</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    +{Math.round(definition.baseOxygenGen * building.level * (assignedHero?.buildingAffinity === building.type ? 1.6 : 1))}%
                  </span>
                </div>
              )}
              {definition.baseDefense > 0 && (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DEFENSE POINTS</span>
                  <span className="text-rose-400 font-bold text-sm">
                    +{definition.baseDefense * building.level} pts
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Station Chief (MCU Hero) Assignment */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200 font-display flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                STATION CHIEF (MCU HERO ASSIGNMENT)
              </span>
              {assignedHero && (
                <button
                  onClick={() => onAssignHero(building.id, null)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Clear Chief
                </button>
              )}
            </div>

            {assignedHero ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div 
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${assignedHero.avatarColor} p-0.5 shrink-0 overflow-hidden relative`}
                  >
                    <img
                      src={assignedHero.imageUrl?.includes('unsplash.com') ? `/api/heroes/${assignedHero.id}/photo?format=image` : (assignedHero.imageUrl || `/api/heroes/${assignedHero.id}/photo?format=image`)}
                      alt={assignedHero.heroName}
                      className="w-full h-full object-cover object-top rounded-[6px] bg-slate-900"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 font-display">{assignedHero.heroName}</h4>
                    <span className="text-[11px] text-cyan-400 font-mono-tech">
                      {assignedHero.affinityDescription}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono-tech">
                  ACTIVE
                </span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-2">
                  Assign an MCU hero as Station Chief to grant massive production, power, and efficiency synergies.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {[...heroes].sort((a, b) => {
                    const aAff = a.buildingAffinity === building.type ? 1 : 0;
                    const bAff = b.buildingAffinity === building.type ? 1 : 0;
                    return bAff - aAff;
                  }).map((hero) => {
                    const isAffinity = hero.buildingAffinity === building.type;
                    const isBusy = hero.status === 'on_expedition' || (hero.assignedBuildingId !== null && hero.assignedBuildingId !== building.id);

                    return (
                      <button
                        key={hero.id}
                        disabled={isBusy}
                        onClick={() => onAssignHero(building.id, hero.id)}
                        className={`p-2 rounded-lg border text-left flex flex-col justify-between transition ${
                          isAffinity 
                            ? 'bg-cyan-950/40 border-cyan-500/50 hover:bg-cyan-900/40' 
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        } ${isBusy ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 truncate font-display text-xs">
                            {hero.heroName}
                          </span>
                          {isAffinity && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500 text-slate-950 font-bold">
                              PERFECT FIT
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate mt-1">
                          {isBusy ? (hero.status === 'on_expedition' ? 'On Mission' : 'Assigned Elsewhere') : isAffinity ? '+Boosted' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Workers Allocation */}
          {definition.maxWorkers > 0 && (
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 font-display block">
                  CREW WORKERS ASSIGNED
                </span>
                <span className="text-xs text-slate-400 font-mono-tech">
                  Free colonists available: {freeWorkers}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={building.assignedWorkers <= 0}
                  onClick={() => onChangeWorkers(building.id, -1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 font-bold text-base hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="font-mono-tech font-bold text-slate-100 text-base min-w-[3ch] text-center">
                  {building.assignedWorkers} / {definition.maxWorkers}
                </span>
                <button
                  disabled={building.assignedWorkers >= definition.maxWorkers || freeWorkers <= 0}
                  onClick={() => onChangeWorkers(building.id, 1)}
                  className="w-8 h-8 rounded-lg bg-cyan-600 text-slate-950 font-bold text-base hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Upgrade & Demolish actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {building.level < building.maxLevel && (
              <button
                disabled={!canUpgrade}
                onClick={() => onUpgrade(building.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold font-mono-tech flex items-center justify-center gap-2 text-xs sm:text-sm transition ${
                  canUpgrade
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                UPGRADE TO MK-{building.level + 1 === 2 ? 'II' : 'III'} ({upgradeScrapCost} Scrap, {upgradeVibraniumCost} Cr)
              </button>
            )}

            {building.type !== 'command_center' && (
              <button
                onClick={() => onDemolish(building.id)}
                className="py-2.5 px-4 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-950/40 font-mono-tech text-xs transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Deconstruct (Refund 60%)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
