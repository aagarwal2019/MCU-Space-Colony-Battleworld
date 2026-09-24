import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Skull, 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Radio, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  Compass,
  Cpu,
  Coins,
  Shield,
  Volume2
} from 'lucide-react';
import { ColonyResources, MCUHero } from '../types';
import { soundFx } from '../utils/audio';
import { HeroAvatar } from './HeroAvatar';

interface BattleworldConvergenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  heroes: MCUHero[];
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger' | 'crisis') => void;
  onNavigateToTab: (tab: 'battleworld' | 'doomsday' | 'multiverse') => void;
}

export const BattleworldConvergenceModal: React.FC<BattleworldConvergenceModalProps> = ({
  isOpen,
  onClose,
  resources,
  setResources,
  heroes,
  addLog,
  onNavigateToTab,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('domain_sakaar');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // The Patchwork Domains stitched together by Doctor Doom to form Battleworld
  const BATTLEWORLD_DOMAINS = [
    {
      id: 'domain_sakaar',
      name: 'The Sakaar Wastes & Grand Arena',
      origin: 'Planet Sakaar (Thor: Ragnarok)',
      baron: 'Grandmaster / Hulk Retinue',
      status: 'Current Outpost Coordinates',
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      accent: '#06b6d4',
      badge: 'GROUND ZERO',
      description: 'The cosmic garbage dump of the universe where the Sakaar Outpost resides. Surrounded by dangerous temporal wormholes, colossal trash spires, and the Contest of Champions arena.',
      tacticalLore: 'Doctor Doom dragged Sakaar from its vortex orbit to serve as Battleworld\'s primary resource salvaging hub and gladiatorial entertainment grounds.',
      actionName: 'Overcharge Sakaar Scrap Siphon',
      actionCost: { power: 60, scrap: 0 },
      actionReward: '+180 Scrap & +40 Vibranium Credits',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          power: Math.max(0, prev.power - 60),
          scrap: prev.scrap + 180,
          vibraniumCredits: prev.vibraniumCredits + 40,
        }));
        addLog('SAKAAR SIPHON ENGAGED: Salvaged 180 Scrap and 40 Vibranium Credits from incursion wormhole vortex.', 'success');
      }
    },
    {
      id: 'domain_hala',
      name: 'The Hala Kree Imperial Citadel',
      origin: 'Planet Hala (Captain Marvel / The Marvels)',
      baron: 'Dar-Benn / Kree Accuser Fleet',
      status: 'Militarized Northern Rim',
      color: 'border-sky-500 bg-sky-950/40 text-sky-300',
      accent: '#0284c7',
      badge: 'IMPERIAL THRONELAND',
      description: 'The ancestral capital world of the Kree Empire, torn out of the Large Magellanic Cloud and hammered into Battleworld\'s militarized frontier. Armed with planetary photon cannons and Kree sentries.',
      tacticalLore: 'Doctor Doom co-opted the Kree Supreme Intelligence algorithms to calculate and enforce the absolute stability of Battleworld\'s tectonic plates.',
      actionName: 'Channel Kree Military Core',
      actionCost: { power: 80, scrap: 50 },
      actionReward: '+50 Colony Defense Rating & Incursion Threat -8%',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          power: Math.max(0, prev.power - 80),
          scrap: Math.max(0, prev.scrap - 50),
          incursionThreat: Math.max(0, prev.incursionThreat - 8),
          defenseRating: prev.defenseRating + 50,
        }));
        addLog('HALA DEFENSE MATRICES SYNCHRONIZED: +50 Colony Defense Rating, Incursion Threat dropped by 8%.', 'success');
      }
    },
    {
      id: 'domain_xandar',
      name: 'The Xandar Worldmind Enclave',
      origin: 'Planet Xandar (Guardians of the Galaxy)',
      baron: 'Nova Prime / Centurion Corps',
      status: 'Refugee Shield Sector',
      color: 'border-amber-500 bg-amber-950/40 text-amber-300',
      accent: '#f59e0b',
      badge: 'NOVA WORLDMIND',
      description: 'The golden jewel of the Andromeda Galaxy, saved from annihilation by Doctor Doom\'s reality net. The surviving Nova Worldmind projects force fields across neighboring domains.',
      tacticalLore: 'Doom allows the Nova Corps to police this district under strict condition that they yield their supercomputers to manage inter-domain border transit.',
      actionName: 'Commune with Xandar Worldmind',
      actionCost: { power: 50, vibraniumCredits: 20 },
      actionReward: '+2 Chrono-Cores & +35% Research Velocity',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          power: Math.max(0, prev.power - 50),
          vibraniumCredits: Math.max(0, prev.vibraniumCredits - 20),
          chronoCores: prev.chronoCores + 2,
          morale: Math.min(100, prev.morale + 10),
        }));
        addLog('XANDAR WORLDMIND ACCORD: Extracted 2 Chrono-Cores and bolstered Outpost Morale by +10.', 'success');
      }
    },
    {
      id: 'domain_knowhere',
      name: 'The Knowhere Celestial Basin',
      origin: 'Severed Celestial Head (Cosmic Void)',
      baron: 'Cosmo the Spacedog & Collector',
      status: 'Orbital Rim Anchor',
      color: 'border-purple-500 bg-purple-950/40 text-purple-300',
      accent: '#a855f7',
      badge: 'CELESTIAL HEAD',
      description: 'The gargantuan severed head of an ancient Celestial, suspended over Battleworld\'s dimensional rift trench. Miners extract raw brain fluid that contains the primordial code of creation.',
      tacticalLore: 'Doom feeds the Celestial cerebrospinal fluid into his Forge to maintain the structural gravity of all joined planets.',
      actionName: 'Harvest Celestial Cerebrospinal Fluid',
      actionCost: { scrap: 90, power: 40 },
      actionReward: '+150 Vibranium Credits & +1 Chrono-Core',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          scrap: Math.max(0, prev.scrap - 90),
          power: Math.max(0, prev.power - 40),
          vibraniumCredits: prev.vibraniumCredits + 150,
          chronoCores: prev.chronoCores + 1,
        }));
        addLog('CELESTIAL HARVEST COMPLETED: Extracted 150 Vibranium Credits and 1 Chrono-Core.', 'success');
      }
    },
    {
      id: 'domain_earth_616_828',
      name: 'The Manhattan-Baxter Collision Megacity',
      origin: 'Earth-616 & Earth-828 (Avengers & Fantastic 4)',
      baron: 'Reed Richards / Tony Stark Alliance',
      status: 'Twin Realities Colliding',
      color: 'border-red-500 bg-red-950/40 text-red-300',
      accent: '#ef4444',
      badge: 'TWIN EARTH MERGER',
      description: 'The central human metropolis where Earth-616\'s Avengers Tower stands directly fused into the retro-futuristic art-deco Baxter Building of Earth-828.',
      tacticalLore: 'Here the Council of Reeds and Tony Stark battle secretly to uncover Doctor Doom\'s source of Beyonder omnipotence.',
      actionName: 'Deploy Avengers & F4 Strike Relay',
      actionCost: { power: 100, scrap: 100, chronoCores: 1 },
      actionReward: 'Incursion Threat -15% & +200 Arc Power Capacity',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          power: Math.max(0, prev.power - 100),
          scrap: Math.max(0, prev.scrap - 100),
          chronoCores: Math.max(0, prev.chronoCores - 1),
          incursionThreat: Math.max(0, prev.incursionThreat - 15),
          morale: Math.min(100, prev.morale + 15),
        }));
        addLog('AVENGERS & F4 STRIKE SUCCESS: Neutralized incursion shockwave, reducing Incursion Threat by 15%!', 'success');
      }
    },
    {
      id: 'domain_doomstadt',
      name: 'Doomstadt & The Throne of God Emperor Doom',
      origin: 'Earth-121698 Latveria Prime & Beyond',
      baron: 'God Emperor Doctor Victor von Doom',
      status: 'Seat of Omnipotent Governance',
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      accent: '#10b981',
      badge: 'GOD EMPEROR THRONE',
      description: 'The towering gothic spire at the exact geographic and metaphysical center of Battleworld. Channelling the cosmic power of the Beyonders and Molecule Man, Victor von Doom maintains reality through sheer willpower.',
      tacticalLore: 'Doom proclaims that he alone saved the universe from the complete nonexistence wrought by the incursions. All barons must pay tribute or face exile beyond the Shield Wall.',
      actionName: 'Intercept God Emperor Doom\'s Cipher',
      actionCost: { power: 75, vibraniumCredits: 30 },
      actionReward: '+3 Chrono-Cores & +150 Multiverse Influence',
      onExecute: () => {
        setResources(prev => ({
          ...prev,
          power: Math.max(0, prev.power - 75),
          vibraniumCredits: Math.max(0, prev.vibraniumCredits - 30),
          chronoCores: prev.chronoCores + 3,
          multiverseInfluence: prev.multiverseInfluence + 150,
        }));
        addLog('DOOM CIPHER DECODED: Siphoned 3 Chrono-Cores and 150 Multiverse Influence from God Emperor Doom\'s broadcast.', 'success');
      }
    }
  ];

  const currentDomain = BATTLEWORLD_DOMAINS.find(d => d.id === selectedDomainId) || BATTLEWORLD_DOMAINS[0];

  const handleExecuteDomainAction = () => {
    // Check costs
    if (currentDomain.actionCost.power && resources.power < currentDomain.actionCost.power) {
      soundFx.playAlarm();
      setActionFeedback(`Insufficient Arc Power! Requires ${currentDomain.actionCost.power} Power.`);
      return;
    }
    if (currentDomain.actionCost.scrap && resources.scrap < currentDomain.actionCost.scrap) {
      soundFx.playAlarm();
      setActionFeedback(`Insufficient Scrap! Requires ${currentDomain.actionCost.scrap} Scrap.`);
      return;
    }
    if (currentDomain.actionCost.vibraniumCredits && resources.vibraniumCredits < currentDomain.actionCost.vibraniumCredits) {
      soundFx.playAlarm();
      setActionFeedback(`Insufficient Vibranium Credits! Requires ${currentDomain.actionCost.vibraniumCredits} Credits.`);
      return;
    }
    if (currentDomain.actionCost.chronoCores && resources.chronoCores < currentDomain.actionCost.chronoCores) {
      soundFx.playAlarm();
      setActionFeedback(`Insufficient Chrono-Cores! Requires ${currentDomain.actionCost.chronoCores} Chrono-Cores.`);
      return;
    }

    soundFx.playSuccess();
    currentDomain.onExecute();
    setActionFeedback(`Success: ${currentDomain.actionName} executed! ${currentDomain.actionReward}`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-950/80 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-red-950 via-slate-950 to-emerald-950 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-400">
              <Globe className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-wider text-white uppercase">
                  BATTLEWORLD CONVERGENCE WAR ROOM
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] animate-pulse">
                  SECRET WARS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Doctor Doom has bound <span className="text-cyan-300 font-semibold">Sakaar</span>, <span className="text-sky-300 font-semibold">Hala</span>, <span className="text-amber-300 font-semibold">Xandar</span>, and alternate Earths into a single patchwork planet.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.buttonClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close War Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Doom's Imperial Decrees Broadcast Banner */}
        <div className="bg-slate-950/90 border-b border-emerald-500/30 px-4 py-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/60 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-500/20">
            <Skull className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                INTERCEPTED BROADCAST // DOCTOR VICTOR VON DOOM (GOD EMPEROR)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">LATVERIA PRIME TACHYON RELAY</span>
            </div>
            <p className="text-xs text-slate-200 font-sans italic mt-0.5 leading-relaxed">
              &ldquo;When the Beyonders destroyed all that was, your heroes could only watch in terror. It was DOOM who reached into the void. I grasped the shattered dust of Hala, the scrap-storms of Sakaar, the burning ruins of Xandar, and the dying fragments of your Earths. I have stitched them into BATTLEWORLD. Bow before your creator, or be cast beyond the Shield Wall!&rdquo;
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Domain Selection Ribbon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                SELECT A BATTLEWORLD CONVERGENCE DOMAIN:
              </span>
              <span className="text-amber-400">Total Worlds Absorbed: 8 Major Domains</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {BATTLEWORLD_DOMAINS.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => {
                    soundFx.buttonClick();
                    setSelectedDomainId(domain.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedDomainId === domain.id
                      ? `${domain.color} ring-2 ring-white/50 shadow-lg`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider block opacity-75">
                      {domain.badge}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">
                      {domain.name.split(' ')[1] || domain.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate mt-1">
                    {domain.origin.split(' ')[1] || domain.origin}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Domain Spotlight & Interactive Tactical Intervention */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white font-display">
                    {currentDomain.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
                    {currentDomain.origin}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Appointed Baron: <strong className="text-amber-300">{currentDomain.baron}</strong> &bull; Sector Status: {currentDomain.status}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                  {currentDomain.badge}
                </span>
              </div>
            </div>

            {/* Lore and Doom's Stitching Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  Domain Profile &amp; Planetary Remnants
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {currentDomain.description}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <Skull className="w-3 h-3 text-emerald-400" />
                  Doctor Doom's Battleworld Architecture
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {currentDomain.tacticalLore}
                </p>
              </div>
            </div>

            {/* Interactive Intervention Action Box */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white font-mono uppercase">
                    Tactical Intervention: {currentDomain.actionName}
                  </h4>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  <span>Cost: </span>
                  {currentDomain.actionCost.power && <span className="text-cyan-400 mr-2">{currentDomain.actionCost.power} Power</span>}
                  {currentDomain.actionCost.scrap && <span className="text-amber-400 mr-2">{currentDomain.actionCost.scrap} Scrap</span>}
                  {currentDomain.actionCost.vibraniumCredits && <span className="text-emerald-400 mr-2">{currentDomain.actionCost.vibraniumCredits} Credits</span>}
                  {currentDomain.actionCost.chronoCores && <span className="text-purple-400 mr-2">{currentDomain.actionCost.chronoCores} Chrono-Cores</span>}
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-300 font-bold ml-2">Reward: {currentDomain.actionReward}</span>
                </div>
              </div>

              <button
                onClick={handleExecuteDomainAction}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black font-mono-tech text-xs shadow-lg shadow-amber-500/20 border border-amber-300/40 transition cursor-pointer active:scale-95 shrink-0"
              >
                EXECUTE PROTOCOL
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs font-mono text-emerald-200 animate-fadeIn flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}
          </div>

          {/* Quick Navigation Footer Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400">
            <span>Direct War Table Command Links:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('battleworld');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
              >
                Go to Battleworld Command
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('doomsday');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
              >
                View Doomsday Clock
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('multiverse');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition cursor-pointer"
              >
                Inspect Multiverse Nexus
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
