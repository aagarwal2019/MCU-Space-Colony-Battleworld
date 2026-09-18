import React from 'react';
import { 
  Cpu, 
  Zap, 
  Wind, 
  ArrowLeftRight, 
  Sprout, 
  Compass, 
  Shield, 
  Box, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Lock, 
  Coins, 
  Wrench,
  Clock,
  TrendingUp,
  ShieldCheck 
} from 'lucide-react';
import { ColonyResources, TechNode } from '../types';

interface TechLabViewProps {
  techTree: TechNode[];
  resources: ColonyResources;
  onResearchTech: (techId: string) => void;
}

export const TechLabView: React.FC<TechLabViewProps> = ({
  techTree,
  resources,
  onResearchTech,
}) => {
  const getTechIcon = (icon: string) => {
    switch (icon) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-cyan-300" />;
      case 'ArrowLeftRight': return <ArrowLeftRight className="w-5 h-5 text-amber-300" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-purple-400" />;
      case 'Box': return <Box className="w-5 h-5 text-blue-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-rose-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-amber-300" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-yellow-400" />;
      default: return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  const getDeveloperBadge = (dev: string) => {
    switch (dev) {
      case 'Stark Industries':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-500/30 font-mono-tech">STARK R&D</span>;
      case 'Wakandan Design Group':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-500/30 font-mono-tech">WAKANDA</span>;
      case 'Knowhere Black Market':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30 font-mono-tech">KNOWHERE</span>;
      case 'Kamar-Taj Archive':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950/70 text-orange-300 border border-orange-500/30 font-mono-tech">KAMAR-TAJ</span>;
      case 'Time Variance Authority':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30 font-mono-tech">TVA</span>;
      case 'OXE Group':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-mono-tech">OXE GROUP</span>;
      case 'Damage Control':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950/70 text-yellow-300 border border-yellow-500/30 font-mono-tech">DAMAGE CONTROL</span>;
      default:
        return null;
    }
  };

  const tiers = [1, 2, 3] as const;

  return (
    <div className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold tracking-wider text-slate-100 font-display">
              ADVANCED TECH SYNTHESIS LAB
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Synthesize technologies from Stark Industries, Wakanda, Kamar-Taj, TVA, OXE Group, and Damage Control.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {tiers.map((tierNum) => {
          const tierTechs = techTree.filter(t => t.tier === tierNum);

          return (
            <div key={tierNum} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono-tech border border-slate-700">
                  TIER {tierNum === 1 ? 'I (FOUNDATION)' : tierNum === 2 ? 'II (ADVANCED SYNTHESIS)' : 'III (COSMIC MATRIX)'}
                </span>
                <div className="h-[1px] flex-1 bg-slate-800/80" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tierTechs.map((tech) => {
                  const prereqMet = !tech.prerequisiteId || techTree.find(t => t.id === tech.prerequisiteId)?.researched;
                  const canAfford = resources.scrap >= tech.cost.scrap && resources.vibraniumCredits >= tech.cost.vibraniumCredits;
                  const canResearch = prereqMet && canAfford && !tech.researched;

                  return (
                    <div
                      key={tech.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        tech.researched
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                          : !prereqMet
                            ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                            : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                              {getTechIcon(tech.icon)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-100 font-display">
                                {tech.name}
                              </h4>
                              {getDeveloperBadge(tech.developer)}
                            </div>
                          </div>

                          {tech.researched ? (
                            <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40" title="Researched">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : !prereqMet ? (
                            <span className="p-1 rounded-full bg-slate-800 text-slate-500" title="Prerequisite required">
                              <Lock className="w-4 h-4" />
                            </span>
                          ) : null}
                        </div>

                        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                          {tech.description}
                        </p>

                        <div className="mt-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono-tech text-cyan-300">
                          <strong>BENEFIT:</strong> {tech.effectDescription}
                        </div>
                      </div>

                      {/* Cost and Action Button */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {!tech.researched && (
                          <div className="flex items-center gap-3 text-xs font-mono-tech">
                            <span className={`flex items-center gap-1 ${resources.scrap >= tech.cost.scrap ? 'text-slate-200' : 'text-rose-400'}`}>
                              <Wrench className="w-3.5 h-3.5 text-amber-400" />
                              {tech.cost.scrap}
                            </span>
                            <span className={`flex items-center gap-1 ${resources.vibraniumCredits >= tech.cost.vibraniumCredits ? 'text-purple-300' : 'text-rose-400'}`}>
                              <Coins className="w-3.5 h-3.5 text-purple-400" />
                              {tech.cost.vibraniumCredits}
                            </span>
                          </div>
                        )}

                        <div className="ml-auto">
                          {tech.researched ? (
                            <span className="text-xs font-bold text-emerald-400 font-mono-tech flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> RESEARCHED
                            </span>
                          ) : (
                            <button
                              disabled={!canResearch}
                              onClick={() => onResearchTech(tech.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-tech transition ${
                                canResearch
                                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              }`}
                            >
                              {!prereqMet ? 'LOCKED' : !canAfford ? 'INSUFFICIENT' : 'SYNTHESIZE'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
