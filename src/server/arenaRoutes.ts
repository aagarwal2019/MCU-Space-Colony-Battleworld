import { Router, Request, Response } from 'express';

export const arenaRouter = Router();

interface ArenaOpponent {
  id: string;
  commanderName: string;
  faction: string;
  lineup: string[];
  combatRating: number;
  difficultyTier: 'CHALLENGER' | 'CHAMPION' | 'GRANDMASTER_ELITE';
  trophyReward: number;
  vibraniumReward: number;
  scrapReward: number;
  specialTactics: string;
}

interface LeaderboardEntry {
  rank: number;
  commanderName: string;
  faction: string;
  avatarIcon: string;
  trophies: number;
  survivalCycles: number;
  defenseRating: number;
  mvpHero: string;
}

const arenaOpponents: ArenaOpponent[] = [
  {
    id: 'opp_ravager_clan',
    commanderName: 'Taserface & The Ravager Scavengers',
    faction: 'Ravager Smuggler Syndicate',
    lineup: ['Yondu Udonta (Variant)', 'Kraglin Obfonteri', 'Ravager Heavy Brawler'],
    combatRating: 240,
    difficultyTier: 'CHALLENGER',
    trophyReward: 25,
    vibraniumReward: 45,
    scrapReward: 120,
    specialTactics: 'Yaka Arrow Barrage: Quick opening burst damage.',
  },
  {
    id: 'opp_asgard_gladiators',
    commanderName: 'Valkyrie Scrap Vanguard',
    faction: 'Scrapper 142 Syndicate',
    lineup: ['Valkyrie (Scrapper Mode)', 'Korg the Kronan', 'Miek the Insectoid'],
    combatRating: 420,
    difficultyTier: 'CHAMPION',
    trophyReward: 50,
    vibraniumReward: 90,
    scrapReward: 250,
    specialTactics: 'Kronan Rock Skin: +35% damage resistance in early rounds.',
  },
  {
    id: 'opp_doombot_cohort',
    commanderName: 'Latverian Phalanx Unit 09',
    faction: 'Doom Sovereign Guard',
    lineup: ['Doombot Commander', 'Doombot Heavy Enforcer', 'Latverian Cyber-Mage'],
    combatRating: 680,
    difficultyTier: 'GRANDMASTER_ELITE',
    trophyReward: 95,
    vibraniumReward: 180,
    scrapReward: 450,
    specialTactics: 'Mystic Siphon: Drains power every turn to regenerate shields.',
  },
  {
    id: 'opp_hulk_gladiators',
    commanderName: 'Grandmaster Champion Hulk Syndicate',
    faction: 'Contest of Champions Reigning Kings',
    lineup: ['Gladiator Hulk', 'Fenris Hound Echo', 'Berserker Champion'],
    combatRating: 850,
    difficultyTier: 'GRANDMASTER_ELITE',
    trophyReward: 140,
    vibraniumReward: 300,
    scrapReward: 700,
    specialTactics: 'Unbridled Rage: Attack strength increases by 20% each combat round.',
  }
];

let globalLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    commanderName: 'The Grandmaster (House Champion)',
    faction: 'Sakaar Sovereign Arena',
    avatarIcon: '👑',
    trophies: 2850,
    survivalCycles: 142,
    defenseRating: 980,
    mvpHero: 'Gladiator Hulk',
  },
  {
    rank: 2,
    commanderName: 'God-Emperor Doom',
    faction: 'Latverian Incursion Nexus',
    avatarIcon: '⚡',
    trophies: 2520,
    survivalCycles: 119,
    defenseRating: 940,
    mvpHero: 'Doctor Doom',
  },
  {
    rank: 3,
    commanderName: 'Mister Fantastic (Earth-828)',
    faction: 'Baxter Space Outpost',
    avatarIcon: '🔬',
    trophies: 2190,
    survivalCycles: 98,
    defenseRating: 870,
    mvpHero: 'Reed Richards',
  },
  {
    rank: 4,
    commanderName: 'You (Sakaar Outpost Commander)',
    faction: 'Earth-616 / Sakaar Resistance',
    avatarIcon: '🛡️',
    trophies: 1450,
    survivalCycles: 45,
    defenseRating: 520,
    mvpHero: 'Iron Man (Tony Stark)',
  },
  {
    rank: 5,
    commanderName: 'Logan (Earth-10005)',
    faction: 'Weapon X Wastelanders',
    avatarIcon: '🐺',
    trophies: 1380,
    survivalCycles: 62,
    defenseRating: 610,
    mvpHero: 'Hugh Jackman Wolverine',
  },
  {
    rank: 6,
    commanderName: 'Peter Parker (Earth-96283)',
    faction: 'Friendly Neighborhood Outpost',
    avatarIcon: '🕷️',
    trophies: 1210,
    survivalCycles: 51,
    defenseRating: 480,
    mvpHero: 'Tobey Maguire Spider-Man',
  }
];

