import React from 'react';

interface MultiverseRealityFractureOverlayProps {
  isActive: boolean;
  incursionThreat: number;
}

export const MultiverseRealityFractureOverlay: React.FC<MultiverseRealityFractureOverlayProps> = ({
  isActive,
  incursionThreat,
}) => {
  if (!isActive) return null;

  const isSevere = incursionThreat > 50;

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
    >
      {/* Edge Incursion Atmospheric Glow */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isSevere ? 'opacity-80' : 'opacity-40'
        }`}
        style={{
          boxShadow: isSevere 
            ? 'inset 0 0 100px 15px rgba(239, 68, 68, 0.25), inset 0 0 50px 5px rgba(16, 185, 129, 0.2)' 
            : 'inset 0 0 60px 10px rgba(168, 85, 247, 0.15)',
        }}
      />

      {/* Top Border Multiverse Fracture Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-pulse" />
      
      {/* Bottom Border Multiverse Fracture Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent animate-pulse" />

      {/* Corner Dimensional Rifts (SVG Fracture Lines) */}
      <svg className="absolute top-0 left-0 w-48 h-48 opacity-30 text-red-500" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <path d="M0,0 L35,20 L50,5 L80,35 L60,50 L95,85" strokeWidth="1.2" strokeDasharray="3 2" />
        <path d="M20,0 L30,40 L10,65 L45,80" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>

      <svg className="absolute top-0 right-0 w-48 h-48 opacity-30 text-emerald-400 rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <path d="M0,0 L35,20 L50,5 L80,35 L60,50 L95,85" strokeWidth="1.2" strokeDasharray="3 2" />
        <path d="M20,0 L30,40 L10,65 L45,80" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>

      <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-30 text-purple-400 -rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <path d="M0,0 L35,20 L50,5 L80,35 L60,50 L95,85" strokeWidth="1.2" strokeDasharray="3 2" />
      </svg>

      <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-30 text-amber-400 180" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <path d="M0,0 L35,20 L50,5 L80,35 L60,50 L95,85" strokeWidth="1.2" strokeDasharray="3 2" />
      </svg>

      {/* Floating Tachyon Anomaly Spark Indicators */}
      <div className="absolute top-1/4 left-3 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping opacity-60" />
      <div className="absolute bottom-1/3 right-4 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
      <div className="absolute top-2/3 left-1/5 w-1 h-1 rounded-full bg-purple-400 animate-ping opacity-40" />
    </div>
  );
};
