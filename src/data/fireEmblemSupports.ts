// Fire Emblem-style Support Conversations, Support Ranks & Pair-Up Bonds

import { MCUHero } from '../types';

export type SupportRank = 'NONE' | 'C' | 'B' | 'A' | 'S';

export interface SupportDialogueLine {
  speakerId: string;
  speakerName: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'determined' | 'shocked' | 'smirk' | 'serious';
}

export interface SupportTierData {
  rank: 'C' | 'B' | 'A' | 'S';
  title: string;
  requiredPoints: number;
  dialogue: SupportDialogueLine[];
  unlockedPerkDescription: string;
  statBonus: {
    powerBonus?: number;
    defenseBonus?: number;
    scrapBonus?: number;
    moraleBonus?: number;
    critChanceBonus?: number;
  };
}

export interface HeroPairSupportData {
  pairId: string;
  hero1Id: string;
  hero2Id: string;
  title: string;
  theme: string;
  currentPoints: number;
  currentRank: SupportRank;
  viewedRanks: SupportRank[];
  tiers: {
    C: SupportTierData;
    B: SupportTierData;
    A: SupportTierData;
    S: SupportTierData;
  };
}

export const INITIAL_SUPPORT_PAIRS: HeroPairSupportData[] = [
  // TVA: Agent Mobius & Loki - For All Time. Always.
  {
    pairId: 'mobius__loki',
    hero1Id: 'mobius',
    hero2Id: 'loki',
    title: 'For All Time. Always.',
    theme: 'A TVA chrono-analyst and the God of Stories weaving free will through the dying multiverse.',
    currentPoints: 50,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'Time Passes Differently Here',
        requiredPoints: 30,
        unlockedPerkDescription: '+20% Crisis Resolution Speed and +25 Arc Power generation.',
        statBonus: { powerBonus: 25, moraleBonus: 10 },
        dialogue: [
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'neutral',
            text: "You know, Loki... when you first fell through that orange door in the Gobi desert, I thought you were just another arrogant frost giant variant destined for the recycling bins.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'smirk',
            text: "And I thought you were a drone in a cheap polyester suit drinking chemical caffeinated slushies. Look at us now—stranded together on a cosmic garbage heap.",
          },
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'happy',
            text: "Hey, Sakaar has its charms. The junkyards remind me of the Null-Time Archives. And somewhere in these wormholes, I swear there's a 1993 Sea-Doo waiting for me.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'serious',
            text: "Focus, Mobius. The branches are trembling. If Doom collapses the weave, there won't be any lakes left to ride on.",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'The Burden of Free Will',
        requiredPoints: 80,
        unlockedPerkDescription: 'Chrono-Shield: Incursion threat decay slowed by 20% & +30 Colony Defense.',
        statBonus: { defenseBonus: 30, moraleBonus: 15 },
        dialogue: [
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'serious',
            text: "Do you ever regret it, Mobius? Learning that your entire life—your memories, your jet ski, your family on Earth—was stolen by He Who Remains?",
          },
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'neutral',
            text: "Sometimes. When the sirens go off, I think about what it felt like to not know. It was simpler when there was just one Sacred Timeline. But simple isn't real, Loki.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'determined',
            text: "No. It was a cage. I won't let Doom build another one. Every life in these branches deserves their story, no matter how chaotic.",
          },
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'happy',
            text: "That's why you're my favorite variant, pal. Even if you did push me off that Citadel balcony once.",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'Weaving the Golden Threads',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Support: +40 Power, +40 Defense, and +15% Critical Strike Chance during incursions.',
        statBonus: { powerBonus: 40, defenseBonus: 40, critChanceBonus: 15 },
        dialogue: [
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'shocked',
            text: "Loki... your hands. They're radiating green temporal magic. When did you start touching the raw loom fibers without burning up?",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'serious',
            text: "I know what kind of god I need to be. For you. For all of us. When the loom breaks, I can hold the branches. But you must anchor the colony, Mobius. Don't let Sakaar unravel.",
          },
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'determined',
            text: "You don't have to carry the whole multiverse alone on your shoulders, Loki. That's what the TVA is here for now. We protect the tree.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'happy',
            text: "Thank you, my friend. For all time. Always.",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Bond: The God of Stories & The Sacred Watcher',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Temporal Crest: Immune to time-slip crises, +50 Defense, and unlocks instant TemPad incursion resets.',
        statBonus: { powerBonus: 60, defenseBonus: 50, moraleBonus: 30, critChanceBonus: 25 },
        dialogue: [
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'happy',
            text: "Loki, look here. Casey found something in the restricted vault. A brass TVA chronometer engraved with the Yggdrasil branches. He told me it only activates when two souls resonate across infinite timelines.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'happy',
            text: "A TVA Soulbound Crest... from an archivist who didn't even know what a fish was. Poetic.",
          },
          {
            speakerId: 'mobius',
            speakerName: 'Agent Mobius',
            emotion: 'determined',
            text: "Take it. Wherever you are—whether you're sitting alone at the End of Time or walking through a burning incursion—this keeps us bound. Sakaar will stand, and the branches will live.",
          },
          {
            speakerId: 'loki',
            speakerName: 'Loki',
            emotion: 'determined',
            text: "Glorious purpose isn't about sitting on a throne, Mobius. It's about fighting alongside the ones you love. For all time. Always.",
          }
        ]
      }
    }
  },
  // 1. Tony Stark (Iron Man) & Bruce Banner (Hulk) - Science Bros
  {
    pairId: 'iron_man__hulk',
    hero1Id: 'iron_man',
    hero2Id: 'hulk',
    title: 'The Science Bros',
    theme: 'Gamma physics meets arc reactor nanotechnology on the dystopian sands of Sakaar.',
    currentPoints: 45,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'Calibrating the Smog Filters',
        requiredPoints: 30,
        unlockedPerkDescription: '+15 Arc Power output when both heroes are assigned to colony facilities.',
        statBonus: { powerBonus: 15 },
        dialogue: [
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'smirk',
            text: "Bruce! Put the gamma spectrometer down for ten seconds and look at this ambient smog reading. Sakaar's atmosphere is eighty percent sulfur and twenty percent bad life choices.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'serious',
            text: "Tony, I'm trying to stabilize the hydroponic bio-dome. The other guy gets agitated when our oxygen drops below eighty percent. You wouldn't like him when he's hypoxic.",
          },
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'happy',
            text: "Relax, big green. I rerouted twenty megawatts from the arc conduits into your bio-filters. We're the Science Bros, remember? We fix broken worlds before breakfast.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'happy',
            text: "Thanks, Tony. Just... make sure your conduits don't explode like Veronica did in Johannesburg.",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'Echoes of Ultron & Veronica',
        requiredPoints: 80,
        unlockedPerkDescription: 'Dual Strike unlocked in Arena: Tony assists Bruce with 20% bonus energy blast.',
        statBonus: { powerBonus: 25, critChanceBonus: 10 },
        dialogue: [
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'neutral',
            text: "Do you ever think about Ultron, Tony? Being stranded here on Sakaar, watching the Incursion rifts crack the sky... it feels like another nightmare we failed to calculate.",
          },
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'serious',
            text: "Every single day, Bruce. Every time I close my eyes I see the wormhole over New York. But that's why I built this outpost. Not out of arrogance, but because if the multiverse is collapsing, someone has to keep the lights on.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'determined',
            text: "Then let's make sure we do it right this time. Science and brute force, perfectly balanced.",
          },
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'smirk',
            text: "That's my secret, Cap—I mean, Doc. We're always innovating.",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'Antimatter Synchronization',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Guard: 35% chance to deflect fatal blows in Incursion combat & +20 Defense.',
        statBonus: { powerBonus: 40, defenseBonus: 20 },
        dialogue: [
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'happy',
            text: "Bruce! Look at this data readout. We successfully synthesized a clean gamma-arc resonance lattice. It neutralized three micro-incursions in sector four!",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'happy',
            text: "I didn't think blending Pym particles with Stark nanites would stabilize gamma radiation without a cascade meltdown.",
          },
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'serious',
            text: "It wouldn't have worked without your containment equations. I trust you, Bruce. With my life, with the colony, and with whatever multiverse madness comes knocking.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'determined',
            text: "I trust you too, Tony. As long as we're standing together, Sakaar won't fall.",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Crest: Science Sovereignty',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Resonance: Permanent +50 Max Power, +30 Defense, and guaranteed Dual Strikes.',
        statBonus: { powerBonus: 50, defenseBonus: 30, critChanceBonus: 25 },
        dialogue: [
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'determined',
            text: "Bruce, take this. It's an integrated Nanite-Gamma Resonance Core. It links my Mark 85 telemetry directly to your cerebral bio-monitors.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'shocked',
            text: "Tony... this is the highest grade vibranium-nanotech you've ever forged. You're giving this to me?",
          },
          {
            speakerId: 'iron_man',
            speakerName: 'Tony Stark',
            emotion: 'happy',
            text: "Consider it an oath. Earth had its Avengers. Sakaar has us. When Doctor Doom or whoever is causing these incursions steps onto this dirt, they're going to face Earth's sharpest mind and its strongest fist—synchronized forever.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Dr. Bruce Banner',
            emotion: 'happy',
            text: "To the end of time, Tony. Science Bros for eternity.",
          }
        ]
      }
    }
  },

  // 2. Wolverine (Logan) & Deadpool (Wade Wilson) - Maximum Effort Berserkers
  {
    pairId: 'wolverine__deadpool',
    hero1Id: 'wolverine',
    hero2Id: 'deadpool',
    title: 'Maximum Effort & Adamantium',
    theme: 'Healing factors, fourth-wall breaks, and relentless mutant carnage.',
    currentPoints: 50,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'Yellow Spandex in the Scrapyard',
        requiredPoints: 30,
        unlockedPerkDescription: '+15 Scrap scavenged after battles and expeditions.',
        statBonus: { scrapBonus: 15 },
        dialogue: [
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'happy',
            text: "Peanut! Oh look at you in your lovely comic-accurate yellow-and-blue suit! Are we in a Fire Emblem support conversation right now?! Look at these text boxes, Logan! So crisp! So tactile!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'serious',
            text: "Shut your damn mouth, Wade, before I pop my claws through your voicebox again. We have three scavenger skiffs incoming and twenty scrap turbines to fix.",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'smirk',
            text: "Aww, you're always so grumpy when you're doing chores on an alien garbage planet. Here, eat half of this Sakaar mutant chimichanga. It's mostly rat, but with great seasoning.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'neutral',
            text: "...Give me the damn wrap. And if you make one more video game joke, I'm throwing you into the wormhole.",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'The Void at the End of Time',
        requiredPoints: 80,
        unlockedPerkDescription: 'Dual Strike: Wade joins Logan with dual katana strikes (+25% critical damage).',
        statBonus: { critChanceBonus: 15, defenseBonus: 10 },
        dialogue: [
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'neutral',
            text: "Wade. You were in the Void. You saw timelines get pruned by the TVA. Is that what's happening to Sakaar?",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'serious',
            text: "Honestly, Wolvie? It's worse. The Void was just a cosmic landfill with Alioth playing vacuum cleaner. These Incursions... whole universes are slamming together like hot wheels cars in a toddlers' playroom.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'determined',
            text: "Then we don't let our timeline break. I failed my world once. I watched my X-Men die. I ain't letting it happen to this colony.",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'happy',
            text: "That's my boy! Cue the Madonna music, Logan! We're slicing through whatever multidimensional garbage comes our way!",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'Brothers in Adamantium',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Guard: 40% chance to block lethal damage for each other in Arena Duels.',
        statBonus: { defenseBonus: 25, critChanceBonus: 20 },
        dialogue: [
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'neutral',
            text: "You took three laser blasts to the chest pulling those scavengers out of the collapsed geothermal rift today, Wade. You didn't have to do that.",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'smirk',
            text: "Hey, what's a couple of scorched internal organs between friends? They grow back in fifteen minutes anyway. Besides, I gotta keep you looking heroic so Kevin Feige doesn't cancel us.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'happy',
            text: "You're an idiot, Wilson. But... you're a good man when it counts. Don't tell anyone I said that.",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'happy',
            text: "I'm literally tattooing that on my left butt cheek tonight! Best friends forever!",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Crest: Maximum Healing Resonance',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Pair-Up: +50 Colony Defense, +30% Critical Hit Chance, and fatal resurrection!',
        statBonus: { defenseBonus: 50, critChanceBonus: 30, scrapBonus: 25 },
        dialogue: [
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'happy',
            text: "Look at this, Logan! It's the sacred Fire Emblem S-Rank Ring! I forged it from melted down TVA batons and Adamantium shavings!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'shocked',
            text: "Wade... are you proposing battle-brotherhood in the middle of an Incursion crisis?",
          },
          {
            speakerId: 'deadpool',
            speakerName: 'Deadpool',
            emotion: 'determined',
            text: "Till you're ninety, Logan. You and me. The dynamic regenerative mutant powerhouse duo of the Marvel Multiverse. Nobody touches this colony while we breathe.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'happy',
            text: "...Till we're ninety, kid. Let's go tear some Incursion raiders to pieces.",
          }
        ]
      }
    }
  },

  // 3. Thor & Gladiator Hulk - Champions of the Contest
  {
    pairId: 'thor__hulk',
    hero1Id: 'thor',
    hero2Id: 'hulk',
    title: 'Champions of the Contest',
    theme: 'Thunder and green rage reunited on the sands of the Grandmaster.',
    currentPoints: 35,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'He is a Friend from Work!',
        requiredPoints: 30,
        unlockedPerkDescription: '+20 Arena Combat Power and +15 Morale.',
        statBonus: { moraleBonus: 15 },
        dialogue: [
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'happy',
            text: "Banner! Or should I say... my colossal emerald arena brother! Does this red dust not bring back glorious memories of the Grandmaster's roaring colosseum?",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'smirk',
            text: "Hulk remembers! Thor got smashed like tiny Asgardian ragdoll! Hulk champion!",
          },
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'shocked',
            text: "I won that fight! I had lightning coursing through my veins before the Grandmaster cheated with his obedience disc!",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'happy',
            text: "Thor make excuses. But Thor strong friend. Good to smash together again.",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'Asgard and Sakaar',
        requiredPoints: 80,
        unlockedPerkDescription: 'Dual Strike: Lightning strikes accompany Hulk smashes for +30% splash damage.',
        statBonus: { powerBonus: 20, defenseBonus: 15 },
        dialogue: [
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'serious',
            text: "I often think about what Asgard was, Bruce. A place where my people stood proud. Now, across every reality, Asgards burn and timelines shatter.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'neutral',
            text: "Banner said Asgard is not a place. It's people. Sakaar people need Thor. Need Hulk. We protect them.",
          },
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'happy',
            text: "You speak with the wisdom of Odin himself, old friend. Then let our thunder and fury be their shield!",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'determined',
            text: "Hulk roar, sky shake! Enemies run away!",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'God of Thunder and Green Goliath',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Guard: Blocks 40% damage from raid bosses & +25 Defense.',
        statBonus: { defenseBonus: 25, powerBonus: 30 },
        dialogue: [
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'determined',
            text: "In the battle against the Galactus heralds yesterday, you caught that falling asteroid with your bare hands, Bruce. You saved the entire residential dome.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'happy',
            text: "Thor summoned lightning storms. Kept skies clear. Hulk like fighting beside Thor. No one else can take Hulk's punches.",
          },
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'happy',
            text: "Haha! There is no truer bond in the cosmos than two champions who have traded hammer and fist!",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'happy',
            text: "Friend from work... best friend in universe.",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Crest: Crown of Champions',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Bond: +60 Defense, 2x Arena Trophy earnings, and permanent maximum morale.',
        statBonus: { defenseBonus: 60, moraleBonus: 30, powerBonus: 40 },
        dialogue: [
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'happy',
            text: "By the blood of Yggdrasil and the roaring sands of Sakaar! Bruce, I bestow upon us the Crest of the Multiverse Champions. Together, no cosmic entity or Doom sovereign can shake our resolve.",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'determined',
            text: "HULK AND THOR STRONGEST THERE IS! Incursion monsters come to Sakaar? We smash them to atoms!",
          },
          {
            speakerId: 'thor',
            speakerName: 'Thor',
            emotion: 'happy',
            text: "For Asgard! For Sakaar! And for the Avengers!",
          },
          {
            speakerId: 'hulk',
            speakerName: 'Hulk',
            emotion: 'happy',
            text: "HULK SMASH FOR SAKAAR!",
          }
        ]
      }
    }
  },

  // 4. Doctor Doom & Mister Fantastic - Multiversal Rivals
  {
    pairId: 'doctor_doom__mister_fantastic',
    hero1Id: 'doctor_doom',
    hero2Id: 'mister_fantastic',
    title: 'Architects of Battleworld',
    theme: 'Genius intellect, ancient rivalry, and the fate of the collapsing multiverse.',
    currentPoints: 20,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'The Arrogance of Richards',
        requiredPoints: 30,
        unlockedPerkDescription: '+20% Building Upgrade construction speed & +15 Science.',
        statBonus: { powerBonus: 15 },
        dialogue: [
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'serious',
            text: "Richards. Your crude dimensional stabilizers are leaking chronal radiation. Did they teach you nothing at Columbia University?",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'neutral',
            text: "Victor, those dampeners are the only thing preventing our timeline from colliding into Earth-828. You're using dark mystic wards where clean mathematical physics is required.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'smirk',
            text: "Mysticism and science are two branches of the same supreme tree, Reed. A tree you lack the sovereign vision to climb.",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'serious',
            text: "Perhaps. But while we debate philosophy, sixty thousand people in this colony need clean oxygen. Will you assist my calibrations or not?",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'The Impending Collision',
        requiredPoints: 80,
        unlockedPerkDescription: 'Doomsday Clock slowdown: Incursions tick 20% slower.',
        statBonus: { defenseBonus: 20 },
        dialogue: [
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'serious',
            text: "Victor... I've mapped the terminal boundary of the Incursion wave. Earth-616, Earth-828, Earth-10005... they are all collapsing toward a single singular point.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'serious',
            text: "Doom already knows this, Richards. I foresaw it years ago. While your Council of Reeds debated ethics, Doom prepared for the reconstruction of reality itself.",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'determined',
            text: "Then let us work together. For Sue. For Franklin and Valeria. For everyone.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'neutral',
            text: "For now, Richards. But remember: when the multiverse falls, only Doom possesses the will to save it.",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'Synthesis of Mind and Magic',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Strike: Antimatter bursts inflict 40% extra damage against Incursion bosses.',
        statBonus: { powerBonus: 35, defenseBonus: 25 },
        dialogue: [
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'neutral',
            text: "I must concede, Richards. Your antimatter containment matrix held against the Beyonder resonance pulse.",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'happy',
            text: "And your Latverian spell runes shielded the colony from psychic backlash. You truly are brilliant, Victor.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'smirk',
            text: "Of course Doom is brilliant. But you... you are the only intellect in this wretched cosmos worthy of standing beside me.",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'determined',
            text: "Let that intellect save the multiverse.",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Crest: Battleworld Nexus Accord',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Accord: Slows Doomsday Clock by 40% & unlocks cosmic synergy bonuses.',
        statBonus: { powerBonus: 60, defenseBonus: 50, critChanceBonus: 25 },
        dialogue: [
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'determined',
            text: "Victor. The Accord of Battleworld is drafted. Our minds, united across science and sorcery, will anchor Sakaar as the prime reality core.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'happy',
            text: "So be it, Richards. Together, we defy extinction itself. No god, no Beyonder, no cosmic tyrant shall undo what Doom and Richards have decreed!",
          },
          {
            speakerId: 'mister_fantastic',
            speakerName: 'Mister Fantastic',
            emotion: 'happy',
            text: "Let the multiverse tremble. The architects have united.",
          },
          {
            speakerId: 'doctor_doom',
            speakerName: 'Doctor Doom',
            emotion: 'determined',
            text: "All hail the sovereign dawn!",
          }
        ]
      }
    }
  },

  // 5. Spider-Man (Peter Parker) & Wolverine (Logan) - Friendly Neighborhood Berserkers
  {
    pairId: 'spider_man__wolverine',
    hero1Id: 'spider_man',
    hero2Id: 'wolverine',
    title: 'Queens & Weapon X',
    theme: 'Endless quips, pizza debates, and veteran mutant guidance.',
    currentPoints: 40,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: 'Web-Shooters and Claws',
        requiredPoints: 30,
        unlockedPerkDescription: '+15 Colony Defense and reduced raider ambush chances.',
        statBonus: { defenseBonus: 15 },
        dialogue: [
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'happy',
            text: "Mr. Logan! Hey, Mr. Logan! Quick question: if your claws are covered in unbreakable metal, do you ever use them to open cans of beans? Because these Sakaar ration cans have no pull-tabs!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'serious',
            text: "Kid, if you don't step back five paces, I'm gonna use these claws to trim that red mask of yours.",
          },
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'smirk',
            text: "Aww, come on, you love having a friendly neighborhood spider around. Look, I reinforced your scrap armor with bio-webbing. It's ten times stronger than steel!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'neutral',
            text: "...Hmph. Webbing is surprisingly tough. Don't let it go to your head, kid.",
          }
        ]
      },
      B: {
        rank: 'B',
        title: 'The Weight of Responsibility',
        requiredPoints: 80,
        unlockedPerkDescription: 'Dual Strike: Spider-Man web-pulls enemies directly into Wolverine claws (+25% damage).',
        statBonus: { critChanceBonus: 15, defenseBonus: 10 },
        dialogue: [
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'neutral',
            text: "Hey Logan... do you ever feel like no matter how many people you save, the universe just keeps finding new ways to punish everyone you love?",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'serious',
            text: "Every damn day of my two hundred years, Pete. The world is cruel, and it takes from the best of us. But you don't fight because you're guaranteed to win. You fight because if you don't, nobody else will.",
          },
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'determined',
            text: "With great power comes great responsibility.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'happy',
            text: "Damn right. You got heart, Peter. More heart than half the warriors I've ever known.",
          }
        ]
      },
      A: {
        rank: 'A',
        title: 'Sakaar Rooftop Watch',
        requiredPoints: 150,
        unlockedPerkDescription: 'Dual Guard: 40% chance for Wolverine to block damage aimed at Spider-Man.',
        statBonus: { defenseBonus: 25, critChanceBonus: 20 },
        dialogue: [
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'happy',
            text: "Look at the twin suns setting over the junk sea, Logan. Kind of pretty in a toxic, dystopian, Mad Max kind of way.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'neutral',
            text: "Reminds me of the Canadian Rockies. Except with more exploding scrap and fewer pine trees.",
          },
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'happy',
            text: "Thanks for watching my back today during that raider breach. I would've gotten skewered if you hadn't tackled that gladiator.",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'happy',
            text: "You're family now, Pete. Anyone messes with you, they gotta go through me first.",
          }
        ]
      },
      S: {
        rank: 'S',
        title: 'Soulbound Crest: The Spider & The Wolf',
        requiredPoints: 240,
        unlockedPerkDescription: 'S-Rank Crest: +40 Defense, +30% Incursion strike critical chance, and +25 Morale.',
        statBonus: { defenseBonus: 40, critChanceBonus: 30, moraleBonus: 25 },
        dialogue: [
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'happy',
            text: "Logan! Look, I made us matching tactical comm-bracelets! Yours has adamantium-woven spider-silk, and mine has your claw sigil!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'smirk',
            text: "You're a sentimental punk, Peter. But I'll wear it. If any multiversal incursion tries to take down this outpost, they'll learn why nobody messes with New York and Weapon X.",
          },
          {
            speakerId: 'spider_man',
            speakerName: 'Spider-Man',
            emotion: 'determined',
            text: "Together till the end of the line, Logan!",
          },
          {
            speakerId: 'wolverine',
            speakerName: 'Wolverine',
            emotion: 'happy',
            text: "Let's show 'em how we do it, kid.",
          }
        ]
      }
    }
  }
];

