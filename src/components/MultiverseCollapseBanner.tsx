import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Globe, 
  Flame, 
  Skull, 
  Zap, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  ExternalLink,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MultiverseCollapseBannerProps {
  incursionThreat: number;
  entropyPercent?: number;
  onOpenConvergenceModal: () => void;
  onNavigateToBattleworld: () => void;
  onNavigateToTva?: () => void;
  onStabilizeLocalAnchor: () => void;
  isRealityRiftEffectActive: boolean;
  onToggleRealityRiftEffect: () => void;
}

export const MultiverseCollapseBanner: React.FC<MultiverseCollapseBannerProps> = ({
  incursionThreat,
  entropyPercent = 94.6,
  onOpenConvergenceModal,
  onNavigateToBattleworld,
  onNavigateToTva,
  onStabilizeLocalAnchor,
  isRealityRiftEffectActive,
  onToggleRealityRiftEffect,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Collapsing worlds being pulled together by Doctor Doom to forge Battleworld
  const COLLAPSING_WORLDS = [
    { name: 'Sakaar', type: 'Wasteland Planet', status: 'Anchor Ground-Zero', color: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60' },
    { name: 'Hala', type: 'Kree Imperial Throneworld', status: 'Collapsing', color: 'border-sky-500/60 text-sky-300 bg-sky-950/60' },
    { name: 'Xandar', type: 'Nova Worldmind', status: 'Gravimetric Pull', color: 'border-amber-500/60 text-amber-300 bg-amber-950/60' },
    { name: 'Earth-616', type: 'Sacred Timeline', status: 'Direct Incursion', color: 'border-red-500/60 text-red-300 bg-red-950/60' },
    { name: 'Earth-828', type: 'Fantastic 4 Retro-World', status: 'Convergence', color: 'border-blue-500/60 text-blue-300 bg-blue-950/60' },
    { name: 'Earth-10005', type: 'Fox Mutant Continuum', status: 'Temporal Ripping', color: 'border-yellow-500/60 text-yellow-300 bg-yellow-950/60' },
    { name: 'Earth-96283', type: 'Raimi Spider-Verse', status: 'Dimensional Warp', color: 'border-pink-500/60 text-pink-300 bg-pink-950/60' },
    { name: 'Knowhere', type: 'Celestial Head Rim', status: 'Orbital Entanglement', color: 'border-purple-500/60 text-purple-300 bg-purple-950/60' },
  ];

  return (
    <aside 
      aria-label="Multiverse Collapse Warning Alert"
      className="relative z-20 w-full bg-gradient-to-r from-red-950/90 via-slate-950/95 to-emerald-950/90 border-y sm:border-x sm:rounded-2xl border-red-500/40 shadow-2xl shadow-red-950/50 backdrop-blur-md overflow-hidden transition-all duration-300"
    >
      {/* Animated warning pulse scanline */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(239,68,68,0.15)_50%,transparent_100%)] animate-[pulse_2.5s_ease-in-out_infinite] pointer-events-none" 
      />

      <div className="relative px-3 sm:px-5 py-2.5 sm:py-3">
        {/* Main Banner Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left: Alarm Beacon & Threat Telemetry */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 flex items-center justify-center">
              <div 
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse"
              >
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <span 
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" 
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-black font-display tracking-widest text-red-400 uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  MULTIVERSE COLLAPSE IN PROGRESS
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-950 border border-red-500/60 text-[10px] font-mono font-bold text-red-200">
                  CODE: SECRET WARS
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/60 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                  <Skull className="w-3 h-3 text-emerald-400" />
                  DOOM CONVERGENCE
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-1 sm:line-clamp-none">
                <strong className="text-amber-300">Doctor Doom</strong> is siphoning the dying cosmos, fusing <span className="text-cyan-300 font-semibold">Sakaar</span>, <span className="text-sky-300 font-semibold">Hala</span>, <span className="text-amber-300 font-semibold">Xandar</span>, and alternate Earths to forge <strong className="text-red-400">Battleworld</strong>!
              </p>
            </div>
          </div>

          {/* Right: Telemetry & Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-between md:justify-end">
            
            {/* Live Entropy Readout */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-red-500/40">
              <div className="text-right">
                <div className="text-[9px] font-mono text-slate-400 uppercase">Entropy Level</div>
                <div className="text-xs font-mono font-bold text-red-400">
                  {Math.min(100, Math.round(incursionThreat * 0.4 + entropyPercent * 0.6))}% CRITICAL
                </div>
              </div>
              <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full animate-pulse"
                  style={{ width: `${Math.min(100, Math.round(incursionThreat * 0.4 + entropyPercent * 0.6))}%` }}
                />
              </div>
            </div>

            {/* Battleworld War Room Trigger */}
            <button
              onClick={() => {
                soundFx.buttonClick();
                onOpenConvergenceModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-mono font-bold text-xs shadow-lg shadow-red-600/30 border border-red-400/50 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Open Doctor Doom's Battleworld Convergence War Room"
            >
              <Globe className="w-3.5 h-3.5 text-amber-200 animate-spin-slow" />
              <span>BATTLEWORLD WAR ROOM</span>
            </button>

            {/* Quick Reality Rift Toggle */}
            <button
              onClick={() => {
                soundFx.buttonClick();
                onToggleRealityRiftEffect();
              }}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isRealityRiftEffectActive 
                  ? 'bg-purple-950 border-purple-400 text-purple-200 shadow-md shadow-purple-500/30' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isRealityRiftEffectActive ? "Disable Reality Crack FX" : "Enable Reality Crack FX"}
            >
              {isRealityRiftEffectActive ? <Eye className="w-4 h-4 text-purple-300" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Expand / Minimize Details Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
              title={isExpanded ? "Collapse World List" : "Show All Collapsing Realities"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Details Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                ACTIVE WORLDS BEING ABSORBED INTO BATTLEWORLD:
              </span>
              <span className="text-[11px] text-slate-500">
                Source: TVA Temporal Scanners &amp; Baxter Station Telemetry
              </span>
            </div>

            {/* Planet Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLLAPSING_WORLDS.map((w) => (
                <div 
                  key={w.name} 
                  className={`p-2 rounded-xl border text-xs font-mono ${w.color} flex flex-col justify-between transition hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white truncate">{w.name}</span>
                    <span className="text-[9px] px-1 rounded bg-black/40 border border-white/10 uppercase">
                      {w.status}
                    </span>
                  </div>
                  <span className="text-[10px] opacity-75 truncate mt-1">{w.type}</span>
                </div>
              ))}
            </div>

            {/* Fast Intervention Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300 font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Sakaar's Outpost serves as the local reality tether. Reinforcing the anchor dampens incursion shockwaves.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    soundFx.playAbility();
                    onStabilizeLocalAnchor();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>REINFORCE SAKAAR ANCHOR</span>
                </button>
                {onNavigateToTva && (
                  <button
                    onClick={() => {
                      soundFx.buttonClick();
                      onNavigateToTva();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-1 transition cursor-pointer shadow"
                    title="Open TVA Chrono-Command and deploy TemPad Reset Charges"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>TVA INTERVENTION</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    soundFx.buttonClick();
                    onNavigateToBattleworld();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>WAR TABLE</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
