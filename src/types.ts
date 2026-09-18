export type HeroRole = 'engineering' | 'science' | 'combat' | 'logistics' | 'mystic' | 'command';
export type CharacterType = 'hero' | 'villain' | 'antihero';

export interface MCUHero {
  id: string;
  name: string;
  heroName: string;
  characterType: CharacterType;
  role: HeroRole;
  title: string;
  avatarColor: string;
  accentColor: string;
  portraitIcon: string;
  imageUrl?: string; // Profile photo URL from MCU Wiki / Marvel canon
  wikiSlug?: string; // MediaWiki page title slug for live Action API queries
  assignedBuildingId: string | null;
  status: 'idle' | 'assigned' | 'on_expedition' | 'exhausted';
  stats: {
    engineering: number;
    science: number;
    combat: number;
    leadership: number;
  };
  buildingAffinity: string; // building type it boosts best
  affinityDescription: string;
  passiveBonus: string;
  movieOrigin: string;
  movieAppearances: string[];
  tier?: 1 | 2;
  upgradeCost?: {
    scrap: number;
    vibraniumCredits: number;
    chronoCores: number;
  };
  upgradedForm?: {
    heroName: string;
    title: string;
    lore: string;
    quote: string;
    passiveBonus: string;
    abilityName: string;
    abilityDesc: string;
    abilityCooldownSec: number;
    statBoost: number;
  };
  ability: {
    name: string;
    description: string;
    cooldownSec: number;
    lastUsedAt: number;
    actionType: string;
  };
  quote: string;
  lore: string;
}

export interface MCUHeroPhotoData {
  heroId: string;
  heroName: string;
  realName: string;
  characterType: CharacterType;
  role: HeroRole;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  rawImageEndpoint: string;
  jsonEndpoint: string;
  wikiUrl: string;
  wikiSlug: string;
  movieOrigin: string;
  quote: string;
  accentColor: string;
  avatarColor: string;
  source: string;
}

export interface MCUPhotoCatalogResponse {
  success: boolean;
  total: number;
  heroes: MCUHeroPhotoData[];
  apiNotice: string;
  documentation: {
    singleHeroJson: string;
    singleHeroRawImage: string;
    catalog: string;
    parameters: string;
  };
}

export interface ForthcomingMCUProject {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'animation';
  phase: string;
  releaseDate: string;
  status: 'Announced' | 'In Production' | 'Post-Production' | 'Filming' | 'Upcoming' | 'In Development' | 'In Theaters' | 'Released';
  directorOrCreator: string;
  starring: string[];
  mcuWikiQuery: string;
  mcuWikiUrl: string;
  posterUrl: string;
  synopsis: string;
  loreConnection: string;
  keyCharacters: string[];
  theatricalStatus?: 'in_theaters' | 'forthcoming' | 'coming_soon' | 'streaming';
  rating?: string;
  runtime?: string;
  formats?: ('IMAX 3D' | 'Dolby Cinema' | '4DX' | 'Standard Digital')[];
  ticketPrice?: number;
  fandangoSearchUrl?: string;
  imdbId?: string;
  imdbUrl?: string;
}

export interface MovieTicketBooking {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  format: 'IMAX 3D' | 'Dolby Cinema' | '4DX' | 'Standard Digital';
  theaterName: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  bookingCode: string;
  timestamp: number;
  guestName?: string;
}

export interface GroundingWebChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface MCUWikiInfobox {
  category: 'character' | 'movie' | 'tv' | 'organization' | 'item' | 'general';
  realName?: string;
  aliases?: string[];
  actor?: string;
  director?: string;
  showrunner?: string;
  network?: string;
  episodes?: string;
  seasons?: string;
  writers?: string[];
  producers?: string[];
  release?: string;
  runtime?: string;
  boxoffice?: string;
  previousFilm?: string;
  nextFilm?: string;
  movies?: string[];
  status?: string;
  species?: string;
  citizenship?: string;
  quote?: string;
  imageUrl?: string;
}

