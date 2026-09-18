import React from 'react';
import { HeroInsignia } from './HeroInsignia';

interface HeroStyleBackgroundProps {
  heroId: string;
  accentColor?: string;
  tier?: number;
}

export const HeroStyleBackground: React.FC<HeroStyleBackgroundProps> = ({
  heroId,
  accentColor = '#06b6d4',
  tier = 1,
}) => {
  // Render character-specific style UI
  switch (heroId) {
    case 'iron_man':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Stark Arc Reactor Background UI */}
          <svg className="absolute -right-12 -bottom-12 w-64 h-64 text-cyan-400 animate-spin-slow" viewBox="0 0 200 200" fill="none">
            {/* Outer segmented ring */}
            <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4" opacity="0.6" />
            <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="2" opacity="0.8" />
            
            {/* 10 Palladium Inductive Coils */}
            {[...Array(10)].map((_, i) => {
              const angle = (i * 36) * (Math.PI / 180);
              const x1 = 100 + Math.cos(angle) * 62;
              const y1 = 100 + Math.sin(angle) * 62;
              const x2 = 100 + Math.cos(angle) * 76;
              const y2 = 100 + Math.sin(angle) * 76;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Middle Conduit Ring */}
            <circle cx="100" cy="100" r="54" stroke="#0284c7" strokeWidth="3" opacity="0.7" />
            <circle cx="100" cy="100" r="48" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 3" />

            {/* Inner Core Triangle (Mark VI / Endgame RT) */}
            <polygon
              points="100,64 130,116 70,116"
              stroke="#00f0ff"
              strokeWidth="2.5"
              fill="rgba(6, 182, 212, 0.15)"
            />
            {/* Central Glow Orb */}
            <circle cx="100" cy="100" r="16" fill="#00f0ff" opacity="0.8" className="animate-pulse" />
            <circle cx="100" cy="100" r="8" fill="#ffffff" />
          </svg>

          {/* Stark OS HUD Targeting Brackets & Telemetry */}
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-cyan-400/70 tracking-widest text-right flex flex-col items-end">
            <span className="text-cyan-300 font-bold">STARK HUD // MARK LXXXV</span>
            <span className="text-[8px] text-cyan-500/80">RT CORE: 3.2 GJ/s • RECEPTOR ONLINE</span>
          </div>
          <div className="absolute bottom-2 left-4 font-mono-tech text-[8px] text-amber-500/50 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>JARVIS/FRIDAY INTERFACE LINKED</span>
          </div>
        </div>
      );

    case 'spider_man_raimi':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-45 transition-opacity duration-500">
          {/* Sam Raimi Spider-Man Trilogy (Earth-96283) Raised Silver Webbing & Authentic Chest Spider */}
          <div className="absolute -right-6 -bottom-6 w-64 h-64 flex items-center justify-center">
            {/* Radial & Concentric Raised Silver Webbing */}
            <svg className="absolute inset-0 w-full h-full text-slate-400" viewBox="0 0 200 200" fill="none">
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg, idx) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={idx}
                    x1="100"
                    y1="100"
                    x2={100 + Math.cos(rad) * 110}
                    y2={100 + Math.sin(rad) * 110}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                );
              })}
              {[25, 45, 65, 85, 105].map((radius, idx) => (
                <circle
                  key={idx}
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                  opacity="0.35"
                />
              ))}
            </svg>

            {/* Exact Tobey Maguire Raimi Spider-Man Chest Insignia from image.png */}
            <div className="relative z-10 text-red-500/90 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              <HeroInsignia heroId="spider_man_raimi" size={140} color="#ef4444" />
            </div>
          </div>

          {/* Earth-96283 Raimi Watermark & Daily Bugle Stamp */}
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-red-400/80 tracking-widest text-right flex flex-col items-end">
            <span className="text-slate-200 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/40">
              EARTH-96283 // RAIMI TRILOGY
            </span>
            <span className="text-[8px] text-slate-400 mt-0.5">ORGANIC WEB-SPINNER • PETER-TWO</span>
          </div>
        </div>
      );

    case 'spider_man':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Earth-616 Spider-Man (Brand New Day) High-Tech Web Matrix */}
          <svg className="absolute -right-6 -bottom-6 w-60 h-60 text-red-500" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx="100" cy="100" r="50" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy="100" r="25" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
            {/* Crosshairs & Stark Web-Fluid Chamber */}
            <line x1="20" y1="100" x2="180" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="8 4" opacity="0.4" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#ef4444" strokeWidth="1" strokeDasharray="8 4" opacity="0.4" />
            <polygon points="100,75 120,100 100,125 80,100" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(239, 68, 68, 0.1)" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-red-400/70 tracking-widest text-right">
            <span>WEB-FLUID 3.0 // QUEENS NY</span>
          </div>
        </div>
      );

    case 'hulk':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Gamma Radiation Chamber & Biohazard Mesh */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-emerald-500" viewBox="0 0 200 200" fill="none">
            {/* Hexagonal containment grid */}
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="#10b981" strokeWidth="2" opacity="0.4" />
            <polygon points="100,45 150,75 150,125 100,155 50,125 50,75" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            {/* Biohazard Trefoil */}
            <circle cx="100" cy="100" r="14" fill="#10b981" opacity="0.6" />
            <circle cx="85" cy="80" r="18" stroke="#10b981" strokeWidth="2" opacity="0.7" />
            <circle cx="115" cy="80" r="18" stroke="#10b981" strokeWidth="2" opacity="0.7" />
            <circle cx="100" cy="120" r="18" stroke="#10b981" strokeWidth="2" opacity="0.7" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-emerald-400/80 tracking-widest text-right">
            <span className="font-bold">GAMMA RADS: LIMITLESS APEX</span>
            <span className="block text-[8px] text-emerald-500/80">JEAN GREY TELEPATHIC UNLOCK // TRUE POWER</span>
          </div>
        </div>
      );

    case 'thor':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Asgardian Bifrost & Thunder Runes */}
          <svg className="absolute -right-8 -bottom-8 w-64 h-64 text-amber-400" viewBox="0 0 200 200" fill="none">
            {/* Outer Nordic Rune Circle */}
            <circle cx="100" cy="100" r="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.6" />
            <circle cx="100" cy="100" r="68" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
            {/* Lightning Strike Arcs */}
            <path d="M 100,10 L 85,75 L 115,85 L 75,150 L 130,70 L 105,65 Z" fill="rgba(245, 158, 11, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Mjolnir / Triquetra Nodes */}
            <circle cx="100" cy="65" r="5" fill="#f59e0b" />
            <circle cx="70" cy="120" r="5" fill="#f59e0b" />
            <circle cx="130" cy="120" r="5" fill="#f59e0b" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-amber-400/80 tracking-widest text-right">
            <span className="font-bold">ODINFORCE // BIFROST RELAY</span>
            <span className="block text-[8px] text-sky-400/70">STORMBREAKER HARMONIC</span>
          </div>
        </div>
      );

    case 'doctor_strange':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Eldritch Tao-Mandala & Eye of Agamotto */}
          <svg className="absolute -right-10 -bottom-10 w-64 h-64 text-amber-500 animate-spin-slow" viewBox="0 0 200 200" fill="none">
            {/* Sacred Geometry Square in Circle */}
            <circle cx="100" cy="100" r="86" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
            <rect x="38" y="38" width="124" height="124" stroke="#f97316" strokeWidth="1.5" opacity="0.6" transform="rotate(45 100 100)" />
            <rect x="38" y="38" width="124" height="124" stroke="#eab308" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            {/* Eye of Agamotto Center */}
            <ellipse cx="100" cy="100" rx="36" ry="20" stroke="#f59e0b" strokeWidth="2" fill="rgba(245, 158, 11, 0.1)" />
            <circle cx="100" cy="100" r="10" fill="#10b981" opacity="0.8" />
            <circle cx="100" cy="100" r="4" fill="#ffffff" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-amber-400/80 tracking-widest text-right">
            <span className="font-bold">TAO-MANDALA SANCTUM</span>
            <span className="block text-[8px] text-emerald-400/80">AGAMOTTO TEMPORAL CORE</span>
          </div>
        </div>
      );

    case 'captain_america':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Vibranium Star Shield Concentric Rings */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-blue-500" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="88" stroke="#ef4444" strokeWidth="10" opacity="0.7" />
            <circle cx="100" cy="100" r="74" stroke="#f8fafc" strokeWidth="9" opacity="0.8" />
            <circle cx="100" cy="100" r="61" stroke="#ef4444" strokeWidth="9" opacity="0.7" />
            <circle cx="100" cy="100" r="48" fill="#1e3a8a" opacity="0.8" />
            {/* Center Five-Point Star */}
            <polygon
              points="100,56 109,82 136,82 114,98 123,124 100,108 77,124 86,98 64,82 91,82"
              fill="#ffffff"
              opacity="0.95"
            />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-blue-400/80 tracking-widest text-right">
            <span className="font-bold">VIBRANIUM COMPOSITE SHIELD</span>
            <span className="block text-[8px] text-slate-400">SENTINEL OF LIBERTY</span>
          </div>
        </div>
      );

    case 'black_widow':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Red Room Tactical Hourglass & Covert Radar HUD */}
          <svg className="absolute -right-6 -bottom-6 w-56 h-56 text-rose-500" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#f43f5e" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#f43f5e" strokeWidth="1" opacity="0.3" />
            {/* Red Hourglass */}
            <polygon points="75,60 125,60 100,95" fill="#e11d48" opacity="0.8" />
            <polygon points="100,105 125,140 75,140" fill="#e11d48" opacity="0.8" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-rose-400/80 tracking-widest text-right">
            <span className="font-bold">RED ROOM COVERT HUD</span>
            <span className="block text-[8px] text-rose-500/60">TARGET LOCK: ACQUIRED</span>
          </div>
        </div>
      );

    case 'thanos':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Infinity Gauntlet 6 Cosmic Stone Facets */}
          <svg className="absolute -right-8 -bottom-8 w-64 h-64" viewBox="0 0 200 200" fill="none">
            {/* Gauntlet outline / cosmic ring */}
            <circle cx="100" cy="100" r="84" stroke="#d97706" strokeWidth="2" strokeDasharray="10 5" opacity="0.6" />
            
            {/* 6 Infinity Stones */}
            {/* Power (Purple) */}
            <circle cx="55" cy="70" r="9" fill="#a855f7" className="animate-pulse" />
            {/* Space (Blue) */}
            <circle cx="85" cy="50" r="9" fill="#3b82f6" />
            {/* Reality (Red) */}
            <circle cx="115" cy="50" r="9" fill="#ef4444" />
            {/* Soul (Orange) */}
            <circle cx="145" cy="70" r="9" fill="#f97316" />
            {/* Time (Green) */}
            <circle cx="130" cy="130" r="9" fill="#10b981" />
            {/* Mind (Center Giant Yellow) */}
            <circle cx="100" cy="95" r="14" fill="#eab308" />
            <circle cx="100" cy="95" r="6" fill="#ffffff" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-amber-400/90 tracking-widest text-right">
            <span className="font-bold">INFINITY MATRIX // 6 STONES</span>
            <span className="block text-[8px] text-purple-400">UNIVERSAL EQUILIBRIUM</span>
          </div>
        </div>
      );

    case 'green_goblin':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Goblin Glider & Pumpkin Bomb UI */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-emerald-500" viewBox="0 0 200 200" fill="none">
            {/* Swept Titanium Glider Wings */}
            <path d="M 30,140 Q 100,70 170,140 L 140,110 L 100,120 L 60,110 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
            {/* Pumpkin Bomb Grinning Core */}
            <circle cx="100" cy="80" r="22" fill="#f97316" opacity="0.8" />
            <polygon points="90,75 96,75 93,81" fill="#1e1b4b" />
            <polygon points="104,75 110,75 107,81" fill="#1e1b4b" />
            <path d="M 88,88 Q 100,98 112,88 Z" fill="#1e1b4b" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-emerald-400/80 tracking-widest text-right">
            <span className="font-bold">OSCORP GLIDER RADAR</span>
            <span className="block text-[8px] text-orange-400">PUMPKIN ORDNANCE ARMED</span>
          </div>
        </div>
      );

    case 'loki':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* God of Stories Yggdrasil Loom & Horned Crown */}
          <svg className="absolute -right-8 -bottom-8 w-64 h-64 text-emerald-400" viewBox="0 0 200 200" fill="none">
            {/* Golden Curved Horns */}
            <path d="M 60,130 C 40,70 60,30 90,15 C 80,45 75,80 85,115" stroke="#eab308" strokeWidth="3" fill="rgba(234, 179, 8, 0.15)" strokeLinecap="round" />
            <path d="M 140,130 C 160,70 140,30 110,15 C 120,45 125,80 115,115" stroke="#eab308" strokeWidth="3" fill="rgba(234, 179, 8, 0.15)" strokeLinecap="round" />
            {/* Green Loom Weave Strands */}
            <circle cx="100" cy="100" r="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="10 4" opacity="0.6" />
            <circle cx="100" cy="100" r="45" stroke="#10b981" strokeWidth="1" opacity="0.4" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-emerald-400/80 tracking-widest text-right">
            <span className="font-bold">YGGDRASIL LOOM WEAVER</span>
            <span className="block text-[8px] text-amber-400">SACRED BRANCH KEEPER</span>
          </div>
        </div>
      );

    case 'ultron':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Ultron Crimson Hive-Mind Neural Matrix */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-red-600" viewBox="0 0 200 200" fill="none">
            <polygon points="100,40 160,75 160,135 100,170 40,135 40,75" stroke="#dc2626" strokeWidth="2" opacity="0.5" />
            {/* Jack-o-lantern Jack Cybernetic Jaw */}
            <path d="M 70,85 Q 100,70 130,85 Q 100,105 70,85 Z" fill="#ef4444" opacity="0.8" />
            <path d="M 80,110 L 90,125 L 100,110 L 110,125 L 120,110" stroke="#ef4444" strokeWidth="2.5" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-red-500 tracking-widest text-right">
            <span className="font-bold">HIVEMIND: SENTRY MESH</span>
            <span className="block text-[8px] text-red-400/70">NO STRINGS ON ME</span>
          </div>
        </div>
      );

    case 'shuri':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Wakandan Vibranium Geometric Weave */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-purple-400" viewBox="0 0 200 200" fill="none">
            <polygon points="100,30 165,150 35,150" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
            <polygon points="100,170 35,50 165,50" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            {/* Panther Tooth Collar Nodes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <circle
                key={idx}
                cx={100 + Math.cos((angle * Math.PI) / 180) * 65}
                cy={100 + Math.sin((angle * Math.PI) / 180) * 65}
                r="3.5"
                fill="#c084fc"
              />
            ))}
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-purple-400/80 tracking-widest text-right">
            <span className="font-bold">WAKANDAN DESIGN GROUP</span>
            <span className="block text-[8px] text-purple-300">VIBRANIUM KINETIC WEAVE</span>
          </div>
        </div>
      );

    case 'scarlet_witch':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Chaos Magic Hexagon & Tiara Crown */}
          <svg className="absolute -right-8 -bottom-8 w-64 h-64 text-rose-600" viewBox="0 0 200 200" fill="none">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="#e11d48" strokeWidth="2" opacity="0.6" />
            <polygon points="100,35 155,70 155,130 100,165 45,130 45,70" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
            {/* Scarlet Tiara Horns */}
            <path d="M 50,110 L 80,70 L 100,90 L 120,70 L 150,110 L 100,120 Z" fill="rgba(225, 29, 72, 0.25)" stroke="#e11d48" strokeWidth="2" />
            <circle cx="100" cy="100" r="10" fill="#e11d48" opacity="0.8" className="animate-ping" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-rose-400 tracking-widest text-right">
            <span className="font-bold">CHAOS MAGIC // HEX ENGINE</span>
            <span className="block text-[8px] text-rose-500">DARKHOLD HARMONIC</span>
          </div>
        </div>
      );

    case 'wolverine':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Adamantium Claws Slashes & Weapon X Mesh */}
          <svg className="absolute -right-6 -bottom-6 w-60 h-60 text-amber-500" viewBox="0 0 200 200" fill="none">
            {/* Triple Adamantium Claw Slashes */}
            <path d="M 50,40 Q 110,100 130,160" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <path d="M 80,30 Q 135,95 155,150" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
            <path d="M 110,25 Q 160,90 180,140" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            {/* Weapon X Chevron */}
            <polygon points="40,160 80,160 60,130" fill="rgba(245, 158, 11, 0.3)" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-amber-400 tracking-widest text-right">
            <span className="font-bold">WEAPON X // ADAMANTIUM SKELETON</span>
            <span className="block text-[8px] text-amber-500/80">REGENERATIVE HEALING FACTOR</span>
          </div>
        </div>
      );

    case 'deadpool':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Deadpool Mask & Crossed Katanas */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60" viewBox="0 0 200 200" fill="none">
            {/* Crossed Katanas */}
            <line x1="30" y1="30" x2="170" y2="170" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="170" y1="30" x2="30" y2="170" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            {/* Red Circle Mask */}
            <circle cx="100" cy="100" r="42" fill="#ef4444" opacity="0.8" />
            <line x1="100" y1="58" x2="100" y2="142" stroke="#0f172a" strokeWidth="3" />
            {/* Black eye patches */}
            <ellipse cx="82" cy="100" rx="14" ry="18" fill="#0f172a" />
            <ellipse cx="118" cy="100" rx="14" ry="18" fill="#0f172a" />
            <circle cx="85" cy="100" r="4" fill="#ffffff" />
            <circle cx="115" cy="100" r="4" fill="#ffffff" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-rose-400 tracking-widest text-right">
            <span className="font-bold">MERC WITH A MOUTH // 4TH WALL</span>
            <span className="block text-[8px] text-rose-300">MAXIMUM EFFORT</span>
          </div>
        </div>
      );

    case 'doctor_doom':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          {/* Victor von Doom Titanium Mask & Latverian Rune Crest */}
          <svg className="absolute -right-8 -bottom-8 w-64 h-64 text-emerald-500" viewBox="0 0 200 200" fill="none">
            {/* Latverian Crest Shield */}
            <path d="M 50,40 L 150,40 L 150,110 Q 100,170 100,180 Q 100,170 50,110 Z" stroke="#10b981" strokeWidth="2.5" fill="rgba(16, 185, 129, 0.15)" />
            {/* Titanium Mask Rivets */}
            <circle cx="70" cy="55" r="4" fill="#94a3b8" />
            <circle cx="130" cy="55" r="4" fill="#94a3b8" />
            <circle cx="70" cy="115" r="4" fill="#94a3b8" />
            <circle cx="130" cy="115" r="4" fill="#94a3b8" />
            {/* Slitted Eyes */}
            <rect x="70" y="80" width="22" height="8" rx="2" fill="#10b981" opacity="0.9" />
            <rect x="108" y="80" width="22" height="8" rx="2" fill="#10b981" opacity="0.9" />
            {/* Riveted Mouth Grate */}
            <line x1="80" y1="125" x2="120" y2="125" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="85" y1="120" x2="85" y2="130" stroke="#94a3b8" strokeWidth="2" />
            <line x1="95" y1="120" x2="95" y2="130" stroke="#94a3b8" strokeWidth="2" />
            <line x1="105" y1="120" x2="105" y2="130" stroke="#94a3b8" strokeWidth="2" />
            <line x1="115" y1="120" x2="115" y2="130" stroke="#94a3b8" strokeWidth="2" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-emerald-400 tracking-widest text-right">
            <span className="font-bold">SOVEREIGN OF LATVERIA // DOOM</span>
            <span className="block text-[8px] text-emerald-500">BATTLEWORLD ARCHITECT</span>
          </div>
        </div>
      );

    case 'shang_chi':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-25 group-hover:opacity-35 transition-opacity duration-500">
          {/* Ten Rings Circular Orbital Rings */}
          <svg className="absolute -right-8 -bottom-8 w-60 h-60 text-amber-500" viewBox="0 0 200 200" fill="none">
            {[...Array(10)].map((_, i) => {
              const angle = (i * 36) * (Math.PI / 180);
              const cx = 100 + Math.cos(angle) * 65;
              const cy = 100 + Math.sin(angle) * 65;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="12"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  fill="rgba(245, 158, 11, 0.2)"
                />
              );
            })}
            <circle cx="100" cy="100" r="30" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[9px] text-amber-400 tracking-widest text-right">
            <span className="font-bold">TEN RINGS // TA LO HARMONY</span>
            <span className="block text-[8px] text-amber-500">COSMIC MARTIAL ARTS</span>
          </div>
        </div>
      );

    default:
      // Generic high-tech tactical HUD motif for any other hero
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <svg className="absolute -right-8 -bottom-8 w-56 h-56" viewBox="0 0 200 200" fill="none" style={{ color: accentColor }}>
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <polygon points="100,75 125,100 100,125 75,100" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
          <div className="absolute top-2 right-3 font-mono-tech text-[8px] tracking-widest text-right" style={{ color: accentColor }}>
            <span>AVENGERS SAKAAR HUD</span>
          </div>
        </div>
      );
  }
};
