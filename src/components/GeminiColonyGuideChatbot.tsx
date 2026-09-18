import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  Shield,
  Zap,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  Cpu,
  Swords,
  Crown
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ColonyResources, ColonyBuilding, MCUHero } from '../types';
import { soundFx } from '../utils/audio';

export type GuideRole = 'friday' | 'miss_minutes' | 'herbie' | 'grandmaster';
export type GeminiModel = 
  | 'gemini-3.8-flash' 
  | 'gemini-3.5-flash' 
  | 'gemini-3.1-flash-lite' 
  | 'gemini-3.1-pro-preview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  model?: string;
  guideRole?: GuideRole;
  isLiveAI?: boolean;
}

interface GeminiColonyGuideChatbotProps {
  resources: ColonyResources;
  buildings: ColonyBuilding[];
  heroes: MCUHero[];
  activeCrisisName: string | null;
  doomsdaySeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

const CHAT_STORAGE_KEY = 'sakaar_gemini_guide_chat_v1';

const ROLE_METADATA: Record<GuideRole, {
  name: string;
  badge: string;
  title: string;
  desc: string;
  avatarBg: string;
  accentBorder: string;
  accentText: string;
  greeting: string;
}> = {
  friday: {
    name: 'F.R.I.D.A.Y.',
    badge: 'STARK TACTICAL AI',
    title: 'Stark Colony Operations Advisor',
    desc: 'Real-time telemetry, energy optimization, incursion defense',
    avatarBg: 'bg-cyan-600/30 border-cyan-400 text-cyan-300',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    greeting: "Right then, Boss! F.R.I.D.A.Y. online. Sensors are locked onto your Sakaar Colony telemetry. Ask me anything about building priorities, managing the incursion threat, or surviving the scrap wastes.",
  },
  miss_minutes: {
    name: 'Miss Minutes',
    badge: 'TVA TIMELINE LIAISON',
    title: 'Time Variance Authority Guide',
    desc: 'Doomsday Clock regulation, chronometric anomalies, pruning threats',
    avatarBg: 'bg-amber-600/30 border-amber-400 text-amber-300',
    accentBorder: 'border-amber-500/40',
    accentText: 'text-amber-400',
    greeting: "Well hey there, y'all! Miss Minutes here to make sure your Sakaar colony doesn't unravel the Sacred Timeline! Got questions about the Avengers: Doomsday Clock or how to bag more Chrono-Cores?",
  },
  herbie: {
    name: 'H.E.R.B.I.E.',
    badge: 'EARTH-828 BAXTER AI',
    title: 'Fantastic Four Science Automaton',
    desc: "Doctor Doom's Relic Forge, antimatter conduits, tech tree",
    avatarBg: 'bg-blue-600/30 border-blue-400 text-blue-300',
    accentBorder: 'border-blue-500/40',
    accentText: 'text-blue-400',
    greeting: "*BEEP-BOOP-WHIRRR!* H.E.R.B.I.E. ready to compute! Mister Fantastic calibrated my neural cores for cosmic relic forging, sector engineering, and antimatter energy containment. How may I assist your mission, Commander?",
  },
  grandmaster: {
    name: 'The Grandmaster',
    badge: 'SAKAAR MASTER OF CEREMONIES',
    title: 'Ruler of Sakaar & Arena Host',
    desc: 'Champion gladiators, black market trading, scrap recycling',
    avatarBg: 'bg-purple-600/30 border-purple-400 text-purple-300',
    accentBorder: 'border-purple-500/40',
    accentText: 'text-purple-400',
    greeting: "Ah, my magnificent champion! Look at you, carving out this charming little scrap empire in my garbage wonderland! Ask me about hiring my prized gladiator champions or getting rich off the scrap heap!",
  }
};

const SUGGESTED_QUESTIONS: Record<GuideRole, string[]> = {
  friday: [
    'How do I lower the Incursion Threat?',
    'What building should I upgrade first?',
    'How can I fix my colony power deficit?',
    'Which hero abilities synergize best?'
  ],
  miss_minutes: [
    'How do I slow the Avengers: Doomsday Clock?',
    'What do Chrono-Cores do and where do I find them?',
    'How do I close multiversal reality rifts?',
    'What happens if the Doomsday Clock reaches zero?'
  ],
  herbie: [
    "How does Doctor Doom's Cosmic Relic Forge work?",
    'Which relic synergy gives the highest defense?',
    'How do I unlock the Baxter Antimatter Singularity?',
    'What are the optimal research tech paths?'
  ],
  grandmaster: [
    'Which champion gladiator is the strongest?',
    'How do I make a fortune trading on the Black Market?',
    'How do I handle scrap raider invasions?',
    'Why is Hulk the reigning Contest of Champions king?'
  ]
};

export const GeminiColonyGuideChatbot: React.FC<GeminiColonyGuideChatbotProps> = ({
  resources,
  buildings,
  heroes,
  activeCrisisName,
  doomsdaySeconds = 180,
  isOpen,
  onClose,
  onOpen
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse error
    }
    return [
      {
        id: 'initial_welcome',
        role: 'model',
        content: ROLE_METADATA.friday.greeting,
        timestamp: Date.now(),
        guideRole: 'friday',
        model: 'gemini-3.8-flash',
        isLiveAI: false,
      }
    ];
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guideRole, setGuideRole] = useState<GuideRole>('friday');
  const [model, setModel] = useState<GeminiModel>('gemini-3.8-flash');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Optional Voice Output
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for cleaner speech
      const clean = text.replace(/[*#_`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(clean);
      if (guideRole === 'friday') {
        utterance.pitch = 1.1;
        utterance.rate = 1.05;
      } else if (guideRole === 'miss_minutes') {
        utterance.pitch = 1.35;
        utterance.rate = 1.0;
      } else if (guideRole === 'herbie') {
        utterance.pitch = 1.6;
        utterance.rate = 1.15;
      } else {
        utterance.pitch = 0.95;
        utterance.rate = 1.1;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech error
    }
  };

  const handleRoleChange = (newRole: GuideRole) => {
    if (newRole === guideRole) return;
    setGuideRole(newRole);
    soundFx.playClick();
    
    // Add role announcement message
    const roleMeta = ROLE_METADATA[newRole];
    const greetingMsg: ChatMessage = {
      id: `role_change_${Date.now()}`,
      role: 'model',
      content: roleMeta.greeting,
      timestamp: Date.now(),
      guideRole: newRole,
      model,
      isLiveAI: false,
    };
    setMessages((prev) => [...prev, greetingMsg]);
    speakText(roleMeta.greeting);
  };

  const handleClearChat = () => {
    soundFx.playClick();
    const fresh: ChatMessage[] = [
      {
        id: `fresh_${Date.now()}`,
        role: 'model',
        content: ROLE_METADATA[guideRole].greeting,
        timestamp: Date.now(),
        guideRole,
        model,
        isLiveAI: false,
      }
    ];
    setMessages(fresh);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleCopy = (id: string, text: string) => {
    soundFx.playClick();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const query = (promptOverride || input).trim();
    if (!query || isLoading) return;

    soundFx.playClick();
    setInput('');

    // User message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    // Build current colony context snapshot
    const colonyContext = {
      scrap: resources.scrap,
      power: resources.power,
      maxPower: resources.maxPower,
      food: resources.food,
      oxygen: resources.oxygen,
      vibraniumCredits: resources.vibraniumCredits,
      chronoCores: resources.chronoCores,
      multiverseInfluence: resources.multiverseInfluence,
      incursionThreat: resources.incursionThreat,
      morale: resources.morale,
      defenseRating: resources.defenseRating,
      activeCrisis: activeCrisisName,
      doomsdaySeconds,
      activeHeroes: heroes.filter((h) => h.assignedBuildingId !== null).map((h) => h.heroName),
      buildingCount: buildings.length,
      cycle: 1,
    };

    try {
      // Send conversation history to server-side Gemini multi-turn endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          guideRole,
          model,
          colonyContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const modelMessage: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        content: data.content || "Operational relay intact. Standing by for commands.",
        timestamp: Date.now(),
        model: data.model || model,
        guideRole,
        isLiveAI: data.isLiveAI ?? false,
      };

      setMessages((prev) => [...prev, modelMessage]);
      soundFx.playSuccess();
      speakText(modelMessage.content);
    } catch (err) {
      console.warn('Chat request failed, using emergency tactical relay:', err);
      // Fallback emergency message
      const fallbackMsg: ChatMessage = {
        id: `model_fallback_${Date.now()}`,
        role: 'model',
        content: `Relay notice: Local transmitter active.\n\n` +
          `Your colony is holding steady at **${Math.round(resources.incursionThreat)}% Incursion Risk** with **${Math.round(resources.power)}/${resources.maxPower} MW** power.\n` +
          `Keep your defenses fortified and construct Arc Reactors to ensure life support and defense cannons remain energized!`,
        timestamp: Date.now(),
        model: 'fallback',
        guideRole,
        isLiveAI: false,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Pill when closed */}
      {!isOpen && (
        <button
          onClick={() => {
            if (onOpen) onOpen();
            soundFx.playClick();
          }}
          title="Open Gemini AI Colony Guide Chatbot"
          className="fixed bottom-20 right-4 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-700 hover:from-cyan-500 hover:to-purple-600 text-white font-mono-tech text-xs font-bold shadow-2xl shadow-cyan-500/40 border border-cyan-400/50 backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <div className="relative w-6 h-6 rounded-full bg-slate-950/80 border border-cyan-400/60 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] leading-tight font-extrabold flex items-center gap-1.5">
              <span>GEMINI AI GUIDE</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-[9px] text-cyan-200">
                CHATBOT
              </span>
            </div>
            <div className="text-[9px] text-cyan-100 font-sans opacity-85">
              Ask F.R.I.D.A.Y., Miss Minutes, H.E.R.B.I.E., or Grandmaster
            </div>
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          id="gemini-guide-chatbot-modal"
          className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[460px] max-w-full bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-black/90 backdrop-blur-xl flex flex-col font-sans overflow-hidden transition-all duration-300"
          style={{ height: isMinimized ? 'auto' : '620px', maxHeight: '88vh' }}
        >
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border ${ROLE_METADATA[guideRole].avatarBg}`}
              >
                {guideRole === 'friday' && <Bot className="w-4 h-4 text-cyan-300" />}
                {guideRole === 'miss_minutes' && <Clock className="w-4 h-4 text-amber-300" />}
                {guideRole === 'herbie' && <Cpu className="w-4 h-4 text-blue-300" />}
                {guideRole === 'grandmaster' && <Crown className="w-4 h-4 text-purple-300" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold font-mono-tech text-white flex items-center gap-1">
                    <span>{ROLE_METADATA[guideRole].name}</span>
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-400/40 text-[9px] font-mono-tech text-cyan-300">
                    {ROLE_METADATA[guideRole].badge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-tech">
                  {ROLE_METADATA[guideRole].title}
                </div>
              </div>
            </div>

            {/* Actions: TTS, Minimize, Close */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  ttsEnabled
                    ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
                title="Toggle Text-to-Speech narration"
              >
                {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                title="Clear conversation history & start fresh"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Controls Bar: Persona Tabs & Model Selector */}
              <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Persona Switcher Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  <span className="text-[10px] font-mono-tech text-slate-500 mr-1 hidden sm:inline">
                    GUIDE:
                  </span>
                  {(['friday', 'miss_minutes', 'herbie', 'grandmaster'] as GuideRole[]).map((r) => {
                    const isActive = guideRole === r;
                    const meta = ROLE_METADATA[r];
                    return (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono-tech font-bold transition whitespace-nowrap border ${
                          isActive
                            ? `${meta.avatarBg} ${meta.accentBorder}`
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {meta.name}
                      </button>
                    );
                  })}
                </div>

                {/* Model Selector Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono-tech text-slate-500 hidden sm:inline">
                    TIER:
                  </span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as GeminiModel)}
                    className="bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400"
                    title="Select Gemini Model Tier"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Standard)</option>
                    <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Colony Telemetry HUD Ribbon */}
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech text-slate-400 shrink-0">
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">SCRAP:</span>
                    <span className="text-amber-400 font-bold">{resources.scrap}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">POWER:</span>
                    <span className={`${resources.power < 30 ? 'text-rose-400 font-bold' : 'text-cyan-400'}`}>
                      {Math.round(resources.power)}/{resources.maxPower}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">INCURSION:</span>
                    <span className={`${resources.incursionThreat > 60 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-300'}`}>
                      {Math.round(resources.incursionThreat)}%
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="text-slate-500">CHRONO:</span>
                    <span className="text-purple-300 font-bold">{resources.chronoCores}</span>
                  </span>
                </div>
                <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SYNCED</span>
                </div>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const roleMeta = msg.guideRole ? ROLE_METADATA[msg.guideRole] : ROLE_METADATA[guideRole];

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 ${roleMeta.avatarBg}`}
                        >
                          {msg.guideRole === 'friday' && <Bot className="w-3 h-3 text-cyan-300" />}
                          {msg.guideRole === 'miss_minutes' && <Clock className="w-3 h-3 text-amber-300" />}
                          {msg.guideRole === 'herbie' && <Cpu className="w-3 h-3 text-blue-300" />}
                          {msg.guideRole === 'grandmaster' && <Crown className="w-3 h-3 text-purple-300" />}
                          {!msg.guideRole && <Sparkles className="w-3 h-3 text-cyan-300" />}
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs font-sans'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {/* Header info on model replies */}
                        {!isUser && (
                          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] font-mono-tech text-slate-400">
                            <span className="font-bold text-cyan-300">
                              {roleMeta.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {msg.isLiveAI && (
                                <span className="px-1 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/40 text-[9px] text-emerald-300">
                                  GEMINI LIVE
                                </span>
                              )}
                              <button
                                onClick={() => handleCopy(msg.id, msg.content)}
                                className="p-0.5 rounded text-slate-500 hover:text-slate-300"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="leading-relaxed prose prose-invert prose-xs max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-1 prose-headings:text-cyan-300">
                          <Markdown>{msg.content}</Markdown>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[9px] text-right mt-1 opacity-60 font-mono-tech">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 text-xs justify-start items-center">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shrink-0 animate-pulse">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs font-mono-tech flex items-center gap-2">
                      <span>{ROLE_METADATA[guideRole].name} is analyzing colony data...</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggestion Pills */}
              <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[9px] font-mono-tech text-slate-500 shrink-0">TIPS:</span>
                {SUGGESTED_QUESTIONS[guideRole].map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSubmit(undefined, q)}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-mono-tech text-cyan-300 whitespace-nowrap transition shrink-0"
                  >
                    + {q}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="p-3 bg-slate-950 border-t border-cyan-500/20 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder={`Ask ${ROLE_METADATA[guideRole].name} for advice...`}
                  className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition shrink-0 shadow-md shadow-cyan-500/30"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