// 1. GET /api/arena/opponents - Fetch available gladiatorial opponents
arenaRouter.get('/opponents', (_req: Request, res: Response) => {
  res.json({
    success: true,
    opponents: arenaOpponents,
    timestamp: Date.now(),
  });
});

// 2. GET /api/arena/leaderboard - Global Contest of Champions leaderboard
arenaRouter.get('/leaderboard', (_req: Request, res: Response) => {
  res.json({
    success: true,
    leaderboard: globalLeaderboard,
    timestamp: Date.now(),
  });
});

// 3. POST /api/arena/duel - Simulate an arena match
arenaRouter.post('/duel', (req: Request, res: Response) => {
  try {
    const { opponentId, playerHeroes = [], playerCombatPower = 400 } = req.body;

    const opponent = arenaOpponents.find((o) => o.id === opponentId);
    if (!opponent) {
      return res.status(404).json({ error: `Opponent '${opponentId}' not found.` });
    }

    const playerPower = Math.max(playerCombatPower, playerHeroes.length * 120, 200);
    const oppPower = opponent.combatRating;

    // Simulate multi-round combat log
    const rounds: Array<{
      roundNumber: number;
      action: string;
      playerDamage: number;
      oppDamage: number;
    }> = [];

    let playerHp = 1000;
    let oppHp = 1000;

    for (let r = 1; r <= 3; r++) {
      const pDmg = Math.round((playerPower / 3) * (0.85 + Math.random() * 0.4));
      const oDmg = Math.round((oppPower / 3) * (0.85 + Math.random() * 0.4));

      oppHp = Math.max(0, oppHp - pDmg);
      playerHp = Math.max(0, playerHp - oDmg);

      rounds.push({
        roundNumber: r,
        action: r === 1
          ? `Round 1 Opening Clash: ${playerHeroes[0] || 'Your Vanguard'} trades heavy blows with ${opponent.lineup[0]}!`
          : r === 2
          ? `Round 2 Synergy Surge: ${opponent.specialTactics}`
          : `Round 3 Climactic Finish: Decisive ultimate clash on the Grandmaster sands!`,
        playerDamage: pDmg,
        oppDamage: oDmg,
      });

      if (oppHp <= 0 || playerHp <= 0) break;
    }

    // Determine winner
    const playerWon = oppHp <= 0 || (playerHp > oppHp);

    let rewards = {
      trophies: 0,
      vibranium: 0,
      scrap: 0,
    };

    if (playerWon) {
      rewards = {
        trophies: opponent.trophyReward,
        vibranium: opponent.vibraniumReward,
        scrap: opponent.scrapReward,
      };

      // Update player trophies on leaderboard
      const playerRank = globalLeaderboard.find((entry) => entry.rank === 4);
      if (playerRank) {
        playerRank.trophies += opponent.trophyReward;
      }
    } else {
      rewards = {
        trophies: -10,
        vibranium: 10, // pity scrap
        scrap: 30,
      };
    }

    return res.json({
      success: true,
      victory: playerWon,
      opponent: opponent.commanderName,
      playerFinalHp: playerHp,
      opponentFinalHp: oppHp,
      combatRounds: rounds,
      rewardsEarned: rewards,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/arena/duel:', error);
    return res.status(500).json({ error: 'Failed to process arena duel', details: error?.message });
  }
});
