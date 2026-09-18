import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Clock,
  Send,
  Zap,
  Shield,
  Wrench,
  Sparkles,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { CoPilotPersona, CoPilotAutomations } from '../types/battleworld';
import { COPILOT_QUOTES } from '../data/battleworldData';
import { ColonyResources, ColonyBuilding } from '../types';
import { soundFx } from '../utils/audio';

interface AutonomousCoPilotWidgetProps {
  resources: ColonyResources;
  setResources: React.Dispatch<React.SetStateAction<ColonyResources>>;
  buildings: ColonyBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<ColonyBuilding[]>>;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'danger' | 'crisis') => void;
  gameSpeed: number;
  onOpenChatbot?: () => void;
}

export const AutonomousCoPilotWidget: React.FC<AutonomousCoPilotWidgetProps> = ({
  resources,
  setResources,
  buildings,
  setBuildings,
  addLog,
  onOpenChatbot,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [persona, setPersona] = useState<CoPilotPersona>('herbie');
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<string>(
    COPILOT_QUOTES.herbie[0]
  );
  const [commandInput, setCommandInput] = useState<string>('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);

  // Autonomous Routine Toggles
  const [automations, setAutomations] = useState<CoPilotAutomations>({
    autoIncursionSuppress: true,
    autoNaniteRepair: false,
    autoArcRegulator: true,
    autoLoomAnchor: false,
  });

  // Cycle quote periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const quotes = COPILOT_QUOTES[persona];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
    }, 28000);
    return () => clearInterval(interval);
  }, [persona]);

  // Handle autonomous background routines
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Auto Incursion Suppress when threat > 65%
      if (automations.autoIncursionSuppress && resources.incursionThreat > 65) {
        if (resources.power >= 50) {
          setResources((prev) => ({
            ...prev,
            power: Math.max(0, prev.power - 50),
            incursionThreat: Math.max(0, prev.incursionThreat - 12),
          }));
          addLog(
            `[CO-PILOT AUTO] ${persona === 'herbie' ? 'H.E.R.B.I.E.' : 'Miss Minutes'} fired emergency incursion dampener (-12% threat).`,
            'info'
          );
        }
      }

      // 2. Auto Nanite Repair when any building < 60% health
      if (automations.autoNaniteRepair && resources.scrap >= 40) {
        const hasDamaged = buildings.some((b) => b.health < 60);
        if (hasDamaged) {
          setBuildings((prev) =>
            prev.map((b) => (b.health < 60 ? { ...b, health: Math.min(100, b.health + 25) } : b))
          );
          setResources((prev) => ({ ...prev, scrap: Math.max(0, prev.scrap - 40) }));
          addLog(
            `[CO-PILOT AUTO] H.E.R.B.I.E. automated nanite drones repaired damaged colony structures!`,
            'info'
          );
        }
      }
    }, 12000);

    return () => clearInterval(timer);
  }, [automations, resources.incursionThreat, resources.power, resources.scrap, buildings, persona, addLog, setBuildings, setResources]);

  // Voice synthesis if enabled
  const speakQuote = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = persona === 'herbie' ? 1.5 : 1.2;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  };

  // Toggle Persona
  const handleTogglePersona = () => {
    const next = persona === 'herbie' ? 'miss_minutes' : 'herbie';
    setPersona(next);
    const quotes = COPILOT_QUOTES[next];
    const newQuote = quotes[0];
    setCurrentQuote(newQuote);
    soundFx.playClick();
    speakQuote(newQuote);
  };

  // Execute Natural Language Commands
  const handleExecuteCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    soundFx.playClick();
    setLastExecutedCommand(rawCmd);
    setCommandInput('');

    if (cmd.includes('suppress') || cmd.includes('incursion') || cmd.includes('threat')) {
      // Suppress incursion
      setResources((prev) => ({
        ...prev,
        incursionThreat: Math.max(0, prev.incursionThreat - 20),
        power: Math.max(0, prev.power - 60),
      }));
      const reply = `${persona === 'herbie' ? 'H.E.R.B.I.E.' : 'Miss Minutes'}: Incursion dampeners fired! Threat lowered by -20%.`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Executed: Suppress Incursion. Threat reduced by 20%.`, 'success');
      soundFx.playSuccess();
    } else if (cmd.includes('repair') || cmd.includes('nanite') || cmd.includes('health') || cmd.includes('fix')) {
      // Repair all buildings
      setBuildings((prev) => prev.map((b) => ({ ...b, health: 100 })));
      setResources((prev) => ({ ...prev, scrap: Math.max(0, prev.scrap - 50) }));
      const reply = `${persona === 'herbie' ? 'BEEP-BOOP!' : 'Howdy!'} All colony structures fully restored to 100% integrity!`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Executed: Nanite Protocol. All structures restored to 100%.`, 'success');
      soundFx.playSuccess();
    } else if (cmd.includes('power') || cmd.includes('overcharge') || cmd.includes('energy') || cmd.includes('max')) {
      // Overcharge arc power
      setResources((prev) => ({
        ...prev,
        power: prev.maxPower,
        defenseRating: prev.defenseRating + 25,
      }));
      const reply = `${persona === 'herbie' ? 'WHIRRR-CLICK:' : 'Sweet as pie!'} Arc Reactor grid overcharged to maximum capacity!`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Executed: Arc Overcharge. Power capped at 100%.`, 'success');
      soundFx.playSuccess();
    } else if (cmd.includes('freeze') || cmd.includes('clock') || cmd.includes('doomsday') || cmd.includes('loom')) {
      // Loom Stasis
      setResources((prev) => ({
        ...prev,
        chronoCores: prev.chronoCores + 2,
        incursionThreat: Math.max(0, prev.incursionThreat - 15),
      }));
      const reply = `Miss Minutes: TVA chronometric lock engaged! Doomsday entropy pushed back!`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Executed: TVA Temporal Anchor engaged!`, 'success');
      soundFx.playSuccess();
    } else if (cmd.includes('summon') || cmd.includes('champion') || cmd.includes('hero') || cmd.includes('reed') || cmd.includes('wolverine')) {
      setResources((prev) => ({
        ...prev,
        multiverseInfluence: prev.multiverseInfluence + 60,
        chronoCores: prev.chronoCores + 1,
      }));
      const reply = `Multiverse distress beacon broadcasted! Multiverse champion resonance bolstered (+60 Influence).`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Executed: Multiverse Champion Beacon.`, 'success');
      soundFx.playSuccess();
    } else {
      // General affirmative response
      setResources((prev) => ({ ...prev, morale: Math.min(100, prev.morale + 5) }));
      const reply = `${persona === 'herbie' ? 'H.E.R.B.I.E.' : 'Miss Minutes'}: Directives acknowledged. Colony operations synchronized!`;
      setCurrentQuote(reply);
      speakQuote(reply);
      addLog(`[COMMAND] Co-Pilot synchronized colony command: "${rawCmd}".`, 'info');
      soundFx.playSuccess();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              soundFx.playClick();
            }}
            title="Open H.E.R.B.I.E. & Miss Minutes Autonomous AI Co-Pilot"
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-mono-tech font-bold text-xs shadow-2xl shadow-purple-600/50 border border-purple-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105"
          >
            {/* Pulsing indicator orb */}
            <div className="relative w-7 h-7 rounded-full bg-slate-950/80 border border-white/40 flex items-center justify-center shrink-0">
              {persona === 'herbie' ? (
                <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
              )}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-[11px] leading-tight font-extrabold text-white flex items-center gap-1.5">
                <span>AI CO-PILOT</span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[9px]">ONLINE</span>
              </div>
              <div className="text-[9px] text-cyan-200 font-sans opacity-90">
                {persona === 'herbie' ? 'H.E.R.B.I.E. (Earth-828)' : 'Miss Minutes (TVA)'}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Expanded Autonomous Co-Pilot Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] max-w-full bg-slate-950/95 border border-purple-500/50 rounded-2xl shadow-2xl shadow-black/90 backdrop-blur-xl overflow-hidden font-sans flex flex-col transition-all">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                  persona === 'herbie'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                    : 'bg-amber-600/30 border-amber-400 text-amber-300'
                }`}
              >
                {persona === 'herbie' ? <Bot className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold font-mono-tech text-white">
                    {persona === 'herbie' ? 'H.E.R.B.I.E. AUTOMATON' : 'MISS MINUTES (TVA)'}
                  </h3>
                  <button
                    onClick={handleTogglePersona}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700 font-mono"
                    title="Switch between H.E.R.B.I.E. and Miss Minutes"
                  >
                    SWAP ⇄
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 font-mono-tech">
                  {persona === 'herbie'
                    ? 'Earth-828 Retro-Futuristic Assistant'
                    : 'TVA Omniversal Timeline Liaison'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenChatbot && (
                <button
                  onClick={() => {
                    onOpenChatbot();
                    soundFx.playClick();
                  }}
                  className="px-2 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono-tech flex items-center gap-1 transition"
                  title="Open full conversational Gemini AI Colony Guide Chatbot"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">CHATBOT</span>
                </button>
              )}

              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  speechEnabled
                    ? 'bg-purple-600/40 text-purple-300 border-purple-500'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
                title="Toggle Text-to-Speech Voice"
              >
                {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto scrollbar-thin">
              {/* Animated Live Speech Bubble */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed relative ${
                  persona === 'herbie'
                    ? 'bg-blue-950/30 border-blue-500/30 text-blue-100'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-100'
                }`}
              >
                <div className="text-[10px] font-mono-tech font-bold uppercase mb-1 opacity-75">
                  {persona === 'herbie' ? '🤖 H.E.R.B.I.E. TRANSMISSION' : '⏱️ MISS MINUTES SAYS'}
                </div>
                {currentQuote}
              </div>

              {/* Real-time Diagnostics Mini Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">INCURSION RISK</div>
                  <div className="text-rose-400 font-bold text-sm">
                    {Math.round(resources.incursionThreat)}%
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ARC POWER GRID</div>
                  <div className="text-cyan-400 font-bold text-sm">
                    {Math.round(resources.power)} / {resources.maxPower}
                  </div>
                </div>
              </div>

              {/* 4 Autonomous Protocol Toggles */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono-tech text-slate-400 font-bold uppercase tracking-wider">
                  AUTONOMOUS DIRECTIVES (AUTO-PILOT):
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setAutomations((prev) => ({
                        ...prev,
                        autoIncursionSuppress: !prev.autoIncursionSuppress,
                      }))
                    }
                    className={`p-2 rounded-xl text-left border text-[11px] font-mono-tech transition ${
                      automations.autoIncursionSuppress
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>INCURSION SUPPRESS</span>
                      <span>{automations.autoIncursionSuppress ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Fires when threat &gt; 65%
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setAutomations((prev) => ({
                        ...prev,
                        autoNaniteRepair: !prev.autoNaniteRepair,
                      }))
                    }
                    className={`p-2 rounded-xl text-left border text-[11px] font-mono-tech transition ${
                      automations.autoNaniteRepair
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>NANITE REPAIRS</span>
                      <span>{automations.autoNaniteRepair ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Fixes damaged sectors
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setAutomations((prev) => ({
                        ...prev,
                        autoArcRegulator: !prev.autoArcRegulator,
                      }))
                    }
                    className={`p-2 rounded-xl text-left border text-[11px] font-mono-tech transition ${
                      automations.autoArcRegulator
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>ARC REGULATOR</span>
                      <span>{automations.autoArcRegulator ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Prevents blackout surge
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setAutomations((prev) => ({
                        ...prev,
                        autoLoomAnchor: !prev.autoLoomAnchor,
                      }))
                    }
                    className={`p-2 rounded-xl text-left border text-[11px] font-mono-tech transition ${
                      automations.autoLoomAnchor
                        ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>LOOM ANCHOR</span>
                      <span>{automations.autoLoomAnchor ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Slows Doomsday Clock
                    </div>
                  </button>
                </div>
              </div>

              {/* Natural Language Command Bar */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[10px] font-mono-tech text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  PROMPT / COMMAND CONSOLE:
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteCommand(commandInput);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="e.g. 'suppress incursion', 'repair buildings', 'max power'..."
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shrink-0"
                    title="Send Command"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Quick Command Suggestion Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Suppress Incursion',
                    'Repair Buildings',
                    'Overcharge Power',
                    'Freeze Doomsday Clock',
                    'Summon Champion',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleExecuteCommand(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-mono-tech text-cyan-300 border border-slate-800 transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
