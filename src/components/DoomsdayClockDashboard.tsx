import React, { useState, useEffect } from 'react';
import {
  Clock,
  Skull,
  ShieldAlert,
  Zap,
  Radio,
  Flame,
  Globe,
  ExternalLink,
  Hourglass,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Eye
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ColonyResources, MCUHero, MultiverseTimeline, ResourceRates, ColonyBuilding } from '../types';
import { soundFx } from '../utils/audio';
import { ThreatForecastWidget } from './ThreatForecastWidget';

interface DoomsdayClockDashboardProps {
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  heroes: MCUHero[];
  timelines: MultiverseTimeline[];
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  gameSpeed: number;
  rates?: ResourceRates;
  buildings?: ColonyBuilding[];
  cycle?: number;
}

export const DoomsdayClockDashboard: React.FC<DoomsdayClockDashboardProps> = ({
  resources,
  setResources,
  heroes,
  timelines,
  addLog,
  gameSpeed,
  rates,
  buildings,
  cycle = 1,
}) => {
  // Doomsday Clock Time in seconds to Midnight (e.g., 90s = 1m 30s to Doomsday)
  // Normal state fluctuates between 45s and 180s based on Incursion Threat and player protocols
  const [secondsToMidnight, setSecondsToMidnight] = useState<number>(88);
  const [isStasisActive, setIsStasisActive] = useState<boolean>(false);
  const [stasisTimeRemaining, setStasisTimeRemaining] = useState<number>(0);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);
  const [activeTransmissionIdx, setActiveTransmissionIdx] = useState<number>(0);
  const [entropyData, setEntropyData] = useState<{ time: string; entropy: number; incursionLevel: number }[]>([
    { time: 'T-10m', entropy: 42, incursionLevel: 30 },
    { time: 'T-8m', entropy: 48, incursionLevel: 35 },
    { time: 'T-6m', entropy: 55, incursionLevel: 42 },
    { time: 'T-4m', entropy: 68, incursionLevel: 58 },
    { time: 'T-2m', entropy: 79, incursionLevel: 72 },
    { time: 'NOW', entropy: 86, incursionLevel: 85 },
  ]);

  // Doom transmissions intercepted across the multiverse
  const DOOM_TRANSMISSIONS = [
    {
      source: 'LATVERIA PRIME // DIMENSIONAL BROADCAST',
      speaker: 'Doctor Victor von Doom',
      quote: "You fought so desperately for a universe that was already decaying. There is no salvation in the Avengers. There is only Doom. All realities shall kneel as one on Battleworld.",
      date: 'COSMIC CYCLE: ZERO HOUR APPROACHING'
    },
    {
      source: 'TVA TEMPORAL WAR ROOM // CODE BLACK',
      speaker: 'TVA Commander B-15 & Mobius',
      quote: "The Loom is buckling under sheer gravimetric displacement. It's not Kang this time... someone has rewritten the fundamental fabric of reality from the shadows. The sacred timeline is fracturing into three colliding realities!",
      date: 'MULTIVERSE DISPLACEMENT SENSOR'
    },
    {
      source: 'SANCTUM SANCTORUM // EARTH-616',
      speaker: 'Doctor Stephen Strange & Clea',
      quote: "An incursion has been weaponized! Two entire universes are collapsing directly into our coordinates. If we don't decouple the anchor points within minutes, reality itself ceases to exist.",
      date: 'MYSTIC DEFENSE TELEMETRY'
    },
    {
      source: 'BAXTER FOUNDATION // EARTH-8211',
      speaker: 'Reed Richards / Mister Fantastic',
      quote: "Victor's calculations are horrifyingly sound. He is orchestrating the death of infinite worlds to harvest their cosmic life force. Prepare the multiversal life-raft immediately.",
      date: 'COSMIC HARVEST INTERCEPT'
    }
  ];

  // Tick the Doomsday Clock every second based on game speed and incursion threat
  useEffect(() => {
    if (gameSpeed === 0) return;

    const interval = setInterval(() => {
      // If stasis is active, count down stasis instead of advancing clock
      if (isStasisActive) {
        setStasisTimeRemaining(prev => {
          if (prev <= 1) {
            setIsStasisActive(false);
            addLog('TVA Temporal Loom stasis field expired. The Doomsday Clock resumes its march toward Midnight.', 'warning');
            return 0;
          }
          return prev - 1;
        });
        return;
      }

      setSecondsToMidnight(prev => {
        // High incursion threat accelerates the clock down; low threat stabilizes it
        const threatSpeed = resources.incursionThreat >= 60 ? 2 : resources.incursionThreat >= 30 ? 1 : 0.5;
        const newSec = Math.max(15, prev - (threatSpeed * gameSpeed * 0.5));

        // Update entropy graph occasionally
        if (Math.random() < 0.2) {
          setEntropyData(curr => {
            const nextVal = Math.min(100, Math.max(20, Math.round(100 - (newSec / 120) * 80 + (Math.random() * 8 - 4))));
            const nextList = [...curr.slice(1), {
              time: `${Math.round(newSec)}s`,
              entropy: nextVal,
              incursionLevel: Math.round(resources.incursionThreat)
            }];
            return nextList;
          });
        }

        return Math.round(newSec * 10) / 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameSpeed, isStasisActive, resources.incursionThreat, addLog]);

  // Compute DEFCON level (1 to 5)
  // DEFCON 1: <= 40s (Catastrophic)
  // DEFCON 2: <= 70s (Critical)
  // DEFCON 3: <= 100s (Elevated)
  // DEFCON 4: <= 140s (Guarded)
  // DEFCON 5: > 140s (Stable)
  const getDefconLevel = (seconds: number) => {
    if (seconds <= 40) return { level: 1, label: 'DEFCON 1: APOCALYPTIC INCURSION', color: 'text-rose-500 bg-rose-950/80 border-rose-500/60 animate-pulse', glow: 'shadow-rose-500/50' };
    if (seconds <= 70) return { level: 2, label: 'DEFCON 2: DOOM CONVERGENCE', color: 'text-orange-400 bg-orange-950/80 border-orange-500/60', glow: 'shadow-orange-500/40' };
    if (seconds <= 100) return { level: 3, label: 'DEFCON 3: MULTIVERSE SHOCKWAVE', color: 'text-amber-400 bg-amber-950/80 border-amber-500/60', glow: 'shadow-amber-500/30' };
    if (seconds <= 140) return { level: 4, label: 'DEFCON 4: ANOMALOUS STRAIN', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/60', glow: 'shadow-cyan-500/20' };
    return { level: 5, label: 'DEFCON 5: TEMPORAL STABILITY', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/60', glow: 'shadow-emerald-500/20' };
  };

  const defcon = getDefconLevel(secondsToMidnight);

  // Countermeasure Protocol 1: Chrono-Core Temporal Anchor
  const handleChronoAnchor = () => {
    if (resources.chronoCores < 1) {
      soundFx.playAlarm();
      addLog('Insufficient Chrono-Cores! Harvest more from alternate realities in the Multiverse Nexus.', 'danger');
      return;
    }

    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      chronoCores: prev.chronoCores - 1,
      incursionThreat: Math.max(0, prev.incursionThreat - 25),
      multiverseInfluence: prev.multiverseInfluence + 30,
    }));

    setSecondsToMidnight(prev => Math.min(180, prev + 45));
    addLog('DOOMSDAY PROTOCOL 1: Chrono-Core anchored into the local timeline. Clock rewound +45 seconds away from Midnight! Incursion threat suppressed.', 'success');
  };

  // Countermeasure Protocol 2: Vibranium Deflection Shroud
  const handleVibraniumShroud = () => {
    const cost = { scrap: 150, vibraniumCredits: 30 };
    if (resources.scrap < cost.scrap || resources.vibraniumCredits < cost.vibraniumCredits) {
      soundFx.playAlarm();
      addLog('Insufficient Scrap or Vibranium Credits to erect the deflection shroud.', 'danger');
      return;
    }

    soundFx.playBuild();
    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - cost.scrap,
      vibraniumCredits: prev.vibraniumCredits - cost.vibraniumCredits,
      defenseRating: prev.defenseRating + 35,
      morale: Math.min(100, prev.morale + 10),
    }));

    setSecondsToMidnight(prev => Math.min(180, prev + 25));
    addLog('DOOMSDAY PROTOCOL 2: Vibranium Deflection Shroud activated! Sakaar shields bolstered (+35 Defense) and Doomsday Clock pushed back +25s.', 'success');
  };

  // Countermeasure Protocol 3: Avengers Multiverse Strike Force
  const handleAvengersStrikeForce = () => {
    if (resources.power < 80 || resources.food < 40) {
      soundFx.playAlarm();
      addLog('Insufficient Arc Power (80) or Food Supplies (40) to fuel the Avengers strike team!', 'danger');
      return;
    }

    soundFx.playCrisis();
    setResources(prev => ({
      ...prev,
      power: prev.power - 80,
      food: prev.food - 40,
      chronoCores: prev.chronoCores + 1,
      multiverseInfluence: prev.multiverseInfluence + 45,
      incursionThreat: Math.max(0, prev.incursionThreat - 15),
    }));

    setSecondsToMidnight(prev => Math.min(180, prev + 35));
    addLog('DOOMSDAY PROTOCOL 3: Avengers Strike Force ambushed a Latverian harvesting outpost! Recovered +1 Chrono-Core and delayed Zero Hour by +35 seconds.', 'success');
  };

  // Countermeasure Protocol 4: TVA Temporal Loom Bypass (Clock Stasis)
  const handleTemporalStasis = () => {
    if (resources.chronoCores < 2) {
      soundFx.playAlarm();
      addLog('Requires 2 Chrono-Cores to override the TVA Temporal Loom!', 'danger');
      return;
    }

    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      chronoCores: prev.chronoCores - 2,
      multiverseInfluence: prev.multiverseInfluence + 60,
    }));

    setIsStasisActive(true);
    setStasisTimeRemaining(60);
    addLog('DOOMSDAY PROTOCOL 4: TVA Temporal Loom Stasis engaged! The Doomsday Clock is FROZEN in time for 60 seconds.', 'success');
  };

  // Calculate analog clock hand angle (12 o'clock = 0 deg; 0 seconds = 0 deg; 180s = -90 deg sweep)
  // Let's sweep the hand so that 0s = exactly at 12:00 (0 deg, straight up Midnight)
  // And 180s = at 9:00 (-90 deg), ticking clockwise toward 12:00
  const clockAngle = Math.min(0, Math.max(-90, -((secondsToMidnight / 180) * 90)));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Ominous Multiverse Incursion Warning */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 border-2 border-emerald-500/40 p-5 shadow-2xl">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-slate-900 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0 flex items-center justify-center text-white">
              <div className="w-full h-full bg-slate-950/50 rounded-[14px] flex items-center justify-center">
                <Skull className="w-7 h-7 text-emerald-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 font-display tracking-tight flex items-center gap-2">
                  <span>AVENGERS: DOOMSDAY CLOCK</span>
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-tech font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  LATVERIA RECONNAISSANCE
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono-tech font-bold uppercase border ${defcon.color}`}>
                  {defcon.label}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Doctor Victor von Doom is orchestrating a catastrophic multiversal incursion convergence to forge <strong className="text-emerald-300">Battleworld</strong>. Monitor the chronometer, intercept tactical satellite briefings, and deploy defense protocols before the clock strikes <strong className="text-rose-400">Midnight (Zero Hour)</strong>.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center font-mono-tech">
              <span className="text-[10px] text-slate-400 block">MULTIVERSE INFLUENCE</span>
              <span className="text-base font-bold text-purple-300">{resources.multiverseInfluence}</span>
            </div>
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center font-mono-tech">
              <span className="text-[10px] text-slate-400 block">CHRONO-CORES</span>
              <span className="text-base font-bold text-cyan-300">{resources.chronoCores}</span>
            </div>
            <button
              onClick={() => {
                if (isAlarmPlaying) {
                  setIsAlarmPlaying(false);
                } else {
                  setIsAlarmPlaying(true);
                  soundFx.playAlarm();
                }
              }}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono-tech font-bold ${
                isAlarmPlaying 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title="Toggle Klaxon Audio Alarm"
            >
              {isAlarmPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAlarmPlaying ? 'KLAXON ACTIVE' : 'SIREN OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Clockface Chronometer (Left) + YouTube Satellite Intercept (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOOMSDAY ANALOG CHRONOMETER & STATUS (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-5 border border-emerald-500/30 shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          {/* Clock Header */}
          <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 z-10">
            <div className="flex items-center gap-2 text-xs font-mono-tech">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="text-slate-300 font-bold tracking-wider uppercase">ANALOG INVASION DIAL</span>
            </div>
            {isStasisActive ? (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse">
                STASIS: {stasisTimeRemaining}s REMAINING
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                ACTIVE COUNTDOWN
              </span>
            )}
          </div>

          {/* Analog Circular Clock Face SVG */}
          <div className="my-6 relative flex items-center justify-center">
            {/* Pulsing ring background */}
            <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-800 bg-slate-950/90 flex items-center justify-center shadow-2xl relative ${defcon.glow}`}>
              {/* Outer Minute Marks & Roman Numerals */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
                {/* Dial Circle */}
                <circle cx="100" cy="100" r="92" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle cx="100" cy="100" r="88" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                {/* Critical Red Danger Arc for last 3 minutes (9 o'clock to 12 o'clock) */}
                <path
                  d="M 12 100 A 88 88 0 0 1 100 12"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* Clock Numerals */}
                <text x="100" y="28" fill="#ef4444" fontSize="13" fontWeight="900" fontFamily="monospace" textAnchor="middle">XII</text>
                <text x="96" y="38" fill="#ef4444" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">MIDNIGHT</text>
                <text x="175" y="105" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">III</text>
                <text x="100" y="180" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">VI</text>
                <text x="25" y="105" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">IX</text>

                {/* Minute Tick Marks */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i * 6 * Math.PI) / 180;
                  const isMajor = i % 5 === 0;
                  const r1 = 88;
                  const r2 = isMajor ? 78 : 83;
                  const x1 = 100 + r1 * Math.sin(angle);
                  const y1 = 100 - r1 * Math.cos(angle);
                  const x2 = 100 + r2 * Math.sin(angle);
                  const y2 = 100 - r2 * Math.cos(angle);
                  const isDangerZone = i >= 45; // 9 o'clock to 12 o'clock

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isDangerZone ? '#f87171' : isMajor ? '#64748b' : '#334155'}
                      strokeWidth={isMajor ? 2 : 1}
                    />
                  );
                })}

                {/* Center Hub */}
                <circle cx="100" cy="100" r="7" fill="#10b981" />
                <circle cx="100" cy="100" r="3" fill="#022c22" />

                {/* Clock Hand pointing toward Midnight */}
                <g transform={`rotate(${clockAngle} 100 100)`}>
                  {/* Glowing Arrow Hand */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="24"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 4px #10b981)"
                  />
                  {/* Counter-weight tail */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="118"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="24" r="3" fill="#ef4444" />
                </g>
              </svg>

              {/* Digital Readout Center Overlay */}
              <div className="absolute flex flex-col items-center justify-center text-center mt-12 pointer-events-none">
                <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase tracking-widest">
                  TIME TO MIDNIGHT
                </span>
                <span className={`text-3xl sm:text-4xl font-black font-mono-tech tracking-tight ${
                  secondsToMidnight <= 40 ? 'text-rose-500 animate-pulse' : 'text-slate-100'
                }`}>
                  {Math.floor(secondsToMidnight / 60)}m {Math.floor(secondsToMidnight % 60).toString().padStart(2, '0')}s
                </span>
                <span className="text-[9px] font-mono-tech text-slate-500 mt-0.5">
                  ({Math.round(secondsToMidnight)} SECONDS REMAINING)
                </span>
              </div>
            </div>
          </div>

          {/* Dial Summary Status */}
          <div className="w-full bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs font-mono-tech space-y-1.5 z-10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">INCURSION VELOCITY:</span>
              <span className="text-amber-300 font-bold">
                {resources.incursionThreat >= 60 ? '1.80 Megaparsecs/s (CRITICAL)' : '0.45 Megaparsecs/s (NOMINAL)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">PRIMARY COLLISION VECTOR:</span>
              <span className="text-cyan-300 font-bold">Earth-616 vs Earth-838 vs Latveria</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ZERO HOUR CASUALTY RISK:</span>
              <span className="text-rose-400 font-bold">TOTAL UNIVERSAL OBLIVION</span>
            </div>
          </div>
        </div>

        {/* AVENGERS: DOOMSDAY VIDEO BRIEFING & SATELLITE INTERCEPT (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Film className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 font-mono-tech uppercase tracking-wider">
                  CLASSIFIED SATELLITE BRIEFING: AVENGERS DOOMSDAY
                </h3>
                <span className="text-[10px] text-slate-400 font-mono-tech">
                  Intercept Code: f17J3AXVK5w // Source: YouTube Transmission
                </span>
              </div>
            </div>

            <a
              href="https://www.youtube.com/watch?v=f17J3AXVK5w"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono-tech font-bold flex items-center gap-1.5 transition shadow"
              title="Open video on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WATCH ON YOUTUBE</span>
            </a>
          </div>

          {/* Embedded YouTube Player Container */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <iframe
              id="avengers-doomsday-youtube-frame"
              src="https://www.youtube.com/embed/f17J3AXVK5w?rel=0&modestbranding=1"
              title="Avengers: Doomsday Intercept Transmission"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Dossier Notes & Tactical Intel */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono-tech">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block text-[10px]">SUPREME ARCHITECT:</span>
              <span className="text-slate-200 font-semibold block">Victor von Doom</span>
              <span className="text-[10px] text-slate-400">Portrayed by Robert Downey Jr.</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">DIRECTED BY:</span>
              <span className="text-slate-200 font-semibold block">Anthony & Joe Russo</span>
              <span className="text-[10px] text-slate-400">Culmination of the Multiverse Saga</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block text-[10px]">PRIMARY THREAT:</span>
              <span className="text-slate-200 font-semibold block">Battleworld Convergence</span>
              <span className="text-[10px] text-slate-400">Three colliding reality manifolds</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Cycle Threat Forecast Telemetry & Stabilization Planning Widget */}
      <ThreatForecastWidget
        resources={resources}
        setResources={setResources}
        rates={rates}
        buildings={buildings}
        heroes={heroes}
        cycle={cycle}
        addLog={addLog}
        onRewindClock={(secs) => setSecondsToMidnight(prev => Math.min(180, prev + secs))}
      />

      {/* Interactive Emergency Doomsday Protocols & Entropy Wave Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOOMSDAY MITIGATION PROTOCOLS (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 font-mono-tech uppercase tracking-wider">
                  TACTICAL DOOMSDAY COUNTERMEASURES
                </h3>
                <p className="text-[10px] text-slate-400 font-mono-tech">
                  Authorize Colony Protocols to Rewind the Clock & Repel Victor von Doom
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech bg-slate-900 text-slate-400 border border-slate-800">
              4 PROTOCOLS READY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Protocol 1: Chrono-Core Temporal Anchor */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-cyan-300 font-mono-tech">
                    PROTOCOL 1: CHRONO ANCHOR
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">COST: 1 CORE</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Anchor a multiversal Chrono-Core into Sakaar's temporal crust to reverse localized quantum collapse.
                </p>
                <div className="mt-2 text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>+45s to Midnight & -25% Incursion Risk</span>
                </div>
              </div>

              <button
                id="doomsday-protocol-1-btn"
                onClick={handleChronoAnchor}
                disabled={resources.chronoCores < 1}
                className="mt-3 w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono-tech text-xs rounded-lg transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Hourglass className="w-3.5 h-3.5" />
                <span>DEPLOY CHRONO ANCHOR</span>
              </button>
            </div>

            {/* Protocol 2: Vibranium Deflection Shroud */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-amber-300 font-mono-tech">
                    PROTOCOL 2: VIBRANIUM SHROUD
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">150 SCRAP / 30 CR</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Overcharge the colony perimeter with kinetic vibranium plating to withstand Doomsday shockwaves.
                </p>
                <div className="mt-2 text-[10px] font-mono-tech text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>+25s to Midnight & +35 Defense Rating</span>
                </div>
              </div>

              <button
                id="doomsday-protocol-2-btn"
                onClick={handleVibraniumShroud}
                disabled={resources.scrap < 150 || resources.vibraniumCredits < 30}
                className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono-tech text-xs rounded-lg transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>OVERCHARGE SHIELDS</span>
              </button>
            </div>

            {/* Protocol 3: Avengers Strike Force Ambush */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-emerald-300 font-mono-tech">
                    PROTOCOL 3: AVENGERS STRIKE
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">80 POWER / 40 FOOD</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Mobilize our highest combat operatives (Iron Man, Thor, Hulk) to intercept Doom's dimensional relays.
                </p>
                <div className="mt-2 text-[10px] font-mono-tech text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>+35s to Midnight & Harvest +1 Chrono-Core</span>
                </div>
              </div>

              <button
                id="doomsday-protocol-3-btn"
                onClick={handleAvengersStrikeForce}
                disabled={resources.power < 80 || resources.food < 40}
                className="mt-3 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono-tech text-xs rounded-lg transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>DISPATCH STRIKE TEAM</span>
              </button>
            </div>

            {/* Protocol 4: TVA Temporal Loom Stasis */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-purple-300 font-mono-tech">
                    PROTOCOL 4: TEMPORAL STASIS
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">COST: 2 CORES</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Lock our universal coordinate inside a TVA chronometric bubble, halting the Doomsday Clock for 60 seconds.
                </p>
                <div className="mt-2 text-[10px] font-mono-tech text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>FREEZE CLOCK (60s STASIS) & +60 Influence</span>
                </div>
              </div>

              <button
                id="doomsday-protocol-4-btn"
                onClick={handleTemporalStasis}
                disabled={resources.chronoCores < 2 || isStasisActive}
                className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold font-mono-tech text-xs rounded-lg transition shadow disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isStasisActive ? 'animate-spin' : ''}`} />
                <span>{isStasisActive ? 'STASIS RUNNING' : 'INITIATE TIME FREEZE'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TIMELINE ENTROPY DECAY CHART (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 font-mono-tech uppercase tracking-wider">
                  REALITY ENTROPY DECAY
                </h3>
                <span className="text-[10px] text-slate-400 font-mono-tech">
                  Quantum Stress vs. Incursion Threat
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono-tech text-rose-400">
              Entropy Index: {entropyData[entropyData.length - 1]?.entropy}%
            </span>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={entropyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="entropyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="incursionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#334155" />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#334155" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded text-[11px] font-mono-tech shadow-xl">
                          <p className="text-emerald-400">Entropy Stress: {payload[0]?.value}%</p>
                          <p className="text-rose-400">Incursion Risk: {payload[1]?.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="entropy" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#entropyGradient)" />
                <Area type="monotone" dataKey="incursionLevel" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#incursionGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Entropy Strain</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Incursion Threat</span>
            </span>
            <span>Sensor: Heimdall Observational Array</span>
          </div>
        </div>
      </div>

      {/* DOCTOR DOOM INTERCEPTED TRANSMISSIONS TERMINAL */}
      <div className="bg-slate-950/90 rounded-2xl p-5 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 font-mono-tech uppercase tracking-wider">
                DECRYPTED INTERCEPT LOGS: DOOM TRANSMISSIONS
              </h3>
              <p className="text-[10px] text-slate-400 font-mono-tech">
                Sub-Space Transmissions Intercepted Across Collapsing Timeline Manifolds
              </p>
            </div>
          </div>

          {/* Navigation for transmissions */}
          <div className="flex items-center gap-1.5">
            {DOOM_TRANSMISSIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTransmissionIdx(idx)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono-tech font-bold transition ${
                  activeTransmissionIdx === idx
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                LOG 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Transmission Body */}
        {(() => {
          const t = DOOM_TRANSMISSIONS[activeTransmissionIdx];
          return (
            <div className="bg-slate-900/70 rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-400 font-mono-tech">
                  {t.source}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-tech">
                  {t.date}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 font-mono-tech">
                  BROADCASTER: {t.speaker}
                </span>
              </div>

              <p className="text-sm italic text-slate-300 font-serif border-l-2 border-emerald-500/60 pl-3 py-1 my-2 bg-emerald-950/20 rounded-r">
                "{t.quote}"
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
