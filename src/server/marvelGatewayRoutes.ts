import { Router, Request, Response } from 'express';

export const marvelGatewayRouter = Router();

interface ComicCanonDossier {
  heroId: string;
  name: string;
  alias: string;
  firstAppearance: {
    comicTitle: string;
    issueNumber: string;
    publicationYear: number;
    creators: string[];
    coverSnippetDescription: string;
  };
  officialPowerGrid: {
    intelligence: number; // 1-7
    strength: number;
    speed: number;
    durability: number;
    energyProjection: number;
    fightingSkills: number;
  };
  keyComicCrossovers: string[];
  canonicalBio: string;
  multiverseAffiliation: string;
}

const comicDossiers: Record<string, ComicCanonDossier> = {
  iron_man: {
    heroId: 'iron_man',
    name: 'Anthony Edward Stark',
    alias: 'Iron Man / The Invincible Iron Man',
    firstAppearance: {
      comicTitle: 'Tales of Suspense',
      issueNumber: '#39',
      publicationYear: 1963,
      creators: ['Stan Lee', 'Larry Lieber', 'Don Heck', 'Jack Kirby'],
      coverSnippetDescription: 'Original bulky grey Model 01 armor breaking free of captors.',
    },
    officialPowerGrid: {
      intelligence: 6,
      strength: 6,
      speed: 5,
      durability: 6,
      energyProjection: 6,
      fightingSkills: 4,
    },
    keyComicCrossovers: ['Secret Wars (1984)', 'Civil War (2006)', 'Time Runs Out (2015)', 'Armor Wars (1987)'],
    canonicalBio: 'Billionaire industrialist, futurist, and founding Avenger who created personalized powered exo-armor to survive life-threatening shrapnel and defend humanity.',
    multiverseAffiliation: 'Illuminati & Avengers (Earth-616)',
  },
  doctor_doom: {
    heroId: 'doctor_doom',
    name: 'Victor Von Doom',
    alias: 'Doctor Doom / God-Emperor Doom',
    firstAppearance: {
      comicTitle: 'The Fantastic Four',
      issueNumber: '#5',
      publicationYear: 1962,
      creators: ['Stan Lee', 'Jack Kirby'],
      coverSnippetDescription: 'Green hooded monarch commanding the Fantastic Four into a time-travel caper.',
    },
    officialPowerGrid: {
      intelligence: 7,
      strength: 4,
      speed: 3,
      durability: 6,
      energyProjection: 6,
      fightingSkills: 5,
    },
    keyComicCrossovers: ['Secret Wars (1984)', 'Secret Wars (2015)', 'Doomquest', 'Emperor Doom'],
    canonicalBio: 'Monarch of Latveria, supreme master of both cybernetics and mystic dark arts. In Secret Wars (2015), he saved remnants of the colliding multiverse by forging Battleworld.',
    multiverseAffiliation: 'Latverian Incursion Nexus & Creator of Battleworld',
  },
  mister_fantastic: {
    heroId: 'mister_fantastic',
    name: 'Reed Richards',
    alias: 'Mister Fantastic',
    firstAppearance: {
      comicTitle: 'The Fantastic Four',
      issueNumber: '#1',
      publicationYear: 1961,
      creators: ['Stan Lee', 'Jack Kirby'],
      coverSnippetDescription: 'The Fantastic Four battling the subterranean Giganto monster.',
    },
    officialPowerGrid: {
      intelligence: 7,
      strength: 3,
      speed: 3,
      durability: 5,
      energyProjection: 1,
      fightingSkills: 3,
    },
    keyComicCrossovers: ['The Galactus Trilogy (1966)', 'Secret Wars (2015)', 'Infinity Gauntlet (1991)', 'Council of Reeds'],
    canonicalBio: 'The smartest man in the multiverse, leader of the Fantastic Four, and pioneer of dimensional physics and antimatter bridge technology.',
    multiverseAffiliation: 'Fantastic Four (Earth-828 / Earth-616) & Council of Reeds',
  },
  wolverine: {
    heroId: 'wolverine',
    name: 'James "Logan" Howlett',
    alias: 'Wolverine / Weapon X',
    firstAppearance: {
      comicTitle: 'The Incredible Hulk',
      issueNumber: '#181',
      publicationYear: 1974,
      creators: ['Len Wein', 'Roy Thomas', 'John Romita Sr.', 'Herb Trimpe'],
      coverSnippetDescription: 'Claws bared, leaping into battle against the Incredible Hulk and the Wendigo.',
    },
    officialPowerGrid: {
      intelligence: 3,
      strength: 4,
      speed: 3,
      durability: 6,
      energyProjection: 1,
      fightingSkills: 7,
    },
    keyComicCrossovers: ['Days of Future Past', 'Weapon X', 'Old Man Logan', 'Secret Wars (2015)'],
    canonicalBio: 'Mutant warrior with an accelerated regenerative healing factor, enhanced animalistic senses, and an indestructible Adamantium-bonded skeletal frame with retractable claws.',
    multiverseAffiliation: 'X-Men (Earth-10005) & Avengers Unity Division',
  },
  spider_man: {
    heroId: 'spider_man',
    name: 'Peter Benjamin Parker',
    alias: 'Spider-Man / The Friendly Neighborhood Wall-Crawler',
    firstAppearance: {
      comicTitle: 'Amazing Fantasy',
      issueNumber: '#15',
      publicationYear: 1962,
      creators: ['Stan Lee', 'Steve Ditko'],
      coverSnippetDescription: 'Swinging from a web-line across New York skyscrapers carrying a defeated criminal.',
    },
    officialPowerGrid: {
      intelligence: 5,
      strength: 4,
      speed: 4,
      durability: 4,
      energyProjection: 1,
      fightingSkills: 5,
    },
    keyComicCrossovers: ['Spider-Verse', 'Secret Wars (1984 - Black Suit Origin)', 'Maximum Carnage', 'Brand New Day'],
    canonicalBio: 'Endowed with the proportionate strength and agility of a spider, genius intellect, and precognitive Spider-Sense, dedicated to the principle that with great power comes great responsibility.',
    multiverseAffiliation: 'Spider-Army Champion (Earth-616 / Earth-96283 / Earth-199999)',
  }
};

