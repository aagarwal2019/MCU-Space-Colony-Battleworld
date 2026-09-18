import { Router, Request, Response } from 'express';

export const colonyPersistenceRouter = Router();

interface CloudSaveSlot {
  slotId: string;
  name: string;
  updatedAt: number;
  colonyName: string;
  cycle: number;
  population: number;
  incursionThreat: number;
  defenseRating: number;
  data: any;
}

// In-memory cloud persistence store
const cloudSlots: Record<string, CloudSaveSlot> = {
  auto_cloud: {
    slotId: 'auto_cloud',
    name: 'Omniversal Auto-Cloud Sync',
    updatedAt: Date.now() - 360000,
    colonyName: 'Sakaar Outpost Alpha',
    cycle: 14,
    population: 18,
    incursionThreat: 22,
    defenseRating: 140,
    data: null,
  }
};

// 1. GET /api/colony/slots - List all cloud save slots
colonyPersistenceRouter.get('/slots', (_req: Request, res: Response) => {
  const summaries = Object.values(cloudSlots).map((slot) => ({
    slotId: slot.slotId,
    name: slot.name,
    updatedAt: slot.updatedAt,
    colonyName: slot.colonyName,
    cycle: slot.cycle,
    population: slot.population,
    incursionThreat: slot.incursionThreat,
    defenseRating: slot.defenseRating,
    hasPayload: Boolean(slot.data),
  }));

  res.json({
    success: true,
    slots: summaries,
    timestamp: Date.now(),
  });
});

// 2. POST /api/colony/save - Save snapshot to cloud slot
colonyPersistenceRouter.post('/save', (req: Request, res: Response) => {
  try {
    const { slotId = 'auto_cloud', slotName, colonyData } = req.body;

    if (!colonyData) {
      return res.status(400).json({ error: 'colonyData payload is required for cloud save.' });
    }

    const updatedSlot: CloudSaveSlot = {
      slotId,
      name: slotName || (slotId === 'auto_cloud' ? 'Omniversal Auto-Cloud' : `Cloud Slot ${slotId}`),
      updatedAt: Date.now(),
      colonyName: colonyData.colonyName || 'Sakaar Outpost',
      cycle: colonyData.cycle || 1,
      population: colonyData.resources?.population || 10,
      incursionThreat: Math.round(colonyData.resources?.incursionThreat || 15),
      defenseRating: colonyData.resources?.defenseRating || 30,
      data: colonyData,
    };

    cloudSlots[slotId] = updatedSlot;

    return res.json({
      success: true,
      message: `Colony successfully archived to Cloud Slot '${slotId}'.`,
      slot: {
        slotId: updatedSlot.slotId,
        name: updatedSlot.name,
        updatedAt: updatedSlot.updatedAt,
        cycle: updatedSlot.cycle,
      },
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/colony/save:', error);
    return res.status(500).json({ error: 'Failed to archive colony state to cloud', details: error?.message });
  }
});

// 3. GET /api/colony/load/:slotId - Retrieve snapshot from slot
colonyPersistenceRouter.get('/load/:slotId', (req: Request, res: Response) => {
  const { slotId } = req.params;
  const slot = cloudSlots[slotId];

  if (!slot || !slot.data) {
    return res.status(404).json({ error: `Cloud save slot '${slotId}' is empty or does not exist.` });
  }

  return res.json({
    success: true,
    slotId: slot.slotId,
    name: slot.name,
    updatedAt: slot.updatedAt,
    colonyData: slot.data,
    timestamp: Date.now(),
  });
});

// 4. POST /api/colony/simulate-offline - Simulate offline progression
colonyPersistenceRouter.post('/simulate-offline', (req: Request, res: Response) => {
  try {
    const { lastActiveTimestamp, activeScrappers = 2, activeReactors = 1, currentResources } = req.body;

    const now = Date.now();
    const lastActive = lastActiveTimestamp ? Number(lastActiveTimestamp) : now - 1800000; // default 30 mins
    const elapsedSeconds = Math.max(0, Math.min(86400, Math.round((now - lastActive) / 1000))); // cap at 24 hrs

    // Calculation formulas
    const scrapEarned = Math.round(elapsedSeconds * 0.35 * Math.max(1, activeScrappers));
    const powerConsumed = Math.round(elapsedSeconds * 0.15);
    const powerProduced = Math.round(elapsedSeconds * 0.25 * Math.max(1, activeReactors));
    const foodConsumed = Math.round(elapsedSeconds * 0.08 * (currentResources?.population || 10));

    // Random salvage drop if offline for > 15 minutes
    const foundRareRelic = elapsedSeconds > 900 && Math.random() < 0.6;
    const rareSalvage = foundRareRelic ? 'TVA Chrono-Core Fragment' : null;

    return res.json({
      success: true,
      elapsedSeconds,
      elapsedFormatted: `${Math.floor(elapsedSeconds / 60)} minutes, ${elapsedSeconds % 60} seconds`,
      offlineGains: {
        scrap: scrapEarned,
        netPower: powerProduced - powerConsumed,
        foodConsumed,
        rareSalvage,
      },
      summaryText: `While you were away across the multiverse, your scrapper droids collected +${scrapEarned} Scrap and generated +${powerProduced} MW of Arc Power!`,
      timestamp: now,
    });
  } catch (error: any) {
    console.error('Error in /api/colony/simulate-offline:', error);
    return res.status(500).json({ error: 'Failed to simulate offline progression', details: error?.message });
  }
});
