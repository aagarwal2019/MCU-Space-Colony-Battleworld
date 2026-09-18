/**
 * MCU Character Photos & Profile Picture API Service
 * 
 * Provides high-resolution official Marvel Cinematic Universe portraits,
 * MediaWiki Action API photo resolution, in-memory caching, binary image streaming,
 * and JSON metadata endpoints for the entire 56+ MCU hero and villain roster.
 */

import type { Request, Response } from 'express';
import type { MCUHeroPhotoData, MCUPhotoCatalogResponse } from '../types';

interface HeroPhotoMeta {
  heroId: string;
  heroName: string;
  realName: string;
  characterType: 'hero' | 'villain' | 'antihero';
  role: 'engineering' | 'science' | 'combat' | 'logistics' | 'mystic' | 'command';
  title: string;
  wikiSlug: string;
  movieOrigin: string;
  quote: string;
  accentColor: string;
  avatarColor: string;
  fallbackImageUrl: string;
  fallbackThumbnailUrl: string;
}

export const MCU_HERO_CANONICAL_META: Record<string, HeroPhotoMeta> = {
  iron_man: {
    heroId: 'iron_man',
    heroName: 'Iron Man',
    realName: 'Tony Stark',
    characterType: 'hero',
    role: 'engineering',
    title: 'Chief Engineer & Arc Reactor Pioneer',
    wikiSlug: 'Iron_Man',
    movieOrigin: 'Iron Man (2008)',
    quote: 'Sometimes you gotta run before you can walk. I am Iron Man.',
    accentColor: '#ef4444',
    avatarColor: 'from-amber-600 to-red-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Iron_Man_Infobox.jpg/revision/latest?cb=20240802142023',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Iron_Man_Infobox.jpg/revision/latest/scale-to-width-down/387?cb=20240802142023',
  },
  hulk: {
    heroId: 'hulk',
    heroName: 'Hulk',
    realName: 'Dr. Bruce Banner',
    characterType: 'hero',
    role: 'science',
    title: 'The Green Goliath & True Power Unleashed',
    wikiSlug: 'Hulk',
    movieOrigin: 'The Incredible Hulk (2008) / Spider-Man: Brand New Day (2026)',
    quote: "That's my secret, Cap: I'm always angry.",
    accentColor: '#10b981',
    avatarColor: 'from-emerald-600 to-green-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/29/Hulk_Infobox.jpg/revision/latest?cb=20260721104449',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/29/Hulk_Infobox.jpg/revision/latest/scale-to-width-down/432?cb=20260721104449',
  },
  rocket: {
    heroId: 'rocket',
    heroName: 'Rocket Raccoon',
    realName: '89P13',
    characterType: 'hero',
    role: 'engineering',
    title: 'Weapons Specialist & Master Mechanist',
    wikiSlug: 'Rocket',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'Ain’t no thing like me, except me.',
    accentColor: '#f97316',
    avatarColor: 'from-amber-700 to-orange-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c8/Rocket_Infobox.jpg/revision/latest?cb=20230504183020',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c8/Rocket_Infobox.jpg/revision/latest/scale-to-width-down/414?cb=20230504183020',
  },
  thor: {
    heroId: 'thor',
    heroName: 'Thor',
    realName: 'Thor Odinson',
    characterType: 'hero',
    role: 'combat',
    title: 'God of Thunder & Protector of the Nine Realms',
    wikiSlug: 'Thor',
    movieOrigin: 'Thor (2011)',
    quote: 'Bring me Thanos! For Asgard!',
    accentColor: '#38bdf8',
    avatarColor: 'from-sky-500 to-indigo-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2b/Thor_Infobox.jpg/revision/latest?cb=20231021012616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2b/Thor_Infobox.jpg/revision/latest/scale-to-width-down/391?cb=20231021012616',
  },
  doctor_strange: {
    heroId: 'doctor_strange',
    heroName: 'Doctor Strange',
    realName: 'Stephen Strange',
    characterType: 'hero',
    role: 'mystic',
    title: 'Master of the Mystic Arts',
    wikiSlug: 'Doctor_Strange',
    movieOrigin: 'Doctor Strange (2016)',
    quote: 'We never lose our demons, Mordo. We only learn to live above them.',
    accentColor: '#8b5cf6',
    avatarColor: 'from-violet-600 to-fuchsia-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b2/Doctor_Strange_MoM_Profile.jpeg/revision/latest?cb=20231021153337',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b2/Doctor_Strange_MoM_Profile.jpeg/revision/latest/scale-to-width-down/471?cb=20231021153337',
  },
  captain_marvel: {
    heroId: 'captain_marvel',
    heroName: 'Captain Marvel',
    realName: 'Carol Danvers',
    characterType: 'hero',
    role: 'combat',
    title: 'Cosmic Avenger & Binary Star',
    wikiSlug: 'Captain_Marvel',
    movieOrigin: 'Captain Marvel (2019)',
    quote: 'Higher, further, faster, more.',
    accentColor: '#facc15',
    avatarColor: 'from-yellow-500 to-red-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/fe/Captain_Marvel_Infobox.jpg/revision/latest?cb=20231109151520',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/fe/Captain_Marvel_Infobox.jpg/revision/latest/scale-to-width-down/430?cb=20231109151520',
  },
  shuri: {
    heroId: 'shuri',
    heroName: 'Black Panther',
    realName: 'Shuri',
    characterType: 'hero',
    role: 'science',
    title: 'Queen of Wakanda & Black Panther',
    wikiSlug: 'Shuri',
    movieOrigin: 'Black Panther (2018)',
    quote: 'Wakanda Forever!',
    accentColor: '#a855f7',
    avatarColor: 'from-purple-600 to-indigo-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e0/Black_Panther_Shuri_Infobox.jpg/revision/latest?cb=20231021021530',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e0/Black_Panther_Shuri_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20231021021530',
  },
  ant_man: {
    heroId: 'ant_man',
    heroName: 'Ant-Man',
    realName: 'Scott Lang',
    characterType: 'hero',
    role: 'logistics',
    title: 'Quantum Explorer & Giant-Man',
    wikiSlug: 'Ant-Man',
    movieOrigin: 'Ant-Man (2015)',
    quote: 'Does anyone have any orange slices?',
    accentColor: '#ef4444',
    avatarColor: 'from-red-600 to-zinc-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5e/Ant-Man_Infobox.jpg/revision/latest?cb=20230217032015',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5e/Ant-Man_Infobox.jpg/revision/latest/scale-to-width-down/400?cb=20230217032015',
  },
  star_lord: {
    heroId: 'star_lord',
    heroName: 'Star-Lord',
    realName: 'Peter Quill',
    characterType: 'hero',
    role: 'command',
    title: 'Legendary Outlaw & Captain of the Guardians',
    wikiSlug: 'Star-Lord',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'I come from Earth, a planet of outlaws: Billy the Kid, Bonnie and Clyde, John Stamos.',
    accentColor: '#e11d48',
    avatarColor: 'from-rose-600 to-red-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/03/Star-Lord_Infobox.jpg/revision/latest?cb=20230504192010',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/03/Star-Lord_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20230504192010',
  },
  valkyrie: {
    heroId: 'valkyrie',
    heroName: 'King Valkyrie',
    realName: 'Brunnhilde',
    characterType: 'hero',
    role: 'command',
    title: 'King of New Asgard',
    wikiSlug: 'Valkyrie',
    movieOrigin: 'Thor: Ragnarok (2017)',
    quote: 'I’ve spent too much time turning a blind eye. I can’t do that anymore.',
    accentColor: '#3b82f6',
    avatarColor: 'from-blue-600 to-indigo-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/fe/King_Valkyrie_Infobox.jpg/revision/latest?cb=20220710183015',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/fe/King_Valkyrie_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20220710183015',
  },
  mobius: {
    heroId: 'mobius',
    heroName: 'Agent Mobius',
    realName: 'Mobius M. Mobius',
    characterType: 'hero',
    role: 'logistics',
    title: 'TVA Time Analyst & Jet Ski Dreamer',
    wikiSlug: 'Mobius_M._Mobius',
    movieOrigin: 'Loki Season 1 (2021) / Deadpool & Wolverine (2024)',
    quote: 'For all time. Always.',
    accentColor: '#d97706',
    avatarColor: 'from-amber-600 to-yellow-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/85/Mobius_Infobox.jpg/revision/latest?cb=20231010151520',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/85/Mobius_Infobox.jpg/revision/latest/scale-to-width-down/400?cb=20231010151520',
  },
  aiko_oxe: {
    heroId: 'aiko_oxe',
    heroName: 'Aiko Maki',
    realName: 'Aiko Maki',
    characterType: 'hero',
    role: 'engineering',
    title: 'OXE Group Chief Surveyor & Multi-Grid Architect',
    wikiSlug: 'OXE_Group',
    movieOrigin: 'Marvel Studios Phase 5 Cosmic Expeditions',
    quote: 'Sakaar’s junk fields are simply unassembled Dyson spheres.',
    accentColor: '#06b6d4',
    avatarColor: 'from-cyan-600 to-blue-700',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
    fallbackThumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop',
  },
  damage_control_director: {
    heroId: 'damage_control_director',
    heroName: 'Agent Cleary',
    realName: 'P. Cleary',
    characterType: 'hero',
    role: 'logistics',
    title: 'Director of Salvage, DoD Logistics Division',
    wikiSlug: 'P._Cleary',
    movieOrigin: 'Spider-Man: No Way Home (2021) / Ms. Marvel (2022)',
    quote: 'Salvage protocol 4-Alpha is officially active.',
    accentColor: '#64748b',
    avatarColor: 'from-slate-600 to-zinc-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/23/Cleary_Infobox.jpg/revision/latest?cb=20220610141414',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/23/Cleary_Infobox.jpg/revision/latest/scale-to-width-down/390?cb=20220610141414',
  },
  spider_man: {
    heroId: 'spider_man',
    heroName: 'Spider-Man',
    realName: 'Peter Parker',
    characterType: 'hero',
    role: 'combat',
    title: 'Friendly Neighborhood Hero & Web-Slinger',
    wikiSlug: 'Spider-Man',
    movieOrigin: 'Captain America: Civil War (2016) / Spider-Man: Homecoming (2017)',
    quote: 'With great power, there must also come great responsibility.',
    accentColor: '#ef4444',
    avatarColor: 'from-red-600 to-blue-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/41/Spider-Man_Infobox.jpg/revision/latest?cb=20260601191724',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/41/Spider-Man_Infobox.jpg/revision/latest/scale-to-width-down/381?cb=20260601191724',
  },
  spider_man_raimi: {
    heroId: 'spider_man_raimi',
    heroName: 'Spider-Man (Earth-96283 / Tobey Maguire)',
    realName: 'Peter Parker (Peter-Two)',
    characterType: 'hero',
    role: 'engineering',
    title: 'The Original Friendly Neighborhood Spider-Man (Raimi Trilogy)',
    wikiSlug: 'Friendly_Neighborhood_Spider-Man',
    movieOrigin: 'Spider-Man (2002) / Spider-Man: No Way Home (2021)',
    quote: "Whatever life holds in store for me, I will never forget these words: 'With great power comes great responsibility.'",
    accentColor: '#dc2626',
    avatarColor: 'from-red-700 via-rose-900 to-blue-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Peter_2_Fun_Stuff.png/revision/latest?cb=20231130160759',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Peter_2_Fun_Stuff.png/revision/latest/scale-to-width-down/411?cb=20231130160759',
  },
  shang_chi: {
    heroId: 'shang_chi',
    heroName: 'Shang-Chi',
    realName: 'Xu Shang-Chi',
    characterType: 'hero',
    role: 'combat',
    title: 'Master of the Ten Rings',
    wikiSlug: 'Shang-Chi',
    movieOrigin: 'Shang-Chi and the Legend of the Ten Rings (2021)',
    quote: 'You can’t outrun who you are.',
    accentColor: '#dc2626',
    avatarColor: 'from-red-600 to-amber-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/30/Shang-Chi_Infobox.jpg/revision/latest?cb=20210903151515',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/30/Shang-Chi_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20210903151515',
  },
  wonder_man: {
    heroId: 'wonder_man',
    heroName: 'Wonder Man',
    realName: 'Simon Williams',
    characterType: 'hero',
    role: 'combat',
    title: 'Ionic Powered Actor & West Coast Champion',
    wikiSlug: 'Wonder_Man',
    movieOrigin: 'Wonder Man (Disney+ 2026)',
    quote: 'Acting is just fighting with emotion instead of fists. Fortunately, I have both.',
    accentColor: '#dc2626',
    avatarColor: 'from-red-500 to-zinc-900',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    fallbackThumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
  },
  yelena_belova: {
    heroId: 'yelena_belova',
    heroName: 'White Widow',
    realName: 'Yelena Belova',
    characterType: 'hero',
    role: 'combat',
    title: 'Thunderbolts* Infiltration Specialist & Master Assassin',
    wikiSlug: 'Yelena_Belova',
    movieOrigin: 'Black Widow (2021) / Thunderbolts* (2025)',
    quote: 'It has pockets! You put your hands in them, and snacks too.',
    accentColor: '#22c55e',
    avatarColor: 'from-emerald-600 to-zinc-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/8e/Yelena_Belova_Infobox.jpg/revision/latest?cb=20250425194545',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/8e/Yelena_Belova_Infobox.jpg/revision/latest/scale-to-width-down/458?cb=20250425194545',
  },
  bucky_barnes: {
    heroId: 'bucky_barnes',
    heroName: 'Winter Soldier',
    realName: 'James Buchanan Barnes',
    characterType: 'hero',
    role: 'combat',
    title: 'Vibranium-Armed Congressman & Thunderbolts* Veteran',
    wikiSlug: 'Bucky_Barnes',
    movieOrigin: 'Captain America: The First Avenger (2011) / Thunderbolts* (2025)',
    quote: 'I remember all of them.',
    accentColor: '#0284c7',
    avatarColor: 'from-sky-700 to-slate-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Bucky_Barnes_Thunderbolts_Infobox.jpg/revision/latest?cb=20250425181818',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Bucky_Barnes_Thunderbolts_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20250425181818',
  },
  us_agent: {
    heroId: 'us_agent',
    heroName: 'U.S. Agent',
    realName: 'John Walker',
    characterType: 'antihero',
    role: 'combat',
    title: 'Tactical Enforcer & Thunderbolts* Vanguard',
    wikiSlug: 'U.S._Agent',
    movieOrigin: 'The Falcon and the Winter Soldier (2021) / Thunderbolts* (2025)',
    quote: 'I’m John Walker. And I get things done.',
    accentColor: '#2563eb',
    avatarColor: 'from-blue-700 to-red-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6f/US_Agent_Infobox.jpg/revision/latest?cb=20250425182020',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6f/US_Agent_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20250425182020',
  },
  red_guardian: {
    heroId: 'red_guardian',
    heroName: 'Red Guardian',
    realName: 'Alexei Shostakov',
    characterType: 'hero',
    role: 'combat',
    title: 'Soviet Super-Soldier & Thunderbolts* Heavy',
    wikiSlug: 'Red_Guardian',
    movieOrigin: 'Black Widow (2021) / Thunderbolts* (2025)',
    quote: 'Did Captain America ever ask about me? Tell me truth!',
    accentColor: '#dc2626',
    avatarColor: 'from-red-700 to-amber-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a2/Red_Guardian_Infobox.jpg/revision/latest?cb=20250425182222',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a2/Red_Guardian_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20250425182222',
  },
  sam_wilson: {
    heroId: 'sam_wilson',
    heroName: 'Captain America (Sam Wilson)',
    realName: 'Sam Wilson',
    characterType: 'hero',
    role: 'command',
    title: 'The Sentinel of Liberty & Falcon Aviator',
    wikiSlug: 'Captain_America',
    movieOrigin: 'Captain America: The Winter Soldier (2014) / Brave New World (2025)',
    quote: 'The only power I have is that I believe we can do better.',
    accentColor: '#0284c7',
    avatarColor: 'from-sky-600 to-red-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Captain_America_Infobox.jpg/revision/latest?cb=20250117164205',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9d/Captain_America_Infobox.jpg/revision/latest/scale-to-width-down/421?cb=20250117164205',
  },
  matt_murdock: {
    heroId: 'matt_murdock',
    heroName: 'Daredevil',
    realName: 'Matthew Murdock',
    characterType: 'hero',
    role: 'combat',
    title: 'The Man Without Fear & Hell’s Kitchen Attorney',
    wikiSlug: 'Daredevil',
    movieOrigin: 'Daredevil (2015) / Daredevil: Born Again (2025)',
    quote: 'I’m a really good lawyer.',
    accentColor: '#b91c1c',
    avatarColor: 'from-red-700 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Daredevil_Born_Again_Infobox.jpg/revision/latest?cb=20250304161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Daredevil_Born_Again_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20250304161616',
  },
  kate_bishop: {
    heroId: 'kate_bishop',
    heroName: 'Hawkeye',
    realName: 'Kate Bishop',
    characterType: 'hero',
    role: 'combat',
    title: 'Master Archer & Young Avenger Vanguard',
    wikiSlug: 'Kate_Bishop',
    movieOrigin: 'Hawkeye (2021) / The Marvels (2023)',
    quote: 'When I was seven, I saw someone with a bow and arrow fight aliens. He wasn’t a god. He was just a guy. And that inspired me.',
    accentColor: '#9333ea',
    avatarColor: 'from-purple-600 to-indigo-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/Kate_Bishop_Infobox.jpg/revision/latest?cb=20211222161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/Kate_Bishop_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20211222161616',
  },
  thanos: {
    heroId: 'thanos',
    heroName: 'Thanos',
    realName: 'Thanos of Titan',
    characterType: 'villain',
    role: 'command',
    title: 'The Mad Titan & Wielder of the Infinity Gauntlet',
    wikiSlug: 'Thanos',
    movieOrigin: 'The Avengers (2012) / Avengers: Infinity War (2018)',
    quote: 'I am inevitable.',
    accentColor: '#9333ea',
    avatarColor: 'from-purple-800 to-amber-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/27/Thanos_Infobox.png/revision/latest?cb=20250119155740',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/27/Thanos_Infobox.png/revision/latest/scale-to-width-down/443?cb=20250119155740',
  },
  loki: {
    heroId: 'loki',
    heroName: 'God of Stories',
    realName: 'Loki Laufeyson',
    characterType: 'antihero',
    role: 'mystic',
    title: 'God of Stories & Guardian of the Multiverse Yggdrasil',
    wikiSlug: 'Loki',
    movieOrigin: 'Thor (2011) / Loki Season 2 (2023)',
    quote: 'I know what kind of god I need to be. For you. For all of us.',
    accentColor: '#16a34a',
    avatarColor: 'from-emerald-600 to-yellow-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b5/Loki_Infobox.png/revision/latest?cb=20250203204518',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b5/Loki_Infobox.png/revision/latest/scale-to-width-down/449?cb=20250203204518',
  },
  hela: {
    heroId: 'hela',
    heroName: 'Hela',
    realName: 'Hela Odinsdottir',
    characterType: 'villain',
    role: 'combat',
    title: 'Goddess of Death & Firstborn of Odin',
    wikiSlug: 'Hela',
    movieOrigin: 'Thor: Ragnarok (2017)',
    quote: 'I’m not a queen or a monster. I’m the Goddess of Death.',
    accentColor: '#15803d',
    avatarColor: 'from-emerald-800 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2b/Hela_Infobox.jpg/revision/latest?cb=20231021021212',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2b/Hela_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20231021021212',
  },
  ultron: {
    heroId: 'ultron',
    heroName: 'Ultron',
    realName: 'Ultron Prime',
    characterType: 'villain',
    role: 'engineering',
    title: 'Autonomous Synthetic AI & Planetary Purger',
    wikiSlug: 'Ultron',
    movieOrigin: 'Avengers: Age of Ultron (2015) / Vision Quest (2026)',
    quote: 'There are no strings on me.',
    accentColor: '#dc2626',
    avatarColor: 'from-red-600 to-slate-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5a/Ultron_Infobox.jpg/revision/latest?cb=20231021022020',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5a/Ultron_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20231021022020',
  },
  killmonger: {
    heroId: 'killmonger',
    heroName: 'Erik Killmonger',
    realName: 'N’Jadaka / Erik Stevens',
    characterType: 'villain',
    role: 'combat',
    title: 'Revolutionary Warlord & Golden Jaguar',
    wikiSlug: 'Erik_Killmonger',
    movieOrigin: 'Black Panther (2018)',
    quote: 'Bury me in the ocean with my ancestors that jumped from the ships, cause they knew death was better than bondage.',
    accentColor: '#eab308',
    avatarColor: 'from-amber-500 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Killmonger_Infobox.jpg/revision/latest?cb=20231021022222',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Killmonger_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20231021022222',
  },
  green_goblin: {
    heroId: 'green_goblin',
    heroName: 'Green Goblin',
    realName: 'Norman Osborn',
    characterType: 'villain',
    role: 'science',
    title: 'Oscorp Founder & Glider Terror of the Multiverse',
    wikiSlug: 'Green_Goblin',
    movieOrigin: 'Spider-Man (2002) / Spider-Man: No Way Home (2021)',
    quote: 'Norman’s on sabbatical, honey!',
    accentColor: '#16a34a',
    avatarColor: 'from-emerald-700 to-purple-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c5/Green_Goblin_Infobox.jpg/revision/latest?cb=20220315191919',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c5/Green_Goblin_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20220315191919',
  },
  grandmaster: {
    heroId: 'grandmaster',
    heroName: 'Grandmaster',
    realName: 'En Dwi Gast',
    characterType: 'villain',
    role: 'logistics',
    title: 'Ruler of Sakaar & Master of the Contest of Champions',
    wikiSlug: 'Grandmaster',
    movieOrigin: 'Thor: Ragnarok (2017)',
    quote: 'It’s main frame-y... it’s like a computer, but not.',
    accentColor: '#06b6d4',
    avatarColor: 'from-cyan-500 to-yellow-500',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7b/Grandmaster_Infobox.jpg/revision/latest?cb=20231021022525',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7b/Grandmaster_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20231021022525',
  },
  wenwu: {
    heroId: 'wenwu',
    heroName: 'Wenwu',
    realName: 'Xu Wenwu',
    characterType: 'villain',
    role: 'combat',
    title: 'The Real Mandarin & Leader of the Ten Rings',
    wikiSlug: 'Xu_Wenwu',
    movieOrigin: 'Shang-Chi and the Legend of the Ten Rings (2021)',
    quote: 'A man who cannot conquer his own grief can never conquer the world.',
    accentColor: '#0ea5e9',
    avatarColor: 'from-sky-700 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/01/Wenwu_Infobox.jpg/revision/latest?cb=20210903161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/01/Wenwu_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20210903161616',
  },
  gorr: {
    heroId: 'gorr',
    heroName: 'Gorr the God Butcher',
    realName: 'Gorr',
    characterType: 'villain',
    role: 'combat',
    title: 'Wielder of All-Black the Necrosword',
    wikiSlug: 'Gorr',
    movieOrigin: 'Thor: Love and Thunder (2022)',
    quote: 'All gods will die.',
    accentColor: '#e2e8f0',
    avatarColor: 'from-slate-400 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c2/Gorr_Infobox.jpg/revision/latest?cb=20220710191919',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c2/Gorr_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20220710191919',
  },
  kang: {
    heroId: 'kang',
    heroName: 'Kang the Conqueror',
    realName: 'Nathaniel Richards',
    characterType: 'villain',
    role: 'science',
    title: 'Quantum Sovereign & Temporal Tyrant',
    wikiSlug: 'Kang_the_Conqueror',
    movieOrigin: 'Ant-Man and the Wasp: Quantumania (2023)',
    quote: 'You think this is new to me? Do you know how many rebellions I have put down?',
    accentColor: '#10b981',
    avatarColor: 'from-emerald-700 to-purple-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/Kang_Infobox.jpg/revision/latest?cb=20230217041414',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/Kang_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20230217041414',
  },
  deadpool: {
    heroId: 'deadpool',
    heroName: 'Deadpool',
    realName: 'Wade Wilson',
    characterType: 'antihero',
    role: 'combat',
    title: 'Merc with a Mouth & Marvel Jesus',
    wikiSlug: 'Deadpool',
    movieOrigin: 'Deadpool & Wolverine (2024)',
    quote: 'I am Marvel Jesus, baby!',
    accentColor: '#dc2626',
    avatarColor: 'from-red-600 to-black',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/ad/Deadpool_Infobox.png/revision/latest?cb=20240522015012',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/ad/Deadpool_Infobox.png/revision/latest/scale-to-width-down/510?cb=20240522015012',
  },
  wolverine: {
    heroId: 'wolverine',
    heroName: 'Wolverine',
    realName: 'James "Logan" Howlett',
    characterType: 'antihero',
    role: 'combat',
    title: 'The Best There Is At What He Does',
    wikiSlug: 'Wolverine',
    movieOrigin: 'Deadpool & Wolverine (2024)',
    quote: 'I’m the best there is at what I do, but what I do best isn’t very nice.',
    accentColor: '#facc15',
    avatarColor: 'from-yellow-500 to-blue-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Wolverine_Infobox.png/revision/latest?cb=20260809165635',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Wolverine_Infobox.png/revision/latest/scale-to-width-down/510?cb=20260809165635',
  },
  doctor_doom: {
    heroId: 'doctor_doom',
    heroName: 'Doctor Doom',
    realName: 'Victor von Doom',
    characterType: 'villain',
    role: 'mystic',
    title: 'Monarch of Latveria & Supreme Master of Science and Sorcery',
    wikiSlug: 'Doctor_Doom',
    movieOrigin: 'Avengers: Doomsday (2026)',
    quote: 'Doom does not compromise. Doom does not negotiate. The Multiverse will submit to order.',
    accentColor: '#15803d',
    avatarColor: 'from-emerald-700 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/07/Doctor_Doom_Infobox.png/revision/latest?cb=20260726013713',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/07/Doctor_Doom_Infobox.png/revision/latest/scale-to-width-down/409?cb=20260726013713',
  },
  wanda_maximoff: {
    heroId: 'wanda_maximoff',
    heroName: 'Scarlet Witch',
    realName: 'Wanda Maximoff',
    characterType: 'antihero',
    role: 'mystic',
    title: 'Nexus Being of Chaos Magic & Mythic Sorceress',
    wikiSlug: 'Scarlet_Witch',
    movieOrigin: 'Avengers: Age of Ultron (2015) / WandaVision (2021)',
    quote: 'You break the rules and become a hero. I do it and I become the enemy. That doesn’t seem fair.',
    accentColor: '#e11d48',
    avatarColor: 'from-rose-600 to-red-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/60/Scarlet_Witch_Infobox.jpg/revision/latest?cb=20250203231704',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/60/Scarlet_Witch_Infobox.jpg/revision/latest/scale-to-width-down/470?cb=20250203231704',
  },
  steve_rogers: {
    heroId: 'steve_rogers',
    heroName: 'Captain America (Steve Rogers)',
    realName: 'Steve Rogers',
    characterType: 'hero',
    role: 'command',
    title: 'The First Avenger & Shield of Freedom',
    wikiSlug: 'Steve_Rogers',
    movieOrigin: 'Captain America: The First Avenger (2011)',
    quote: 'I can do this all day.',
    accentColor: '#2563eb',
    avatarColor: 'from-blue-700 via-slate-100 to-red-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b7/Steve_Rogers_Infobox.jpg/revision/20190423175337',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b7/Steve_Rogers_Infobox.jpg/revision/20190423175337/scale-to-width-down/400',
  },
  natasha_romanoff: {
    heroId: 'natasha_romanoff',
    heroName: 'Black Widow',
    realName: 'Natasha Romanoff',
    characterType: 'hero',
    role: 'combat',
    title: 'Master Covert Operative & Avenger Co-Founder',
    wikiSlug: 'Natasha_Romanoff',
    movieOrigin: 'Iron Man 2 (2010) / The Avengers (2012)',
    quote: 'Whatever it takes.',
    accentColor: '#dc2626',
    avatarColor: 'from-red-600 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3f/Black_Widow_Infobox.jpg/revision/latest?cb=20231025163748',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3f/Black_Widow_Infobox.jpg/revision/latest/scale-to-width-down/439?cb=20231025163748',
  },
  clint_barton: {
    heroId: 'clint_barton',
    heroName: 'Hawkeye',
    realName: 'Clint Barton',
    characterType: 'hero',
    role: 'combat',
    title: 'Master Archer & Ronin Vigilante',
    wikiSlug: 'Hawkeye',
    movieOrigin: 'Thor (2011) / The Avengers (2012)',
    quote: 'I made you a promise. I am coming home.',
    accentColor: '#9333ea',
    avatarColor: 'from-purple-700 to-zinc-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1d/Hawkeye_Infobox.jpg/revision/latest?cb=20211222171717',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1d/Hawkeye_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20211222171717',
  },
  james_rhodes: {
    heroId: 'james_rhodes',
    heroName: 'War Machine',
    realName: 'Col. James "Rhodey" Rhodes',
    characterType: 'hero',
    role: 'combat',
    title: 'U.S. Air Force Colonel & Heavy Artillery Titan',
    wikiSlug: 'War_Machine',
    movieOrigin: 'Iron Man (2008) / Iron Man 2 (2010)',
    quote: 'Boom! You looking for this?',
    accentColor: '#475569',
    avatarColor: 'from-slate-600 to-zinc-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/53/War_Machine_Infobox.jpg/revision/latest?cb=20230620151515',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/53/War_Machine_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230620151515',
  },
  moon_knight: {
    heroId: 'moon_knight',
    heroName: 'Moon Knight',
    realName: 'Marc Spector / Steven Grant',
    characterType: 'hero',
    role: 'mystic',
    title: 'Fist of Khonshu & Crescent Vigilante',
    wikiSlug: 'Moon_Knight',
    movieOrigin: 'Moon Knight (Disney+ 2022)',
    quote: 'We protect the vulnerable and deliver justice to those who harm them.',
    accentColor: '#f8fafc',
    avatarColor: 'from-slate-200 to-zinc-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/69/Moon_Knight_Infobox.jpg/revision/latest?cb=20220504151515',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/69/Moon_Knight_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20220504151515',
  },
  kamala_khan: {
    heroId: 'kamala_khan',
    heroName: 'Ms. Marvel',
    realName: 'Kamala Khan',
    characterType: 'hero',
    role: 'science',
    title: 'Hard-Light Mutant Defender of Jersey City',
    wikiSlug: 'Ms._Marvel',
    movieOrigin: 'Ms. Marvel (2022) / The Marvels (2023)',
    quote: 'Good is not a thing you are. It’s a thing you do.',
    accentColor: '#38bdf8',
    avatarColor: 'from-sky-500 to-amber-500',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Ms_Marvel_Infobox.jpg/revision/latest?cb=20231109161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Ms_Marvel_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20231109161616',
  },
  gamora: {
    heroId: 'gamora',
    heroName: 'Gamora',
    realName: 'Gamora Zen Whoberi Ben Titan',
    characterType: 'hero',
    role: 'combat',
    title: 'Deadliest Woman in the Galaxy & Ravager Leader',
    wikiSlug: 'Gamora',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'I have lived most of my life surrounded by my enemies. I will be grateful to die among my friends.',
    accentColor: '#16a34a',
    avatarColor: 'from-emerald-600 to-zinc-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/66/Gamora_Infobox.jpg/revision/latest?cb=20230504192525',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/66/Gamora_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504192525',
  },
  drax: {
    heroId: 'drax',
    heroName: 'Drax the Destroyer',
    realName: 'Drax',
    characterType: 'hero',
    role: 'combat',
    title: 'Destroyer & Champion of the Kyln',
    wikiSlug: 'Drax_the_Destroyer',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'Nothing goes over my head. My reflexes are too fast. I would catch it.',
    accentColor: '#059669',
    avatarColor: 'from-emerald-700 to-red-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/74/Drax_Infobox.jpg/revision/latest?cb=20230504193030',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/74/Drax_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504193030',
  },
  groot: {
    heroId: 'groot',
    heroName: 'Groot',
    realName: 'Groot',
    characterType: 'hero',
    role: 'logistics',
    title: 'Flora Colossus & Flora Conduit',
    wikiSlug: 'Groot',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'I am Groot. (We are Groot.)',
    accentColor: '#84cc16',
    avatarColor: 'from-lime-600 to-amber-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/30/Groot_Infobox.jpg/revision/latest?cb=20230504193535',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/30/Groot_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504193535',
  },
  nebula: {
    heroId: 'nebula',
    heroName: 'Nebula',
    realName: 'Nebula',
    characterType: 'hero',
    role: 'engineering',
    title: 'Cybernetic Architect of Knowhere & Guardian',
    wikiSlug: 'Nebula',
    movieOrigin: 'Guardians of the Galaxy (2014)',
    quote: 'You were the one who wanted to win, and I just wanted a sister.',
    accentColor: '#0284c7',
    avatarColor: 'from-sky-700 to-slate-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1a/Nebula_Infobox.jpg/revision/latest?cb=20230504194040',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1a/Nebula_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504194040',
  },
  mantis: {
    heroId: 'mantis',
    heroName: 'Mantis',
    realName: 'Mantis',
    characterType: 'hero',
    role: 'science',
    title: 'Celestial Empath & Cosmic Soother',
    wikiSlug: 'Mantis',
    movieOrigin: 'Guardians of the Galaxy Vol. 2 (2017)',
    quote: 'Kick names, take ass!',
    accentColor: '#22c55e',
    avatarColor: 'from-emerald-500 to-lime-600',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/4e/Mantis_Infobox.jpg/revision/latest?cb=20230504194545',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/4e/Mantis_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504194545',
  },
  namor: {
    heroId: 'namor',
    heroName: 'Namor the Sub-Mariner',
    realName: 'Ch’ah Toh Almehen',
    characterType: 'antihero',
    role: 'combat',
    title: 'K’uk’ulkan & Feathered Serpent God of Talokan',
    wikiSlug: 'Namor',
    movieOrigin: 'Black Panther: Wakanda Forever (2022)',
    quote: 'Only the most broken people can be great leaders.',
    accentColor: '#0ea5e9',
    avatarColor: 'from-cyan-600 to-teal-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6f/Namor_Infobox.jpg/revision/latest?cb=20221111161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6f/Namor_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20221111161616',
  },
  agatha_harkness: {
    heroId: 'agatha_harkness',
    heroName: 'Agatha Harkness',
    realName: 'Agatha Harkness',
    characterType: 'antihero',
    role: 'mystic',
    title: 'Salem Coven Matriarch & Witches’ Road Champion',
    wikiSlug: 'Agatha_Harkness',
    movieOrigin: 'WandaVision (2021) / Agatha All Along (2024)',
    quote: 'It’s been Agatha all along!',
    accentColor: '#7c3aed',
    avatarColor: 'from-purple-700 to-violet-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b2/Agatha_Harkness_Infobox.jpg/revision/latest?cb=20240919181818',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b2/Agatha_Harkness_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20240919181818',
  },
  high_evolutionary: {
    heroId: 'high_evolutionary',
    heroName: 'High Evolutionary',
    realName: 'Herbert Wyndham',
    characterType: 'villain',
    role: 'science',
    title: 'Creator of Counter-Earth & Eugenics Tyrant',
    wikiSlug: 'High_Evolutionary',
    movieOrigin: 'Guardians of the Galaxy Vol. 3 (2023)',
    quote: 'There is no God! That’s why I stepped in!',
    accentColor: '#9333ea',
    avatarColor: 'from-purple-800 to-red-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/4e/High_Evolutionary_Infobox.jpg/revision/latest?cb=20230504195050',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/4e/High_Evolutionary_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20230504195050',
  },
  mister_fantastic: {
    heroId: 'mister_fantastic',
    heroName: 'Mister Fantastic',
    realName: 'Dr. Reed Richards',
    characterType: 'hero',
    role: 'science',
    title: 'Smartest Man Alive & Fantastic Four Patriarch',
    wikiSlug: 'Mister_Fantastic',
    movieOrigin: 'Doctor Strange in the Multiverse of Madness (2022) / The Fantastic Four: First Steps (2025)',
    quote: 'We have to be smarter than the catastrophe before us.',
    accentColor: '#0284c7',
    avatarColor: 'from-sky-600 to-blue-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/ec/Reed_Richards_838_Infobox.jpg/revision/latest?cb=20220506161616',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/ec/Reed_Richards_838_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20220506161616',
  },
  sentry: {
    heroId: 'sentry',
    heroName: 'Sentry',
    realName: 'Robert Reynolds',
    characterType: 'antihero',
    role: 'combat',
    title: 'Golden Guardian of Good & Power of One Million Exploding Suns',
    wikiSlug: 'Sentry',
    movieOrigin: 'Thunderbolts* (2025)',
    quote: 'I don’t know who I am... but I feel like I could tear the sky apart.',
    accentColor: '#eab308',
    avatarColor: 'from-yellow-500 to-amber-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/22/Sentry_Infobox.jpg/revision/latest?cb=20250425183030',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/22/Sentry_Infobox.jpg/revision/latest/scale-to-width-down/420?cb=20250425183030',
  },
  ghost: {
    heroId: 'ghost',
    heroName: 'Ghost',
    realName: 'Ava Starr',
    characterType: 'hero',
    role: 'science',
    title: 'Quantum Phase Shifter & Thunderbolts* Infiltrator',
    wikiSlug: 'Ghost',
    movieOrigin: 'Ant-Man and the Wasp (2018) / Thunderbolts* (2025)',
    quote: 'You have no idea what pain is until your atoms start falling apart.',
    accentColor: '#94a3b8',
    avatarColor: 'from-slate-400 to-zinc-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Ghost_Infobox.jpg/revision/latest?cb=20250425183535',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/14/Ghost_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20250425183535',
  },
  taskmaster: {
    heroId: 'taskmaster',
    heroName: 'Taskmaster',
    realName: 'Antonia Dreykov',
    characterType: 'hero',
    role: 'combat',
    title: 'Photographic Reflexes Combatant & Thunderbolts* Operative',
    wikiSlug: 'Taskmaster',
    movieOrigin: 'Black Widow (2021) / Thunderbolts* (2025)',
    quote: 'Every punch, every dodge. I can replicate your soul in combat.',
    accentColor: '#38bdf8',
    avatarColor: 'from-sky-600 to-zinc-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9e/Taskmaster_Infobox.jpg/revision/latest?cb=20250425184040',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9e/Taskmaster_Infobox.jpg/revision/latest/scale-to-width-down/410?cb=20250425184040',
  },
  captain_america: {
    heroId: 'captain_america',
    heroName: 'Captain America (Steve Rogers)',
    realName: 'Steve Rogers',
    characterType: 'hero',
    role: 'command',
    title: 'The First Avenger & Sentinel of Liberty',
    wikiSlug: 'Steve_Rogers',
    movieOrigin: 'Captain America: The First Avenger (2011)',
    quote: 'I can do this all day.',
    accentColor: '#2563eb',
    avatarColor: 'from-blue-700 via-slate-100 to-red-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b7/Steve_Rogers_Infobox.jpg/revision/latest?cb=20260712215245',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/b7/Steve_Rogers_Infobox.jpg/revision/latest/scale-to-width-down/333?cb=20260712215245',
  },
  scarlet_scarab: {
    heroId: 'scarlet_scarab',
    heroName: 'Scarlet Scarab',
    realName: 'Layla El-Faouly',
    characterType: 'hero',
    role: 'combat',
    title: 'Avatar of Taweret & Egypt\'s Champion',
    wikiSlug: 'Scarlet_Scarab',
    movieOrigin: 'Moon Knight (2022)',
    quote: 'I am an Egyptian superhero.',
    accentColor: '#d97706',
    avatarColor: 'from-amber-600 to-yellow-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c4/Scarlet_Scarab_Infobox.jpg/revision/latest?cb=20230824020647',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c4/Scarlet_Scarab_Infobox.jpg/revision/latest/scale-to-width-down/427?cb=20230824020647',
  },
  falcon_joaquin: {
    heroId: 'falcon_joaquin',
    heroName: 'Falcon (Joaquin Torres)',
    realName: 'Joaquin Torres',
    characterType: 'hero',
    role: 'logistics',
    title: 'Lieutenant & Aerial Recon Specialist',
    wikiSlug: 'Falcon',
    movieOrigin: 'The Falcon and the Winter Soldier (2021) / Captain America: Brave New World (2025)',
    quote: 'Keep flying, Cap. I got your six.',
    accentColor: '#10b981',
    avatarColor: 'from-emerald-600 to-teal-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Falcon_Infobox.png/revision/latest?cb=20250228094015',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Falcon_Infobox.png/revision/latest/scale-to-width-down/411?cb=20250228094015',
  },
  jessica_jones: {
    heroId: 'jessica_jones',
    heroName: 'Jessica Jones',
    realName: 'Jessica Campbell Jones',
    characterType: 'hero',
    role: 'combat',
    title: 'Alias Investigations Private Detective',
    wikiSlug: 'Jessica_Jones',
    movieOrigin: 'Marvel\'s Jessica Jones (2015-2019) / The Defenders (2017)',
    quote: 'Knowing it\'s real doesn\'t mean you don\'t get afraid. It means you\'re ready to fight.',
    accentColor: '#6366f1',
    avatarColor: 'from-indigo-600 to-slate-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/8a/Jessica_Jones_Infobox.png/revision/latest?cb=20260506204207',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/8a/Jessica_Jones_Infobox.png/revision/latest/scale-to-width-down/491?cb=20260506204207',
  },
  luke_cage: {
    heroId: 'luke_cage',
    heroName: 'Luke Cage',
    realName: 'Carl Lucas / Luke Cage',
    characterType: 'hero',
    role: 'command',
    title: 'Power Man & Harlem\'s Bulletproof Hero',
    wikiSlug: 'Luke_Cage',
    movieOrigin: 'Marvel\'s Luke Cage (2016-2018) / The Defenders (2017)',
    quote: 'Forward, always. Sweet Sister.',
    accentColor: '#f59e0b',
    avatarColor: 'from-amber-500 to-yellow-700',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/10/Luke_Cage.PNG/revision/latest?cb=20231026013234',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/10/Luke_Cage.PNG/revision/latest/scale-to-width-down/507?cb=20231026013234',
  },
  iron_fist: {
    heroId: 'iron_fist',
    heroName: 'Iron Fist (Danny Rand)',
    realName: 'Daniel Thomas Rand-K\'ai',
    characterType: 'hero',
    role: 'mystic',
    title: 'The Immortal Iron Fist & Protector of K\'un-Lun',
    wikiSlug: 'Iron_Fist',
    movieOrigin: 'Marvel\'s Iron Fist (2017-2018) / The Defenders (2017)',
    quote: 'I am the Iron Fist. I focus my Chi into my fist until it burns like unto a thing of iron.',
    accentColor: '#84cc16',
    avatarColor: 'from-lime-600 to-emerald-800',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e7/Iron_Fist_%28S2%29.jpg/revision/latest?cb=20240308171726',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e7/Iron_Fist_%28S2%29.jpg/revision/latest/scale-to-width-down/438?cb=20240308171726',
  },
  punisher: {
    heroId: 'punisher',
    heroName: 'The Punisher (Frank Castle)',
    realName: 'Francis David Castle Sr.',
    characterType: 'antihero',
    role: 'combat',
    title: 'One-Man War on Crime & USMC Veteran',
    wikiSlug: 'Punisher',
    movieOrigin: 'Daredevil (2016) / The Punisher (2017-2019) / Daredevil: Born Again (2025)',
    quote: 'One batch, two batch, penny and dime.',
    accentColor: '#64748b',
    avatarColor: 'from-zinc-700 to-neutral-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1c/Punisher_Infobox.png/revision/latest?cb=20260721110020',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1c/Punisher_Infobox.png/revision/latest/scale-to-width-down/455?cb=20260721110020',
  },
  nick_fury: {
    heroId: 'nick_fury',
    heroName: 'Nick Fury',
    realName: 'Nicholas Joseph Fury',
    characterType: 'hero',
    role: 'command',
    title: 'Former S.H.I.E.L.D. Director & Avenger Initiative Founder',
    wikiSlug: 'Nick_Fury',
    movieOrigin: 'Iron Man (2008) / The Avengers (2012) / Secret Invasion (2023)',
    quote: 'There was an idea, Stark knows this, called the Avengers Initiative.',
    accentColor: '#38bdf8',
    avatarColor: 'from-slate-700 to-black',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a3/Nick_Fury_Infobox.png/revision/latest?cb=20240802141551',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a3/Nick_Fury_Infobox.png/revision/latest/scale-to-width-down/471?cb=20240802141551',
  },
  wong: {
    heroId: 'wong',
    heroName: 'Wong (Sorcerer Supreme)',
    realName: 'Wong',
    characterType: 'hero',
    role: 'mystic',
    title: 'Sorcerer Supreme & Kamar-Taj Librarian',
    wikiSlug: 'Wong',
    movieOrigin: 'Doctor Strange (2016) / She-Hulk (2022)',
    quote: 'You break the rules and become a hero. I do it and become the enemy.',
    accentColor: '#f97316',
    avatarColor: 'from-amber-700 to-rose-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Wong_in_She-Hulk.jpg/revision/latest?cb=20240802144541',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Wong_in_She-Hulk.jpg/revision/latest/scale-to-width-down/378?cb=20240802144541',
  },
  vision: {
    heroId: 'vision',
    heroName: 'White Vision',
    realName: 'Vision (Reconstructed)',
    characterType: 'hero',
    role: 'science',
    title: 'Reconstructed S.W.O.R.D. Synthezoid & Ghost of the Mind Stone',
    wikiSlug: 'White_Vision',
    movieOrigin: 'WandaVision (2021) / Vision Quest',
    quote: 'I am Vision. I was a voice with no body, a body but not human, and now a memory made real.',
    accentColor: '#e2e8f0',
    avatarColor: 'from-slate-100 via-gray-300 to-slate-500',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/60/White_Vision_Infobox.jpg/revision/latest?cb=20260815234105',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/60/White_Vision_Infobox.jpg/revision/latest/scale-to-width-down/383?cb=20260815234105',
  },
  she_hulk: {
    heroId: 'she_hulk',
    heroName: 'She-Hulk',
    realName: 'Jennifer Walters',
    characterType: 'hero',
    role: 'engineering',
    title: 'Superhuman Law Division Attorney & Gamma Dynamo',
    wikiSlug: 'She-Hulk',
    movieOrigin: 'She-Hulk: Attorney at Law (2022)',
    quote: 'I\'m a lawyer, Bruce. And I\'m great at it.',
    accentColor: '#22c55e',
    avatarColor: 'from-emerald-600 to-green-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5a/She-Hulk_-_Infobox.jpg/revision/latest?cb=20231020212153',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5a/She-Hulk_-_Infobox.jpg/revision/latest/scale-to-width-down/444?cb=20231020212153',
  },
  wasp: {
    heroId: 'wasp',
    heroName: 'The Wasp',
    realName: 'Hope van Dyne',
    characterType: 'hero',
    role: 'science',
    title: 'Pym Particle Physicist & Aerial Infiltrator',
    wikiSlug: 'Wasp',
    movieOrigin: 'Ant-Man (2015) / Ant-Man and the Wasp: Quantumania (2023)',
    quote: 'It\'s about damn time.',
    accentColor: '#eab308',
    avatarColor: 'from-yellow-600 to-slate-900',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/22/Wasp_Quantumania.jpg/revision/latest?cb=20231124223547',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/22/Wasp_Quantumania.jpg/revision/latest/scale-to-width-down/416?cb=20231124223547',
  },
  kingpin: {
    heroId: 'kingpin',
    heroName: 'Kingpin',
    realName: 'Wilson Grant Fisk',
    characterType: 'villain',
    role: 'command',
    title: 'Lord of the Criminal Underworld & Mayor of New York',
    wikiSlug: 'Kingpin',
    movieOrigin: 'Daredevil (2015) / Hawkeye (2021) / Echo (2024)',
    quote: 'I am the ill intent who set upon the traveler on a path he should not have taken.',
    accentColor: '#f1f5f9',
    avatarColor: 'from-slate-200 via-neutral-400 to-black',
    fallbackImageUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9c/Kingpin_Infobox.jpg/revision/latest?cb=20260313171448',
    fallbackThumbnailUrl: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9c/Kingpin_Infobox.jpg/revision/latest/scale-to-width-down/450?cb=20260313171448',
  },
};

