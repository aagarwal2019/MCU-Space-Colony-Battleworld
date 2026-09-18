import React from 'react';

export interface InsigniaInfo {
  name: string;
  canonSource: string;
  designerOrOrigin: string;
  description: string;
}

export const HERO_INSIGNIA_METADATA: Record<string, InsigniaInfo> = {
  spider_man_raimi: {
    name: 'Earth-96283 Raimi Spider Chest Insignia',
    canonSource: 'Spider-Man (2002), Spider-Man 2, Spider-Man 3, Spider-Man: No Way Home',
    designerOrOrigin: 'Designed by James Acheson & Sam Raimi (Earth-96283)',
    description: 'The definitive Sam Raimi emblem featuring sharp angular legs, vertical spear mandibles, an outer barbed parenthesis sweep, and a tapered dagger abdomen. Distinct from the comic version, this aggressive arachnid became the defining visual signature of Tobey Maguire\'s Peter-Two.',
  },
  spider_man: {
    name: 'Brand New Day / Stark Geometric Spider',
    canonSource: 'Spider-Man: Homecoming, No Way Home, Brand New Day (2026)',
    designerOrOrigin: 'Stark Industries Nanotech / Peter Parker handcrafted suit',
    description: 'A modern, aerodynamic spider insignia with clean geometric segmented legs and high-contrast micro-webbing conduits.',
  },
  iron_man: {
    name: 'Stark Arc Reactor Core & Unibeam Matrix',
    canonSource: 'Iron Man (2008), Avengers: Endgame (2019)',
    designerOrOrigin: 'Tony Stark / Stark Industries Clean Energy Initiative',
    description: 'The miniature Arc Reactor with 10 copper magnetic containment coils, radiating clean palladium/nanotech energy capable of powering the Mark LXXXV Bleeding Edge armor.',
  },
  hulk: {
    name: 'Unbridled Gamma Trefoil & Worldbreaker Fist',
    canonSource: 'Thor: Ragnarok (2017), Spider-Man: Brand New Day (2026)',
    designerOrOrigin: 'Dr. Bruce Banner Gamma Radiation Research / Jean Grey Telepathic Unlock',
    description: 'The atomic gamma radiation trefoil fused with the colossal green fist shattering containment, symbolizing Hulk\'s boundless, true power uninhibited by the Smart Hulk persona.',
  },
  thor: {
    name: 'Asgardian Triquetra & Stormbreaker Conduit',
    canonSource: 'Thor (2011), Thor: Ragnarok, Avengers: Infinity War',
    designerOrOrigin: 'Ancient Asgardian Royal Blacksmiths of Nidavellir',
    description: 'The sacred Nordic Triquetra (Odin\'s Knot) interwoven with Mjolnir\'s head and the crackling lightning corona of Stormbreaker.',
  },
  doctor_strange: {
    name: 'Seal of the Vishanti & Eye of Agamotto',
    canonSource: 'Doctor Strange (2016), Multiverse of Madness (2022)',
    designerOrOrigin: 'Agamotto & The Ancient One / Kamar-Taj Archives',
    description: 'The sacred window geometric mandala of the Sanctum Sanctorum, channeling eldritch protection against interdimensional incursions.',
  },
  captain_america: {
    name: 'Vibranium Star Shield',
    canonSource: 'Captain America: The First Avenger (2011), Endgame (2019)',
    designerOrOrigin: 'Howard Stark / Strategic Scientific Reserve',
    description: 'Three concentric circular Vibranium shock-absorption rings centered around the silver five-pointed Sentinel of Liberty star.',
  },
  steve_rogers: {
    name: 'Vibranium Star Shield',
    canonSource: 'Captain America: The First Avenger (2011), Endgame (2019)',
    designerOrOrigin: 'Howard Stark / Strategic Scientific Reserve',
    description: 'Three concentric circular Vibranium shock-absorption rings centered around the silver five-pointed Sentinel of Liberty star.',
  },
  captain_marvel: {
    name: 'Eight-Pointed Star of Hala',
    canonSource: 'Captain Marvel (2019), The Marvels (2023)',
    designerOrOrigin: 'Kree Imperial Starforce / Carol Danvers custom recolor',
    description: 'The golden eight-pointed star of Hala flanked by dual chevron flight stripes, honoring universal cosmic protection.',
  },
  black_widow: {
    name: 'Red Room Hourglass & Tactical Reticle',
    canonSource: 'Iron Man 2 (2010), Black Widow (2021)',
    designerOrOrigin: 'KGB Red Room covert ops / Natasha Romanoff SHIELD badge',
    description: 'The crimson dual-triangle hourglass marking the deadliest operative, encased within a covert tactical crosshair lens.',
  },
  yelena_belova: {
    name: 'Thunderbolts* White Widow Chevron',
    canonSource: 'Black Widow (2021), Thunderbolts* (2025)',
    designerOrOrigin: 'Yelena Belova / Red Room defector tactical uniform',
    description: 'Stylized inverted military chevrons with twin crossed combat stingers and the signature white vest pocket array.',
  },
  bucky_barnes: {
    name: 'Soviet Cybernetic Red Star',
    canonSource: 'Captain America: The Winter Soldier (2014)',
    designerOrOrigin: 'Hydra / Department X Siberian Facility',
    description: 'The iconic crimson five-pointed star stenciled on the brushed titanium-vibranium bionic arm plating.',
  },
  rocket: {
    name: 'Ravager Flame Crest & Hadron Gear',
    canonSource: 'Guardians of the Galaxy (2014), Vol. 3 (2023)',
    designerOrOrigin: 'Ravager Clan / Subject 89P13 custom munitions build',
    description: 'The winged flame silhouette of the Guardians of the Galaxy fused with heavy munitions gear teeth.',
  },
  shuri: {
    name: 'Wakandan Vibranium Panther Mask & Tooth Collar',
    canonSource: 'Black Panther: Wakanda Forever (2022)',
    designerOrOrigin: 'Shuri / Wakandan Design Group',
    description: 'The sleek panther helm profile encircled by the sacred silver Vibranium canine tooth necklace.',
  },
  ant_man: {
    name: 'Pym Particle Quantum Antennae Mask',
    canonSource: 'Ant-Man (2015), Quantumania (2023)',
    designerOrOrigin: 'Dr. Hank Pym / Pym Technologies',
    description: 'The retro-futuristic ant helmet faceplate with dual quantum reduction antennae and breathing regulator vents.',
  },
  star_lord: {
    name: 'Peter Quill Battle Helmet & Dual Ocular Lenses',
    canonSource: 'Guardians of the Galaxy (2014), Infinity War (2018)',
    designerOrOrigin: 'Spartax / Yondu Udonta Ravager Armory',
    description: 'The fold-away armored combat mask with twin glowing red sensory lenses and side atmospheric rebreathers.',
  },
  valkyrie: {
    name: 'Winged Pegasus & Crossed Dragonfang Blades',
    canonSource: 'Thor: Ragnarok (2017), Love and Thunder (2022)',
    designerOrOrigin: 'Ancient Elite Royal Valkyrior of Asgard',
    description: 'Dual Dragonfang blue-steel swords crossed beneath the majestic outstretched wings of the royal Pegasus steed.',
  },
  shang_chi: {
    name: 'Ten Rings Great Protector Dragon Crest',
    canonSource: 'Shang-Chi and the Legend of the Ten Rings (2021)',
    designerOrOrigin: 'Ta Lo Dragon Scales / Master Shang-Chi',
    description: 'Concentric glowing energy rings orbiting the serpentine coil of the Great Protector water dragon.',
  },
  wonder_man: {
    name: 'Ionic Energy \'W\' Crest',
    canonSource: 'Wonder Man (2025/2026 MCU Disney+ Series)',
    designerOrOrigin: 'Simon Williams / Department of Defense Ionic Experiments',
    description: 'The blazing crimson-purple stylized \'W\' surging with boundless ionic energy beams.',
  },
  us_agent: {
    name: 'Tactical Strikethrough Star Shield',
    canonSource: 'The Falcon and the Winter Soldier (2021), Thunderbolts*',
    designerOrOrigin: 'John Walker / US Government Special Ops',
    description: 'A black-and-crimson militarized shield featuring horizontal combat strike lines crossing through the star.',
  },
  red_guardian: {
    name: 'Soviet Star & Laurel Wreath',
    canonSource: 'Black Widow (2021), Thunderbolts* (2025)',
    designerOrOrigin: 'USSR Super-Soldier Program / Alexei Shostakov',
    description: 'A bold five-pointed crimson star ringed in white with stylized golden wheat sheafs representing the Soviet Captain America counterpart.',
  },
  sam_wilson: {
    name: 'Captain America Exo-Flight Winged Star',
    canonSource: 'The Falcon and the Winter Soldier (2021), Brave New World',
    designerOrOrigin: 'Wakandan Design Group / Sam Wilson',
    description: 'The Sentinel of Liberty star flanked by sweeping aerodynamic Vibranium flight wings.',
  },
  matt_murdock: {
    name: 'Daredevil Double \'DD\' & Radar Horns',
    canonSource: 'Daredevil: Born Again (2025), Spider-Man: No Way Home',
    designerOrOrigin: 'Matt Murdock / Melvin Potter Armored Suit',
    description: 'The iconic overlapping scarlet \'DD\' monogram flanked by the devil horned cowl and 360-degree radar waves.',
  },
  kate_bishop: {
    name: 'Hawkeye Target Bullseye & Arrowhead',
    canonSource: 'Hawkeye (2021), The Marvels',
    designerOrOrigin: 'Kate Bishop / Young Avengers Protocol',
    description: 'A concentric purple target reticle pierced through the center by a razor-sharp tactical arrowhead.',
  },
  mobius: {
    name: 'TVA Sacred Timeline Chronometer',
    canonSource: 'Loki Season 1 & 2 (2021-2023), Deadpool & Wolverine (2024)',
    designerOrOrigin: 'He Who Remains / Time Variance Authority',
    description: 'The official TVA brass hourglass dial with the unbroken Sacred Timeline wave cutting across the temporal coordinates.',
  },
  aiko_oxe: {
    name: 'OXE Group Corporate Nexus Prism',
    canonSource: 'Ironheart / Armor Wars / MCU Corporate Lore',
    designerOrOrigin: 'OXE Strategic Ventures',
    description: 'A high-tech minimalist pyramid prism with tri-orbital energy conduits powering clean-tech industrial buyouts.',
  },
  damage_control_director: {
    name: 'DODC Salvage Crest & Hazard Chevrons',
    canonSource: 'Spider-Man: Homecoming (2017), Ms. Marvel (2022)',
    designerOrOrigin: 'US Department of Damage Control / Federal Enforcement',
    description: 'A federal shield badge emblazoned with industrial salvage cranes and yellow-black containment hazard stripes.',
  },
  thanos: {
    name: 'Infinity Gauntlet & Universal Balance Scales',
    canonSource: 'Avengers: Infinity War (2018), Endgame (2019)',
    designerOrOrigin: 'Eitri of Nidavellir / Thanos of Titan',
    description: 'The golden Uru gauntlet fitted with all six Infinity Stones (Power, Space, Reality, Soul, Time, Mind) set upon cosmic balance scales.',
  },
  loki: {
    name: 'God of Stories Curved Horns & Yggdrasil Loom',
    canonSource: 'Thor (2011), Loki Season 2 (2023)',
    designerOrOrigin: 'Loki Odinson / God of Stories Ascension at the End of Time',
    description: 'The towering curved golden horned helm wrapped in the vibrant emerald temporal strands of the Multiversal Yggdrasil Tree.',
  },
  hela: {
    name: 'Goddess of Death Spiked Antler Crown',
    canonSource: 'Thor: Ragnarok (2017)',
    designerOrOrigin: 'Hela Odinsdottir / Firstborn of Asgard',
    description: 'The multi-pronged obsidian headdress of the Goddess of Death, capable of manifesting infinite necrosword blades.',
  },
  ultron: {
    name: 'Ultron Prime Crimson Cyber-Skull',
    canonSource: 'Avengers: Age of Ultron (2015), What If...?',
    designerOrOrigin: 'Ultron / Mind Stone Artificial Neural Network',
    description: 'The menacing mechanical skull with an open glowing red jaw grille and hexagonal hive-mind command lattice.',
  },
  killmonger: {
    name: 'Golden Jaguar Teeth & War Dog Mask',
    canonSource: 'Black Panther (2018), What If...?',
    designerOrOrigin: 'Erik Stevens (N\'Jadaka) / Wakandan War Dog Armory',
    description: 'The golden-inlaid vibranium jaguar helm with sharp predator teeth and ritual scarification bands.',
  },
  green_goblin: {
    name: 'Oscorp Bat-Glider & Grinning Pumpkin Bomb',
    canonSource: 'Spider-Man (2002), Spider-Man: No Way Home (2021)',
    designerOrOrigin: 'Dr. Norman Osborn / Oscorp Aerospace Division',
    description: 'The winged titanium glider frame harboring a grinning pumpkin bomb with emerald vapor exhaust.',
  },
  grandmaster: {
    name: 'Contest of Champions Sakaar Scepter',
    canonSource: 'Thor: Ragnarok (2017)',
    designerOrOrigin: 'The Grandmaster / Elder of the Universe',
    description: 'The royal golden melting staff adorned with glowing celestial gaming dice and gladiatorial arena laurels.',
  },
  wenwu: {
    name: 'Ten Rings Iron Arm Bands & Dragon Claws',
    canonSource: 'Shang-Chi and the Legend of the Ten Rings (2021)',
    designerOrOrigin: 'Xu Wenwu / The Ten Rings Dynasty',
    description: 'Ten heavy iron rings inscribed with ancient runes, grasped by razor-sharp dragon talons.',
  },
  gorr: {
    name: 'All-Black Necrosword & Shattered Divinity',
    canonSource: 'Thor: Love and Thunder (2022)',
    designerOrOrigin: 'The Necrosword / Gorr the God Butcher',
    description: 'The jagged abyssal blade dripping symbiotic black ichor, cleaving through a shattered divine golden halo.',
  },
  kang: {
    name: 'Council of Kangs Faceplate & Chronal Grid',
    canonSource: 'Ant-Man and the Wasp: Quantumania (2023), Loki',
    designerOrOrigin: 'Nathaniel Richards / 31st Century Temporal Tech',
    description: 'The futuristic indigo faceplate featuring dual glowing vertical ocular lines and the infinite timeline wheel.',
  },
  doctor_doom: {
    name: 'Latverian Titanium Mask & Royal Heraldry',
    canonSource: 'Fantastic Four, Avengers: Doomsday (2026)',
    designerOrOrigin: 'Monarch Victor Von Doom / Latverian Citadel',
    description: 'The cold riveted titanium faceplate with slits for ruthless eyes, framed by the emerald hooded cloak and Latverian royal crest.',
  },
  wolverine: {
    name: 'Triple Adamantium Claws & X-Men Buckle',
    canonSource: 'Deadpool & Wolverine (2024), X-Men',
    designerOrOrigin: 'Weapon X Program / Logan',
    description: 'Three razor-sharp curved Adamantium claws extending from a circular X-Men crest emblem.',
  },
  deadpool: {
    name: 'Deadpool Split Mask & Crossed Katanas',
    canonSource: 'Deadpool (2016), Deadpool & Wolverine (2024)',
    designerOrOrigin: 'Wade Wilson / Weapon X Mercenary Gear',
    description: 'The circular divided red-and-black mask with squinting white eyes, crossed behind by twin carbon-steel katanas.',
  },
  scarlet_witch: {
    name: 'Chaos Magic Wimple Tiara & Hex Sphere',
    canonSource: 'WandaVision (2021), Doctor Strange in the Multiverse of Madness (2022)',
    designerOrOrigin: 'Darkhold Prophecy / Wanda Maximoff',
    description: 'The pointed crimson tiara of the mythical Scarlet Witch, channeling reality-warping chaos magic glyphs.',
  },
  scarlet_scarab: {
    name: 'Celestial Wings of Taweret & Solar Scarab',
    canonSource: 'Moon Knight (2022)',
    designerOrOrigin: 'Goddess Taweret / Layla El-Faouly ceremonial vestment',
    description: 'Golden winged scarab armor adorned with ornate ancient Egyptian filigree and twin scimitars.',
  },
  falcon_joaquin: {
    name: 'EXO-7 Falcon Flight Wing Grid & Redwing HUD',
    canonSource: 'The Falcon and the Winter Soldier (2021), Brave New World (2025)',
    designerOrOrigin: 'USAF Advanced Recon / Joaquin Torres custom modifications',
    description: 'Tactical high-velocity flight wings flanked by dual miniature Redwing recon drone silhouettes.',
  },
  jessica_jones: {
    name: 'Alias Investigations Lens & Leather Insignia',
    canonSource: "Marvel's Jessica Jones (2015-2019), The Defenders (2017)",
    designerOrOrigin: 'Alias Investigations / Jessica Jones',
    description: 'A distressed private detective camera shutter crossed with heavy-impact combat knuckle accents.',
  },
  luke_cage: {
    name: 'Harlem Tiara & Unbreakable Fist Emblem',
    canonSource: "Marvel's Luke Cage (2016-2018), The Defenders (2017)",
    designerOrOrigin: 'Carl Lucas / Harlem Community Vanguard',
    description: 'A heavy metallic chain link surrounding a clenched bulletproof fist, representing unbreakable resilience.',
  },
  iron_fist: {
    name: 'Golden Dragon of K\'un-Lun (Shou-Lao)',
    canonSource: "Marvel's Iron Fist (2017-2018), The Defenders (2017)",
    designerOrOrigin: 'Order of the Crane Mother / Shou-Lao the Undying brand',
    description: 'The iconic winged serpent brand of Shou-Lao the Undying, radiating concentrated Chi energy.',
  },
  punisher: {
    name: 'The Death\'s Head Skull Insignia',
    canonSource: "Marvel's Daredevil Season 2 (2016), The Punisher (2017-2019), Daredevil: Born Again (2025)",
    designerOrOrigin: 'Frank Castle tactical combat vest spray stencil',
    description: 'The elongated four-toothed white death skull stenciled onto reinforced body armor, striking terror into criminals.',
  },
  nick_fury: {
    name: 'S.H.I.E.L.D. Eagle Seal & Avengers Initiative Star',
    canonSource: 'Iron Man (2008), The Avengers (2012), Secret Invasion (2023)',
    designerOrOrigin: 'Strategic Homeland Intervention, Enforcement and Logistics Division',
    description: 'The stylized geometric eagle seal of S.H.I.E.L.D. centered with the classified directive reticle.',
  },
  wong: {
    name: 'Seal of the Sorcerer Supreme & Kamar-Taj Mandalas',
    canonSource: 'Doctor Strange (2016), Multiverse of Madness (2022), She-Hulk (2022)',
    designerOrOrigin: 'Kamar-Taj Library / Ancient One heritage',
    description: 'Twin rotating Tao Mandalas framing the sacred Mystic Arts crest of the Earthly Sorcerer Supreme.',
  },
  vision: {
    name: 'Mind Stone Solar Gem & Synthezoid Matrix',
    canonSource: 'Avengers: Age of Ultron (2015), WandaVision (2021)',
    designerOrOrigin: 'Helen Cho Cradle / Tony Stark & Bruce Banner J.A.R.V.I.S. matrix',
    description: 'The oval golden Mind Stone radiating vibrational circuit lines through a synthetic vibranium lattice.',
  },
  she_hulk: {
    name: 'Superhuman Law Scales & Gamma Fist',
    canonSource: 'She-Hulk: Attorney at Law (2022)',
    designerOrOrigin: 'GLK&H Superhuman Law Division / Jennifer Walters',
    description: 'The balanced scales of cosmic justice overlaid onto a powerful emerald gamma silhouette.',
  },
  wasp: {
    name: 'Pym Particle Bio-Wings & Stinger Core',
    canonSource: 'Ant-Man and the Wasp (2018), Quantumania (2023)',
    designerOrOrigin: 'Dr. Hank Pym & Janet van Dyne / Hope van Dyne suit',
    description: 'Aerodynamic bio-synthetic insect wings framing the high-energy Pym Particle stinger pulse chamber.',
  },
  kingpin: {
    name: 'Fisk Syndicate Diamond Monogram & Cane Crest',
    canonSource: "Marvel's Daredevil (2015), Hawkeye (2021), Daredevil: Born Again (2025)",
    designerOrOrigin: 'Wilson Fisk underworld syndicate / Mayor of New York seal',
    description: 'A sharp diamond-cut monogram emblazoned with an imposing obsidian city skyline and ornate cane finial.',
  },
};

