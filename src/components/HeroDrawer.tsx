import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Cpu, 
  FlaskConical, 
  Wrench, 
  Shield, 
  Zap, 
  Cog, 
  Coins, 
  Swords, 
  Sparkles, 
  PlaneTakeoff,
  Clock,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Target,
  Disc,
  Award,
  Eye,
  Crosshair,
  Search,
  Film,
  Globe,
  Skull,
  ShieldAlert,
  Crown,
  Bomb,
  Flame,
  Hourglass,
  Camera
} from 'lucide-react';
import { MCUHero, ColonyBuilding, ColonyResources } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';
import { HeroAffinityChart } from './HeroAffinityChart';
import { HeroStyleBackground } from './HeroStyleBackground';
import { HeroProfileModal } from './HeroProfileModal';
import { HeroInsignia } from './HeroInsignia';

interface HeroDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  heroes: MCUHero[];
  buildings: ColonyBuilding[];
  onTriggerAbility: (heroId: string) => void;
  onUnassignHero: (heroId: string) => void;
  onAssignHero?: (buildingId: string, heroId: string | null) => void;
  currentTime: number;
  onOpenMCUIntel?: (query: string) => void;
  onOpenPhotosApi?: (heroId?: string) => void;
  resources?: ColonyResources;
  onUpgradeHero?: (heroId: string) => void;
}