interface ReleaseRadarFilm {
  id: string;
  title: string;
  phase: string;
  projectedReleaseDate: string;
  confirmedDirectors: string[];
  headlineCast: string[];
  synopsis: string;
  thematicTiesToSakaar: string;
}

const releaseRadar: ReleaseRadarFilm[] = [
  {
    id: 'avengers_doomsday',
    title: 'Avengers: Doomsday',
    phase: 'Phase 6 (The Multiverse Saga Climax Part 1)',
    projectedReleaseDate: '2026-05-01',
    confirmedDirectors: ['Anthony Russo', 'Joe Russo'],
    headlineCast: ['Robert Downey Jr. (Victor Von Doom / Doctor Doom)', 'Pedro Pascal (Reed Richards)', 'Vanessa Kirby (Sue Storm)'],
    synopsis: 'The heroes of Earth-616 and newly arrived multiversal variants face the sovereign might of Doctor Doom as universal incursion boundaries violently collapse into each other.',
    thematicTiesToSakaar: 'Powers the Sakaar Incursion Warning Systems and Doomsday Clock in this outpost.',
  },
  {
    id: 'spider_man_brand_new_day',
    title: 'Spider-Man: Brand New Day (Spider-Man 4)',
    phase: 'Phase 6',
    projectedReleaseDate: '2026-07-24',
    confirmedDirectors: ['Destin Daniel Cretton'],
    headlineCast: ['Tom Holland (Peter Parker)', 'Zendaya (MJ)', 'Mark Ruffalo (Bruce Banner / Hulk)'],
    synopsis: 'Peter Parker navigates life in the aftermath of Doctor Strange’s memory wipe, balancing street-level heroics in New York with broader multiversal echoes.',
    thematicTiesToSakaar: 'Supplies Spider-Man variants to the Multiverse Vanguard team-up matrix.',
  },
  {
    id: 'avengers_secret_wars',
    title: 'Avengers: Secret Wars',
    phase: 'Phase 6 (The Multiverse Saga Finale)',
    projectedReleaseDate: '2027-05-07',
    confirmedDirectors: ['Anthony Russo', 'Joe Russo'],
    headlineCast: ['Robert Downey Jr. (God-Emperor Doom)', 'Hugh Jackman (Wolverine)', 'Tobey Maguire (Spider-Man)', 'Chris Evans (Variant)'],
    synopsis: 'The final, catastrophic collision of all known Marvel realities creates Battleworld—a patchwork planet ruled by Doctor Doom where surviving heroes fight for the fate of existence.',
    thematicTiesToSakaar: 'The ultimate climax toward which the Sakaar Battleworld Holographic War Table is preparing.',
  }
];

// 1. GET /api/marvel-gateway/characters/:heroId - Official Marvel comic canon dossier
marvelGatewayRouter.get('/characters/:heroId', (req: Request, res: Response) => {
  const { heroId } = req.params;
  const dossier = comicDossiers[heroId];

  if (!dossier) {
    // Generate a structured default dossier for any other hero
    const fallbackDossier: ComicCanonDossier = {
      heroId,
      name: heroId.replace(/_/g, ' ').toUpperCase(),
      alias: `MCU Variant: ${heroId}`,
      firstAppearance: {
        comicTitle: 'Marvel Comics Archive',
        issueNumber: 'Vol. 1',
        publicationYear: 1968,
        creators: ['Marvel Bullpen Legends'],
        coverSnippetDescription: 'Archived first canonical appearance in classic Marvel continuity.',
      },
      officialPowerGrid: {
        intelligence: 4,
        strength: 5,
        speed: 4,
        durability: 5,
        energyProjection: 4,
        fightingSkills: 5,
      },
      keyComicCrossovers: ['Secret Wars', 'Infinity War', 'Contest of Champions'],
      canonicalBio: `Canonical Marvel universe asset deployed to Sakaar Outpost to defend against multiversal incursion anomalies.`,
      multiverseAffiliation: 'Sakaar Multiverse Vanguard Outpost',
    };
    return res.json({ success: true, dossier: fallbackDossier, source: 'Marvel Official Continuity Index' });
  }

  return res.json({
    success: true,
    dossier,
    source: 'Marvel Official Handbook & Continuity Archives',
    timestamp: Date.now(),
  });
});

// 2. GET /api/marvel-gateway/release-radar - Live theatrical release tracker
marvelGatewayRouter.get('/release-radar', (_req: Request, res: Response) => {
  const now = new Date();

  const formattedReleases = releaseRadar.map((film) => {
    const target = new Date(film.projectedReleaseDate);
    const diffMs = target.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      ...film,
      daysRemaining,
      status: daysRemaining === 0 ? 'NOW_IN_THEATERS' : daysRemaining < 90 ? 'IMMINENT_PREMIERE' : 'IN_PRODUCTION',
    };
  });

  res.json({
    success: true,
    radar: formattedReleases,
    studio: 'Marvel Studios / Kevin Feige Multiverse Saga Slate',
    timestamp: Date.now(),
  });
});
