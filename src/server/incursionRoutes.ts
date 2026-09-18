import { Router, Request, Response } from 'express';

export const incursionRouter = Router();

// In-memory state for multiversal raids & continuum telemetry
interface IncursionRaid {
  id: string;
  title: string;
  targetContinuum: string;
  originDimension: string;
  bossName: string;
  threatLevel: 'CLASS_ALPHA' | 'CLASS_OMEGA' | 'MULTIVERSAL_EXTINCTION';
  hp: number;
  maxHp: number;
  shieldPercentage: number;
  weakness: string;
  specialModifier: string;
  rewards: {
    chronoCores: number;
    vibraniumCredits: number;
    scrap: number;
    threatReduction: number;
  };
  status: 'ACTIVE' | 'VULNERABLE' | 'DEFEATED';
  expiresInSeconds: number;
}

interface ContinuumNodeTelemetry {
  id: string;
  name: string;
  universeCode: string;
  stabilityPercentage: number;
  barrierIntegrity: number;
  driftVelocity: string;
  status: 'OPTIMAL' | 'DESTABILIZING' | 'CRITICAL_BREACH';
  defendersAssigned: number;
  tacticalPerk: string;
}

let activeRaids: IncursionRaid[] = [
  {
    id: 'raid_doom_fleet_01',
    title: "Doctor Doom's Latverian Sentinel Armada",
    targetContinuum: 'Latverian Citadel & Bordering Rifts',
    originDimension: 'Earth-199999 / Earth-616 Incursion Intersection',
    bossName: 'God-Emperor Doom Prime Automaton',
    threatLevel: 'MULTIVERSAL_EXTINCTION',
    hp: 4200,
    maxHp: 6000,
    shieldPercentage: 35,
    weakness: 'Vibranium-Piercing Energy & Mystic Reality Anchors',
    specialModifier: 'Entropy Overdrive: Incursion risk ticks 1.5x faster while this armada remains in orbit.',
    rewards: {
      chronoCores: 3,
      vibraniumCredits: 280,
      scrap: 450,
      threatReduction: 25,
    },
    status: 'ACTIVE',
    expiresInSeconds: 3600,
  },
  {
    id: 'raid_alioth_void_02',
    title: 'Alioth Temporal Void Cloud Surge',
    targetContinuum: 'The Void at the End of Time',
    originDimension: 'Pruned Timeline Abyss',
    bossName: 'Alioth the Temporal Devourer',
    threatLevel: 'CLASS_OMEGA',
    hp: 2800,
    maxHp: 4500,
    shieldPercentage: 15,
    weakness: 'Chrono-Core Energy & Enchantment Resonance',
    specialModifier: 'Chrono-Erosion: Accelerates Doomsday Clock timeline collapse.',
    rewards: {
      chronoCores: 2,
      vibraniumCredits: 190,
      scrap: 350,
      threatReduction: 18,
    },
    status: 'ACTIVE',
    expiresInSeconds: 2400,
  },
  {
    id: 'raid_galactus_herald_03',
    title: 'Galactus Cosmic Herald Swarm',
    targetContinuum: 'Earth-828 Baxter Sector (1960s Retro-Future)',
    originDimension: 'Earth-828 Cosmic Void',
    bossName: 'Cosmic Silver Sentinel Harbinger',
    threatLevel: 'CLASS_ALPHA',
    hp: 1950,
    maxHp: 3200,
    shieldPercentage: 10,
    weakness: 'Fantastic 4 Antimatter Singularity & Arc Power Disruptors',
    specialModifier: 'Planetary Siphon: Drains 10 Arc Power per cycle from Sakaar Outpost.',
    rewards: {
      chronoCores: 2,
      vibraniumCredits: 220,
      scrap: 500,
      threatReduction: 20,
    },
    status: 'ACTIVE',
    expiresInSeconds: 4800,
  }
];

