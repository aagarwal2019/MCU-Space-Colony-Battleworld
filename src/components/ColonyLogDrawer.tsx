import React from 'react';
import { 
  ScrollText, 
  X, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Flame,
  Clock
} from 'lucide-react';
import { GameLogEntry } from '../types';

interface ColonyLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: GameLogEntry[];
}

export const ColonyLogDrawer: React.FC<ColonyLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  const getLogIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'danger':
      case 'crisis':
        return <Flame className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const getLogBorder = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'success': return 'border-emerald-500/30 bg-emerald-950/20';
      case 'warning': return 'border-amber-500/30 bg-amber-950/20';
      case 'danger':
      case 'crisis': return 'border-rose-500/40 bg-rose-950/30';
      default: return 'border-slate-800 bg-slate-950/60';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">
                COLONY DISPATCH LOGS
              </h3>
              <span className="text-xs text-slate-400 font-mono-tech">
                Chronological record of events & milestones
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-8">
              No logged transmissions yet. Colony systems nominal.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 transition text-xs ${getLogBorder(log.type)}`}
              >
                {getLogIcon(log.type)}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-tech mb-0.5">
                    <span>CYCLE {log.cycle}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
