import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  X, 
  Users, 
  Utensils, 
  Swords, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  Sprout, 
  Coins, 
  Wrench, 
  Search,
  ShieldAlert,
  Flame,
  ChevronRight,
  Info,
  Pencil,
  Check,
  RotateCw,
  Tag,
  Dices
} from 'lucide-react';
import { 
  HeroPairSupportData, 
  SupportRank, 
  MESS_HALL_MEALS,
  getSuggestedDuoTitles,
  generateAutomaticDuoTitle
} from '../data/fireEmblemSupports';
import { MCUHero, ColonyResources } from '../types';
import { soundFx } from '../utils/audio';
import { HeroAvatar } from './HeroAvatar';

interface FireEmblemSupportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroes: MCUHero[];
  resources: ColonyResources;
  onUpdateResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  supportPairs: HeroPairSupportData[];
  onAddSupportPoints: (pairId: string, points: number) => void;
  onOpenConversation: (pair: HeroPairSupportData, rank: 'C' | 'B' | 'A' | 'S') => void;
  onCreateNewPair: (hero1: MCUHero, hero2: MCUHero, customTitle?: string) => void;
  onUpdatePairTitle?: (pairId: string, newTitle: string) => void;
}

export const FireEmblemSupportHubModal: React.FC<FireEmblemSupportHubModalProps> = ({
  isOpen,
  onClose,
  heroes,
  resources,
  onUpdateResources,
  supportPairs,
  onAddSupportPoints,
  onOpenConversation,
  onCreateNewPair,
  onUpdatePairTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'mess_hall' | 'synergy_guide' | 'matchmaker'>('roster');

  // Search and filters for Roster
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'progress' | 's_rank'>('all');

  // Mess Hall state
  const [messHero1Id, setMessHero1Id] = useState<string>('spider_man');
  const [messHero2Id, setMessHero2Id] = useState<string>('yelena_belova');
  const [selectedMealId, setSelectedMealId] = useState<string>('hydro_stew');
  const [lastMealFeedback, setLastMealFeedback] = useState<{
    text: string;
    points: number;
    heroes: string;
  } | null>(null);
  const [showDiningCelebration, setShowDiningCelebration] = useState(false);

  // Matchmaker state with automatic and editable duo title
  const [newPairHero1Id, setNewPairHero1Id] = useState<string>('thor');
  const [newPairHero2Id, setNewPairHero2Id] = useState<string>('loki');
  const [customPairTitle, setCustomPairTitle] = useState<string>('');
  const [titleSeedIndex, setTitleSeedIndex] = useState<number>(0);

  // Inline title editing state for existing support pairs in the roster
  const [editingPairId, setEditingPairId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>('');
  const [editingSeedIndex, setEditingSeedIndex] = useState<number>(0);

  const getHero = (id: string): MCUHero | undefined => heroes.find(h => h.id === id);

  // Automatically compute and sync Duo Title whenever Matchmaker heroes or reroll seed change
  useEffect(() => {
    const h1 = getHero(newPairHero1Id);
    const h2 = getHero(newPairHero2Id);
    if (h1 && h2 && h1.id !== h2.id) {
      const autoTitle = generateAutomaticDuoTitle(h1, h2, titleSeedIndex);
      setCustomPairTitle(autoTitle);
    }
  }, [newPairHero1Id, newPairHero2Id, titleSeedIndex]);

  // Handlers for editing existing support pair titles
  const handleSaveEditedTitle = (pairId: string) => {
    const trimmed = editingTitleText.trim();
    if (!trimmed) {
      soundFx.playAlarm();
      return;
    }
    if (onUpdatePairTitle) {
      onUpdatePairTitle(pairId, trimmed);
    }
    soundFx.playSupportHeart();
    setEditingPairId(null);
    setEditingTitleText('');
  };

  const handleStartEditingTitle = (pair: HeroPairSupportData) => {
    setEditingPairId(pair.pairId);
    setEditingTitleText(pair.title);
    setEditingSeedIndex(0);
  };

  const handleCancelEditingTitle = () => {
    setEditingPairId(null);
    setEditingTitleText('');
  };

  const handleRerollEditingTitle = (h1: MCUHero, h2: MCUHero) => {
    const nextIndex = editingSeedIndex + 1;
    setEditingSeedIndex(nextIndex);
    const newTitle = generateAutomaticDuoTitle(h1, h2, nextIndex);
    setEditingTitleText(newTitle);
    soundFx.buttonClick();
  };

  if (!isOpen) return null;

  // Check if a pair has an unlocked conversation ready to view
  const getNextAvailableRank = (pair: HeroPairSupportData): 'C' | 'B' | 'A' | 'S' | null => {
    const ranks: ('C' | 'B' | 'A' | 'S')[] = ['C', 'B', 'A', 'S'];
    for (const r of ranks) {
      const tier = pair.tiers[r];
      if (pair.currentPoints >= tier.requiredPoints && !pair.viewedRanks.includes(r)) {
        return r;
      }
    }
    return null;
  };

  const countPendingConversations = supportPairs.filter(p => getNextAvailableRank(p) !== null).length;

  const handleShareMeal = () => {
    if (messHero1Id === messHero2Id) {
      soundFx.playAlarm();
      return;
    }

    const meal = MESS_HALL_MEALS.find(m => m.id === selectedMealId) || MESS_HALL_MEALS[0];

    // Check resources
    if (resources.food < meal.costFood) {
      soundFx.playAlarm();
      return;
    }
    if (resources.vibraniumCredits < meal.costCredits) {
      soundFx.playAlarm();
      return;
    }
    if (resources.scrap < meal.costScrap) {
      soundFx.playAlarm();
      return;
    }

    // Deduct resources
    onUpdateResources(prev => ({
      ...prev,
      food: Math.max(0, prev.food - meal.costFood),
      vibraniumCredits: Math.max(0, prev.vibraniumCredits - meal.costCredits),
      scrap: Math.max(0, prev.scrap - meal.costScrap),
      morale: Math.min(100, prev.morale + 5),
    }));

    soundFx.playSupportHeart();
    setShowDiningCelebration(true);
    setTimeout(() => setShowDiningCelebration(false), 2500);

    // Find or create pair
    const pairId1 = `${messHero1Id}__${messHero2Id}`;
    const pairId2 = `${messHero2Id}__${messHero1Id}`;
    const existing = supportPairs.find(p => p.pairId === pairId1 || p.pairId === pairId2);

    const h1 = getHero(messHero1Id);
    const h2 = getHero(messHero2Id);
    const heroNames = `${h1?.heroName || messHero1Id} & ${h2?.heroName || messHero2Id}`;

    if (existing) {
      onAddSupportPoints(existing.pairId, meal.supportPointsGranted);
      setLastMealFeedback({
        text: `Shared ${meal.name} amidst the Sakaar sands! Their bond deepened significantly.`,
        points: meal.supportPointsGranted,
        heroes: heroNames,
      });
    } else {
      if (h1 && h2) {
        onCreateNewPair(h1, h2);
        setTimeout(() => {
          onAddSupportPoints(pairId1, meal.supportPointsGranted);
        }, 100);
        setLastMealFeedback({
          text: `Forged a brand new Support Bond over ${meal.name}!`,
          points: meal.supportPointsGranted,
          heroes: heroNames,
        });
      }
    }
  };

  const handleCreatePairSubmit = () => {
    if (newPairHero1Id === newPairHero2Id) {
      soundFx.playAlarm();
      return;
    }
    const h1 = getHero(newPairHero1Id);
    const h2 = getHero(newPairHero2Id);
    if (!h1 || !h2) return;

    soundFx.playSupportLevelUp();
    onCreateNewPair(h1, h2, customPairTitle.trim() || undefined);
    setActiveTab('roster');
  };

  // Filter pairs
  const filteredPairs = supportPairs.filter(pair => {
    const h1 = getHero(pair.hero1Id);
    const h2 = getHero(pair.hero2Id);
    const searchTarget = `${pair.title} ${h1?.heroName || ''} ${h2?.heroName || ''} ${h1?.name || ''} ${h2?.name || ''}`.toLowerCase();
    
    if (searchQuery && !searchTarget.includes(searchQuery.toLowerCase())) {
      return false;
    }

    const nextRank = getNextAvailableRank(pair);
    if (filterStatus === 'ready') {
      return nextRank !== null;
    }
    if (filterStatus === 's_rank') {
      return pair.currentRank === 'S';
    }
    if (filterStatus === 'progress') {
      return pair.currentRank !== 'S' && nextRank === null;
    }

    return true;
  });

  const messHero1 = getHero(messHero1Id);
  const messHero2 = getHero(messHero2Id);
  const activeMessPair = supportPairs.find(
    p => (p.hero1Id === messHero1Id && p.hero2Id === messHero2Id) || (p.hero1Id === messHero2Id && p.hero2Id === messHero1Id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-slate-950 border-2 border-pink-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-pink-950/80 to-slate-900 border-b border-pink-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/40 shrink-0">
              <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-wide text-white uppercase">
                  Hero Bonds & Supports
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 font-mono font-bold text-[10px] tracking-wider uppercase">
                  Fire Emblem System
                </span>
                {countPendingConversations > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-bounce flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    {countPendingConversations} NEW CONVERSATIONS!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                Forge Support Ranks (C ➔ B ➔ A ➔ S) through colony work and mess hall dining to unlock Dual Strikes & Soulbound Crests.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 overflow-x-auto">
          <button
            onClick={() => { soundFx.buttonClick(); setActiveTab('roster'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>SUPPORT ROSTER ({supportPairs.length})</span>
            {countPendingConversations > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => { soundFx.buttonClick(); setActiveTab('mess_hall'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'mess_hall'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4 text-pink-200" />
            <span>SAKAAR MESS HALL & BANQUET</span>
          </button>

          <button
            onClick={() => { soundFx.buttonClick(); setActiveTab('synergy_guide'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'synergy_guide'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>DUAL STRIKE & GUARD GUIDE</span>
          </button>

          <button
            onClick={() => { soundFx.buttonClick(); setActiveTab('matchmaker'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'matchmaker'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>FORM NEW BOND</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: SUPPORT ROSTER & CONVERSATIONS */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              
              {/* Search and Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search support pairs by hero name or bond title..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filterStatus === 'all'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({supportPairs.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('ready')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      filterStatus === 'ready'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Ready to Talk ({countPendingConversations})
                  </button>
                  <button
                    onClick={() => setFilterStatus('progress')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filterStatus === 'progress'
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-cyan-400 hover:bg-slate-800'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilterStatus('s_rank')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filterStatus === 's_rank'
                        ? 'bg-pink-600 text-white font-bold'
                        : 'text-pink-400 hover:bg-slate-800'
                    }`}
                  >
                    S-Rank Soulbound
                  </button>
                </div>
              </div>

              {/* Grid of Support Pairs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPairs.map((pair) => {
                  const h1 = getHero(pair.hero1Id);
                  const h2 = getHero(pair.hero2Id);
                  if (!h1 || !h2) return null;

                  const nextRank = getNextAvailableRank(pair);
                  const nextTierRequired = pair.currentPoints < 30 ? 30 : (pair.currentPoints < 80 ? 80 : (pair.currentPoints < 150 ? 150 : 240));
                  const progressPct = Math.min(100, Math.round((pair.currentPoints / 240) * 100));

                  return (
                    <div 
                      key={pair.pairId}
                      className={`relative bg-slate-900/90 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                        nextRank 
                          ? 'border-amber-400 shadow-amber-500/20 ring-1 ring-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Duo Banner */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          
                          {/* Duo Portrait Link */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex items-center shrink-0 relative">
                              <HeroAvatar 
                                hero={h1} 
                                size="lg" 
                                border="border-2 border-amber-400 shadow-md ring-1 ring-amber-400/30"
                              />
                              <div className="w-6 h-6 rounded-full bg-slate-950 border border-pink-400 flex items-center justify-center -mx-2.5 z-10 shadow-lg">
                                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500 animate-pulse" />
                              </div>
                              <HeroAvatar 
                                hero={h2} 
                                size="lg" 
                                border="border-2 border-cyan-400 shadow-md ring-1 ring-cyan-400/30"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              {editingPairId === pair.pairId ? (
                                <div className="space-y-1.5 py-0.5" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={editingTitleText}
                                      onChange={(e) => setEditingTitleText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEditedTitle(pair.pairId);
                                        if (e.key === 'Escape') handleCancelEditingTitle();
                                      }}
                                      autoFocus
                                      placeholder="Custom bond title..."
                                      className="w-full bg-slate-950 border border-amber-400 text-white font-display text-xs sm:text-sm font-bold px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditedTitle(pair.pairId)}
                                      title="Save custom title (Enter)"
                                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shrink-0 cursor-pointer shadow"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditingTitle}
                                      title="Cancel (Esc)"
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition shrink-0 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleRerollEditingTitle(h1, h2)}
                                      className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30 hover:border-amber-400 transition cursor-pointer"
                                      title="Suggest another Marvel moniker"
                                    >
                                      <Dices className="w-3 h-3" />
                                      <span>Suggest Name</span>
                                    </button>
                                    <span className="text-[10px] text-slate-500 font-mono">Press Enter to save</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="group/title">
                                  <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-white font-display text-sm sm:text-base truncate" title={pair.title}>
                                      {pair.title}
                                    </h3>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditingTitle(pair)}
                                      title="Edit Duo Bond Title"
                                      className="text-slate-400 hover:text-amber-300 p-1 rounded-md hover:bg-slate-800/80 transition cursor-pointer shrink-0 opacity-80 hover:opacity-100"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-300 font-mono truncate">
                                    {h1.heroName} &amp; {h2.heroName}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-mono truncate">
                                    {h1.name} &bull; {h2.name}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Current Rank Badge */}
                          <div className="flex flex-col items-end shrink-0">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border shadow-sm ${
                              pair.currentRank === 'S'
                                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white border-pink-300 animate-pulse'
                                : pair.currentRank === 'A'
                                ? 'bg-yellow-600 text-yellow-100 border-yellow-400'
                                : pair.currentRank === 'B'
                                ? 'bg-cyan-700 text-cyan-100 border-cyan-400'
                                : pair.currentRank === 'C'
                                ? 'bg-amber-800 text-amber-200 border-amber-600'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              RANK {pair.currentRank}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {pair.currentPoints} pts
                            </span>
                          </div>
                        </div>

                        {/* Theme description */}
                        <p className="text-xs text-slate-300 font-sans mb-3 line-clamp-2">
                          {pair.theme}
                        </p>

                        {/* Support Points Progress Bar */}
                        <div className="space-y-1 mb-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400">
                            <span>Support Affinity Progress</span>
                            <span className="text-amber-300 font-bold">{pair.currentPoints} / 240 Max</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 transition-all duration-500 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5">
                            <span className={pair.currentPoints >= 30 ? 'text-amber-400 font-bold' : ''}>C (30)</span>
                            <span className={pair.currentPoints >= 80 ? 'text-cyan-400 font-bold' : ''}>B (80)</span>
                            <span className={pair.currentPoints >= 150 ? 'text-yellow-400 font-bold' : ''}>A (150)</span>
                            <span className={pair.currentPoints >= 240 ? 'text-pink-400 font-bold' : ''}>S (240)</span>
                          </div>
                        </div>

                        {/* Unlocked Perks Pill Preview */}
                        <div className="grid grid-cols-2 gap-1.5 mb-3 text-[10px] font-mono">
                          <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                            pair.viewedRanks.includes('C')
                              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}>
                            <span className="font-bold">C:</span>
                            <span className="truncate">Production +10%</span>
                          </div>

                          <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                            pair.viewedRanks.includes('B')
                              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}>
                            <span className="font-bold">B:</span>
                            <span className="truncate">Dual Strike (25%)</span>
                          </div>

                          <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                            pair.viewedRanks.includes('A')
                              ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}>
                            <span className="font-bold">A:</span>
                            <span className="truncate">Dual Guard (40%)</span>
                          </div>

                          <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                            pair.viewedRanks.includes('S')
                              ? 'bg-pink-950/40 border-pink-500/40 text-pink-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}>
                            <span className="font-bold">S:</span>
                            <span className="truncate">Soulbound Crest</span>
                          </div>
                        </div>
                      </div>

                      {/* Action / Conversation Trigger */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {nextRank ? (
                          <button
                            onClick={() => {
                              soundFx.buttonClick();
                              onOpenConversation(pair, nextRank);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black font-mono-tech text-xs shadow-lg shadow-amber-500/30 border border-amber-300/80 transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                          >
                            <MessageSquare className="w-4 h-4 text-amber-200" />
                            <span>WATCH RANK {nextRank} CONVERSATION!</span>
                          </button>
                        ) : pair.viewedRanks.length > 0 ? (
                          <div className="w-full flex items-center justify-between text-xs font-mono">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Current rank sealed</span>
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-500 mr-1">Replay:</span>
                              {pair.viewedRanks.map(r => (
                                <button
                                  key={r}
                                  onClick={() => onOpenConversation(pair, r as 'C'|'B'|'A'|'S')}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-bold border border-slate-700 cursor-pointer"
                                  title={`Replay Rank ${r} dialogue`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 font-mono italic">
                            Earn {Math.max(0, nextTierRequired - pair.currentPoints)} more pts at Mess Hall or in battles for Rank C.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredPairs.length === 0 && (
                <div className="p-8 text-center text-slate-400 font-mono bg-slate-900/50 rounded-2xl border border-slate-800">
                  No support pairs match your search or filter criteria.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MESS HALL & BANQUET TABLE */}
          {activeTab === 'mess_hall' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-950/40 via-slate-900 to-amber-950/40 border border-pink-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 text-pink-300 font-display text-lg font-bold">
                  <Utensils className="w-5 h-5 text-pink-400" />
                  <span>Sakaar Ravager Mess Hall: Share Meals to Deepen Bonds</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Just like the Fire Emblem dining hall, inviting two heroes to break bread together instantly awards Support Affinity Points, unlocks conversation scenes, and strengthens their battle chemistry!
                </p>

                {/* Visual Dining Stage */}
                <div className="relative bg-slate-950/80 border border-pink-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
                  {showDiningCelebration && (
                    <div className="absolute inset-0 bg-pink-600/20 backdrop-blur-xs flex items-center justify-center z-20 animate-fade-in pointer-events-none">
                      <div className="text-center">
                        <Heart className="w-12 h-12 text-pink-400 fill-pink-500 animate-bounce mx-auto" />
                        <span className="font-mono font-black text-amber-300 text-sm tracking-widest uppercase">
                          BOND STRENGTHENED!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Left Hero Plate */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {messHero1 && (
                      <HeroAvatar hero={messHero1} size="xl" border="border-2 border-amber-400 shadow-lg ring-2 ring-amber-400/30" />
                    )}
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                        Diner 1
                      </span>
                      <h4 className="font-bold text-white text-sm font-display">{messHero1?.heroName || 'Hero 1'}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{messHero1?.role} &bull; {messHero1?.name}</p>
                    </div>
                  </div>

                  {/* Dining Table Centerpiece */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-pink-950/80 border border-pink-400/60 flex items-center justify-center text-pink-300">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-pink-300 font-bold mt-1">
                      {MESS_HALL_MEALS.find(m => m.id === selectedMealId)?.name}
                    </span>
                    {activeMessPair && (
                      <span className="text-[9px] font-mono text-amber-400 mt-0.5">
                        Current: Rank {activeMessPair.currentRank} ({activeMessPair.currentPoints} pts)
                      </span>
                    )}
                  </div>

                  {/* Right Hero Plate */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                        Diner 2
                      </span>
                      <h4 className="font-bold text-white text-sm font-display">{messHero2?.heroName || 'Hero 2'}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{messHero2?.role} &bull; {messHero2?.name}</p>
                    </div>
                    {messHero2 && (
                      <HeroAvatar hero={messHero2} size="xl" border="border-2 border-cyan-400 shadow-lg ring-2 ring-cyan-400/30" />
                    )}
                  </div>
                </div>

                {/* Hero Pair Picker Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>SELECT FIRST HERO (LEFT)</span>
                    </label>
                    <select
                      value={messHero1Id}
                      onChange={(e) => setMessHero1Id(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:border-amber-400 outline-none cursor-pointer"
                    >
                      {heroes.map(h => (
                        <option key={h.id} value={h.id}>{h.heroName} ({h.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>SELECT SECOND HERO (RIGHT)</span>
                    </label>
                    <select
                      value={messHero2Id}
                      onChange={(e) => setMessHero2Id(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:border-cyan-400 outline-none cursor-pointer"
                    >
                      {heroes.map(h => (
                        <option key={h.id} value={h.id}>{h.heroName} ({h.name})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Meal Options */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-mono text-slate-300 font-bold">SELECT MESS HALL MENU DISH</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MESS_HALL_MEALS.map((meal) => {
                      const isSelected = selectedMealId === meal.id;
                      return (
                        <div
                          key={meal.id}
                          onClick={() => setSelectedMealId(meal.id)}
                          className={`cursor-pointer rounded-xl p-3 border transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-pink-950/70 border-pink-400 shadow-lg shadow-pink-500/20 ring-1 ring-pink-400'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-bold font-display text-white mb-1">
                              <span>{meal.name}</span>
                              <span className="text-pink-400 font-mono text-[11px] font-bold">
                                +{meal.supportPointsGranted} pts
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans mb-2">
                              {meal.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                            {meal.costFood > 0 && (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <Sprout className="w-3 h-3" /> {meal.costFood} Food
                              </span>
                            )}
                            {meal.costCredits > 0 && (
                              <span className="text-purple-400 flex items-center gap-0.5">
                                <Coins className="w-3 h-3" /> {meal.costCredits} Cr
                              </span>
                            )}
                            {meal.costScrap > 0 && (
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <Wrench className="w-3 h-3" /> {meal.costScrap} Scrap
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feed / Bond Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-400">
                    Colony Food: <span className="text-emerald-400 font-bold">{Math.round(resources.food)}</span> | 
                    Credits: <span className="text-purple-400 font-bold">{Math.round(resources.vibraniumCredits)}</span> | 
                    Scrap: <span className="text-amber-400 font-bold">{Math.round(resources.scrap)}</span>
                  </div>

                  <button
                    onClick={handleShareMeal}
                    disabled={messHero1Id === messHero2Id}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-black font-mono-tech text-xs sm:text-sm shadow-xl shadow-pink-600/25 border border-pink-300/40 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>SHARE MEAL &amp; FORGE SUPPORT BONDS</span>
                  </button>
                </div>

                {/* Feedback Banner */}
                {lastMealFeedback && (
                  <div className="p-3.5 rounded-xl bg-pink-950/80 border border-pink-400/60 text-xs font-mono text-pink-200 flex items-center gap-2 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
                    <div>
                      <span className="font-bold text-white">+{lastMealFeedback.points} Support Points added to {lastMealFeedback.heroes}!</span> {lastMealFeedback.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PAIR-UP & COMBAT SYNERGY GUIDE */}
          {activeTab === 'synergy_guide' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-300 font-display text-lg font-bold">
                  <Swords className="w-5 h-5 text-cyan-400" />
                  <span>Fire Emblem Support Mechanics in Sakaar Outpost</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The Fire Emblem Support system connects heroes through emotional bonds and battlefield synchronization. As their Support Rank ascends, they grant escalating combat perks and colony buffs:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950 border border-amber-600/50 rounded-xl p-3.5 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-amber-800 text-amber-200 font-mono font-bold text-xs border border-amber-600">
                      RANK C
                    </span>
                    <h4 className="text-xs font-bold text-white font-mono">Mutual Acclimation</h4>
                    <p className="text-[11px] text-slate-300">
                      +10% Output to adjacent colony structures. +10 HP when deployed together in Incursions and Arena Duels.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-cyan-500/50 rounded-xl p-3.5 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-700 text-cyan-100 font-mono font-bold text-xs border border-cyan-400">
                      RANK B
                    </span>
                    <h4 className="text-xs font-bold text-white font-mono">Dual Strike Protocol</h4>
                    <p className="text-[11px] text-slate-300">
                      Unlocks Fire Emblem Dual Strike: 25% chance for the partner to strike alongside, dealing +25% critical damage.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-yellow-500/50 rounded-xl p-3.5 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-yellow-600 text-yellow-100 font-mono font-bold text-xs border border-yellow-300">
                      RANK A
                    </span>
                    <h4 className="text-xs font-bold text-white font-mono">Dual Guard Shield</h4>
                    <p className="text-[11px] text-slate-300">
                      Unlocks Fire Emblem Dual Guard: 40% chance to jump in and completely deflect an incoming fatal blow in Arena or Incursions.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-pink-500/50 rounded-xl p-3.5 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-gradient-to-r from-pink-600 to-purple-600 text-white font-mono font-bold text-xs border border-pink-300 animate-pulse">
                      RANK S (SOULBOUND)
                    </span>
                    <h4 className="text-xs font-bold text-white font-mono">Soulbound Multiverse Crest</h4>
                    <p className="text-[11px] text-slate-300">
                      Permanent Duo Crest conferring +50 Colony Defense, +30% critical hit rate, and guaranteed Dual Strike triggers!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MATCHMAKER (PAIR NEW HEROES) */}
          {activeTab === 'matchmaker' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-purple-300 font-display text-lg font-bold">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <span>Form a New Support Bond Pair</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Select any two MCU heroes to forge a brand new Support Bond! Once established, you can send them to the Mess Hall together, assign them to related facilities, and unlock custom rank conversations!
                </p>

                {/* Hero Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      {getHero(newPairHero1Id) && (
                        <HeroAvatar hero={getHero(newPairHero1Id)} size="lg" border="border-2 border-purple-400 shadow-md" />
                      )}
                      <div>
                        <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">Hero 1</span>
                        <h4 className="text-sm font-bold text-white">{getHero(newPairHero1Id)?.heroName}</h4>
                        <p className="text-xs text-slate-400 font-mono">{getHero(newPairHero1Id)?.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-purple-300 font-bold">SELECT FIRST HERO</label>
                      <select
                        value={newPairHero1Id}
                        onChange={(e) => setNewPairHero1Id(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:border-purple-400 outline-none cursor-pointer"
                      >
                        {heroes.map(h => (
                          <option key={h.id} value={h.id}>{h.heroName} ({h.name})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      {getHero(newPairHero2Id) && (
                        <HeroAvatar hero={getHero(newPairHero2Id)} size="lg" border="border-2 border-pink-400 shadow-md" />
                      )}
                      <div>
                        <span className="text-[10px] font-mono text-pink-300 font-bold uppercase">Hero 2</span>
                        <h4 className="text-sm font-bold text-white">{getHero(newPairHero2Id)?.heroName}</h4>
                        <p className="text-xs text-slate-400 font-mono">{getHero(newPairHero2Id)?.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-pink-300 font-bold">SELECT SECOND HERO</label>
                      <select
                        value={newPairHero2Id}
                        onChange={(e) => setNewPairHero2Id(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:border-pink-400 outline-none cursor-pointer"
                      >
                        {heroes.map(h => (
                          <option key={h.id} value={h.id}>{h.heroName} ({h.name})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Automatic Duo Name & Editable Bond Title Section */}
                {getHero(newPairHero1Id) && getHero(newPairHero2Id) && newPairHero1Id !== newPairHero2Id && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider">
                          Duo Bond Title (Automatic &amp; Editable)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextSeed = titleSeedIndex + 1;
                          setTitleSeedIndex(nextSeed);
                          const h1 = getHero(newPairHero1Id);
                          const h2 = getHero(newPairHero2Id);
                          if (h1 && h2) {
                            setCustomPairTitle(generateAutomaticDuoTitle(h1, h2, nextSeed));
                          }
                          soundFx.buttonClick();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400 font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
                        title="Reroll another automatic title"
                      >
                        <Dices className="w-3.5 h-3.5" />
                        <span>Reroll Title</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={customPairTitle}
                        onChange={(e) => setCustomPairTitle(e.target.value)}
                        placeholder="Enter or customize bond title..."
                        className="w-full bg-slate-900 border border-amber-400/60 rounded-xl px-3 py-2 text-sm font-bold text-white font-display focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 shadow-sm"
                      />
                      <p className="text-[11px] text-slate-400 font-sans">
                        Give this hero bond a unique moniker. We automatically suggested one based on MCU canon, or you can edit it above.
                      </p>
                    </div>

                    {/* Quick-Pick Recommendation Pills */}
                    {(() => {
                      const h1 = getHero(newPairHero1Id);
                      const h2 = getHero(newPairHero2Id);
                      if (!h1 || !h2) return null;
                      const suggestions = getSuggestedDuoTitles(h1, h2);
                      return (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-400" />
                            <span>Quick Suggestions:</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestions.map((title) => (
                              <button
                                key={title}
                                type="button"
                                onClick={() => {
                                  setCustomPairTitle(title);
                                  soundFx.buttonClick();
                                }}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                                  customPairTitle === title
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/30'
                                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white'
                                }`}
                              >
                                {title}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Live Preview Header */}
                    <div className="mt-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-3">
                      <div className="flex items-center shrink-0">
                        {getHero(newPairHero1Id) && (
                          <HeroAvatar hero={getHero(newPairHero1Id)} size="sm" border="border border-purple-400" />
                        )}
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-500 -mx-1 z-10 animate-pulse" />
                        {getHero(newPairHero2Id) && (
                          <HeroAvatar hero={getHero(newPairHero2Id)} size="sm" border="border border-pink-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-mono">Bond Header Preview:</span>
                        <h5 className="text-xs font-bold text-amber-300 font-display truncate">
                          {customPairTitle || `${getHero(newPairHero1Id)?.heroName} & ${getHero(newPairHero2Id)?.heroName} Alliance`}
                        </h5>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCreatePairSubmit}
                    disabled={newPairHero1Id === newPairHero2Id}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black font-mono-tech text-xs sm:text-sm shadow-xl shadow-purple-600/25 border border-purple-300/40 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ESTABLISH NEW SUPPORT BOND</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
