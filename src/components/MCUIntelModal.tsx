import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Film, 
  Tv, 
  Sparkles, 
  ExternalLink, 
  X, 
  AlertCircle, 
  Shield, 
  Award, 
  Terminal, 
  BookOpen, 
  Layers, 
  Code, 
  User, 
  Clapperboard, 
  Calendar, 
  DollarSign, 
  Clock, 
  Radio, 
  Flame, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MCUSearchIntelResponse } from '../types';

interface MCUIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export interface HotCanonItem {
  id: string;
  title: string;
  query: string;
  type: 'movie' | 'show';
  year: string;
  phaseOrPlatform: string;
  tag: string;
  description: string;
}

export const RECENT_MCU_HOT_CANON: HotCanonItem[] = [
  // Recent & Upcoming MCU Theatrical Movies (Phases 5 & 6)
  {
    id: 'spiderman-brand-new-day',
    title: 'Spider-Man: Brand New Day',
    query: 'Spider-Man: Brand New Day',
    type: 'movie',
    year: '2026',
    phaseOrPlatform: 'Phase 6',
    tag: 'Next Saga',
    description: 'Directed by Destin Daniel Cretton, charting Peter Parker after the No Way Home memory wipe.'
  },
  {
    id: 'fantastic-four-first-steps',
    title: 'The Fantastic Four: First Steps',
    query: 'The Fantastic Four: First Steps',
    type: 'movie',
    year: '2025',
    phaseOrPlatform: 'Phase 6',
    tag: 'First Family',
    description: '1960s retro-futuristic alternate universe introduction of Reed Richards, Sue Storm, and Galactus.'
  },
  {
    id: 'thunderbolts-star',
    title: 'Thunderbolts*',
    query: 'Thunderbolts*',
    type: 'movie',
    year: '2025',
    phaseOrPlatform: 'Phase 5',
    tag: 'Black Ops',
    description: 'Yelena Belova, Bucky Barnes, Red Guardian, Ghost, and John Walker forced into covert alliance.'
  },
  {
    id: 'captain-america-brave-new-world',
    title: 'Captain America: Brave New World',
    query: 'Captain America: Brave New World',
    type: 'movie',
    year: '2025',
    phaseOrPlatform: 'Phase 5',
    tag: 'Adamantium',
    description: 'Sam Wilson as Captain America unraveling international conspiracy with President Ross / Red Hulk.'
  },
  {
    id: 'deadpool-and-wolverine',
    title: 'Deadpool & Wolverine',
    query: 'Deadpool & Wolverine',
    type: 'movie',
    year: '2024',
    phaseOrPlatform: 'Phase 5',
    tag: 'Multiverse Void',
    description: 'Wade Wilson and Logan traverse the TVA Void wasteland battling Cassandra Nova.'
  },
  {
    id: 'fantastic-four-first-steps',
    title: 'The Fantastic Four: First Steps',
    query: 'The Fantastic Four: First Steps',
    type: 'movie',
    year: '2025',
    phaseOrPlatform: 'Phase 6 (Earth-828)',
    tag: 'First Steps & Doomsday',
    description: 'Marvel\'s First Family in retro-futuristic 1960s Earth-828 defending their world from Galactus before Doomsday.'
  },
  {
    id: 'avengers-doomsday',
    title: 'Avengers: Doomsday',
    query: 'Avengers: Doomsday',
    type: 'movie',
    year: '2026',
    phaseOrPlatform: 'Phase 6',
    tag: 'Doctor Doom',
    description: 'The Russo Brothers direct Earth\'s mightiest heroes against Victor von Doom multiversal convergence.'
  },
  {
    id: 'avengers-secret-wars',
    title: 'Avengers: Secret Wars',
    query: 'Avengers: Secret Wars',
    type: 'movie',
    year: '2027',
    phaseOrPlatform: 'Phase 6 Climax',
    tag: 'Battleworld',
    description: 'The grand finale of the Multiverse Saga where alternate realities collide on Battleworld.'
  },
  {
    id: 'the-marvels',
    title: 'The Marvels',
    query: 'The Marvels',
    type: 'movie',
    year: '2023',
    phaseOrPlatform: 'Phase 5',
    tag: 'Cosmic Triad',
    description: 'Carol Danvers, Monica Rambeau, and Kamala Khan swapping places across light-based quantum entanglement.'
  },
  {
    id: 'guardians-of-the-galaxy-vol-3',
    title: 'Guardians of the Galaxy Vol. 3',
    query: 'Guardians of the Galaxy Vol. 3',
    type: 'movie',
    year: '2023',
    phaseOrPlatform: 'Phase 5',
    tag: 'Trilogy Climax',
    description: 'The High Evolutionary confrontation on Counter-Earth and the tragic origin of Rocket Raccoon.'
  },

  // Recent & Upcoming Marvel Television Series (Disney+ / Marvel Animation / Marvel Spotlight)
  {
    id: 'daredevil-born-again',
    title: 'Daredevil: Born Again',
    query: 'Daredevil: Born Again',
    type: 'show',
    year: '2025',
    phaseOrPlatform: 'Disney+',
    tag: 'Hell\'s Kitchen',
    description: 'Charlie Cox returns as Matt Murdock facing Mayor Wilson Fisk in a gritty NYC political war.'
  },
  {
    id: 'agatha-all-along',
    title: 'Agatha All Along',
    query: 'Agatha All Along',
    type: 'show',
    year: '2024',
    phaseOrPlatform: 'Disney+',
    tag: 'Witches Road',
    description: 'Kathryn Hahn and Joe Locke traverse the perilous trials of the Witches Road.'
  },
  {
    id: 'ironheart',
    title: 'Ironheart',
    query: 'Ironheart',
    type: 'show',
    year: '2025',
    phaseOrPlatform: 'Disney+',
    tag: 'Tech vs Magic',
    description: 'Dominique Thorne as Riri Williams engineering armor in a clash between modern science and dark magic.'
  },
  {
    id: 'echo',
    title: 'Echo',
    query: 'Echo',
    type: 'show',
    year: '2024',
    phaseOrPlatform: 'Marvel Spotlight',
    tag: 'Choctaw Hero',
    description: 'Maya Lopez returns to Oklahoma after Hawkeye to reconcile with her ancestral Choctaw gifts.'
  },
  {
    id: 'loki-season-two',
    title: 'Loki Season 2',
    query: 'Loki Season Two',
    type: 'show',
    year: '2023',
    phaseOrPlatform: 'Disney+',
    tag: 'Temporal God',
    description: 'Loki navigates timeslipping, O.B., and the failing Temporal Loom to rebirth the multiverse as Yggdrasil.'
  },
  {
    id: 'eyes-of-wakanda',
    title: 'Eyes of Wakanda',
    query: 'Eyes of Wakanda',
    type: 'show',
    year: '2025',
    phaseOrPlatform: 'Marvel Animation',
    tag: 'Vibranium Lore',
    description: 'Chronicles the covert Hatut Zeraze warriors tasked with recovering vibranium artifacts across centuries.'
  },
  {
    id: 'your-friendly-neighborhood-spider-man',
    title: 'Your Friendly Neighborhood Spider-Man',
    query: 'Your Friendly Neighborhood Spider-Man TV series',
    type: 'show',
    year: '2025',
    phaseOrPlatform: 'Marvel Animation',
    tag: 'Alternate Origin',
    description: 'Early high-school years of Peter Parker in an alternate timeline where Norman Osborn becomes his mentor.'
  },
  {
    id: 'secret-invasion',
    title: 'Secret Invasion',
    query: 'Secret Invasion',
    type: 'show',
    year: '2023',
    phaseOrPlatform: 'Disney+',
    tag: 'Skrull Coup',
    description: 'Nick Fury returns from S.A.B.E.R. to prevent a rogue faction of shapeshifting Skrulls from claiming Earth.'
  },
  {
    id: 'what-if-season-three',
    title: 'What If...? Season 3',
    query: 'What If...?',
    type: 'show',
    year: '2024',
    phaseOrPlatform: 'Marvel Animation',
    tag: 'Multiverse Finale',
    description: 'The final animated chapter exploring unprecedented alternate realities guided by Uatu the Watcher.'
  }
];