let continuumTelemetry: ContinuumNodeTelemetry[] = [
  {
    id: 'node_earth_828',
    name: 'Baxter Station Continuum',
    universeCode: 'Earth-828',
    stabilityPercentage: 78,
    barrierIntegrity: 85,
    driftVelocity: '+1.2 m/s²',
    status: 'OPTIMAL',
    defendersAssigned: 2,
    tacticalPerk: 'Fantastic Tech: +25% Antimatter research output',
  },
  {
    id: 'node_earth_616',
    name: 'Avengers Compound Perimeter',
    universeCode: 'Earth-616',
    stabilityPercentage: 82,
    barrierIntegrity: 90,
    driftVelocity: '+0.4 m/s²',
    status: 'OPTIMAL',
    defendersAssigned: 3,
    tacticalPerk: 'Earth’s Mightiest: +30 Defense rating to all perimeter outposts',
  },
  {
    id: 'node_earth_10005',
    name: 'Xavier Institute Temporal Echo',
    universeCode: 'Earth-10005',
    stabilityPercentage: 64,
    barrierIntegrity: 70,
    driftVelocity: '+3.8 m/s²',
    status: 'DESTABILIZING',
    defendersAssigned: 1,
    tacticalPerk: 'Cerebro Psionic Web: Detects hidden incursion rifts 60s ahead',
  },
  {
    id: 'node_earth_96283',
    name: 'Daily Bugle Plaza (Raimi-Verse)',
    universeCode: 'Earth-96283',
    stabilityPercentage: 58,
    barrierIntegrity: 62,
    driftVelocity: '+4.5 m/s²',
    status: 'DESTABILIZING',
    defendersAssigned: 1,
    tacticalPerk: 'Organic Webbing Grid: Reduces scrap raider ambush rates by 40%',
  },
  {
    id: 'node_latveria',
    name: 'Latverian Citadel Core',
    universeCode: 'Battleworld Nexus',
    stabilityPercentage: 42,
    barrierIntegrity: 45,
    driftVelocity: '+7.2 m/s²',
    status: 'CRITICAL_BREACH',
    defendersAssigned: 0,
    tacticalPerk: 'Sovereign Will: Unlocks Doom Cosmic Relic recipes when contained',
  },
  {
    id: 'node_the_void',
    name: 'The Void at the End of Time',
    universeCode: 'Null Space',
    stabilityPercentage: 50,
    barrierIntegrity: 55,
    driftVelocity: '+5.0 m/s²',
    status: 'DESTABILIZING',
    defendersAssigned: 1,
    tacticalPerk: 'TVA Chronal Cache: Passive +1 Chrono-Core generation every 300s',
  },
  {
    id: 'node_quantum_realm',
    name: 'Quantum Sub-Atomic Microverse',
    universeCode: 'Micro-Dimension',
    stabilityPercentage: 91,
    barrierIntegrity: 95,
    driftVelocity: '-0.2 m/s²',
    status: 'OPTIMAL',
    defendersAssigned: 1,
    tacticalPerk: 'Sub-Atomic Compaction: Increases Max Scrap capacity by +250',
  }
];

// Strike Combat Log History
interface StrikeLogEntry {
  id: string;
  raidId: string;
  strikeTeam: string[];
  damageDealt: number;
  criticalHit: boolean;
  bossHpRemaining: number;
  rewardsAwarded?: IncursionRaid['rewards'];
  timestamp: number;
}

const strikeLogs: StrikeLogEntry[] = [];

// 1. GET /api/incursions/active - List all currently active incursion raids
incursionRouter.get('/active', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: activeRaids.length,
    raids: activeRaids,
    timestamp: Date.now(),
  });
});

// 2. GET /api/incursions/telemetry - Telemetry data for all 8 reality continuum nodes
incursionRouter.get('/telemetry', (_req: Request, res: Response) => {
  res.json({
    success: true,
    nodes: continuumTelemetry,
    timestamp: Date.now(),
  });
});

// 3. POST /api/incursions/strike - Launch an interception assault against an active raid
incursionRouter.post('/strike', (req: Request, res: Response) => {
  try {
    const { raidId, strikeHeroes = [], weaponPayload = 'STANDARD_PHOTON_BURST' } = req.body;

    const raid = activeRaids.find((r) => r.id === raidId);
    if (!raid) {
      return res.status(404).json({ error: `Incursion raid '${raidId}' not found.` });
    }

    if (raid.status === 'DEFEATED' || raid.hp <= 0) {
      return res.status(400).json({ error: 'This incursion raid has already been neutralized!' });
    }

    // Base damage calculation influenced by hero squad size and payload
    const baseHeroPower = Math.max(strikeHeroes.length * 160, 220);
    const weaponMultiplier = weaponPayload === 'ANTIMATTER_SINGULARITY' ? 2.5 : weaponPayload === 'QUANTUM_OVERCHARGE' ? 1.8 : 1.0;
    const isCritical = Math.random() < 0.35;
    const critMultiplier = isCritical ? 1.65 : 1.0;

    const calculatedDamage = Math.round((baseHeroPower * weaponMultiplier * critMultiplier) + (Math.random() * 80));
    
    // Apply damage
    raid.hp = Math.max(0, raid.hp - calculatedDamage);
    const wasDefeated = raid.hp === 0;

    let grantedRewards: IncursionRaid['rewards'] | undefined = undefined;
    if (wasDefeated) {
      raid.status = 'DEFEATED';
      grantedRewards = raid.rewards;
    }

    const logEntry: StrikeLogEntry = {
      id: `strike_${Date.now()}`,
      raidId,
      strikeTeam: strikeHeroes.length > 0 ? strikeHeroes : ['Sakaar Defense Garrison'],
      damageDealt: calculatedDamage,
      criticalHit: isCritical,
      bossHpRemaining: raid.hp,
      rewardsAwarded: grantedRewards,
      timestamp: Date.now(),
    };
    strikeLogs.unshift(logEntry);
    if (strikeLogs.length > 30) strikeLogs.pop();

    return res.json({
      success: true,
      damageDealt: calculatedDamage,
      criticalHit: isCritical,
      bossHpRemaining: raid.hp,
      bossMaxHp: raid.maxHp,
      wasDefeated,
      rewards: grantedRewards,
      log: logEntry,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/incursions/strike:', error);
    return res.status(500).json({ error: 'Failed to process incursion strike', details: error?.message });
  }
});

// 4. GET /api/incursions/logs - Recent strike combat telemetry
incursionRouter.get('/logs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    logs: strikeLogs,
  });
});