export interface MCUWikiArticle {
  pageId: number;
  title: string;
  canonicalUrl: string;
  snippet?: string;
  imageUrl?: string;
  infobox?: MCUWikiInfobox;
  leadParagraph?: string;
  synopsis?: string;
  powersAndAbilities?: string[];
  equipment?: string[];
  quotes?: string[];
  relatedPages?: { title: string; url: string; snippet?: string }[];
  categories?: string[];
  apiEndpointUsed?: string;
  rawApiParams?: Record<string, string>;
}

export interface MCUSearchIntelResponse {
  query: string;
  analysis: string;
  sources: { uri: string; title: string }[];
  timestamp: number;
  wiki?: MCUWikiArticle;
  sourceType: 'fandom_mediawiki' | 'gemini_grounded' | 'hybrid';
  apiNotice?: string;
}

export type BuildingType = 
  | 'command_center'
  | 'arc_reactor'
  | 'hydroponic_dome'
  | 'scrap_foundry'
  | 'atmospheric_scrubber'
  | 'defense_turret'
  | 'living_quarters'
  | 'trading_depot'
  | 'stark_lab'
  | 'expedition_pad'
  | 'cantina_lounge'
  | 'tva_station'
  | 'oxe_spire'
  | 'damage_control_depot';

export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  description: string;
  category: 'energy' | 'resources' | 'life_support' | 'defense' | 'special';
  icon: string;
  baseCost: {
    scrap: number;
    power: number;
    vibraniumCredits: number;
  };
  basePowerGen: number;
  basePowerCost: number;
  baseScrapGen: number;
  baseFoodGen: number;
  baseOxygenGen: number;
  baseMoraleGen: number;
  baseDefense: number;
  baseHousing: number;
  maxWorkers: number;
  unlockedByDefault: boolean;
  requiredTech?: string;
}

export interface ColonyBuilding {
  id: string;
  type: BuildingType;
  customName?: string;
  gridX: number;
  gridY: number;
  level: number;
  maxLevel: number;
  health: number;
  maxHealth: number;
  isOperating: boolean;
  assignedHeroId: string | null;
  assignedWorkers: number;
  upgradingUntil: number | null;
}

export type TerrainType = 'open_scrap' | 'toxic_fissure' | 'geothermal_vent' | 'shipwreck_hulk' | 'ruined_arena' | 'crystal_vein';

export interface GridTile {
  x: number;
  y: number;
  terrain: TerrainType;
  terrainName: string;
  scrapYieldBonus: number;
  powerYieldBonus: number;
  hazardLevel: number;
  cleared: boolean;
  buildingId: string | null;
}

export interface ColonyResources {
  power: number;
  maxPower: number;
  scrap: number;
  maxScrap: number;
  food: number;
  maxFood: number;
  oxygen: number; // 0 to 100%
  vibraniumCredits: number;
  chronoCores: number; // Sub-atomic / temporal multiversal catalyst
  multiverseInfluence: number; // 0 to 1000+ points across realities
  incursionThreat: number; // 0 to 100% Incursion danger
  population: number;
  maxPopulation: number;
  assignedWorkers: number;
  morale: number; // 0 to 100%
  defenseRating: number;
}

export interface ResourceRates {
  powerNet: number;
  powerGen: number;
  powerCost: number;
  scrapNet: number;
  foodNet: number;
  foodGen: number;
  foodCost: number;
  oxygenChange: number;
  moraleChange: number;
}

export interface TechNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  developer: 
    | 'Stark Industries' 
    | 'Wakandan Design Group' 
    | 'Knowhere Black Market' 
    | 'Kamar-Taj Archive'
    | 'Time Variance Authority'
    | 'OXE Group'
    | 'Damage Control'
    | 'Multiverse Illuminati'
    | 'Yggdrasil Loom';
  cost: {
    scrap: number;
    vibraniumCredits: number;
    chronoCores?: number;
  };
  researched: boolean;
  description: string;
  effectDescription: string;
  icon: string;
  prerequisiteId?: string;
}