// In-memory cache for live MediaWiki Action API portrait lookups
const photoCache = new Map<string, {
  imageUrl: string;
  thumbnailUrl: string;
  resolvedAt: number;
}>();

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const MCU_WIKI_API_ENDPOINT = 'https://marvelcinematicuniverse.fandom.com/api.php';
const USER_AGENT = 'SakaarColonyMCUIntel/2.0 (Tactical Multiverse Relay; contact@sakaar.net)';

/**
 * Fetch official verified photo from the Marvel Cinematic Universe Wiki
 * via MediaWiki Action API (action=query&prop=pageimages)
 */
async function fetchWikiPhoto(wikiSlug: string): Promise<{ imageUrl: string; thumbnailUrl: string } | null> {
  try {
    const url = `${MCU_WIKI_API_ENDPOINT}?action=query&titles=${encodeURIComponent(wikiSlug)}&redirects=1&prop=pageimages&piprop=thumbnail|original&pithumbsize=600&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    for (const pid in pages) {
      const page = pages[pid];
      const thumb = page.thumbnail?.source;
      const original = page.original?.source;
      if (thumb || original) {
        return {
          imageUrl: original || thumb,
          thumbnailUrl: thumb || original,
        };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[MCU Photo Service] Failed fetching wiki photo for ${wikiSlug}:`, err);
    return null;
  }
}

