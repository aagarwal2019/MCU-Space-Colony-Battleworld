import { Router, Request, Response } from 'express';

export const marketRouter = Router();

interface CommodityRate {
  id: string;
  name: string;
  unit: string;
  buyPriceCredits: number;
  sellPriceCredits: number;
  priceTrend: 'SURGING' | 'FALLING' | 'STABLE';
  trendPercentage: number;
  inventoryAvailable: number;
}

interface ContrabandItem {
  id: string;
  name: string;
  tier: 'RAVAGER_COMMON' | 'BLACK_MARKET_RARE' | 'EXOTIC_MULTIVERSAL';
  costCredits: number;
  stock: number;
  effectDescription: string;
  flavorText: string;
}

let marketRates: CommodityRate[] = [
  {
    id: 'scrap',
    name: 'Wasteland Starship Scrap',
    unit: '100 Tons',
    buyPriceCredits: 35,
    sellPriceCredits: 22,
    priceTrend: 'SURGING',
    trendPercentage: +14.2,
    inventoryAvailable: 5000,
  },
  {
    id: 'food',
    name: 'Hydro-Ration Hydroponics',
    unit: '50 Units',
    buyPriceCredits: 28,
    sellPriceCredits: 15,
    priceTrend: 'STABLE',
    trendPercentage: +1.5,
    inventoryAvailable: 2400,
  },
  {
    id: 'arc_power',
    name: 'Stark Arc Battery Cells',
    unit: '50 MW-h',
    buyPriceCredits: 45,
    sellPriceCredits: 30,
    priceTrend: 'FALLING',
    trendPercentage: -8.0,
    inventoryAvailable: 1200,
  },
  {
    id: 'chrono_core',
    name: 'TVA Chronometric Core',
    unit: '1 Core',
    buyPriceCredits: 160,
    sellPriceCredits: 110,
    priceTrend: 'SURGING',
    trendPercentage: +22.5,
    inventoryAvailable: 15,
  },
  {
    id: 'multiverse_influence',
    name: 'Cosmic Diplomatic Comm-Signal',
    unit: '25 Influence',
    buyPriceCredits: 60,
    sellPriceCredits: 35,
    priceTrend: 'STABLE',
    trendPercentage: +0.2,
    inventoryAvailable: 350,
  }
];

let contrabandRotation: ContrabandItem[] = [
  {
    id: 'contra_nanite_solder',
    name: 'Stark Industries Nanite Solder Kit',
    tier: 'BLACK_MARKET_RARE',
    costCredits: 85,
    stock: 4,
    effectDescription: 'Instantly restores all colony structures to 100% health.',
    flavorText: 'Liberated from a crashed Iron Man armor crate in the Sakaar junk sea.',
  },
  {
    id: 'contra_quantum_fuel',
    name: 'Pym Particle Micro-Fuel Cylinder',
    tier: 'BLACK_MARKET_RARE',
    costCredits: 120,
    stock: 2,
    effectDescription: 'Permanently increases maximum Arc Power storage by +60 MW.',
    flavorText: 'Handle with extreme caution—do not expose to subatomic radiation.',
  },
  {
    id: 'contra_vibranium_weave',
    name: 'Wakandan Vibranium Weave Mesh',
    tier: 'EXOTIC_MULTIVERSAL',
    costCredits: 190,
    stock: 1,
    effectDescription: 'Permanently grants +40 Colony Defense Rating.',
    flavorText: 'Absorbs kinetic concussive impacts with zero heat release.',
  },
  {
    id: 'contra_tva_reset_charge',
    name: 'TVA Pruning Reset Charge',
    tier: 'EXOTIC_MULTIVERSAL',
    costCredits: 250,
    stock: 1,
    effectDescription: 'Resets Doomsday Clock by +60 seconds and wipes active raiders.',
    flavorText: 'Confiscated directly from a rogue Minuteman squad.',
  }
];

// 1. GET /api/market/rates - Dynamic commodity rates & trends
marketRouter.get('/rates', (_req: Request, res: Response) => {
  // Slight market noise to simulate live exchange fluctuation
  const fluctuating = marketRates.map((r) => {
    const delta = (Math.random() - 0.5) * 2;
    return {
      ...r,
      buyPriceCredits: Math.max(5, Math.round(r.buyPriceCredits + delta)),
      sellPriceCredits: Math.max(3, Math.round(r.sellPriceCredits + delta * 0.8)),
    };
  });

  res.json({
    success: true,
    marketStatus: 'OPEN',
    brokerFeePercentage: 5,
    commodities: fluctuating,
    marketSentiment: 'High Demand: Incursion threats are driving up Chrono-Core and Scrap valuations.',
    timestamp: Date.now(),
  });
});

// 2. GET /api/market/contraband-rotations - Black market contraband store
marketRouter.get('/contraband-rotations', (_req: Request, res: Response) => {
  res.json({
    success: true,
    broker: 'The Grandmaster VIP Vault & Ravager Smugglers',
    rotations: contrabandRotation,
    nextRotationInSeconds: 1800,
    timestamp: Date.now(),
  });
});

// 3. POST /api/market/transact - Execute buy/sell orders
marketRouter.post('/transact', (req: Request, res: Response) => {
  try {
    const { commodityId, action, quantity = 1, playerCredits = 0 } = req.body;

    if (!commodityId || !action || quantity <= 0) {
      return res.status(400).json({ error: 'commodityId, valid action (BUY|SELL), and quantity are required.' });
    }

    const commodity = marketRates.find((c) => c.id === commodityId);
    if (!commodity) {
      return res.status(404).json({ error: `Commodity '${commodityId}' not found in exchange ledger.` });
    }

    const unitPrice = action === 'BUY' ? commodity.buyPriceCredits : commodity.sellPriceCredits;
    const grossTotal = unitPrice * quantity;
    const brokerTax = Math.round(grossTotal * 0.05);
    const netTotal = action === 'BUY' ? grossTotal + brokerTax : grossTotal - brokerTax;

    if (action === 'BUY' && playerCredits < netTotal) {
      return res.status(400).json({
        error: `Insufficient Vibranium Credits! Required: ${netTotal} (includes 5% broker fee), Available: ${playerCredits}`,
      });
    }

    return res.json({
      success: true,
      action,
      commodityId,
      commodityName: commodity.name,
      quantity,
      unitPrice,
      grossTotal,
      brokerTax,
      netCreditsExchanged: netTotal,
      receiptId: `TX_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/market/transact:', error);
    return res.status(500).json({ error: 'Failed to process market transaction', details: error?.message });
  }
});
