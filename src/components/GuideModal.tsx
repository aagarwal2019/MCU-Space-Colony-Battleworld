import React from 'react';
import { 
  X, 
  BookOpen, 
  Zap, 
  Wrench, 
  Sprout, 
  Wind, 
  ShieldAlert, 
  Users, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
                SAKAAR SURVIVAL OPERATIONS PROTOCOL
              </h3>
              <span className="text-xs text-slate-400 font-mono-tech">
                Command Directive & Colony Management Handbook
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Planet Lore */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-100 font-display text-base text-cyan-400 mb-1">
              THE WORLD OF SAKAAR
            </h4>
            <p>
              Surrounded by cosmic wormholes, Sakaar is a dystopian wasteland where the garbage and castaways of the cosmos crash-land. Under the chaotic rule of the Grandmaster and roaming bands of Scavengers, you must build an enduring sanctuary for refugees and galactic wanderers.
            </p>
          </div>

          {/* Section 2: Core Survival Priorities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 font-display text-sm uppercase text-amber-400">
              CORE RESOURCE BALANCING
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-yellow-400 flex items-center gap-1 font-mono-tech">
                  <Zap className="w-3.5 h-3.5" /> ARC POWER (MW)
                </span>
                <p className="text-slate-400 mt-1">
                  Every building requires power. If net power drops below zero, non-essential structures trip offline and shields fail!
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono-tech">
                  <Sprout className="w-3.5 h-3.5" /> HYDRO-RATIONS
                </span>
                <p className="text-slate-400 mt-1">
                  Colonists consume food constantly. A food deficit causes famine, dropping morale and triggering civil unrest.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 flex items-center gap-1 font-mono-tech">
                  <Wind className="w-3.5 h-3.5" /> OXYGEN PURITY
                </span>
                <p className="text-slate-400 mt-1">
                  Sakaar's toxic sulfur smog steadily contaminates the air. Keep Wakandan Scrubbers running to maintain breathable O₂.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 flex items-center gap-1 font-mono-tech">
                  <ShieldAlert className="w-3.5 h-3.5" /> DEFENSE RATING
                </span>
                <p className="text-slate-400 mt-1">
                  Higher defense reduces casualties and structural damage during scavenger assaults and Grandmaster tithe raids.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Marvel Cinematic Universe Heroes */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 font-display text-sm uppercase text-purple-400">
              MARVEL HERO STATION CHIEFS & ABILITIES
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
              <li><strong>Tony Stark (Arc Reactor):</strong> Boosts energy output +65% and uses <em>Unibeam Protocol</em> for emergency power.</li>
              <li><strong>Bruce Banner (Hydro-Dome):</strong> Massively elevates food production and uses <em>Hulk Out Repair</em> to instantly mend cracked hulls.</li>
              <li><strong>Rocket Raccoon (Scrap Foundry):</strong> Supercharges scrap gathering and detonates the <em>Hadron Enforcer</em> against raiders.</li>
              <li><strong>Thor (Cantina):</strong> Siphons lightning storms to prevent blackouts and keeps colonist spirits soaring.</li>
              <li><strong>Doctor Strange (Tech Lab):</strong> Speeds up technological research and casts <em>Mirror Dimension Shield</em> to negate environmental storms.</li>
              <li><strong>Carol Danvers (Expeditions):</strong> Halves expedition flight times and swoops in for orbital salvage.</li>
              <li><strong>Spider-Man / Brand New Day (Command):</strong> Boosts crisis reaction window +70%, catches orbital debris with <em>Brand New Day Web-Grid</em> (+220 Scrap, +20 Morale, +25 Defense).</li>
              <li><strong>Shang-Chi (Defense Turret):</strong> Deflects shockwaves (+85% defense) and triggers <em>Ten Rings Cosmic Shockwave</em> (+220 Arc Power, +30 Morale).</li>
              <li><strong>Wonder Man (Arc Reactor):</strong> Boosts reactor output +80% and activates <em>Ionic Energy Overdrive</em> (+320 MW Power, +25 Morale).</li>
              <li><strong>Yelena Belova (Expeditions):</strong> Black-ops leader with +65% expedition success and <em>Widow's Bite Flashbang Ambush</em> (+200 Scrap, +25 Defense).</li>
              <li><strong>Bucky Barnes (Command):</strong> Thunderbolts* commander with +30 Base Defense, 40% retaliatory damage, and <em>Vibranium Arm Kinetic Breaker</em> (+40 Defense, +120 Credits).</li>
              <li><strong>U.S. Agent (Defense Turret):</strong> Super-soldier enforcer with +90% turret lethality and <em>Tactical Shield Ricochet Sweep</em> (+190 Scrap, +35 Defense).</li>
              <li><strong>Red Guardian (Cantina):</strong> Morale juggernaut (+60 Morale) and <em>Red Brawn Heroic Charge</em> (+35 Morale, +180 Scrap, +50 Food).</li>
              <li><strong>Captain America / Sam Wilson (Command):</strong> Cuts build times by 30% and unleashes <em>Vibranium Wing Sonic Dive</em> (+35 Morale, +35 Defense, +120 Credits).</li>
              <li><strong>Daredevil / Matt Murdock (Habitation):</strong> Eliminates dome unrest, detects underground faults, and triggers <em>Born Again Radar Precognition</em> (+35 Defense, +20 Morale).</li>
              <li><strong>Kate Bishop (Scrap Foundry):</strong> Ballistics prodigy yielding +70% scrap and firing <em>Pym Trick Arrow Salvo</em> (+240 Scrap, +60 Power).</li>
              <li><strong>Agent Mobius (TVA Chrono-Hub):</strong> Dampens temporal branch slips and triggers <em>TemPad Chrono-Reset</em> (+45s crisis time).</li>
              <li><strong>Aiko Maki (OXE Commerce Spire):</strong> Deep-mantle alloy yields and <em>Hostile Buyout Protocol</em> (+160 Credits, +220 Scrap).</li>
              <li><strong>Agent Cleary (DODC Hazardous Facility):</strong> Hazard decontamination and <em>Heavy Drone Cleanup</em> (instantly restores all buildings to 100% HP).</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono-tech text-xs transition"
          >
            DISMISS BRIEFING
          </button>
        </div>
      </div>
    </div>
  );
};
