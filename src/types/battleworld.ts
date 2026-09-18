import { HeroRole } from '../types';

export type CoPilotPersona = 'miss_minutes' | 'herbie';

export interface WarTableNode {
  id: string;
  name: string;
  realityCode: string;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  color: string;
  glowColor: string;
  status: 'harmonized' | 'incursion_warning' | 'breached' | 'fortified';
  threatRate: number; // incursion threat per minute if unmonitored
  stability: number; // 0-100%
  barrierIntegrity: number; // 0-100%
  assignedHeroIds: string[];
  filmSource: string;
  description: string;
  tacticalPerk: string;
}

export interface IncursionRaid {
  id: string;
  name: string;
  originReality: string;
  threatType: 'doom_sentinels' | 'galactus_herald' | 'void_swarm' | 'kang_armada';
  hp: number;
  maxHp: number;
  threatLevel: 'standard' | 'severe' | 'extinction';
  timeRemainingSec: number;
  maxTimeSec: number;
  vulnerability: HeroRole;
  description: string;
  interceptCost: {
    power: number;
    scrap: number;
  };
  reward: {
    chronoCores: number;
    vibraniumCredits: number;
    multiverseInfluence: number;
  };
}

export interface CosmicRelic {
  id: string;
  name: string;
  subtitle: string;
  originReality: string;
  category: 'power' | 'defense' | 'chrono' | 'dimensional';
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'cosmic';
  accentColor: string;
  description: string;
  passivePerk: string;
  overchargeEffect: string;
  statMultipliers: {
    powerBonus?: number;
    defenseBonus?: number;
    incursionReduction?: number;
    scrapBonus?: number;
  };
  unlocked: boolean;
  unlockCost?: {
    chronoCores: number;
    vibraniumCredits: number;
    multiverseInfluence: number;
  };
}

export type SocketType = 'power' | 'defense' | 'chrono' | 'dimensional';

export interface RelicSocketSlot {
  type: SocketType;
  label: string;
  equippedRelicId: string | null;
  acceptedCategory: 'power' | 'defense' | 'chrono' | 'dimensional' | 'any';
}

export interface ActiveRelicSynergy {
  id: string;
  name: string;
  requiredRelicIds: [string, string];
  title: string;
  description: string;
  active: boolean;
  accentColor: string;
}

export interface TeamUpSynergy {
  id: string;
  name: string;
  heroIds: [string, string];
  title: string;
  comicReference: string;
  quote: string;
  passiveBonus: string;
  ultimateName: string;
  ultimateDescription: string;
  ultimateCooldownSec: number;
  lastUsedAt: number;
}

export interface CoPilotMessage {
  id: string;
  persona: CoPilotPersona;
  timestamp: number;
  text: string;
  type: 'info' | 'alert' | 'success' | 'directive';
}

export interface CoPilotAutomations {
  autoIncursionSuppress: boolean;
  autoNaniteRepair: boolean;
  autoArcRegulator: boolean;
  autoLoomAnchor: boolean;
}
