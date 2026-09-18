/**
 * Sakaar Outpost: MCU Space Colony
 * A dystopian space colony builder and management simulation powered by Marvel Cinematic Universe heroes.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Radio, 
  Users, 
  Compass, 
  Cpu, 
  ArrowLeftRight, 
  AlertTriangle,
  Zap,
  Wrench,
  Sprout,
  Wind,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Globe,
  Film,
  Clock,
  Skull,
  Camera,
  Ticket,
  Swords,
  Bot
} from 'lucide-react';

import { 
  BuildingType, 
  ColonyBuilding, 
  ColonyCrisis, 
  ColonyResources, 
  GameLogEntry, 
  GridTile, 
  MCUHero, 
  PlanetaryExpedition, 
  ResourceRates, 
  TechNode, 
  TerrainType,
  MultiverseTimeline,
  MultiverseDirective,
  IncursionRiftAnomaly,
  MovieTicketBooking
} from './types';

import { INITIAL_HEROES } from './data/mcuHeroes';
import { BUILDING_DEFINITIONS } from './data/buildings';
import { INITIAL_TECH_TREE } from './data/techTree';
import { CRISIS_TEMPLATES } from './data/crises';
import { INITIAL_EXPEDITIONS } from './data/expeditions';
import { INITIAL_TIMELINES, INITIAL_DIRECTIVES, INITIAL_INCURSION_RIFTS } from './data/multiverse';
import { enrichHeroWithUpgradeData, evolveHeroToTier2 } from './data/heroUpgrades';
import { soundFx } from './utils/audio';

import { HeaderHud } from './components/HeaderHud';
import { ColonyGrid } from './components/ColonyGrid';
import { HeroDrawer } from './components/HeroDrawer';
import { BuildingPaletteModal } from './components/BuildingPaletteModal';
import { BuildingDetailsModal } from './components/BuildingDetailsModal';
import { ExpeditionsView } from './components/ExpeditionsView';
import { TechLabView } from './components/TechLabView';
import { TradeDepotView } from './components/TradeDepotView';
import { MultiverseNexusView } from './components/MultiverseNexusView';
import { CrisisModal } from './components/CrisisModal';
import { ColonyLogDrawer } from './components/ColonyLogDrawer';
import { GuideModal } from './components/GuideModal';
import { MCUIntelModal } from './components/MCUIntelModal';
import { MCUPhotosApiModal } from './components/MCUPhotosApiModal';
import { MCUTicketsPortalModal } from './components/MCUTicketsPortalModal';
import { DoomsdayClockDashboard } from './components/DoomsdayClockDashboard';
import { BattleworldCommandView } from './components/BattleworldCommandView';
import { AutonomousCoPilotWidget } from './components/AutonomousCoPilotWidget';
import { GeminiColonyGuideChatbot } from './components/GeminiColonyGuideChatbot';
import { IncursionSparkline, IncursionHistoryPoint } from './components/IncursionSparkline';

const SAVE_KEY = 'sakaar_outpost_colony_v1';

// Initial Grid Generator (5x4)
function createInitialGrid(): { tiles: GridTile[]; buildings: ColonyBuilding[] } {
  const terrains: { type: TerrainType; name: string; scrap: number; power: number; hazard: number }[] = [
    { type: 'open_scrap', name: 'Scrap Dune', scrap: 10, power: 0, hazard: 0 },
    { type: 'shipwreck_hulk', name: 'Kree Frigate Hulk', scrap: 25, power: 0, hazard: 0 },
    { type: 'geothermal_vent', name: 'Geothermal Rift', scrap: 0, power: 30, hazard: 1 },
    { type: 'crystal_vein', name: 'Tesseract Crystal Seam', scrap: 15, power: 15, hazard: 0 },
    { type: 'toxic_fissure', name: 'Sulfur Fissure', scrap: 5, power: 10, hazard: 2 },
    { type: 'ruined_arena', name: 'Gladiator Arena Fragment', scrap: 20, power: 0, hazard: 0 },
  ];

  const tiles: GridTile[] = [];
  const buildings: ColonyBuilding[] = [];

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      const isCenter = x === 2 && y === 2;
      const isArcSlot = x === 1 && y === 2;
      const isScrapSlot = x === 3 && y === 2;
      const isBioSlot = x === 2 && y === 1;

      // Pick terrain deterministically
      const tIdx = (x * 3 + y * 5) % terrains.length;
      const terrain = terrains[tIdx];

      let buildingId: string | null = null;

      if (isCenter) {
        const bId = 'b_command_center';
        buildingId = bId;
        buildings.push({
          id: bId,
          type: 'command_center',
          gridX: x,
          gridY: y,
          level: 1,
          maxLevel: 3,
          health: 500,
          maxHealth: 500,
          isOperating: true,
          assignedHeroId: null,
          assignedWorkers: 1,
          upgradingUntil: null,
        });
      } else if (isArcSlot) {
        const bId = 'b_arc_initial';
        buildingId = bId;
        buildings.push({
          id: bId,
          type: 'arc_reactor',
          gridX: x,
          gridY: y,
          level: 1,
          maxLevel: 3,
          health: 300,
          maxHealth: 300,
          isOperating: true,
          assignedHeroId: 'iron_man',
          assignedWorkers: 2,
          upgradingUntil: null,
        });
      } else if (isScrapSlot) {
        const bId = 'b_scrap_initial';
        buildingId = bId;
        buildings.push({
          id: bId,
          type: 'scrap_foundry',
          gridX: x,
          gridY: y,
          level: 1,
          maxLevel: 3,
          health: 250,
          maxHealth: 250,
          isOperating: true,
          assignedHeroId: 'rocket',
          assignedWorkers: 2,
          upgradingUntil: null,
        });
      } else if (isBioSlot) {
        const bId = 'b_bio_initial';
        buildingId = bId;
        buildings.push({
          id: bId,
          type: 'hydroponic_dome',
          gridX: x,
          gridY: y,
          level: 1,
          maxLevel: 3,
          health: 250,
          maxHealth: 250,
          isOperating: true,
          assignedHeroId: 'hulk',
          assignedWorkers: 2,
          upgradingUntil: null,
        });
      }

      tiles.push({
        x,
        y,
        terrain: terrain.type,
        terrainName: terrain.name,
        scrapYieldBonus: terrain.scrap,
        powerYieldBonus: terrain.power,
        hazardLevel: terrain.hazard,
        cleared: true,
        buildingId,
      });
    }
  }

  return { tiles, buildings };
}

export default function App() {
  // Game Setup & State
  const initialSetup = useMemo(() => createInitialGrid(), []);

  const [resources, setResources] = useState<ColonyResources>({
    power: 120,
    maxPower: 400,
    scrap: 220,
    maxScrap: 600,
    food: 100,
    maxFood: 350,
    oxygen: 92,
    vibraniumCredits: 45,
    chronoCores: 2,
    multiverseInfluence: 85,
    incursionThreat: 15,
    population: 14,
    maxPopulation: 25,
    assignedWorkers: 7,
    morale: 85,
    defenseRating: 30,
  });

  const [tiles, setTiles] = useState<GridTile[]>(initialSetup.tiles);
  const [buildings, setBuildings] = useState<ColonyBuilding[]>(initialSetup.buildings);
  const [heroes, setHeroes] = useState<MCUHero[]>(() => {
    return INITIAL_HEROES.map((raw) => {
      const h = enrichHeroWithUpgradeData(raw);
      if (h.id === 'iron_man') return { ...h, assignedBuildingId: 'b_arc_initial', status: 'assigned' };
      if (h.id === 'rocket') return { ...h, assignedBuildingId: 'b_scrap_initial', status: 'assigned' };
      if (h.id === 'hulk') return { ...h, assignedBuildingId: 'b_bio_initial', status: 'assigned' };
      return h;
    });
  });

  const [techTree, setTechTree] = useState<TechNode[]>(INITIAL_TECH_TREE);
  const [expeditions, setExpeditions] = useState<PlanetaryExpedition[]>(INITIAL_EXPEDITIONS);
  const [timelines, setTimelines] = useState<MultiverseTimeline[]>(INITIAL_TIMELINES);
  const [directives, setDirectives] = useState<MultiverseDirective[]>(INITIAL_DIRECTIVES);
  const [incursionRifts, setIncursionRifts] = useState<IncursionRiftAnomaly[]>(INITIAL_INCURSION_RIFTS);
  const [cycle, setCycle] = useState<number>(1);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'expeditions' | 'tech' | 'trade' | 'multiverse' | 'doomsday' | 'battleworld'>('grid');

  // Active Crisis
  const [activeCrisis, setActiveCrisis] = useState<ColonyCrisis | null>(null);
  const nextCrisisTimerRef = useRef<number>(65);

  // Temporary buffs (e.g. abilities)
  const [overclockUntil, setOverclockUntil] = useState<number>(0);
  const [mirrorDimensionUntil, setMirrorDimensionUntil] = useState<number>(0);

  // Modals
  const [isHeroDrawerOpen, setIsHeroDrawerOpen] = useState<boolean>(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isMCUIntelModalOpen, setIsMCUIntelModalOpen] = useState<boolean>(false);
  const [mcuIntelQuery, setMcuIntelQuery] = useState<string>('Spider-Man Brand New Day');
  const [isMCUPhotosApiOpen, setIsMCUPhotosApiOpen] = useState<boolean>(false);
  const [photosApiHeroId, setPhotosApiHeroId] = useState<string | null>(null);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<MovieTicketBooking[]>(() => {
    try {
      const saved = localStorage.getItem('sakaar_movie_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveBooking = (booking: MovieTicketBooking) => {
    setUserBookings((prev) => {
      const updated = [booking, ...prev];
      try {
        localStorage.setItem('sakaar_movie_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save booking to localStorage', e);
      }
      return updated;
    });
  };

  const handleDeleteBooking = (bookingId: string) => {
    setUserBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      try {
        localStorage.setItem('sakaar_movie_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to remove booking from localStorage', e);
      }
      return updated;
    });
  };
  const [selectedTileForBuild, setSelectedTileForBuild] = useState<GridTile | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const handleOpenPhotosApi = (heroId?: string) => {
    if (heroId) {
      setPhotosApiHeroId(heroId);
    }
    setIsMCUPhotosApiOpen(true);
  };

  // Logs
  const [logs, setLogs] = useState<GameLogEntry[]>([
    {
      id: 'log_0',
      timestamp: Date.now(),
      cycle: 1,
      type: 'info',
      message: 'Avengers Sakaar Outpost initialized. Tony Stark, Rocket Raccoon, and Dr. Banner have assumed station posts.',
    }
  ]);

  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Add Log Helper
  const addLog = (message: string, type: GameLogEntry['type'] = 'info') => {
    setLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        cycle,
        type,
        message,
      },
      ...prev.slice(0, 49),
    ]);
  };

  // Researched tech IDs
  const researchedTechIds = useMemo(() => {
    return techTree.filter(t => t.researched).map(t => t.id);
  }, [techTree]);

  // Compute live resource rates
  const rates: ResourceRates = useMemo(() => {
    let powerGen = 0;
    let powerCost = 0;
    let scrapGen = 0;
    let foodGen = 0;
    let oxygenGen = 0;
    let moraleGen = 0;

    const isOverclocked = Date.now() < overclockUntil;
    const overclockMultiplier = isOverclocked ? 1.5 : 1.0;

    buildings.forEach((b) => {
      const def = BUILDING_DEFINITIONS[b.type];
      if (!def) return;

      const hero = b.assignedHeroId ? heroes.find(h => h.id === b.assignedHeroId) : null;
      const isAffinity = hero && hero.buildingAffinity === b.type;
      const levelMult = 1 + (b.level - 1) * 0.5;
      const workerBonus = 1 + b.assignedWorkers * 0.2;

      // Power
      if (def.basePowerGen > 0) {
        let pGen = def.basePowerGen * levelMult;
        if (isAffinity) pGen *= 1.65; // Tony's affinity
        if (researchedTechIds.includes('arc_overcharge')) pGen *= 1.35;
        powerGen += pGen * overclockMultiplier;
      }

      if (b.isOperating && def.basePowerCost > 0) {
        let pCost = def.basePowerCost;
        if (researchedTechIds.includes('vibranium_mesh')) pCost *= 0.85;
        powerCost += pCost;
      }

      // If building is operating, calculate outputs
      if (b.isOperating) {
        if (def.baseScrapGen > 0) {
          let sGen = def.baseScrapGen * levelMult * workerBonus;
          if (isAffinity) sGen *= 1.8; // Rocket's affinity
          scrapGen += sGen * overclockMultiplier;
        }

        if (def.baseFoodGen > 0) {
          let fGen = def.baseFoodGen * levelMult * workerBonus;
          if (isAffinity) fGen *= 1.7; // Bruce's affinity
          if (researchedTechIds.includes('gamma_photosynthesis')) fGen *= 1.5;
          foodGen += fGen * overclockMultiplier;
        }

        if (def.baseOxygenGen > 0) {
          let oGen = def.baseOxygenGen * levelMult;
          if (isAffinity) oGen *= 1.6; // Shuri's affinity
          if (researchedTechIds.includes('vibranium_mesh')) oGen *= 1.4;
          oxygenGen += oGen;
        }

        if (def.baseMoraleGen > 0) {
          moraleGen += def.baseMoraleGen * levelMult;
        }
      }
    });

    // Passive Tech perks
    if (researchedTechIds.includes('celestial_tap')) {
      powerGen += 100;
    }

    const powerNet = powerGen - powerCost;
    const foodCost = resources.population * 0.8;
    const foodNet = foodGen - foodCost;

    // Atmospheric oxygen depletion from Sakaar's toxic smog (-1.8/s base)
    const oxygenChange = (oxygenGen * 0.15) - 1.2;

    // Morale change factors
    let moraleChange = 0;
    if (resources.power <= 0) moraleChange -= 1.5;
    if (resources.food <= 0) moraleChange -= 2.0;
    if (resources.oxygen < 40) moraleChange -= 2.5;
    if (resources.food > 30 && resources.power > 20 && resources.oxygen >= 70) {
      moraleChange += 0.5 + (moraleGen * 0.05);
    }

    return {
      powerNet,
      powerGen,
      powerCost,
      scrapNet: scrapGen,
      foodNet,
      foodGen,
      foodCost,
      oxygenChange,
      moraleChange,
    };
  }, [buildings, heroes, researchedTechIds, resources.population, resources.power, resources.food, resources.oxygen, overclockUntil]);

  // Computed threat assessment configuration based on current incursionThreat resource
  const incursionThreatConfig = useMemo(() => {
    const val = Math.round(resources.incursionThreat);
    const clampedThreat = Math.max(0, Math.min(100, val));
    // Dynamic threat pulse speed: faster pulse for higher threat level
    // 0% threat = ~3.8s (slow, tranquil breathing), 50% = ~2.2s, 100% = ~0.65s (urgent fast alert)
    const pulseDurationSeconds = Math.max(0.65, 3.8 - (clampedThreat / 100) * 3.15);
    const pulseDuration = `${pulseDurationSeconds.toFixed(2)}s`;

    // Dynamic min and max opacity for the threat pulse overlay based on threat intensity
    const minOpacity = (0.08 + (clampedThreat / 100) * 0.12).toFixed(2);
    const maxOpacity = (0.24 + (clampedThreat / 100) * 0.28).toFixed(2);

    if (val >= 70) {
      return {
        level: 'CRITICAL',
        stability: 'COLLAPSE IMMINENT',
        textColor: 'text-rose-400',
        iconColor: 'text-rose-400',
        strokeColor: '#f43f5e',
        badgeStyle: 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-sm shadow-rose-950/50',
        dotStyle: 'bg-rose-500 shadow-sm shadow-rose-500/80',
        barColor: 'bg-rose-500',
        pulse: true,
        pulseDuration,
        pulseDurationSeconds,
        minOpacity,
        maxOpacity,
        overlayGradient: 'radial-gradient(ellipse at 50% 35%, rgba(244, 63, 94, 0.38) 0%, rgba(159, 18, 57, 0.18) 55%, rgba(2, 6, 23, 0) 85%)',
        glowColor: 'rgba(244, 63, 94, 0.35)',
        pulseBorderColor: 'rgba(244, 63, 94, 0.45)',
        description: 'Severe multiversal friction detected. Catastrophic timeline collapse imminent!',
      };
    }
    if (val >= 45) {
      return {
        level: 'HIGH',
        stability: 'DESTABILIZING',
        textColor: 'text-orange-400',
        iconColor: 'text-orange-400',
        strokeColor: '#f97316',
        badgeStyle: 'bg-orange-950/80 text-orange-300 border-orange-500/50 shadow-sm shadow-orange-950/40',
        dotStyle: 'bg-orange-400 shadow-sm shadow-orange-400/80',
        barColor: 'bg-orange-500',
        pulse: true,
        pulseDuration,
        pulseDurationSeconds,
        minOpacity,
        maxOpacity,
        overlayGradient: 'radial-gradient(ellipse at 50% 35%, rgba(249, 115, 22, 0.32) 0%, rgba(154, 52, 18, 0.15) 55%, rgba(2, 6, 23, 0) 85%)',
        glowColor: 'rgba(249, 115, 22, 0.28)',
        pulseBorderColor: 'rgba(249, 115, 22, 0.35)',
        description: 'Dimensional distortion multiplying across sector rifts. Timeline stability degrading.',
      };
    }
    if (val >= 25) {
      return {
        level: 'ELEVATED',
        stability: 'MONITORED',
        textColor: 'text-amber-400',
        iconColor: 'text-amber-400',
        strokeColor: '#fbbf24',
        badgeStyle: 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/40',
        dotStyle: 'bg-amber-400 shadow-sm shadow-amber-400/80',
        barColor: 'bg-amber-400',
        pulse: false,
        pulseDuration,
        pulseDurationSeconds,
        minOpacity,
        maxOpacity,
        overlayGradient: 'radial-gradient(ellipse at 50% 35%, rgba(251, 191, 36, 0.25) 0%, rgba(180, 83, 9, 0.12) 55%, rgba(2, 6, 23, 0) 85%)',
        glowColor: 'rgba(251, 191, 36, 0.22)',
        pulseBorderColor: 'rgba(251, 191, 36, 0.28)',
        description: 'Minor temporal divergence monitored across adjacent alternate timelines.',
      };
    }
    return {
      level: 'STABLE',
      stability: 'NOMINAL',
      textColor: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      strokeColor: '#10b981',
      badgeStyle: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/40',
      dotStyle: 'bg-emerald-400 shadow-sm shadow-emerald-400/80',
      barColor: 'bg-emerald-400',
      pulse: false,
      pulseDuration,
      pulseDurationSeconds,
      minOpacity,
      maxOpacity,
      overlayGradient: 'radial-gradient(ellipse at 50% 35%, rgba(16, 185, 129, 0.20) 0%, rgba(6, 95, 70, 0.10) 55%, rgba(2, 6, 23, 0) 85%)',
      glowColor: 'rgba(16, 185, 129, 0.18)',
      pulseBorderColor: 'rgba(16, 185, 129, 0.22)',
      description: 'Quantum fluctuations nominal. Colony timeline coherence is securely anchored.',
    };
  }, [resources.incursionThreat]);

  // Incursion Threat resource history tracking over the last 30 game cycles
  const [incursionHistory, setIncursionHistory] = useState<IncursionHistoryPoint[]>(() => {
    const points: IncursionHistoryPoint[] = [];
    const baseThreat = 15;
    for (let i = 29; i >= 0; i--) {
      const cycleNum = 1 - i;
      const sampleThreat = i === 0
        ? baseThreat
        : Math.max(5, Math.min(65, Math.round(baseThreat + Math.sin((30 - i) * 0.8) * 5 - (i * 0.15))));
      points.push({
        cycle: cycleNum,
        label: cycleNum > 0 ? `C${cycleNum}` : `C-${Math.abs(cycleNum) + 1}`,
        threat: sampleThreat,
      });
    }
    return points;
  });

  // Keep incursion threat history synchronized across game cycles and threat changes
  useEffect(() => {
    setIncursionHistory((prev) => {
      const currentThreat = Math.round(resources.incursionThreat);
      if (prev.length === 0) {
        return [{ cycle, label: `C${cycle}`, threat: currentThreat }];
      }
      const last = prev[prev.length - 1];
      if (last.cycle === cycle) {
        if (last.threat === currentThreat) return prev;
        const copy = [...prev];
        copy[copy.length - 1] = { ...last, threat: currentThreat };
        return copy;
      }
      // Sol cycle advanced: record new cycle point and keep exactly the last 30 game cycles
      const nextPoint: IncursionHistoryPoint = {
        cycle,
        label: `C${cycle}`,
        threat: currentThreat,
      };
      return [...prev, nextPoint].slice(-30);
    });
  }, [cycle, resources.incursionThreat]);

  // Main Simulation Loop (1-second tick scaled by gameSpeed)
  useEffect(() => {
    if (gameSpeed === 0) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());

      setResources((prev) => {
        // Power update
        let newPower = Math.min(prev.maxPower, Math.max(0, prev.power + (rates.powerNet / 2)));
        
        // Scrap update
        let newScrap = Math.min(prev.maxScrap, prev.scrap + rates.scrapNet);

        // Food update
        let newFood = Math.min(prev.maxFood, Math.max(0, prev.food + rates.foodNet));

        // Oxygen update
        let newOxygen = Math.min(100, Math.max(0, prev.oxygen + rates.oxygenChange));

        // Morale update
        let newMorale = Math.min(100, Math.max(5, prev.morale + rates.moraleChange));

        // Passive Vibranium units
        let newCredits = prev.vibraniumCredits;
        if (researchedTechIds.includes('celestial_tap')) {
          newCredits += 0.5;
        }

        // Starvation and blackout consequences
        if (prev.food <= 0 && prev.population > 5) {
          if (Math.random() < 0.05) {
            addLog('Famine alert! A malnourished scavenger perished. Keep hydro-domes stocked!', 'danger');
            soundFx.playAlarm();
            return {
              ...prev,
              population: Math.max(5, prev.population - 1),
              assignedWorkers: Math.min(prev.assignedWorkers, prev.population - 1),
              food: 0,
              morale: Math.max(5, prev.morale - 10),
            };
          }
        }

        if (prev.oxygen <= 15) {
          if (Math.random() < 0.08) {
            addLog('Suffocation alert! Toxic smog breached habitats. Clean air scrubbers needed!', 'danger');
            soundFx.playAlarm();
          }
        }

        return {
          ...prev,
          power: newPower,
          scrap: newScrap,
          food: newFood,
          oxygen: newOxygen,
          morale: newMorale,
          vibraniumCredits: newCredits,
        };
      });

      // Update building power operational states
      setBuildings((prevBuildings) => {
        const isPowerDepleted = resources.power <= 0;
        return prevBuildings.map((b) => {
          if (b.type === 'command_center' || b.type === 'arc_reactor') {
            return { ...b, isOperating: true };
          }
          if (isPowerDepleted) {
            return { ...b, isOperating: false };
          }
          return { ...b, isOperating: true };
        });
      });

      // Update active expeditions
      setExpeditions((prevExpeditions) => {
        return prevExpeditions.map((exp) => {
          if (exp.status === 'in_progress' && exp.endTime && Date.now() >= exp.endTime) {
            soundFx.playSuccess();
            addLog(`Quinjet mission returned from ${exp.name}! Spoils ready to claim at the launchpad.`, 'success');
            return { ...exp, status: 'completed' };
          }
          return exp;
        });
      });

      // Cycle Counter & Random Crisis Generator
      nextCrisisTimerRef.current -= 1;
      if (nextCrisisTimerRef.current <= 0 && !activeCrisis) {
        // Trigger a random crisis!
        const template = CRISIS_TEMPLATES[Math.floor(Math.random() * CRISIS_TEMPLATES.length)];
        const newCrisis: ColonyCrisis = {
          ...template,
          id: `crisis_${Date.now()}`,
          timeLeftSec: template.maxTimeSec,
        };
        setActiveCrisis(newCrisis);
        soundFx.playAlarm();
        addLog(`CRISIS ALERT: ${template.title} has begun! Immediate response required!`, 'crisis');
        nextCrisisTimerRef.current = 75 + Math.floor(Math.random() * 30);
      }

      // If crisis is currently counting down
      if (activeCrisis) {
        setActiveCrisis((prevCrisis) => {
          if (!prevCrisis) return null;
          if (prevCrisis.timeLeftSec <= 1) {
            // Crisis timed out without resolution!
            soundFx.playAlarm();
            addLog(`Crisis failed to resolve in time! Colony suffered heavy damage and lost scrap.`, 'danger');
            
            // Damage random buildings
            setBuildings((curr) => curr.map((b) => ({
              ...b,
              health: Math.max(20, b.health - 60),
            })));

            setResources((curr) => ({
              ...curr,
              scrap: Math.max(0, curr.scrap - 80),
              morale: Math.max(10, curr.morale - 25),
            }));

            return null;
          }
          return { ...prevCrisis, timeLeftSec: prevCrisis.timeLeftSec - 1 };
        });
      }

    }, 1000 / gameSpeed);

    return () => clearInterval(interval);
  }, [gameSpeed, rates, activeCrisis, resources.power, resources.population, resources.food, resources.oxygen, researchedTechIds]);

  // Handle Sol Cycle Increment (every 60s)
  useEffect(() => {
    if (gameSpeed === 0) return;
    const cycleInterval = setInterval(() => {
      setCycle((c) => {
        const nextC = c + 1;
        addLog(`Sol Cycle ${nextC} dawned over Sakaar. Transponders scanning wasteland scrap orbits.`, 'info');
        return nextC;
      });
    }, 60000 / gameSpeed);

    return () => clearInterval(cycleInterval);
  }, [gameSpeed]);

  // Construct New Building
  const handleConstructBuilding = (type: BuildingType) => {
    if (!selectedTileForBuild) return;
    const def = BUILDING_DEFINITIONS[type];
    if (!def) return;

    if (resources.scrap < def.baseCost.scrap || resources.vibraniumCredits < def.baseCost.vibraniumCredits) {
      addLog('Insufficient resources to construct this sector structure.', 'warning');
      return;
    }

    const newBuildingId = `b_${type}_${Date.now()}`;
    const newBuilding: ColonyBuilding = {
      id: newBuildingId,
      type,
      gridX: selectedTileForBuild.x,
      gridY: selectedTileForBuild.y,
      level: 1,
      maxLevel: 3,
      health: 250,
      maxHealth: 250,
      isOperating: true,
      assignedHeroId: null,
      assignedWorkers: 0,
      upgradingUntil: null,
    };

    setResources((prev) => ({
      ...prev,
      scrap: prev.scrap - def.baseCost.scrap,
      vibraniumCredits: prev.vibraniumCredits - def.baseCost.vibraniumCredits,
      maxPopulation: prev.maxPopulation + def.baseHousing,
      defenseRating: prev.defenseRating + def.baseDefense,
    }));

    setBuildings((prev) => [...prev, newBuilding]);
    setTiles((prev) => prev.map((t) => (t.x === selectedTileForBuild.x && t.y === selectedTileForBuild.y ? { ...t, buildingId: newBuildingId } : t)));

    soundFx.playBuild();
    addLog(`Constructed ${def.name} at Sector (${selectedTileForBuild.x}, ${selectedTileForBuild.y}).`, 'success');
    setSelectedTileForBuild(null);
  };

  // Upgrade Building
  const handleUpgradeBuilding = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    const def = BUILDING_DEFINITIONS[building.type];
    if (!def) return;

    const upgradeScrapCost = Math.round(def.baseCost.scrap * (building.level + 0.5));
    const upgradeVibraniumCost = Math.round(Math.max(15, def.baseCost.vibraniumCredits * 1.5 * building.level));

    if (resources.scrap < upgradeScrapCost || resources.vibraniumCredits < upgradeVibraniumCost) {
      addLog('Insufficient resources for sector upgrade.', 'warning');
      return;
    }

    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - upgradeScrapCost,
      vibraniumCredits: prev.vibraniumCredits - upgradeVibraniumCost,
      defenseRating: prev.defenseRating + (def.baseDefense ? Math.round(def.baseDefense * 0.5) : 0),
    }));

    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        return {
          ...b,
          level: b.level + 1,
          health: b.maxHealth + 100,
          maxHealth: b.maxHealth + 100,
        };
      }
      return b;
    }));

    soundFx.playSuccess();
    addLog(`Upgraded ${def.name} to MK-${building.level + 1}! Output and durability elevated.`, 'success');
  };

  // Repair Building
  const handleRepairBuilding = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    const def = BUILDING_DEFINITIONS[building.type];
    if (!def) return;

    const hasDodcDiscount = researchedTechIds.includes('dodc_salvage_protocol');
    const baseCost = (1 - building.health / building.maxHealth) * def.baseCost.scrap * 0.75;
    const repairScrapCost = Math.round(hasDodcDiscount ? baseCost * 0.5 : baseCost);

    if (resources.scrap < repairScrapCost) {
      addLog('Insufficient scrap to conduct structural repairs.', 'warning');
      return;
    }

    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - repairScrapCost,
    }));

    setBuildings(prev => prev.map(b => (b.id === buildingId ? { ...b, health: b.maxHealth } : b)));
    soundFx.playBuild();
    addLog(`Repaired structural integrity of ${def.name} back to 100%${hasDodcDiscount ? ' (DODC 50% discount applied)' : ''}.`, 'success');
  };

  // Assign Station Chief (MCU Hero)
  const handleAssignHero = (buildingId: string, heroId: string | null) => {
    // Unassign previous hero if any
    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        return { ...b, assignedHeroId: heroId };
      }
      if (heroId && b.assignedHeroId === heroId) {
        return { ...b, assignedHeroId: null };
      }
      return b;
    }));

    setHeroes(prev => prev.map(h => {
      if (h.id === heroId) {
        return { ...h, assignedBuildingId: buildingId, status: 'assigned' };
      }
      if (h.assignedBuildingId === buildingId && h.id !== heroId) {
        return { ...h, assignedBuildingId: null, status: 'idle' };
      }
      return h;
    }));

    soundFx.playClick();
    if (heroId) {
      const hero = heroes.find(h => h.id === heroId);
      const b = buildings.find(item => item.id === buildingId);
      const defName = b ? BUILDING_DEFINITIONS[b.type]?.name : 'Sector';
      addLog(`${hero?.heroName} assigned as Station Chief of ${defName}!`, 'info');
    }
  };

  // Unassign Hero directly from roster
  const handleUnassignHero = (heroId: string) => {
    setHeroes(prev => prev.map(h => h.id === heroId ? { ...h, assignedBuildingId: null, status: 'idle' } : h));
    setBuildings(prev => prev.map(b => b.assignedHeroId === heroId ? { ...b, assignedHeroId: null } : b));
    soundFx.playClick();
  };

  // Change Workers
  const handleChangeWorkers = (buildingId: string, delta: number) => {
    const freeWorkers = resources.population - resources.assignedWorkers;
    if (delta > 0 && freeWorkers <= 0) return;

    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        const newCount = Math.max(0, b.assignedWorkers + delta);
        return { ...b, assignedWorkers: newCount };
      }
      return b;
    }));

    setResources(prev => ({
      ...prev,
      assignedWorkers: Math.max(0, prev.assignedWorkers + delta),
    }));

    soundFx.playClick();
  };

  // Demolish Building
  const handleDemolishBuilding = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building || building.type === 'command_center') return;
    const def = BUILDING_DEFINITIONS[building.type];

    const refundScrap = Math.round(def.baseCost.scrap * 0.6);

    setResources(prev => ({
      ...prev,
      scrap: prev.scrap + refundScrap,
      assignedWorkers: Math.max(0, prev.assignedWorkers - building.assignedWorkers),
      maxPopulation: Math.max(10, prev.maxPopulation - def.baseHousing),
      defenseRating: Math.max(0, prev.defenseRating - (def.baseDefense * building.level)),
    }));

    // Free hero if assigned
    if (building.assignedHeroId) {
      handleUnassignHero(building.assignedHeroId);
    }

    setTiles(prev => prev.map(t => (t.buildingId === buildingId ? { ...t, buildingId: null } : t)));
    setBuildings(prev => prev.filter(b => b.id !== buildingId));

    setSelectedBuildingId(null);
    soundFx.playClick();
    addLog(`Deconstructed ${def.name}. Salvaged +${refundScrap} scrap.`, 'info');
  };

  // Trigger Hero Ability
  const handleTriggerAbility = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;

    soundFx.playAbility();
    setHeroes(prev => prev.map(h => h.id === heroId ? { ...h, ability: { ...h.ability, lastUsedAt: Date.now() } } : h));

    switch (hero.ability.actionType) {
      case 'power_surge': // Tony Stark
        setResources(prev => ({ ...prev, power: Math.min(prev.maxPower, prev.power + 350) }));
        addLog(`Tony Stark activated UNIBEAM PROTOCOL! Injected +350 MW into Arc Batteries.`, 'success');
        break;

      case 'bio_heal': // Hulk (True Power Unleashed by Jean Grey)
        setBuildings(prev => prev.map(b => ({ ...b, health: b.maxHealth })));
        setResources(prev => ({ 
          ...prev, 
          morale: Math.min(100, prev.morale + 25),
          defenseRating: prev.defenseRating + 30,
          scrap: Math.min(prev.maxScrap, prev.scrap + 200),
        }));
        addLog(`HULK UNLEASHED! Channeling the boundless gamma fury unlocked by Jean Grey in Brand New Day, Hulk repaired all sectors to 100% (+25 Morale, +30 Defense, +200 Scrap). HULK SMASH!`, 'success');
        break;

      case 'scrap_blast': // Rocket Raccoon
        setResources(prev => ({ ...prev, scrap: Math.min(prev.maxScrap, prev.scrap + 280) }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Rocket fired the HADRON ENFORCER! Vaporized Sakaaran raiders and harvested +280 Scrap!`, 'success');
        } else {
          addLog(`Rocket fired the HADRON ENFORCER! Demolished wasteland scrap hill into +280 refined materials.`, 'success');
        }
        break;

      case 'shield_overcharge': // Shuri
        setResources(prev => ({ ...prev, oxygen: 100, power: Math.min(prev.maxPower, prev.power + 200) }));
        addLog(`Shuri deployed KINETIC ABSORPTION MATRIX! Atmospheric O₂ purified to 100% (+200 Power).`, 'success');
        break;

      case 'lightning_strike': // Thor
        setResources(prev => ({ 
          ...prev, 
          power: Math.min(prev.maxPower, prev.power + 300),
          morale: Math.min(100, prev.morale + 35),
        }));
        if (activeCrisis && activeCrisis.threatType === 'storm') {
          setActiveCrisis(null);
          addLog(`Thor roared "BRING ME THANOS!" and channeled the plasma storm into +300 MW batteries!`, 'success');
        } else {
          addLog(`Thor summoned Bifrost celestial thunder, electrifying the power grid (+300 MW, +35 Morale)!`, 'success');
        }
        break;

      case 'overclock': // Nebula
        setOverclockUntil(Date.now() + 40000);
        addLog(`Nebula initiated CYBERNETIC OVERCLOCK! All colony resource production boosted 50% for 40 seconds.`, 'success');
        break;

      case 'trade_windfall': // Peter Quill
        setResources(prev => ({ ...prev, vibraniumCredits: prev.vibraniumCredits + 80 }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 30 } : null);
        }
        addLog(`Peter Quill performed DANCE-OFF DISTRACTION! Earned +80 Vibranium Credits and stalled crisis.`, 'success');
        break;

      case 'defense_ambush': // Gamora
        setResources(prev => ({ 
          ...prev, 
          scrap: Math.min(prev.maxScrap, prev.scrap + 150),
          morale: Math.min(100, prev.morale + 25),
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Gamora executed GODSLAYER AMBUSH! Marauders decimated with zero colony damage taken!`, 'success');
        } else {
          addLog(`Gamora ambushed Sakaaran gladiator scavengers on the perimeter (+150 Scrap, +25 Morale).`, 'success');
        }
        break;

      case 'mirror_dimension': // Doctor Strange
        setMirrorDimensionUntil(Date.now() + 25000);
        if (activeCrisis) {
          setActiveCrisis(null);
          addLog(`Doctor Strange cast MIRROR DIMENSION SHIELD! Phased the colony out of physical reality, neutralizing the crisis!`, 'success');
        } else {
          addLog(`Doctor Strange cast MIRROR DIMENSION SHIELD! Colony is completely shielded for 25s.`, 'success');
        }
        break;

      case 'orbital_recon': // Carol Danvers
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits + 120,
          scrap: Math.min(prev.maxScrap, prev.scrap + 200),
        }));
        addLog(`Carol Danvers streaked into orbit with BINARY SWEEP! Retrieved +120 Credits & +200 Scrap from high-orbit wrecks.`, 'success');
        break;

      case 'tva_chrono_reset': // Mobius M. Mobius (TVA)
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 150),
          morale: Math.min(100, prev.morale + 15),
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 45 } : null);
          addLog(`Agent Mobius engaged TEMPAD CHRONO-RESET! Rewound timeline anomalies, extended crisis countdown by +45s, and injected +150 MW power!`, 'success');
        } else {
          addLog(`Agent Mobius stabilized localized timeline variations with his TVA TemPad (+150 Power, +15 Morale).`, 'success');
        }
        break;

      case 'oxe_buyout': // Aiko Maki (OXE Group)
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits + 160,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          morale: Math.min(100, prev.morale + 10),
        }));
        addLog(`Aiko Maki executed HOSTILE BUYOUT PROTOCOL! Extracted +160 Vibranium Credits and +220 refined Scrap through aggressive corporate arbitrage.`, 'success');
        break;

      case 'dodc_lockdown': // Agent Cleary (Damage Control)
        setBuildings(prev => prev.map(b => ({ ...b, health: b.maxHealth })));
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 260),
          defenseRating: prev.defenseRating + 15,
        }));
        addLog(`Agent Cleary deployed DODC HEAVY DRONE CLEANUP! All damaged colony buildings restored to 100% integrity (+260 Scrap, +15 Defense).`, 'success');
        break;

      case 'spider_web_strike': // Spider-Man (Peter Parker - Brand New Day)
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          morale: Math.min(100, prev.morale + 20),
          defenseRating: prev.defenseRating + 25,
        }));
        if (activeCrisis && (activeCrisis.threatType === 'raiders' || activeCrisis.threatType === 'quake')) {
          setActiveCrisis(null);
          addLog(`Spider-Man webbed up falling sector debris & trapped invaders with BRAND NEW DAY WEB-GRID! Crisis averted (+220 Scrap, +20 Morale, +25 Defense).`, 'success');
        } else {
          addLog(`Spider-Man slung web-lines across the sector, catching falling orbital debris (+220 Scrap, +20 Morale, +25 Defense).`, 'success');
        }
        break;

      case 'raimi_web_fortitude': // Spider-Man (Earth-96283 / Tobey Maguire)
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 260),
          morale: Math.min(100, prev.morale + 25),
          defenseRating: prev.defenseRating + 35,
          incursionThreat: Math.max(0, prev.incursionThreat - 15),
        }));
        setBuildings(prev => prev.map(b => ({ ...b, health: Math.min(b.maxHealth, b.health + 75) })));
        if (activeCrisis) {
          setActiveCrisis(null);
          addLog(`Tobey Maguire's Spider-Man (Earth-96283) anchored the outpost with ORGANIC WEB-TETHERS! Halted structural collapse, neutralized the crisis (+260 Scrap, +25 Morale, +35 Defense, -15% Incursion threat).`, 'success');
        } else {
          addLog(`Spider-Man (Earth-96283) anchored the outpost with high-tensile organic web cables (+260 Scrap, +25 Morale, +35 Defense, repaired structures, -15% Incursions). "With great power comes great responsibility."`, 'success');
        }
        break;

      case 'ten_rings_strike': // Shang-Chi (Ten Rings)
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 220),
          morale: Math.min(100, prev.morale + 30),
          defenseRating: prev.defenseRating + 30,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Shang-Chi unleashed TEN RINGS COSMIC SHOCKWAVE! Hostile warband was pulverized by flying rings (+220 Power, +30 Morale).`, 'success');
        } else {
          addLog(`Shang-Chi channeled Ta Lo cosmic energy through the Ten Rings (+220 Power, +30 Morale, +30 Defense).`, 'success');
        }
        break;

      case 'ionic_overdrive': // Wonder Man (Simon Williams)
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 320),
          morale: Math.min(100, prev.morale + 25),
        }));
        addLog(`Wonder Man went into IONIC OVERDRIVE! Electrified the entire grid with pure ionic energy (+320 Power, +25 Morale).`, 'success');
        break;

      case 'widow_tactical_strike': // Yelena Belova (White Widow)
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 200),
          vibraniumCredits: prev.vibraniumCredits + 30,
          defenseRating: prev.defenseRating + 25,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Yelena Belova unleashed WIDOW'S BITE FLASHBANG AMBUSH! Marauder squads disoriented and captured (+200 Scrap, +30 Credits).`, 'success');
        } else {
          addLog(`Yelena Belova executed a stealth sweep of the outer perimeter (+200 Scrap, +30 Credits, +25 Defense).`, 'success');
        }
        break;

      case 'vibranium_arm_smash': // Bucky Barnes (Winter Soldier)
        setResources(prev => ({
          ...prev,
          defenseRating: prev.defenseRating + 40,
          vibraniumCredits: prev.vibraniumCredits + 120,
          morale: Math.min(100, prev.morale + 15),
        }));
        if (activeCrisis && (activeCrisis.threatType === 'raiders' || activeCrisis.threatType === 'quake')) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 30 } : null);
          addLog(`Bucky Barnes slammed his Wakandan vibranium arm into the ground with KINETIC BREAKER! Fortified defenses (+40 Defense, +120 Credits).`, 'success');
        } else {
          addLog(`Bucky Barnes reinforced colony battle lines with his Vibranium arm (+40 Defense, +120 Credits, +15 Morale).`, 'success');
        }
        break;

      case 'usagent_shield_slam': // U.S. Agent (John Walker)
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 190),
          defenseRating: prev.defenseRating + 35,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`John Walker engaged in a brutal SHIELD RICOCHET SWEEP! Decimated raider boarding skiffs (+190 Scrap, +35 Defense).`, 'success');
        } else {
          addLog(`John Walker patrolled the outer wasteland and neutralized scavenger outposts (+190 Scrap, +35 Defense).`, 'success');
        }
        break;

      case 'red_guardian_brawl': // Red Guardian (Alexei Shostakov)
        setResources(prev => ({
          ...prev,
          morale: Math.min(100, prev.morale + 35),
          scrap: Math.min(prev.maxScrap, prev.scrap + 180),
          food: Math.min(prev.maxFood, prev.food + 50),
        }));
        addLog(`Red Guardian launched RED BRAWN HEROIC CHARGE! Tore through scrap barriers, hosted a glorious feast, and raised Morale by +35% (+180 Scrap, +50 Food).`, 'success');
        break;

      case 'captain_america_rally': // Sam Wilson (Captain America)
        setResources(prev => ({
          ...prev,
          morale: Math.min(100, prev.morale + 35),
          defenseRating: prev.defenseRating + 35,
          vibraniumCredits: prev.vibraniumCredits + 120,
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 40 } : null);
          addLog(`Captain America (Sam Wilson) soared overhead with VIBRANIUM WING SONIC DIVE! Rallied all colonists (+35 Morale, +35 Defense, +120 Credits, +40s crisis delay).`, 'success');
        } else {
          addLog(`Captain America (Sam Wilson) rallied the colony from the skies with his shield and vibranium wings (+35 Morale, +35 Defense, +120 Credits).`, 'success');
        }
        break;

      case 'radar_sense_alert': // Matt Murdock (Daredevil)
        setResources(prev => ({
          ...prev,
          defenseRating: prev.defenseRating + 35,
          morale: Math.min(100, prev.morale + 20),
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 35 } : null);
          addLog(`Daredevil used BORN AGAIN RADAR PRECOGNITION to pinpoint subterranean tremors and hostile movement (+35 Defense, +20 Morale, +35s crisis window).`, 'success');
        } else {
          addLog(`Daredevil mapped subterranean acoustic vibrations across the colony (+35 Defense, +20 Morale).`, 'success');
        }
        break;

      case 'trick_arrow_salvo': // Kate Bishop (Hawkeye)
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 240),
          power: Math.min(prev.maxPower, prev.power + 60),
          vibraniumCredits: prev.vibraniumCredits + 25,
        }));
        addLog(`Kate Bishop fired a PYM TRICK ARROW SALVO! Shrunk giant spaceship engine blocks into compact salvage (+240 Scrap, +60 Power, +25 Credits).`, 'success');
        break;

      case 'thanos_snap_rebalance': // Thanos
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 320),
          scrap: Math.min(prev.maxScrap, prev.scrap + 250),
          defenseRating: prev.defenseRating + 45,
        }));
        if (activeCrisis && (activeCrisis.threatType === 'raiders' || activeCrisis.threatType === 'quake')) {
          setActiveCrisis(null);
          addLog(`Thanos snapped with the Infinity Gauntlet: "I AM INEVITABLE!" Annihilated the hostile invaders (+320 Power, +250 Scrap, +45 Defense).`, 'success');
        } else {
          addLog(`Thanos snapped with the Infinity Gauntlet, brutally rebalancing cosmic energy (+320 Power, +250 Scrap, +45 Defense).`, 'success');
        }
        break;

      case 'loki_mischief_illusion': // Loki
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          vibraniumCredits: prev.vibraniumCredits + 90,
          morale: Math.min(100, prev.morale + 20),
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 40 } : null);
          addLog(`Loki deployed GREEN ILLUSION MIRAGES! Confused attackers and pilfered +90 Credits and +220 Scrap (+40s crisis delay).`, 'success');
        } else {
          addLog(`Loki deceived perimeter scavengers with shimmering jade illusions (+220 Scrap, +90 Credits, +20 Morale).`, 'success');
        }
        break;

      case 'hela_necrosword_storm': // Hela
        setResources(prev => ({
          ...prev,
          defenseRating: prev.defenseRating + 45,
          scrap: Math.min(prev.maxScrap, prev.scrap + 180),
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Hela unleashed NECROSWORD SKY TORRENT! Skewered every attacking raider skiff (+45 Defense, +180 Scrap).`, 'success');
        } else {
          addLog(`Hela conjured obsidian necrosword spires fortifying colony frontiers (+45 Defense, +180 Scrap).`, 'success');
        }
        break;

      case 'ultron_drone_fabrication': // Ultron
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 280),
          power: Math.min(prev.maxPower, prev.power + 50),
          defenseRating: prev.defenseRating + 40,
        }));
        addLog(`Ultron engineered an AUTONOMOUS SENTRY SWARM! Assimilated scrap mountains into +280 Scrap, +50 Power, and +40 Defense.`, 'success');
        break;

      case 'killmonger_kinetic_burst': // Killmonger
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits + 150,
          scrap: Math.min(prev.maxScrap, prev.scrap + 160),
          defenseRating: prev.defenseRating + 25,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Killmonger detonated GOLD JAGUAR KINETIC BURST! Blasted through enemy ranks (+150 Credits, +160 Scrap).`, 'success');
        } else {
          addLog(`Killmonger discharged raw kinetic vibranium energy into the colony grid (+150 Credits, +160 Scrap, +25 Defense).`, 'success');
        }
        break;

      case 'goblin_pumpkin_barrage': // Green Goblin
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 210),
          power: Math.min(prev.maxPower, prev.power + 50),
          defenseRating: prev.defenseRating + 25,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Green Goblin cackled wildly and carpet-bombed raiders with PUMPKIN BOMBS! (+210 Scrap, +50 Power, +25 Defense).`, 'success');
        } else {
          addLog(`Green Goblin bombed outer ruins with pumpkin explosives (+210 Scrap, +50 Power, +25 Defense).`, 'success');
        }
        break;

      case 'wenwu_ten_rings_strike': // Wenwu
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 240),
          defenseRating: prev.defenseRating + 35,
          vibraniumCredits: prev.vibraniumCredits + 90,
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Wenwu unleashed the CONQUEROR'S TEN RINGS STRIKE! Pulverized opposing warbands (+240 Power, +35 Defense, +90 Credits).`, 'success');
        } else {
          addLog(`Wenwu exerted 1,000 years of iron will with the Ten Rings (+240 Power, +35 Defense, +90 Credits).`, 'success');
        }
        break;

      case 'grandmaster_melt_sweepstakes': // Grandmaster
        setResources(prev => ({
          ...prev,
          morale: Math.min(100, prev.morale + 50),
          scrap: Math.min(prev.maxScrap, prev.scrap + 180),
          vibraniumCredits: prev.vibraniumCredits + 100,
        }));
        addLog(`The Grandmaster used the MELT STICK and launched a Sakaaran Contest of Champions festival! (+50 Morale, +180 Scrap, +100 Credits).`, 'success');
        break;

      case 'gorr_shadow_snare': // Gorr
        setResources(prev => ({
          ...prev,
          defenseRating: prev.defenseRating + 40,
          scrap: Math.min(prev.maxScrap, prev.scrap + 160),
        }));
        if (activeCrisis && activeCrisis.threatType === 'raiders') {
          setActiveCrisis(null);
          addLog(`Gorr summoned NECROSWORD SHADOW MONSTERS! Dragged invading forces into the dark void (+40 Defense, +160 Scrap).`, 'success');
        } else {
          addLog(`Gorr's shadow tendrils reinforced the colony perimeter (+40 Defense, +160 Scrap).`, 'success');
        }
        break;

      case 'kang_temporal_stasis': // Kang
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 200),
          power: Math.min(prev.maxPower, prev.power + 100),
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 50 } : null);
          addLog(`Kang activated QUANTUM TIME-DILATION FIELD! Locked the sector in temporal stasis (+50s crisis window, +200 Scrap, +100 Power).`, 'success');
        } else {
          addLog(`Kang halted entropy around colony dynamos with future technology (+200 Scrap, +100 Power).`, 'success');
        }
        break;

      default:
        // Tactical action execution for expanded MCU roster heroes
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          power: Math.min(prev.maxPower, prev.power + 150),
          defenseRating: prev.defenseRating + 30,
          morale: Math.min(100, prev.morale + 20),
        }));
        if (activeCrisis) {
          setActiveCrisis(curr => curr ? { ...curr, timeLeftSec: curr.timeLeftSec + 30 } : null);
          addLog(`${hero.heroName} deployed ${hero.ability.name}! Stalled active crisis (+30s window, +220 Scrap, +150 Power, +30 Defense).`, 'success');
        } else {
          addLog(`${hero.heroName} deployed ${hero.ability.name}! Reinforced colony frontier (+220 Scrap, +150 Power, +30 Defense, +20 Morale).`, 'success');
        }
        break;
    }
  };

  // Launch Quinjet Away-Team
  const handleLaunchExpedition = (expeditionId: string, heroIds: string[]) => {
    const expedition = expeditions.find(e => e.id === expeditionId);
    if (!expedition) return;

    soundFx.playBuild();
    const durationMs = expedition.durationSec * 1000;
    const startTime = Date.now();
    const endTime = startTime + durationMs;

    setExpeditions(prev => prev.map(e => e.id === expeditionId ? {
      ...e,
      status: 'in_progress',
      assignedHeroIds: heroIds,
      startTime,
      endTime,
    } : e));

    setHeroes(prev => prev.map(h => heroIds.includes(h.id) ? { ...h, status: 'on_expedition' } : h));

    addLog(`Quinjet launched for ${expedition.name} with ${heroIds.length} heroes aboard!`, 'info');
  };

  // Claim Expedition Spoils
  const handleClaimExpedition = (expeditionId: string) => {
    const expedition = expeditions.find(e => e.id === expeditionId);
    if (!expedition) return;

    const scrapLoot = Math.floor(expedition.potentialLoot.minScrap + Math.random() * (expedition.potentialLoot.maxScrap - expedition.potentialLoot.minScrap));
    const creditLoot = Math.floor(expedition.potentialLoot.minVibranium + Math.random() * (expedition.potentialLoot.maxVibranium - expedition.potentialLoot.minVibranium));
    const chronoCoresLoot = expedition.potentialLoot.chronoCores || 0;

    soundFx.playSuccess();

    setResources(prev => ({
      ...prev,
      scrap: Math.min(prev.maxScrap, prev.scrap + scrapLoot),
      vibraniumCredits: prev.vibraniumCredits + creditLoot,
      chronoCores: prev.chronoCores + chronoCoresLoot,
      multiverseInfluence: prev.multiverseInfluence + (chronoCoresLoot > 0 ? chronoCoresLoot * 20 : 5),
      morale: Math.min(100, prev.morale + 15),
    }));

    // Free heroes
    setHeroes(prev => prev.map(h => {
      if (expedition.assignedHeroIds.includes(h.id)) {
        return {
          ...h,
          status: h.assignedBuildingId ? 'assigned' : 'idle',
        };
      }
      return h;
    }));

    // Reset expedition
    setExpeditions(prev => prev.map(e => e.id === expeditionId ? {
      ...e,
      status: 'available',
      assignedHeroIds: [],
      startTime: undefined,
      endTime: undefined,
    } : e));

    const lootMsg = chronoCoresLoot > 0
      ? `Recovered +${scrapLoot} Scrap, +${creditLoot} Vibranium Units, and +${chronoCoresLoot} Chrono-Cores!`
      : `Recovered +${scrapLoot} Scrap and +${creditLoot} Vibranium Units!`;
    addLog(`Expedition claims verified: ${lootMsg}`, 'success');
  };

  // Research Tech
  const handleResearchTech = (techId: string) => {
    const tech = techTree.find(t => t.id === techId);
    if (!tech || tech.researched) return;

    const chronoCoreCost = tech.cost.chronoCores || 0;
    if (
      resources.scrap < tech.cost.scrap || 
      resources.vibraniumCredits < tech.cost.vibraniumCredits ||
      resources.chronoCores < chronoCoreCost
    ) {
      addLog('Insufficient resources to synthesize tech.', 'warning');
      return;
    }

    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - tech.cost.scrap,
      vibraniumCredits: prev.vibraniumCredits - tech.cost.vibraniumCredits,
      chronoCores: prev.chronoCores - chronoCoreCost,
      multiverseInfluence: prev.multiverseInfluence + (tech.tier === 4 ? 45 : 15),
    }));

    setTechTree(prev => prev.map(t => t.id === techId ? { ...t, researched: true } : t));

    soundFx.playSuccess();
    addLog(`Breakthrough synthesized: ${tech.name}! ${tech.effectDescription}`, 'success');
  };

  // Execute Trade at Barter Post
  const handleExecuteTrade = (tradeType: string) => {
    soundFx.playClick();
    switch (tradeType) {
      case 'sell_scrap':
        if (resources.scrap < 100) return;
        setResources(prev => ({
          ...prev,
          scrap: prev.scrap - 100,
          vibraniumCredits: prev.vibraniumCredits + 25,
        }));
        addLog('Bartered 100 Scrap to Ravagers for +25 Vibranium Credits.', 'info');
        break;

      case 'buy_food':
        if (resources.vibraniumCredits < 20) return;
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits - 20,
          food: Math.min(prev.maxFood, prev.food + 80),
        }));
        addLog('Purchased emergency hydro-rations (+80 Food) from smugglers.', 'info');
        break;

      case 'recruit_scavengers':
        if (resources.vibraniumCredits < 35 || resources.population + 3 > resources.maxPopulation) return;
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits - 35,
          population: prev.population + 3,
          morale: Math.min(100, prev.morale + 10),
        }));
        addLog('Ransomed 3 enslaved scavengers from gladiator slavers. Population expanded!', 'success');
        break;

      case 'buy_power':
        if (resources.scrap < 80 || resources.vibraniumCredits < 15) return;
        setResources(prev => ({
          ...prev,
          scrap: prev.scrap - 80,
          vibraniumCredits: prev.vibraniumCredits - 15,
          power: Math.min(prev.maxPower, prev.power + 250),
        }));
        addLog('Installed smuggled Sovereign Battery: +250 MW Arc Power.', 'success');
        break;

      case 'host_festival':
        if (resources.vibraniumCredits < 25) return;
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits - 25,
          morale: Math.min(100, prev.morale + 30),
        }));
        addLog('Peter Quill threw a massive cosmic rave festival! Morale boosted +30%.', 'success');
        break;

      case 'trade_tva_paperweight':
        if (resources.scrap < 80 || resources.vibraniumCredits < 15) return;
        setResources(prev => ({
          ...prev,
          scrap: prev.scrap - 80,
          vibraniumCredits: prev.vibraniumCredits - 15,
          power: Math.min(prev.maxPower, prev.power + 350),
          morale: Math.min(100, prev.morale + 15),
        }));
        addLog('Acquired TVA "Paperweight" Infinity Stones: Injected +350 MW clean power & +15 Morale.', 'success');
        break;

      case 'trade_oxe_futures': {
        if (resources.vibraniumCredits < 40) return;
        const bonusMult = researchedTechIds.includes('oxe_hyper_monopoly') ? 1.35 : 1.0;
        const scrapGain = Math.round(250 * bonusMult);
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits - 40,
          scrap: Math.min(prev.maxScrap, prev.scrap + scrapGain),
          morale: Math.min(100, prev.morale + 10),
        }));
        addLog(`Arbitraged OXE Conglomerate Futures Contract: +${scrapGain} refined Scrap delivered to silos.`, 'success');
        break;
      }

      case 'trade_dodc_salvage':
        if (resources.scrap < 60 || resources.vibraniumCredits < 20) return;
        setResources(prev => ({
          ...prev,
          scrap: prev.scrap - 60,
          vibraniumCredits: prev.vibraniumCredits - 20,
          defenseRating: prev.defenseRating + 30,
          oxygen: Math.min(100, prev.oxygen + 25),
        }));
        setBuildings(prev => prev.map(b => ({ ...b, health: Math.min(b.maxHealth, b.health + 50) })));
        addLog('Requisitioned DODC hazardous ordnance: +30 Defense, decontaminated air (+25 O₂), and patched hull damage.', 'success');
        break;
    }
  };

  // Multiverse Operations: Stabilize Branch Timeline
  const handleStabilizeTimeline = (timelineId: string) => {
    const timeline = timelines.find(t => t.id === timelineId);
    if (!timeline) return;

    if (
      resources.power < timeline.stabilizeCost.power ||
      resources.scrap < timeline.stabilizeCost.scrap ||
      resources.vibraniumCredits < timeline.stabilizeCost.vibraniumCredits
    ) {
      soundFx.playAlarm();
      addLog(`Insufficient resources to stabilize reality ${timeline.realityCode}.`, 'danger');
      return;
    }

    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      power: prev.power - timeline.stabilizeCost.power,
      scrap: prev.scrap - timeline.stabilizeCost.scrap,
      vibraniumCredits: prev.vibraniumCredits - timeline.stabilizeCost.vibraniumCredits,
      multiverseInfluence: prev.multiverseInfluence + 35,
      incursionThreat: Math.max(0, prev.incursionThreat - 12),
      morale: Math.min(100, prev.morale + 10),
    }));

    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return {
          ...t,
          stabilityPercent: Math.min(100, t.stabilityPercent + 20),
          incursionRisk: Math.max(5, t.incursionRisk - 25),
          status: 'stabilized',
        };
      }
      return t;
    }));

    addLog(`TIMELINE HARMONIZED: ${timeline.realityCode} (${timeline.name}) temporal dampeners reinforced! Multiverse Influence +35, Incursion Risk decreased.`, 'success');
  };

  // Multiverse Operations: Siphon Multiversal Energy
  const handleSiphonTimeline = (timelineId: string) => {
    const timeline = timelines.find(t => t.id === timelineId);
    if (!timeline) return;

    soundFx.playSuccess();
    setResources(prev => ({
      ...prev,
      chronoCores: prev.chronoCores + timeline.siphonReward.chronoCores,
      vibraniumCredits: prev.vibraniumCredits + timeline.siphonReward.vibraniumCredits,
      scrap: Math.min(prev.maxScrap, prev.scrap + timeline.siphonReward.scrap),
      multiverseInfluence: prev.multiverseInfluence + 20,
      incursionThreat: Math.min(100, prev.incursionThreat + 8),
    }));

    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return {
          ...t,
          incursionRisk: Math.min(100, t.incursionRisk + 12),
          stabilityPercent: Math.max(10, t.stabilityPercent - 10),
        };
      }
      return t;
    }));

    addLog(`COSMIC HARVEST: Siphoned multiversal leakage from ${timeline.realityCode}! Yielded +${timeline.siphonReward.chronoCores} Chrono-Cores, +${timeline.siphonReward.vibraniumCredits} Credits, +${timeline.siphonReward.scrap} Scrap.`, 'info');
  };

  // Multiverse Operations: Enact Cosmic Directive
  const handleEnactDirective = (directiveId: string) => {
    const directive = directives.find(d => d.id === directiveId);
    if (!directive) return;

    if (resources.multiverseInfluence < directive.influenceRequired) {
      soundFx.playAlarm();
      addLog(`Influence rating insufficient to authorize ${directive.name}.`, 'danger');
      return;
    }

    if (
      resources.chronoCores < directive.cost.chronoCores ||
      resources.vibraniumCredits < directive.cost.vibraniumCredits ||
      resources.power < directive.cost.power
    ) {
      soundFx.playAlarm();
      addLog(`Insufficient cosmic reserves for ${directive.codename}.`, 'danger');
      return;
    }

    soundFx.playSuccess();

    setResources(prev => ({
      ...prev,
      chronoCores: prev.chronoCores - directive.cost.chronoCores,
      vibraniumCredits: prev.vibraniumCredits - directive.cost.vibraniumCredits,
      power: prev.power - directive.cost.power,
      multiverseInfluence: prev.multiverseInfluence + 50,
      morale: 100,
      incursionThreat: Math.max(0, prev.incursionThreat - 30),
      defenseRating: prev.defenseRating + 30,
    }));

    // Specific directive effects
    if (directive.id === 'dir_yggdrasil_loom' || directive.id === 'loom_weave') {
      // Reset all hero cooldowns
      setHeroes(prev => prev.map(h => ({
        ...h,
        ability: { ...h.ability, lastUsedAt: 0 }
      })));
      setTimelines(prev => prev.map(t => ({
        ...t,
        stabilityPercent: Math.min(100, t.stabilityPercent + 25),
        incursionRisk: Math.max(5, t.incursionRisk - 30),
      })));
    } else if (directive.id === 'cerebro_protocol') {
      // Earth-10005 Cerebro Psionic Sweep
      setTimelines(prev => prev.map(t => ({
        ...t,
        incursionRisk: Math.max(0, t.incursionRisk - 20),
        stabilityPercent: Math.min(100, t.stabilityPercent + 15),
      })));
      setResources(prev => ({
        ...prev,
        defenseRating: prev.defenseRating + 45,
        incursionThreat: Math.max(0, prev.incursionThreat - 25),
      }));
    } else if (directive.id === 'daywalker_ward') {
      // Earth-26320 Blade Daywalker Shroud
      setResources(prev => ({
        ...prev,
        scrap: Math.min(prev.maxScrap, prev.scrap + 350),
        defenseRating: prev.defenseRating + 50,
        incursionThreat: Math.max(0, prev.incursionThreat - 20),
      }));
    } else if (directive.id === 'oscorp_overcharge') {
      // Earth-120703 Oscorp Overdrive
      setResources(prev => ({
        ...prev,
        power: Math.min(prev.maxPower, prev.power + 600),
        vibraniumCredits: prev.vibraniumCredits + 80,
      }));
    } else if (directive.id === 'spider_society_patrol') {
      // Earth-1610B / Earth-928B Spider-Society Patrol
      setIncursionRifts([]);
      setResources(prev => ({
        ...prev,
        chronoCores: prev.chronoCores + 3,
        incursionThreat: Math.max(0, prev.incursionThreat - 35),
      }));
    } else if (directive.id === 'first_steps_protocol') {
      // Earth-828 Fantastic Four: First Steps & Doomsday Baxter Protocol
      setTimelines(prev => prev.map(t => ({
        ...t,
        incursionRisk: Math.max(0, t.incursionRisk - 25),
        stabilityPercent: Math.min(100, t.stabilityPercent + 20),
      })));
      setResources(prev => ({
        ...prev,
        power: Math.min(prev.maxPower, prev.power + 250),
        chronoCores: prev.chronoCores + 4,
        incursionThreat: Math.max(0, prev.incursionThreat - 30),
        defenseRating: prev.defenseRating + 50,
      }));
      setBuildings(prev => prev.map(b => ({ ...b, health: Math.min(100, b.health + 40) })));
    } else if (directive.id === 'dir_illuminati_sync' || directive.id === 'illuminati_protocol') {
      setResources(prev => ({
        ...prev,
        scrap: Math.min(prev.maxScrap, prev.scrap + 400),
        defenseRating: prev.defenseRating + 40,
        vibraniumCredits: prev.vibraniumCredits + 180,
      }));
      setBuildings(prev => prev.map(b => ({ ...b, health: 100 })));
    } else if (directive.id === 'alioth_purge') {
      setResources(prev => ({
        ...prev,
        scrap: Math.min(prev.maxScrap, prev.scrap + 500),
        morale: 100,
        incursionThreat: Math.max(0, prev.incursionThreat - 40),
      }));
    } else if (directive.id === 'dir_battleworld_sovereign' || directive.id === 'battleworld_anchor') {
      setResources(prev => ({
        ...prev,
        scrap: prev.maxScrap,
        power: prev.maxPower,
        food: prev.maxFood,
        chronoCores: prev.chronoCores + 8,
        vibraniumCredits: prev.vibraniumCredits + 250,
        incursionThreat: 0,
      }));
    }

    setDirectives(prev => prev.map(d => d.id === directiveId ? {
      ...d,
      lastUsedAt: Date.now()
    } : d));

    addLog(`COSMIC MANDATE ENACTED: [${directive.codename}] ${directive.name}! "${directive.gravitasQuote}"`, 'success');
  };

  // Multiverse Operations: Seal Incursion Rift
  const handleStabilizeRift = (riftId: string) => {
    const rift = incursionRifts.find(r => r.id === riftId);
    if (!rift) return;

    if (
      resources.power < rift.requiredChronoStabilizerCost.power ||
      resources.scrap < rift.requiredChronoStabilizerCost.scrap ||
      resources.chronoCores < (rift.requiredChronoStabilizerCost.chronoCores || 0)
    ) {
      soundFx.playAlarm();
      addLog(`Insufficient energy or Chrono-Cores to seal incursion rift.`, 'danger');
      return;
    }

    soundFx.playSuccess();

    setResources(prev => ({
      ...prev,
      power: prev.power - rift.requiredChronoStabilizerCost.power,
      scrap: prev.scrap - rift.requiredChronoStabilizerCost.scrap,
      chronoCores: prev.chronoCores - (rift.requiredChronoStabilizerCost.chronoCores || 0) + rift.rewards.chronoCores,
      multiverseInfluence: prev.multiverseInfluence + rift.rewards.multiverseInfluence,
      incursionThreat: Math.max(0, prev.incursionThreat - 20),
      morale: Math.min(100, prev.morale + 15),
    }));

    setIncursionRifts(prev => prev.filter(r => r.id !== riftId));

    addLog(`INCURSION RIFT SEALED: Closed tear with ${rift.realityCode}! Harvested +${rift.rewards.chronoCores} Chrono-Cores and +${rift.rewards.multiverseInfluence} Multiverse Influence.`, 'success');
  };

  // Hero Apex Ascension to Tier 2
  const handleUpgradeHero = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero || hero.tier === 2) return;

    const cost = hero.upgradeCost || { scrap: 300, vibraniumCredits: 50, chronoCores: 2 };

    if (
      resources.scrap < cost.scrap ||
      resources.vibraniumCredits < cost.vibraniumCredits ||
      resources.chronoCores < cost.chronoCores
    ) {
      soundFx.playAlarm();
      addLog(`Insufficient resources to ascend ${hero.heroName} to Multiverse Apex form.`, 'danger');
      return;
    }

    soundFx.playSuccess();

    setResources(prev => ({
      ...prev,
      scrap: prev.scrap - cost.scrap,
      vibraniumCredits: prev.vibraniumCredits - cost.vibraniumCredits,
      chronoCores: prev.chronoCores - cost.chronoCores,
      multiverseInfluence: prev.multiverseInfluence + 55,
      morale: Math.min(100, prev.morale + 20),
    }));

    const ascendedHero = evolveHeroToTier2(hero);

    setHeroes(prev => prev.map(h => h.id === heroId ? ascendedHero : h));

    addLog(`APEX ASCENSION: ${hero.name} has evolved into ${ascendedHero.heroName}! "${ascendedHero.quote}" (+25 Stats, +55 Multiverse Influence, empowered ability).`, 'success');
  };

  // Resolve Crisis Event Choice
  const handleResolveCrisis = (actionKey: string) => {
    if (!activeCrisis) return;
    const option = activeCrisis.options.find(o => o.actionKey === actionKey);
    if (!option) return;

    // Deduct cost
    if (option.cost) {
      setResources(prev => ({
        ...prev,
        scrap: prev.scrap - (option.cost?.scrap || 0),
        power: Math.max(0, prev.power - (option.cost?.power || 0)),
        vibraniumCredits: prev.vibraniumCredits - (option.cost?.vibraniumCredits || 0),
      }));
    }

    const isSuccess = Math.random() <= option.successChance;

    if (isSuccess) {
      soundFx.playSuccess();
      addLog(`CRISIS RESOLVED: ${option.onSuccessReward}`, 'success');

      // Specific crisis rewards
      if (actionKey === 'mobius_appeal') {
        setResources(prev => ({
          ...prev,
          vibraniumCredits: prev.vibraniumCredits + 150,
          morale: Math.min(100, prev.morale + 30),
        }));
      } else if (actionKey === 'aiko_counter_audit') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          vibraniumCredits: prev.vibraniumCredits + 90,
          morale: Math.min(100, prev.morale + 15),
        }));
      } else if (actionKey === 'stark_hack_oxe') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 180),
        }));
      } else if (actionKey === 'cleary_containment') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 240),
          power: Math.min(prev.maxPower, prev.power + 60),
          defenseRating: prev.defenseRating + 10,
        }));
      } else if (actionKey === 'rocket_hotwire_core') {
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 300),
        }));
      } else if (actionKey === 'yelena_counter_ambush') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 220),
          vibraniumCredits: prev.vibraniumCredits + 80,
          morale: Math.min(100, prev.morale + 15),
        }));
      } else if (actionKey === 'bucky_command_breach') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 200),
          defenseRating: prev.defenseRating + 35,
        }));
      } else if (actionKey === 'usagent_shield_clearance') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 190),
          defenseRating: prev.defenseRating + 25,
        }));
      } else if (actionKey === 'spiderman_web_bridge') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 240),
          morale: Math.min(100, prev.morale + 25),
        }));
      } else if (actionKey === 'shangchi_earth_strike') {
        setResources(prev => ({
          ...prev,
          power: Math.min(prev.maxPower, prev.power + 220),
          scrap: Math.min(prev.maxScrap, prev.scrap + 180),
        }));
      } else if (actionKey === 'wonderman_ionic_lift') {
        setResources(prev => ({
          ...prev,
          scrap: Math.min(prev.maxScrap, prev.scrap + 150),
          morale: Math.min(100, prev.morale + 35),
        }));
      } else if (actionKey === 'daredevil_sonar_guide') {
        setResources(prev => ({
          ...prev,
          defenseRating: prev.defenseRating + 30,
          scrap: Math.min(prev.maxScrap, prev.scrap + 120),
        }));
      }
    } else {
      soundFx.playAlarm();
      addLog(`TACTICAL SETBACK: ${option.onFailureConsequence}`, 'danger');

      if (actionKey === 'stark_hack_oxe') {
        setResources(prev => ({ ...prev, power: Math.max(0, prev.power - 40) }));
      } else if (actionKey === 'strange_tva_bluff') {
        setResources(prev => ({ ...prev, scrap: Math.max(0, prev.scrap - 40) }));
      } else if (actionKey === 'concrete_encasement') {
        setResources(prev => ({ ...prev, morale: Math.max(5, prev.morale - 20) }));
      } else if (actionKey === 'yelena_counter_ambush') {
        setResources(prev => ({ ...prev, scrap: Math.max(0, prev.scrap - 20) }));
      } else if (actionKey === 'spiderman_web_bridge') {
        setResources(prev => ({ ...prev, scrap: Math.max(0, prev.scrap - 25) }));
      } else if (actionKey === 'emp_flare_flush') {
        setResources(prev => ({ ...prev, power: Math.max(0, prev.power - 60) }));
      }
    }

    setActiveCrisis(null);
  };

  // Reset Colony
  const handleResetColony = () => {
    if (window.confirm('Restart colony from Sol Cycle 1? All current progress will be reset.')) {
      const fresh = createInitialGrid();
      setTiles(fresh.tiles);
      setBuildings(fresh.buildings);
      setResources({
        power: 120,
        maxPower: 400,
        scrap: 220,
        maxScrap: 600,
        food: 100,
        maxFood: 350,
        oxygen: 92,
        vibraniumCredits: 45,
        population: 14,
        maxPopulation: 25,
        assignedWorkers: 7,
        morale: 85,
        defenseRating: 30,
        incursionThreat: 15,
        chronoCores: 2,
        multiverseInfluence: 100,
      });
      setHeroes(INITIAL_HEROES.map((h) => {
        if (h.id === 'iron_man') return { ...h, assignedBuildingId: 'b_arc_initial', status: 'assigned' };
        if (h.id === 'rocket') return { ...h, assignedBuildingId: 'b_scrap_initial', status: 'assigned' };
        if (h.id === 'hulk') return { ...h, assignedBuildingId: 'b_bio_initial', status: 'assigned' };
        return h;
      }));
      setTechTree(INITIAL_TECH_TREE);
      setExpeditions(INITIAL_EXPEDITIONS);
      setCycle(1);
      setActiveCrisis(null);
      addLog('Colony reset to Cycle 1. Standard emergency protocols active.', 'info');
      soundFx.playBuild();
    }
  };

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans sakaar-dust selection:bg-cyan-500 selection:text-slate-950">
      {/* Top HUD Bar */}
      <HeaderHud
        resources={resources}
        rates={rates}
        cycle={cycle}
        gameSpeed={gameSpeed}
        isMuted={isMuted}
        activeCrisis={activeCrisis !== null}
        onSetSpeed={setGameSpeed}
        onToggleMute={() => {
          const muted = soundFx.toggleMute();
          setIsMuted(muted);
        }}
        onOpenLog={() => setIsLogDrawerOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetColony={handleResetColony}
      />

      {/* Main Operations Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-1.5 overflow-x-auto sm:overflow-visible py-1">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
                activeTab === 'grid'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              SURFACE SECTORS
            </button>

            <button
              onClick={() => setActiveTab('expeditions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
                activeTab === 'expeditions'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              EXPEDITIONS
            </button>

            <button
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
                activeTab === 'tech'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              R&D LAB MATRIX
            </button>

            <button
              onClick={() => setActiveTab('trade')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
                activeTab === 'trade'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              RAVAGER DEPOT
            </button>

            <button
              id="multiverse-nexus-tab-btn"
              onClick={() => setActiveTab('multiverse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
                activeTab === 'multiverse'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-purple-300 animate-spin-slow" />
              MULTIVERSE NEXUS
            </button>

            <button
              id="doomsday-clock-tab-btn"
              onClick={() => setActiveTab('doomsday')}
              title={`Incursion Threat: ${incursionThreatConfig.level} (${Math.round(resources.incursionThreat)}%) • Stability: ${incursionThreatConfig.stability}`}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition relative ${
                activeTab === 'doomsday'
                  ? 'bg-gradient-to-r from-emerald-600 via-green-700 to-slate-900 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/50'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/20'
              }`}
            >
              <Skull className={`w-4 h-4 text-emerald-400 ${incursionThreatConfig.pulse ? 'animate-pulse' : ''}`} />
              <span>DOOMSDAY CLOCK</span>

              {/* Dynamic Incursion Threat Level Badge */}
              <span
                id="doomsday-threat-level-badge"
                className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-bold flex items-center gap-1 transition-colors ${incursionThreatConfig.badgeStyle} ${incursionThreatConfig.pulse ? 'animate-pulse' : ''}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${incursionThreatConfig.dotStyle}`} />
                <span>{incursionThreatConfig.level}</span>
                <span className="text-[9px] opacity-80 font-normal">({Math.round(resources.incursionThreat)}%)</span>
              </span>

              {/* Hover Tooltip: 30-Cycle Trend Chart using Recharts, Incursion Velocity & Reference Lines */}
              <div
                id="doomsday-threat-tooltip"
                role="tooltip"
                className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-84 sm:w-[350px] rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl shadow-black/90 backdrop-blur-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 text-left font-sans normal-case transform group-hover:translate-y-0 translate-y-1 overflow-visible"
              >
                {/* Subtle Animated 'Threat Pulse' Background Overlay */}
                <div
                  id="doomsday-threat-pulse-overlay"
                  className="threat-pulse-overlay absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0"
                  style={{
                    '--threat-pulse-speed': incursionThreatConfig.pulseDuration,
                    '--threat-pulse-min-op': incursionThreatConfig.minOpacity,
                    '--threat-pulse-max-op': incursionThreatConfig.maxOpacity,
                  } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {/* Dynamic Radial Gradient Threat Aurora */}
                  <div
                    className="absolute -inset-2 transition-all duration-700"
                    style={{
                      background: incursionThreatConfig.overlayGradient,
                    }}
                  />
                  {/* Subtle Inset Vignette Glow */}
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      boxShadow: `inset 0 0 26px 4px ${incursionThreatConfig.glowColor}`,
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <IncursionSparkline
                    history={incursionHistory}
                    currentThreat={resources.incursionThreat}
                    level={incursionThreatConfig.level}
                    stability={incursionThreatConfig.stability}
                    textColor={incursionThreatConfig.textColor}
                    strokeColor={incursionThreatConfig.strokeColor}
                    badgeStyle={incursionThreatConfig.badgeStyle}
                    dotStyle={incursionThreatConfig.dotStyle}
                    description={incursionThreatConfig.description}
                  />
                </div>

                {/* Tooltip Caret Pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-slate-950 border-r border-b border-slate-700/80 rotate-45 z-10" />
              </div>
            </button>

            <button
              id="battleworld-command-tab-btn"
              onClick={() => setActiveTab('battleworld')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition relative ${
                activeTab === 'battleworld'
                  ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 border border-purple-500/30'
              }`}
            >
              <Swords className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>BATTLEWORLD</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-400/40 text-[9px] font-mono text-purple-300 hidden sm:inline">
                WAR TABLE & RELICS
              </span>
            </button>
          </div>

          {/* Action Buttons: Live Intel & Hero Roster */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="open-mcu-photos-api-nav-btn"
              onClick={() => handleOpenPhotosApi()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold font-mono-tech text-xs sm:text-sm shadow-md shadow-cyan-950/30 transition"
              title="Query Marvel Cinematic Universe Character Photos & Profile Picture REST API"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">MCU PHOTOS API</span>
              <span className="sm:hidden">PHOTOS API</span>
            </button>

            <button
              id="open-mcu-intel-nav-btn"
              onClick={() => {
                setMcuIntelQuery('Spider-Man Brand New Day');
                setIsMCUIntelModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold font-mono-tech text-xs sm:text-sm shadow-md shadow-amber-500/20 transition"
              title="Query Live MCU Movie Intel with Google Search grounding"
            >
              <Globe className="w-4 h-4 animate-pulse" />
              <span>LIVE MOVIE INTEL</span>
            </button>

            <button
              id="open-hero-roster-nav-btn"
              onClick={() => setIsHeroDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono-tech text-xs sm:text-sm shadow-md shadow-purple-500/20 transition"
            >
              <Users className="w-4 h-4" />
              <span>CANON ROSTER ({heroes.filter(h => h.assignedBuildingId !== null).length}/{heroes.length})</span>
            </button>

            {/* MCU Theatrical & Tickets Hub (Right next to Canon Roster as drawn by user) */}
            <button
              id="open-tickets-nav-btn"
              onClick={() => {
                soundFx.buttonClick();
                setIsTicketsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black font-mono-tech text-xs sm:text-sm shadow-lg shadow-amber-500/25 border border-amber-300/60 transition group cursor-pointer"
              title="Open Marvel Studios Theatrical Tickets, Showtimes & Cinematic Passes"
            >
              <Ticket className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>TICKETS</span>
              {userBookings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-950 text-amber-300 border border-slate-900">
                  {userBookings.length}
                </span>
              )}
            </button>

            {/* Gemini AI Colony Guide Chatbot Button */}
            <button
              id="open-gemini-chatbot-nav-btn"
              onClick={() => {
                soundFx.buttonClick();
                setIsChatbotOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold font-mono-tech text-xs sm:text-sm shadow-lg shadow-cyan-500/25 border border-cyan-400/50 transition group cursor-pointer"
              title="Chat with your Gemini AI Colony Guide (F.R.I.D.A.Y., Miss Minutes, H.E.R.B.I.E., Grandmaster)"
            >
              <Bot className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform animate-pulse" />
              <span>AI GUIDE CHAT</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950/60 border border-cyan-300/40 text-[9px] font-mono text-cyan-200 hidden md:inline">
                GEMINI
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic View Display */}
        {activeTab === 'grid' && (
          <ColonyGrid
            tiles={tiles}
            buildings={buildings}
            heroes={heroes}
            onSelectTile={(tile) => {
              soundFx.playClick();
              setSelectedTileForBuild(tile);
            }}
            onSelectBuilding={(b) => {
              soundFx.playClick();
              setSelectedBuildingId(b.id);
            }}
          />
        )}

        {activeTab === 'expeditions' && (
          <ExpeditionsView
            expeditions={expeditions}
            heroes={heroes}
            currentTime={currentTime}
            onLaunchExpedition={handleLaunchExpedition}
            onClaimExpedition={handleClaimExpedition}
          />
        )}

        {activeTab === 'tech' && (
          <TechLabView
            techTree={techTree}
            resources={resources}
            onResearchTech={handleResearchTech}
          />
        )}

        {activeTab === 'trade' && (
          <TradeDepotView
            resources={resources}
            onExecuteTrade={handleExecuteTrade}
          />
        )}

        {activeTab === 'multiverse' && (
          <MultiverseNexusView
            resources={resources}
            timelines={timelines}
            directives={directives}
            incursionRifts={incursionRifts}
            heroes={heroes}
            currentTime={currentTime}
            onStabilizeTimeline={handleStabilizeTimeline}
            onSiphonTimeline={handleSiphonTimeline}
            onEnactDirective={handleEnactDirective}
            onStabilizeRift={handleStabilizeRift}
            onUpgradeHero={handleUpgradeHero}
            onOpenMCUIntel={(query) => {
              setMcuIntelQuery(query);
              setIsMCUIntelModalOpen(true);
            }}
          />
        )}

        {activeTab === 'doomsday' && (
          <DoomsdayClockDashboard
            resources={resources}
            setResources={setResources}
            heroes={heroes}
            timelines={timelines}
            addLog={addLog}
            gameSpeed={gameSpeed}
          />
        )}

        {activeTab === 'battleworld' && (
          <BattleworldCommandView
            resources={resources}
            setResources={setResources}
            heroes={heroes}
            buildings={buildings}
            setBuildings={setBuildings}
            addLog={addLog}
            gameSpeed={gameSpeed}
          />
        )}
      </main>

      {/* Hero Management Drawer */}
      <HeroDrawer
        isOpen={isHeroDrawerOpen}
        onClose={() => setIsHeroDrawerOpen(false)}
        heroes={heroes}
        buildings={buildings}
        resources={resources}
        onTriggerAbility={handleTriggerAbility}
        onUnassignHero={handleUnassignHero}
        onAssignHero={handleAssignHero}
        onUpgradeHero={handleUpgradeHero}
        currentTime={currentTime}
        onOpenMCUIntel={(query) => {
          setMcuIntelQuery(query);
          setIsMCUIntelModalOpen(true);
        }}
        onOpenPhotosApi={handleOpenPhotosApi}
      />

      {/* MCU Character Photos & Profile Picture REST API HUD */}
      <MCUPhotosApiModal
        isOpen={isMCUPhotosApiOpen}
        onClose={() => setIsMCUPhotosApiOpen(false)}
        initialHeroId={photosApiHeroId}
        heroes={heroes}
        onOpenMCUIntel={(query) => {
          setMcuIntelQuery(query);
          setIsMCUIntelModalOpen(true);
        }}
      />

      {/* Live MCU Movie Search Grounding Intel Modal */}
      <MCUIntelModal
        isOpen={isMCUIntelModalOpen}
        onClose={() => setIsMCUIntelModalOpen(false)}
        initialQuery={mcuIntelQuery}
      />

      {/* Marvel Studios Theatrical Tickets & Cinema Pass Hub Modal */}
      <MCUTicketsPortalModal
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        onOpenMCUIntel={(query) => {
          setMcuIntelQuery(query);
          setIsMCUIntelModalOpen(true);
        }}
        userBookings={userBookings}
        onSaveBooking={handleSaveBooking}
        onDeleteBooking={handleDeleteBooking}
      />

      {/* Building Construction Palette Modal */}
      <BuildingPaletteModal
        isOpen={selectedTileForBuild !== null}
        selectedTile={selectedTileForBuild}
        resources={resources}
        researchedTechIds={researchedTechIds}
        onClose={() => setSelectedTileForBuild(null)}
        onConstruct={handleConstructBuilding}
      />

      {/* Building Details & Upgrade Modal */}
      <BuildingDetailsModal
        isOpen={selectedBuilding !== null}
        building={selectedBuilding}
        resources={resources}
        heroes={heroes}
        researchedTechIds={researchedTechIds}
        onClose={() => setSelectedBuildingId(null)}
        onUpgrade={handleUpgradeBuilding}
        onRepair={handleRepairBuilding}
        onAssignHero={handleAssignHero}
        onChangeWorkers={handleChangeWorkers}
        onDemolish={handleDemolishBuilding}
      />

      {/* Crisis Event Modal */}
      <CrisisModal
        crisis={activeCrisis}
        heroes={heroes}
        resources={resources}
        onResolveOption={handleResolveCrisis}
      />

      {/* Colony Log Drawer */}
      <ColonyLogDrawer
        isOpen={isLogDrawerOpen}
        onClose={() => setIsLogDrawerOpen(false)}
        logs={logs}
      />

      {/* Survival Operations Guide */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* H.E.R.B.I.E. & Miss Minutes Autonomous AI Colony Co-Pilot */}
      <AutonomousCoPilotWidget
        resources={resources}
        setResources={setResources}
        buildings={buildings}
        setBuildings={setBuildings}
        addLog={addLog}
        gameSpeed={gameSpeed}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Multi-Turn Gemini AI Colony Guide Chatbot */}
      <GeminiColonyGuideChatbot
        resources={resources}
        buildings={buildings}
        heroes={heroes}
        activeCrisisName={activeCrisis?.title || null}
        doomsdaySeconds={180}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpen={() => setIsChatbotOpen(true)}
      />
    </div>
  );
}
