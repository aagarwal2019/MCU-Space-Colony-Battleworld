import React, { useState, useMemo } from 'react';
import { 
  Ticket, 
  X, 
  Search, 
  Film, 
  Tv, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  Layers, 
  Globe, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Trash2, 
  Share2, 
  Info,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  DollarSign,
  Flame,
  Hourglass
} from 'lucide-react';
import { FORTHCOMING_MCU_PROJECTS } from '../data/forthcomingMCU';
import { ForthcomingMCUProject, MovieTicketBooking } from '../types';
import { BookTicketsModal } from './BookTicketsModal';
import { soundFx } from '../utils/audio';
import { useMovieStills } from '../services/movieStillsClient';

interface MCUTicketsPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMCUIntel?: (query: string) => void;
  userBookings: MovieTicketBooking[];
  onSaveBooking: (booking: MovieTicketBooking) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export const MCUTicketsPortalModal: React.FC<MCUTicketsPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenMCUIntel,
  userBookings,
  onSaveBooking,
  onDeleteBooking,
}) => {
  if (!isOpen) return null;

  const { getStillForMovie } = useMovieStills();

  const [activeSubTab, setActiveSubTab] = useState<'all_movies' | 'my_passes' | 'theaters' | 'intel'>('all_movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in_theaters' | 'forthcoming' | 'coming_soon' | 'series'>('all');
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<ForthcomingMCUProject | null>(null);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter((proj) => {
      // Theatrical filter
      if (filterType === 'in_theaters') {
        if (proj.theatricalStatus !== 'in_theaters') return false;
      } else if (filterType === 'forthcoming') {
        if (proj.theatricalStatus !== 'forthcoming') return false;
      } else if (filterType === 'coming_soon') {
        if (proj.theatricalStatus !== 'coming_soon') return false;
      } else if (filterType === 'series') {
        if (proj.type !== 'series' && proj.type !== 'animation') return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = proj.title.toLowerCase().includes(q);
        const inDirector = proj.directorOrCreator.toLowerCase().includes(q);
        const inSynopsis = proj.synopsis.toLowerCase().includes(q);
        const inCast = proj.starring.some((a) => a.toLowerCase().includes(q));
        const inChars = proj.keyCharacters.some((c) => c.toLowerCase().includes(q));
        return inTitle || inDirector || inSynopsis || inCast || inChars;
      }

      return true;
    });
  }, [searchQuery, filterType]);

  // Categorized project collections
  const inTheatersMovies = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter(p => p.theatricalStatus === 'in_theaters');
  }, []);

  const forthcomingMovies = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter(p => p.theatricalStatus === 'forthcoming');
  }, []);

  const comingSoonMovies = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter(p => p.theatricalStatus === 'coming_soon');
  }, []);

  const streamingSeries = useMemo(() => {
    return FORTHCOMING_MCU_PROJECTS.filter(p => p.theatricalStatus === 'streaming' && (p.type === 'series' || p.type === 'animation'));
  }, []);

  const stats = useMemo(() => {
    const inTheaters = inTheatersMovies.length;
    const forthcoming = forthcomingMovies.length;
    const comingSoon = comingSoonMovies.length;
    const series = streamingSeries.length;
    return { inTheaters, forthcoming, comingSoon, series, total: FORTHCOMING_MCU_PROJECTS.length };
  }, [inTheatersMovies, forthcomingMovies, comingSoonMovies, streamingSeries]);

  const renderMovieCard = (movie: ForthcomingMCUProject, isSpotlight = false) => {
    const isPlayingNow = movie.theatricalStatus === 'in_theaters';
    const isAdvance = movie.theatricalStatus === 'forthcoming';
    const isComingSoon = movie.theatricalStatus === 'coming_soon';
    const movieStill = getStillForMovie(movie.id, movie.title);
    const cardBgImage = movieStill?.stillUrl || movie.posterUrl;

    return (
      <div
        key={movie.id}
        className={`bg-slate-950/70 border rounded-xl overflow-hidden transition-all duration-200 shadow-md flex flex-col group ${
          isPlayingNow
            ? 'border-rose-500/70 shadow-rose-950/40 hover:border-rose-400'
            : isAdvance
            ? 'border-amber-500/70 shadow-amber-950/40 hover:border-amber-400'
            : isComingSoon
            ? 'border-purple-500/50 shadow-purple-950/30 hover:border-purple-400'
            : 'border-slate-800 hover:border-slate-600'
        } ${isSpotlight ? 'md:col-span-2 lg:col-span-2' : ''}`}
      >
        {/* Poster / IMDb Photo Still and Badges */}
        <div className={`relative overflow-hidden bg-slate-950 ${isSpotlight ? 'h-52' : 'h-44'}`}>
          <img
            src={cardBgImage}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-65 group-hover:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Top Status Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 font-mono-tech">
            {isPlayingNow && (
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md bg-rose-600 text-white border border-rose-400 shadow-lg shadow-rose-900/50 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                Playing Now In Theaters
              </span>
            )}
            {isAdvance && (
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 border border-amber-300 shadow-lg shadow-amber-900/50 flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                Advance Tickets On Sale
              </span>
            )}
            {isComingSoon && (
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md bg-purple-950/90 text-purple-300 border border-purple-500/70 flex items-center gap-1 backdrop-blur-md">
                <Hourglass className="w-3 h-3 text-purple-400" />
                Coming Soon
              </span>
            )}
            <span className="text-[9px] px-1.5 py-0.5 rounded border bg-slate-900/80 text-slate-300 border-slate-700">
              {movie.phase}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10 font-mono-tech flex items-center gap-1.5">
            {(movie.imdbUrl || movieStill?.imdbUrl || movieStill?.imdbId) && (
              <a
                href={movie.imdbUrl || movieStill?.imdbUrl || `https://www.imdb.com/title/${movieStill?.imdbId}/`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] px-1.5 py-0.5 rounded-full border bg-amber-950/90 text-amber-300 border-amber-500/50 font-bold hover:text-white transition-colors"
                title="View title on IMDb"
              >
                IMDb {movie.imdbId || movieStill?.imdbId || 'Link'}
              </a>
            )}
            <span className="text-[9px] px-2 py-0.5 rounded-full border bg-slate-900/80 text-emerald-300 border-emerald-500/40 font-bold">
              {movie.status}
            </span>
          </div>

          {/* Title & Release Date Overlay */}
          <div className="absolute bottom-2.5 left-3 right-3 z-10 font-mono-tech">
            <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold mt-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{movie.releaseDate}</span>
              {movie.runtime && (
                <span className="text-slate-400 text-[10px]">· {movie.runtime}</span>
              )}
              {movie.rating && (
                <span className="text-slate-400 text-[10px] px-1 py-0.2 rounded bg-slate-900 border border-slate-700">
                  {movie.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Movie Details & Actions */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="space-y-2">
            <div className="text-slate-400 flex items-center justify-between text-[11px]">
              <span>Director / Creator:</span>
              <span className="text-slate-200 font-semibold">{movie.directorOrCreator}</span>
            </div>

            <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
              {movie.synopsis}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {movie.starring.slice(0, 4).map((a, i) => (
                <span key={i} className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket Booking Call-To-Action */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {movie.type === 'movie' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    Viewing Formats:
                  </span>
                  <span className="text-slate-300">IMAX 3D · Dolby Cinema · 4DX</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.buttonClick();
                      setSelectedMovieForBooking(movie);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-[0.98] ${
                      isPlayingNow
                        ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 hover:brightness-110 text-white shadow-rose-900/30'
                        : isAdvance
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 shadow-amber-500/25'
                        : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white shadow-purple-900/30'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>
                      {isPlayingNow 
                        ? 'Book Tickets Now' 
                        : isAdvance 
                        ? 'Book Advance Tickets' 
                        : 'Advance Pre-Reservation'}
                    </span>
                  </button>

                  {movie.fandangoSearchUrl && (
                    <a
                      href={movie.fandangoSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg text-xs border border-slate-700 flex items-center gap-1 transition-colors"
                      title="Fandango Box Office Search"
                    >
                      <span>Fandango</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-slate-400 text-[11px] p-2 bg-slate-900/50 rounded-lg">
                <span className="flex items-center gap-1">
                  <Tv className="w-3 h-3 text-cyan-400" />
                  Disney+ Original Series
                </span>
                <span className="text-cyan-300 font-bold">Streaming Premiere</span>
              </div>
            )}

            {/* Query Live Intel Button */}
            {onOpenMCUIntel && (
              <button
                onClick={() => onOpenMCUIntel(movie.mcuWikiQuery)}
                className="w-full py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white rounded-lg text-[11px] flex items-center justify-center gap-1.5 border border-indigo-500/30 transition-colors"
              >
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>Query Live MCU Intel & Trailers</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="mcu-tickets-portal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div 
        id="mcu-tickets-portal-modal"
        className="bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden my-auto flex flex-col max-h-[94vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/25">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-mono-tech text-white tracking-wide flex items-center gap-2">
                  MARVEL STUDIOS TICKETS & CINEMAS
                </h2>
                <span className="hidden sm:inline text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 font-bold font-mono-tech">
                  Official Theatrical Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                Playing Now: <span className="text-rose-400 font-bold">Spider-Man: Brand New Day</span> · Forthcoming Advance: <span className="text-amber-300 font-bold">Avengers: Doomsday</span> · Plus <span className="text-purple-300 font-bold">Coming Soon</span> Slate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Tickets Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-2 font-mono-tech text-xs">
            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveSubTab('all_movies');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'all_movies'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>All Movies & Showtimes</span>
            </button>

            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveSubTab('my_passes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'my_passes'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Booked Passes</span>
              {userBookings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-400">
                  {userBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveSubTab('theaters');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'theaters'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Live Cinema Gateways</span>
            </button>

            <button
              onClick={() => {
                soundFx.buttonClick();
                setActiveSubTab('intel');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'intel'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Format Guide & Intel</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono-tech text-slate-400">
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Spider-Man: Brand New Day (Now Playing)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 font-mono-tech flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IMDb API Stills Active
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ALL MOVIES & TICKETS */}
          {activeSubTab === 'all_movies' && (
            <div className="space-y-6">
              {/* Filter & Search Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, heroes, directors..."
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono-tech text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
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

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono-tech text-xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      filterType === 'all'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Slate ({stats.total})
                  </button>
                  <button
                    onClick={() => setFilterType('in_theaters')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap ${
                      filterType === 'in_theaters'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    Playing Now ({stats.inTheaters})
                  </button>
                  <button
                    onClick={() => setFilterType('forthcoming')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap ${
                      filterType === 'forthcoming'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Ticket className="w-3 h-3" />
                    Advance Booking ({stats.forthcoming})
                  </button>
                  <button
                    onClick={() => setFilterType('coming_soon')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap ${
                      filterType === 'coming_soon'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Hourglass className="w-3 h-3" />
                    Coming Soon ({stats.comingSoon})
                  </button>
                  <button
                    onClick={() => setFilterType('series')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap ${
                      filterType === 'series'
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tv className="w-3 h-3" />
                    Disney+ ({stats.series})
                  </button>
                </div>
              </div>

              {/* If filtering or searching, show filtered list directly */}
              {searchQuery || filterType !== 'all' ? (
                <div className="space-y-4">
                  <div className="text-xs font-mono-tech text-slate-400">
                    Showing {filteredProjects.length} projects matching your criteria:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((movie) => renderMovieCard(movie))}
                  </div>
                </div>
              ) : (
                /* STRUCTURED SECTIONS VIEW (PLAYING NOW, FORTHCOMING ADVANCE, COMING SOON) */
                <div className="space-y-8">
                  {/* ======================================================== */}
                  {/* SECTION 1: PLAYING NOW IN THEATERS (SPIDER-MAN: BRAND NEW DAY) */}
                  {/* ======================================================== */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/40 font-mono-tech">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          PLAYING NOW IN THEATERS
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/60 font-bold">
                          Exclusive Theatrical Run
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Today & Weekend Showtimes</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inTheatersMovies.map((movie) => renderMovieCard(movie, true))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* SECTION 2: FORTHCOMING THEATRICAL BLOCKBUSTER (AVENGERS: DOOMSDAY) */}
                  {/* ======================================================== */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/40 font-mono-tech">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          FORTHCOMING — ADVANCE TICKETS ON SALE
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/60 font-bold">
                          Opening Night & Premiere Reservations
                        </span>
                      </div>
                      <span className="text-xs text-amber-300 font-bold">December 18, 2026</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {forthcomingMovies.map((movie) => renderMovieCard(movie, true))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* SECTION 3: COMING SOON SECTION (SECRET WARS, X-MEN, GHOST RIDER, BLACK PANTHER 3) */}
                  {/* ======================================================== */}
                  <div id="mcu-coming-soon-section" className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-purple-500/40 font-mono-tech gap-1">
                      <div className="flex items-center gap-2">
                        <Hourglass className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          COMING SOON — FUTURE MARVEL STUDIOS BLOCKBUSTERS
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/60 font-bold">
                          Upcoming Slate
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        <span className="text-purple-300 font-bold">Avengers: Secret Wars (Dec 17, 2027)</span> · X-Men · Ghost Rider · Black Panther 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {comingSoonMovies.map((movie) => renderMovieCard(movie))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* SECTION 4: DISNEY+ STREAMING RELEASES */}
                  {/* ======================================================== */}
                  {streamingSeries.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono-tech">
                        <div className="flex items-center gap-2">
                          <Tv className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                            DISNEY+ & STREAMING ORIGINALS
                          </h3>
                        </div>
                        <span className="text-xs text-slate-500">Television & Animation</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {streamingSeries.map((movie) => renderMovieCard(movie))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKED PASSES */}
          {activeSubTab === 'my_passes' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    CONFIRMED MARVEL CINEMATIC PASSES & TICKETS
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your reservations are saved locally. Present these barcodes & QR passes at theater kiosks.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundFx.buttonClick();
                    setActiveSubTab('all_movies');
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book More Tickets</span>
                </button>
              </div>

              {userBookings.length === 0 ? (
                <div className="p-12 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-3">
                  <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No Reserved Passes Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You haven't reserved any movie tickets yet. Pick <span className="text-rose-400 font-bold">Spider-Man: Brand New Day</span> (playing now) or <span className="text-amber-400 font-bold">Avengers: Doomsday</span> (advance tickets), choose your seats and format, and your digital ticket pass will appear here!
                  </p>
                  <button
                    onClick={() => setActiveSubTab('all_movies')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Browse MCU Movies & Showtimes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-amber-500/60 rounded-xl p-4 shadow-xl space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-dashed border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.posterUrl}
                            alt={b.movieTitle}
                            referrerPolicy="no-referrer"
                            className="w-14 h-20 object-cover rounded-md border border-amber-500/40 shrink-0"
                          />
                          <div>
                            <span className="text-[9px] uppercase font-bold text-amber-400 block">
                              MARVEL STUDIOS DIGITAL PASS
                            </span>
                            <h4 className="text-sm font-black text-white leading-tight">
                              {b.movieTitle}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                                {b.format}
                              </span>
                              <span className="text-[11px] text-cyan-300">
                                {b.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 uppercase block">Code</span>
                          <span className="text-xs font-black text-amber-300">{b.bookingCode}</span>
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              onDeleteBooking(b.id);
                            }}
                            className="mt-2 text-slate-500 hover:text-rose-400 text-[10px] flex items-center gap-0.5 ml-auto transition-colors cursor-pointer"
                            title="Cancel / Delete Pass"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Ticket Details Grid */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                        <div>
                          <span className="text-[9px] text-slate-500 block">DATE</span>
                          <span className="text-slate-200 font-bold text-[11px]">{b.date}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">SEATS</span>
                          <span className="text-amber-300 font-bold text-[11px]">{b.seats.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">PAID</span>
                          <span className="text-emerald-400 font-bold text-[11px]">${b.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Barcode / QR Info */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <QrCode className="w-6 h-6 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-slate-200 font-semibold block">{b.guestName || 'Sakaar Operative'}</span>
                            <span className="text-[9px] text-slate-500">Valid for General Admission</span>
                          </div>
                        </div>

                        <a
                          href={`https://www.fandango.com/search?q=${encodeURIComponent(b.movieTitle)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] rounded border border-slate-700 flex items-center gap-1 transition-colors"
                        >
                          <span>Live Cinema</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE CINEMA GATEWAYS */}
          {activeSubTab === 'theaters' && (
            <div className="space-y-4 font-mono-tech">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  REAL-WORLD LIVE CINEMA CHAINS & THEATER FINDERS
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Book direct live seats across United States and international theatrical partners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Fandango */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">FANDANGO</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">USA Official</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Search showtimes, compare auditoriums, and purchase reserved seats at thousands of cinema locations.
                  </p>
                  <a
                    href="https://www.fandango.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit Fandango</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* AMC Theatres */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-400">AMC THEATRES</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">A-List & IMAX</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Premium Dolby Cinema at AMC, IMAX with Laser, and reclining AMC Signature Power Recliners.
                  </p>
                  <a
                    href="https://www.amctheatres.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit AMC Theatres</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Regal Cinemas */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-indigo-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-400">REGAL CINEMAS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">RPX & 4DX</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Featuring 4DX motion seating, ScreenX 270-degree panorama, and Regal Premium Experience (RPX).
                  </p>
                  <a
                    href="https://www.regmovies.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit Regal Cinemas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* IMAX Finder */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400">IMAX FINDER</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Laser 70mm</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Locate true 1.43:1 and 1.90:1 aspect ratio dual-laser IMAX auditoriums worldwide for Marvel events.
                  </p>
                  <a
                    href="https://www.imax.com/theatres"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Find IMAX Auditoriums</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FORMAT GUIDE & INTEL */}
          {activeSubTab === 'intel' && (
            <div className="space-y-4 font-mono-tech">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  PREMIUM THEATRICAL FORMAT GUIDE & PROJECTION MATRIX
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How to choose the ultimate theater format for your Marvel Cinematic Universe experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>IMAX with Laser & 3D</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Expanded 1.90:1 aspect ratio offering up to 26% more image than standard screens. Dual 4K laser projection delivering unparalleled brightness, deep contrast, and 12-channel surround sound.
                  </p>
                  <span className="text-[10px] text-amber-400 block pt-1 font-bold">
                    Best for: Avengers: Doomsday, Secret Wars, The Fantastic Four
                  </span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Dolby Cinema (Vision + Atmos)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dolby Vision dual-laser projection with 1,000,000:1 contrast ratio (true blacks) combined with Dolby Atmos spatial 3D sound where every sound effect moves dynamically around the room.
                  </p>
                  <span className="text-[10px] text-amber-400 block pt-1 font-bold">
                    Best for: Spider-Man: Brand New Day, X-Men, Black Panther 3
                  </span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <Zap className="w-4 h-4 text-rose-400" />
                    <span>4DX Environmental Theater</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Synchronized motion seats that sway, heave, and pitch with the action, augmented by wind, fog, lightning, water, and scent effects engineered directly into the auditorium.
                  </p>
                  <span className="text-[10px] text-amber-400 block pt-1 font-bold">
                    Best for: Ghost Rider, Spider-Man: Brand New Day, Avengers: Doomsday
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono-tech">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>Citadel Theatrical Outpost</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">{userBookings.length} Active Reservations</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Internal Interactive Ticket Booking Modal */}
      <BookTicketsModal
        movie={selectedMovieForBooking}
        isOpen={Boolean(selectedMovieForBooking)}
        onClose={() => setSelectedMovieForBooking(null)}
        onSaveBooking={(newBooking) => {
          onSaveBooking(newBooking);
          setActiveSubTab('my_passes');
        }}
      />
    </div>
  );
};
