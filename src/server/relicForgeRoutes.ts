import { Router, Request, Response } from 'express';

export const relicForgeRouter = Router();

interface RelicRecipe {
  id: string;
  name: string;
  originRealm: string;
  cost: {
    chronoCores: number;
    vibraniumCredits: number;
    scrap: number;
  };
  socketType: 'ALPHA_CORE' | 'BETA_SHIELD' | 'GAMMA_WEAPON' | 'DELTA_CHRONAL';
  buffDescription: string;
  lore: string;
}

const relicCatalog: RelicRecipe[] = [
  {
    id: 'relic_baxter_singularity',
    name: 'Baxter Antimatter Singularity Core',
    originRealm: 'Earth-828 (Fantastic 4)',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 150,
      scrap: 400,
    },
    socketType: 'ALPHA_CORE',
    buffDescription: '+45 Max Arc Power and +20% building construction speed.',
    lore: 'Designed by Mister Fantastic in 1961 to harness clean cosmic radiation.',
  },
  {
    id: 'relic_tva_reset_matrix',
    name: 'TVA Chronometric Matrix Anchor',
    originRealm: 'Null-Time Zone (TVA)',
    cost: {
      chronoCores: 3,
      vibraniumCredits: 220,
      scrap: 300,
    },
    socketType: 'DELTA_CHRONAL',
    buffDescription: 'Slows the Avengers: Doomsday Clock collapse rate by 25%.',
    lore: 'A calibrated temporal loom dampener crafted by He Who Remains.',
  },
  {
    id: 'relic_eye_agamotto',
    name: 'Eye of Agamotto Reality Lens',
    originRealm: 'Kamar-Taj Mystic Archives',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 180,
      scrap: 350,
    },
    socketType: 'BETA_SHIELD',
    buffDescription: '+50 Colony Defense Rating and nullifies first incursion breach per cycle.',
    lore: 'Mystic brass relic containing traces of the Time Stone’s cosmic aura.',
  },
  {
    id: 'relic_darkhold_parchment',
    name: 'Darkhold Chaos Parchment Fragment',
    originRealm: 'Mount Wundagore Nexus',
    cost: {
      chronoCores: 1,
      vibraniumCredits: 120,
      scrap: 500,
    },
    socketType: 'GAMMA_WEAPON',
    buffDescription: '+40% damage in Vanguard Incursion Strikes and Arena Duels.',
    lore: 'Chthonic black-magic scripture that bends physical reality to the wielder’s will.',
  },
  {
    id: 'relic_cerebro_relay',
    name: 'Cerebro Psionic Resonator Unit',
    originRealm: 'Earth-10005 (X-Men)',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 140,
      scrap: 380,
    },
    socketType: 'ALPHA_CORE',
    buffDescription: 'Boosts Hero Affinity synergy bonuses by +50%.',
    lore: 'Amplifies telepathic link frequencies across multiversal timelines.',
  }
];

// Crafted relics stored in-memory
let craftedRelics: string[] = ['relic_baxter_singularity'];

// 1. GET /api/relics/catalog - Full blueprint catalog
relicForgeRouter.get('/catalog', (_req: Request, res: Response) => {
  res.json({
    success: true,
    catalog: relicCatalog,
    craftedRelicIds: craftedRelics,
    timestamp: Date.now(),
  });
});

// 2. GET /api/relics/synergies - Calculate active socket synergies
relicForgeRouter.get('/synergies', (req: Request, res: Response) => {
  const activeIds = (req.query.active as string)?.split(',') || craftedRelics;

  const activeRelicObjects = relicCatalog.filter((r) => activeIds.includes(r.id));
  
  // Calculate aggregate bonuses
  let totalDefenseBonus = 0;
  let totalPowerBonus = 0;
  let doomsdaySlowPercentage = 0;
  let attackMultiplier = 1.0;

  for (const r of activeRelicObjects) {
    if (r.socketType === 'BETA_SHIELD') totalDefenseBonus += 50;
    if (r.socketType === 'ALPHA_CORE') totalPowerBonus += 45;
    if (r.socketType === 'DELTA_CHRONAL') doomsdaySlowPercentage += 25;
    if (r.socketType === 'GAMMA_WEAPON') attackMultiplier += 0.4;
  }

  // Check special set bonus: If player has both Baxter + TVA
  const hasMultiverseDual = activeIds.includes('relic_baxter_singularity') && activeIds.includes('relic_tva_reset_matrix');

  res.json({
    success: true,
    activeCount: activeRelicObjects.length,
    activeRelics: activeRelicObjects.map((r) => ({ id: r.id, name: r.name, socket: r.socketType })),
    bonuses: {
      defenseRatingBonus: totalDefenseBonus,
      maxPowerBonus: totalPowerBonus,
      doomsdayClockSlowPct: doomsdaySlowPercentage,
      combatStrikeMultiplier: attackMultiplier,
      synergyTitle: hasMultiverseDual ? 'Space-Time Continuum Singularity (Dual Set Bonus Active)' : 'Standard Matrix Tuning',
    },
    timestamp: Date.now(),
  });
});

// 3. POST /api/relics/forge - Synthesize a new relic
relicForgeRouter.post('/forge', (req: Request, res: Response) => {
  try {
    const { relicId, playerResources } = req.body;

    const relic = relicCatalog.find((r) => r.id === relicId);
    if (!relic) {
      return res.status(404).json({ error: `Relic blueprint '${relicId}' does not exist.` });
    }

    if (playerResources) {
      if (playerResources.chronoCores < relic.cost.chronoCores) {
        return res.status(400).json({ error: `Insufficient Chrono-Cores! Required: ${relic.cost.chronoCores}` });
      }
      if (playerResources.vibraniumCredits < relic.cost.vibraniumCredits) {
        return res.status(400).json({ error: `Insufficient Vibranium Credits! Required: ${relic.cost.vibraniumCredits}` });
      }
      if (playerResources.scrap < relic.cost.scrap) {
        return res.status(400).json({ error: `Insufficient Scrap! Required: ${relic.cost.scrap}` });
      }
    }

    if (!craftedRelics.includes(relicId)) {
      craftedRelics.push(relicId);
    }

    return res.json({
      success: true,
      message: `Successfully forged ${relic.name} in Doctor Doom's Cosmic Relic Forge!`,
      relic,
      totalCraftedCount: craftedRelics.length,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/relics/forge:', error);
    return res.status(500).json({ error: 'Failed to forge relic', details: error?.message });
  }
});