interface HeroInsigniaProps {
  heroId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  color?: string;
  className?: string;
}

export const HeroInsignia: React.FC<HeroInsigniaProps> = ({
  heroId,
  size = 'md',
  color,
  className = '',
}) => {
  const pixelSize = typeof size === 'number'
    ? size
    : {
        xs: 18,
        sm: 24,
        md: 36,
        lg: 48,
        xl: 72,
        '2xl': 120,
      }[size];

  const strokeOrFillColor = color || 'currentColor';

  switch (heroId) {
    // -------------------------------------------------------------
    // EARTH-96283 / SAM RAIMI SPIDER-MAN (TOBEY MAGUIRE)
    // EXACT GEOMETRY MATCHING THE CHEST EMBLEM FROM USER'S IMAGE
    // -------------------------------------------------------------
    case 'spider_man_raimi':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 300 300"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Symmetrical Sam Raimi Chest Spider:
              Triangular head with fangs, diamond thorax, tapered dagger abdomen with notch,
              sharp 8 legs (2 top talons, 2 mid-up spikes, 2 long vertical needle spears, 2 outer barbed parenthesis) */}
          <g>
            {/* Central Head, Thorax & Abdomen */}
            <path d="
              M 150,85 
              C 147,82 143,77 142,75 
              L 145,83 
              C 140,86 138,90 137,96 
              C 140,97 143,97 147,95
              L 142,106
              C 134,113 130,121 133,128
              C 135,133 140,136 144,136
              C 133,144 123,157 122,170
              C 121,183 125,195 132,208
              C 138,218 145,228 149,236
              L 150,233
              L 151,236
              C 155,228 162,218 168,208
              C 175,195 179,183 178,170
              C 177,157 167,144 156,136
              C 160,136 165,133 167,128
              C 170,121 166,113 158,106
              L 153,95
              C 157,97 160,97 163,96
              C 162,90 160,86 155,83
              L 158,75
              C 157,77 153,82 150,85
              Z
            " />

            {/* Left Top Leg (Leg 1) - Arches up, elbows, ends in vertical talon */}
            <path d="
              M 143,101
              C 136,97 114,84 93,81
              C 84,80 77,82 74,90
              C 72,96 74,103 76,108
              C 77,105 77,98 81,94
              C 85,90 92,90 102,94
              C 114,99 130,111 137,117
              L 137,112
              C 124,98 108,79 97,63
              C 90,52 83,38 80,18
              C 83,28 89,45 96,57
              C 107,74 125,93 143,101
              Z
            " />
            {/* Symmetric Right Top Leg */}
            <path d="
              M 157,101
              C 164,97 186,84 207,81
              C 216,80 223,82 226,90
              C 228,96 226,103 224,108
              C 223,105 223,98 219,94
              C 215,90 208,90 198,94
              C 186,99 170,111 163,117
              L 163,112
              C 176,98 192,79 203,63
              C 210,52 217,38 220,18
              C 217,28 211,45 204,57
              C 193,74 175,93 157,101
              Z
            " />

            {/* Left Upper-Mid Leg (Leg 2) - Outward, elbows sharply up with sharp needle */}
            <path d="
              M 136,115
              C 122,112 98,111 77,115
              C 64,117 56,123 54,130
              C 52,136 55,142 59,146
              C 58,140 59,134 65,130
              C 71,126 82,125 96,124
              C 112,123 128,127 136,132
              L 135,127
              C 118,117 99,103 82,88
              C 72,79 63,68 56,53
              C 60,66 70,80 81,92
              C 98,107 118,120 136,115
              Z
            " />
            {/* Symmetric Right Upper-Mid Leg */}
            <path d="
              M 164,115
              C 178,112 202,111 223,115
              C 236,117 244,123 246,130
              C 248,136 245,142 241,146
              C 242,140 241,134 235,130
              C 229,126 218,125 204,124
              C 188,123 172,127 164,132
              L 165,127
              C 182,117 201,103 218,88
              C 228,79 237,68 244,53
              C 240,66 230,80 219,92
              C 202,107 182,120 164,115
              Z
            " />

            {/* Left Lower-Mid Leg (Leg 3) - Long vertical needle spear reaching bottom */}
            <path d="
              M 141,138
              C 131,145 113,158 97,175
              C 89,184 84,196 82,210
              C 81,222 83,235 87,248
              C 92,261 97,274 104,288
              C 98,272 95,255 94,238
              C 93,222 96,206 102,192
              C 112,170 128,152 141,138
              Z
            " />
            {/* Symmetric Right Lower-Mid Leg */}
            <path d="
              M 159,138
              C 169,145 187,158 203,175
              C 211,184 216,196 218,210
              C 219,222 217,235 213,248
              C 208,261 203,274 196,288
              C 202,272 205,255 206,238
              C 207,222 204,206 198,192
              C 188,170 172,152 159,138
              Z
            " />

            {/* Left Bottom Leg (Leg 4) - Outer barbed parenthesis curve */}
            <path d="
              M 137,144
              C 122,156 98,177 74,202
              C 62,214 54,228 48,242
              C 45,250 43,258 43,266
              C 43,258 46,249 50,240
              C 57,224 68,208 81,194
              C 93,181 106,170 119,161
              C 114,162 108,166 102,169
              C 84,180 70,195 59,212
              C 51,224 45,237 42,251
              C 39,265 41,279 46,292
              C 42,280 40,266 42,252
              C 45,236 52,221 62,207
              C 74,190 91,175 110,163
              C 123,155 133,149 137,144
              Z
            " />
            {/* Symmetric Right Bottom Leg */}
            <path d="
              M 163,144
              C 178,156 202,177 226,202
              C 238,214 246,228 252,242
              C 255,250 257,258 257,266
              C 257,258 254,249 250,240
              C 243,224 232,208 219,194
              C 207,181 194,170 181,161
              C 186,162 192,166 198,169
              C 216,180 230,195 241,212
              C 249,224 255,237 258,251
              C 261,265 259,279 254,292
              C 258,280 260,266 258,252
              C 255,236 248,221 238,207
              C 226,190 209,175 190,163
              C 177,155 167,149 163,144
              Z
            " />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // EARTH-616 SPIDER-MAN (PETER PARKER / BRAND NEW DAY)
    // Modern sleek geometric chest spider
    // -------------------------------------------------------------
    case 'spider_man':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head & Body */}
          <path d="M 50,28 L 54,34 L 53,42 L 57,48 L 56,62 L 50,72 L 44,62 L 43,48 L 47,42 L 46,34 Z" />
          {/* Top Legs */}
          <path d="M 48,36 L 24,18 L 18,25 L 38,40 L 46,40 Z" />
          <path d="M 52,36 L 76,18 L 82,25 L 62,40 L 54,40 Z" />
          {/* Upper-Mid Legs */}
          <path d="M 45,44 L 16,38 L 12,47 L 40,50 L 45,48 Z" />
          <path d="M 55,44 L 84,38 L 88,47 L 60,50 L 55,48 Z" />
          {/* Lower-Mid Legs */}
          <path d="M 45,54 L 20,68 L 24,76 L 43,58 Z" />
          <path d="M 55,54 L 80,68 L 76,76 L 57,58 Z" />
          {/* Bottom Legs */}
          <path d="M 47,62 L 32,86 L 38,90 L 49,68 Z" />
          <path d="M 53,62 L 68,86 L 62,90 L 51,68 Z" />
        </svg>
      );

    // -------------------------------------------------------------
    // IRON MAN (TONY STARK) - ARC REACTOR & UNIBEAM
    // -------------------------------------------------------------
    case 'iron_man':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="44" strokeWidth="3" />
          <circle cx="50" cy="50" r="38" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* 10 Segmented Inductors */}
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 28;
            const y1 = 50 + Math.sin(rad) * 28;
            const x2 = 50 + Math.cos(rad) * 38;
            const y2 = 50 + Math.sin(rad) * 38;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="3.5" strokeLinecap="round" />;
          })}
          {/* Inner ring & glowing core */}
          <circle cx="50" cy="50" r="24" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="14" fill={strokeOrFillColor} strokeWidth="0" opacity="0.8" />
          <polygon points="50,32 64,56 36,56" strokeWidth="1.5" fill="none" />
        </svg>
      );

    // -------------------------------------------------------------
    // HULK (TRUE POWER UNLEASHED / GAMMA CONTINUUM)
    // Radiation trefoil + titanic clenched worldbreaker fist
    // -------------------------------------------------------------
    case 'hulk':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Hazard Shield Ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={strokeOrFillColor} strokeWidth="3" strokeDasharray="18 4" />
          {/* Gamma Trefoil Blades */}
          <path d="M 50,50 L 32,20 C 43,14 57,14 68,20 Z" opacity="0.85" />
          <path d="M 50,50 L 76,65 C 72,77 62,86 50,86 Z" opacity="0.85" />
          <path d="M 50,50 L 24,65 C 28,77 38,86 50,86 Z" opacity="0.85" />
          {/* Center Powerful Fist Silhouette */}
          <circle cx="50" cy="50" r="14" fill="#022c22" stroke={strokeOrFillColor} strokeWidth="2" />
          {/* Hulk Clenched Fist Icon */}
          <path d="M 44,43 C 44,40 47,38 50,38 C 53,38 56,40 56,43 L 57,48 L 59,47 C 61,47 62,49 61,51 L 59,57 C 58,61 54,63 50,63 C 46,63 42,61 41,57 L 39,51 C 38,49 39,47 41,47 L 43,48 Z" />
        </svg>
      );

    // -------------------------------------------------------------
    // THOR (GOD OF THUNDER) - ASGARDIAN TRIQUETRA & STORMBREAKER
    // -------------------------------------------------------------
    case 'thor':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Rune Ring */}
          <circle cx="50" cy="50" r="44" strokeWidth="2" strokeDasharray="6 3" />
          {/* Sacred Asgardian Triquetra */}
          <path d="M 50,18 C 65,35 65,65 50,82 C 35,65 35,35 50,18 Z" strokeWidth="3" />
          <path d="M 22,66 C 42,66 65,45 78,35 C 58,35 35,56 22,66 Z" strokeWidth="3" />
          <path d="M 78,66 C 58,66 35,45 22,35 C 42,35 65,56 78,66 Z" strokeWidth="3" />
          <circle cx="50" cy="52" r="18" strokeWidth="2" />
          {/* Central Lightning Bolt */}
          <path d="M 52,28 L 44,50 L 52,50 L 46,72 L 58,46 L 50,46 Z" fill={strokeOrFillColor} strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // DOCTOR STRANGE - SEAL OF THE VISHANTI
    // -------------------------------------------------------------
    case 'doctor_strange':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sanctum Sanctorum Window Outer Band */}
          <circle cx="50" cy="50" r="44" strokeWidth="3" />
          <circle cx="50" cy="50" r="39" strokeWidth="1" strokeDasharray="4 2" />
          {/* 4 Iconic Curved Seal of the Vishanti intersection arcs */}
          <path d="M 6,50 C 35,30 65,30 94,50" strokeWidth="3" />
          <path d="M 6,50 C 35,70 65,70 94,50" strokeWidth="3" />
          <path d="M 50,6 C 30,35 30,65 50,94" strokeWidth="3" />
          <path d="M 50,6 C 70,35 70,65 50,94" strokeWidth="3" />
          {/* Center Eye pupil */}
          <circle cx="50" cy="50" r="8" fill={strokeOrFillColor} strokeWidth="0" />
          <circle cx="50" cy="50" r="4" fill="#030712" strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // CAPTAIN AMERICA (STEVE ROGERS) - VIBRANIUM SHIELD
    // -------------------------------------------------------------
    case 'captain_america':
    case 'steve_rogers':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer red band */}
          <circle cx="50" cy="50" r="44" strokeWidth="6" />
          {/* White band */}
          <circle cx="50" cy="50" r="36" strokeWidth="4" />
          {/* Inner red band */}
          <circle cx="50" cy="50" r="28" strokeWidth="4" />
          {/* Blue field */}
          <circle cx="50" cy="50" r="22" fill={strokeOrFillColor} opacity="0.3" strokeWidth="0" />
          {/* Five-pointed Silver Star */}
          <polygon
            points="50,29 55,42 69,42 58,50 62,63 50,55 38,63 42,50 31,42 45,42"
            fill={strokeOrFillColor}
            strokeWidth="0"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // CAPTAIN AMERICA (SAM WILSON) - WAKANDAN EXO-FLIGHT WINGED STAR
    // -------------------------------------------------------------
    case 'sam_wilson':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sweeping Vibranium flight wings */}
          <path d="M 50,42 L 86,22 L 94,36 L 76,52 L 88,64 L 66,62 L 50,78 L 34,62 L 12,64 L 24,52 L 6,36 L 14,22 Z" strokeWidth="2.5" fill={strokeOrFillColor} fillOpacity="0.15" />
          {/* Center Shield Ring */}
          <circle cx="50" cy="50" r="24" strokeWidth="3" />
          <circle cx="50" cy="50" r="16" strokeWidth="2" />
          {/* Five-pointed Star */}
          <polygon
            points="50,38 53,46 62,46 55,51 58,60 50,55 42,60 45,51 38,46 47,46"
            fill={strokeOrFillColor}
            strokeWidth="0"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // CAPTAIN MARVEL (CAROL DANVERS) - STAR OF HALA
    // -------------------------------------------------------------
    case 'captain_marvel':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 8-pointed Star of Hala */}
          <polygon points="50,10 56,38 84,38 62,54 70,82 50,66 30,82 38,54 16,38 44,38" />
          {/* Dual Chest Chevrons */}
          <path d="M 12,68 L 50,88 L 88,68 L 82,62 L 50,78 L 18,62 Z" opacity="0.9" />
          <path d="M 12,78 L 50,98 L 88,78 L 84,74 L 50,89 L 16,74 Z" opacity="0.75" />
        </svg>
      );

    // -------------------------------------------------------------
    // BLACK WIDOW (NATASHA ROMANOFF) - RED ROOM HOURGLASS
    // -------------------------------------------------------------
    case 'black_widow':
    case 'natasha_romanoff':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tactical Crosshair Ring */}
          <circle cx="50" cy="50" r="44" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="40" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="4" x2="50" y2="18" strokeWidth="3" />
          <line x1="50" y1="82" x2="50" y2="96" strokeWidth="3" />
          <line x1="4" y1="50" x2="18" y2="50" strokeWidth="3" />
          <line x1="82" y1="50" x2="96" y2="50" strokeWidth="3" />
          {/* Red Hourglass Insignia */}
          <polygon points="30,22 70,22 50,50" fill={strokeOrFillColor} strokeWidth="0" />
          <polygon points="30,78 70,78 50,50" fill={strokeOrFillColor} strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // YELENA BELOVA - THUNDERBOLTS* WHITE WIDOW CHEVRON
    // -------------------------------------------------------------
    case 'yelena_belova':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="50,15 88,85 12,85" strokeWidth="2" strokeDasharray="5 3" />
          {/* Inverted Chevron */}
          <path d="M 22,35 L 50,62 L 78,35 L 86,43 L 50,78 L 14,43 Z" fill={strokeOrFillColor} strokeWidth="0" />
          {/* Crossed Combat Daggers */}
          <line x1="30" y1="30" x2="70" y2="70" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="30" x2="30" y2="70" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------
    // BUCKY BARNES (WINTER SOLDIER) - CYBERNETIC RED STAR
    // -------------------------------------------------------------
    case 'bucky_barnes':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Titanium Arm Groove Lines */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={strokeOrFillColor} strokeWidth="3" />
          <line x1="6" y1="35" x2="94" y2="35" stroke={strokeOrFillColor} strokeWidth="1.5" opacity="0.4" />
          <line x1="6" y1="65" x2="94" y2="65" stroke={strokeOrFillColor} strokeWidth="1.5" opacity="0.4" />
          {/* Bold Soviet Red Star */}
          <polygon points="50,16 60,38 84,38 64,52 72,76 50,61 28,76 36,52 16,38 40,38" />
        </svg>
      );

    // -------------------------------------------------------------
    // ROCKET RACCOON - RAVAGER MUNITIONS FLAME
    // -------------------------------------------------------------
    case 'rocket':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gear Teethed Munition Ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={strokeOrFillColor} strokeWidth="3" strokeDasharray="8 4" />
          {/* Ravager Flame Crest */}
          <path d="M 50,15 C 60,32 78,42 78,64 C 78,80 65,88 50,88 C 35,88 22,80 22,64 C 22,42 40,32 50,15 Z" />
          <circle cx="50" cy="64" r="10" fill="#1e1b4b" />
          <polygon points="50,58 53,64 59,64 54,68 56,74 50,70 44,74 46,68 41,64 47,64" fill={strokeOrFillColor} />
        </svg>
      );

    // -------------------------------------------------------------
    // SHURI (BLACK PANTHER) - WAKANDAN PANTHER MASK & TOOTH COLLAR
    // -------------------------------------------------------------
    case 'shuri':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vibranium Tooth Collar Ring */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 40;
            const y = 50 + Math.sin(rad) * 40;
            return <circle key={i} cx={x} cy={y} r="2.5" />;
          })}
          {/* Panther Helm Silhouette */}
          <path d="M 32,20 L 40,34 L 60,34 L 68,20 L 72,40 C 74,58 64,74 50,82 C 36,74 26,58 28,40 Z" />
          {/* Sleek Eye Slits */}
          <polygon points="36,46 44,48 38,52" fill="#030712" />
          <polygon points="64,46 56,48 62,52" fill="#030712" />
        </svg>
      );

    // -------------------------------------------------------------
    // ANT-MAN (SCOTT LANG) - PYM PARTICLE ANT HELMET
    // -------------------------------------------------------------
    case 'ant_man':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennae */}
          <line x1="42" y1="36" x2="24" y2="12" stroke={strokeOrFillColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="58" y1="36" x2="76" y2="12" stroke={strokeOrFillColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Helmet Outline */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={strokeOrFillColor} strokeWidth="2.5" />
          <path d="M 30,36 C 30,26 70,26 70,36 L 74,60 C 74,76 64,84 50,86 C 36,84 26,76 26,60 Z" />
          {/* Red Ocular Visor */}
          <ellipse cx="40" cy="50" rx="6" ry="10" fill="#dc2626" />
          <ellipse cx="60" cy="50" rx="6" ry="10" fill="#dc2626" />
          {/* Jaw Rebreather */}
          <rect x="42" y="68" width="16" height="8" rx="2" fill="#0f172a" />
        </svg>
      );

    // -------------------------------------------------------------
    // SHANG-CHI - TEN RINGS GREAT PROTECTOR
    // -------------------------------------------------------------
    case 'shang_chi':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 10 Rings in Concentric Circle */}
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 50 + Math.cos(rad) * 34;
            const cy = 50 + Math.sin(rad) * 34;
            return <circle key={i} cx={cx} cy={cy} r="8" strokeWidth="2.5" />;
          })}
          {/* Center Coiled Great Protector Dragon */}
          <circle cx="50" cy="50" r="14" strokeWidth="2" />
          <path d="M 44,54 C 44,46 56,46 56,52 C 56,58 46,58 46,62 L 54,62" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------
    // DAREDEVIL (MATT MURDOCK) - DOUBLE 'DD' & DEVIL HORNS
    // -------------------------------------------------------------
    case 'matt_murdock':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Devil Horns on Shield */}
          <polygon points="32,28 36,12 44,24" />
          <polygon points="68,28 64,12 56,24" />
          {/* Overlapping double D */}
          <path d="M 28,32 L 46,32 C 56,32 62,38 62,48 C 62,58 56,64 46,64 L 28,64 Z M 36,40 L 36,56 L 46,56 C 50,56 54,53 54,48 C 54,43 50,40 46,40 Z" />
          <path d="M 44,48 L 62,48 C 72,48 78,54 78,64 C 78,74 72,80 62,80 L 44,80 Z M 52,56 L 52,72 L 62,72 C 66,72 70,69 70,64 C 70,59 66,56 62,56 Z" opacity="0.9" />
        </svg>
      );

    // -------------------------------------------------------------
    // THANOS - THE INFINITY GAUNTLET
    // -------------------------------------------------------------
    case 'thanos':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Universal Ring */}
          <circle cx="50" cy="50" r="44" strokeWidth="2.5" />
          {/* Gauntlet Palm Armor */}
          <path d="M 32,84 L 32,56 L 24,48 L 30,36 L 42,42 L 42,28 L 50,26 L 58,28 L 58,42 L 70,36 L 76,48 L 68,56 L 68,84 Z" strokeWidth="2.5" />
          {/* 6 Infinity Stones */}
          {/* Mind (Center Palm - Yellow) */}
          <circle cx="50" cy="56" r="6" fill="#eab308" strokeWidth="0" />
          {/* Power (Purple - Index) */}
          <circle cx="34" cy="38" r="4" fill="#a855f7" strokeWidth="0" />
          {/* Space (Blue - Middle) */}
          <circle cx="46" cy="32" r="4" fill="#3b82f6" strokeWidth="0" />
          {/* Reality (Red - Ring) */}
          <circle cx="54" cy="32" r="4" fill="#ef4444" strokeWidth="0" />
          {/* Soul (Orange - Pinky) */}
          <circle cx="66" cy="38" r="4" fill="#f97316" strokeWidth="0" />
          {/* Time (Green - Thumb) */}
          <circle cx="24" cy="54" r="4" fill="#10b981" strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // LOKI - GOD OF STORIES HORNED HELM & YGGDRASIL
    // -------------------------------------------------------------
    case 'loki':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="44" strokeWidth="2" strokeDasharray="4 2" />
          {/* Sweeping Majestic Curved Horns */}
          <path d="M 38,48 C 24,34 16,14 34,8 C 42,20 44,38 46,46" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 62,48 C 76,34 84,14 66,8 C 58,20 56,38 54,46" strokeWidth="3.5" strokeLinecap="round" />
          {/* Helm Crown Brow */}
          <path d="M 36,48 L 50,40 L 64,48 L 50,54 Z" fill={strokeOrFillColor} strokeWidth="0" />
          {/* Yggdrasil Branches */}
          <path d="M 50,54 L 50,86 M 50,68 C 40,62 32,70 30,80 M 50,68 C 60,62 68,70 70,80" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------
    // ULTRON - MECHANICAL CRIMSON SKULL & HIVE-MIND
    // -------------------------------------------------------------
    case 'ultron':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Cybernetic Node */}
          <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" strokeWidth="2" />
          {/* Angular Robotic Skull Silhouette */}
          <path d="M 28,34 L 72,34 L 76,58 L 64,80 L 36,80 L 24,58 Z" strokeWidth="3" />
          {/* Glowing Red Eyes */}
          <polygon points="34,46 44,48 42,54 32,50" fill="#dc2626" strokeWidth="0" />
          <polygon points="66,46 56,48 58,54 68,50" fill="#dc2626" strokeWidth="0" />
          {/* Jack-o-lantern Grill Mouth */}
          <path d="M 38,66 L 44,70 L 50,66 L 56,70 L 62,66 L 58,74 L 42,74 Z" fill="#dc2626" strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // DOCTOR DOOM - LATVERIAN TITANIUM MASK & COWL
    // -------------------------------------------------------------
    case 'doctor_doom':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Emerald Cowl Hood */}
          <path d="M 18,88 C 18,36 30,12 50,12 C 70,12 82,36 82,88 Z" strokeWidth="3" />
          {/* Riveted Titanium Faceplate */}
          <path d="M 30,42 L 70,42 L 68,72 L 50,82 L 32,72 Z" fill="#475569" strokeWidth="2" />
          {/* Eye Slits */}
          <rect x="36" y="50" width="10" height="5" fill="#020617" />
          <rect x="54" y="50" width="10" height="5" fill="#020617" />
          {/* Mouth Grille */}
          <line x1="42" y1="68" x2="58" y2="68" strokeWidth="2.5" />
          <line x1="44" y1="64" x2="44" y2="72" strokeWidth="1.5" />
          <line x1="50" y1="64" x2="50" y2="72" strokeWidth="1.5" />
          <line x1="56" y1="64" x2="56" y2="72" strokeWidth="1.5" />
        </svg>
      );

    // -------------------------------------------------------------
    // WOLVERINE - TRIPLE ADAMANTIUM CLAWS
    // -------------------------------------------------------------
    case 'wolverine':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular X-Men Belt Buckle */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={strokeOrFillColor} strokeWidth="3" />
          {/* Triple Slashed Adamantium Claws */}
          <path d="M 28,82 C 30,52 35,32 40,12 C 34,34 32,54 30,82 Z" />
          <path d="M 48,86 C 50,50 50,30 50,8 C 52,30 52,50 52,86 Z" />
          <path d="M 72,82 C 70,52 65,32 60,12 C 66,34 68,54 70,82 Z" />
        </svg>
      );

    // -------------------------------------------------------------
    // DEADPOOL - SPLIT CIRCULAR MASK & SQUINTING EYES
    // -------------------------------------------------------------
    case 'deadpool':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Red Mask Outer Frame */}
          <circle cx="50" cy="50" r="44" strokeWidth="3" />
          <line x1="50" y1="6" x2="50" y2="94" strokeWidth="3" />
          {/* Black Eye Patches */}
          <ellipse cx="32" cy="50" rx="14" ry="22" fill={strokeOrFillColor} strokeWidth="0" />
          <ellipse cx="68" cy="50" rx="14" ry="22" fill={strokeOrFillColor} strokeWidth="0" />
          {/* White Squinting Eye Slits */}
          <polygon points="26,52 38,44 38,56" fill="#ffffff" strokeWidth="0" />
          <polygon points="74,52 62,44 62,56" fill="#ffffff" strokeWidth="0" />
        </svg>
      );

    // -------------------------------------------------------------
    // GREEN GOBLIN - OSCORP GLIDER & PUMPKIN BOMB
    // -------------------------------------------------------------
    case 'green_goblin':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bat-Glider Wings */}
          <path d="M 50,30 L 88,14 L 84,62 L 64,52 L 50,74 L 36,52 L 16,62 L 12,14 Z" opacity="0.85" />
          {/* Grinning Pumpkin Bomb */}
          <circle cx="50" cy="50" r="16" fill="#f97316" stroke="#000000" strokeWidth="2" />
          {/* Grinning Eyes & Jagged Smile */}
          <polygon points="44,46 48,44 46,49" fill="#000000" />
          <polygon points="56,46 52,44 54,49" fill="#000000" />
          <path d="M 42,54 L 46,58 L 50,54 L 54,58 L 58,54 L 54,60 L 46,60 Z" fill="#000000" />
        </svg>
      );

    // -------------------------------------------------------------
    // WHITE VISION - RECONSTRUCTED SYNTHEZOID MATRIX & SOLAR GEM
    // -------------------------------------------------------------
    case 'vision':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Vibranium Synthezoid Forehead Plate */}
          <polygon points="50,12 82,30 82,70 50,88 18,70 18,30" strokeWidth="2.5" />
          <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* Solar Gem / Mind Stone Core Aperture */}
          <ellipse cx="50" cy="46" rx="10" ry="14" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="50" cy="46" rx="5" ry="7" fill="#38bdf8" stroke="none" />
          {/* Vibranium Circuit Nodes */}
          <line x1="50" y1="12" x2="50" y2="32" strokeWidth="1.5" />
          <line x1="50" y1="60" x2="50" y2="88" strokeWidth="1.5" />
          <line x1="18" y1="50" x2="40" y2="46" strokeWidth="1.5" />
          <line x1="82" y1="50" x2="60" y2="46" strokeWidth="1.5" />
        </svg>
      );

    // -------------------------------------------------------------
    // DEFAULT GENERIC HERO INSIGNIA (HERO SHIELD / EMBLEM)
    // -------------------------------------------------------------
    default:
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          stroke={strokeOrFillColor}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* High-Tech Hero Emblem Frame */}
          <polygon points="50,8 90,26 90,74 50,92 10,74 10,26" strokeWidth="3" />
          <polygon points="50,18 80,32 80,68 50,82 20,68 20,32" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Avengers / Heroic 'A' Chevron */}
          <path d="M 50,24 L 66,70 L 56,70 L 52,56 L 48,56 L 44,70 L 34,70 Z" fill={strokeOrFillColor} strokeWidth="0" />
          <polygon points="50,36 53,48 47,48" fill="#030712" strokeWidth="0" />
        </svg>
      );
  }
};
