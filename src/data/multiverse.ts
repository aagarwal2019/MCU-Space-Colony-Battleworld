import { MultiverseTimeline, MultiverseDirective, IncursionRiftAnomaly } from '../types';

export const INITIAL_TIMELINES: MultiverseTimeline[] = [
  // -------------------------------------------------------------
  // 1. SACRED TIMELINE (MCU MAIN CANON)
  // -------------------------------------------------------------
  {
    id: 'earth_616',
    name: 'The Sacred Timeline (Earth-616)',
    realityCode: 'Earth-616',
    filmFranchise: 'Marvel Cinematic Universe (MCU Prime 2008–Present)',
    keyFigures: ['The Avengers', 'Doctor Strange', 'Iron Man', 'Thor', 'Captain America'],
    threatVector: 'Temporal Loom displacement & interdimensional anchor breaches',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2008–Present MCU Infinity & Multiverse Sagas',
    status: 'harmonized',
    stabilityPercent: 88,
    incursionRisk: 14,
    description: 'The primary cinematic reality of the Avengers. Multiversal incursions caused by dimension travelers threaten universal collision.',
    lore: 'Guarded by Earth\'s mightiest heroes, Earth-616 is the anchor reality of the multiverse. As Sakaar\'s wormhole dampeners stabilize, temporal fallout is filtered safely into cosmic vacuum.',
    activePerk: '+25% Colony Arc Power generation & +15% Stark Lab research speed',
    stabilizeCost: {
      power: 120,
      scrap: 150,
      vibraniumCredits: 25,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 35,
      scrap: 200,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 2. FANTASTIC FOUR RETRO-FUTURISTIC CONTINUUM (EARTH-828)
  // -------------------------------------------------------------
  {
    id: 'earth_828',
    name: 'Fantastic Four Retro-Futuristic Continuum (Earth-828)',
    realityCode: 'Earth-828',
    filmFranchise: 'Marvel Studios The Fantastic Four: First Steps (2025) & Avengers: Doomsday (2026)',
    keyFigures: [
      'Reed Richards / Mister Fantastic (Pedro Pascal)',
      'Sue Storm / Invisible Woman (Vanessa Kirby)',
      'Johnny Storm / Human Torch (Joseph Quinn)',
      'Ben Grimm / The Thing (Ebon Moss-Bachrach)',
      'Shalla-Bal / Silver Surfer (Julia Garner)',
      'Galactus (Ralph Ineson)',
      'H.E.R.B.I.E. Automaton',
      'Doctor Doom (Robert Downey Jr.)'
    ],
    threatVector: 'Galactus cosmic planetary consumption & Doctor Doom Doomsday Incursion threshold',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2025–2026 MCU Phase 6 (First Steps & Avengers: Doomsday)',
    status: 'harmonized',
    stabilityPercent: 89,
    incursionRisk: 15,
    description: 'The alternate 1960s retro-futuristic atomic-age universe where Marvel\'s First Family—Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach—battles the cosmic hunger of Galactus before colliding directly with Doctor Doom in Avengers: Doomsday.',
    lore: 'Earth-828 is an optimistic, mid-century atomic-age utopian universe where the Space Race and advanced science yielded clean nuclear power, art-deco orbital platforms, the sentient automaton H.E.R.B.I.E., and the iconic blue-and-white suited Fantastic Four led by Pedro Pascal\'s Reed Richards and Vanessa Kirby\'s Sue Storm. Confronting Shalla-Bal\'s herald warnings and the world-devouring cosmic titan Galactus (Ralph Ineson), this universe experiences cross-dimensional fractures that will plunge them into battle against Robert Downey Jr.\'s Doctor Doom in Avengers: Doomsday. Harmonizing with Earth-828 equips Sakaar with retro-futuristic Baxter antimatter shielding and deep-space tachyon sensors.',
    activePerk: '+40% Stark Lab / Baxter research speed, +50 Colony Defense Rating, and Baxter antimatter shielding reduces Incursion escalation by 35%',
    stabilizeCost: {
      power: 135,
      scrap: 155,
      vibraniumCredits: 32,
    },
    siphonReward: {
      chronoCores: 3,
      vibraniumCredits: 60,
      scrap: 250,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 3. 20TH CENTURY FOX X-MEN & MUTANT CONTINUUM (EARTH-10005)
  // -------------------------------------------------------------
  {
    id: 'earth_10005',
    name: 'Fox Mutant Continuum (Earth-10005)',
    realityCode: 'Earth-10005',
    filmFranchise: '20th Century Fox X-Men Franchise (2000–2020) & Deadpool & Wolverine (2024)',
    keyFigures: ['Wolverine (Logan)', 'Professor Charles Xavier', 'Magneto', 'Deadpool (Wade Wilson)', 'Jean Grey / Phoenix'],
    threatVector: 'Alkali Lake Weapon X Adamantium resonance & Cerebro psionic leakage',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2000–2024 Fox X-Men Cinematic Universe',
    status: 'harmonized',
    stabilityPercent: 82,
    incursionRisk: 19,
    description: 'The iconic cinematic universe where Homo superior mutants first emerged. Anchored by the Xavier School, the Weapon X program, and the legacy of Wolverine.',
    lore: 'From Liberty Island and the Alkali Lake Dam to Days of Future Past and the dystopian Logan timeline, Earth-10005 has weathered endless temporal rewrites. Its anchor being was Wolverine (Logan), whose death triggered universe-wide decay until Deadpool\'s multiversal intervention. Harmonizing with Earth-10005 taps Cerebro psionic telemetry and Adamantium molecular bonding for colony defense.',
    activePerk: '+40 Colony Defense Rating & Adamantium cellular bonding mitigates crisis structural damage by 50%',
    stabilizeCost: {
      power: 140,
      scrap: 160,
      vibraniumCredits: 30,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 45,
      scrap: 240,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 3. SAM RAIMI SPIDER-MAN TRILOGY (EARTH-96283)
  // -------------------------------------------------------------
  {
    id: 'earth_96283',
    name: 'Raimi Spider-Man Universe (Earth-96283)',
    realityCode: 'Earth-96283',
    filmFranchise: 'Columbia Pictures Sam Raimi Spider-Man Trilogy (2002–2007)',
    keyFigures: ['Spider-Man (Tobey Maguire)', 'Green Goblin (Norman Osborn)', 'Doctor Octopus', 'Mary Jane Watson', 'Sandman'],
    threatVector: 'Tritium fusion containment breach & Daily Bugle high-tensile web anomalies',
    posterUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2002–2007 Sam Raimi Trilogy',
    status: 'harmonized',
    stabilityPercent: 86,
    incursionRisk: 16,
    description: 'The universe of the Sam Raimi Spider-Man Trilogy featuring Tobey Maguire as Peter Parker / Spider-Man, battling Green Goblin, Doctor Octopus, Sandman, and Venom.',
    lore: 'Earth-96283 is the iconic reality where Peter Parker first learned that "With great power comes great responsibility." Linking Sakaar\'s transponders to Earth-96283 deploys high-tensile organic webbing to reinforce damaged sectors and bolster colony morale.',
    activePerk: '+35 Colony Defense Rating & organic web reinforcements reduce building breakdown by 40%',
    stabilizeCost: {
      power: 130,
      scrap: 150,
      vibraniumCredits: 30,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 45,
      scrap: 220,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 4. THE AMAZING SPIDER-MAN UNIVERSE (EARTH-120703)
  // -------------------------------------------------------------
  {
    id: 'earth_120703',
    name: 'The Amazing Spider-Man Universe (Earth-120703)',
    realityCode: 'Earth-120703',
    filmFranchise: 'Sony Pictures The Amazing Spider-Man Franchise (2012–2014) & No Way Home',
    keyFigures: ['Peter Parker (Andrew Garfield)', 'Gwen Stacy', 'Dr. Curt Connors (Lizard)', 'Max Dillon (Electro)', 'Harry Osborn'],
    threatVector: 'Oscorp Tower cross-species bio-cable overcharge & high-voltage grid feedback',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2012–2014 Marc Webb Films & No Way Home',
    status: 'harmonized',
    stabilityPercent: 83,
    incursionRisk: 18,
    description: 'The high-velocity world of Andrew Garfield\'s Peter Parker, driven by Richard Parker\'s genetic research at Oscorp, cross-species breakthroughs, and battles with the Lizard and Electro.',
    lore: 'Earth-120703 Peter Parker endured the tragic loss of Gwen Stacy before crossing the multiverse in No Way Home to redeem himself and help cure his former adversaries. Oscorp\'s bio-electric generators and synthetic bio-cable tensile matrices provide groundbreaking engineering telemetry to supercharge Sakaar\'s power conduits.',
    activePerk: '+30% Stark Lab / Oscorp research speed & bio-cable capacitors boost Colony Energy generation by +60 Arc Power',
    stabilizeCost: {
      power: 135,
      scrap: 155,
      vibraniumCredits: 32,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 50,
      scrap: 230,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 5. NEW LINE CINEMA BLADE TRILOGY (EARTH-26320)
  // -------------------------------------------------------------
  {
    id: 'earth_26320',
    name: 'The Original Daywalker Realm (Earth-26320)',
    realityCode: 'Earth-26320',
    filmFranchise: 'New Line Cinema Blade Trilogy (1998–2004) & Deadpool & Wolverine (2024)',
    keyFigures: ['Eric Brooks (Blade / Wesley Snipes)', 'Abraham Whistler', 'Deacon Frost', 'Jared Nomak', 'Hannibal King'],
    threatVector: 'House of Erebus blood-temple dimensional bleed & UV arc-light discharge',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    releaseEra: '1998–2004 Wesley Snipes Blade Trilogy',
    status: 'harmonized',
    stabilityPercent: 85,
    incursionRisk: 15,
    description: 'The grim gothic underworld where Wesley Snipes\' iconic half-vampire Daywalker wages an uncompromising war against ancient bloodlines and modern vampire cartels.',
    lore: 'Earth-26320 launched modern Marvel theatrical cinema in 1998. Wielding titanium broadswords, silver nitrate ammunition, and high-intensity ultraviolet beam arrays engineered by Whistler, Blade is the ultimate predator. In Deadpool & Wolverine, Blade entered the TVA Void to assert: "There\'s only been one Blade. There\'s only ever gonna be one Blade." Harmonizing with Earth-26320 establishes lethal nocturnal defenses.',
    activePerk: '+45 Colony Defense Rating & UV arc-weaponry purges hostile incursion raiders with +100% efficiency',
    stabilizeCost: {
      power: 125,
      scrap: 145,
      vibraniumCredits: 28,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 40,
      scrap: 210,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 6. 20TH CENTURY FOX FANTASTIC FOUR (EARTH-121698)
  // -------------------------------------------------------------
  {
    id: 'earth_121698',
    name: 'Tim Story Fantastic Four Dimension (Earth-121698)',
    realityCode: 'Earth-121698',
    filmFranchise: '20th Century Fox Fantastic Four (2005) & Rise of the Silver Surfer (2007)',
    keyFigures: ['Reed Richards (Ioan Gruffudd)', 'Sue Storm (Jessica Alba)', 'Johnny Storm (Chris Evans)', 'Ben Grimm (Michael Chiklis)', 'Silver Surfer'],
    threatVector: 'Von Doom Orbital Space Station cosmic radiation storm & Silver Surfer cosmic tachyon wakes',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2005–2007 Tim Story Fantastic Four Films',
    status: 'harmonized',
    stabilityPercent: 87,
    incursionRisk: 13,
    description: 'The vibrant 2000s universe of Marvel\'s First Family—Ioan Gruffudd, Jessica Alba, Chris Evans, and Michael Chiklis—battling Doctor Doom and encountering the cosmic Silver Surfer.',
    lore: 'When an orbital mission to study a passing cosmic storm struck Victor von Doom\'s private space station, four explorers mutated to gain elemental abilities. Chris Evans\' charismatic Human Torch notably returned across the Multiverse in Deadpool & Wolverine\'s Void. Siphoning cosmic energy from Earth-121698 generates pristine cosmic isotopes and shields against deep-space radiation.',
    activePerk: '+25% Vibranium Credit yield & Cosmic Ray shielding deflects hostile orbital radiation storms',
    stabilizeCost: {
      power: 140,
      scrap: 150,
      vibraniumCredits: 35,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 55,
      scrap: 230,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 7. 20TH CENTURY FOX DAREDEVIL & ELEKTRA (EARTH-701306)
  // -------------------------------------------------------------
  {
    id: 'earth_701306',
    name: 'The Shadow Vigilante Realm (Earth-701306)',
    realityCode: 'Earth-701306',
    filmFranchise: '20th Century Fox Daredevil (2003) & Elektra (2005) / Deadpool & Wolverine',
    keyFigures: ['Matt Murdock / Daredevil (Ben Affleck)', 'Elektra Natchios (Jennifer Garner)', 'Bullseye (Colin Farrell)', 'Kingpin (Michael Clarke Duncan)'],
    threatVector: 'Hell\'s Kitchen rainfall sonic reverberation & Hand ninja dimensional stealth vectors',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2003–2005 Mark Steven Johnson Films',
    status: 'harmonized',
    stabilityPercent: 89,
    incursionRisk: 12,
    description: 'The noir-drenched Hell\'s Kitchen where Ben Affleck\'s blind lawyer Matt Murdock and Jennifer Garner\'s sai-wielding assassin Elektra battle ruthless crime syndicates.',
    lore: 'Earth-701306 brought heavy sonic acoustics, rain-slicked cathedral battles, and relentless combat choreography to early 2000s cinema. Jennifer Garner\'s Elektra Natchios subsequently fought alongside the Resistance in the TVA Void in Deadpool & Wolverine. Synchronizing acoustic sonar radars from Earth-701306 gives Sakaar hyper-acute early threat detection.',
    activePerk: 'Radar acoustic sensors identify incoming Incursions & planetary crises 45 seconds earlier',
    stabilizeCost: {
      power: 115,
      scrap: 135,
      vibraniumCredits: 24,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 38,
      scrap: 190,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 8. COLUMBIA PICTURES GHOST RIDER (EARTH-121347)
  // -------------------------------------------------------------
  {
    id: 'earth_121347',
    name: 'The Hellfire Spirit of Vengeance (Earth-121347)',
    realityCode: 'Earth-121347',
    filmFranchise: 'Columbia Pictures Ghost Rider (2007) & Spirit of Vengeance (2011)',
    keyFigures: ['Johnny Blaze / Ghost Rider (Nicolas Cage)', 'Carter Slade / Phantom Rider (Sam Elliott)', 'Mephistopheles', 'Blackheart'],
    threatVector: 'San Venganza demoniac contract portal & molten Hellfire thermal exhaust',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2007–2011 Nicolas Cage Ghost Rider Films',
    status: 'harmonized',
    stabilityPercent: 80,
    incursionRisk: 22,
    description: 'The fiery supernatural universe where stunt motorcyclist Johnny Blaze sold his soul to save his father and bonded with the demon Zarathos to wield the Penance Stare.',
    lore: 'Earth-121347 burns with supernatural hellfire that defies thermodynamics and temporal decay. Ripping through the night on a flaming motorcycle, cracking hellfire chains that melt steel, Nicolas Cage\'s Ghost Rider scours evil from reality. Tapping Earth-121347 channels inexhaustible thermal arc energy into Sakaar\'s generators and incinerates toxic atmospheric waste.',
    activePerk: 'Hellfire thermal core generates +120 Arc Power per cycle & incinerates toxic atmospheric waste (+25 O₂)',
    stabilizeCost: {
      power: 150,
      scrap: 170,
      vibraniumCredits: 36,
    },
    siphonReward: {
      chronoCores: 3,
      vibraniumCredits: 55,
      scrap: 260,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 9. SONY PICTURES ANIMATION SPIDER-VERSE (EARTH-1610B)
  // -------------------------------------------------------------
  {
    id: 'earth_1610b',
    name: 'The Spider-Verse Animated Multiverse (Earth-1610B)',
    realityCode: 'Earth-1610B',
    filmFranchise: 'Sony Pictures Animation Spider-Verse Trilogy (2018–2024)',
    keyFigures: ['Miles Morales (Spider-Man)', 'Gwen Stacy (Ghost-Spider / Earth-65B)', 'Miguel O\'Hara (Spider-Man 2099 / Earth-928B)', 'Peter B. Parker', 'Hobie Brown (Spider-Punk)'],
    threatVector: 'Alchemax Super-Collider glitch cascades & canon event spatial unraveling',
    posterUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2018–2024 Into & Across the Spider-Verse',
    status: 'harmonized',
    stabilityPercent: 84,
    incursionRisk: 17,
    description: 'The visually explosive comic-print multiverse of Miles Morales, Gwen Stacy, and the multiversal Spider-Society headquartered in Nueva York under Miguel O\'Hara.',
    lore: 'A masterwork of cel-shaded rendering, day-glow chromatic aberration, and dimensional physics, Earth-1610B introduced the concept of quantum glitching and canon events. Equipped with multiversal Gizmo watches and the Go-Home Machine, the Spider-Society actively patrols anomalies across dimensions. Linking Sakaar to Earth-1610B mitigates reality glitching and stabilizes temporal rifts.',
    activePerk: 'Quantum glitch dampeners reduce all Incursion escalation rates by 35% & grant +1 Chrono-Core per cycle',
    stabilizeCost: {
      power: 120,
      scrap: 140,
      vibraniumCredits: 28,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 42,
      scrap: 210,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 10. UNIVERSAL PICTURES HULK (EARTH-400083)
  // -------------------------------------------------------------
  {
    id: 'earth_400083',
    name: 'The Gamma Titan Domain (Earth-400083)',
    realityCode: 'Earth-400083',
    filmFranchise: 'Universal Pictures Hulk (2003) Directed by Ang Lee',
    keyFigures: ['Bruce Banner / Hulk (Eric Bana)', 'Betty Ross (Jennifer Connelly)', 'General Ross (Sam Elliott)', 'David Banner (Absorbing Man / Nick Nolte)'],
    threatVector: 'Nanomed genetic transmutation feedback & gamma cloud resonance',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2003 Ang Lee Hulk Feature',
    status: 'harmonized',
    stabilityPercent: 81,
    incursionRisk: 21,
    description: 'The split-screen comic-panel universe of Eric Bana\'s Bruce Banner, genetically altered by his father\'s experiments to become a colossal titan who grows in size and density as his anger surges.',
    lore: 'Earth-400083 explored the psychological trauma and colossal physical scale of the Hulk, who grew up to fifteen feet tall and leaped miles across the Mojave desert while tanking Comanche missiles. Channelling this reality\'s raw cellular kinetic force into Sakaar\'s mechanical shredders doubles scrap excavation capacity.',
    activePerk: '+50% Scrap Foundry salvage yield from colossal brute-force kinetic excavation',
    stabilizeCost: {
      power: 130,
      scrap: 160,
      vibraniumCredits: 30,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 40,
      scrap: 290,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 11. THE ILLUMINATI REALM (EARTH-838)
  // -------------------------------------------------------------
  {
    id: 'earth_838',
    name: 'The Illuminati Realm (Earth-838)',
    realityCode: 'Earth-838',
    filmFranchise: 'Marvel Studios Multiverse of Madness (2022)',
    keyFigures: ['Reed Richards (John Krasinski)', 'Professor X (Patrick Stewart)', 'Black Bolt', 'Captain Carter', 'Captain Marvel (Maria Rambeau)'],
    threatVector: 'Ultron Sentry automated gateway breach & Darkhold memory echoes',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2022 Multiverse of Madness',
    status: 'harmonized',
    stabilityPercent: 92,
    incursionRisk: 10,
    description: 'A technocratic universe governed by the Illuminati, protected by autonomous Ultron Sentries and Baxter Building sub-space teleporters.',
    lore: 'Reed Richards, Black Bolt, and Professor X achieved peace through preemptive containment. Tapping Earth-838\'s frequency unlocks sophisticated cybernetic defensive blueprints.',
    activePerk: '+40 Colony Defense Rating & automated periodic building self-repair',
    stabilizeCost: {
      power: 140,
      scrap: 160,
      vibraniumCredits: 30,
    },
    siphonReward: {
      chronoCores: 2,
      vibraniumCredits: 50,
      scrap: 220,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 12. THE VOID AT THE END OF TIME
  // -------------------------------------------------------------
  {
    id: 'the_void',
    name: 'The Void at the End of Time',
    realityCode: 'The Void',
    filmFranchise: 'Marvel Studios Loki (2021–2023) & Deadpool & Wolverine (2024)',
    keyFigures: ['Cassandra Nova', 'Alioth', 'Classic Loki', 'Blade (Wesley Snipes)', 'Elektra (Jennifer Garner)', 'Gambit (Channing Tatum)'],
    threatVector: 'Alioth temporal matter consumption & Cassandra Nova telepathic storm',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2021–2024 Loki & Deadpool & Wolverine',
    status: 'incursion_warning',
    stabilityPercent: 64,
    incursionRisk: 42,
    description: 'The cosmic garbage dump where pruned variants and erased timelines are dropped beneath the eternal hunger of Alioth.',
    lore: 'Everything discarded from space-time lands here—including ruined Helicarriers, giant Ant-Man skeletons, and rogue Lokis. Scavenging its border yields unheralded ancient relics and forgotten franchise relics.',
    activePerk: '+45% Scrap Foundry harvest yield & elevated chance of discovering Chrono-Cores',
    stabilizeCost: {
      power: 160,
      scrap: 180,
      vibraniumCredits: 35,
    },
    siphonReward: {
      chronoCores: 3,
      vibraniumCredits: 40,
      scrap: 320,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 13. THE SUB-ATOMIC QUANTUM NEXUS
  // -------------------------------------------------------------
  {
    id: 'quantum_realm',
    name: 'The Sub-Atomic Quantum Nexus',
    realityCode: 'Quantum Realm',
    filmFranchise: 'Marvel Studios Ant-Man & The Wasp: Quantumania (2023)',
    keyFigures: ['Kang the Conqueror', 'Hank Pym', 'Janet van Dyne', 'Scott Lang / Ant-Man'],
    threatVector: 'Sub-atomic time vortex destabilization & Chrono-Engine core decay',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2023 Multiverse Saga Phase 5',
    status: 'harmonized',
    stabilityPercent: 78,
    incursionRisk: 28,
    description: 'A microscopic world beneath space, time, and entropy housing the Chrono-Citadel of Kang and sub-atomic time vortexes.',
    lore: 'Here, time does not behave as a straight line. Calibrating quantum dampeners across Sakaar\'s grid synchronizes sub-atomic warp fields to expedite all deep space expeditions.',
    activePerk: 'Planetary expeditions complete 35% faster & generates +1 Chrono-Core per cycle',
    stabilizeCost: {
      power: 150,
      scrap: 170,
      vibraniumCredits: 40,
    },
    siphonReward: {
      chronoCores: 3,
      vibraniumCredits: 45,
      scrap: 240,
    },
    lastStabilizedAt: 0,
  },

  // -------------------------------------------------------------
  // 14. BATTLEWORLD SINGULARITY (SECRET WARS)
  // -------------------------------------------------------------
  {
    id: 'battleworld_nexus',
    name: 'Battleworld Singularity (Secret Wars)',
    realityCode: 'Battleworld',
    filmFranchise: 'Avengers: Doomsday (2026) & Avengers: Secret Wars (2027)',
    keyFigures: ['Doctor Doom (Robert Downey Jr.)', 'Multiversal Council of Reeds', 'Beyonder Entities'],
    threatVector: 'Universal collision threshold collapse & complete reality cannibalism',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    releaseEra: '2026–2027 Avengers Multiverse Climax',
    status: 'fractured',
    stabilityPercent: 45,
    incursionRisk: 65,
    description: 'The apocalyptic convergence point where collapsing universes collide into a patchwork world overseen by godlike cosmic entities.',
    lore: 'The ultimate fate of an unshielded multiverse: Incursions obliterating alternate Earths until only fragments remain. Channeling its singularity yields unparalleled cosmic energy.',
    activePerk: '+150 Arc Power generation & +12 Vibranium Credits per cycle',
    stabilizeCost: {
      power: 250,
      scrap: 300,
      vibraniumCredits: 60,
    },
    siphonReward: {
      chronoCores: 4,
      vibraniumCredits: 80,
      scrap: 450,
    },
    lastStabilizedAt: 0,
  },
];

export const INITIAL_DIRECTIVES: MultiverseDirective[] = [
  {
    id: 'loom_weave',
    name: 'Yggdrasil Timeline Loom Weave',
    codename: 'PROTOCOL YGGDRASIL',
    influenceRequired: 80,
    description: 'Weaves frayed branch timelines with divine temporal strands, reducing Multiversal Incursion danger by 30% and harvesting +3 Chrono-Cores.',
    gravitasQuote: '"I know what kind of god I need to be. For you. For all of us." — Loki, God of Stories',
    cost: {
      chronoCores: 1,
      vibraniumCredits: 25,
      power: 150,
    },
    cooldownSec: 90,
    lastUsedAt: 0,
    effectType: 'loom_weave',
  },
  {
    id: 'cerebro_protocol',
    name: 'Cerebro Psionic Resonance Sweep (Earth-10005)',
    codename: 'PROTOCOL CEREBRO-X',
    influenceRequired: 160,
    description: 'Taps Professor Charles Xavier\'s Cerebro telepathic array across Earth-10005 to scan for incursion tears, boosting colony defense by +45 and resetting hostile incursion risk on all timelines by -20%.',
    gravitasQuote: '"Just because someone stumbles and loses their path, doesn\'t mean they\'re lost forever." — Professor Charles Xavier',
    cost: {
      chronoCores: 1,
      vibraniumCredits: 35,
      power: 160,
    },
    cooldownSec: 100,
    lastUsedAt: 0,
    effectType: 'cerebro_protocol',
  },
  {
    id: 'daywalker_ward',
    name: 'Daywalker Silver Nitrate Shroud (Earth-26320)',
    codename: 'PROTOCOL DAYWALKER-BLADE',
    influenceRequired: 240,
    description: 'Deploys Wesley Snipes\' Blade UV arc-emitters and silver-nitrate aerosol screens across the perimeter, incinerating night raiders, granting +50 Defense, and generating +350 Scrap.',
    gravitasQuote: '"Some motherfuckers are always trying to ice skate uphill." — Eric Brooks / Blade',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 40,
      power: 180,
    },
    cooldownSec: 110,
    lastUsedAt: 0,
    effectType: 'daywalker_ward',
  },
  {
    id: 'oscorp_overcharge',
    name: 'Oscorp Bio-Electric Grid Overdrive (Earth-120703)',
    codename: 'PROTOCOL OSCORP-AMAZING',
    influenceRequired: 300,
    description: 'Channels high-voltage bio-cable generators from The Amazing Spider-Man\'s Oscorp Tower directly into Sakaar\'s grid, generating +600 Arc Power and speeding active research by 50%.',
    gravitasQuote: '"You want to be a hero? Then you have to pay the price." — Peter Parker (Earth-120703)',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 45,
      power: 140,
    },
    cooldownSec: 130,
    lastUsedAt: 0,
    effectType: 'oscorp_overcharge',
  },
  {
    id: 'spider_society_patrol',
    name: 'Spider-Society Multiverse Watch (Earth-1610B/928B)',
    codename: 'PROTOCOL SPIDER-SOCIETY',
    influenceRequired: 380,
    description: 'Dispatches Miguel O\'Hara\'s dimensional Spider-Society strike team through multiversal Gizmo portals to stabilize all active Incursion Rifts and grant +3 Chrono-Cores.',
    gravitasQuote: '"Being Spider-Man is a sacrifice. That\'s the job. That\'s what you signed up for." — Miguel O\'Hara / Spider-Man 2099',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 55,
      power: 200,
    },
    cooldownSec: 140,
    lastUsedAt: 0,
    effectType: 'spider_society_patrol',
  },
  {
    id: 'first_steps_protocol',
    name: 'First Steps Baxter Antimatter Protocol (Earth-828)',
    codename: 'PROTOCOL FIRST-STEPS-828',
    influenceRequired: 340,
    description: 'Deploys Reed Richards\' retro-futuristic Baxter Building antimatter deflectors and H.E.R.B.I.E. automated repair drones from Earth-828. Immediately suppresses Incursion threat by -30%, repairs all damaged buildings by +40%, and grants +4 Chrono-Cores and +250 Arc Power.',
    gravitasQuote: '"We\'re not just explorers anymore. We are the architects of tomorrow." — Reed Richards / Mister Fantastic (Earth-828)',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 45,
      power: 175,
    },
    cooldownSec: 120,
    lastUsedAt: 0,
    effectType: 'first_steps_protocol',
  },
  {
    id: 'quantum_repulsor',
    name: 'Sub-Atomic Incursion Repulsor',
    codename: 'PROTOCOL QUANTUM-PULSE',
    influenceRequired: 200,
    description: 'Discharges a concentrated tachyon wave through Sakaar\'s atmospheric scrubbers, immediately neutralizing active Incursion Rifts and generating +500 Arc Power.',
    gravitasQuote: '"Time isn\'t a straight line. It is an engine of conquest... if you command the core." — Kang',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 40,
      power: 200,
    },
    cooldownSec: 120,
    lastUsedAt: 0,
    effectType: 'quantum_repulsor',
  },
  {
    id: 'illuminati_protocol',
    name: 'Earth-838 Defense Synchronization',
    codename: 'PROTOCOL ILLUMINATI-838',
    influenceRequired: 450,
    description: 'Synchronizes the outpost defense grid with Earth-838\'s automated Ultron Sentries, granting +60 Defense Rating, repairing all damaged buildings to 100%, and granting +180 Credits.',
    gravitasQuote: '"We must be prepared to do whatever is necessary to preserve our universe." — Professor Charles Xavier',
    cost: {
      chronoCores: 2,
      vibraniumCredits: 50,
      power: 180,
    },
    cooldownSec: 150,
    lastUsedAt: 0,
    effectType: 'illuminati_protocol',
  },
  {
    id: 'alioth_purge',
    name: 'Alioth Tempest Disruption',
    codename: 'PROTOCOL VOID-CONSUME',
    influenceRequired: 600,
    description: 'Unleashes the ravenous winds of the Void across the outpost perimeter, annihilating active raiders, extracting +500 Scrap into the vaults, and elevating colony Morale to 100%.',
    gravitasQuote: '"He is a living tempest that consumes matter and time itself." — Classic Loki',
    cost: {
      chronoCores: 3,
      vibraniumCredits: 75,
      power: 250,
    },
    cooldownSec: 180,
    lastUsedAt: 0,
    effectType: 'alioth_purge',
  },
  {
    id: 'battleworld_anchor',
    name: 'Battleworld Reality Sovereign',
    codename: 'PROTOCOL SECRET-WARS',
    influenceRequired: 800,
    description: 'Anchors Sakaar Outpost as the supreme central sanctuary of the multiverse. Permanently boosts all resource generation by +50%, resets incursion threat to 0%, and grants +8 Chrono-Cores.',
    gravitasQuote: '"Everything dies. You, me, everyone on this planet... unless someone has the will to reshape the cosmos." — Multiversal Doom',
    cost: {
      chronoCores: 5,
      vibraniumCredits: 120,
      power: 400,
    },
    cooldownSec: 300,
    lastUsedAt: 0,
    effectType: 'battleworld_anchor',
  },
];

export const INITIAL_INCURSION_RIFTS: IncursionRiftAnomaly[] = [
  {
    id: 'rift_earth_616_tear',
    title: 'Earth-616 Spatial Fissure (Manhattan Sky Tear)',
    realityCode: 'Earth-616',
    severity: 'moderate',
    description: 'A mirror dimension fracture has mirrored the New York skyline across Sakaar\'s garbage plains. Dimensional friction is threatening to cause an Incursion overlap.',
    stabilityWindowSec: 85,
    maxWindowSec: 85,
    recommendedHeroRole: 'mystic',
    requiredChronoStabilizerCost: {
      power: 180,
      scrap: 120,
      chronoCores: 1,
    },
    rewards: {
      chronoCores: 2,
      multiverseInfluence: 35,
      vibraniumCredits: 60,
    },
  },
  {
    id: 'rift_earth_10005_cerebro',
    title: 'Earth-10005 Cerebro Psionic Resonance Tear',
    realityCode: 'Earth-10005',
    severity: 'catastrophic',
    description: 'A temporal backlash from the Days of Future Past timeline has leaked a psionic shockwave from Cerebro, disorienting colony personnel and scrambling radio relays.',
    stabilityWindowSec: 75,
    maxWindowSec: 75,
    recommendedHeroRole: 'science',
    requiredChronoStabilizerCost: {
      power: 200,
      scrap: 140,
      chronoCores: 1,
    },
    rewards: {
      chronoCores: 3,
      multiverseInfluence: 55,
      vibraniumCredits: 90,
    },
  },
  {
    id: 'rift_earth_120703_oscorp',
    title: 'Earth-120703 Oscorp High-Voltage Bio-Resonance',
    realityCode: 'Earth-120703',
    severity: 'moderate',
    description: 'A lightning storm generated by Max Dillon\'s electric grid in New York is bleeding through a dimensional fault, overcharging power lines and threatening a catastrophic blowout.',
    stabilityWindowSec: 80,
    maxWindowSec: 80,
    recommendedHeroRole: 'engineering',
    requiredChronoStabilizerCost: {
      power: 190,
      scrap: 130,
      chronoCores: 1,
    },
    rewards: {
      chronoCores: 2,
      multiverseInfluence: 40,
      vibraniumCredits: 75,
    },
  },
  {
    id: 'rift_earth_26320_blood_tide',
    title: 'Earth-26320 Temple of Erebus Blood Fracture',
    realityCode: 'Earth-26320',
    severity: 'catastrophic',
    description: 'Dark occult vampire incantations from the House of Erebus are leaking necrotic temporal sludge into Sakaar\'s water and hydro-crops, threatening colony life support.',
    stabilityWindowSec: 70,
    maxWindowSec: 70,
    recommendedHeroRole: 'combat',
    requiredChronoStabilizerCost: {
      power: 210,
      scrap: 160,
      chronoCores: 1,
    },
    rewards: {
      chronoCores: 3,
      multiverseInfluence: 60,
      vibraniumCredits: 95,
    },
  },
  {
    id: 'rift_earth_1610b_collider',
    title: 'Earth-1610B Alchemax Super-Collider Glitch Fissure',
    realityCode: 'Earth-1610B',
    severity: 'cosmic_nexus',
    description: 'Kingpin\'s dimensional Super-Collider has induced localized cel-shaded glitching across Sakaar structures. Objects and terrain are flickering uncontrollably across realities.',
    stabilityWindowSec: 65,
    maxWindowSec: 65,
    recommendedHeroRole: 'science',
    requiredChronoStabilizerCost: {
      power: 240,
      scrap: 180,
      chronoCores: 2,
    },
    rewards: {
      chronoCores: 4,
      multiverseInfluence: 70,
      vibraniumCredits: 110,
    },
  },
  {
    id: 'rift_earth_838_cascade',
    title: 'Earth-838 Sub-Space Sentry Spill',
    realityCode: 'Earth-838',
    severity: 'catastrophic',
    description: 'A malfunctioning Illuminati teleportation gate is dumping rogue Ultron sentries and volatile vibranium alloy into Sakaar\'s power conduits.',
    stabilityWindowSec: 70,
    maxWindowSec: 70,
    recommendedHeroRole: 'engineering',
    requiredChronoStabilizerCost: {
      power: 220,
      scrap: 150,
      chronoCores: 1,
    },
    rewards: {
      chronoCores: 3,
      multiverseInfluence: 50,
      vibraniumCredits: 85,
    },
  },
  {
    id: 'rift_quantum_collapse',
    title: 'Quantum Realm Sub-Atomic Singularity',
    realityCode: 'Quantum Realm',
    severity: 'cosmic_nexus',
    description: 'A localized time vortex from Kang\'s defeated engine is rapidly unraveling local physics, bending colony gravity and destabilizing life support.',
    stabilityWindowSec: 60,
    maxWindowSec: 60,
    recommendedHeroRole: 'science',
    requiredChronoStabilizerCost: {
      power: 260,
      scrap: 200,
      chronoCores: 2,
    },
    rewards: {
      chronoCores: 4,
      multiverseInfluence: 75,
      vibraniumCredits: 120,
    },
  },
  {
    id: 'rift_earth_828_galactus_herald',
    title: 'Earth-828 Galactus Cosmic Tachyon Tear (First Steps & Doomsday)',
    realityCode: 'Earth-828',
    severity: 'cosmic_nexus',
    description: 'A retro-futuristic sub-space tear from Earth-828 is leaking cosmic herald radiation and tachyon echoes into Sakaar. Shalla-Bal\'s cosmic wake and Galactus\'s planetary approach threaten an Incursion collapse before Doctor Doom strikes in Doomsday.',
    stabilityWindowSec: 65,
    maxWindowSec: 65,
    recommendedHeroRole: 'science',
    requiredChronoStabilizerCost: {
      power: 250,
      scrap: 190,
      chronoCores: 2,
    },
    rewards: {
      chronoCores: 4,
      multiverseInfluence: 80,
      vibraniumCredits: 125,
    },
  },
];

