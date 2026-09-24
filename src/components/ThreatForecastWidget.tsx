import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  ShieldAlert,
  Zap,
  Sparkles,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { ColonyResources, ResourceRates, ColonyBuilding, MCUHero } from '../types';
import { soundFx } from '../utils/audio';

export interface ThreatForecastWidgetProps {
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  rates?: ResourceRates;
  buildings?: ColonyBuilding[];
  heroes?: MCUHero[];
  cycle?: number;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  onRewindClock?: (seconds: number) => void;
}

export interface CycleForecastPoint {
  cycleIndex: number;
  cycleNumber: number;
  label: string;
  baselineThreat: number;
  stabilizedThreat: number;
  baselineLevel: string;
  stabilizedLevel: string;
  threatDelta: number;
  powerDamping: number;
  scrapDamping: number;
  defenseDamping: number;
  netDrift: number;
  recommendedPower: number;
  recommendedScrap: number;
  recommendedCores: number;
  actionSummary: string;
  isBreach: boolean;
}

export const ThreatForecastWidget: React.FC<ThreatForecastWidgetProps> = ({
  resources,
  setResources,
  rates,
  buildings,
  heroes,
  cycle = 1,
  addLog,
  onRewindClock,
}) => {
  // Interactive Simulation Controls
  const [showBreakdownTable, setShowBreakdownTable] = useState<boolean>(false);
  const [simulationPlan, setSimulationPlan] = useState<{
    powerSurplusChannelPct: number; // 0% to 100% of net power channeled to anchors
    planChronoCore: boolean; // Plan 1 Chrono-Core insertion
    chronoCoreCycle: number; // Target cycle for core deployment (e.g. cycle 3)
    planScrapDeflection: boolean; // Plan scrap barrier overcharge
    planStrikeForce: boolean; // Plan Avengers strike team
  }>({
    powerSurplusChannelPct: 60,
    planChronoCore: resources.chronoCores > 0,
    chronoCoreCycle: 3,
    planScrapDeflection: resources.scrap >= 100,
    planStrikeForce: resources.power >= 80,
  });

  // Effective current rates (derived from props or estimated from resources)
  const powerNet = rates ? rates.powerNet : (resources.power > 50 ? 12 : -5);
  const scrapNet = rates ? rates.scrapNet : 18;
  const defenseRating = resources.defenseRating || 30;
  const currentThreat = Math.max(0, Math.min(100, Math.round(resources.incursionThreat)));

  // Calculate 10-cycle forecast projection based on current colony production
  const forecastData: CycleForecastPoint[] = useMemo(() => {
    const points: CycleForecastPoint[] = [];

    // Current point at Cycle 0 (NOW)
    points.push({
      cycleIndex: 0,
      cycleNumber: cycle,
      label: 'NOW',
      baselineThreat: currentThreat,
      stabilizedThreat: currentThreat,
      baselineLevel: currentThreat >= 70 ? 'CRITICAL' : currentThreat >= 45 ? 'HIGH' : currentThreat >= 25 ? 'ELEVATED' : 'STABLE',
      stabilizedLevel: currentThreat >= 70 ? 'CRITICAL' : currentThreat >= 45 ? 'HIGH' : currentThreat >= 25 ? 'ELEVATED' : 'STABLE',
      threatDelta: 0,
      powerDamping: 0,
      scrapDamping: 0,
      defenseDamping: 0,
      netDrift: 0,
      recommendedPower: 0,
      recommendedScrap: 0,
      recommendedCores: 0,
      actionSummary: 'Current colony coordinates',
      isBreach: currentThreat >= 85,
    });

    let runningBaselineThreat = currentThreat;
    let runningStabilizedThreat = currentThreat;

    // Doctor Doom Multiversal Incursion constant pull: +4.2% per Sol cycle
    const naturalIncursionPull = 4.2;

    // Colony production mitigation factors:
    // 1. Power surplus: dampens dimensional rifts via energy shields (-0.08% per powerNet unit)
    const powerDampingRate = powerNet > 0 
      ? Math.min(3.8, powerNet * 0.08) 
      : -Math.min(4.5, Math.abs(powerNet) * 0.12);

    // 2. Scrap surplus: enables continuous physical reinforcement of quantum emitters (-0.04% per scrapNet unit)
    const scrapDampingRate = Math.min(2.2, Math.max(0, scrapNet * 0.04));

    // 3. Defense rating: kinetic & energy shields absorb multiversal friction (-0.02% per defense point)
    const defenseDampingRate = Math.min(2.6, defenseRating * 0.02);

    // 4. Environmental stress: low oxygen or low morale causes secondary spatial tears
    const envDistress = (resources.oxygen < 40 || resources.morale < 35) ? 1.4 : (resources.oxygen >= 80 && resources.morale >= 70) ? -0.8 : 0;

    // Net baseline change per cycle
    const baselineCycleDrift = naturalIncursionPull - powerDampingRate - scrapDampingRate - defenseDampingRate + envDistress;

    for (let i = 1; i <= 10; i++) {
      const cycleNum = cycle + i;

      // Calculate baseline threat (without extra manual stabilization actions)
      runningBaselineThreat = Math.max(5, Math.min(100, runningBaselineThreat + baselineCycleDrift));

      // Calculate stabilized threat using player's planned stabilization resource usage:
      // A. Extra power channel: user allocates a portion of power surplus (or stores) to anchors
      const extraPowerDamping = powerNet > 0 
        ? (powerNet * (simulationPlan.powerSurplusChannelPct / 100)) * 0.07 
        : 0;
      
      // B. Planned Chrono-Core Anchor at designated cycle: -24% instant drop
      const chronoDrop = (simulationPlan.planChronoCore && i === simulationPlan.chronoCoreCycle) ? 24 : 0;

      // C. Planned Vibranium/Scrap deflection at cycle 2: -12% instant drop
      const scrapDeflectionDrop = (simulationPlan.planScrapDeflection && i === 2) ? 12 : 0;

      // D. Planned Avengers strike force at cycle 5: -16% drop
      const strikeDrop = (simulationPlan.planStrikeForce && i === 5) ? 16 : 0;

      const plannedMitigation = baselineCycleDrift - extraPowerDamping - chronoDrop - scrapDeflectionDrop - strikeDrop;
      runningStabilizedThreat = Math.max(3, Math.min(100, runningStabilizedThreat + plannedMitigation));

      const bThreatRounded = Math.round(runningBaselineThreat);
      const sThreatRounded = Math.round(runningStabilizedThreat);

      const bLevel = bThreatRounded >= 70 ? 'CRITICAL' : bThreatRounded >= 45 ? 'HIGH' : bThreatRounded >= 25 ? 'ELEVATED' : 'STABLE';
      const sLevel = sThreatRounded >= 70 ? 'CRITICAL' : sThreatRounded >= 45 ? 'HIGH' : sThreatRounded >= 25 ? 'ELEVATED' : 'STABLE';

      // Recommendations based on threat level
      let actionSummary = 'Colony production maintains timeline equilibrium.';
      let recPower = 0;
      let recScrap = 0;
      let recCores = 0;

      if (bThreatRounded >= 70) {
        actionSummary = 'CRITICAL: Apocalyptic breach imminent! Deploy Chrono-Core anchor immediately!';
        recPower = 60;
        recScrap = 40;
        recCores = 1;
      } else if (bThreatRounded >= 45) {
        actionSummary = 'HIGH STRAIN: Overcharge Arc Power barriers & reinforce dimensional seals.';
        recPower = 40;
        recScrap = 25;
        recCores = 0;
      } else if (bThreatRounded >= 25) {
        actionSummary = 'ELEVATED: Divert 25% surplus power to anchor emitters.';
        recPower = 20;
        recScrap = 10;
        recCores = 0;
      }

      points.push({
        cycleIndex: i,
        cycleNumber: cycleNum,
        label: `+${i}C (C${cycleNum})`,
        baselineThreat: bThreatRounded,
        stabilizedThreat: sThreatRounded,
        baselineLevel: bLevel,
        stabilizedLevel: sLevel,
        threatDelta: bThreatRounded - currentThreat,
        powerDamping: Math.round(powerDampingRate * 10) / 10,
        scrapDamping: Math.round(scrapDampingRate * 10) / 10,
        defenseDamping: Math.round(defenseDampingRate * 10) / 10,
        netDrift: Math.round(baselineCycleDrift * 10) / 10,
        recommendedPower: recPower,
        recommendedScrap: recScrap,
        recommendedCores: recCores,
        actionSummary,
        isBreach: bThreatRounded >= 85,
      });
    }

    return points;
  }, [cycle, currentThreat, powerNet, scrapNet, defenseRating, resources.oxygen, resources.morale, simulationPlan]);

  // Forecast Metrics
  const forecastMetrics = useMemo(() => {
    const lastPoint = forecastData[forecastData.length - 1];
    const peakBaseline = Math.max(...forecastData.map(p => p.baselineThreat));
    const peakStabilized = Math.max(...forecastData.map(p => p.stabilizedThreat));
    const firstBreachPoint = forecastData.find(p => p.baselineThreat >= 70);
    const cyclesToCritical = firstBreachPoint ? firstBreachPoint.cycleIndex : null;

    // Total recommended stabilization resources over next 10 cycles
    const totalPowerNeeded = forecastData.reduce((acc, p) => acc + p.recommendedPower, 0);
    const totalScrapNeeded = forecastData.reduce((acc, p) => acc + p.recommendedScrap, 0);
    const totalCoresNeeded = forecastData.reduce((acc, p) => acc + p.recommendedCores, 0);

    const hasPowerDeficit = resources.power < totalPowerNeeded * 0.4;
    const hasScrapDeficit = resources.scrap < totalScrapNeeded * 0.4;
    const hasCoresDeficit = resources.chronoCores < totalCoresNeeded;

    return {
      peakBaseline,
      peakStabilized,
      cyclesToCritical,
      driftTrend: lastPoint.baselineThreat > currentThreat ? 'RISING' : 'STABILIZING',
      netDrift10Cycles: lastPoint.baselineThreat - currentThreat,
      totalPowerNeeded,
      totalScrapNeeded,
      totalCoresNeeded,
      hasPowerDeficit,
      hasScrapDeficit,
      hasCoresDeficit,
    };
  }, [forecastData, currentThreat, resources.power, resources.scrap, resources.chronoCores]);

  // One-Click Direct Stabilization Actions
  const handleQuickAnchorSurge = () => {
    const cost = { power: 50, scrap: 20 };
    if (resources.power < cost.power || resources.scrap < cost.scrap) {
      soundFx.playAlarm();
      addLog('INSUFFICIENT RESOURCES: Need 50 Arc Power and 20 Scrap for Dimensional Anchor Surge.', 'danger');
      return;
    }
    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      power: prev.power - cost.power,
      scrap: prev.scrap - cost.scrap,
      incursionThreat: Math.max(0, prev.incursionThreat - 14),
      multiverseInfluence: prev.multiverseInfluence + 35,
    }));
    if (onRewindClock) onRewindClock(30);
    addLog('THREAT FORECAST PROTOCOL: Dimensional Anchor Surge executed! Arc Power dampened incursion by -14% and rewound clock +30s.', 'success');
  };

  const handleQuickChronoLock = () => {
    if (resources.chronoCores < 1) {
      soundFx.playAlarm();
      addLog('INSUFFICIENT CHRONO-CORES: Harvest Chrono-Cores from the Multiverse Nexus or expeditions.', 'danger');
      return;
    }
    soundFx.playBuild();
    setResources(prev => ({
      ...prev,
      chronoCores: prev.chronoCores - 1,
      incursionThreat: Math.max(0, prev.incursionThreat - 26),
      multiverseInfluence: prev.multiverseInfluence + 50,
    }));
    if (onRewindClock) onRewindClock(45);
    addLog('THREAT FORECAST PROTOCOL: Chrono-Core Lockout initiated! Quantum fracture stabilized by -26% and rewound clock +45s.', 'success');
  };

  const handleQuickVibraniumShroud = () => {
    const cost = { scrap: 100, vibraniumCredits: 25 };
    if (resources.scrap < cost.scrap || resources.vibraniumCredits < cost.vibraniumCredits) {
      soundFx.playAlarm();
      addLog('INSUFFICIENT RESOURCES: Need 100 Scrap & 25 Vibranium Credits for Kinetic Shroud.', 'danger');
      return;
    }
    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - cost.scrap,
      vibraniumCredits: prev.vibraniumCredits - cost.vibraniumCredits,
      defenseRating: prev.defenseRating + 30,
      incursionThreat: Math.max(0, prev.incursionThreat - 15),
    }));
    if (onRewindClock) onRewindClock(25);
    addLog('THREAT FORECAST PROTOCOL: Vibranium Kinetic Shroud overcharged! Defense +30, Incursion Threat -15%, clock +25s.', 'success');
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl p-5 border-2 border-emerald-500/40 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center text-slate-950 font-bold">
            <TrendingUp className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black font-mono-tech uppercase tracking-wider text-slate-100 flex items-center gap-2">
                <span>INCURSION THREAT FORECAST</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                10-CYCLE PROJECTION
              </span>
              {forecastMetrics.cyclesToCritical !== null ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>ZERO HOUR IN {forecastMetrics.cyclesToCritical} CYCLES</span>
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>CONTAINMENT SECURE</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantum trajectory projection based on net Arc Power, scrap synthesis, kinetic shielding, and atmospheric stability.
            </p>
          </div>
        </div>

        {/* Current Threat Snapshot & Telemetry Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-right font-mono-tech">
            <span className="text-[9px] text-slate-400 block uppercase">CURRENT THREAT</span>
            <span className={`text-base font-black ${
              currentThreat >= 70 ? 'text-rose-400' : currentThreat >= 45 ? 'text-orange-400' : currentThreat >= 25 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentThreat}%
            </span>
          </div>
          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-right font-mono-tech">
            <span className="text-[9px] text-slate-400 block uppercase">PROJECTED 10C PEAK</span>
            <span className={`text-base font-black ${
              forecastMetrics.peakBaseline >= 70 ? 'text-rose-400' : forecastMetrics.peakBaseline >= 45 ? 'text-orange-400' : 'text-emerald-400'
            }`}>
              {forecastMetrics.peakBaseline}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Line Chart (Left 8 Cols) + Colony Production & Mitigation Telemetry (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* The Recharts Line Chart Container */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 text-xs font-mono-tech">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" />
                <span>UNMITIGATED TRAJECTORY (CURRENT PRODUCTION)</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block" />
                <span>STABILIZED TRAJECTORY (WITH PLANNED PROTOCOLS)</span>
              </span>
            </div>

            <div className="text-[10px] font-mono-tech text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Damping: {powerNet > 0 ? `+${(powerNet * 0.08).toFixed(1)}% power suppression` : 'brownout penalty'}</span>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  stroke="#334155" 
                />
                <YAxis 
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 70, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  stroke="#334155" 
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CycleForecastPoint;
                      return (
                        <div className="bg-slate-950 border-2 border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs font-mono-tech max-w-xs space-y-1.5 z-50">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                            <span className="font-bold text-emerald-400">SOL CYCLE {data.cycleNumber} ({data.label})</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              data.baselineThreat >= 70 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                              data.baselineThreat >= 45 ? 'bg-orange-950 text-orange-300 border border-orange-500/40' :
                              'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              {data.baselineLevel}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center justify-between text-rose-400">
                              <span>Unmitigated Threat:</span>
                              <span className="font-bold">{data.baselineThreat}% ({data.threatDelta >= 0 ? `+${data.threatDelta}%` : `${data.threatDelta}%`})</span>
                            </div>
                            <div className="flex items-center justify-between text-cyan-400">
                              <span>Stabilized Threat:</span>
                              <span className="font-bold">{data.stabilizedThreat}%</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                              <span>Power Damping:</span>
                              <span className="text-emerald-400">-{data.powerDamping}%/cyc</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[10px]">
                              <span>Kinetic Defense Damping:</span>
                              <span className="text-amber-400">-{data.defenseDamping}%/cyc</span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-300 italic">
                            {data.actionSummary}
                          </div>

                          {(data.recommendedPower > 0 || data.recommendedCores > 0) && (
                            <div className="pt-1 text-[10px] font-bold text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/30 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Plan: {data.recommendedPower} Power, {data.recommendedScrap} Scrap{data.recommendedCores > 0 ? `, ${data.recommendedCores} Core` : ''}</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Critical Reference Line (70%) */}
                <ReferenceLine 
                  y={70} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ value: 'CRITICAL (DEFCON 1/2: 70%)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} 
                />

                {/* Elevated Reference Line (45%) */}
                <ReferenceLine 
                  y={45} 
                  stroke="#f59e0b" 
                  strokeDasharray="3 3" 
                  label={{ value: 'ELEVATED (45%)', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }} 
                />

                {/* Stable Target Line (25%) */}
                <ReferenceLine 
                  y={25} 
                  stroke="#10b981" 
                  strokeDasharray="2 2" 
                  label={{ value: 'SAFE THRESHOLD (25%)', fill: '#10b981', fontSize: 9, position: 'insideTopRight' }} 
                />

                {/* Unmitigated Baseline Line */}
                <Line 
                  type="monotone" 
                  dataKey="baselineThreat" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#f43f5e', stroke: '#881337', strokeWidth: 1.5 }} 
                  activeDot={{ r: 6, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
                  name="Unmitigated Threat"
                />

                {/* Stabilized / Planned Countermeasure Line */}
                <Line 
                  type="monotone" 
                  dataKey="stabilizedThreat" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: '#06b6d4', stroke: '#083344', strokeWidth: 1.5 }} 
                  activeDot={{ r: 6, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
                  name="Stabilized Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] font-mono-tech text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Base Drift: +4.2%/cyc</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Shield Damping: -{(powerNet > 0 ? powerNet * 0.08 : 0).toFixed(1)}%/cyc</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Scrap Repair: -{(scrapNet * 0.04).toFixed(1)}%/cyc</span>
              </span>
            </div>

            <button
              onClick={() => setShowBreakdownTable(!showBreakdownTable)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
            >
              <span>{showBreakdownTable ? 'HIDE 10-CYCLE MATRIX' : 'VIEW 10-CYCLE MATRIX'}</span>
              {showBreakdownTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Colony Production Telemetry & Stabilization Strategy Simulator (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Production Telemetry Card */}
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 font-mono-tech uppercase">
                  COLONY DAMPING OUTPUT
                </span>
              </div>
              <span className="text-[10px] font-mono-tech text-cyan-400">ACTIVE TELEMETRY</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block">NET ARC POWER</span>
                <span className={`text-sm font-bold ${powerNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {powerNet >= 0 ? `+${powerNet.toFixed(1)}` : powerNet.toFixed(1)}/s
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {powerNet > 0 ? `Suppresses ~${(powerNet * 0.08).toFixed(1)}%/cyc` : 'Brownout adds threat!'}
                </span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block">NET SCRAP SYNTHESIS</span>
                <span className="text-sm font-bold text-amber-400">
                  +{scrapNet.toFixed(1)}/s
                </span>
                <span className="text-[9px] text-slate-500 block">
                  Reinforces ~{(scrapNet * 0.04).toFixed(1)}%/cyc
                </span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block">KINETIC DEFENSE</span>
                <span className="text-sm font-bold text-cyan-300">
                  {defenseRating} PTS
                </span>
                <span className="text-[9px] text-slate-500 block">
                  Absorbs ~{(defenseRating * 0.02).toFixed(1)}%/cyc
                </span>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block">CHRONO-CORES</span>
                <span className="text-sm font-bold text-purple-300">
                  {resources.chronoCores} CORES
                </span>
                <span className="text-[9px] text-slate-500 block">
                  Quantum anchor catalyst
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Protocol Simulator Settings */}
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 font-mono-tech uppercase">
                  SIMULATE STABILIZATION PLAN
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono-tech">PREVIEW CURVE</span>
            </div>

            {/* Power Channeling Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-slate-400">Divert Surplus Power:</span>
                <span className="text-cyan-400 font-bold">{simulationPlan.powerSurplusChannelPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={simulationPlan.powerSurplusChannelPct}
                onChange={(e) => setSimulationPlan(prev => ({ ...prev, powerSurplusChannelPct: Number(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[9px] text-slate-500 block font-mono-tech">
                Channels active generator wattage directly into sub-space deflection fields.
              </span>
            </div>

            {/* Checkbox Simulation Toggles */}
            <div className="space-y-2 pt-1 font-mono-tech text-xs">
              <label className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={simulationPlan.planChronoCore}
                    onChange={(e) => setSimulationPlan(prev => ({ ...prev, planChronoCore: e.target.checked }))}
                    className="rounded accent-purple-500"
                  />
                  <span className="text-slate-300">Plan 1 Chrono-Core Anchor</span>
                </div>
                <span className="text-[10px] text-purple-400 font-bold">-24% Threat</span>
              </label>

              <label className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={simulationPlan.planScrapDeflection}
                    onChange={(e) => setSimulationPlan(prev => ({ ...prev, planScrapDeflection: e.target.checked }))}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-slate-300">Plan Scrap Hull Plating</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">-12% Threat</span>
              </label>

              <label className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={simulationPlan.planStrikeForce}
                    onChange={(e) => setSimulationPlan(prev => ({ ...prev, planStrikeForce: e.target.checked }))}
                    className="rounded accent-emerald-500"
                  />
                  <span className="text-slate-300">Plan Avengers Strike Ambush</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">-16% Threat</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Stabilization Budget & One-Click Protocol Execution Panel */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono-tech uppercase tracking-wider">
              TACTICAL STABILIZATION RESOURCE BUDGET & QUICK ACTIONS
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech">
            <span className="text-slate-400">10-CYCLE BUDGET NEEDED:</span>
            <span className="text-amber-300 font-bold">~{forecastMetrics.totalPowerNeeded} POWER</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-bold">~{forecastMetrics.totalScrapNeeded} SCRAP</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-300 font-bold">~{forecastMetrics.totalCoresNeeded} CORES</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech">
          {/* Quick Action 1: Dimensional Anchor Surge */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300">ANCHOR SURGE</span>
                <span className="text-[10px] text-slate-400">50 PWR / 20 SCRAP</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Instantly channels Arc Power through dimensional anchor coils to suppress rifts.
              </p>
              <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-14% Incursion Threat & +30s Clock</span>
              </div>
            </div>

            <button
              onClick={handleQuickAnchorSurge}
              disabled={resources.power < 50 || resources.scrap < 20}
              className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-[11px] rounded transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>DEPLOY ANCHOR SURGE</span>
            </button>
          </div>

          {/* Quick Action 2: Chrono-Core Lockout */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300">CHRONO-CORE LOCK</span>
                <span className="text-[10px] text-slate-400">COST: 1 CORE</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Locks quantum timeline coordinates into an inviolable localized stasis manifold.
              </p>
              <div className="mt-2 text-[10px] font-bold text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-26% Incursion Threat & +45s Clock</span>
              </div>
            </div>

            <button
              onClick={handleQuickChronoLock}
              disabled={resources.chronoCores < 1}
              className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold text-[11px] rounded transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ACTIVATE CHRONO LOCK</span>
            </button>
          </div>

          {/* Quick Action 3: Vibranium Kinetic Shroud */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">KINETIC SHROUD</span>
                <span className="text-[10px] text-slate-400">100 SCRAP / 25 CR</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Overcharges perimeter vibranium mesh to deflect incoming cosmic shockwaves.
              </p>
              <div className="mt-2 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-15% Threat, +30 Defense & +25s Clock</span>
              </div>
            </div>

            <button
              onClick={handleQuickVibraniumShroud}
              disabled={resources.scrap < 100 || resources.vibraniumCredits < 25}
              className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-[11px] rounded transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>BOLSTER DEFENSES</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable 10-Cycle Forecast Matrix Table */}
      {showBreakdownTable && (
        <div className="bg-slate-950/95 rounded-xl border border-slate-800 p-4 space-y-3 font-mono-tech animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase">
                10-SOL-CYCLE INCURSION PLANNING MATRIX
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">
              Computed via Heimdall Sub-Space Observational Telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-2">Cycle</th>
                  <th className="py-2 px-2">Baseline Threat</th>
                  <th className="py-2 px-2">Stabilized Threat</th>
                  <th className="py-2 px-2">Defense Damping</th>
                  <th className="py-2 px-2">Resource Needs</th>
                  <th className="py-2 px-2">Tactical Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {forecastData.map((row) => (
                  <tr key={row.cycleIndex} className={`hover:bg-slate-900/60 transition ${
                    row.cycleIndex === 0 ? 'bg-slate-900/80 font-bold' : ''
                  }`}>
                    <td className="py-2 px-2 font-bold text-slate-200">
                      {row.label}
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        row.baselineThreat >= 70 ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
                        row.baselineThreat >= 45 ? 'bg-orange-950 text-orange-300 border border-orange-500/40' :
                        row.baselineThreat >= 25 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {row.baselineThreat}% ({row.baselineLevel})
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        row.stabilizedThreat >= 70 ? 'bg-rose-950/80 text-rose-300' :
                        row.stabilizedThreat >= 45 ? 'bg-orange-950/80 text-orange-300' :
                        'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {row.stabilizedThreat}%
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-400">
                      -{row.defenseDamping}% / cyc
                    </td>
                    <td className="py-2 px-2 text-amber-300">
                      {row.recommendedPower > 0 ? (
                        <span>{row.recommendedPower} Power / {row.recommendedScrap} Scrap{row.recommendedCores > 0 ? ' / 1 Core' : ''}</span>
                      ) : (
                        <span className="text-slate-500">Nominal</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-slate-300 max-w-xs truncate text-[10px]">
                      {row.actionSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
