import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Swords, Zap, Building2, CheckCircle2, AlertCircle, ArrowUpRight, BarChart3, Radio } from 'lucide-react';
import { MCUHero, ColonyBuilding } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';

interface HeroAffinityChartProps {
  hero: MCUHero;
  buildings: ColonyBuilding[];
  onAssignHero?: (buildingId: string, heroId: string | null) => void;
}

export const HeroAffinityChart: React.FC<HeroAffinityChartProps> = ({
  hero,
  buildings,
  onAssignHero,
}) => {
  const [chartMode, setChartMode] = useState<'radar' | 'stations'>('radar');

  // 1. Calculate Combat Proficiency
  const baseCombat = hero.stats?.combat || 60;
  const combatBoost = hero.tier === 2 ? 25 : 0;
  const combatProficiency = Math.min(100, Math.round(baseCombat + combatBoost));

  // 2. Calculate Resource Output Bonus %
  const parsePercent = (desc: string): number => {
    const match = desc.match(/\+(\d+)%/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 50;
  };

  const rawBonus = parsePercent(hero.affinityDescription || '');
  const tierBonus = hero.tier === 2 ? 15 : 0;
  const resourceOutputBonus = Math.min(100, rawBonus + tierBonus);

  // 3. Building Affinity & Colony Station Matching
  const affinityBuildingDef = BUILDING_DEFINITIONS[hero.buildingAffinity as keyof typeof BUILDING_DEFINITIONS];
  const affinityBuildingName = affinityBuildingDef ? affinityBuildingDef.name : hero.buildingAffinity.replace(/_/g, ' ');

  // Look for existing instances of this affinity building in the colony
  const existingAffinityBuildings = buildings.filter(b => b.type === hero.buildingAffinity);
  const isAffinityBuildingBuilt = existingAffinityBuildings.length > 0;
  const vacantAffinityBuilding = existingAffinityBuildings.find(b => !b.assignedHeroId || b.assignedHeroId === hero.id);
  const isCurrentlyAssignedToAffinity = hero.assignedBuildingId 
    ? existingAffinityBuildings.some(b => b.id === hero.assignedBuildingId)
    : false;

  // Building Affinity Score (100% for signature, 80% for related roles)
  const affinityScore = isCurrentlyAssignedToAffinity 
    ? 100 
    : isAffinityBuildingBuilt 
    ? (vacantAffinityBuilding ? 95 : 85)
    : 70;

  // Technical and Leadership metrics
  const technicalMastery = Math.min(100, Math.round(((hero.stats?.engineering || 50) + (hero.stats?.science || 50)) / 2 + (hero.tier === 2 ? 20 : 0)));
  const leadershipSynergy = Math.min(100, Math.round((hero.stats?.leadership || 50) + (hero.tier === 2 ? 20 : 0)));

  // Radar Data for the 5-point assessment
  const radarData = [
    { subject: 'Combat', value: combatProficiency, fullMark: 100 },
    { subject: 'Resource +%', value: resourceOutputBonus, fullMark: 100 },
    { subject: 'Affinity Match', value: affinityScore, fullMark: 100 },
    { subject: 'Tech Mastery', value: technicalMastery, fullMark: 100 },
    { subject: 'Leadership', value: leadershipSynergy, fullMark: 100 },
  ];

  // Station Suitability Comparison Data (Top 5 Station Options)
  const candidateStationTypes: { type: string; label: string; calculateScore: () => number; targetResource: string }[] = [
    {
      type: hero.buildingAffinity,
      label: affinityBuildingDef?.name.split(' ')[0] || 'Signature',
      calculateScore: () => resourceOutputBonus,
      targetResource: 'Affinity Station'
    },
    {
      type: 'defense_turret',
      label: 'Defense Turret',
      calculateScore: () => Math.min(100, Math.round(combatProficiency * 0.95)),
      targetResource: 'Colony Security'
    },
    {
      type: 'stark_lab',
      label: 'Stark Tech Lab',
      calculateScore: () => Math.min(100, Math.round(technicalMastery * 0.9)),
      targetResource: 'Tech Synthesis'
    },
    {
      type: 'command_center',
      label: 'Command Citadel',
      calculateScore: () => Math.min(100, Math.round(leadershipSynergy * 0.9)),
      targetResource: 'Colony Morale'
    },
    {
      type: 'scrap_foundry',
      label: 'Scrap Foundry',
      calculateScore: () => Math.min(100, Math.round((hero.stats?.engineering || 50) * 0.85)),
      targetResource: 'Scrap Recovery'
    }
  ];

  // Remove duplicates if signature is already one of the generic ones
  const uniqueStationScores = candidateStationTypes.filter((v, i, a) => a.findIndex(t => t.type === v.type) === i).map(station => {
    const isSignature = station.type === hero.buildingAffinity;
    const score = station.calculateScore();
    const existing = buildings.some(b => b.type === station.type);
    return {
      station: station.label,
      efficiency: score,
      isSignature,
      isBuilt: existing,
      targetResource: station.targetResource
    };
  });

  // Determine combat proficiency tier label
  const getCombatProficiencyTier = (val: number) => {
    if (val >= 90) return { label: 'Omega Vanguard', color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' };
    if (val >= 78) return { label: 'Elite Combatant', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' };
    if (val >= 65) return { label: 'Field Specialist', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' };
    return { label: 'Support Scout', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const combatTier = getCombatProficiencyTier(combatProficiency);

  return (
    <div className="mt-3 bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 shadow-inner">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono-tech uppercase tracking-wider flex items-center gap-1.5">
              <span>DEPLOYMENT DIAGNOSTIC CHART</span>
              {hero.tier === 2 && (
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/40">
                  +T2 OVERCHARGE
                </span>
              )}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono-tech">
              Visualizing Combat, Station Yield & Installation Synergy
            </p>
          </div>
        </div>

        {/* Chart View Toggle Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setChartMode('radar')}
            className={`px-2 py-1 rounded text-[10px] font-mono-tech font-semibold transition ${
              chartMode === 'radar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Switch to 5-axis Radar Profile"
          >
            RADAR
          </button>
          <button
            type="button"
            onClick={() => setChartMode('stations')}
            className={`px-2 py-1 rounded text-[10px] font-mono-tech font-semibold transition ${
              chartMode === 'stations'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Switch to Station Suitability Comparison"
          >
            STATIONS
          </button>
        </div>
      </div>

      {/* Main Visualizer Area: Chart & Metric Key */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* The Small Recharts Chart Container (5 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-950/70 rounded-lg p-1 border border-slate-800/60 relative overflow-hidden min-h-[165px]">
          {chartMode === 'radar' ? (
            <div className="w-full h-[165px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height={165}>
                <RadarChart data={radarData} margin={{ top: 10, right: 18, bottom: 10, left: 18 }}>
                  <PolarGrid stroke="#334155" strokeDasharray="2 2" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 8 }}
                    axisLine={false}
                  />
                  <Radar
                    name={hero.heroName}
                    dataKey="value"
                    stroke={hero.accentColor || '#06b6d4'}
                    fill={hero.accentColor || '#06b6d4'}
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-[11px] font-mono-tech shadow-xl text-slate-200">
                            <span className="font-bold text-cyan-400">{data.subject}:</span> {data.value}%
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full h-[165px] flex items-center justify-center p-1">
              <ResponsiveContainer width="100%" height={155}>
                <BarChart
                  data={uniqueStationScores}
                  layout="vertical"
                  margin={{ top: 5, right: 25, bottom: 5, left: 2 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    dataKey="station"
                    type="category"
                    width={85}
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-[11px] font-mono-tech shadow-xl text-slate-200">
                            <p className="font-bold text-amber-400">{item.station}</p>
                            <p className="text-slate-300">Efficiency: {item.efficiency}%</p>
                            <p className="text-[10px] text-slate-400">Role: {item.targetResource}</p>
                            <p className={`text-[10px] ${item.isBuilt ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {item.isBuilt ? '✓ Colony Station Built' : '✗ Not Built Yet'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                    {uniqueStationScores.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isSignature ? (hero.accentColor || '#38bdf8') : entry.isBuilt ? '#0ea5e9' : '#475569'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Watermark label */}
          <div className="absolute bottom-1 right-2 text-[9px] font-mono-tech text-slate-600 pointer-events-none">
            {chartMode === 'radar' ? '5-AXIS SAKAAR EVALUATION' : 'COLONY SYNERGY INDEX'}
          </div>
        </div>

        {/* The 3 Core Visual Metrics Details (6 cols) */}
        <div className="md:col-span-6 space-y-2 text-xs font-mono-tech">
          {/* 1. Combat Proficiency Metric */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Swords className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-300 font-bold">COMBAT PROFICIENCY</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${combatTier.color}`}>
                    {combatTier.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Raider defense & Quinjet combat survival
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-rose-300">
                {combatProficiency}
              </span>
              <span className="text-[10px] text-slate-500">/100</span>
            </div>
          </div>

          {/* 2. Resource Output Bonus Metric */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-300 font-bold">RESOURCE OUTPUT BONUS</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30 font-semibold">
                    +{resourceOutputBonus}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {hero.affinityDescription || 'Station-specific yield multiplier'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Building Affinity & Station Status Metric */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-semibold block">PRIMARY STATION AFFINITY</span>
                  <span className="text-xs font-bold text-slate-200 block">
                    {affinityBuildingName}
                  </span>
                </div>
              </div>

              {/* Status indicator badge */}
              <div>
                {isCurrentlyAssignedToAffinity ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE CHIEF
                  </span>
                ) : isAffinityBuildingBuilt ? (
                  vacantAffinityBuilding ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-400" /> VACANT STATION
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400" /> STATION BUSY
                    </span>
                  )
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                    NOT BUILT YET
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Assignment Action Helper: "so users can better decide where to assign them" */}
      {onAssignHero && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono-tech">
            <span className="text-slate-500 font-bold">RECOMMENDED POST:</span>
            <span className="text-cyan-300 font-semibold">{affinityBuildingName}</span>
            <span className="text-amber-300">({`+${resourceOutputBonus}% Bonus`})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* If vacant affinity building exists, provide a 1-click Quick Assign */}
            {vacantAffinityBuilding && !isCurrentlyAssignedToAffinity && (
              <button
                type="button"
                id={`quick-assign-affinity-${hero.id}`}
                onClick={() => onAssignHero(vacantAffinityBuilding.id, hero.id)}
                className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-1 shadow transition"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>ASSIGN TO {affinityBuildingDef?.name.split(' ')[0] || 'STATION'}</span>
              </button>
            )}

            {/* Quick Station Assignment Selector across all built colony stations */}
            <div className="relative">
              <select
                id={`assign-station-select-${hero.id}`}
                value={hero.assignedBuildingId || ''}
                onChange={(e) => {
                  const targetBuildingId = e.target.value;
                  onAssignHero(targetBuildingId || '', targetBuildingId ? hero.id : null);
                }}
                className="bg-slate-950 border border-slate-700 hover:border-cyan-500/60 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-mono-tech focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="">-- Deploy to Station --</option>
                {buildings.map((b) => {
                  const bDef = BUILDING_DEFINITIONS[b.type];
                  const isAffinity = b.type === hero.buildingAffinity;
                  const isCurrent = b.id === hero.assignedBuildingId;
                  const occupied = b.assignedHeroId && b.assignedHeroId !== hero.id;

                  return (
                    <option key={b.id} value={b.id}>
                      {isCurrent ? '✓ [Current] ' : isAffinity ? '★ [Affinity] ' : ''}
                      {bDef ? bDef.name : b.type}
                      {occupied ? ' (Swap Chief)' : ' (Vacant)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
