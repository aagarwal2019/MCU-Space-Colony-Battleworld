import React, { useState } from 'react';
import { 
  Compass, 
  PlaneTakeoff, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Gift, 
  Coins, 
  Wrench, 
  Users, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { MCUHero, PlanetaryExpedition } from '../types';

interface ExpeditionsViewProps {
  expeditions: PlanetaryExpedition[];
  heroes: MCUHero[];
  currentTime: number;
  onLaunchExpedition: (expeditionId: string, heroIds: string[]) => void;
  onClaimExpedition: (expeditionId: string) => void;
}

export const ExpeditionsView: React.FC<ExpeditionsViewProps> = ({
  expeditions,
  heroes,
  currentTime,
  onLaunchExpedition,
  onClaimExpedition,
}) => {
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>(expeditions[0]?.id || '');
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>([]);

  const selectedExpedition = expeditions.find(e => e.id === selectedExpeditionId) || expeditions[0];

  const toggleHeroSelection = (heroId: string) => {
    if (selectedHeroIds.includes(heroId)) {
      setSelectedHeroIds(selectedHeroIds.filter(id => id !== heroId));
    } else {
      if (selectedHeroIds.length < 3) {
        setSelectedHeroIds([...selectedHeroIds, heroId]);
      }
    }
  };

  const getHazardBadge = (rating: string) => {
    switch (rating) {
      case 'Low':
        return <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-tech">LOW HAZARD</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[10px] font-mono-tech">MEDIUM HAZARD</span>;
      case 'Extreme':
        return <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-mono-tech flex items-center gap-1"><Flame className="w-3 h-3" /> EXTREME HAZARD</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wider text-slate-100 font-display">
              QUINJET PLANETARY EXPEDITIONS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Dispatch Marvel hero away-teams into the Sakaaran wilderness to salvage rare technologies, vibranium, and rescue refugees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expedition List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-tech">
            Discovered Wasteland Sectors
          </h3>
          {expeditions.map((exp) => {
            const isSelected = exp.id === selectedExpedition?.id;
            const inProgress = exp.status === 'in_progress';
            const isCompleted = exp.status === 'completed';

            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpeditionId(exp.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10' 
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100 font-display truncate">
                    {exp.name}
                  </h4>
                  {getHazardBadge(exp.hazardRating)}
                </div>
                <p className="text-xs text-slate-400 font-mono-tech mt-1 truncate">
                  {exp.location}
                </p>

                {/* Progress status */}
                <div className="mt-3 flex items-center justify-between text-xs font-mono-tech">
                  {inProgress && exp.endTime ? (
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Returning in {Math.max(0, Math.ceil((exp.endTime - currentTime) / 1000))}s</span>
                    </div>
                  ) : isCompleted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> MISSION COMPLETE
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Duration: {exp.durationSec}s
                    </span>
                  )}

                  <span className="text-amber-400">
                    ~{exp.potentialLoot.maxScrap} Scrap
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Expedition Details & Team Selector */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {selectedExpedition && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-display">
                    {selectedExpedition.name}
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono-tech">
                    {selectedExpedition.location}
                  </span>
                </div>
                {getHazardBadge(selectedExpedition.hazardRating)}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedExpedition.description}
              </p>

              {/* Potential Loot Box */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono-tech">
                <div>
                  <span className="text-slate-400 block text-[10px]">POTENTIAL SCRAP</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {selectedExpedition.potentialLoot.minScrap} - {selectedExpedition.potentialLoot.maxScrap}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VIBRANIUM UNITS</span>
                  <span className="text-purple-400 font-bold text-sm">
                    {selectedExpedition.potentialLoot.minVibranium} - {selectedExpedition.potentialLoot.maxVibranium}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RARE ARTIFACT CHANCE</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {Math.round(selectedExpedition.potentialLoot.rareArtifactChance * 100)}%
                  </span>
                </div>
              </div>

              {/* Mission State & Action */}
              {selectedExpedition.status === 'in_progress' ? (
                <div className="p-5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-cyan-300 font-display font-bold text-base">
                    <PlaneTakeoff className="w-5 h-5 animate-pulse" />
                    AWAY-TEAM EN ROUTE IN QUINJET
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    {selectedExpedition.startTime && selectedExpedition.endTime && (
                      <div 
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((currentTime - selectedExpedition.startTime) / (selectedExpedition.endTime - selectedExpedition.startTime)) * 100)}%`
                        }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono-tech">
                    Heroes deployed: {selectedExpedition.assignedHeroIds.map(id => heroes.find(h => h.id === id)?.heroName).join(', ')}
                  </p>
                </div>
              ) : selectedExpedition.status === 'completed' ? (
                <div className="p-5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-300 font-display font-bold text-base">
                    <Gift className="w-5 h-5 text-emerald-400" />
                    EXPEDITION SAFELY RETURNED!
                  </div>
                  <p className="text-xs text-slate-300">
                    The team recovered scrap caches and cosmic relics from the hazard zone.
                  </p>
                  <button
                    onClick={() => onClaimExpedition(selectedExpedition.id)}
                    className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-tech text-sm shadow-lg shadow-emerald-500/20 transition"
                  >
                    CLAIM EXPEDITION SPOILS
                  </button>
                </div>
              ) : (
                /* Select Away-Team (1 to 3 heroes) */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono-tech uppercase">
                      Select Away-Team (Choose up to 3 Marvel Heroes)
                    </span>
                    <span className="text-xs font-mono-tech text-cyan-400">
                      Selected: {selectedHeroIds.length} / 3
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {heroes.map((hero) => {
                      const isSelected = selectedHeroIds.includes(hero.id);
                      const isBusy = hero.status === 'on_expedition';

                      return (
                        <button
                          key={hero.id}
                          disabled={isBusy}
                          onClick={() => toggleHeroSelection(hero.id)}
                          className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2.5 ${
                            isSelected 
                              ? 'bg-cyan-950/60 border-cyan-400 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-400' 
                              : isBusy 
                                ? 'bg-slate-950/40 border-slate-800 opacity-40 cursor-not-allowed' 
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div 
                            className={`w-7 h-7 rounded-md bg-gradient-to-br ${hero.avatarColor} flex items-center justify-center text-white text-[10px] font-bold font-display shrink-0`}
                          >
                            {hero.heroName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-200 truncate font-display">
                              {hero.heroName}
                            </h4>
                            <span className="text-[10px] text-slate-400 uppercase font-mono-tech block">
                              {hero.role}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={selectedHeroIds.length === 0}
                    onClick={() => {
                      onLaunchExpedition(selectedExpedition.id, selectedHeroIds);
                      setSelectedHeroIds([]);
                    }}
                    className={`w-full py-3 rounded-xl font-bold font-mono-tech text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                      selectedHeroIds.length > 0
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <PlaneTakeoff className="w-4 h-4" />
                    LAUNCH AWAY-TEAM ({selectedExpedition.durationSec}s MISSION)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