export const HeroDrawer: React.FC<HeroDrawerProps> = ({
  isOpen,
  onClose,
  heroes,
  buildings,
  onTriggerAbility,
  onUnassignHero,
  onAssignHero,
  currentTime,
  onOpenMCUIntel,
  onOpenPhotosApi,
  resources,
  onUpgradeHero,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedHeroForProfile, setSelectedHeroForProfile] = useState<MCUHero | null>(null);

  if (!isOpen) return null;

  const getRoleIcon = (icon: string) => {
    switch (icon) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4" />;
      case 'Wrench': return <Wrench className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Cog': return <Cog className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'Swords': return <Swords className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'PlaneTakeoff': return <PlaneTakeoff className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Disc': return <Disc className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Eye': return <Eye className="w-4 h-4" />;
      case 'Crosshair': return <Crosshair className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      case 'Bomb': return <Bomb className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Hourglass': return <Hourglass className="w-4 h-4" />;
      case 'Skull': return <Skull className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getAssignedBuildingName = (buildingId: string | null) => {
    if (!buildingId) return null;
    const b = buildings.find(item => item.id === buildingId);
    if (!b) return null;
    return BUILDING_DEFINITIONS[b.type]?.name || 'Colony Sector';
  };

  const filteredHeroes = heroes.filter(hero => {
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch = 
      hero.name.toLowerCase().includes(queryLower) ||
      hero.heroName.toLowerCase().includes(queryLower) ||
      hero.title.toLowerCase().includes(queryLower) ||
      hero.lore.toLowerCase().includes(queryLower) ||
      (hero.movieOrigin && hero.movieOrigin.toLowerCase().includes(queryLower)) ||
      (hero.movieAppearances && hero.movieAppearances.some(m => m.toLowerCase().includes(queryLower)));
    
    const matchesRole = selectedRole === 'all' || hero.role === selectedRole;
    const matchesType = selectedType === 'all' || hero.characterType === selectedType;

    return matchesSearch && matchesRole && matchesType;
  });

  const heroCount = heroes.filter(h => h.characterType === 'hero').length;
  const villainCount = heroes.filter(h => h.characterType === 'villain').length;
  const antiheroCount = heroes.filter(h => h.characterType === 'antihero').length;

  return (
    <div id="mcu-hero-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="mcu-hero-drawer-panel"
        className="w-full max-w-2xl h-full bg-slate-900/95 border-l border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-amber-600 to-red-600 flex items-center justify-center text-white shadow-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-wider text-slate-100 font-display">
                  MCU MOVIE CANON ROSTER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-mono-tech font-bold">
                  {heroes.length} CHARACTERS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                Canon Heroes, Movie Villains, and Antiheroes based on the Marvel Cinematic Universe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPhotosApi && (
              <button
                id="open-photos-api-header-btn"
                onClick={() => onOpenPhotosApi()}
                className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-1.5 transition shadow-sm"
                title="Open MCU Character Photos & Profile Picture REST API HUD"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">PHOTO API</span>
              </button>
            )}
            {onOpenMCUIntel && (
              <button
                id="open-live-intel-header-btn"
                onClick={() => onOpenMCUIntel('Marvel Cinematic Universe')}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-1.5 transition"
                title="Search Live MCU Movie Intel with Google Search Grounding"
              >
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">LIVE INTEL</span>
              </button>
            )}
            <button
              id="close-hero-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="hero-roster-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, film appearance, movie origin, quote, or role..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Character Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-tech border-b border-slate-800/50 pb-2">
            {[
              { id: 'all', label: `ALL (${heroes.length})` },
              { id: 'hero', label: `HEROES (${heroCount})`, color: 'text-cyan-400' },
              { id: 'villain', label: `VILLAINS (${villainCount})`, color: 'text-rose-400' },
              { id: 'antihero', label: `ANTIHEROES (${antiheroCount})`, color: 'text-amber-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedType === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.id === 'villain' && <Skull className="w-3 h-3" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-tech">
            {[
              { id: 'all', label: 'ANY ROLE' },
              { id: 'combat', label: 'COMBAT' },
              { id: 'command', label: 'COMMAND' },
              { id: 'engineering', label: 'ENGINEERING' },
              { id: 'logistics', label: 'LOGISTICS' },
              { id: 'science', label: 'SCIENCE' },
              { id: 'mystic', label: 'MYSTIC' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition ${
                  selectedRole === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredHeroes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono-tech text-xs">
              No MCU characters match your search or filter criteria.
            </div>
          ) : filteredHeroes.map((hero) => {
            const timeSinceUse = (currentTime - hero.ability.lastUsedAt) / 1000;
            const cooldownRemaining = Math.max(0, Math.ceil(hero.ability.cooldownSec - timeSinceUse));
            const isAbilityReady = cooldownRemaining === 0;
            const assignedBuildingName = getAssignedBuildingName(hero.assignedBuildingId);
            const isVillain = hero.characterType === 'villain';
            const isAntihero = hero.characterType === 'antihero';

            return (
              <div
                key={hero.id}
                id={`hero-card-${hero.id}`}
                className={`border rounded-xl p-4 transition-all shadow-md group relative overflow-hidden ${
                  isVillain 
                    ? 'bg-slate-950/90 border-rose-900/60 hover:border-rose-500/60' 
                    : isAntihero
                    ? 'bg-slate-950/85 border-amber-900/60 hover:border-amber-500/60'
                    : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                {/* Accent Top Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: hero.accentColor }} 
                />

                {/* Character-Specific Style UI Background Motif (e.g. Iron Man Arc Reactor, Raimi Spider-Man Webbing, etc.) */}
                <HeroStyleBackground heroId={hero.id} accentColor={hero.accentColor} tier={hero.tier} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Avatar & Identifiers with Real Profile Photo */}
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setSelectedHeroForProfile(hero)}
                      title={`Open ${hero.heroName} dossier & photo`}
                      className={`w-13 h-13 rounded-xl bg-gradient-to-br ${hero.avatarColor} p-0.5 shadow-md flex items-center justify-center text-white shrink-0 relative overflow-hidden group/avatar cursor-pointer hover:scale-105 active:scale-95 transition-transform text-left`}
                    >
                      {(() => {
                        const heroPhotoUrl = (hero.imageUrl && !hero.imageUrl.includes('unsplash.com'))
                          ? hero.imageUrl
                          : `/api/heroes/${hero.id}/photo?format=image`;

                        return (
                          <>
                            <img
                              src={heroPhotoUrl}
                              alt={hero.heroName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top rounded-[10px] bg-slate-900"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const sibling = (e.currentTarget.parentElement?.querySelector('.insignia-fallback') as HTMLElement);
                                if (sibling) sibling.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-full h-full bg-slate-950/90 rounded-[10px] items-center justify-center p-1.5 overflow-hidden insignia-fallback hidden"
                            >
                              <HeroInsignia heroId={hero.id} size={28} color={hero.accentColor} />
                            </div>
                          </>
                        );
                      })()}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedHeroForProfile(hero)}
                          className="text-base font-bold text-slate-100 font-display hover:text-cyan-400 transition cursor-pointer text-left"
                        >
                          {hero.heroName}
                        </button>
                        <span className="text-xs text-slate-400 font-medium">({hero.name})</span>
                        
                        {/* Character Type Badge */}
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-mono-tech font-bold border ${
                          isVillain
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                            : isAntihero
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                        }`}>
                          {hero.characterType}
                        </span>

                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono-tech border border-cyan-500/20">
                          {hero.role}
                        </span>

                        <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono-tech font-bold border ${
                          hero.tier === 2 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm' 
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {hero.tier === 2 ? 'TIER 2 APEX' : 'TIER 1 BASE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{hero.title}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    {hero.status === 'on_expedition' ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1 font-mono-tech">
                        <PlaneTakeoff className="w-3 h-3" /> ON AWAY MISSION
                      </span>
                    ) : hero.assignedBuildingId ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono-tech">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {assignedBuildingName}
                        </span>
                        <button
                          onClick={() => onUnassignHero(hero.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 underline"
                        >
                          Unassign
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1 font-mono-tech">
                        <AlertCircle className="w-3 h-3" /> IDLE / UNASSIGNED
                      </span>
                    )}
                  </div>
                </div>

                {/* Movie Canon Badges */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      <Film className="w-3 h-3 text-amber-400" />
                      <span className="font-semibold">MCU Origin:</span>
                      <span>{hero.movieOrigin}</span>
                    </div>
                    {hero.movieAppearances && hero.movieAppearances.length > 0 && (
                      <span className="text-[11px] text-slate-400 font-mono-tech">
                        Films: {hero.movieAppearances.slice(0, 3).join(', ')}{hero.movieAppearances.length > 3 ? ` +${hero.movieAppearances.length - 3} more` : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedHeroForProfile(hero)}
                      className="text-[11px] px-2 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1 transition shadow-sm font-mono-tech"
                      title="Inspect character-specific dossier, photo, emblem & stats"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Dossier & Photo</span>
                    </button>

                    {onOpenPhotosApi && (
                      <button
                        onClick={() => onOpenPhotosApi(hero.id)}
                        className="text-[11px] px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1 transition font-mono-tech"
                        title="Inspect official MCU photo API endpoint"
                      >
                        <Camera className="w-3 h-3 text-cyan-400" />
                        <span>Photo API</span>
                      </button>
                    )}
                    {onOpenMCUIntel && (
                      <button
                        onClick={() => onOpenMCUIntel(`${hero.heroName} ${hero.name} MCU movie`)}
                        className="text-[11px] px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded flex items-center gap-1 transition font-mono-tech"
                        title="Verify canon status & live movie intel with Google Search"
                      >
                        <Globe className="w-3 h-3 text-cyan-400" />
                        <span>Movie Intel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Affinity & Passive */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-cyan-400 font-semibold font-mono-tech block">STATION AFFINITY:</span>
                    <span className="text-slate-300">{hero.affinityDescription}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-amber-400 font-semibold font-mono-tech block">PASSIVE PERK:</span>
                    <span className="text-slate-300">{hero.passiveBonus}</span>
                  </div>
                </div>

                {/* Lore quote */}
                <p className="mt-2 text-xs italic text-slate-400 border-l-2 border-slate-700 pl-2">
                  "{hero.quote}"
                </p>

                {/* Deployment Diagnostic Chart: Combat Proficiency, Resource Bonus & Building Affinity */}
                <HeroAffinityChart
                  hero={hero}
                  buildings={buildings}
                  onAssignHero={onAssignHero}
                />

                {/* Multiverse Apex Ascension Status */}
                {hero.tier === 1 && onUpgradeHero && resources && hero.upgradeCost && (
                  <div className="mt-3 bg-gradient-to-r from-purple-950/40 to-slate-900/90 rounded-lg p-3 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300 font-mono-tech uppercase">
                          MULTIVERSE APEX ASCENSION
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Cost: {hero.upgradeCost.scrap} Scrap, {hero.upgradeCost.vibraniumCredits} Credits, {hero.upgradeCost.chronoCores} Chrono-Cores (+25 to all stats)
                      </p>
                    </div>

                    <button
                      onClick={() => onUpgradeHero(hero.id)}
                      disabled={
                        resources.scrap < hero.upgradeCost.scrap ||
                        resources.vibraniumCredits < hero.upgradeCost.vibraniumCredits ||
                        resources.chronoCores < hero.upgradeCost.chronoCores
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono-tech bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-slate-950 disabled:cursor-not-allowed transition flex items-center justify-center gap-1 shrink-0 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ASCEND TO APEX</span>
                    </button>
                  </div>
                )}

                {hero.tier === 2 && (
                  <div className="mt-3 bg-gradient-to-r from-amber-950/30 to-purple-950/30 rounded-lg px-3 py-1.5 border border-amber-500/40 flex items-center gap-2 text-xs font-mono-tech text-amber-300">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>MULTIVERSE APEX FORM ACTIVE (+25 STATS & EMPOWERED PROTOCOL)</span>
                  </div>
                )}

                {/* Signature Ability Action Bar */}
                <div className="mt-3 bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-slate-100 font-display">
                        {hero.ability.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {hero.ability.description}
                    </p>
                  </div>
                  <button
                    disabled={!isAbilityReady || hero.status === 'on_expedition'}
                    onClick={() => onTriggerAbility(hero.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold font-mono-tech flex items-center justify-center gap-1.5 shrink-0 transition shadow-md ${
                      isAbilityReady && hero.status !== 'on_expedition'
                        ? isVillain
                          ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-500/20'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {hero.status === 'on_expedition' ? (
                      'AWAY ON EXPEDITION'
                    ) : isAbilityReady ? (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" /> ACTIVATE PROTOCOL
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> READY IN {cooldownRemaining}s
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Character Profile Style UI Modal */}
      <HeroProfileModal
        hero={selectedHeroForProfile}
        isOpen={selectedHeroForProfile !== null}
        onClose={() => setSelectedHeroForProfile(null)}
        onTriggerAbility={onTriggerAbility}
        onOpenMCUIntel={onOpenMCUIntel}
        onOpenPhotosApi={onOpenPhotosApi}
        buildings={buildings}
      />
    </div>
  );
};