export interface ColonyCrisis {
  id: string;
  title: string;
  description: string;
  severity: 'moderate' | 'severe' | 'critical';
  timeLeftSec: number;
  maxTimeSec: number;
  threatType: 'raiders' | 'storm' | 'toxic_surge' | 'blackout' | 'temporal_rift' | 'grandmaster_demand' | 'quake';
  recommendedHeroIds: string[];
  options: {
    label: string;
    description: string;
    requiredHeroId?: string;
    cost?: { scrap?: number; power?: number; vibraniumCredits?: number };
    successChance: number; // 0 to 1
    onSuccessReward: string;
    onFailureConsequence: string;
    actionKey: string;
  }[];
}

export interface PlanetaryExpedition {
  id: string;
  name: string;
  location: string;
  description: string;
  hazardRating: 'Low' | 'Medium' | 'Extreme';
  durationSec: number;
  assignedHeroIds: string[];
  status: 'available' | 'in_progress' | 'completed';
  startTime?: number;
  endTime?: number;
  potentialLoot: {
    minScrap: number;
    maxScrap: number;
    minVibranium: number;
    maxVibranium: number;
    rareArtifactChance: number;
    chronoCores?: number;
  };
  recommendedRoles: HeroRole[];
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  cycle: number;
  type: 'info' | 'success' | 'warning' | 'danger' | 'crisis';
  message: string;
}

export interface MultiverseTimeline {
  id: string;
  name: string;
  realityCode: string; // e.g. 'Earth-616', 'Earth-10005', 'Earth-120703', 'Earth-26320', etc.
  filmFranchise?: string; // e.g. '20th Century Fox X-Men Franchise (2000–2024)'
  keyFigures?: string[]; // e.g. ['Wolverine', 'Professor X', 'Magneto', 'Deadpool']
  threatVector?: string; // e.g. 'Cerebro Psionic Overload & Weapon X Breach'
  posterUrl?: string; // Movie still or visual poster asset
  releaseEra?: string; // e.g. '2000–2024 Fox Saga'
  status: 'harmonized' | 'incursion_warning' | 'fractured' | 'stabilized';
  stabilityPercent: number; // 0 to 100%
  incursionRisk: number; // 0 to 100%
  description: string;
  lore: string;
  activePerk: string;
  stabilizeCost: {
    power: number;
    scrap: number;
    vibraniumCredits: number;
  };
  siphonReward: {
    chronoCores: number;
    vibraniumCredits: number;
    scrap: number;
  };
  lastStabilizedAt: number;
}

export interface MultiverseDirective {
  id: string;
  name: string;
  codename: string;
  influenceRequired: number;
  description: string;
  gravitasQuote: string;
  cost: {
    chronoCores: number;
    vibraniumCredits: number;
    power: number;
  };
  cooldownSec: number;
  lastUsedAt: number;
  effectType: 
    | 'loom_weave' 
    | 'quantum_repulsor' 
    | 'illuminati_protocol' 
    | 'alioth_purge' 
    | 'battleworld_anchor'
    | 'cerebro_protocol'
    | 'daywalker_ward'
    | 'oscorp_overcharge'
    | 'spider_society_patrol'
    | 'first_steps_protocol';
}

export interface IncursionRiftAnomaly {
  id: string;
  title: string;
  realityCode: string;
  severity: 'moderate' | 'catastrophic' | 'cosmic_nexus';
  description: string;
  stabilityWindowSec: number;
  maxWindowSec: number;
  recommendedHeroRole: HeroRole;
  requiredChronoStabilizerCost: {
    power: number;
    chronoCores?: number;
    scrap: number;
  };
  rewards: {
    chronoCores: number;
    multiverseInfluence: number;
    vibraniumCredits: number;
  };
}
