import React, { useState, useMemo } from 'react';
import { 
  Ticket, 
  X, 
  Calendar, 
  Clock, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  DollarSign, 
  Tv, 
  MapPin, 
  Share2, 
  Download, 
  ArrowRight,
  Info
} from 'lucide-react';
import { ForthcomingMCUProject, MovieTicketBooking } from '../types';
import { soundFx } from '../utils/audio';
import { useMovieStills } from '../services/movieStillsClient';

interface BookTicketsModalProps {
  movie: ForthcomingMCUProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBooking?: (booking: MovieTicketBooking) => void;
}

export const BookTicketsModal: React.FC<BookTicketsModalProps> = ({
  movie,
  isOpen,
  onClose,
  onSaveBooking,
}) => {
  if (!isOpen || !movie) return null;

  // Form State
  const [selectedFormat, setSelectedFormat] = useState<'IMAX 3D' | 'Dolby Cinema' | '4DX' | 'Standard Digital'>('IMAX 3D');
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>('7:15 PM');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['D-4', 'D-5']);
  const [includeConcessions, setIncludeConcessions] = useState<boolean>(true);
  const [guestName, setGuestName] = useState<string>('Sakaar Operative');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MovieTicketBooking | null>(null);

  // Retrieve official IMDb photo still / movie database still for the background
  const { getStillForMovie } = useMovieStills();
  const movieStill = getStillForMovie(movie.id, movie.title);

  // Available formats with pricing
  const FORMAT_DETAILS = {
    'IMAX 3D': { price: movie.ticketPrice ? movie.ticketPrice + 4.5 : 23.50, desc: 'Next-Gen Laser 3D & 12-Channel Audio' },
    'Dolby Cinema': { price: movie.ticketPrice ? movie.ticketPrice + 2.0 : 21.00, desc: 'Dolby Vision HDR & Atmos Spatial Sound' },
    '4DX': { price: movie.ticketPrice ? movie.ticketPrice + 5.0 : 24.00, desc: 'Dynamic Motion Seats & Environmental FX' },
    'Standard Digital': { price: movie.ticketPrice || 17.50, desc: 'Crisp 4K Laser Projection' },
  };

  // Generate dynamic date options based on movie release status
  const dates = useMemo(() => {
    if (movie.theatricalStatus === 'in_theaters') {
      return [
        { label: 'Today', date: 'Fri, Feb 28', desc: 'Evening & Prime Times' },
        { label: 'Tomorrow', date: 'Sat, Mar 1', desc: 'Weekend Premiere' },
        { label: 'Sunday', date: 'Sun, Mar 2', desc: 'Matinee & Evening' },
        { label: 'Next Friday', date: 'Fri, Mar 7', desc: 'Special Screening' },
      ];
    }
    return [
      { label: 'Opening Night', date: `${movie.releaseDate} - Preview`, desc: 'First Public Showings' },
      { label: 'Opening Friday', date: `${movie.releaseDate}`, desc: 'Official World Release' },
      { label: 'Saturday Premiere', date: 'Opening Weekend Sat', desc: 'Prime Evening Slots' },
      { label: 'Sunday Matinee', date: 'Opening Weekend Sun', desc: 'Fan Event Screening' },
    ];
  }, [movie]);

  const showtimes = ['1:15 PM', '4:30 PM', '7:15 PM', '10:45 PM'];

  // 6 rows x 8 seats seat layout
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const occupiedSeats = useMemo(() => new Set(['A-3', 'A-4', 'C-2', 'D-2', 'D-3', 'E-6', 'E-7']), []);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;
    soundFx.buttonClick();
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  // Price calculations
  const unitPrice = FORMAT_DETAILS[selectedFormat].price;
  const ticketSubtotal = unitPrice * selectedSeats.length;
  const concessionsPrice = includeConcessions ? 14.50 : 0;
  const grandTotal = Math.round((ticketSubtotal + concessionsPrice) * 100) / 100;

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) return;
    soundFx.techUnlock();

    const booking: MovieTicketBooking = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      format: selectedFormat,
      theaterName: 'Sakaar Multiverse Cinema · Grand Citadel IMAX',
      date: dates[selectedDateIndex].date,
      time: selectedTime,
      seats: selectedSeats,
      totalPrice: grandTotal,
      bookingCode: `MCU-${movie.id.slice(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: Date.now(),
      guestName,
    };

    setConfirmedBooking(booking);
    setIsBooked(true);
    if (onSaveBooking) {
      onSaveBooking(booking);
    }
  };

  const handleResetForNewBooking = () => {
    setIsBooked(false);
    setConfirmedBooking(null);
  };

  return (
    <div 
      id="book-tickets-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div 
        id="book-tickets-modal"
        className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Cinematic Movie Photo Still Background from IMDb API / Movie Database */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={movieStill.stillUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-15 scale-105 filter blur-[0.5px] transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-slate-950/80" />
        </div>

        {/* Modal Top Header */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono-tech text-white leading-tight flex items-center gap-2">
                  BOOK YOUR TICKETS
                </h2>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-normal">
                  {movie.theatricalStatus === 'in_theaters' 
                    ? 'In Theaters Now' 
                    : movie.theatricalStatus === 'coming_soon'
                    ? 'Coming Soon · Advance Access Pass'
                    : 'Advance Theatrical Reservation'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech mt-0.5">
                <span>Official MCU Box Office · {movie.title}</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400/90 flex items-center gap-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {movieStill.source === 'imdb_api' ? 'IMDb Photo Still' : 'Movie Database Still'}
                  {movieStill.imdbId && (
                    <a
                      href={movieStill.imdbUrl || `https://www.imdb.com/title/${movieStill.imdbId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-white underline decoration-amber-500/50 ml-0.5"
                      title="View title details on IMDb"
                    >
                      {movieStill.imdbId}
                    </a>
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Ticket Booking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="relative z-10 p-5 overflow-y-auto space-y-5 text-slate-200">
          {!isBooked ? (
            <>
              {/* Movie Brief Card with IMDb Still Backdrop */}
              <div className="relative overflow-hidden flex flex-col sm:flex-row gap-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 shadow-lg">
                {/* Photo Still Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
                  <img
                    src={movieStill.stillUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="relative z-10 shrink-0 hidden sm:block">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    referrerPolicy="no-referrer"
                    className="w-20 h-28 object-cover rounded-lg border border-slate-700 shadow-md" 
                  />
                  {movieStill.imdbId && (
                    <div className="text-[9px] font-mono-tech text-amber-400 text-center mt-1 bg-slate-900/90 px-1 py-0.5 rounded border border-amber-500/30">
                      IMDb {movieStill.imdbId}
                    </div>
                  )}
                </div>

                <div className="relative z-10 space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-black font-mono-tech text-white">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono-tech">
                      {movie.rating && (
                        <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 font-bold">
                          {movie.rating}
                        </span>
                      )}
                      {movie.runtime && (
                        <span className="text-slate-400">
                          {movie.runtime}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono-tech text-slate-400">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Release: {movie.releaseDate}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Grand Citadel Multiplex
                    </span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {movieStill.sourceLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1: Select Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold font-mono-tech text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    1. Select Viewing Format
                  </span>
                  <span className="text-slate-400 font-normal text-[11px]">
                    Standard vs Premium Large Format
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(FORMAT_DETAILS) as (keyof typeof FORMAT_DETAILS)[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        soundFx.buttonClick();
                        setSelectedFormat(fmt);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedFormat === fmt
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono-tech">{fmt}</span>
                        <span className="text-xs font-bold font-mono-tech text-amber-400">
                          ${FORMAT_DETAILS[fmt].price.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
                        {FORMAT_DETAILS[fmt].desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Date & Showtime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono-tech text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    2. Select Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dates.map((d, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundFx.buttonClick();
                          setSelectedDateIndex(idx);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          selectedDateIndex === idx
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold font-mono-tech block text-slate-200">
                          {d.label}
                        </span>
                        <span className="text-[11px] font-mono-tech text-cyan-300 block">
                          {d.date}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtime Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono-tech text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    3. Showtime (Auditorium 4)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {showtimes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          soundFx.buttonClick();
                          setSelectedTime(t);
                        }}
                        className={`p-2 rounded-xl border text-center font-mono-tech text-xs transition-all ${
                          selectedTime === t
                            ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-600/20'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Interactive Seat Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-mono-tech text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    4. Choose Seats ({selectedSeats.length} Selected)
                  </label>
                  <div className="flex items-center gap-3 text-[10px] font-mono-tech text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block" />
                      Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800 text-slate-600 inline-block" />
                      Occupied
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-center space-y-3">
                  {/* Theater Screen Curved Banner */}
                  <div className="relative pb-2">
                    <div className="h-1.5 w-3/4 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full opacity-80" />
                    <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest block pt-1">
                      SCREEN / SACRED TIMELINE PROJECTION
                    </span>
                  </div>

                  {/* Seat Grid */}
                  <div className="flex flex-col gap-1.5 items-center justify-center pt-1">
                    {rows.map((row) => (
                      <div key={row} className="flex items-center gap-1.5">
                        <span className="w-4 text-[10px] font-mono-tech text-slate-500 font-bold">{row}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((seatNum) => {
                            const seatId = `${row}-${seatNum}`;
                            const isOccupied = occupiedSeats.has(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => toggleSeat(seatId)}
                                className={`w-6 h-6 rounded text-[9px] font-mono-tech font-bold transition-transform flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 scale-110 shadow-md shadow-amber-500/40 ring-2 ring-amber-300'
                                    : isOccupied
                                    ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105 border border-slate-700'
                                }`}
                                title={`Seat ${seatId} - ${isOccupied ? 'Reserved' : isSelected ? 'Selected' : 'Available'}`}
                              >
                                {seatNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs font-mono-tech text-slate-300 flex items-center justify-center gap-2">
                    <span>Selected Seats:</span>
                    <span className="font-bold text-amber-300">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None (Click seats above)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Add Concessions & Guest Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-tech text-slate-200">
                      Infinity Popcorn & Soda Combo
                    </span>
                    <span className="text-xs font-mono-tech font-bold text-amber-400">+$14.50</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Collectible Quantum Tub + Large Fountain Drink with free refills during your showing.
                  </p>
                  <label className="flex items-center gap-2 pt-1 text-xs font-mono-tech text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeConcessions}
                      onChange={(e) => setIncludeConcessions(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>Add to my reservation</span>
                  </label>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-xs font-bold font-mono-tech text-slate-200 block">
                    Ticket Holder Designation
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter Operative Name"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Printed onto your digital ticket stub and booking reservation.
                  </p>
                </div>
              </div>

              {/* Real World Direct Ticket Provider Options */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono-tech text-indigo-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    Book Live Tickets in Real-World Cinemas:
                  </span>
                  <span className="text-[10px] font-mono-tech text-slate-400">USA & Global Outposts</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={movie.fandangoSearchUrl || `https://www.fandango.com/search?q=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono-tech text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Fandango Box Office</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://www.amctheatres.com/search?q=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold font-mono-tech text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>AMC Theatres</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://www.regmovies.com/search?query=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono-tech text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <span>Regal Cinemas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Booking Confirmed - Digital Movie Pass / Collectible Ticket Stub */
            <div className="space-y-4 animate-scale-up">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold font-mono-tech text-emerald-200">
                    RESERVATION CONFIRMED & ISSUED!
                  </h4>
                  <p className="text-xs text-emerald-400/90 font-mono-tech">
                    Your seats have been locked into the Citadel Multiplex database. Keep your confirmation pass below.
                  </p>
                </div>
              </div>

              {/* Official Digital Ticket Stub */}
              <div 
                id="digital-mcu-ticket-stub"
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
              >
                {/* Decorative holographic watermark badge */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-dashed border-slate-700">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-22 object-cover rounded-lg border border-amber-500/40 shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase font-bold text-amber-400 tracking-wider">
                        MARVEL STUDIOS CINEMATIC PASS
                      </span>
                      <h3 className="text-xl font-black font-mono-tech text-white leading-tight">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-xs font-mono-tech">
                          {confirmedBooking?.format}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-tech">
                          Citadel Auditorium 4
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto font-mono-tech">
                    <span className="text-[10px] text-slate-400 block uppercase">Confirmation Code</span>
                    <span className="text-base font-black text-amber-300 tracking-wider">
                      {confirmedBooking?.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">DATE</span>
                    <span className="font-bold text-white">{confirmedBooking?.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SHOWTIME</span>
                    <span className="font-bold text-cyan-300">{confirmedBooking?.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SEATS</span>
                    <span className="font-bold text-amber-300">{confirmedBooking?.seats.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">TOTAL PAID</span>
                    <span className="font-bold text-emerald-400">${confirmedBooking?.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Scannable Barcode & QR code graphic */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
                    <QrCode className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-200 font-bold block">Holder: {confirmedBooking?.guestName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Present at ticket scanner or popcorn kiosk</span>
                    </div>
                  </div>

                  {/* Simulated barcode */}
                  <div className="font-mono text-center tracking-widest text-slate-500 text-xs">
                    ||||| ||| ||||||| |||| |||||| |||||||||| ||||
                    <span className="block text-[9px] text-slate-400 mt-0.5">VALID FOR ADMISSION</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Confirmed Pass */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetForNewBooking}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono-tech transition-colors"
                >
                  Book Another Showing
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={movie.fandangoSearchUrl || `https://www.fandango.com/search?q=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono-tech flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <span>Purchase on Fandango</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs font-mono-tech transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer (when not booked yet) */}
        {!isBooked && (
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
            <div className="font-mono-tech">
              <span className="text-[10px] text-slate-400 block">TOTAL RESERVATION</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-amber-400">${grandTotal.toFixed(2)}</span>
                <span className="text-[11px] text-slate-500">({selectedSeats.length} seats)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono-tech transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleConfirmBooking}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold flex items-center gap-2 transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>CONFIRM & BOOK YOUR TICKETS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
