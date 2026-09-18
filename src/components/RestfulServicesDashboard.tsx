import React, { useState, useEffect } from 'react';
import {
  Server,
  ShieldAlert,
  Swords,
  Coins,
  Cloud,
  Layers,
  Film,
  Sparkles,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Crosshair,
  Compass,
  BookOpen,
  Cpu,
  ShoppingBag,
  Database,
  Calendar,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { ColonyResources, ColonyBuilding, MCUHero } from '../types';
import { soundFx } from '../utils/audio';

interface RestfulServicesDashboardProps {
  resources: ColonyResources;
  onUpdateResources: (updater: (prev: ColonyResources) => ColonyResources) => void;
  heroes: MCUHero[];
  buildings: ColonyBuilding[];
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'incursions' | 'arena' | 'market' | 'cloud' | 'relics' | 'marvel';
}

type TabType = 'incursions' | 'arena' | 'market' | 'cloud' | 'relics' | 'marvel';

export const RestfulServicesDashboard: React.FC<RestfulServicesDashboardProps> = ({
  resources,
  onUpdateResources,
  heroes,
  buildings,
  isOpen,
  onClose,
  initialTab = 'incursions',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- Incursions State ---
  const [activeRaids, setActiveRaids] = useState<any[]>([]);
  const [telemetryNodes, setTelemetryNodes] = useState<any[]>([]);
  const [selectedRaidId, setSelectedRaidId] = useState<string>('');
  const [weaponPayload, setWeaponPayload] = useState<string>('STANDARD_PHOTON_BURST');
  const [strikeResult, setStrikeResult] = useState<any | null>(null);

  // --- Arena State ---
  const [opponents, setOpponents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [duelResult, setDuelResult] = useState<any | null>(null);

  // --- Market State ---
  const [marketRates, setMarketRates] = useState<any[]>([]);
  const [contraband, setContraband] = useState<any[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('scrap');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);

  // --- Cloud State ---
  const [cloudSlots, setCloudSlots] = useState<any[]>([]);
  const [offlineSimulationResult, setOfflineSimulationResult] = useState<any | null>(null);

  // --- Relics State ---
  const [relicCatalog, setRelicCatalog] = useState<any[]>([]);
  const [activeSynergies, setActiveSynergies] = useState<any | null>(null);
  const [craftedRelicIds, setCraftedRelicIds] = useState<string[]>([]);

  // --- Marvel Gateway State ---
  const [selectedHeroId, setSelectedHeroId] = useState<string>('iron_man');
  const [heroDossier, setHeroDossier] = useState<any | null>(null);
  const [theatricalRadar, setTheatricalRadar] = useState<any[]>([]);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Load data according to active tab
  useEffect(() => {
    if (!isOpen) return;

    if (activeTab === 'incursions') {
      fetchIncursionData();
    } else if (activeTab === 'arena') {
      fetchArenaData();
    } else if (activeTab === 'market') {
      fetchMarketData();
    } else if (activeTab === 'cloud') {
      fetchCloudSlots();
    } else if (activeTab === 'relics') {
      fetchRelicData();
    } else if (activeTab === 'marvel') {
      fetchMarvelData();
    }
  }, [activeTab, isOpen]);

  // Incursion API calls
  const fetchIncursionData = async () => {
    setLoading(true);
    try {
      const [raidsRes, telRes] = await Promise.all([
        fetch('/api/incursions/active'),
        fetch('/api/incursions/telemetry')
      ]);
      const raidsData = await raidsRes.json();
      const telData = await telRes.json();
      if (raidsData.success) {
        setActiveRaids(raidsData.raids);
        if (raidsData.raids.length > 0 && !selectedRaidId) {
          setSelectedRaidId(raidsData.raids[0].id);
        }
      }
      if (telData.success) {
        setTelemetryNodes(telData.nodes);
      }
    } catch (err) {
      console.warn('Failed to fetch incursion data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchStrike = async () => {
    if (!selectedRaidId) return;
    setLoading(true);
    soundFx.playClick();
    try {
      const assignedHeroNames = heroes
        .filter((h) => h.assignedBuildingId !== null)
        .map((h) => h.heroName);

      const res = await fetch('/api/incursions/strike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raidId: selectedRaidId,
          strikeHeroes: assignedHeroNames.slice(0, 3),
          weaponPayload,
        })
      });
      const data = await res.json();
      setStrikeResult(data);

      if (data.success) {
        soundFx.playSuccess();
        // Update local raid health
        setActiveRaids((prev) =>
          prev.map((r) => (r.id === selectedRaidId ? { ...r, hp: data.bossHpRemaining, status: data.wasDefeated ? 'DEFEATED' : r.status } : r))
        );

        if (data.rewards) {
          onUpdateResources((prev) => ({
            ...prev,
            chronoCores: prev.chronoCores + data.rewards.chronoCores,
            vibraniumCredits: prev.vibraniumCredits + data.rewards.vibraniumCredits,
            scrap: prev.scrap + data.rewards.scrap,
            incursionThreat: Math.max(0, prev.incursionThreat - data.rewards.threatReduction),
          }));
          setStatusMessage(`Raid Defeated! Earned +${data.rewards.chronoCores} Chrono-Cores, +${data.rewards.vibraniumCredits} Vibranium!`);
        } else {
          setStatusMessage(`Strike hit for ${data.damageDealt} DMG! Boss at ${data.bossHpRemaining} HP.`);
        }
      }
    } catch (err) {
      console.warn('Incursion strike error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Arena API calls
  const fetchArenaData = async () => {
    setLoading(true);
    try {
      const [oppRes, leadRes] = await Promise.all([
        fetch('/api/arena/opponents'),
        fetch('/api/arena/leaderboard')
      ]);
      const oppData = await oppRes.json();
      const leadData = await leadRes.json();
      if (oppData.success) setOpponents(oppData.opponents);
      if (leadData.success) setLeaderboard(leadData.leaderboard);
    } catch (err) {
      console.warn('Failed to fetch arena data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArenaDuel = async (opponentId: string) => {
    setLoading(true);
    soundFx.playClick();
    try {
      const assignedHeroNames = heroes
        .filter((h) => h.assignedBuildingId !== null)
        .map((h) => h.heroName);

      const res = await fetch('/api/arena/duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opponentId,
          playerHeroes: assignedHeroNames.slice(0, 3),
          playerCombatPower: Math.round(resources.defenseRating * 1.5),
        })
      });
      const data = await res.json();
      setDuelResult(data);

      if (data.success) {
        if (data.victory) {
          soundFx.playSuccess();
          onUpdateResources((prev) => ({
            ...prev,
            vibraniumCredits: prev.vibraniumCredits + data.rewardsEarned.vibranium,
            scrap: prev.scrap + data.rewardsEarned.scrap,
          }));
          setStatusMessage(`Victory in the Arena! Won +${data.rewardsEarned.trophies} Trophies & +${data.rewardsEarned.vibranium} Credits!`);
        } else {
          setStatusMessage('Defeat on the Grandmaster sands! Retune your hero affinities and defense rating.');
        }
        // Refresh leaderboard
        fetchArenaData();
      }
    } catch (err) {
      console.warn('Duel error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Market API calls
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const [ratesRes, contraRes] = await Promise.all([
        fetch('/api/market/rates'),
        fetch('/api/market/contraband-rotations')
      ]);
      const ratesData = await ratesRes.json();
      const contraData = await contraRes.json();
      if (ratesData.success) setMarketRates(ratesData.commodities);
      if (contraData.success) setContraband(contraData.rotations);
    } catch (err) {
      console.warn('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTrade = async () => {
    setLoading(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/market/transact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodityId: selectedCommodity,
          action: tradeAction,
          quantity: tradeQuantity,
          playerCredits: resources.vibraniumCredits,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || 'Trade rejected by broker.');
        return;
      }
      setLastReceipt(data);
      soundFx.playSuccess();

      // Apply resource updates
      onUpdateResources((prev) => {
        const next = { ...prev };
        if (tradeAction === 'BUY') {
          next.vibraniumCredits = Math.max(0, next.vibraniumCredits - data.netCreditsExchanged);
          if (selectedCommodity === 'scrap') next.scrap += 100 * tradeQuantity;
          if (selectedCommodity === 'food') next.food += 50 * tradeQuantity;
          if (selectedCommodity === 'chrono_core') next.chronoCores += tradeQuantity;
          if (selectedCommodity === 'multiverse_influence') next.multiverseInfluence += 25 * tradeQuantity;
        } else {
          next.vibraniumCredits += data.netCreditsExchanged;
          if (selectedCommodity === 'scrap') next.scrap = Math.max(0, next.scrap - 100 * tradeQuantity);
          if (selectedCommodity === 'food') next.food = Math.max(0, next.food - 50 * tradeQuantity);
          if (selectedCommodity === 'chrono_core') next.chronoCores = Math.max(0, next.chronoCores - tradeQuantity);
        }
        return next;
      });

      setStatusMessage(`Trade confirmed: ${data.action} ${data.commodityName} (Receipt: ${data.receiptId})`);
    } catch (err: any) {
      setStatusMessage('Trade communication error.');
    } finally {
      setLoading(false);
    }
  };

  // Cloud API calls
  const fetchCloudSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/colony/slots');
      const data = await res.json();
      if (data.success) setCloudSlots(data.slots);
    } catch (err) {
      console.warn('Failed to fetch cloud slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCloud = async (slotId: string) => {
    setLoading(true);
    soundFx.playClick();
    try {
      const payload = {
        colonyName: 'Sakaar Outpost',
        cycle: 12,
        resources,
        buildings,
        heroes,
        savedAt: Date.now(),
      };
      const res = await fetch('/api/colony/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          slotName: slotId === 'auto_cloud' ? 'Omniversal Auto-Cloud' : `Cloud Archive [${slotId}]`,
          colonyData: payload,
        })
      });
      const data = await res.json();
      if (data.success) {
        soundFx.playSuccess();
        setStatusMessage(`State successfully archived to ${data.slot.name}!`);
        fetchCloudSlots();
      }
    } catch (err) {
      console.warn('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateOffline = async (hours: number) => {
    setLoading(true);
    soundFx.playClick();
    try {
      const mockPastTime = Date.now() - (hours * 3600 * 1000);
      const res = await fetch('/api/colony/simulate-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastActiveTimestamp: mockPastTime,
          activeScrappers: 3,
          activeReactors: 2,
          currentResources: resources,
        })
      });
      const data = await res.json();
      if (data.success) {
        setOfflineSimulationResult(data);
        soundFx.playSuccess();
        onUpdateResources((prev) => ({
          ...prev,
          scrap: prev.scrap + data.offlineGains.scrap,
          power: Math.min(prev.maxPower, Math.max(0, prev.power + data.offlineGains.netPower)),
        }));
        setStatusMessage(data.summaryText);
      }
    } catch (err) {
      console.warn('Offline simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Relics API calls
  const fetchRelicData = async () => {
    setLoading(true);
    try {
      const [catRes, synRes] = await Promise.all([
        fetch('/api/relics/catalog'),
        fetch('/api/relics/synergies')
      ]);
      const catData = await catRes.json();
      const synData = await synRes.json();
      if (catData.success) {
        setRelicCatalog(catData.catalog);
        setCraftedRelicIds(catData.craftedRelicIds || []);
      }
      if (synData.success) setActiveSynergies(synData);
    } catch (err) {
      console.warn('Failed to fetch relic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgeRelic = async (relicId: string) => {
    setLoading(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/relics/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relicId,
          playerResources: resources,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || 'Forge synthesis failed.');
        return;
      }
      soundFx.playSuccess();
      setStatusMessage(data.message);

      // Deduct resource costs
      onUpdateResources((prev) => ({
        ...prev,
        chronoCores: Math.max(0, prev.chronoCores - data.relic.cost.chronoCores),
        vibraniumCredits: Math.max(0, prev.vibraniumCredits - data.relic.cost.vibraniumCredits),
        scrap: Math.max(0, prev.scrap - data.relic.cost.scrap),
      }));

      fetchRelicData();
    } catch (err) {
      console.warn('Forge error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Marvel Gateway API calls
  const fetchMarvelData = async () => {
    setLoading(true);
    try {
      const [dossRes, radRes] = await Promise.all([
        fetch(`/api/marvel-gateway/characters/${selectedHeroId}`),
        fetch('/api/marvel-gateway/release-radar')
      ]);
      const dossData = await dossRes.json();
      const radData = await radRes.json();
      if (dossData.success) setHeroDossier(dossData.dossier);
      if (radData.success) setTheatricalRadar(radData.radar);
    } catch (err) {
      console.warn('Failed to fetch Marvel Gateway data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHeroDossier = async (heroId: string) => {
    setSelectedHeroId(heroId);
    soundFx.playClick();
    setLoading(true);
    try {
      const res = await fetch(`/api/marvel-gateway/characters/${heroId}`);
      const data = await res.json();
      if (data.success) setHeroDossier(data.dossier);
    } catch (err) {
      console.warn('Hero dossier fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="restful-services-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md font-sans animate-fade-in"
    >
      <div
        id="restful-services-modal-container"
        className="w-full max-w-5xl h-[88vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
              <Server className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono-tech text-white tracking-wider flex items-center gap-1.5">
                  <span>SAKAAR RESTFUL SERVICES & TERMINAL HUB</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                  ALL 6 REST APIs ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                Live authoritative endpoints for Multiverse Raids, Contest Arena, Black Market, Cloud Sync, Relic Forge & Marvel Gateway.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'incursions') fetchIncursionData();
                if (activeTab === 'arena') fetchArenaData();
                if (activeTab === 'market') fetchMarketData();
                if (activeTab === 'cloud') fetchCloudSlots();
                if (activeTab === 'relics') fetchRelicData();
                if (activeTab === 'marvel') fetchMarvelData();
                soundFx.playClick();
              }}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
              title="Refresh API telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">REFRESH</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
              title="Close terminal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Real-time Colony Reserves HUD Ribbon */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono-tech text-slate-400 shrink-0">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">CREDITS:</span>
              <span className="text-purple-400 font-bold">{Math.round(resources.vibraniumCredits)}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">SCRAP:</span>
              <span className="text-amber-400 font-bold">{Math.round(resources.scrap)}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">CHRONO-CORES:</span>
              <span className="text-cyan-300 font-bold">{resources.chronoCores}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">DEFENSE:</span>
              <span className="text-emerald-400 font-bold">{Math.round(resources.defenseRating)}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">INCURSION RISK:</span>
              <span className={`${resources.incursionThreat > 50 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                {Math.round(resources.incursionThreat)}%
              </span>
            </span>
          </div>

          {statusMessage && (
            <div className="text-[11px] text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30 truncate max-w-sm animate-pulse">
              {statusMessage}
            </div>
          )}
        </div>

        {/* 6 RESTful API Tabs Navigation */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'incursions', label: 'INCURSIONS & RAIDS', icon: ShieldAlert, endpoint: '/api/incursions/*' },
            { id: 'arena', label: 'GRANDMASTER ARENA', icon: Swords, endpoint: '/api/arena/*' },
            { id: 'market', label: 'BLACK MARKET EXCHANGE', icon: Coins, endpoint: '/api/market/*' },
            { id: 'cloud', label: 'CLOUD VAULT & OFFLINE', icon: Cloud, endpoint: '/api/colony/*' },
            { id: 'relics', label: 'RELIC SYNTHESIS FORGE', icon: Layers, endpoint: '/api/relics/*' },
            { id: 'marvel', label: 'MARVEL CANON GATEWAY', icon: Film, endpoint: '/api/marvel-gateway/*' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  soundFx.playClick();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono-tech font-bold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border-cyan-400/60 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-500 hidden md:inline font-mono">
                  {tab.endpoint}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* TAB 1: INCURSIONS & RAIDS */}
          {activeTab === 'incursions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>Multiversal Incursion Raids (`/api/incursions/active`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Planetary-scale threats colliding with Sakaar. Launch strategic vanguard strikes to neutralize bosses and lower incursion risk.
                  </p>
                </div>
              </div>

              {/* Active Raids Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeRaids.map((raid) => {
                  const isSelected = selectedRaidId === raid.id;
                  const hpPct = Math.round((raid.hp / raid.maxHp) * 100);
                  const isDefeated = raid.status === 'DEFEATED' || raid.hp <= 0;

                  return (
                    <div
                      key={raid.id}
                      onClick={() => !isDefeated && setSelectedRaidId(raid.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20'
                          : isDefeated
                          ? 'bg-slate-950/40 border-slate-900 opacity-60'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold ${
                            raid.threatLevel === 'MULTIVERSAL_EXTINCTION'
                              ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                          }`}>
                            {raid.threatLevel.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {raid.targetContinuum}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 font-mono-tech mb-1">
                          {raid.title}
                        </h4>
                        <div className="text-xs text-cyan-300 font-mono mb-2">
                          Target: {raid.bossName}
                        </div>

                        {/* Health Bar */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Boss HP:</span>
                            <span className={hpPct < 25 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                              {raid.hp} / {raid.maxHp} ({hpPct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isDefeated
                                  ? 'bg-slate-700'
                                  : hpPct < 30
                                  ? 'bg-rose-500'
                                  : 'bg-gradient-to-r from-amber-500 to-rose-500'
                              }`}
                              style={{ width: `${hpPct}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                          <span className="text-amber-300 font-bold">Weakness:</span> {raid.weakness}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono-tech">
                        <span className="text-slate-400">REWARD:</span>
                        <span className="text-emerald-400 font-bold">
                          +{raid.rewards.chronoCores} Chrono / +{raid.rewards.vibraniumCredits} Credits
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vanguard Strike Launcher Console */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold font-mono-tech text-slate-100">
                      VANGUARD STRIKE DISPATCH (`POST /api/incursions/strike`)
                    </span>
                  </div>

                  {/* Weapon payload selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">WEAPON:</span>
                    <select
                      value={weaponPayload}
                      onChange={(e) => setWeaponPayload(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="STANDARD_PHOTON_BURST">Standard Photon Burst (1.0x)</option>
                      <option value="QUANTUM_OVERCHARGE">Quantum Overcharge (1.8x)</option>
                      <option value="ANTIMATTER_SINGULARITY">Antimatter Singularity (2.5x)</option>
                    </select>

                    <button
                      onClick={handleLaunchStrike}
                      disabled={loading || !selectedRaidId}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 text-white font-mono-tech font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5"
                    >
                      <Zap className="w-4 h-4" />
                      <span>LAUNCH STRIKE</span>
                    </button>
                  </div>
                </div>

                {/* Strike Result Feedback */}
                {strikeResult && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Damage Dealt: <strong className="text-amber-400">{strikeResult.damageDealt} DMG</strong></span>
                      {strikeResult.criticalHit && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          CRITICAL HIT!
                        </span>
                      )}
                      <span>Remaining Boss HP: <strong className="text-cyan-300">{strikeResult.bossHpRemaining}</strong></span>
                    </div>

                    {strikeResult.wasDefeated && (
                      <span className="text-emerald-400 font-bold">
                        🏆 RAID BOSS NEUTRALIZED! Threat reduced by -{strikeResult.rewards?.threatReduction}%!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Continuum Telemetry Table */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono-tech text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>8 Multiverse Continuum Telemetry Nodes (`GET /api/incursions/telemetry`)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">REALITY BARRIER NETWORK</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {telemetryNodes.map((node) => (
                    <div key={node.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-200">{node.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          node.status === 'OPTIMAL'
                            ? 'bg-emerald-950 text-emerald-300'
                            : node.status === 'DESTABILIZING'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-rose-950 text-rose-300 animate-pulse'
                        }`}>
                          {node.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Universe: {node.universeCode}</div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Barrier Integrity:</span>
                        <span className="text-cyan-300 font-bold">{node.barrierIntegrity}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 italic">
                        {node.tacticalPerk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRANDMASTER ARENA */}
          {activeTab === 'arena' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-purple-400" />
                    <span>Grandmaster Arena & Leaderboard (`/api/arena/*`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Challenge rival gladiators in simulated turn-based combat to win arena trophies, vibranium purses, and claim your place on Sakaar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gladiatorial Opponents (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold font-mono-tech text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-purple-400" />
                    <span>CHALLENGER OPPONENTS (`GET /api/arena/opponents`)</span>
                  </h4>

                  <div className="space-y-3">
                    {opponents.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-100 font-mono-tech">
                              {opp.commanderName}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[9px] font-mono-tech font-bold ${
                              opp.difficultyTier === 'GRANDMASTER_ELITE'
                                ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {opp.difficultyTier}
                            </span>
                          </div>
                          <div className="text-xs text-purple-300 font-mono">
                            Lineup: {opp.lineup.join(' • ')}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Tactics: {opp.specialTactics}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                            <span>Rating: <strong className="text-amber-400">{opp.combatRating} CP</strong></span>
                            <span>Purse: <strong className="text-purple-400">+{opp.vibraniumReward} Credits</strong></span>
                            <span>Bounty: <strong className="text-amber-300">+{opp.scrapReward} Scrap</strong></span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleArenaDuel(opp.id)}
                          disabled={loading}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-mono-tech font-bold text-xs shadow-lg shadow-purple-600/30 transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>DUEL SQUAD</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Duel Result Feed */}
                  {duelResult && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-3 font-mono">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <Trophy className={`w-4 h-4 ${duelResult.victory ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span>Match Outcome: {duelResult.victory ? 'VICTORY!' : 'DEFEAT'} vs {duelResult.opponent}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${duelResult.victory ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                          {duelResult.victory ? `+${duelResult.rewardsEarned.trophies} TROPHIES` : '-10 TROPHIES'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        {duelResult.combatRounds.map((rnd: any) => (
                          <div key={rnd.roundNumber} className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                            <span>{rnd.action}</span>
                            <span className="text-amber-400 font-bold shrink-0 ml-2">-{rnd.playerDamage} HP / -{rnd.oppDamage} HP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contest Leaderboard (1 col) */}
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono-tech text-slate-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>GLOBAL LEADERBOARD (`/api/arena/leaderboard`)</span>
                    </h4>
                    <span className="text-[10px] text-amber-400 font-mono">TOP 6</span>
                  </div>

                  <div className="space-y-2.5">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                          entry.commanderName.includes('You')
                            ? 'bg-cyan-950/40 border-cyan-500/50'
                            : 'bg-slate-950 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center font-bold text-slate-400">
                            #{entry.rank}
                          </span>
                          <span className="text-base">{entry.avatarIcon}</span>
                          <div>
                            <div className="font-bold text-slate-200 leading-tight">
                              {entry.commanderName}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              MVP: {entry.mvpHero}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-amber-400 font-bold">{entry.trophies} 🏆</div>
                          <div className="text-[10px] text-slate-500">Cycle {entry.survivalCycles}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BLACK MARKET EXCHANGE */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span>Black Market Commodities & Contraband (`/api/market/*`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live fluctuating exchange rates with Grandmaster broker taxes, commodity trading, and limited-stock contraband.
                  </p>
                </div>
              </div>

              {/* Dynamic Rates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {marketRates.map((rate) => (
                  <div
                    key={rate.id}
                    onClick={() => setSelectedCommodity(rate.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      selectedCommodity === rate.id
                        ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200 font-mono-tech">
                          {rate.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold flex items-center gap-0.5 ${
                          rate.priceTrend === 'SURGING'
                            ? 'bg-emerald-950 text-emerald-300'
                            : rate.priceTrend === 'FALLING'
                            ? 'bg-rose-950 text-rose-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {rate.priceTrend === 'SURGING' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {rate.priceTrend} ({rate.trendPercentage > 0 ? `+${rate.trendPercentage}%` : `${rate.trendPercentage}%`})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mb-2">Unit: {rate.unit}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">BUY PRICE</span>
                        <span className="text-purple-300 font-bold">{rate.buyPriceCredits} Units</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 text-[10px] block">SELL PRICE</span>
                        <span className="text-amber-400 font-bold">{rate.sellPriceCredits} Units</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Execution Bar */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">ACTION:</span>
                    <div className="flex rounded-lg overflow-hidden border border-slate-700">
                      <button
                        onClick={() => setTradeAction('BUY')}
                        className={`px-3 py-1 text-xs font-bold ${tradeAction === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}
                      >
                        BUY COMMODITY
                      </button>
                      <button
                        onClick={() => setTradeAction('SELL')}
                        className={`px-3 py-1 text-xs font-bold ${tradeAction === 'SELL' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400'}`}
                      >
                        SELL COMMODITY
                      </button>
                    </div>

                    <span className="text-xs text-slate-400 ml-2">QTY:</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-slate-950 border border-slate-700 text-center text-xs text-cyan-300 py-1 rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleExecuteTrade}
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:opacity-40 text-slate-950 font-mono-tech font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <Coins className="w-4 h-4" />
                    <span>EXECUTE TRANSACTION (`POST /api/market/transact`)</span>
                  </button>
                </div>

                {lastReceipt && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 text-xs flex items-center justify-between text-slate-300">
                    <span>Receipt: <strong className="text-amber-300">{lastReceipt.receiptId}</strong> ({lastReceipt.action} {lastReceipt.quantity}x {lastReceipt.commodityName})</span>
                    <span>Fee (5%): <strong className="text-slate-400">{lastReceipt.brokerTax} Units</strong> | Total: <strong className="text-purple-300">{lastReceipt.netCreditsExchanged} Units</strong></span>
                  </div>
                )}
              </div>

              {/* Contraband Vault */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono-tech text-slate-200 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>CONTRABAND VAULT ROTATIONS (`GET /api/market/contraband-rotations`)</span>
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono">RAVAGER SMUGGLER STASH</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {contraband.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 font-mono-tech">{item.name}</span>
                          <span className="text-purple-400 font-mono font-bold">{item.costCredits} C</span>
                        </div>
                        <p className="text-[11px] text-cyan-300 font-mono">{item.effectDescription}</p>
                        <p className="text-[10px] text-slate-500 italic">{item.flavorText}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Stock: {item.stock}</span>
                        <span className="text-slate-500">{item.tier.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUD VAULT & OFFLINE SIMULATION */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-cyan-400" />
                    <span>Cloud State Synchronization & Offline Simulator (`/api/colony/*`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Authoritative server-side colony archiving, cloud slots, and offline scrap scavenging calculations.
                  </p>
                </div>
              </div>

              {/* Cloud Slots */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['auto_cloud', 'slot_alpha', 'slot_beta'].map((slotId) => {
                  const existingSlot = cloudSlots.find((s) => s.slotId === slotId);

                  return (
                    <div
                      key={slotId}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-200 font-mono-tech">
                            {existingSlot ? existingSlot.name : `Cloud Slot ${slotId.toUpperCase()}`}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono">
                            {existingSlot ? 'SYNCED' : 'READY'}
                          </span>
                        </div>

                        {existingSlot ? (
                          <div className="text-xs font-mono text-slate-400 space-y-1">
                            <div>Last Sync: {new Date(existingSlot.updatedAt).toLocaleTimeString()}</div>
                            <div>Cycle: {existingSlot.cycle} | Pop: {existingSlot.population}</div>
                            <div>Defense: {existingSlot.defenseRating} | Incursion: {existingSlot.incursionThreat}%</div>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-slate-500 italic">
                            Empty cloud save slot. Ready to archive colony snapshot.
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleSaveToCloud(slotId)}
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>ARCHIVE TO CLOUD (`POST /api/colony/save`)</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Offline Progression Simulator Tester */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono-tech text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>SIMULATE OFFLINE ACCRUAL (`POST /api/colony/simulate-offline`)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">TEST ACCRUAL YIELDS</span>
                </div>

                <p className="text-xs text-slate-400">
                  Select a test absence duration to verify passive scrap harvesting, arc power drain, and rare salvage drops:
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {[0.5, 2, 8, 24].map((hrs) => (
                    <button
                      key={hrs}
                      onClick={() => handleSimulateOffline(hrs)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold transition"
                    >
                      Simulate {hrs} {hrs === 1 ? 'Hour' : 'Hours'} Away
                    </button>
                  ))}
                </div>

                {offlineSimulationResult && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs space-y-1 text-slate-300">
                    <div className="font-bold text-emerald-400">{offlineSimulationResult.summaryText}</div>
                    <div className="text-[11px] text-slate-400">
                      Elapsed Time: {offlineSimulationResult.elapsedFormatted} | Net Power: {offlineSimulationResult.offlineGains.netPower} MW
                      {offlineSimulationResult.offlineGains.rareSalvage && (
                        <span className="ml-2 text-amber-300 font-bold">
                          ★ Salvaged: {offlineSimulationResult.offlineGains.rareSalvage}!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: RELIC SYNTHESIS FORGE */}
          {activeTab === 'relics' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>Doctor Doom's Cosmic Relic Synthesizer (`/api/relics/*`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Combine multiversal shards into legendary artifacts to unlock compound defense, chronal slowing, and combat multipliers.
                  </p>
                </div>
              </div>

              {/* Active Synergies HUD */}
              {activeSynergies && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>{activeSynergies.bonuses.synergyTitle}</span>
                    </span>
                    <span className="text-slate-400">{activeSynergies.activeCount} Artifacts Socketed</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">DEFENSE BONUS</span>
                      <span className="text-emerald-400 font-bold">+{activeSynergies.bonuses.defenseRatingBonus} Rating</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">ARC POWER</span>
                      <span className="text-cyan-300 font-bold">+{activeSynergies.bonuses.maxPowerBonus} MW</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">DOOMSDAY SLOW</span>
                      <span className="text-purple-300 font-bold">+{activeSynergies.bonuses.doomsdayClockSlowPct}%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">STRIKE MULTIPLIER</span>
                      <span className="text-amber-400 font-bold">{activeSynergies.bonuses.combatStrikeMultiplier}x DMG</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Relic Catalog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relicCatalog.map((relic) => {
                  const isCrafted = craftedRelicIds.includes(relic.id);

                  return (
                    <div
                      key={relic.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        isCrafted
                          ? 'bg-slate-900 border-indigo-500/40 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-100 font-mono-tech">
                            {relic.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[9px] font-mono font-bold">
                            {relic.socketType.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="text-[11px] text-indigo-300 font-mono mb-2">
                          Origin: {relic.originRealm}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-2 font-mono">
                          {relic.buffDescription}
                        </p>

                        <p className="text-[10px] text-slate-500 italic">
                          "{relic.lore}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-slate-400">
                          Cost: <span className="text-purple-300">{relic.cost.chronoCores} Chrono</span> / <span className="text-amber-400">{relic.cost.scrap} Scrap</span>
                        </div>

                        <button
                          onClick={() => handleForgeRelic(relic.id)}
                          disabled={loading || isCrafted}
                          className={`px-3 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition ${
                            isCrafted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isCrafted ? 'SYNTHESIZED ✓' : 'FORGE RELIC'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: MARVEL CANON GATEWAY & THEATRICAL RADAR */}
          {activeTab === 'marvel' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-mono-tech text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-rose-400" />
                    <span>Marvel Comic Canon Dossiers & Theatrical Release Radar (`/api/marvel-gateway/*`)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official comic book debuts, official 1-7 Marvel power grids, and real-world Phase 6 theatrical release countdowns.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hero Dossier Section (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {[
                      { id: 'iron_man', label: 'Iron Man' },
                      { id: 'doctor_doom', label: 'Doctor Doom' },
                      { id: 'mister_fantastic', label: 'Mister Fantastic' },
                      { id: 'wolverine', label: 'Wolverine' },
                      { id: 'spider_man', label: 'Spider-Man' },
                    ].map((h) => (
                      <button
                        key={h.id}
                        onClick={() => handleSelectHeroDossier(h.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold transition whitespace-nowrap border ${
                          selectedHeroId === h.id
                            ? 'bg-rose-950 text-rose-300 border-rose-500/60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>

                  {heroDossier && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 font-mono">
                      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white font-mono-tech">
                            {heroDossier.name}
                          </h4>
                          <div className="text-xs text-rose-400">
                            {heroDossier.alias}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {heroDossier.multiverseAffiliation}
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400">
                          <div>Debut: <strong className="text-slate-200">{heroDossier.firstAppearance.comicTitle} {heroDossier.firstAppearance.issueNumber} ({heroDossier.firstAppearance.publicationYear})</strong></div>
                          <div className="text-[10px] text-slate-500">Creators: {heroDossier.firstAppearance.creators.join(', ')}</div>
                        </div>
                      </div>

                      {/* Official 1-7 Marvel Power Grid */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 font-mono-tech block">
                          OFFICIAL MARVEL POWER GRID (1-7 SCALE)
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                          {Object.entries(heroDossier.officialPowerGrid).map(([stat, val]: [string, any]) => (
                            <div key={stat} className="p-2 rounded bg-slate-950 border border-slate-800">
                              <div className="flex justify-between text-slate-400 capitalize mb-1">
                                <span>{stat.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-rose-400 font-bold">{val} / 7</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                                  style={{ width: `${(val / 7) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {heroDossier.canonicalBio}
                      </p>

                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span className="text-amber-400 font-bold">Key Comic Arcs:</span> {heroDossier.keyComicCrossovers.join(' • ')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Theatrical Release Radar (1 col) */}
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono-tech text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <span>THEATRICAL RADAR (`GET /api/marvel-gateway/release-radar`)</span>
                    </h4>
                  </div>

                  <div className="space-y-3 font-mono">
                    {theatricalRadar.map((film) => (
                      <div key={film.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 font-mono-tech">{film.title}</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[10px] font-bold">
                            {film.daysRemaining} DAYS
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400">Target Date: {film.projectedReleaseDate}</div>
                        <div className="text-[10px] text-slate-500">Directors: {film.confirmedDirectors.join(', ')}</div>
                        <p className="text-[11px] text-slate-300 leading-tight">{film.synopsis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
