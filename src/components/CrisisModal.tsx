import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Users, 
  CheckCircle2, 
  XCircle,
  Coins,
  Wrench
} from 'lucide-react';
import { ColonyCrisis, ColonyResources, MCUHero } from '../types';

interface CrisisModalProps {
  crisis: ColonyCrisis | null;
  heroes: MCUHero[];
  resources: ColonyResources;
  onResolveOption: (actionKey: string) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  crisis,
  heroes,
  resources,
  onResolveOption,
}) => {
  if (!crisis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-950 border-2 border-rose-500 rounded-2xl shadow-2xl shadow-rose-950/50 overflow-hidden flex flex-col animate-pulse-slow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Alert Bar */}
        <div className="bg-rose-950/90 border-b border-rose-600/50 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-slate-950 shadow-lg animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono-tech px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-500/50">
                CRITICAL THREAT: {crisis.threatType.toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display tracking-wider">
                {crisis.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-400 font-mono-tech font-bold text-sm">
            <Clock className="w-4 h-4 animate-spin" />
            <span>{crisis.timeLeftSec}s</span>
          </div>
        </div>

        {/* Threat Description */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            {crisis.description}
          </p>

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-tech flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              TACTICAL COUNTERMEASURES (SELECT DIRECTIVE)
            </h3>

            {crisis.options.map((opt) => {
              const requiredHero = opt.requiredHeroId 
                ? heroes.find(h => h.id === opt.requiredHeroId)
                : null;
              
              const isHeroAvailable = !requiredHero || requiredHero.status !== 'on_expedition';
              const hasScrap = !opt.cost?.scrap || resources.scrap >= opt.cost.scrap;
              const hasPower = !opt.cost?.power || resources.power >= opt.cost.power;
              const hasVibranium = !opt.cost?.vibraniumCredits || resources.vibraniumCredits >= opt.cost.vibraniumCredits;
              const canExecute = isHeroAvailable && hasScrap && hasPower && hasVibranium;

              return (
                <div
                  key={opt.actionKey}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    canExecute
                      ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 font-display">
                        {opt.label}
                      </h4>
                      {requiredHero && (
                        <span 
                          className="text-[10px] px-2 py-0.2 rounded-full font-mono-tech border text-slate-200"
                          style={{ borderColor: requiredHero.accentColor, backgroundColor: `${requiredHero.accentColor}20` }}
                        >
                          Requires {requiredHero.heroName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {opt.description}
                    </p>

                    {/* Cost & Success Rate tags */}
                    <div className="flex items-center gap-3 text-[11px] font-mono-tech pt-1">
                      <span className="text-emerald-400">
                        Success Chance: {Math.round(opt.successChance * 100)}%
                      </span>
                      {opt.cost?.scrap && (
                        <span className={`flex items-center gap-1 ${hasScrap ? 'text-amber-400' : 'text-rose-400'}`}>
                          <Wrench className="w-3 h-3" /> {opt.cost.scrap} Scrap
                        </span>
                      )}
                      {opt.cost?.power && (
                        <span className={`flex items-center gap-1 ${hasPower ? 'text-yellow-400' : 'text-rose-400'}`}>
                          <Zap className="w-3 h-3" /> {opt.cost.power} MW
                        </span>
                      )}
                      {opt.cost?.vibraniumCredits && (
                        <span className={`flex items-center gap-1 ${hasVibranium ? 'text-purple-400' : 'text-rose-400'}`}>
                          <Coins className="w-3 h-3" /> {opt.cost.vibraniumCredits} Cr
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!canExecute}
                    onClick={() => onResolveOption(opt.actionKey)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech shrink-0 transition ${
                      canExecute
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {!isHeroAvailable 
                      ? 'HERO AWAY' 
                      : !canExecute 
                        ? 'INSUFFICIENT' 
                        : 'EXECUTE'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