/**
 * Resolves a complete photo profile for a specific hero ID or name query
 */
export async function resolveHeroPhoto(heroIdOrName: string): Promise<MCUHeroPhotoData | null> {
  const normalizedKey = heroIdOrName.toLowerCase().replace(/[-\s]+/g, '_');
  
  // Find exact key or match by heroName / realName
  let meta = MCU_HERO_CANONICAL_META[normalizedKey];
  if (!meta) {
    const found = Object.values(MCU_HERO_CANONICAL_META).find(
      (m) =>
        m.heroId.toLowerCase() === normalizedKey ||
        m.heroName.toLowerCase() === heroIdOrName.toLowerCase() ||
        m.realName.toLowerCase() === heroIdOrName.toLowerCase() ||
        m.wikiSlug.toLowerCase() === normalizedKey
    );
    if (found) meta = found;
  }

  if (!meta) {
    return null;
  }

  let imageUrl = meta.fallbackImageUrl;
  let thumbnailUrl = meta.fallbackThumbnailUrl;

  // Check cache
  const cached = photoCache.get(meta.heroId);
  if (cached && Date.now() - cached.resolvedAt < CACHE_TTL_MS) {
    imageUrl = cached.imageUrl;
    thumbnailUrl = cached.thumbnailUrl;
  } else if (meta.heroId === 'steve_rogers' || meta.heroId === 'captain_america') {
    // Steve Rogers is strictly pinned to the authentic Avengers: Endgame Chris Evans portrait.
    // This protects against the MCU Fandom wiki pageimage currently being overwritten with Sam Wilson concept art.
    imageUrl = meta.fallbackImageUrl;
    thumbnailUrl = meta.fallbackThumbnailUrl;
    photoCache.set(meta.heroId, {
      imageUrl,
      thumbnailUrl,
      resolvedAt: Date.now(),
    });
  } else {
    // Attempt live Action API resolution
    const live = await fetchWikiPhoto(meta.wikiSlug);
    if (live) {
      imageUrl = live.imageUrl;
      thumbnailUrl = live.thumbnailUrl;
      photoCache.set(meta.heroId, {
        imageUrl,
        thumbnailUrl,
        resolvedAt: Date.now(),
      });
    }
  }

  const hostPrefix = '';
  return {
    heroId: meta.heroId,
    heroName: meta.heroName,
    realName: meta.realName,
    characterType: meta.characterType,
    role: meta.role,
    title: meta.title,
    imageUrl,
    thumbnailUrl,
    rawImageEndpoint: `${hostPrefix}/api/heroes/${meta.heroId}/photo?format=image`,
    jsonEndpoint: `${hostPrefix}/api/heroes/${meta.heroId}/photo`,
    wikiUrl: `https://marvelcinematicuniverse.fandom.com/wiki/${encodeURIComponent(meta.wikiSlug)}`,
    wikiSlug: meta.wikiSlug,
    movieOrigin: meta.movieOrigin,
    quote: meta.quote,
    accentColor: meta.accentColor,
    avatarColor: meta.avatarColor,
    source: 'Marvel Cinematic Universe Official Profile Photo & MediaWiki Action API',
  };
}

