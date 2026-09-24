import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  Radio, 
  Sparkles, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  Compass, 
  Layers, 
  Flame, 
  Skull, 
  BookOpen, 
  ChevronRight, 
  Terminal, 
  HelpCircle,
  FolderOpen,
  Eye,
  Sliders,
  Database,
  Crosshair,
  Timer,
  RefreshCw,
  Send,
  Boxes
} from 'lucide-react';
import { ColonyResources, MCUHero } from '../types';
import { soundFx } from '../utils/audio';
import { HeroAvatar } from './HeroAvatar';

interface TVAOperationsViewProps {
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  heroes: MCUHero[];
  onHeroAbility: (hero: MCUHero) => void;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger' | 'crisis') => void;
  onNavigateToTab: (tab: 'grid' | 'expeditions' | 'tech' | 'trade' | 'multiverse' | 'doomsday' | 'battleworld') => void;
  onOpenSupportHub?: () => void;
}

export const TVAOperationsView: React.FC<TVAOperationsViewProps> = ({
  resources,
  setResources,
  heroes,
  onHeroAbility,
  addLog,
  onNavigateToTab,
  onOpenSupportHub,
}) => {
  // Navigation within TVA Command
  const [tvaSubTab, setTvaSubTab] = useState<'monitor' | 'loom' | 'void' | 'evidence' | 'minutemen'>('monitor');

  // Interactive Miss Minutes state
  const [missMinutesMessageIndex, setMissMinutesMessageIndex] = useState<number>(0);
  const [isMissMinutesSpeaking, setIsMissMinutesSpeaking] = useState<boolean>(true);

  // Timedoor Animation trigger
  const [activeTimedoor, setActiveTimedoor] = useState<{ active: boolean; label: string }>({
    active: false,
    label: '',
  });

  // Loom Upgrades state (Persisted in localStorage)
  const [loomUpgrades, setLoomUpgrades] = useState<{
    throughputMultiplier: number; // 0 to 3
    radiationShielding: boolean;
    livingWeaveHarmonizer: boolean;
    ringCapacityExpanded: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('sakaar_tva_loom_upgrades');
      return saved ? JSON.parse(saved) : {
        throughputMultiplier: 1,
        radiationShielding: false,
        livingWeaveHarmonizer: false,
        ringCapacityExpanded: false,
      };
    } catch {
      return {
        throughputMultiplier: 1,
        radiationShielding: false,
        livingWeaveHarmonizer: false,
        ringCapacityExpanded: false,
      };
    }
  });

  // Action status feedback
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Oscilloscope canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Save loom upgrades
  useEffect(() => {
    try {
      localStorage.setItem('sakaar_tva_loom_upgrades', JSON.stringify(loomUpgrades));
    } catch {
      // Ignore
    }
  }, [loomUpgrades]);

  // Miss Minutes Quips
  const MISS_MINUTES_QUIPS = [
    "Hey y'all! Welcome to the Time Variance Authority! Remember: For All Time. Always!",
    "Careful there, sugar! That timeline branch is dangerously close to the red-line!",
    "He Who Remains might be gone, but the paperwork never stops! File your variance forms!",
    "O.B. says if the Loom keeps rattling, give the Throughput Multiplier a good whack!",
    "If you see a purple cloud named Alioth in the Void, don't try to pet it, hon!",
    "Casey says he found another Infinity Stone in his desk. He's using it as a paperweight for his lunch order.",
    "Doctor Doom thinks he can stitch the multiverse together, but honey, only the TVA holds the Sacred Weave!",
  ];

  const handleNextMissMinutesQuip = () => {
    soundFx.buttonClick();
    setMissMinutesMessageIndex((prev) => (prev + 1) % MISS_MINUTES_QUIPS.length);
  };

  // Oscilloscope Animation (Sacred Timeline wave)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Red Line Upper & Lower Warning Thresholds
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(canvas.width, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      const midY = canvas.height / 2;

      // Base Sacred Timeline (Golden / Emerald Sine Wave)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.02 + phase) * 16;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Branching Variations (Orange & Amber Spikes reflecting Incursion Threat)
      const threatFactor = Math.min(1, resources.incursionThreat / 100);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#f59e0b';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const branchSpike = Math.sin(x * 0.06 - phase * 1.5) * (20 * threatFactor);
        const y = midY + Math.sin(x * 0.02 + phase) * 16 + branchSpike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Dangerous Incursion Spike (Red Line Breach)
      if (resources.incursionThreat > 45) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const incursionSpike = Math.sin(x * 0.1 + phase * 2) * (38 * threatFactor);
          const y = midY + incursionSpike;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      phase += 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [resources.incursionThreat]);

  // Timedoor deployment handler (Reset Charge on Branch)
  const handleDeployTimedoorResetCharge = (branchName: string, threatReduction: number, costPower: number, costScrap: number) => {
    if (resources.power < costPower || resources.scrap < costScrap) {
      soundFx.playAlarm();
      setFeedback({
        text: `Insufficient resources! Requires ${costPower} Arc Power & ${costScrap} Scrap to power the TemPad.`,
        type: 'error',
      });
      return;
    }

    // Trigger visual Timedoor
    setActiveTimedoor({ active: true, label: `TIMEDOOR ACTIVE: Pruning ${branchName}` });
    soundFx.playAbility();

    setResources((prev) => ({
      ...prev,
      power: Math.max(0, prev.power - costPower),
      scrap: Math.max(0, prev.scrap - costScrap),
      incursionThreat: Math.max(0, prev.incursionThreat - threatReduction),
      chronoCores: prev.chronoCores + 1,
      multiverseInfluence: prev.multiverseInfluence + 35,
    }));

    addLog(`TVA RESET CHARGE DEPLOYED: Pruned critical timeline branch [${branchName}]. Incursion Threat dropped by -${threatReduction}% and salvaged +1 Chrono-Core.`, 'success');

    setFeedback({
      text: `Success: Timedoor opened! Reset Charge pruned ${branchName}. Incursion Threat -${threatReduction}%.`,
      type: 'success',
    });

    setTimeout(() => {
      setActiveTimedoor({ active: false, label: '' });
      setFeedback(null);
    }, 3500);
  };

  // Void Scavenge Expedition
  const handleDispatchVoidScavenger = () => {
    if (resources.power < 45 || resources.vibraniumCredits < 15) {
      soundFx.playAlarm();
      setFeedback({
        text: 'Insufficient resources! Requires 45 Arc Power and 15 Credits for Void TemPad coordinates.',
        type: 'error',
      });
      return;
    }

    soundFx.playAbility();
    setActiveTimedoor({ active: true, label: 'TIMEDOOR OPENED TO THE VOID AT THE END OF TIME' });

    // Randomized Void Rewards
    const roll = Math.random();
    let rewardText = '';

    if (roll > 0.65) {
      // Rare Infinity Stone Paperweight
      setResources((prev) => ({
        ...prev,
        power: Math.max(0, prev.power - 45) + 160,
        vibraniumCredits: Math.max(0, prev.vibraniumCredits - 15) + 50,
        chronoCores: prev.chronoCores + 2,
        morale: Math.min(100, prev.morale + 10),
      }));
      rewardText = 'FOUND TVA "PAPERWEIGHT" INFINITY STONE! +160 Power, +2 Chrono-Cores, +50 Credits!';
      addLog(`VOID SALVAGE TRIUMPH: Recovered a confiscated Infinity Stone used as a desk paperweight!`, 'success');
    } else if (roll > 0.3) {
      // Pruned Starship Scrap
      setResources((prev) => ({
        ...prev,
        power: Math.max(0, prev.power - 45),
        vibraniumCredits: Math.max(0, prev.vibraniumCredits - 15),
        scrap: prev.scrap + 220,
        vibraniumCreditsReward: (prev.vibraniumCredits || 0) + 30,
      }));
      rewardText = 'SALVAGED PRUNED CAPITAL STARSHIP WRECKAGE: +220 Scrap & +30 Credits!';
      addLog(`VOID SALVAGE: Minutemen stripped down an alternate reality Quinjet from beneath Alioth's clouds.`, 'info');
    } else {
      // Alioth Cloud Essence
      setResources((prev) => ({
        ...prev,
        power: Math.max(0, prev.power - 45) + 80,
        vibraniumCredits: Math.max(0, prev.vibraniumCredits - 15),
        scrap: prev.scrap + 100,
        chronoCores: prev.chronoCores + 1,
      }));
      rewardText = 'SIPHONED TEMPORAL SMOG ESSENCE: +1 Chrono-Core, +80 Power, +100 Scrap!';
      addLog(`VOID SALVAGE: Evaded Alioth and bottled pure chronal mist. +1 Chrono-Core.`, 'success');
    }

    setFeedback({
      text: rewardText,
      type: 'success',
    });

    setTimeout(() => {
      setActiveTimedoor({ active: false, label: '' });
      setFeedback(null);
    }, 4000);
  };

  // O.B. Loom Upgrades
  const handleUpgradeLoomThroughput = () => {
    const costPower = 80;
    const costScrap = 120;
    const costCores = 1;

    if (resources.power < costPower || resources.scrap < costScrap || resources.chronoCores < costCores) {
      soundFx.playAlarm();
      setFeedback({
        text: `Requires ${costPower} Power, ${costScrap} Scrap, and ${costCores} Chrono-Core to upgrade Throughput Multiplier!`,
        type: 'error',
      });
      return;
    }

    soundFx.playAbility();
    setResources((prev) => ({
      ...prev,
      power: Math.max(0, prev.power - costPower),
      scrap: Math.max(0, prev.scrap - costScrap),
      chronoCores: Math.max(0, prev.chronoCores - costCores),
      incursionThreat: Math.max(0, prev.incursionThreat - 8),
    }));

    setLoomUpgrades((prev) => ({
      ...prev,
      throughputMultiplier: prev.throughputMultiplier + 1,
    }));

    addLog(`O.B. THROUGHPUT MULTIPLIER UPGRADED (Mk ${loomUpgrades.throughputMultiplier + 1}): Temporal Loom intake expanded! Incursion threat reduced by 8%.`, 'success');
    setFeedback({
      text: `Throughput Multiplier Mk ${loomUpgrades.throughputMultiplier + 1} Installed! Loom capacity increased.`,
      type: 'success',
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filter TVA Faction Heroes
  const tvaHeroes = heroes.filter(
    (h) =>
      h.id === 'mobius' ||
      h.id === 'hunter_b15' ||
      h.id === 'ouroboros_ob' ||
      h.id === 'casey_tva' ||
      h.id === 'loki'
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Visual Timedoor Overlay when an active Timedoor is open */}
      {activeTimedoor.active && (
        <div 
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-500 animate-fadeIn pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Glowing Orange TVA Timedoor Portal */}
            <div className="w-48 sm:w-64 h-72 sm:h-96 rounded-2xl bg-amber-500/20 border-4 border-amber-400 shadow-[0_0_80px_20px_rgba(245,158,11,0.6)] flex items-center justify-center relative overflow-hidden animate-pulse">
              <div className="absolute inset-2 border-2 border-amber-300/60 rounded-xl bg-gradient-to-b from-amber-500/30 via-orange-600/40 to-amber-900/60 flex items-center justify-center">
                <Clock className="w-20 h-20 text-amber-200 animate-spin-slow opacity-80" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.8)_0%,transparent_70%)]" />
            </div>

            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/95 border border-amber-400 text-amber-300 font-mono font-bold text-xs sm:text-sm tracking-wider shadow-xl flex items-center gap-2 uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>{activeTimedoor.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* TVA Command Top Retro Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/90 via-stone-900/95 to-amber-950/90 border-2 border-amber-500/50 p-4 sm:p-6 shadow-2xl shadow-amber-950/60">
        
        {/* Mid-century geometric TVA background accents */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" 
        />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left: TVA Brass Insignia & Title */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-900 border-2 border-amber-400 flex items-center justify-center shadow-xl shadow-amber-600/30 shrink-0">
              <Clock className="w-8 h-8 text-amber-100 animate-spin-slow" />
              <span 
                aria-hidden="true" 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" 
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-950 border border-amber-400/80 font-mono font-bold text-amber-300 uppercase tracking-widest">
                  TIME VARIANCE AUTHORITY
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-900 border border-amber-500/40 font-mono text-amber-200">
                  SECTOR: SAKAAR NULL-TIME JUNCTION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-wider text-amber-100 uppercase mt-0.5">
                TVA CHRONO-COMMAND &amp; TEMPORAL LOOM
              </h2>
              <p className="text-xs text-amber-200/80 font-mono italic">
                &ldquo;FOR ALL TIME. ALWAYS.&rdquo; &bull; Monitored by Agent Mobius, Hunter B-15, O.B. &amp; Miss Minutes
              </p>
            </div>
          </div>

          {/* Right: Interactive Miss Minutes Mascot Box */}
          <div className="flex items-center gap-3 bg-stone-950/80 border border-amber-500/50 p-2.5 sm:p-3 rounded-2xl shadow-lg shrink-0 max-w-sm">
            {/* Miss Minutes Clock Face Avatar */}
            <div 
              onClick={handleNextMissMinutesQuip}
              className="relative w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-2 border-yellow-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition shadow-md shadow-orange-500/40 shrink-0"
              title="Click Miss Minutes for another TVA tip!"
            >
              {/* Miss Minutes Face Details */}
              <div className="w-7 h-7 rounded-full bg-amber-100 flex flex-col items-center justify-center relative">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>
                <div className="w-3 h-1 rounded-full bg-orange-600 mt-0.5" />
                <div className="absolute top-0.5 left-3 w-1 h-2 bg-yellow-400 rounded-full" />
              </div>
              <span className="absolute -top-1 -right-1 text-[9px] bg-amber-400 text-stone-950 font-bold px-1 rounded-full">
                AI
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  MISS MINUTES // AI LIAISON
                </span>
                <button 
                  onClick={handleNextMissMinutesQuip}
                  className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer"
                >
                  Next Tip
                </button>
              </div>
              <p className="text-xs text-amber-100 font-sans line-clamp-2 leading-tight mt-0.5">
                &ldquo;{MISS_MINUTES_QUIPS[missMinutesMessageIndex]}&rdquo;
              </p>
            </div>
          </div>

        </div>

        {/* Global Action Feedback Alert */}
        {feedback && (
          <div 
            className={`mt-3 p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

      </div>

      {/* TVA Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-950/70 p-2 rounded-2xl border border-amber-500/30">
        
        <button
          onClick={() => {
            soundFx.buttonClick();
            setTvaSubTab('monitor');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            tvaSubTab === 'monitor'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-amber-300/70 hover:text-amber-200 hover:bg-stone-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>SACRED TIMELINE &amp; BRANCH MONITOR</span>
        </button>

        <button
          onClick={() => {
            soundFx.buttonClick();
            setTvaSubTab('loom');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            tvaSubTab === 'loom'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-amber-300/70 hover:text-amber-200 hover:bg-stone-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>O.B.&apos;S TEMPORAL LOOM</span>
        </button>

        <button
          onClick={() => {
            soundFx.buttonClick();
            setTvaSubTab('void');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            tvaSubTab === 'void'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-amber-300/70 hover:text-amber-200 hover:bg-stone-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>THE VOID &amp; ALIOTH SALVAGE</span>
        </button>

        <button
          onClick={() => {
            soundFx.buttonClick();
            setTvaSubTab('evidence');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            tvaSubTab === 'evidence'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-amber-300/70 hover:text-amber-200 hover:bg-stone-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>CASEY&apos;S EVIDENCE LOCKER</span>
        </button>

        <button
          onClick={() => {
            soundFx.buttonClick();
            setTvaSubTab('minutemen');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            tvaSubTab === 'minutemen'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-amber-300/70 hover:text-amber-200 hover:bg-stone-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>TVA AGENTS &amp; MINUTEMEN ({tvaHeroes.length})</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: SACRED TIMELINE & BRANCH MONITOR (Oscilloscope & Reset Charges) */}
      {/* ========================================================================= */}
      {tvaSubTab === 'monitor' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Oscilloscope Terminal Screen */}
          <div className="bg-stone-950 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-base font-bold font-mono text-amber-200 uppercase tracking-wider">
                    CHRONOMETRIC VARIANCE OSCILLOSCOPE // MODEL T-840
                  </h3>
                </div>
                <p className="text-xs text-amber-400/80 font-mono mt-0.5">
                  Green Line: Sacred Timeline baseline &bull; Orange/Red Waves: Active Incursion Variance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-stone-400 uppercase">Current Variance</div>
                  <div className={`text-sm font-bold ${resources.incursionThreat > 50 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                    {resources.incursionThreat.toFixed(1)}% {resources.incursionThreat > 75 ? 'RED-LINE IMMINENT' : 'STABILIZED'}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-stone-400 uppercase">Chrono-Cores</div>
                  <div className="text-sm font-bold text-purple-300">
                    {resources.chronoCores} CORES
                  </div>
                </div>
              </div>
            </div>

            {/* CRT Waveform Canvas */}
            <div className="relative my-3 rounded-xl overflow-hidden border border-amber-500/40 bg-stone-900/90 shadow-inner">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={160} 
                className="w-full h-36 sm:h-44 object-cover block" 
              />
              
              {/* Scanline CRT overlay */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" 
              />

              <div className="absolute top-2 right-3 flex items-center gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 font-mono text-red-300 uppercase">
                  RED LINE THRESHOLD: 80%
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 font-mono text-emerald-300 uppercase">
                  SACRED WEAVE: SYNCHRONIZED
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-amber-200/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Minutemen Protocol: Deploy TemPad Reset Charges to prune redlining branches before Incursion collapse.</span>
              </div>
              <span className="text-amber-400 font-bold">STATUS: OPERATIONAL</span>
            </div>

          </div>

          {/* Active Branch Incursions & Timedoor Pruning Action Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-300 font-bold uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                DETECTED BRANCH TIMELINE SPIKES (TARGETS FOR PRUNING):
              </span>
              <span className="text-stone-400">Deploy Reset Charges to reduce Incursion Threat</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Branch 1: Earth-616 Variant Bleed */}
              <div className="bg-stone-900/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-400 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-300">
                      BRANCH 616-ALPHA
                    </span>
                    <span className="text-[10px] font-mono text-red-400 font-bold">
                      VARIANCE: +18%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                    Avengers Tower Singularity
                  </h4>
                  <p className="text-xs text-stone-300 font-sans mt-1 leading-relaxed">
                    A rogue variant of Tony Stark constructed an unauthorized chronal particle accelerator that threatens to rip a portal into Sakaar.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="text-[11px] font-mono text-amber-300 flex justify-between">
                    <span>Cost: 50 Power &bull; 40 Scrap</span>
                    <span className="text-emerald-400 font-bold">Threat -12%</span>
                  </div>
                  <button
                    onClick={() => handleDeployTimedoorResetCharge('Avengers Tower Singularity', 12, 50, 40)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>DEPLOY RESET CHARGE</span>
                  </button>
                </div>
              </div>

              {/* Branch 2: Sakaar Trash Spire Temporal Rift */}
              <div className="bg-stone-900/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-400 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300">
                      SAKAAR VORTEX
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      VARIANCE: +24%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                    Anarchy Wormhole Overflow
                  </h4>
                  <p className="text-xs text-stone-300 font-sans mt-1 leading-relaxed">
                    The Grandmaster&apos;s discarded garbage wormholes are discharging temporal radiation from dozens of pruned realities simultaneously.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="text-[11px] font-mono text-amber-300 flex justify-between">
                    <span>Cost: 70 Power &bull; 60 Scrap</span>
                    <span className="text-emerald-400 font-bold">Threat -16%</span>
                  </div>
                  <button
                    onClick={() => handleDeployTimedoorResetCharge('Anarchy Wormhole Overflow', 16, 70, 60)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>PRUNE WORMHOLE RIFT</span>
                  </button>
                </div>
              </div>

              {/* Branch 3: Doctor Doom Tachyon Siphon */}
              <div className="bg-stone-900/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-400 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-400 text-red-300">
                      BATTLEWORLD ANCHOR
                    </span>
                    <span className="text-[10px] font-mono text-red-400 font-bold">
                      CRITICAL: +35%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                    Doomstadt Graviton Net
                  </h4>
                  <p className="text-xs text-stone-300 font-sans mt-1 leading-relaxed">
                    Doctor Doom is actively siphoning timeline branches to fuel his Battleworld forge. Neutralizing this link dampens his omnipotence.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="text-[11px] font-mono text-amber-300 flex justify-between">
                    <span>Cost: 90 Power &bull; 80 Scrap</span>
                    <span className="text-emerald-400 font-bold">Threat -20%</span>
                  </div>
                  <button
                    onClick={() => handleDeployTimedoorResetCharge('Doomstadt Graviton Net', 20, 90, 80)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>NEUTRALIZE DOOM SIPHON</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: O.B.'S TEMPORAL LOOM ENGINEERING BAY */}
      {/* ========================================================================= */}
      {tvaSubTab === 'loom' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="bg-stone-950 border border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-600/30 border border-amber-400 text-amber-300">
                    <Cpu className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wider">
                      THE TEMPORAL LOOM // REPAIRS &amp; ADVANCEMENT
                    </h3>
                    <p className="text-xs text-amber-300/80 font-mono">
                      Chief Engineer: Ouroboros (O.B.) &bull; &ldquo;The Loom refines raw time into physical timeline threads!&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-xl bg-amber-950 border border-amber-500 font-mono text-amber-200">
                  Throughput Multiplier: Mk {loomUpgrades.throughputMultiplier}
                </span>
              </div>
            </div>

            {/* Loom Status Visualization Diagram */}
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Loom Ring Capacity</span>
                <div className="text-lg font-mono font-bold text-amber-300">
                  {75 + loomUpgrades.throughputMultiplier * 15}% STABLE
                </div>
                <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, 75 + loomUpgrades.throughputMultiplier * 15)}%` }} 
                  />
                </div>
                <span className="text-[11px] text-stone-400">Can absorb branching timeline spikes without catastrophic temporal meltdown.</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Passive Chronal Energy Gen</span>
                <div className="text-lg font-mono font-bold text-cyan-300">
                  +{30 + loomUpgrades.throughputMultiplier * 20} MW / cycle
                </div>
                <p className="text-[11px] text-stone-400">
                  Channeled directly from the Loom&apos;s weaving core into Sakaar Outpost&apos;s power grid.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Temporal Radiation Factor</span>
                <div className="text-lg font-mono font-bold text-emerald-300">
                  {loomUpgrades.radiationShielding ? '0.00 RADS (SHIELDED)' : 'MODERATE EMISSION'}
                </div>
                <p className="text-[11px] text-stone-400">
                  {loomUpgrades.radiationShielding ? 'TVA blast suits equipped.' : 'Unshielded engineers risk spaghettification during meltdowns.'}
                </p>
              </div>

            </div>

            {/* Upgrade Modules by O.B. */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                TVA HANDBOOK RETROFIT UPGRADES (AUTHORED BY O.B.):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Upgrade 1: Throughput Multiplier Expansion */}
                <div className="bg-stone-900/80 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">
                        Throughput Multiplier Expansion (Mk {loomUpgrades.throughputMultiplier + 1})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                        O.B.&apos;s Masterpiece
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans mt-1">
                      Widens the Loom&apos;s intake ring to allow infinite timeline branches to coalesce without triggering an explosion. Drops Incursion Threat by -8%.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                    <span className="text-xs font-mono text-stone-400">
                      Cost: 80 Power &bull; 120 Scrap &bull; 1 Core
                    </span>
                    <button
                      onClick={handleUpgradeLoomThroughput}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs cursor-pointer transition shadow"
                    >
                      INSTALL UPGRADE
                    </button>
                  </div>
                </div>

                {/* Upgrade 2: Temporal Radiation Suit Emplacement */}
                <div className="bg-stone-900/80 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">
                        TVA Space-Walk Radiation Shielding
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                        {loomUpgrades.radiationShielding ? 'INSTALLED' : 'RESEARCH AVAILABLE'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans mt-1">
                      Equips all colony engineers and Minutemen with heavy retro brass atmospheric suits, making the colony immune to temporal radiation storms.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                    <span className="text-xs font-mono text-stone-400">
                      {loomUpgrades.radiationShielding ? 'Active Passive Perk' : 'Cost: 100 Power • 150 Scrap'}
                    </span>
                    {!loomUpgrades.radiationShielding ? (
                      <button
                        onClick={() => {
                          if (resources.power < 100 || resources.scrap < 150) {
                            soundFx.playAlarm();
                            setFeedback({ text: 'Insufficient resources for Radiation Shielding!', type: 'error' });
                            return;
                          }
                          setResources((prev) => ({
                            ...prev,
                            power: Math.max(0, prev.power - 100),
                            scrap: Math.max(0, prev.scrap - 150),
                            morale: Math.min(100, prev.morale + 15),
                          }));
                          setLoomUpgrades((prev) => ({ ...prev, radiationShielding: true }));
                          soundFx.playSuccess();
                          addLog('TVA RADIATION SHIELDING INSTALLED: Engineers fully shielded from temporal spaghettification!', 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer transition"
                      >
                        EQUIP SUITS
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SHIELDED
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: THE VOID AT THE END OF TIME & ALIOTH SALVAGE */}
      {/* ========================================================================= */}
      {tvaSubTab === 'void' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="bg-stone-950 border border-purple-500/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wider">
                    THE VOID AT THE END OF TIME // SCAVENGER RADAR
                  </h3>
                  <p className="text-xs text-purple-300/80 font-mono">
                    Target Coordinates: Null-Time Landfill &bull; Roaming Threat: Alioth the Living Temporal Storm
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-400 text-purple-300 font-mono">
                ALIOTH PROXIMITY: 4.2 KM
              </span>
            </div>

            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              When the TVA prunes an alternate reality, it does not destroy matter—it teleports everything to the Void at the End of Time. Ancient starships, Helicarriers, Avengers Quinjets, and even confiscated Infinity Stones litter the landscape. Dispatching a TemPad team allows rapid scavenging before Alioth consumes the target.
            </p>

            {/* Interactive Scavenge Dispatch Area */}
            <div className="bg-stone-900 p-4 rounded-xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold text-white font-mono uppercase">
                    Launch TemPad Void Scavenge Drop
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-mono">
                  Cost: 45 Arc Power &bull; 15 Vibranium Credits &bull; Potential Rewards: +2 Chrono-Cores, Infinity Stones, +220 Scrap
                </p>
              </div>

              <button
                onClick={handleDispatchVoidScavenger}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black font-mono text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer active:scale-95 shrink-0"
              >
                OPEN VOID TIMEDOOR
              </button>
            </div>

            {/* Historical Salvaged Relics from the Void */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-amber-400 font-bold block">TVA Paperweight Stones</span>
                <span className="text-stone-400 text-[11px] mt-0.5 block">Powerless in the TVA, but radiate immense energy when returned to spacetime.</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-purple-400 font-bold block">Alioth Cloud Essence</span>
                <span className="text-stone-400 text-[11px] mt-0.5 block">Bottled temporal matter that accelerates chronal research by +30%.</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-cyan-400 font-bold block">Variant Quinjet Parts</span>
                <span className="text-stone-400 text-[11px] mt-0.5 block">Stark aerospace alloys salvaging high-grade titanium and vibranium wiring.</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: CASEY'S EVIDENCE LOCKER & DESK CONTRABAND */}
      {/* ========================================================================= */}
      {tvaSubTab === 'evidence' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="bg-stone-950 border border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wider">
                    CASEY&apos;S TVA EVIDENCE LOCKER // CONTRABAND ARCHIVE
                  </h3>
                  <p className="text-xs text-amber-300/80 font-mono">
                    Desk Curator: Casey (Hunter K-5E) &bull; &ldquo;What&apos;s a fish? Here, take some glowing rocks.&rdquo;
                  </p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-900 border border-amber-500/40 text-amber-300 font-mono">
                DESK DRAWER: UNLOCKED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Item 1: Confiscated Infinity Stones (Paperweights) */}
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      Infinity Stone &ldquo;Paperweights&rdquo;
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                      Infinite Power Siphon
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-1">
                    Drawers full of Space, Time, and Power Stones confiscated from timeline variants who didn&apos;t file their transit forms.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <span className="text-xs font-mono text-stone-400">Cost: 20 Credits</span>
                  <button
                    onClick={() => {
                      if (resources.vibraniumCredits < 20) {
                        soundFx.playAlarm();
                        setFeedback({ text: 'Requires 20 Vibranium Credits for Casey to unlock drawer!', type: 'error' });
                        return;
                      }
                      setResources((prev) => ({
                        ...prev,
                        vibraniumCredits: Math.max(0, prev.vibraniumCredits - 20),
                        power: prev.power + 250,
                        chronoCores: prev.chronoCores + 1,
                        morale: Math.min(100, prev.morale + 10),
                      }));
                      soundFx.playSuccess();
                      addLog('CASEY PAPERWEIGHT SIPHON: Unlocked confiscated Infinity Stones, injecting +250 Arc Power and +1 Chrono-Core!', 'success');
                      setFeedback({ text: 'Harvested Infinity Stone desk weights! +250 Arc Power & +1 Chrono-Core.', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs cursor-pointer transition"
                  >
                    HARVEST STONES (+250 POWER)
                  </button>
                </div>
              </div>

              {/* Item 2: TVA Pruning Time Stick */}
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      Minutemen Pruning Time Stick
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono">
                      Defense Boost
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-1">
                    Standard issue glowing amber baton that dissolves matter into temporal static. Boosts outpost defense against incursion shocktroops.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <span className="text-xs font-mono text-stone-400">Cost: 60 Scrap &bull; 30 Power</span>
                  <button
                    onClick={() => {
                      if (resources.scrap < 60 || resources.power < 30) {
                        soundFx.playAlarm();
                        setFeedback({ text: 'Insufficient resources to calibrate Time Stick!', type: 'error' });
                        return;
                      }
                      setResources((prev) => ({
                        ...prev,
                        scrap: Math.max(0, prev.scrap - 60),
                        power: Math.max(0, prev.power - 30),
                        defenseRating: prev.defenseRating + 40,
                        morale: Math.min(100, prev.morale + 5),
                      }));
                      soundFx.playSuccess();
                      addLog('PRUNING TIME STICK ARMED: Colony Defense increased by +40!', 'success');
                      setFeedback({ text: 'Pruning Time Sticks calibrated! +40 Colony Defense.', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs cursor-pointer transition"
                  >
                    ARM DEFENDERS (+40 DEFENSE)
                  </button>
                </div>
              </div>

              {/* Item 3: TVA Time Collar Restraints */}
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      TVA Time Collar Restraint Box
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                      Crisis Control
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-1">
                    Rewinds local kinetic motion when activated with a remote toggle. Extends active crisis resolution timers by +60 seconds.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <span className="text-xs font-mono text-stone-400">Cost: 40 Power &bull; 15 Credits</span>
                  <button
                    onClick={() => {
                      if (resources.power < 40 || resources.vibraniumCredits < 15) {
                        soundFx.playAlarm();
                        setFeedback({ text: 'Insufficient resources to prime Time Collars!', type: 'error' });
                        return;
                      }
                      setResources((prev) => ({
                        ...prev,
                        power: Math.max(0, prev.power - 40),
                        vibraniumCredits: Math.max(0, prev.vibraniumCredits - 15),
                        morale: Math.min(100, prev.morale + 10),
                      }));
                      soundFx.playSuccess();
                      addLog('TIME COLLARS PRIMED: Rewound local chronometric turbulence, suppressing crisis risks.', 'success');
                      setFeedback({ text: 'Time Collars primed! Local entropy halted.', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs cursor-pointer transition"
                  >
                    PRIME COLLARS (+10 MORALE)
                  </button>
                </div>
              </div>

              {/* Item 4: TemPad Pocket Translocator */}
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      TemPad Pocket Translocator
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">
                      Hero Recovery
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-1">
                    Portable retro clamshell device. Instantly resets hero ability cooldowns and recovers fatigue across all active field heroes.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <span className="text-xs font-mono text-stone-400">Cost: 50 Power &bull; 1 Chrono-Core</span>
                  <button
                    onClick={() => {
                      if (resources.power < 50 || resources.chronoCores < 1) {
                        soundFx.playAlarm();
                        setFeedback({ text: 'Requires 50 Power & 1 Chrono-Core for TemPad Translocator!', type: 'error' });
                        return;
                      }
                      setResources((prev) => ({
                        ...prev,
                        power: Math.max(0, prev.power - 50),
                        chronoCores: Math.max(0, prev.chronoCores - 1),
                        morale: Math.min(100, prev.morale + 15),
                      }));
                      soundFx.playAbility();
                      addLog('TEMPAD TRANSLOCATOR ENGAGED: Field heroes rejuvenated and chronal fatigue cleansed!', 'success');
                      setFeedback({ text: 'TemPad translocated energy! All heroes refreshed.', type: 'success' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs cursor-pointer transition"
                  >
                    REFRESH HEROES (+15 MORALE)
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: TVA AGENTS & MINUTEMEN ROSTER */}
      {/* ========================================================================= */}
      {tvaSubTab === 'minutemen' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="bg-stone-950 border border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wider">
                  TVA OPERATIVES &amp; FIELD MINUTEMEN
                </h3>
                <p className="text-xs text-amber-300/80 font-mono">
                  Stationed chronal specialists safeguarding the Sakaar Sanctuary against multiversal erasure
                </p>
              </div>

              {onOpenSupportHub && (
                <button
                  onClick={onOpenSupportHub}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>VIEW TVA SUPPORT CONVERSATIONS</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tvaHeroes.map((hero) => (
                <div 
                  key={hero.id}
                  className="p-4 rounded-xl bg-stone-900 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <HeroAvatar hero={hero} size="lg" shape="rounded" border="border-2 border-amber-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white font-display truncate">
                          {hero.heroName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono uppercase font-bold">
                          {hero.role}
                        </span>
                      </div>
                      <span className="text-xs text-amber-300/90 font-mono block truncate">
                        {hero.title}
                      </span>
                      <p className="text-xs text-stone-300 font-sans italic line-clamp-2 mt-1">
                        &ldquo;{hero.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Passive & Ability */}
                  <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800 space-y-1.5 text-xs font-mono">
                    <div className="text-[11px] text-amber-300">
                      <strong className="text-white">Passive: </strong>{hero.passiveBonus}
                    </div>
                    {hero.ability && (
                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                        <div>
                          <span className="text-white font-bold">{hero.ability.name}</span>
                          <span className="text-[10px] text-stone-400 block truncate max-w-xs">{hero.ability.description}</span>
                        </div>
                        <button
                          onClick={() => {
                            soundFx.playAbility();
                            onHeroAbility(hero);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer transition shrink-0 ml-2"
                        >
                          DEPLOY
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Quick Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>TVA Operations Hub is permanently synced with Sakaar Outpost coordinates.</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateToTab('multiverse')}
            className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-purple-300 border border-purple-500/30 transition cursor-pointer"
          >
            Multiverse Nexus
          </button>
          <button
            onClick={() => onNavigateToTab('battleworld')}
            className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
          >
            Battleworld War Table
          </button>
          <button
            onClick={() => onNavigateToTab('doomsday')}
            className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
          >
            Doomsday Clock
          </button>
        </div>
      </div>

    </div>
  );
};