// Meal Menu for Fire Emblem Mess Hall / Cantina Banquet
export interface MessHallMeal {
  id: string;
  name: string;
  costFood: number;
  costCredits: number;
  costScrap: number;
  supportPointsGranted: number;
  description: string;
  reactionPrompt: string;
}

export const MESS_HALL_MEALS: MessHallMeal[] = [
  {
    id: 'hydro_stew',
    name: 'Hydro-Ration Nutrient Stew',
    costFood: 15,
    costCredits: 0,
    costScrap: 0,
    supportPointsGranted: 25,
    description: 'Steaming bio-dome algae stew seasoned with dehydrated scrap spices.',
    reactionPrompt: 'A humble meal, but warming in the cold Sakaar wasteland.',
  },
  {
    id: 'korg_roast',
    name: 'Roasted Korg-Rock Fruit Platter',
    costFood: 25,
    costCredits: 5,
    costScrap: 10,
    supportPointsGranted: 45,
    description: 'Crispy mineral-crusted tubers baked over geothermal vent coals.',
    reactionPrompt: 'Crunchy and surprisingly flavorful! Great for warrior bonding.',
  },
  {
    id: 'grandmaster_feast',
    name: 'Grandmaster VIP Holographic Banquet',
    costFood: 40,
    costCredits: 20,
    costScrap: 0,
    supportPointsGranted: 75,
    description: 'Extravagant intergalactic delicacies salvaged from the Grandmaster penthouse.',
    reactionPrompt: 'Pure multiversal luxury! Bonds heroes instantaneously.',
  }
];

