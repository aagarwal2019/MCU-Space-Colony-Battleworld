import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Tv, 
  Sparkles, 
  Calendar, 
  Search, 
  ExternalLink, 
  Layers, 
  Globe, 
  Clock, 
  Compass,
  AlertCircle,
  Clapperboard,
  ShieldCheck,
  Zap,
  Users,
  Ticket,
  MapPin,
  CheckCircle2,
  DollarSign,
  Hourglass
} from 'lucide-react';
import { FORTHCOMING_MCU_PROJECTS } from '../data/forthcomingMCU';
import { ForthcomingMCUProject, MovieTicketBooking } from '../types';
import { BookTicketsModal } from './BookTicketsModal';
import { soundFx } from '../utils/audio';
import { useMovieStills } from '../services/movieStillsClient';

interface ForthcomingMCUViewProps {
  onSelectIntelQuery: (query: string) => void;
  onOpenWikiDirect?: (articleUrl: string) => void;
}

export const ForthcomingMCUView: React.FC<ForthcomingMCUViewProps> = ({
  onSelectIntelQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in_theaters' | 'forthcoming' | 'coming_soon' | 'movie' | 'series' | 'animation'>('all');
  const [filterPhase, setFilterPhase] = useState<'all' | 'Phase 5' | 'Phase 6' | 'Climax'>('all');
  const [selectedBookingMovie, setSelectedBookingMovie] = useState<ForthcomingMCUProject | null>(null);
  const [userBookings, setUserBookings] = useState<MovieTicketBooking[]>([]);
  const [ribbonPreviewMovieId, setRibbonPreviewMovieId] = useState<string>('spider_man_brand_new_day');

  // Fetch official movie photo stills from IMDb API / Movie Database API
  const { getStillForMovie } = useMovieStills();
  const activeRibbonStill = getStillForMovie(ribbonPreviewMovieId);

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter((proj) => {
      // In-Theaters or Type match
      if (filterType === 'in_theaters') {
        if (proj.theatricalStatus !== 'in_theaters') return false;
      } else if (filterType === 'forthcoming') {
        if (proj.theatricalStatus !== 'forthcoming') return false;
      } else if (filterType === 'coming_soon') {
        if (proj.theatricalStatus !== 'coming_soon') return false;
      } else if (filterType !== 'all' && proj.type !== filterType) {
        return false;
      }

      // Phase match
      if (filterPhase !== 'all') {
        if (filterPhase === 'Phase 5' && !proj.phase.includes('Phase 5')) return false;
        if (filterPhase === 'Phase 6' && !proj.phase.includes('Phase 6')) return false;
        if (filterPhase === 'Climax' && !proj.phase.toLowerCase().includes('climax')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = proj.title.toLowerCase().includes(q);
        const inDirector = proj.directorOrCreator.toLowerCase().includes(q);
        const inSynopsis = proj.synopsis.toLowerCase().includes(q);
        const inCast = proj.starring.some((actor) => actor.toLowerCase().includes(q));
        const inChars = proj.keyCharacters.some((c) => c.toLowerCase().includes(q));
        return inTitle || inDirector || inSynopsis || inCast || inChars;
      }

      return true;
    });
  }, [searchQuery, filterType, filterPhase]);

  // Quick statistics
  const stats = useMemo(() => {
    const inTheaters = FORTHCOMING_MCU_PROJECTS.filter((p) => p.theatricalStatus === 'in_theaters').length;
    const forthcoming = FORTHCOMING_MCU_PROJECTS.filter((p) => p.theatricalStatus === 'forthcoming').length;
    const comingSoon = FORTHCOMING_MCU_PROJECTS.filter((p) => p.theatricalStatus === 'coming_soon').length;
    const movies = FORTHCOMING_MCU_PROJECTS.filter((p) => p.type === 'movie').length;
    const series = FORTHCOMING_MCU_PROJECTS.filter((p) => p.type === 'series').length;
    const animations = FORTHCOMING_MCU_PROJECTS.filter((p) => p.type === 'animation').length;
    return { inTheaters, forthcoming, comingSoon, movies, series, animations, total: FORTHCOMING_MCU_PROJECTS.length };
  }, []);

  const handleSaveBooking = (booking: MovieTicketBooking) => {
    setUserBookings((prev) => [booking, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-mono-tech uppercase tracking-wider">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>MARVEL STUDIOS THEATRICAL PORTAL & TICKET RESERVATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-mono-tech flex items-center gap-3">
              MCU MOVIES & TICKETS
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Playing now exclusively: <span className="text-rose-400 font-bold">Spider-Man: Brand New Day</span>. Book advance tickets for <span className="text-amber-300 font-bold">Avengers: Doomsday</span> (<span className="text-amber-400 font-mono-tech">Dec 18, 2026</span>). Explore the upcoming <span className="text-purple-300 font-bold">Coming Soon</span> slate including <span className="text-slate-100 font-semibold">Avengers: Secret Wars</span> (<span className="text-purple-300 font-mono-tech">Dec 17, 2027</span>), <span className="text-slate-200">X-Men, Ghost Rider, and Black Panther 3</span>.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="bg-slate-950/70 border border-rose-500/40 rounded-xl px-4 py-2 text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-mono-tech text-rose-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Playing Now
              </span>
              <span className="text-xl font-bold font-mono-tech text-rose-400">{stats.inTheaters} Film</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-slate-950/70 border border-amber-500/40 rounded-xl px-3 py-1.5 text-center flex-1">
                <span className="text-[9px] uppercase font-mono-tech text-amber-300 block">Advance</span>
                <span className="text-sm font-bold font-mono-tech text-amber-400">{stats.forthcoming} Film</span>
              </div>
              <div className="bg-slate-950/70 border border-purple-500/40 rounded-xl px-3 py-1.5 text-center flex-1">
                <span className="text-[9px] uppercase font-mono-tech text-purple-300 block">Coming Soon</span>
                <span className="text-sm font-bold font-mono-tech text-purple-400">{stats.comingSoon} Films</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Theatrical Quick-Book Ribbon with IMDb Photo Still Background */}
      <div 
        id="theatrical-ticket-booking-ribbon"
        className="relative overflow-hidden p-4 sm:p-5 rounded-xl border border-amber-500/40 shadow-xl space-y-3 font-mono-tech bg-slate-950"
      >
        {/* Dynamic IMDb Movie Photo Still Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={activeRibbonStill.stillUrl}
            alt={activeRibbonStill.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[0.5px] transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-500 text-slate-950 font-black text-xs">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Book Your Tickets · Theatrical Releases & Coming Soon
              </h2>
              <p className="text-[11px] text-amber-300/80">
                Select any film to reserve seats & generate official digital passes
              </p>
            </div>
          </div>

          {/* IMDb API Stills Watermark Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-[10px] text-amber-300 w-fit backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>IMDb Movie Still: <strong className="text-white">{activeRibbonStill.title}</strong></span>
            {activeRibbonStill.imdbId && (
              <a
                href={activeRibbonStill.imdbUrl || `https://www.imdb.com/title/${activeRibbonStill.imdbId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-white underline decoration-amber-400/60 ml-0.5"
                title="View on IMDb"
              >
                {activeRibbonStill.imdbId}
              </a>
            )}
          </div>
        </div>

        {/* Quick Film Selector Buttons with IMDb Photo Stills */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {FORTHCOMING_MCU_PROJECTS.filter((p) => p.type === 'movie').slice(0, 6).map((movie) => {
            const still = getStillForMovie(movie.id, movie.title);
            const isHovered = ribbonPreviewMovieId === movie.id;
            return (
              <button
                key={movie.id}
                onMouseEnter={() => setRibbonPreviewMovieId(movie.id)}
                onClick={() => {
                  soundFx.buttonClick();
                  setSelectedBookingMovie(movie);
                }}
                className={`relative overflow-hidden p-2 rounded-lg text-left transition-all group flex flex-col justify-between border ${
                  isHovered 
                    ? 'bg-slate-900/90 border-amber-400 ring-1 ring-amber-400/40 shadow-lg' 
                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-700/80 hover:border-amber-500'
                }`}
              >
                {/* Micro photo still background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity">
                  <img
                    src={still.stillUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                </div>

                <div className="relative z-10">
                  <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold block w-fit mb-1 ${
                    movie.theatricalStatus === 'in_theaters'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : movie.theatricalStatus === 'forthcoming'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                  }`}>
                    {movie.theatricalStatus === 'in_theaters' 
                      ? 'Playing Now' 
                      : movie.theatricalStatus === 'forthcoming' 
                      ? 'Advance' 
                      : 'Coming Soon'}
                  </span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-1">
                    {movie.title}
                  </span>
                </div>
                <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="group-hover:text-amber-300 font-bold">Book Pass</span>
                  <Ticket className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MCU heroes, movies, titles..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-tech text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono-tech"
              >
                Clear
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Slate ({stats.total})
            </button>

            {/* In Theaters Now Filter */}
            <button
              onClick={() => setFilterType('in_theaters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                filterType === 'in_theaters'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              Playing Now ({stats.inTheaters})
            </button>

            {/* Advance Booking Filter */}
            <button
              onClick={() => setFilterType('forthcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                filterType === 'forthcoming'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Ticket className="w-3 h-3" />
              Advance Booking ({stats.forthcoming})
            </button>

            {/* Coming Soon Filter */}
            <button
              onClick={() => setFilterType('coming_soon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                filterType === 'coming_soon'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Hourglass className="w-3 h-3" />
              Coming Soon ({stats.comingSoon})
            </button>

            <button
              onClick={() => setFilterType('series')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                filterType === 'series'
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Tv className="w-3 h-3" />
              Disney+ ({stats.series})
            </button>
          </div>
        </div>

        {/* Phase Filter Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono-tech overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Phase Filter:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterPhase('all')}
              className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                filterPhase === 'all'
                  ? 'bg-slate-700 text-slate-100 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setFilterPhase('Phase 5')}
              className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                filterPhase === 'Phase 5'
                  ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 5
            </button>
            <button
              onClick={() => setFilterPhase('Phase 6')}
              className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                filterPhase === 'Phase 6'
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 6
            </button>
            <button
              onClick={() => setFilterPhase('Climax')}
              className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                filterPhase === 'Climax'
                  ? 'bg-rose-950 text-rose-200 border border-rose-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Multiverse Climax (Doomsday / Secret Wars)
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Forthcoming & Current MCU Projects */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold font-mono-tech text-slate-200">No Projects Found</h3>
          <p className="text-sm text-slate-400">
            No forthcoming MCU productions matched query "{searchQuery}". Try searching for another hero, title, or phase.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterPhase('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-tech rounded-lg"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const still = getStillForMovie(project.id, project.title);
            const cardBgImage = still?.stillUrl || project.posterUrl;
            return (
            <div
              key={project.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-200 shadow-lg flex flex-col group"
            >
              {/* Card Header with Category Banner & IMDb Photo Still */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={cardBgImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-65 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className={`text-[10px] font-mono-tech uppercase font-bold px-2 py-0.5 rounded border backdrop-blur-md ${
                    project.theatricalStatus === 'in_theaters'
                      ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-md shadow-rose-950/50'
                      : project.theatricalStatus === 'forthcoming'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-md shadow-amber-950/50'
                      : project.theatricalStatus === 'coming_soon'
                      ? 'bg-purple-950/90 text-purple-300 border-purple-500/60 shadow-md shadow-purple-950/50'
                      : project.type === 'movie'
                      ? 'bg-slate-900/80 text-slate-300 border-slate-700'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                  }`}>
                    {project.theatricalStatus === 'in_theaters' 
                      ? '🔴 Playing Now' 
                      : project.theatricalStatus === 'forthcoming' 
                      ? '🎟️ Advance' 
                      : project.theatricalStatus === 'coming_soon'
                      ? '⏳ Coming Soon' 
                      : project.type}
                  </span>
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border bg-slate-900/80 text-slate-300 border-slate-700">
                    {project.phase}
                  </span>
                  {(project.imdbUrl || still?.imdbUrl || still?.imdbId) && (
                    <a
                      href={project.imdbUrl || still?.imdbUrl || `https://www.imdb.com/title/${still?.imdbId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-500/40 backdrop-blur-xs flex items-center gap-1 hover:text-white hover:bg-amber-900/90 transition-colors"
                      title="View on IMDb"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      IMDb {project.imdbId || still?.imdbId}
                    </a>
                  )}
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full border ${
                    project.status === 'Released'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 font-bold'
                      : project.theatricalStatus === 'in_theaters'
                      ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 font-bold'
                      : project.status === 'Post-Production' || project.status === 'Upcoming'
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                      : project.status === 'Filming' || project.status === 'In Production'
                      ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700'
                  }`}>
                    {project.status === 'Released' ? 'Released' : project.theatricalStatus === 'in_theaters' ? 'Live Theatrical Run' : project.status}
                  </span>
                </div>

                {/* Bottom title & release */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="text-lg font-black font-mono-tech text-white leading-tight drop-shadow-md">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-mono-tech font-bold mt-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{project.releaseDate}</span>
                    {project.rating && (
                      <span className="text-[10px] text-slate-300 bg-slate-900/80 px-1 py-0.2 rounded border border-slate-700">
                        {project.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Director / Creator */}
                  <div className="text-xs font-mono-tech text-slate-400 flex items-center justify-between">
                    <span>Directorial Lead:</span>
                    <span className="text-slate-200 font-semibold">{project.directorOrCreator}</span>
                  </div>

                  {/* Starring Highlights */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" />
                      Key Cast & Operatives:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.starring.slice(0, 4).map((actor, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono-tech bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded"
                        >
                          {actor}
                        </span>
                      ))}
                      {project.starring.length > 4 && (
                        <span className="text-[10px] font-mono-tech text-slate-400 px-1 py-0.5">
                          +{project.starring.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Official MCU Wiki Synopsis */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech text-slate-400 block uppercase tracking-wider">
                      MCU Wiki Briefing:
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {project.synopsis}
                    </p>
                  </div>

                  {/* Sakaar Lore Impact */}
                  <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] font-mono-tech text-indigo-200/90 space-y-1">
                    <div className="flex items-center gap-1 text-indigo-400 font-bold">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      <span>Sakaar Outpost Impact:</span>
                    </div>
                    <p className="text-[10px] text-indigo-300/80 leading-snug">
                      {project.loreConnection}
                    </p>
                  </div>

                  {/* DEDICATED "BOOK YOUR TICKETS" SECTION (For each MCU movie currently released or forthcoming) */}
                  {project.type === 'movie' && (
                    <div 
                      id={`book-your-tickets-section-${project.id}`}
                      className="p-3 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 border border-amber-500/50 shadow-md space-y-2 font-mono-tech"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <Ticket className="w-4 h-4 text-amber-400" />
                          <span>Book Your Tickets</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          project.theatricalStatus === 'in_theaters'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
                            : 'bg-amber-950 text-amber-300 border-amber-500/50'
                        }`}>
                          {project.theatricalStatus === 'in_theaters' ? '🔴 Playing In Theaters' : '🟡 Advance Tickets'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="text-slate-400">Viewing Formats:</span>
                        <span className="text-white font-semibold">IMAX 3D · Dolby · 4DX</span>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          id={`book-tickets-btn-${project.id}`}
                          onClick={() => {
                            soundFx.buttonClick();
                            setSelectedBookingMovie(project);
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-[0.98] text-slate-950 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
                          title={`Book Your Tickets for ${project.title}`}
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Book Your Tickets</span>
                        </button>

                        {project.fandangoSearchUrl && (
                          <a
                            href={project.fandangoSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg text-xs border border-slate-700 flex items-center gap-1 transition-colors"
                            title="Open Fandango in new tab"
                          >
                            <span>Fandango</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {(project.imdbUrl || still?.imdbUrl) && (
                          <a
                            href={project.imdbUrl || still?.imdbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-2 bg-amber-950/70 hover:bg-amber-900/90 text-amber-300 hover:text-white rounded-lg text-xs border border-amber-500/40 flex items-center gap-1 transition-colors font-bold"
                            title="Open verified entry on IMDb in new tab"
                          >
                            <span>IMDb</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectIntelQuery(project.mcuWikiQuery)}
                    className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-mono-tech font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                    title="Retrieve live tactical dossier via the Marvel Cinematic Universe Wiki MediaWiki Action API"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Query MCU Wiki Intel</span>
                  </button>

                  <a
                    href={project.mcuWikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 shrink-0"
                    title="Open verified article on Marvel Cinematic Universe Wiki"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Interactive Ticket Booking Modal */}
      <BookTicketsModal
        movie={selectedBookingMovie}
        isOpen={Boolean(selectedBookingMovie)}
        onClose={() => setSelectedBookingMovie(null)}
        onSaveBooking={handleSaveBooking}
      />
    </div>
  );
};
