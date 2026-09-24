import React, { useState } from 'react';
import { MCUHero } from '../types';

interface HeroAvatarProps {
  hero?: MCUHero | null;
  heroId?: string;
  heroName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'stage';
  shape?: 'rounded' | 'circle' | 'square';
  border?: string;
  className?: string;
  showInsigniaOverlay?: boolean;
  showStatusDot?: boolean;
  status?: 'idle' | 'assigned' | 'fatigued' | 'training';
  onClick?: () => void;
  title?: string;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
  stage: 'w-32 h-32 sm:w-44 sm:h-44 text-4xl',
};

const SHAPE_CLASSES = {
  rounded: 'rounded-xl',
  circle: 'rounded-full',
  square: 'rounded-none',
};

/**
 * Hero SVG Insignia Emblem for instant recognizable fallback
 */
function renderHeroInsignia(heroId: string) {
  const id = heroId.toLowerCase();
  
  // Iron Man Arc Reactor
  if (id.includes('iron_man')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-amber-300 drop-shadow-md">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
        <polygon points="12,4 14,10 20,12 14,14 12,20 10,14 4,12 10,10" fill="currentColor" opacity="0.6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }

  // Spider-Man Crest
  if (id.includes('spider')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-rose-300 drop-shadow-md">
        <ellipse cx="12" cy="12" rx="3" ry="5" fill="currentColor" />
        <circle cx="12" cy="8" r="2.5" fill="currentColor" />
        <path d="M12 9 C8 5, 4 7, 3 10 M12 11 C7 10, 3 13, 2 16 M12 13 C7 15, 4 19, 4 22 M12 9 C16 5, 20 7, 21 10 M12 11 C17 10, 21 13, 22 16 M12 13 C17 15, 20 19, 20 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Wolverine Adamantium Claws
  if (id.includes('wolverine')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-amber-300 drop-shadow-md">
        <path d="M5 21 L10 3 M12 21 L14 2 M19 21 L18 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Deadpool Mask
  if (id.includes('deadpool')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-red-300 drop-shadow-md">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="#7f1d1d" />
        <line x1="12" y1="3" x2="12" y2="21" stroke="#450a0a" strokeWidth="1.5" />
        <ellipse cx="8" cy="12" rx="2.5" ry="3.5" fill="#000" />
        <ellipse cx="16" cy="12" rx="2.5" ry="3.5" fill="#000" />
        <polygon points="8,10 9,13 7,13" fill="#fff" />
        <polygon points="16,10 17,13 15,13" fill="#fff" />
      </svg>
    );
  }

  // Doctor Doom Latverian Crown
  if (id.includes('doom')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-emerald-300 drop-shadow-md">
        <polygon points="4,18 7,8 12,12 17,8 20,18" fill="currentColor" stroke="#064e3b" strokeWidth="1.5" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        <circle cx="7" cy="7" r="1" fill="currentColor" />
        <circle cx="17" cy="7" r="1" fill="currentColor" />
      </svg>
    );
  }

  // Fantastic Four '4'
  if (id.includes('fantastic') || id.includes('reed')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-cyan-300 drop-shadow-md">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M14 6 L8 15 H15 V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Black Widow / Yelena Hourglass
  if (id.includes('yelena') || id.includes('widow') || id.includes('natasha')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-rose-400 drop-shadow-md">
        <polygon points="6,4 18,4 12,12" fill="currentColor" />
        <polygon points="6,20 18,20 12,12" fill="currentColor" />
      </svg>
    );
  }

  // Thor Hammer / Lightning
  if (id.includes('thor')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-sky-300 drop-shadow-md">
        <rect x="7" y="5" width="10" height="7" rx="1.5" fill="currentColor" stroke="#0284c7" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 2 L8 9 H12 L11 14 L16 7 H12 Z" fill="#fef08a" opacity="0.9" />
      </svg>
    );
  }

  // Hulk Gamma / Fist
  if (id.includes('hulk')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-emerald-300 drop-shadow-md">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path d="M12 3 L10 8 M12 21 L14 16 M3 12 L8 14 M21 12 L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Captain America / Rogers / Wilson Shield
  if (id.includes('captain_america') || id.includes('steve_rogers') || id.includes('sam_wilson')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-blue-300 drop-shadow-md">
        <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2" fill="#1e3a8a" />
        <circle cx="12" cy="12" r="6" stroke="#f8fafc" strokeWidth="1.5" />
        <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15 9,17 9.5,13.5 7,11 10.5,10.5" fill="#f8fafc" />
      </svg>
    );
  }

  // TVA Hourglass & Sacred Timeline Wave
  if (id.includes('mobius') || id.includes('tva') || id.includes('b15') || id.includes('ouroboros') || id.includes('casey')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-amber-400 drop-shadow-md">
        <path d="M6 3 L18 3 L14 11 L18 21 L6 21 L10 11 Z" stroke="#f59e0b" strokeWidth="1.5" fill="#78350f" fillOpacity="0.4" />
        <path d="M2 12 Q7 7, 12 12 T22 12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#fbbf24" />
      </svg>
    );
  }

  // Default Fallback
  return null;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({
  hero,
  heroId: propHeroId,
  heroName: propHeroName,
  size = 'md',
  shape = 'rounded',
  border = 'border-2 border-slate-700',
  className = '',
  showInsigniaOverlay = false,
  showStatusDot = false,
  status,
  onClick,
  title,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroId = hero?.id || propHeroId || 'unknown_hero';
  const displayName = hero?.heroName || hero?.name || propHeroName || 'Hero';
  const subtitle = hero?.name || '';
  const avatarColor = hero?.avatarColor || 'from-slate-700 to-slate-900';

  // Primary image url with server proxy fallback
  const resolvedPhotoUrl = hero?.imageUrl || `/api/heroes/${heroId}/photo?format=image`;

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const shapeClass = SHAPE_CLASSES[shape] || SHAPE_CLASSES.rounded;

  const currentStatus = status || hero?.status || 'idle';
  const getStatusColor = () => {
    switch (currentStatus) {
      case 'assigned':
        return 'bg-emerald-400 ring-2 ring-slate-950';
      case 'training':
        return 'bg-amber-400 ring-2 ring-slate-950';
      case 'fatigued':
        return 'bg-rose-500 ring-2 ring-slate-950';
      default:
        return 'bg-cyan-400 ring-2 ring-slate-950';
    }
  };

  const insignia = renderHeroInsignia(heroId);

  return (
    <div
      onClick={onClick}
      className={`relative select-none shrink-0 ${sizeClass} ${shapeClass} overflow-hidden ${border} ${className} ${
        onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''
      }`}
      title={title || `${displayName}${subtitle ? ` (${subtitle})` : ''}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${avatarColor} opacity-90`} />

      {/* Render Image if not errored */}
      {!hasError && resolvedPhotoUrl && (
        <img
          src={resolvedPhotoUrl}
          alt={displayName}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}

      {/* Fallback Display if image fails to load or while loading */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
          {insignia ? (
            insignia
          ) : (
            <span className="font-bold font-mono tracking-tighter text-white uppercase drop-shadow">
              {displayName.substring(0, 2)}
            </span>
          )}
        </div>
      )}

      {/* Optional Overlay Insignia on bottom-right */}
      {showInsigniaOverlay && insignia && (
        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-slate-950/80 border border-amber-400/60 flex items-center justify-center p-0.5 shadow">
          {insignia}
        </div>
      )}

      {/* Subtle Inner Bevel / Glow Highlight */}
      <div className="absolute inset-0 pointer-events-none rounded-inherit shadow-inner ring-1 ring-white/10" />

      {/* Optional Status Dot */}
      {showStatusDot && (
        <span
          className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full ${getStatusColor()}`}
        />
      )}
    </div>
  );
};