export const MCUIntelModal: React.FC<MCUIntelModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intelData, setIntelData] = useState<MCUSearchIntelResponse | null>(null);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [canonFilter, setCanonFilter] = useState<'all' | 'movies' | 'shows'>('all');

  useEffect(() => {
    if (initialQuery && isOpen) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (searchTarget?: string) => {
    const q = (searchTarget || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mcu-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: MCUSearchIntelResponse = await res.json();
      setIntelData(data);
    } catch (err: any) {
      console.error('Error fetching MCU movie intel:', err);
      setError(err?.message || 'Failed to connect to MediaWiki & MCU Intel relay.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCanonItems = RECENT_MCU_HOT_CANON.filter(item => {
    if (canonFilter === 'movies') return item.type === 'movie';
    if (canonFilter === 'shows') return item.type === 'show';
    return true;
  });

  const wiki = intelData?.wiki;
  const infobox = wiki?.infobox;

  return (
    <div id="mcu-intel-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div id="mcu-intel-dialog" className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold tracking-wide text-white uppercase font-mono">
                  MCU Movie & Series Intel
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> MediaWiki API (api.php)
                </span>
                {intelData?.sourceType === 'hybrid' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Simulation
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Direct live queries to <span className="text-slate-300 font-mono">marvelcinematicuniverse.fandom.com</span> Action API
              </p>
            </div>
          </div>
          <button
            id="close-mcu-intel-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Hot Canon Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/70 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="mcu-intel-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any recent MCU movie or show (e.g. Thunderbolts*, Born Again, Fantastic Four)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-sans"
              />
            </div>
            <button
              id="mcu-intel-submit-btn"
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 transition shadow-md whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying Wiki...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Pull Canon Intel</span>
                </>
              )}
            </button>
          </form>

          {/* Hot Canon Filter Bar & Horizontal Scrolling Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-amber-400 font-bold tracking-wider uppercase font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Hot Canon:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Recent Movies & Shows</span>
              </div>

              {/* Type Category Filter Tabs */}
              <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCanonFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    canonFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({RECENT_MCU_HOT_CANON.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCanonFilter('movies')}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                    canonFilter === 'movies'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Movies ({RECENT_MCU_HOT_CANON.filter(i => i.type === 'movie').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCanonFilter('shows')}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                    canonFilter === 'shows'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>Shows ({RECENT_MCU_HOT_CANON.filter(i => i.type === 'show').length})</span>
                </button>
              </div>
            </div>

            {/* Quick Selection Chips with Year & Type Icons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {filteredCanonItems.map((item) => {
                const isSelected = query.toLowerCase() === item.query.toLowerCase() || query.toLowerCase() === item.title.toLowerCase();
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setQuery(item.query);
                      handleSearch(item.query);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-white'
                    }`}
                  >
                    {item.type === 'movie' ? (
                      <Film className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    ) : (
                      <Tv className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    )}
                    <span>{item.title}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-200">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Globe className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Connecting to MCU MediaWiki API (api.php)...</p>
                <p className="text-xs text-slate-400 mt-1">Fetching live wikitext, infobox metadata, filmography, and official synopsis</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-lg flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Tactical Intel Notice</p>
                <p className="text-xs text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && intelData && (
            <div className="space-y-6">
              {/* MediaWiki Article Showcase */}
              {wiki && (
                <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl overflow-hidden shadow-lg">
                  {/* Article Title & Source Bar */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {infobox?.category === 'tv' ? (
                        <Tv className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white tracking-wide font-sans">
                            {wiki.title}
                          </h3>
                          {infobox?.category === 'tv' && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Marvel Television Series
                            </span>
                          )}
                          {infobox?.category === 'movie' && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              MCU Theatrical Film
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Official Canon Page ID: <span className="font-mono text-amber-400">{wiki.pageId}</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={wiki.canonicalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <span>Open on MCU Wiki</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Body Content with Poster/Image + Infobox */}
                  <div className="p-5 flex flex-col md:flex-row gap-6">
                    {/* Media Thumbnail/Poster */}
                    {wiki.imageUrl && (
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-48 max-w-full rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md">
                          <img
                            src={wiki.imageUrl}
                            alt={wiki.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto object-cover max-h-72"
                          />
                          <div className="p-2 text-center bg-slate-950/90 border-t border-slate-800 text-[10px] text-slate-400 font-mono truncate">
                            MCU Canon Archive
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Infobox & Details */}
                    <div className="flex-1 space-y-4">
                      {/* Quotes Banner */}
                      {wiki.quotes && wiki.quotes.length > 0 && (
                        <div className="p-3 bg-amber-500/10 border-l-2 border-amber-500 rounded-r-lg text-xs italic text-amber-200">
                          {wiki.quotes[0]}
                        </div>
                      )}

                      {/* Infobox Metadata Grid */}
                      {infobox && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {infobox.director && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Clapperboard className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Director</span>
                                <span className="font-medium text-slate-200">{infobox.director}</span>
                              </div>
                            </div>
                          )}

                          {infobox.showrunner && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Tv className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Showrunner / Creator</span>
                                <span className="font-medium text-slate-200">{infobox.showrunner}</span>
                              </div>
                            </div>
                          )}

                          {infobox.network && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Radio className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Platform / Network</span>
                                <span className="font-medium text-slate-200">{infobox.network}</span>
                              </div>
                            </div>
                          )}

                          {infobox.release && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                                  {infobox.category === 'tv' ? 'Broadcast / Release' : 'Theatrical Release'}
                                </span>
                                <span className="font-medium text-slate-200">{infobox.release}</span>
                              </div>
                            </div>
                          )}

                          {infobox.episodes && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Layers className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Episodes / Seasons</span>
                                <span className="font-medium text-slate-200">{infobox.episodes}</span>
                              </div>
                            </div>
                          )}

                          {infobox.actor && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Portrayed By</span>
                                <span className="font-medium text-slate-200">{infobox.actor}</span>
                              </div>
                            </div>
                          )}

                          {infobox.realName && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Real / Canon Name</span>
                                <span className="font-medium text-slate-200">{infobox.realName}</span>
                              </div>
                            </div>
                          )}

                          {infobox.boxoffice && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Box Office / Budget</span>
                                <span className="font-medium text-slate-200">{infobox.boxoffice}</span>
                              </div>
                            </div>
                          )}

                          {infobox.runtime && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Runtime</span>
                                <span className="font-medium text-slate-200">{infobox.runtime}</span>
                              </div>
                            </div>
                          )}

                          {infobox.status && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Status</span>
                                <span className="font-medium text-slate-200">{infobox.status}</span>
                              </div>
                            </div>
                          )}

                          {infobox.citizenship && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block">Origin / Citizenship</span>
                                <span className="font-medium text-slate-200">{infobox.citizenship}</span>
                              </div>
                            </div>
                          )}

                          {infobox.previousFilm && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] uppercase font-mono text-slate-500 block">Preceded By</span>
                              <span className="font-medium text-slate-200">{infobox.previousFilm}</span>
                            </div>
                          )}

                          {infobox.nextFilm && (
                            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] uppercase font-mono text-slate-500 block">Succeeded By</span>
                              <span className="font-medium text-slate-200">{infobox.nextFilm}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lead Paragraph Overview */}
                      {wiki.leadParagraph && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Cinematic Overview</span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                            {wiki.leadParagraph}
                          </p>
                        </div>
                      )}

                      {/* Official Synopsis */}
                      {wiki.synopsis && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono text-amber-500 tracking-wider">Official Narrative & Synopsis</span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
                            {wiki.synopsis}
                          </p>
                        </div>
                      )}

                      {/* Powers and Abilities if Character */}
                      {wiki.powersAndAbilities && wiki.powersAndAbilities.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider">Powers & Tactical Capabilities</span>
                          <div className="flex flex-wrap gap-1.5">
                            {wiki.powersAndAbilities.map((power, idx) => (
                              <span key={idx} className="px-2 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded text-[11px] text-cyan-200">
                                {power}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {wiki.categories && wiki.categories.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-slate-500 font-mono mr-1">Categories:</span>
                          {wiki.categories.map((cat, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {cat.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related MCU Wiki Articles */}
                  {wiki.relatedPages && wiki.relatedPages.length > 0 && (
                    <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-2">
                      <span className="text-[11px] uppercase font-mono text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        Related MCU Wiki Articles (Click to Query)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {wiki.relatedPages.map((rel, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setQuery(rel.title);
                              handleSearch(rel.title);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 text-xs text-slate-300 hover:text-amber-200 transition text-left"
                          >
                            {rel.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tactical Analysis & Colony Deployment */}
              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 leading-relaxed text-sm text-slate-300 whitespace-pre-wrap font-sans space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                  <Shield className="w-4 h-4" />
                  <span>Sakaar Tactical Briefing & Film Lore</span>
                </div>
                <div>
                  {intelData.analysis}
                </div>
              </div>

              {/* Verified Sources & Citations */}
              {intelData.sources && intelData.sources.length > 0 && (
                <div className="p-4 bg-slate-950/90 border border-cyan-500/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Verified Sources & Canonical Citations</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {intelData.sources.length} sources indexed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {intelData.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 text-xs text-slate-300 hover:text-cyan-200 transition group"
                      >
                        <span className="truncate pr-2 font-medium">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* MediaWiki API (api.php) Inspector Toggle */}
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50 text-xs">
                <button
                  onClick={() => setShowApiInspector(!showApiInspector)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left text-slate-400 hover:text-white hover:bg-slate-900/50 transition font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
                    <span>MediaWiki Action API (api.php) Details & Query Guide</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-sans">
                    {showApiInspector ? 'Hide details ▲' : 'Inspect API ▼'}
                  </span>
                </button>

                {showApiInspector && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 font-mono text-[11px] text-slate-300 leading-normal">
                    <div>
                      <span className="text-emerald-400 font-bold block mb-1">Standard Endpoint:</span>
                      <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300 block overflow-x-auto">
                        https://marvelcinematicuniverse.fandom.com/api.php
                      </code>
                    </div>

                    <div>
                      <span className="text-amber-400 font-bold block mb-1">Active Modules Implemented:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                        <li><span className="text-slate-200">action=query&list=search</span>: Full-text indexing across MCU film pages & characters</li>
                        <li><span className="text-slate-200">action=parse&prop=wikitext|sections|categories</span>: Extracts infoboxes, narrative, and quotes</li>
                        <li><span className="text-slate-200">action=query&prop=info|pageimages</span>: Retrieves canonical URL, thumbnail poster, and page metadata</li>
                      </ul>
                    </div>

                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-slate-400">
                      <span className="text-white font-bold block mb-0.5">Quick Curl or Browser Test:</span>
                      <code className="text-amber-300 text-[10px] break-all block">
                        https://marvelcinematicuniverse.fandom.com/api.php?action=query&list=search&srsearch={encodeURIComponent(query)}&format=json
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !intelData && (
            <div className="space-y-6">
              {/* Feature Header */}
              <div className="text-center space-y-2 py-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hot Canon Discovery Hub</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Recent MCU Movies & Series
                </h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Click any recent release below to immediately query official canon, theatrical release dates, directors, cast, and synopses from the Marvel Cinematic Universe Wiki.
                </p>
              </div>

              {/* Two Column Grid: Movies & Shows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Theatrical Releases (Phase 5 & 6) */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Recent MCU Theatrical Films
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      Phases 5 & 6
                    </span>
                  </div>

                  <div className="space-y-2">
                    {RECENT_MCU_HOT_CANON.filter(i => i.type === 'movie').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setQuery(item.query);
                          handleSearch(item.query);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 transition group flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition">
                              {item.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                              {item.year}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                              {item.phaseOrPlatform}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Marvel Television & Disney+ Series */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Recent Marvel Television & Disney+
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      Disney+ / Spotlight
                    </span>
                  </div>

                  <div className="space-y-2">
                    {RECENT_MCU_HOT_CANON.filter(i => i.type === 'show').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setQuery(item.query);
                          handleSearch(item.query);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition group flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition">
                              {item.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                              {item.year}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                              {item.phaseOrPlatform}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>MCU Canonical Database • Powered by MediaWiki Action API</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

