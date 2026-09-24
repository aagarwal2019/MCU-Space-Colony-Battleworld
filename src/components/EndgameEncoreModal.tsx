import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Clock, 
  Zap, 
  Shield, 
  Swords, 
  X, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Flame, 
  Ticket, 
  Star, 
  Volume2, 
  Play, 
  Share2,
  ChevronRight,
  Heart,
  Skull
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ColonyResources } from '../types';

interface EndgameEncoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger' | 'crisis') => void;
  onOpenMCUIntel: (query: string) => void;
  onOpenTicketsPortal?: () => void;
}

export const EndgameEncoreModal: React.FC<EndgameEncoreModalProps> = ({
  isOpen,
  onClose,
  resources,
  setResources,
  addLog,
  onOpenMCUIntel,
  onOpenTicketsPortal,
}) => {
  const [claimedProtocols, setClaimedProtocols] = useState<{
    assemble: boolean;
    quantumHeist: boolean;
    mjolnir: boolean;
    nanoSnap: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('sakaar_endgame_encore_claims');
      return saved ? JSON.parse(saved) : {
        assemble: false,
        quantumHeist: false,
        mjolnir: false,
        nanoSnap: false,
      };
    } catch {
      return {
        assemble: false,
        quantumHeist: false,
        mjolnir: false,
        nanoSnap: false,
      };
    }
  });

  const [activeTab, setActiveTab] = useState<'celebration' | 'theatrical' | 'tribute'>('celebration');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const saveClaims = (updated: typeof claimedProtocols) => {
    setClaimedProtocols(updated);
    try {
      localStorage.setItem('sakaar_endgame_encore_claims', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Protocol 1: "Whatever It Takes" Assemble Rally
  const handleClaimAssemble = () => {
    if (claimedProtocols.assemble) return;
    soundFx.playSuccess();
    setResources((prev) => ({
      ...prev,
      power: prev.power + 350,
      morale: 100,
      multiverseInfluence: prev.multiverseInfluence + 50,
    }));
    const updated = { ...claimedProtocols, assemble: true };
    saveClaims(updated);
    addLog('ENDGAME ENCORE ACTIVATED: "Avengers... Assemble!" Colony morale restored to 100% and injected +350 Arc Power!', 'success');
    setFeedback('"Avengers... Assemble!" Morale boosted to 100% & +350 Power claimed!');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Protocol 2: Quantum Realm Time Heist Dispatch
  const handleClaimQuantumHeist = () => {
    if (claimedProtocols.quantumHeist) return;
    soundFx.playAbility();
    setResources((prev) => ({
      ...prev,
      chronoCores: prev.chronoCores + 2,
      scrap: prev.scrap + 250,
      incursionThreat: Math.max(0, prev.incursionThreat - 15),
    }));
    const updated = { ...claimedProtocols, quantumHeist: true };
    saveClaims(updated);
    addLog('QUANTUM TIME HEIST SUCCESS: Scott Lang & Tony Stark secured chronal particles from past timelines! +2 Chrono-Cores, +250 Scrap, Incursion Threat -15%.', 'success');
    setFeedback('Quantum Time Heist Successful! +2 Chrono-Cores, +250 Scrap, Threat -15%!');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Protocol 3: Steve Rogers Lifts Mjolnir
  const handleClaimMjolnir = () => {
    if (claimedProtocols.mjolnir) return;
    soundFx.playAbility();
    setResources((prev) => ({
      ...prev,
      defenseRating: prev.defenseRating + 60,
      morale: Math.min(100, prev.morale + 15),
    }));
    const updated = { ...claimedProtocols, mjolnir: true };
    saveClaims(updated);
    addLog('WORTHY ASSEMBLE: Steve Rogers summoned lightning with Mjolnir! ("I knew it!") Colony Defense Rating boosted by +60!', 'success');
    setFeedback('Worthy! Mjolnir lightning defenses active (+60 Defense Rating)!');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Protocol 4: Tony Stark Nano-Gauntlet Snap
  const handleClaimNanoSnap = () => {
    if (claimedProtocols.nanoSnap) return;
    if (resources.chronoCores < 1) {
      soundFx.playAlarm();
      setFeedback('Requires 1 Chrono-Core to channel the 6 Infinity Stones into the Nano Gauntlet!');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }
    soundFx.playSuccess();
    setResources((prev) => ({
      ...prev,
      chronoCores: Math.max(0, prev.chronoCores - 1),
      incursionThreat: Math.max(0, prev.incursionThreat - 25),
      morale: 100,
      multiverseInfluence: prev.multiverseInfluence + 80,
    }));
    const updated = { ...claimedProtocols, nanoSnap: true };
    saveClaims(updated);
    addLog('NANO GAUNTLET SNAP: "And I... am... Iron Man." Wiped out 25% of Incursion Threat and harmonized multiverse resonance across all sectors!', 'success');
    setFeedback('"And I... am... Iron Man." Incursion Threat reduced by 25%!');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-stone-950 to-slate-950 border-2 border-amber-500/70 rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Theatrical Marquee Header Banner */}
        <div className="relative bg-gradient-to-r from-purple-950 via-amber-950 to-slate-950 p-5 sm:p-6 border-b border-amber-500/40 overflow-hidden">
          
          {/* Subtle cosmic starfield backdrop */}
          <div 
            aria-hidden="true" 
            className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" 
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-purple-600 to-indigo-800 border-2 border-amber-300 flex items-center justify-center shadow-lg shadow-purple-600/40 shrink-0">
                <Film className="w-7 h-7 sm:w-8 sm:h-8 text-amber-100" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-mono font-black px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-widest shadow-sm">
                    LIMITED THEATRICAL EVENT
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/90 border border-purple-400/60 text-purple-200">
                    THIS WEEKEND ONLY
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black font-display text-white uppercase tracking-wider mt-1 drop-shadow-md">
                  AVENGERS: ENDGAME ENCORE
                </h2>
                <p className="text-xs sm:text-sm text-amber-200/90 font-mono">
                  Experience the epic Infinity Saga conclusion back on the big screen with exclusive bonus footage!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:static p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Close Event Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-500/20">
            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveTab('celebration');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'celebration'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-300/80 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLONY ENCORE PROTOCOLS</span>
            </button>

            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveTab('theatrical');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'theatrical'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-300/80 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>THEATRICAL DETAILS &amp; BONUS SCENES</span>
            </button>

            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveTab('tribute');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tribute'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-300/80 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>STAN LEE &amp; MULTIVERSE TRIBUTE</span>
            </button>
          </div>

        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          
          {/* TAB 1: IN-GAME CELEBRATION PROTOCOLS */}
          {activeTab === 'celebration' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-slate-900/60 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-amber-200 font-display uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                    <Award className="w-4 h-4 text-amber-400" />
                    WEEKEND THEATRICAL COMMEMORATIVE PROTOCOLS
                  </h3>
                  <p className="text-xs text-slate-300 font-sans">
                    Celebrate the return of <em>Avengers: Endgame</em> to theaters this weekend by activating these four legendary Infinity Saga battle protocols for your Sakaar outpost!
                  </p>
                </div>
                <button
                  onClick={() => onOpenMCUIntel('Avengers Endgame Encore re-release showtimes and tickets')}
                  className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>CHECK SHOWTIMES</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* 4 Iconic Protocols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Protocol 1: Whatever It Takes */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-300 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-400" />
                        &ldquo;WHATEVER IT TAKES&rdquo; RALLY
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                        {claimedProtocols.assemble ? 'ACTIVATED' : 'READY'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                      Avengers Assemble Battle Cry
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      Broadcast Steve Rogers&apos; legendary battle command across all sectors, rejuvenating the workforce to 100% Morale and supercharging the Arc Power grid with +350 MW.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">+350 Power &bull; 100% Morale</span>
                    <button
                      disabled={claimedProtocols.assemble}
                      onClick={handleClaimAssemble}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        claimedProtocols.assemble
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      {claimedProtocols.assemble ? 'ACTIVATED' : 'CLAIM RALLY'}
                    </button>
                  </div>
                </div>

                {/* Protocol 2: Quantum Time Heist */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        QUANTUM REALM TIME HEIST
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                        {claimedProtocols.quantumHeist ? 'DISPATCHED' : 'READY'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                      Chronal GPS Extraction
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      Utilize Tony Stark&apos;s Mobius strip equation to extract chronal particles from past timelines, granting +2 Chrono-Cores, +250 Scrap, and dropping Incursion Threat by -15%.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300 font-bold">+2 Chrono-Cores &bull; -15% Threat</span>
                    <button
                      disabled={claimedProtocols.quantumHeist}
                      onClick={handleClaimQuantumHeist}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        claimedProtocols.quantumHeist
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20'
                      }`}
                    >
                      {claimedProtocols.quantumHeist ? 'DISPATCHED' : 'LAUNCH HEIST'}
                    </button>
                  </div>
                </div>

                {/* Protocol 3: Steve Rogers Lifts Mjolnir */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-indigo-300 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        &ldquo;I KNEW IT!&rdquo; MJOLNIR LIGHTNING
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                        {claimedProtocols.mjolnir ? 'EMPOWERED' : 'READY'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                      Worthy Asgardian Shield
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      Cap catches Thor&apos;s hammer and summons storm-crackling lightning along Sakaar&apos;s perimeter walls, increasing Colony Defense by +60 permanently.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-300 font-bold">+60 Defense &bull; Lightning Ward</span>
                    <button
                      disabled={claimedProtocols.mjolnir}
                      onClick={handleClaimMjolnir}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        claimedProtocols.mjolnir
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {claimedProtocols.mjolnir ? 'EMPOWERED' : 'WIELD MJOLNIR'}
                    </button>
                  </div>
                </div>

                {/* Protocol 4: Tony Stark Nano-Gauntlet Snap */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-rose-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        &ldquo;I AM IRON MAN&rdquo; NANO-SNAP
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                        {claimedProtocols.nanoSnap ? 'EXECUTED' : 'ULTIMATE'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display uppercase mt-1">
                      Cosmic Incursion Annihilation
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      Channel the 6 Infinity Stones into the Iron Man Nano-Gauntlet. Costs 1 Chrono-Core to instantly vaporize 25% of Doomsday Incursion Threat across reality!
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-300 font-bold">Cost: 1 Core &bull; -25% Threat</span>
                    <button
                      disabled={claimedProtocols.nanoSnap}
                      onClick={handleClaimNanoSnap}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        claimedProtocols.nanoSnap
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-md shadow-rose-600/20'
                      }`}
                    >
                      {claimedProtocols.nanoSnap ? 'EXECUTED' : 'EXECUTE SNAP'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: THEATRICAL DETAILS & BONUS SCENES */}
          {activeTab === 'theatrical' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white uppercase">
                      THEATRICAL ENCORE SPECIFICATIONS &amp; BONUS FOOTAGE
                    </h3>
                    <p className="text-xs text-amber-300/80 font-mono">
                      Re-Releasing in Theaters Starting September 25, 2026 &bull; Runtime: 3h 08m (188 min) &bull; Rated PG-13
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    IMAX 3D &amp; Infinity Vision
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Dolby Cinema &amp; Atmos
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Cinemark XD
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Photosensitivity Warning: Contains Flashing Lights
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Marvel Studios is bringing back <em>Avengers: Endgame</em> to theaters worldwide for a celebratory weekend encore starting September 25, 2026. This special presentation is expanded with exclusive content bridging the Infinity Saga directly into the Multiverse Incursions and <em>Avengers: Doomsday</em>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                      FEATURE 1: RUSSO INTRO
                    </span>
                    <h4 className="text-xs font-bold text-white">Anthony Russo Intro</h4>
                    <p className="text-[11px] text-slate-400">
                      An exclusive personal welcome from director Anthony Russo celebrating the fans and the film&apos;s legacy.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                      FEATURE 2: DELETED SCENE
                    </span>
                    <h4 className="text-xs font-bold text-white">Smart Hulk Fire Rescue</h4>
                    <p className="text-[11px] text-slate-400">
                      Unfinished work-in-progress scene featuring Bruce Banner in full Smart Hulk mode rescuing victims from a fire.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                      FEATURE 3: STAN LEE TRIBUTE
                    </span>
                    <h4 className="text-xs font-bold text-white">In Memoriam Legacy Reel</h4>
                    <p className="text-[11px] text-slate-400">
                      Heartfelt behind-the-scenes montage celebrating Stan Lee&apos;s decades of Marvel cameos and visionary stories.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                      FEATURE 4: DOOMSDAY SNEAK PEEK
                    </span>
                    <h4 className="text-xs font-bold text-purple-200">Avengers: Doomsday Look</h4>
                    <p className="text-[11px] text-slate-400">
                      Exclusive first-look preview of Doctor Doom&apos;s impending incursions, with extended footage in IMAX auditoriums.
                    </p>
                  </div>
                </div>

                {/* Direct Ticket Booking Links & In-App Pass System */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-950 to-amber-950/40 border border-amber-500/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        GET TICKETS &amp; SHOWTIMES THIS WEEKEND
                      </span>
                      <p className="text-[11px] text-slate-400 font-sans">
                        Advance reserved seating is live at all major cinema chains and on Sakaar Cinema passes:
                      </p>
                    </div>

                    {onOpenTicketsPortal && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTicketsPortal();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition shadow cursor-pointer shrink-0"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>BOOK IN SAKAAR PASSES</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                    <a
                      href="https://www.fandango.com/search?q=Avengers+Endgame+Encore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-center transition flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="text-xs font-bold text-amber-300 group-hover:text-white flex items-center gap-1">
                        Fandango <ExternalLink className="w-3 h-3" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Showtimes &amp; Passes</span>
                    </a>

                    <a
                      href="https://www.amctheatres.com/movies/avengers-endgame-encore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-center transition flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1">
                        AMC Theatres <ExternalLink className="w-3 h-3" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Dolby &amp; IMAX 3D</span>
                    </a>

                    <a
                      href="https://www.cinemark.com/movies/avengers-endgame-encore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-center transition flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="text-xs font-bold text-cyan-400 group-hover:text-white flex items-center gap-1">
                        Cinemark XD <ExternalLink className="w-3 h-3" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Reserved Recliners</span>
                    </a>

                    <a
                      href="https://www.marcustheatres.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-center transition flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="text-xs font-bold text-indigo-400 group-hover:text-white flex items-center gap-1">
                        Marcus Theatres <ExternalLink className="w-3 h-3" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">UltraScreen DLX</span>
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3">
                  <div className="text-xs text-amber-200 font-mono">
                    Want to read live box-office stats, fan reactions, and showtime schedules?
                  </div>
                  <button
                    onClick={() => onOpenMCUIntel('Avengers Endgame Encore theatrical re-release box office and reviews')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <span>SEARCH LIVE INTEL</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STAN LEE & MULTIVERSE TRIBUTE */}
          {activeTab === 'tribute' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl border-2 border-white shadow-lg shrink-0">
                    ★
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
                      &ldquo;EXCELSIOR!&rdquo; &bull; IN MEMORIAM STAN LEE
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">
                      1922 – 2018 &bull; Co-creator of Iron Man, Spider-Man, Thor, Hulk, and the Marvel Universe
                    </p>
                  </div>
                </div>

                <blockquote className="p-4 rounded-xl bg-slate-950 border border-slate-800 italic text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                  &ldquo;I used to be embarrassed because I was just a comic-book writer while other people were building bridges or going on to medical careers. And then I began to realize: entertainment is one of the most important things in people&apos;s lives. Without it, they might go off the deep end. I feel that if you&apos;re able to entertain people, you&apos;re doing a good thing.&rdquo;
                  <span className="block mt-2 font-mono text-amber-400 text-xs not-italic font-bold">
                    — Stan Lee
                  </span>
                </blockquote>

                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-300 space-y-2">
                  <h4 className="font-bold text-purple-300 font-mono uppercase">
                    From Infinity War to Secret Wars
                  </h4>
                  <p>
                    <em>Avengers: Endgame</em> marked the grand culmination of 22 films and 11 years of the Marvel Cinematic Universe. Today, as Doctor Doom stitches the multiverse into Battleworld, the heroic ideals of the Original Six Avengers remain the ultimate beacon of defiance against total cosmic entropy.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Avengers: Endgame Encore &bull; Marvel Studios Limited Theatrical Release</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            DISMISS EVENT
          </button>
        </div>

      </div>
    </div>
  );
};