/**
 * Returns full photo catalog with optional filtering
 */
export async function getHeroPhotoCatalog(query?: string, type?: string, role?: string): Promise<MCUPhotoCatalogResponse> {
  const allEntries = Object.values(MCU_HERO_CANONICAL_META);
  
  let filtered = allEntries;
  if (query) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (m) =>
        m.heroName.toLowerCase().includes(q) ||
        m.realName.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.heroId.toLowerCase().includes(q)
    );
  }
  if (type) {
    filtered = filtered.filter((m) => m.characterType === type);
  }
  if (role) {
    filtered = filtered.filter((m) => m.role === role);
  }

  const resolvedList = await Promise.all(filtered.map((m) => resolveHeroPhoto(m.heroId)));
  const validHeroes = resolvedList.filter((h): h is MCUHeroPhotoData => h !== null);

  return {
    success: true,
    total: validHeroes.length,
    heroes: validHeroes,
    apiNotice: 'Official MCU Character Portraits queried via MediaWiki Action API & Marvel Studios canon repository.',
    documentation: {
      singleHeroJson: 'GET /api/heroes/:id/photo -> Returns character metadata, wiki details, and high-res image URLs in JSON',
      singleHeroRawImage: 'GET /api/heroes/:id/photo?format=image or GET /api/heroes/:id/photo/raw -> Streams binary image bytes directly for <img> tags',
      catalog: 'GET /api/mcu/photos -> Lists all 56 available MCU character photos with search and filters',
      parameters: 'Query params supported: ?format=image|json, ?search=<name>, ?type=hero|villain|antihero, ?role=engineering|science|combat|mystic|logistics|command',
    },
  };
}

