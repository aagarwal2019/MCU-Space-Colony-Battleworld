import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  Film, 
  Terminal, 
  Info, 
  X, 
  ChevronRight,
  Shield,
  Zap,
  Globe,
  RefreshCw,
  Eye
} from 'lucide-react';
import { MCUHero, MCUHeroPhotoData } from '../types';
import { HeroInsignia } from './HeroInsignia';

interface MCUPhotosApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHeroId?: string | null;
  heroes: MCUHero[];
  onSelectHeroForTactical?: (hero: MCUHero) => void;
  onOpenMCUIntel?: (query: string) => void;
}

export const MCUPhotosApiModal: React.FC<MCUPhotosApiModalProps> = ({
  isOpen,
  onClose,
  initialHeroId,
  heroes,
  onSelectHeroForTactical,
  onOpenMCUIntel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'hero' | 'villain' | 'antihero'>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedHeroId, setSelectedHeroId] = useState<string>(initialHeroId || 'iron_man');
  
  // API Test state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [liveApiResponse, setLiveApiResponse] = useState<MCUHeroPhotoData | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'preview' | 'json' | 'html' | 'curl'>('preview');

  // Update selected hero if prop changes
  useEffect(() => {
    if (initialHeroId) {
      setSelectedHeroId(initialHeroId);
    }
  }, [initialHeroId]);

  // Fetch live API data when selectedHeroId changes
  useEffect(() => {
    if (!isOpen || !selectedHeroId) return;

    let isMounted = true;
    setIsLoadingApi(true);

    fetch(`/api/heroes/${selectedHeroId}/photo`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setLiveApiResponse(data);
          setIsLoadingApi(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch from /api/heroes/:id/photo:', err);
        if (isMounted) {
          setIsLoadingApi(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedHeroId, isOpen]);

  // Filtered heroes list
  const filteredHeroes = useMemo(() => {
    return heroes.filter((h) => {
      const matchSearch =
        !searchQuery ||
        h.heroName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedType === 'all' || h.characterType === selectedType;
      const matchRole = selectedRole === 'all' || h.role === selectedRole;

      return matchSearch && matchType && matchRole;
    });
  }, [heroes, searchQuery, selectedType, selectedRole]);

  const activeHero = useMemo(() => {
    return heroes.find((h) => h.id === selectedHeroId) || heroes[0];
  }, [heroes, selectedHeroId]);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const jsonApiUrl = `${originUrl}/api/heroes/${activeHero?.id || 'iron_man'}/photo`;
  const rawImageApiUrl = `${originUrl}/api/heroes/${activeHero?.id || 'iron_man'}/photo?format=image`;
  const catalogApiUrl = `${originUrl}/api/mcu/photos`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-fadeIn"
      id="mcu-photos-api-modal"
    >
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
        id="mcu-photos-api-container"
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold font-display text-white tracking-wide">
                  MCU Character Photos & Profile Picture API
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono-tech">
                  REST API v1
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono-tech">
                  56 Canonical Characters
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Query high-resolution official MCU portraits via HTTP API in JSON metadata or raw binary image streams.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            id="close-photos-api-btn"
            title="Close Photos API HUD"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Catalog API banner */}
        <div className="px-5 py-2.5 bg-cyan-950/30 border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-mono-tech">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold">Catalog Endpoint:</span>
            <code className="bg-slate-950/80 px-2 py-0.5 rounded text-cyan-200 border border-cyan-800/60">
              GET /api/mcu/photos
            </code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(catalogApiUrl, 'catalog')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono-tech flex items-center gap-1 transition"
            >
              {copiedKey === 'catalog' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy Catalog URL</span>
            </button>
            <a
              href="/api/mcu/photos"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/40 text-[11px] font-mono-tech flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open Catalog JSON</span>
            </a>
          </div>
        </div>

        {/* Main Body - Two Column Explorer */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Hero Selector & Search (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col min-h-0 bg-slate-950/40">
            {/* Search and Filters */}
            <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search character (e.g. Iron Man, Deadpool, Doom)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono-tech">
                <span className="text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                </span>
                {(['all', 'hero', 'antihero', 'villain'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition ${
                      selectedType === type
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Heroes Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar min-h-0 max-h-[35vh] lg:max-h-none">
              {filteredHeroes.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No MCU characters matched your filter.
                </div>
              ) : (
                filteredHeroes.map((hero) => {
                  const isSelected = hero.id === selectedHeroId;
                  const directImgSrc = `/api/heroes/${hero.id}/photo?format=image`;

                  return (
                    <button
                      key={hero.id}
                      onClick={() => setSelectedHeroId(hero.id)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between gap-3 text-left transition border ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500/50 shadow-md shadow-cyan-950/30 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                      }`}
                      id={`hero-photo-select-${hero.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Profile Picture thumbnail served via API */}
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700 relative">
                          <img
                            src={directImgSrc}
                            alt={hero.heroName}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform hover:scale-110"
                            onError={(e) => {
                              // Fallback if local stream unavailable
                              if (hero.imageUrl && (e.currentTarget.src !== hero.imageUrl)) {
                                e.currentTarget.src = hero.imageUrl;
                              }
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold font-display truncate">
                              {hero.heroName}
                            </span>
                            <span className={`text-[9px] px-1 py-0.2 rounded font-mono-tech uppercase ${
                              hero.characterType === 'villain'
                                ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                                : hero.characterType === 'antihero'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            }`}>
                              {hero.characterType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {hero.name} · <span className="font-mono-tech text-[10px] text-slate-500">{hero.id}</span>
                          </p>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* List Footer Count */}
            <div className="p-2 border-t border-slate-800 text-[11px] font-mono-tech text-slate-500 flex items-center justify-between bg-slate-950/80">
              <span>Showing {filteredHeroes.length} of {heroes.length} characters</span>
              <span className="text-cyan-400">Endpoint: /api/heroes/:id/photo</span>
            </div>
          </div>

          {/* Right Column: Interactive Photo API Inspector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-900/80 overflow-y-auto">
            {activeHero && (
              <div className="p-4 sm:p-6 space-y-5">
                
                {/* Hero Header & Live Photo Preview Card */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Live Profile Picture from API */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 overflow-hidden shrink-0 border-2 border-cyan-500/50 shadow-xl shadow-cyan-950/50 relative group">
                      <img
                        src={`/api/heroes/${activeHero.id}/photo?format=image`}
                        alt={activeHero.heroName}
                        className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          if (activeHero.imageUrl && e.currentTarget.src !== activeHero.imageUrl) {
                            e.currentTarget.src = activeHero.imageUrl;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-1">
                        <span className="text-[9px] font-mono-tech text-cyan-300 bg-slate-950/80 px-1 rounded">
                          API Stream
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold font-display text-white">
                          {activeHero.heroName}
                        </h3>
                        <span className="text-xs text-slate-400">({activeHero.name})</span>
                      </div>
                      <p className="text-xs text-cyan-400 font-mono-tech mt-0.5">
                        {activeHero.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                        «{activeHero.quote}»
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-tech border border-slate-700">
                          ID: {activeHero.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-tech border border-slate-700">
                          Origin: {activeHero.movieOrigin}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this hero */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`/api/heroes/${activeHero.id}/photo?format=image`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono-tech flex items-center justify-center gap-1.5 transition shadow-sm"
                      title="Open direct photo in browser tab"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Image</span>
                    </a>

                    {onOpenMCUIntel && (
                      <button
                        onClick={() => {
                          onOpenMCUIntel(activeHero.wikiSlug || activeHero.heroName);
                          onClose();
                        }}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono-tech flex items-center justify-center gap-1.5 transition"
                      >
                        <Film className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Wiki Dossier</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* API Endpoints Showcase & Quick Copy Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 font-mono-tech uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Direct Photo API Endpoints</span>
                    </h4>
                    {isLoadingApi && (
                      <span className="text-[10px] font-mono-tech text-cyan-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Querying MCU photo...
                      </span>
                    )}
                  </div>

                  {/* Endpoint 1: Raw Image Direct Stream */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold">
                          IMAGE
                        </span>
                        <span className="text-xs font-mono-tech text-slate-200 truncate">
                          GET /api/heroes/{activeHero.id}/photo?format=image
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => copyToClipboard(rawImageApiUrl, 'imgUrl')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono-tech flex items-center gap-1 transition"
                          title="Copy direct image URL"
                        >
                          {copiedKey === 'imgUrl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                        <a
                          href={`/api/heroes/${activeHero.id}/photo?format=image`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                          title="Test in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Streams the actual binary image directly with caching and CORS headers. Perfect for standard <code className="text-cyan-300">&lt;img src="..."&gt;</code> tags.
                    </p>
                  </div>

                  {/* Endpoint 2: JSON Profile Data */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
                          JSON
                        </span>
                        <span className="text-xs font-mono-tech text-slate-200 truncate">
                          GET /api/heroes/{activeHero.id}/photo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => copyToClipboard(jsonApiUrl, 'jsonUrl')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono-tech flex items-center gap-1 transition"
                          title="Copy JSON API URL"
                        >
                          {copiedKey === 'jsonUrl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                        <a
                          href={`/api/heroes/${activeHero.id}/photo`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                          title="Test JSON in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Returns full structured metadata: high-res MCU Wiki image URL, thumbnail, wiki link, character type, role, and titles.
                    </p>
                  </div>
                </div>

                {/* Inspector Tabs (Preview | JSON Response | HTML Embed | cURL) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      {(['preview', 'json', 'html', 'curl'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveInspectorTab(tab)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono-tech uppercase transition ${
                            activeInspectorTab === tab
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          {tab === 'preview' ? 'Visual Output' : tab === 'json' ? 'Live JSON' : tab === 'html' ? 'HTML Embed' : 'cURL'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const contentToCopy =
                          activeInspectorTab === 'json'
                            ? JSON.stringify(liveApiResponse || activeHero, null, 2)
                            : activeInspectorTab === 'html'
                            ? `<img src="${rawImageApiUrl}" alt="${activeHero.heroName}" width="200" />`
                            : activeInspectorTab === 'curl'
                            ? `curl -s "${jsonApiUrl}" | jq`
                            : rawImageApiUrl;
                        copyToClipboard(contentToCopy, activeInspectorTab);
                      }}
                      className="text-[11px] font-mono-tech text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === activeInspectorTab ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Code</span>
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeInspectorTab === 'preview' && (
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-36 h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 shadow-lg relative group">
                        <img
                          src={`/api/heroes/${activeHero.id}/photo?format=image`}
                          alt={activeHero.heroName}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono-tech text-cyan-300 border border-cyan-800/60">
                          LIVE API
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-sans text-slate-300 min-w-0">
                        <div>
                          <span className="font-semibold text-white">Subject:</span> {activeHero.heroName} ({activeHero.name})
                        </div>
                        <div>
                          <span className="font-semibold text-white">Canonical Source:</span> {liveApiResponse?.source || 'Marvel Cinematic Universe Official Profile Photo'}
                        </div>
                        <div>
                          <span className="font-semibold text-white">Direct Image URL:</span>
                          <p className="font-mono-tech text-[11px] text-cyan-300 break-all mt-0.5">
                            {liveApiResponse?.imageUrl || activeHero.imageUrl}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-white">Wiki Article:</span>
                          <p className="font-mono-tech text-[11px] text-slate-400 break-all mt-0.5">
                            {liveApiResponse?.wikiUrl || `https://marvelcinematicuniverse.fandom.com/wiki/${activeHero.wikiSlug || activeHero.id}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInspectorTab === 'json' && (
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <pre className="p-4 text-[11px] font-mono-tech text-cyan-300 overflow-x-auto max-h-64 custom-scrollbar">
                        {JSON.stringify(liveApiResponse || {
                          success: true,
                          heroId: activeHero.id,
                          heroName: activeHero.heroName,
                          realName: activeHero.name,
                          characterType: activeHero.characterType,
                          role: activeHero.role,
                          title: activeHero.title,
                          imageUrl: activeHero.imageUrl,
                          thumbnailUrl: activeHero.imageUrl,
                          rawImageEndpoint: `/api/heroes/${activeHero.id}/photo?format=image`,
                          jsonEndpoint: `/api/heroes/${activeHero.id}/photo`,
                          wikiUrl: `https://marvelcinematicuniverse.fandom.com/wiki/${activeHero.wikiSlug || activeHero.id}`,
                          movieOrigin: activeHero.movieOrigin,
                          quote: activeHero.quote,
                          source: 'Marvel Cinematic Universe Official Profile Photo & MediaWiki Action API',
                        }, null, 2)}
                      </pre>
                    </div>
                  )}

                  {activeInspectorTab === 'html' && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <p className="text-xs text-slate-400 font-sans">
                        Embed this character's photo directly in your website, documentation, or dashboard:
                      </p>
                      <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono-tech text-amber-300 overflow-x-auto">
{`<!-- Official MCU Profile Picture for ${activeHero.heroName} -->
<img 
  src="${rawImageApiUrl}" 
  alt="${activeHero.heroName} Profile Picture" 
  width="240" 
  height="300"
  style="object-fit: cover; border-radius: 12px;"
/>`}
                      </pre>
                    </div>
                  )}

                  {activeInspectorTab === 'curl' && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <p className="text-xs text-slate-400 font-sans">
                        Query character metadata or pipe the image binary directly in your terminal:
                      </p>
                      <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono-tech text-emerald-400 overflow-x-auto">
{`# 1. Fetch JSON metadata with full image URL & canon details:
curl -s "${jsonApiUrl}" | jq

# 2. Download and save the official profile picture image directly:
curl -s "${rawImageApiUrl}" -o "${activeHero.id}_mcu_photo.webp"`}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">API BASE:</span>
            <code className="text-cyan-400 font-bold">/api/heroes/:id/photo</code>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">FORMATS:</span>
            <code className="text-slate-300">image/webp, image/jpeg, application/json</code>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            DISMISS API HUD
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCUPhotosApiModal;