/**
 * Returns a rich list of tailored Marvel/MCU duo titles for any two heroes,
 * prioritizing canon MCU nicknames and procedural thematic combinations.
 */
export function getSuggestedDuoTitles(hero1: MCUHero, hero2: MCUHero): string[] {
  const ids = [hero1.id, hero2.id].sort();
  const pairKey = `${ids[0]}__${ids[1]}`;

  const CANON_DUO_TITLES: Record<string, string[]> = {
    'spider_man__yelena_belova': [
      'Vests, Webs & Tactical Sarcasm',
      'The Red Room Web-Slingers',
      'Widow & Web Syndicate',
      'Queens & Budapest Infiltrators',
      'Maximum Wit Vanguard'
    ],
    'hulk__iron_man': [
      'The Science Bros',
      'Gamma & Arc Fusion',
      'Hulkbuster & Architect',
      'Avenger Brain Trust',
      'Laboratory Titans'
    ],
    'deadpool__wolverine': [
      'Maximum Effort & Adamantium',
      'The Merc & The Mutant',
      'Red & Yellow Frenzy',
      'Weapon X & Weapon XI',
      'Healing Factor Hellraisers'
    ],
    'hulk__thor': [
      'Champions of the Contest',
      'Revengers of the Arena',
      'Thunder & Gamma Smash',
      'Sakaar Gladiators',
      'Mightiest Avengers'
    ],
    'doctor_doom__mister_fantastic': [
      'Architects of Battleworld',
      'Council of Reed & Latveria',
      'Cosmic Intellect & Sovereign Monarch',
      'Rivals Across the Multiverse',
      'The Baxter-Doom Singularity'
    ],
    'spider_man__wolverine': [
      'Queens & Weapon X',
      'Claws & Cobwebs',
      'The Reluctant Mentors',
      'Astonishing Frontline',
      'Street Scrappers'
    ],
    'loki__thor': [
      'Princes of Asgard',
      'Brothers of Thunder & Mischief',
      'Heirs of Odin',
      'Sun & Shadows of Valhalla',
      'The Golden Realm Vanguard'
    ],
    'captain_america__winter_soldier': [
      'Till the End of the Line',
      'Howling Commandos Vanguard',
      'Star & Silver Arm',
      'Brooklyn Sentinels',
      'Brothers in Arms'
    ],
    'bucky_barnes__steve_rogers': [
      'Till the End of the Line',
      'Howling Commandos Vanguard',
      'Star & Silver Arm',
      'Brooklyn Sentinels'
    ],
    'doctor_strange__iron_man': [
      'Awesome Facial Hair Bros',
      'Science & Sorcery',
      'Bleeding Edge Mystics',
      'Illuminati Architects',
      'Masters of Tech & Magic'
    ],
    'iron_man__spider_man': [
      'Mentor & Protege',
      'Stark-Parker Industries',
      'Iron Spider Vanguard',
      'Billionaire & Neighborhood Hero',
      'The New York Legacy'
    ],
    'bucky_barnes__sam_wilson': [
      'Captains of America',
      'Wings & Vibranium',
      'Sentinel Flight Wing',
      'Defenders of Liberty',
      'Shield Brothers'
    ],
    'daredevil__spider_man': [
      'Street-Level Devils',
      'Queens & Hell’s Kitchen',
      'Acrobatic Vigilantes',
      'Red Masks of Manhattan',
      'Defenders of the Alleyways'
    ],
    'daredevil__she_hulk': [
      'Superhuman Legal Defense',
      'Emerald Law & Blind Justice',
      'Attorneys at Armor',
      'Courtroom Crusaders',
      'Justice & Jade'
    ],
    'groot__rocket': [
      'Tree & Cyber-Trash-Panda',
      'Guardians of the Galaxy',
      'Heavy Artillery & Flora Colossus',
      'Bounty Hunters of Nowhere',
      'We Are Groot'
    ],
    'nebula__rocket': [
      'Cybernetic Reclaimers',
      'Scrap & Blue Steel',
      'Daughters & Tinkers',
      'Endgame Survivors',
      'Outpost Engineers'
    ],
    'blade__moon_knight': [
      'Midnight Sons',
      'Fist of Khonshu & Daywalker',
      'Nocturnal Vengeance',
      'Moonlit Slayers',
      'Supernatural Exterminators'
    ],
    'scarlet_witch__vision': [
      'Synthezoid & Sorceress',
      'WandaVision Resonance',
      'Chaos & Mind Stone',
      'Philosophers of Grief',
      'A Love Outside Time'
    ],
    'doctor_doom__doctor_strange': [
      'Triumph & Torment',
      'Sorcerer Supreme & Latverian King',
      'Mystic Monarchs',
      'Astral Convergence',
      'Ars Magica & Science'
    ],
    'hulk__she_hulk': [
      'Gamma Cousins',
      'The Smash Family',
      'Emerald Behemoths',
      'Indestructible Titans',
      'Smash & Subpoena'
    ],
    'magneto__professor_x': [
      'Mutant Pioneers',
      'Dreamers & Sovereign',
      'Omega Telepathy & Magnetism',
      'The Krakoan Visionaries',
      'Brothers in Ideology'
    ],
    'ant_man__wasp': [
      'Quantum Realm Explorers',
      'Pym Particle Partners',
      'Subatomic Strike Team',
      'Microscopic Marvels',
      'The Ant & The Wasp'
    ],
    'captain_marvel__ms_marvel': [
      'Cosmic Admiration',
      'Higher, Further, Faster',
      'Jersey & Hala Resonance',
      'Hard-Light & Binary Nova',
      'The Marvels'
    ]
  };

  if (CANON_DUO_TITLES[pairKey]) {
    return CANON_DUO_TITLES[pairKey];
  }

  // Procedural Title Generation based on Roles & Archetypes
  const titles: string[] = [];
  const r1 = hero1.role;
  const r2 = hero2.role;

  if (r1 === 'science' && r2 === 'science') {
    titles.push('Quantum Think-Tank', 'Singularity Syndicate', 'The Multiverse Lab Union', 'Empirical Pioneers');
  } else if ((r1 === 'science' && r2 === 'engineering') || (r1 === 'engineering' && r2 === 'science')) {
    titles.push('Arc & Quantum Synthesis', 'Cyber-Physical Architects', 'High-Tech Vanguard', 'Innovation Initiative');
  } else if (r1 === 'combat' && r2 === 'combat') {
    titles.push('Apex Strikers of Sakaar', 'Twin Berserkers', 'Frontline Champions', 'Unstoppable Vanguard', 'The Arena Executioners');
  } else if ((r1 === 'combat' && r2 === 'science') || (r1 === 'science' && r2 === 'combat')) {
    titles.push('Brains & Brawn Protocol', 'Kinetic Theory Unit', 'Tactical Intellect Strike', 'The Calculated Assault');
  } else if ((r1 === 'combat' && r2 === 'engineering') || (r1 === 'engineering' && r2 === 'combat')) {
    titles.push('Armor & Arsenal', 'Siege Mechanics Vanguard', 'Ordinance & Steel', 'Weaponized Frontline');
  } else if (r1 === 'command' || r2 === 'command') {
    titles.push('Commanding Frontline', 'Sovereign Coalition', 'Strategic Vanguard', 'Avengers Assemble Protocol');
  } else if (r1 === 'mystic' || r2 === 'mystic') {
    titles.push('Mystic Sanctum Alliance', 'Arcane Synergy Accord', 'Sorcerous Vanguard', 'Multiverse Nexus Guardians');
  } else {
    titles.push('Champions of the Outpost', 'Multiverse Counter-Force', 'Sakaar Reclamation Unit', 'Dimensional Protectors');
  }

  // Add individual hero name combos
  titles.push(
    `${hero1.heroName} & ${hero2.heroName} Accord`,
    `The ${hero1.heroName}-${hero2.heroName} Alliance`,
    `Vanguard: ${hero1.heroName} & ${hero2.heroName}`,
    `Duo of Destiny: ${hero1.heroName} & ${hero2.heroName}`
  );

  return titles;
}