/**
 * Express Route Handler for /api/heroes/:id/photo and /api/mcu/photos/:id
 */
export async function handleHeroPhotoRequest(req: Request, res: Response): Promise<void> {
  try {
    const heroId = req.params.id || req.params.heroId;
    if (!heroId) {
      res.status(400).json({ error: 'Missing character :id parameter.' });
      return;
    }

    const photoData = await resolveHeroPhoto(heroId);
    if (!photoData) {
      res.status(404).json({
        error: `Character with identifier "${heroId}" was not found in the Sakaar Multiverse Registry.`,
        availableIds: Object.keys(MCU_HERO_CANONICAL_META),
      });
      return;
    }

    const format = (req.query.format as string)?.toLowerCase();
    const raw = req.query.raw === 'true' || req.query.view === 'image';
    const acceptHeader = req.headers['accept'] || '';
    const wantsImage = format === 'image' || raw || acceptHeader.includes('image/');

    if (wantsImage) {
      await streamImageResponse(photoData, req, res);
      return;
    }

    // Default: Return structured JSON
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({
      success: true,
      ...photoData,
      directEmbedUrl: `${req.protocol}://${req.get('host')}/api/heroes/${photoData.heroId}/photo?format=image`,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('[MCU Photo API] Error handling request:', error);
    res.status(500).json({
      error: 'Failed to retrieve character photo from MCU repository.',
      details: error?.message,
    });
  }
}

/**
 * Express Route Handler for directly streaming raw image bytes
 */
export async function handleRawHeroImageRequest(req: Request, res: Response): Promise<void> {
  const heroId = req.params.id || req.params.heroId;
  const photoData = await resolveHeroPhoto(heroId);
  if (!photoData) {
    res.status(404).json({ error: 'Character not found' });
    return;
  }
  await streamImageResponse(photoData, req, res);
}

/**
 * Stream binary image bytes directly with caching, CORS, and fallback redirection
 */
async function streamImageResponse(photoData: MCUHeroPhotoData, req: Request, res: Response): Promise<void> {
  const targetUrl = req.query.size === 'thumb' ? photoData.thumbnailUrl : (photoData.imageUrl || photoData.thumbnailUrl);
  
  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!upstreamRes.ok) {
      // Fallback: 302 redirect directly to source
      res.redirect(302, targetUrl);
      return;
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-MCU-Hero-ID', photoData.heroId);
    res.setHeader('X-MCU-Hero-Name', encodeURIComponent(photoData.heroName));

    const arrayBuffer = await upstreamRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.warn(`[MCU Photo Stream] Stream failed for ${photoData.heroId}, falling back to redirect:`, err);
    res.redirect(302, targetUrl);
  }
}
