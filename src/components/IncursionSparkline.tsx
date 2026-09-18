import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity, Gauge } from 'lucide-react';

export interface IncursionHistoryPoint {
  cycle: number;
  label: string;
  threat: number;
}

interface IncursionSparklineProps {
  history: IncursionHistoryPoint[];
  currentThreat: number;
  level: string;
  stability: string;
  textColor: string;
  strokeColor: string;
  badgeStyle: string;
  dotStyle: string;
  description: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: IncursionHistoryPoint }>;
}

const SparklineTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const severityTier = 
      data.threat >= 75 ? 'CRITICAL' : 
      data.threat >= 50 ? 'ELEVATED' : 
      data.threat >= 25 ? 'MODERATE' : 'STABLE';

    return (
      <div className="bg-slate-950/95 border border-slate-700/90 px-2.5 py-1.5 rounded-md shadow-xl text-[10px] font-mono-tech space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-400">{data.label}:</span>
          <span className="font-bold text-amber-300">{data.threat}% Threat</span>
        </div>
        <div className="text-[9px] text-slate-500 flex items-center justify-between gap-1">
          <span>Tier:</span>
          <span className={`font-bold ${
            data.threat >= 75 ? 'text-rose-400' :
            data.threat >= 50 ? 'text-amber-400' :
            data.threat >= 25 ? 'text-cyan-400' : 'text-emerald-400'
          }`}>{severityTier}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const IncursionSparkline: React.FC<IncursionSparklineProps> = ({
  history,
  currentThreat,
  level,
  stability,
  textColor,
  strokeColor,
  badgeStyle,
  description,
}) => {
  // Determine the active threshold in real time based on current threat %
  const activeSeverity = useMemo(() => {
    const t = Math.round(currentThreat);
    if (t >= 75 || level === 'CRITICAL') return 'Critical';
    if (t >= 50 || level === 'HIGH') return 'High';
    if (t >= 25 || level === 'ELEVATED') return 'Elevated';
    return 'Stable';
  }, [currentThreat, level]);

  // Compute metrics: 30-cycle range, 30-cycle delta, and 5-cycle Incursion Velocity
  const { delta30, minThreat, maxThreat, velocityRate, velocityTotal, isRising, isFalling } = useMemo(() => {
    if (!history || history.length === 0) {
      return { 
        delta30: 0, 
        minThreat: Math.round(currentThreat), 
        maxThreat: Math.round(currentThreat),
        velocityRate: 0,
        velocityTotal: 0,
        isRising: false,
        isFalling: false,
      };
    }
    const first = history[0].threat;
    const last = history[history.length - 1].threat;
    const values = history.map((h) => h.threat);

    // Calculate Incursion Velocity over the last 5 cycles
    const fiveIndex = Math.max(0, history.length - 6);
    const span = Math.max(1, (history.length - 1) - fiveIndex);
    const fiveDelta = Math.round((last - history[fiveIndex].threat) * 10) / 10;
    const rate = Math.round((fiveDelta / span) * 10) / 10;

    return {
      delta30: last - first,
      minThreat: Math.min(...values),
      maxThreat: Math.max(...values),
      velocityRate: rate,
      velocityTotal: fiveDelta,
      isRising: rate > 0.05,
      isFalling: rate < -0.05,
    };
  }, [history, currentThreat]);

  // Severity Level thresholds configuration with exact sparkline background gradients
  const severityThresholds = [
    {
      id: 'stable',
      name: 'Stable',
      range: '<25%',
      gradient: 'from-emerald-950/95 via-emerald-900/60 to-slate-950',
      activeBorder: 'border-emerald-400 shadow-emerald-500/25',
      activeText: 'text-emerald-300',
      dotColor: 'bg-emerald-400',
      stroke: '#10b981',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'elevated',
      name: 'Elevated',
      range: '25-49%',
      gradient: 'from-amber-950/95 via-amber-900/60 to-slate-950',
      activeBorder: 'border-amber-400 shadow-amber-500/25',
      activeText: 'text-amber-300',
      dotColor: 'bg-amber-400',
      stroke: '#fbbf24',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
    },
    {
      id: 'high',
      name: 'High',
      range: '50-74%',
      gradient: 'from-orange-950/95 via-orange-900/60 to-slate-950',
      activeBorder: 'border-orange-400 shadow-orange-500/25',
      activeText: 'text-orange-300',
      dotColor: 'bg-orange-400',
      stroke: '#f97316',
      badgeBg: 'bg-orange-950/90 text-orange-300 border-orange-500/40',
    },
    {
      id: 'critical',
      name: 'Critical',
      range: '≥75%',
      gradient: 'from-rose-950/95 via-rose-900/60 to-slate-950',
      activeBorder: 'border-rose-400 shadow-rose-500/30',
      activeText: 'text-rose-300',
      dotColor: 'bg-rose-500',
      stroke: '#f43f5e',
      badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-500/40',
    },
  ];

  return (
    <div className="p-3.5 space-y-2.5 font-sans select-none">
      {/* Header: Title & Threat Level Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/90">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono-tech text-slate-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>INCURSION THREAT ARCHIVE</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-tech font-bold uppercase border ${badgeStyle}`}>
          {level}
        </span>
      </div>

      {/* Metric Row: Current Value, 30-Cycle Delta, & 5-Cycle Incursion Velocity Indicator */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono-tech items-center bg-slate-900/60 p-2 rounded-lg border border-slate-800/70">
        {/* Metric 1: Current Risk */}
        <div>
          <span className="text-[9px] text-slate-400 block leading-tight">CURRENT</span>
          <span className={`text-base font-black ${textColor}`}>
            {Math.round(currentThreat)}%
          </span>
        </div>

        {/* Metric 2: 30-Cycle Trend */}
        <div className="text-center border-x border-slate-800/80 px-1">
          <span className="text-[9px] text-slate-400 block leading-tight">30-C DELTA</span>
          <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold">
            {delta30 > 0 ? (
              <span className="text-rose-400 flex items-center gap-0.5">
                +{delta30}%
              </span>
            ) : delta30 < 0 ? (
              <span className="text-emerald-400 flex items-center gap-0.5">
                {delta30}%
              </span>
            ) : (
              <span className="text-slate-400">±0%</span>
            )}
          </div>
        </div>

        {/* Metric 3: Incursion Velocity (rate over last 5 cycles) with intuitive visual arrow */}
        <div id="incursion-velocity-indicator" className="text-right">
          <span className="text-[9px] text-slate-400 block leading-tight flex items-center justify-end gap-1">
            <Gauge className="w-2.5 h-2.5 text-cyan-400" />
            VELOCITY (5C)
          </span>
          <div className="flex items-center justify-end gap-1 text-[11px] font-bold">
            {velocityRate > 0.05 ? (
              <span 
                className="text-rose-400 flex items-center gap-0.5 bg-rose-950/60 px-1 py-0.5 rounded border border-rose-500/30"
                title={`Increasing Threat: +${velocityRate.toFixed(1)}% per cycle (+${velocityTotal}% over 5 cycles)`}
              >
                <TrendingUp className="w-3 h-3 text-rose-400 shrink-0" />
                <span>+{velocityRate.toFixed(1)}%/c</span>
              </span>
            ) : velocityRate < -0.05 ? (
              <span 
                className="text-emerald-400 flex items-center gap-0.5 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/30"
                title={`Decreasing Threat: ${velocityRate.toFixed(1)}% per cycle (${velocityTotal}% over 5 cycles)`}
              >
                <TrendingDown className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{velocityRate.toFixed(1)}%/c</span>
              </span>
            ) : (
              <span 
                className="text-slate-400 flex items-center gap-0.5 bg-slate-800/60 px-1 py-0.5 rounded border border-slate-700/40"
                title="Stable: Threat rate of change near zero"
              >
                <Minus className="w-3 h-3 text-slate-400 shrink-0" />
                <span>0.0%/c</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Severity Level Legend: Real-time Threat Thresholds Highlighted based on Sparkline Gradient */}
      <div id="severity-level-legend" className="space-y-1.5 font-mono-tech">
        <div className="flex items-center justify-between text-[9px] text-slate-300 font-bold uppercase tracking-wider px-0.5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3 h-3 text-cyan-400" />
            Severity Level
          </span>
          <span className="text-[8px] text-slate-400 font-normal">
            Current: <span className={`font-bold ${textColor}`}>{activeSeverity}</span> ({Math.round(currentThreat)}%)
          </span>
        </div>

        {/* 4-Tier Threshold Visual Legend Grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {severityThresholds.map((tier) => {
            const isActive = activeSeverity === tier.name;
            return (
              <div
                key={tier.id}
                id={`severity-threshold-${tier.id}`}
                className={`relative rounded-md p-1.5 flex flex-col justify-between transition-all duration-300 border ${
                  isActive
                    ? `bg-gradient-to-b ${tier.gradient} ${tier.activeBorder} shadow-md`
                    : 'bg-slate-950/70 border-slate-800/80 opacity-60 hover:opacity-80'
                }`}
                title={`${tier.name} Threshold (${tier.range}) - ${isActive ? 'Active Colony Threat State' : 'Threshold Range'}`}
              >
                {/* Top: Name & Real-time Active Pulse Dot */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[9.5px] leading-tight font-bold tracking-tight ${
                      isActive ? tier.activeText : 'text-slate-400'
                    }`}
                  >
                    {tier.name}
                  </span>
                  {isActive ? (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tier.dotColor}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${tier.dotColor}`} />
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0" />
                  )}
                </div>

                {/* Bottom: Threshold Range Label & Status Tag */}
                <div className="mt-1 flex items-center justify-between text-[8px] leading-none">
                  <span className={`font-mono ${isActive ? 'text-slate-200 font-bold' : 'text-slate-500'}`}>
                    {tier.range}
                  </span>
                  {isActive && (
                    <span className="text-[7px] font-black uppercase tracking-wider px-0.5 py-0.2 rounded bg-white/10 text-white border border-white/20">
                      NOW
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Trend Chart using Recharts over 30 Game Cycles & Visual Incursion Velocity Indicator */}
      <div className="bg-slate-900/95 rounded-lg p-2.5 border border-slate-800/80 shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-mono-tech text-slate-400 px-1 mb-1.5">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-cyan-400" />
            30-Cycle Incursion Trend
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            Low: {minThreat}% · High: {maxThreat}%
          </span>
        </div>

        {/* Side-by-side Layout: Sparkline Chart on Left, Visual Incursion Velocity Numeric Indicator on Right */}
        <div className="flex items-stretch gap-2">
          {/* Sparkline Column */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[8px] font-mono-tech text-slate-500 px-0.5 pb-0.5">
              <span className="text-emerald-400/80">25% Stable</span>
              <span className="text-amber-400/80">50% Elevated</span>
              <span className="text-rose-400/80">75% Critical</span>
            </div>

            <div className="w-full flex justify-center overflow-hidden">
              <AreaChart
                width={196}
                height={74}
                data={history}
                margin={{ top: 2, right: 2, left: 2, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incursionSparklineGrad30" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <YAxis domain={[0, 100]} hide />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 7, fill: '#64748b', fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  interval={Math.max(1, Math.floor(history.length / 4))}
                />
                <Tooltip content={<SparklineTooltip />} />

                {/* Horizontal Dashed Reference Lines at 25%, 50%, and 75% thresholds */}
                <ReferenceLine 
                  y={25} 
                  stroke="#10b981" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.45} 
                />
                <ReferenceLine 
                  y={50} 
                  stroke="#f59e0b" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.45} 
                />
                <ReferenceLine 
                  y={75} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5} 
                />

                <Area
                  type="monotone"
                  dataKey="threat"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incursionSparklineGrad30)"
                  dot={false}
                  activeDot={{ r: 3.5, stroke: '#ffffff', strokeWidth: 1.5, fill: strokeColor }}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </div>
          </div>

          {/* Visual 'Incursion Velocity' Numeric Indicator next to the sparkline */}
          <div
            id="incursion-velocity-indicator"
            className={`w-[104px] shrink-0 rounded-lg p-2 flex flex-col justify-between border font-mono-tech transition-all duration-300 shadow-md ${
              isRising
                ? 'bg-gradient-to-b from-rose-950/70 to-slate-950 border-rose-500/50 shadow-rose-950/40'
                : isFalling
                ? 'bg-gradient-to-b from-emerald-950/70 to-slate-950 border-emerald-500/50 shadow-emerald-950/40'
                : 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-slate-700/60 shadow-slate-950/40'
            }`}
          >
            {/* Header: Label & 5-Cycle Tag */}
            <div>
              <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Gauge className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  Velocity
                </span>
                <span className="text-[7px] text-slate-500 font-mono">5-CYC</span>
              </div>
              <span className="text-[7.5px] text-slate-400 block leading-tight pt-0.5">
                Rate of Change
              </span>
            </div>

            {/* Prominent Numeric Indicator with Directional Arrow Icon */}
            <div className="my-0.5 py-0.5">
              <div className="flex items-center gap-1">
                {isRising ? (
                  <TrendingUp className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                ) : isFalling ? (
                  <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span
                  className={`text-base font-black tracking-tight leading-none ${
                    isRising ? 'text-rose-400' : isFalling ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {velocityRate > 0 ? `+${velocityRate.toFixed(1)}` : `${velocityRate.toFixed(1)}`}%
                </span>
              </div>
              <span className="text-[7.5px] text-slate-400 block pt-0.5">
                per game cycle
              </span>
            </div>

            {/* Status Pill & 5-Cycle Net Threat Delta */}
            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[8px]">
              <span
                className={`px-1 py-0.5 rounded text-[7.5px] font-bold uppercase flex items-center gap-0.5 ${
                  isRising
                    ? 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                    : isFalling
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/30'
                }`}
              >
                {isRising ? '↑ Rising' : isFalling ? '↓ Falling' : '– Steady'}
              </span>
              <span className="text-[7.5px] text-slate-400 font-mono" title="Total threat % delta across last 5 cycles">
                {velocityTotal > 0 ? `+${velocityTotal}%` : `${velocityTotal}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Colony Stability & Diagnostic Assessment */}
      <div className="space-y-1 text-[10px] font-mono-tech">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Colony Stability:</span>
          <span className={`font-bold ${textColor}`}>{stability}</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
          {description}
        </p>
      </div>

      <div className="text-[9px] text-emerald-400/90 font-mono-tech italic pt-0.5 flex items-center justify-between">
        <span>Click tab to open Doomsday Clock controls</span>
        <span className="text-slate-500 font-mono">30-Cycle Archival</span>
      </div>
    </div>
  );
};