/**
 * Returns an automatic primary duo title for two heroes.
 */
export function generateAutomaticDuoTitle(hero1: MCUHero, hero2: MCUHero, seedIndex: number = 0): string {
  const suggestions = getSuggestedDuoTitles(hero1, hero2);
  const safeIndex = Math.abs(seedIndex) % suggestions.length;
  return suggestions[safeIndex] || `${hero1.heroName} & ${hero2.heroName} Vanguard`;
}

export function generateDynamicSupportPair(
  hero1: MCUHero, 
  hero2: MCUHero, 
  customTitle?: string
): HeroPairSupportData {
  const pairId = `${hero1.id}__${hero2.id}`;
  const title = (customTitle && customTitle.trim()) 
    ? customTitle.trim() 
    : generateAutomaticDuoTitle(hero1, hero2);
  const theme = `A forged bond between ${hero1.heroName} and ${hero2.heroName} amidst the red sands and multiversal rifts of Sakaar.`;

  return {
    pairId,
    hero1Id: hero1.id,
    hero2Id: hero2.id,
    title,
    theme,
    currentPoints: 0,
    currentRank: 'NONE',
    viewedRanks: [],
    tiers: {
      C: {
        rank: 'C',
        title: `Wasteland Introductions`,
        requiredPoints: 30,
        unlockedPerkDescription: `+10 Colony Defense and +10% facility efficiency when stationed in adjacent sectors.`,
        statBonus: { defenseBonus: 10 },
        dialogue: [
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'neutral',
            text: `Greetings, ${hero2.heroName}. I've noticed you maintaining our defense perimeter. Sakaar's junk storms are relentless today.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'determined',
            text: `They are indeed, ${hero1.heroName}. But as long as our generators hold and we watch each other's blind spots, we can keep the scavengers at bay.`,
          },
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'happy',
            text: `Well spoken. Let's coordinate our sector routines. It's an honor fighting beside you.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'happy',
            text: `The honor is mine. To the survival of our colony!`,
          }
        ]
      },
      B: {
        rank: 'B',
        title: `Shared Conviction`,
        requiredPoints: 80,
        unlockedPerkDescription: `Dual Strike unlocked: ${hero2.heroName} has a 25% chance to assist ${hero1.heroName} with bonus strike damage.`,
        statBonus: { critChanceBonus: 15, defenseBonus: 15 },
        dialogue: [
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'serious',
            text: `${hero1.heroName}, you've been working through the night again. Even the strongest champions need rest before the Incursion alarms sound.`,
          },
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'neutral',
            text: `I was thinking about home, ${hero2.heroName}. Everything we left behind across our respective timelines. If this universe collapses, what was it all for?`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'determined',
            text: `It was for the people we swore to protect. Our past may be distant, but our future is right here on Sakaar. I've got your back, always.`,
          },
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'happy',
            text: `Thank you, my friend. Having you at my side makes this wasteland feel a lot less lonely.`,
          }
        ]
      },
      A: {
        rank: 'A',
        title: `Unbreakable Trust`,
        requiredPoints: 150,
        unlockedPerkDescription: `Dual Guard unlocked: 40% chance to leap in and deflect fatal damage aimed at your partner.`,
        statBonus: { defenseBonus: 30, critChanceBonus: 20 },
        dialogue: [
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'determined',
            text: `During that last dimensional anomaly, ${hero2.heroName}, you risked your life to seal the sector blast doors. That was incredible courage.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'happy',
            text: `I learned it from watching you, ${hero1.heroName}. We have forged something rare here—a true battle camaraderie that transcends alternate realities.`,
          },
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'happy',
            text: `Whatever the multiverse throws at us—Doom's legion, temporal rifts, or cosmic gods—we will face it as one.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'determined',
            text: `United as one! Nothing breaks our shield!`,
          }
        ]
      },
      S: {
        rank: 'S',
        title: `Soulbound Alliance: Multiverse Paragon Duo`,
        requiredPoints: 240,
        unlockedPerkDescription: `S-Rank Soulbound Crest: +50 Colony Defense, +30% Critical Strike Chance, and guaranteed Dual Strikes!`,
        statBonus: { defenseBonus: 50, critChanceBonus: 30, moraleBonus: 25 },
        dialogue: [
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'happy',
            text: `${hero2.heroName}, take this. It's a Soulbound Multiverse Crest, attuned to our shared battle signatures and bio-energies.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'shocked',
            text: `An S-Rank Crest! ${hero1.heroName}... this symbolizes an eternal bond across time and space.`,
          },
          {
            speakerId: hero1.id,
            speakerName: hero1.heroName,
            emotion: 'determined',
            text: `There is no one in this or any other reality I would rather fight beside. As long as Sakaar stands, our alliance is unbreakable.`,
          },
          {
            speakerId: hero2.id,
            speakerName: hero2.heroName,
            emotion: 'happy',
            text: `Bound by honor, blood, and destiny. Together until the end of time!`,
          }
        ]
      }
    }
  };
}

