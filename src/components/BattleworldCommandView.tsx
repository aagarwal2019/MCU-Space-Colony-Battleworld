import React, { useState, useMemo } from 'react';
import {
  Globe,
  Zap,
  Shield,
  Sparkles,
  Swords,
  Radio,
  Clock,
  Skull,
  Atom,
  Eye,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  WarTableNode,
  CosmicRelic,
  ActiveRelicSynergy,
  TeamUpSynergy,
  IncursionRaid,
  RelicSocketSlot,
  SocketType,
} from '../types/battleworld';
import {
  INITIAL_WAR_TABLE_NODES,
  INITIAL_COSMIC_RELICS,
  RELIC_SYNERGIES,
  TEAM_UP_SYNERGIES,
  INITIAL_INCURSION_RAIDS,
} from '../data/battleworldData';
import { MCUHero, ColonyResources, ColonyBuilding } from '../types';
import { soundFx } from '../utils/audio';

interface BattleworldCommandViewProps {
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  heroes: MCUHero[];
  buildings: ColonyBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<ColonyBuilding[]>>;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'danger' | 'crisis') => void;
  gameSpeed: number;
}

export const BattleworldCommandView: React.FC<BattleworldCommandViewProps> = ({
  resources,
  setResources,
  heroes,
  buildings,
  setBuildings,
  addLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'war_table' | 'relic_forge' | 'team_up_arena'>('war_table');

  // --- War Table State ---
  const [nodes, setNodes] = useState<WarTableNode[]>(INITIAL_WAR_TABLE_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_earth_828');
  const [activeRaid, setActiveRaid] = useState<IncursionRaid>(INITIAL_INCURSION_RAIDS[0]);
  const [raidCombatLog, setRaidCombatLog] = useState<string[]>([
    'Raid detected: Doctor Doom Latverian Sentinels approaching Sakaar outer perimeter.',
  ]);

  // --- Relic Forge State ---
  const [relics, setRelics] = useState<CosmicRelic[]>(INITIAL_COSMIC_RELICS);
  const [sockets, setSockets] = useState<RelicSocketSlot[]>([
    { type: 'power', label: 'Alpha Power Socket', equippedRelicId: 'baxter_antimatter_core', acceptedCategory: 'power' },
    { type: 'chrono', label: 'Beta Chrono Socket', equippedRelicId: 'tva_reset_charge', acceptedCategory: 'chrono' },
    { type: 'defense', label: 'Gamma Defense Socket', equippedRelicId: 'ten_rings_matrix', acceptedCategory: 'defense' },
    { type: 'dimensional', label: 'Delta Dimensional Socket', equippedRelicId: 'latverian_nanite_circuits', acceptedCategory: 'dimensional' },
  ]);
  const [overchargeUntil, setOverchargeUntil] = useState<number>(0);
  const isOvercharged = overchargeUntil > Date.now();

  // --- Team-Up Arena & Distress Beacon State ---
  const [beaconFrequency, setBeaconFrequency] = useState<'earth_828' | 'earth_10005' | 'earth_96283' | 'latveria'>('earth_828');
  const [beaconPulses, setBeaconPulses] = useState<number>(1);
  const [selectedStrikeHeroIds, setSelectedStrikeHeroIds] = useState<string[]>(['mister_fantastic', 'iron_man', 'wolverine']);
  const [lastTeamUpUsed, setLastTeamUpUsed] = useState<Record<string, number>>({});

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Active Relic Synergies
  const activeSynergies = useMemo(() => {
    const equippedIds = sockets.map((s) => s.equippedRelicId).filter(Boolean) as string[];
    return RELIC_SYNERGIES.map((syn) => {
      const isMet = syn.requiredRelicIds.every((req) => equippedIds.includes(req));
      return { ...syn, active: isMet };
    });
  }, [sockets]);

  // Active Team-Up Synergies for current strike team
  const activeTeamUps = useMemo(() => {
    return TEAM_UP_SYNERGIES.filter((teamUp) =>
      teamUp.heroIds.every((hId) => selectedStrikeHeroIds.includes(hId))
    );
  }, [selectedStrikeHeroIds]);

  // Handle Fortifying a Node
  const handleFortifyNode = (nodeId: string) => {
    if (resources.power < 75 || resources.scrap < 60) {
      addLog('Insufficient Arc Power or Scrap to fortify multiversal node.', 'warning');
      soundFx.playClick();
      return;
    }

    setResources((prev) => ({
      ...prev,
      power: prev.power - 75,
      scrap: prev.scrap - 60,
      incursionThreat: Math.max(0, prev.incursionThreat - 8),
    }));

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            barrierIntegrity: Math.min(100, n.barrierIntegrity + 25),
            stability: Math.min(100, n.stability + 15),
            status: 'fortified',
          };
        }
        return n;
      })
    );

    soundFx.playSuccess();
    addLog(`Multiversal Node [${selectedNode.name}] fortified with quantum barriers! Incursion threat reduced by 8%.`, 'success');
  };

  // Handle Assigning Hero to Node
  const handleAssignHeroToNode = (heroId: string, nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const current = n.assignedHeroIds;
          const next = current.includes(heroId)
            ? current.filter((id) => id !== heroId)
            : [...current, heroId];
          return { ...n, assignedHeroIds: next };
        }
        return n;
      })
    );
    soundFx.playClick();
  };

  // Handle Intercepting Active Raid
  const handleInterceptRaid = () => {
    if (resources.power < activeRaid.interceptCost.power || resources.scrap < activeRaid.interceptCost.scrap) {
      addLog('Insufficient resources to launch Raid Intercept Strike!', 'warning');
      soundFx.playClick();
      return;
    }

    // Calculate strike team combat power
    const teamHeroes = heroes.filter((h) => selectedStrikeHeroIds.includes(h.id));
    const totalCombat = teamHeroes.reduce((acc, h) => acc + h.stats.combat, 0) || 200;
    const damage = Math.round(totalCombat * 2.5);

    const newHp = Math.max(0, activeRaid.hp - damage);

    setResources((prev) => ({
      ...prev,
      power: prev.power - activeRaid.interceptCost.power,
      scrap: prev.scrap - activeRaid.interceptCost.scrap,
      defenseRating: prev.defenseRating + 10,
    }));

    if (newHp <= 0) {
      // Victory!
      setResources((prev) => ({
        ...prev,
        chronoCores: prev.chronoCores + activeRaid.reward.chronoCores,
        vibraniumCredits: prev.vibraniumCredits + activeRaid.reward.vibraniumCredits,
        multiverseInfluence: prev.multiverseInfluence + activeRaid.reward.multiverseInfluence,
        incursionThreat: Math.max(0, prev.incursionThreat - 25),
      }));

      addLog(`VICTORY! ${activeRaid.name} was repelled by the Multiverse Strike Team! +${activeRaid.reward.chronoCores} Chrono-Cores, +${activeRaid.reward.vibraniumCredits} Vibranium!`, 'success');
      soundFx.playSuccess();

      // Spawn next raid
      const nextRaid = INITIAL_INCURSION_RAIDS.find((r) => r.id !== activeRaid.id) || INITIAL_INCURSION_RAIDS[0];
      setActiveRaid({ ...nextRaid, hp: nextRaid.maxHp });
      setRaidCombatLog((prev) => [
        `[VICTORY] Strike Team crushed ${activeRaid.name}!`,
        `[RADAR] Next threat signature detected: ${nextRaid.name}`,
        ...prev.slice(0, 4),
      ]);
    } else {
      setActiveRaid((prev) => ({ ...prev, hp: newHp }));
      setRaidCombatLog((prev) => [
        `[STRIKE] Dealt ${damage} damage to ${activeRaid.name} (${newHp}/${activeRaid.maxHp} HP left)!`,
        ...prev.slice(0, 4),
      ]);
      soundFx.playBuild();
    }
  };

  // Handle Relic Socketing
  const handleSocketRelic = (socketType: SocketType, relicId: string) => {
    setSockets((prev) =>
      prev.map((s) => {
        if (s.type === socketType) {
          return { ...s, equippedRelicId: s.equippedRelicId === relicId ? null : relicId };
        }
        // If relic already in another socket, remove it
        if (s.equippedRelicId === relicId) {
          return { ...s, equippedRelicId: null };
        }
        return s;
      })
    );
    soundFx.playClick();
  };

  // Handle Overcharge
  const handleOverchargeMatrix = () => {
    if (resources.chronoCores < 2) {
      addLog('Requires 2 Chrono-Cores to initiate Cosmic Matrix Overcharge.', 'warning');
      soundFx.playClick();
      return;
    }

    setResources((prev) => ({
      ...prev,
      chronoCores: prev.chronoCores - 2,
      power: prev.maxPower,
      incursionThreat: Math.max(0, prev.incursionThreat - 30),
      defenseRating: prev.defenseRating + 60,
    }));

    setOverchargeUntil(Date.now() + 45000);
    soundFx.playSuccess();
    addLog('COSMIC MATRIX OVERCHARGED! Zero-Entropy shielding engaged for 45s, power grid fully restored, threat lowered by 30%!', 'success');
  };

  // Handle Unlock Relic
  const handleUnlockRelic = (relic: CosmicRelic) => {
    if (!relic.unlockCost) return;
    if (
      resources.chronoCores < relic.unlockCost.chronoCores ||
      resources.vibraniumCredits < relic.unlockCost.vibraniumCredits ||
      resources.multiverseInfluence < relic.unlockCost.multiverseInfluence
    ) {
      addLog('Insufficient resources to unlock this cosmic artifact.', 'warning');
      soundFx.playClick();
      return;
    }

    setResources((prev) => ({
      ...prev,
      chronoCores: prev.chronoCores - relic.unlockCost!.chronoCores,
      vibraniumCredits: prev.vibraniumCredits - relic.unlockCost!.vibraniumCredits,
      multiverseInfluence: prev.multiverseInfluence - relic.unlockCost!.multiverseInfluence,
    }));

    setRelics((prev) =>
      prev.map((r) => (r.id === relic.id ? { ...r, unlocked: true } : r))
    );
    soundFx.playSuccess();
    addLog(`UNLOCKED: ${relic.name}! You can now socket it into the Core Matrix.`, 'success');
  };

  // Handle Distress Beacon Pulse
  const handleBroadcastBeacon = () => {
    if (resources.vibraniumCredits < 35 || resources.power < 80) {
      addLog('Requires 35 Vibranium Credits & 80 Arc Power to tune and broadcast distress beacon.', 'warning');
      soundFx.playClick();
      return;
    }

    setResources((prev) => ({
      ...prev,
      vibraniumCredits: prev.vibraniumCredits - 35,
      power: prev.power - 80,
      multiverseInfluence: prev.multiverseInfluence + 45,
      chronoCores: prev.chronoCores + 1,
    }));

    setBeaconPulses((prev) => prev + 1);
    soundFx.playSuccess();
    addLog(`Multiverse Distress Beacon broadcast on ${beaconFrequency.toUpperCase()} frequency! Recruited tachyon resonance (+45 Influence, +1 Chrono-Core).`, 'success');
  };

  // Handle Trigger Team-Up Ultimate
  const handleTriggerTeamUp = (teamUp: TeamUpSynergy) => {
    const now = Date.now();
    const lastUsed = lastTeamUpUsed[teamUp.id] || 0;
    const cooldownMs = teamUp.ultimateCooldownSec * 1000;

    if (now - lastUsed < cooldownMs) {
      const remainingSec = Math.ceil((cooldownMs - (now - lastUsed)) / 1000);
      addLog(`Team-Up Ultimate [${teamUp.ultimateName}] is recharging (${remainingSec}s remaining).`, 'warning');
      soundFx.playClick();
      return;
    }

    setLastTeamUpUsed((prev) => ({ ...prev, [teamUp.id]: now }));

    // Apply specific ultimate effects
    if (teamUp.id === 'teamup_council_of_minds') {
      setResources((prev) => ({
        ...prev,
        power: Math.min(prev.maxPower, prev.power + 400),
        incursionThreat: Math.max(0, prev.incursionThreat - 50),
      }));
    } else if (teamUp.id === 'teamup_legacy_vanguard') {
      setBuildings((prev) => prev.map((b) => ({ ...b, health: Math.min(100, b.health + 50) })));
      setResources((prev) => ({ ...prev, defenseRating: prev.defenseRating + 75 }));
    } else if (teamUp.id === 'teamup_god_emperor_clash') {
      setResources((prev) => ({
        ...prev,
        chronoCores: prev.chronoCores + 4,
        incursionThreat: Math.max(0, prev.incursionThreat - 35),
      }));
    } else {
      setResources((prev) => ({
        ...prev,
        power: Math.min(prev.maxPower, prev.power + 250),
        scrap: Math.min(prev.maxScrap, prev.scrap + 200),
        defenseRating: prev.defenseRating + 40,
      }));
    }

    soundFx.playSuccess();
    addLog(`💥 TEAM-UP ULTIMATE ACTIVATED: [${teamUp.ultimateName}]! ${teamUp.ultimateDescription}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Mode Selector */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-purple-500/40 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono-tech font-bold uppercase tracking-wider">
                Phase 6 Battleworld Protocol
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono-tech font-bold flex items-center gap-1">
                <Atom className="w-3 h-3 text-blue-400" />
                Earth-828 Baxter Grid Online
              </span>
              {isOvercharged && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono-tech font-bold animate-pulse">
                  ⚡ MATRIX OVERCHARGED
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono-tech text-white flex items-center gap-2.5">
              <Globe className="w-6 h-6 text-purple-400 animate-spin-slow" />
              BATTLEWORLD COMMAND & RELIC FORGE
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-0.5">
              Holographic Incursion War Table, Doctor Doom's Cosmic Relic Sockets, and Multiverse Hero Team-Up Vanguard defending against Galactus and Doom incursions.
            </p>
          </div>

          {/* Sub-Tab Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveSubTab('war_table');
                soundFx.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition ${
                activeSubTab === 'war_table'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              WAR TABLE MAP
            </button>
            <button
              onClick={() => {
                setActiveSubTab('relic_forge');
                soundFx.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition ${
                activeSubTab === 'relic_forge'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              RELIC FORGE
            </button>
            <button
              onClick={() => {
                setActiveSubTab('team_up_arena');
                soundFx.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition ${
                activeSubTab === 'team_up_arena'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              TEAM-UP ARENA
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: HOLOGRAPHIC INCURSION WAR TABLE MAP            */}
      {/* ========================================================= */}
      {activeSubTab === 'war_table' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Holographic Canvas */}
          <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col relative overflow-hidden min-h-[460px]">
            {/* Holographic Grid Background & Radar Circles */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-cyan-500/20 pointer-events-none animate-pulse" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-purple-500/20 pointer-events-none" />

            {/* Radar Scan Line */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent animate-spin-slow origin-center" />
            </div>

            {/* Top Toolbar */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-bold">MULTIVERSAL TACTICAL OVERVIEW</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-400 uppercase">{nodes.length} CONVERGED WORLDS &amp; PLANETS (SAKAAR, HALA, XANDAR, EARTHS)</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Click node to lock telemetry coordinates
              </div>
            </div>

            {/* Interactive Node Canvas */}
            <div className="relative flex-1 w-full h-[360px] my-2">
              {/* Energy Conduits between center and other nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {nodes
                  .filter((n) => n.id !== 'node_sakaar')
                  .map((n) => (
                    <line
                      key={`conduit-${n.id}`}
                      x1="50%"
                      y1="50%"
                      x2={`${n.x}%`}
                      y2={`${n.y}%`}
                      stroke={n.color}
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="opacity-40 animate-pulse"
                    />
                  ))}
              </svg>

              {/* Render Node Anchors */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isSakaar = node.id === 'node_sakaar';

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      soundFx.playClick();
                    }}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group focus:outline-none ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    {/* Pulsing Aura */}
                    <div
                      className="absolute -inset-2 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition"
                      style={{ backgroundColor: node.glowColor }}
                    />

                    {/* Node Icon Orb */}
                    <div
                      className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-white font-bold text-xs shadow-lg backdrop-blur-md transition ${
                        isSelected
                          ? 'border-white ring-4 ring-purple-500/40'
                          : 'border-slate-700 hover:border-slate-300'
                      }`}
                      style={{
                        backgroundColor: isSakaar ? '#0e7490' : '#0f172a',
                        borderColor: isSelected ? '#ffffff' : node.color,
                      }}
                    >
                      {isSakaar ? (
                        <Globe className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                      ) : node.id === 'node_earth_828' ? (
                        <Atom className="w-4 h-4 text-blue-400" />
                      ) : node.id === 'node_latveria' ? (
                        <Skull className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Shield className="w-4 h-4" style={{ color: node.color }} />
                      )}
                    </div>

                    {/* Node Tooltip Label */}
                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[10px] font-mono-tech font-bold text-slate-200 pointer-events-none shadow-md">
                      {node.realityCode}
                      {node.assignedHeroIds.length > 0 && (
                        <span className="ml-1 text-cyan-400">({node.assignedHeroIds.length} 🛡️)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Incursion Interception Banner */}
            <div className="relative z-10 bg-slate-950/90 p-3 rounded-xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <Skull className="w-5 h-5 text-rose-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono-tech text-rose-300">
                      ACTIVE INCURSION RAID: {activeRaid.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 text-[9px] font-mono-tech uppercase">
                      {activeRaid.threatLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>HP: {activeRaid.hp} / {activeRaid.maxHp}</span>
                    <span>•</span>
                    <span className="text-cyan-400">Weakness: {activeRaid.vulnerability.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInterceptRaid}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-mono-tech font-bold text-xs shadow-lg shadow-rose-600/30 transition shrink-0"
              >
                <Swords className="w-4 h-4" />
                INTERCEPT RAID ({activeRaid.interceptCost.power}⚡ / {activeRaid.interceptCost.scrap}⚙️)
              </button>
            </div>
          </div>

          {/* Right Panel: Selected Node Inspector & Hero Dispatch */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {selectedNode.realityCode}
                  </span>
                  <h3 className="text-base font-bold font-mono-tech text-white mt-1">
                    {selectedNode.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded border uppercase ${
                    selectedNode.status === 'fortified'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : selectedNode.status === 'incursion_warning'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                      : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>

              <div className="text-[11px] font-mono-tech text-purple-300 bg-purple-950/30 p-2.5 rounded-xl border border-purple-500/30">
                <span className="font-bold">TACTICAL PERK:</span> {selectedNode.tacticalPerk}
              </div>

              {/* Stability & Barrier Gauges */}
              <div className="space-y-2 text-xs font-mono-tech">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>BARRIER INTEGRITY</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.barrierIntegrity}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${selectedNode.barrierIntegrity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>REALITY STABILITY</span>
                    <span className="text-purple-400 font-bold">{selectedNode.stability}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${selectedNode.stability}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Fortify Node Action */}
              <button
                onClick={() => handleFortifyNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono-tech font-bold text-xs shadow-md shadow-cyan-600/20 transition"
              >
                <Shield className="w-4 h-4" />
                FORTIFY NODE (75⚡ / 60⚙️)
              </button>

              {/* Assigned Heroes to Node */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-mono-tech text-slate-400 mb-2">
                  STATIONED DEFENDERS ({selectedNode.assignedHeroIds.length}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {heroes.map((hero) => {
                    const isStationed = selectedNode.assignedHeroIds.includes(hero.id);
                    return (
                      <button
                        key={hero.id}
                        onClick={() => handleAssignHeroToNode(hero.id, selectedNode.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-mono-tech border transition ${
                          isStationed
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{isStationed ? '🛡️' : '+'}</span>
                        <span>{hero.heroName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Combat Log Box */}
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                WAR TABLE TACTICAL LOGS
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin text-slate-300">
                {raidCombatLog.map((log, i) => (
                  <div key={i} className="text-slate-300 leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: DOCTOR DOOM COSMIC RELIC FORGE                 */}
      {/* ========================================================= */}
      {activeSubTab === 'relic_forge' && (
        <div className="space-y-4">
          {/* Sockets Matrix & Overcharge Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/40 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  COLONY CORE ARTIFACT SOCKET MATRIX
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Slot cosmic artifacts into the 4 primary conduits to channel passive multiversal buffs and activate dual-relic synergies.
                </p>
              </div>

              {/* Overcharge Button */}
              <button
                onClick={handleOverchargeMatrix}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs shadow-lg transition ${
                  isOvercharged
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <Flame className="w-4 h-4" />
                {isOvercharged ? 'OVERCHARGE ACTIVE (45s)' : 'OVERCHARGE CORE (2 Chrono-Cores)'}
              </button>
            </div>

            {/* 4 Central Sockets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sockets.map((slot) => {
                const equippedRelic = relics.find((r) => r.id === slot.equippedRelicId);

                return (
                  <div
                    key={slot.type}
                    className={`rounded-xl p-3.5 border transition-all ${
                      equippedRelic
                        ? 'bg-slate-950/80 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/40 border-dashed border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-wider">
                        {slot.label}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {slot.acceptedCategory.toUpperCase()}
                      </span>
                    </div>

                    {equippedRelic ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                            style={{ backgroundColor: equippedRelic.accentColor }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold font-mono-tech text-white truncate">
                              {equippedRelic.name}
                            </h4>
                            <span className="text-[9px] text-slate-400 truncate block">
                              {equippedRelic.subtitle}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                          {equippedRelic.passivePerk}
                        </p>

                        <button
                          onClick={() => handleSocketRelic(slot.type, equippedRelic.id)}
                          className="w-full py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-[10px] font-mono-tech font-bold transition"
                        >
                          UNSOCKET RELIC
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-500 text-xs font-mono-tech">
                        EMPTY SOCKET
                        <div className="text-[10px] text-slate-600 mt-1">
                          Click relic below to equip
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Relic Synergies Panel */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-xs font-mono-tech text-slate-400 mb-2.5 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                DISCOVERED BATTLEWORLD RELIC SYNERGIES:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeSynergies.map((syn) => (
                  <div
                    key={syn.id}
                    className={`p-3 rounded-xl border transition ${
                      syn.active
                        ? 'bg-slate-950/80 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/30 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold font-mono-tech text-xs">
                        <span className={`w-2 h-2 rounded-full ${syn.active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                        <span className={syn.active ? 'text-white' : 'text-slate-400'}>{syn.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {syn.active ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400 mb-1">
                      {syn.title}
                    </div>
                    <p className="text-[11px] leading-tight">
                      {syn.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Relic Inventory Shelf */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <h3 className="text-sm font-bold font-mono-tech text-slate-200 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              COSMIC RELIC CATALOG ({relics.length} ARTIFACTS)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {relics.map((relic) => {
                const isEquipped = sockets.some((s) => s.equippedRelicId === relic.id);

                return (
                  <div
                    key={relic.id}
                    className={`rounded-xl p-3 border transition ${
                      isEquipped
                        ? 'bg-purple-950/20 border-purple-500/50'
                        : relic.unlocked
                        ? 'bg-slate-950/60 border-slate-700/80 hover:border-slate-500'
                        : 'bg-slate-950/30 border-slate-800/60 opacity-65'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[9px] font-mono-tech font-bold uppercase px-1.5 py-0.2 rounded text-white"
                        style={{ backgroundColor: relic.accentColor }}
                      >
                        {relic.rarity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech">
                        {relic.category.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold font-mono-tech text-white">
                      {relic.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mb-2">
                      {relic.originReality}
                    </span>

                    <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                      {relic.passivePerk}
                    </p>

                    {relic.unlocked ? (
                      <button
                        onClick={() => {
                          const targetSlot = sockets.find((s) => s.acceptedCategory === relic.category) || sockets[0];
                          handleSocketRelic(targetSlot.type, relic.id);
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-mono-tech font-bold transition ${
                          isEquipped
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                        }`}
                      >
                        {isEquipped ? 'EQUIPPED IN SOCKET' : 'SOCKET ARTIFACT'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockRelic(relic)}
                        className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono-tech font-bold transition"
                      >
                        UNLOCK ({relic.unlockCost?.chronoCores} Chrono / {relic.unlockCost?.vibraniumCredits} Vib)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: MULTIVERSE DISTRESS BEACON & HERO TEAM-UPS     */}
      {/* ========================================================= */}
      {activeSubTab === 'team_up_arena' && (
        <div className="space-y-4">
          {/* Top: Distress Beacon Transmitter */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-blue-500/40 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono-tech font-bold">
                    QUANTUM TACHYON TRANSMITTER
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    PULSES BROADCAST: {beaconPulses}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
                  MULTIVERSE DISTRESS BEACON CONSOLE
                </h3>
                <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                  Broadcast quantum coordinates across branch realities to recruit Multiverse Champions and charge Team-Up strike resonances.
                </p>
              </div>

              {/* Frequency Selector & Broadcast Button */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: 'earth_828', label: 'EARTH-828 (F4)' },
                    { key: 'earth_10005', label: 'EARTH-10005 (MUTANTS)' },
                    { key: 'earth_96283', label: 'EARTH-96283 (SPIDEY)' },
                    { key: 'latveria', label: 'LATVERIA (DOOM)' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setBeaconFrequency(f.key);
                      soundFx.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition border ${
                      beaconFrequency === f.key
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <button
                  onClick={handleBroadcastBeacon}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono-tech font-bold text-xs shadow-md shadow-blue-600/30 transition ml-1"
                >
                  <Radio className="w-4 h-4" />
                  BROADCAST BEACON (35 Vib / 80⚡)
                </button>
              </div>
            </div>
          </div>

          {/* Vanguard Strike Team Builder (3 Slots) */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <h3 className="text-sm font-bold font-mono-tech text-slate-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                VANGUARD STRIKE TEAM SLOTS ({selectedStrikeHeroIds.length} / 3 HEROES SELECTED)
              </span>
              <span className="text-xs text-slate-400 font-normal">
                Click heroes to swap active roster
              </span>
            </h3>

            {/* Selected Strike Heroes Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[0, 1, 2].map((slotIdx) => {
                const heroId = selectedStrikeHeroIds[slotIdx];
                const hero = heroes.find((h) => h.id === heroId);

                return (
                  <div
                    key={slotIdx}
                    className={`rounded-xl p-3 border transition ${
                      hero
                        ? 'bg-slate-950/80 border-cyan-500/40 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/40 border-dashed border-slate-800 py-6 text-center'
                    }`}
                  >
                    {hero ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-tech text-cyan-400 font-bold">
                            SLOT {slotIdx + 1} • {hero.role.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ⚔️ {hero.stats.combat}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold font-mono-tech text-white">
                          {hero.heroName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {hero.name} ({hero.movieOrigin})
                        </span>
                        <div className="text-[10px] text-slate-300 font-mono">
                          {hero.passiveBonus}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs font-mono-tech">
                        EMPTY VANGUARD SLOT
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Hero Selector Chips */}
            <div className="text-xs font-mono-tech text-slate-400 mb-2">
              AVAILABLE HERO ROSTER (CLICK TO TOGGLE):
            </div>
            <div className="flex flex-wrap gap-2">
              {heroes.map((h) => {
                const isSelected = selectedStrikeHeroIds.includes(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedStrikeHeroIds((prev) => prev.filter((id) => id !== h.id));
                      } else if (selectedStrikeHeroIds.length < 3) {
                        setSelectedStrikeHeroIds((prev) => [...prev, h.id]);
                      } else {
                        // Replace last
                        setSelectedStrikeHeroIds((prev) => [prev[0], prev[1], h.id]);
                      }
                      soundFx.playClick();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold border transition ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{h.heroName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Team-Up Ultimates Panel */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold font-mono-tech text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-purple-400" />
                ACTIVE TEAM-UP SYNERGIES ({activeTeamUps.length} UNLOCKED BY CURRENT STRIKE TEAM)
              </span>
            </h3>

            {activeTeamUps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTeamUps.map((teamUp) => {
                  const now = Date.now();
                  const lastUsed = lastTeamUpUsed[teamUp.id] || 0;
                  const cooldownMs = teamUp.ultimateCooldownSec * 1000;
                  const isReady = now - lastUsed >= cooldownMs;
                  const remainingSec = Math.max(0, Math.ceil((cooldownMs - (now - lastUsed)) / 1000));

                  return (
                    <div
                      key={teamUp.id}
                      className="bg-slate-950/80 rounded-xl p-3.5 border border-purple-500/40 shadow-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono-tech text-purple-300">
                          {teamUp.name}
                        </span>
                        <span className="text-[10px] font-mono-tech text-slate-400">
                          {teamUp.comicReference}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 italic">
                        {teamUp.quote}
                      </div>

                      <div className="text-[11px] font-mono-tech text-emerald-400">
                        <span className="font-bold">PASSIVE:</span> {teamUp.passiveBonus}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold font-mono-tech text-white">
                            {teamUp.ultimateName}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {teamUp.ultimateDescription}
                          </div>
                        </div>

                        <button
                          onClick={() => handleTriggerTeamUp(teamUp)}
                          disabled={!isReady}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold shrink-0 transition ${
                            isReady
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/30'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isReady ? 'FIRE ULTIMATE' : `COOLDOWN (${remainingSec}s)`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 font-mono-tech text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                No active Team-Up synergies with this hero configuration.
                <div className="text-[11px] text-slate-400 mt-1">
                  Try pairing: Pedro Pascal's Mister Fantastic + Tony Stark, Wolverine + Tobey Spider-Man, Doctor Doom + Strange, or Mister Fantastic + Thor!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
