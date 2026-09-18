/**
 * Official Marvel Cinematic Universe verified character portrait URLs
 * Sourced from Marvel Studios official promotional material, MCU Wiki, and Wikimedia Commons.
 */

/**
 * Official Marvel Cinematic Universe verified character portrait URLs
 * Sourced from the live MCU Photo API endpoint (/api/heroes/:id/photo?format=image)
 * which streams authentic high-resolution MCU film stills and official MediaWiki Action API portraits.
 */

export const MCU_HERO_PHOTOS: Record<string, string> = {
  // Founding Avengers & Cosmic Defenders
  iron_man: '/api/heroes/iron_man/photo?format=image',
  hulk: '/api/heroes/hulk/photo?format=image',
  rocket: '/api/heroes/rocket/photo?format=image',
  thor: '/api/heroes/thor/photo?format=image',
  doctor_strange: '/api/heroes/doctor_strange/photo?format=image',
  captain_marvel: '/api/heroes/captain_marvel/photo?format=image',
  shuri: '/api/heroes/shuri/photo?format=image',
  ant_man: '/api/heroes/ant_man/photo?format=image',
  star_lord: '/api/heroes/star_lord/photo?format=image',
  valkyrie: '/api/heroes/valkyrie/photo?format=image',
  mobius: '/api/heroes/mobius/photo?format=image',
  aiko_oxe: '/api/heroes/aiko_oxe/photo?format=image',
  damage_control_director: '/api/heroes/damage_control_director/photo?format=image',

  // Spider-Man & Champions
  spider_man: '/api/heroes/spider_man/photo?format=image',
  spider_man_raimi: '/api/heroes/spider_man_raimi/photo?format=image',
  shang_chi: '/api/heroes/shang_chi/photo?format=image',
  wonder_man: '/api/heroes/wonder_man/photo?format=image',
  yelena_belova: '/api/heroes/yelena_belova/photo?format=image',
  bucky_barnes: '/api/heroes/bucky_barnes/photo?format=image',
  us_agent: '/api/heroes/us_agent/photo?format=image',
  red_guardian: '/api/heroes/red_guardian/photo?format=image',
  sam_wilson: '/api/heroes/sam_wilson/photo?format=image',
  matt_murdock: '/api/heroes/matt_murdock/photo?format=image',
  kate_bishop: '/api/heroes/kate_bishop/photo?format=image',

  // Villains & Cosmic Rogues
  thanos: '/api/heroes/thanos/photo?format=image',
  loki: '/api/heroes/loki/photo?format=image',
  hela: '/api/heroes/hela/photo?format=image',
  ultron: '/api/heroes/ultron/photo?format=image',
  killmonger: '/api/heroes/killmonger/photo?format=image',
  green_goblin: '/api/heroes/green_goblin/photo?format=image',
  grandmaster: '/api/heroes/grandmaster/photo?format=image',
  wenwu: '/api/heroes/wenwu/photo?format=image',
  gorr: '/api/heroes/gorr/photo?format=image',
  kang: '/api/heroes/kang/photo?format=image',

  // Expanded Gigantic Roster
  deadpool: '/api/heroes/deadpool/photo?format=image',
  wolverine: '/api/heroes/wolverine/photo?format=image',
  doctor_doom: '/api/heroes/doctor_doom/photo?format=image',
  wanda_maximoff: '/api/heroes/wanda_maximoff/photo?format=image',
  steve_rogers: '/api/heroes/steve_rogers/photo?format=image',
  natasha_romanoff: '/api/heroes/natasha_romanoff/photo?format=image',
  clint_barton: '/api/heroes/clint_barton/photo?format=image',
  james_rhodes: '/api/heroes/james_rhodes/photo?format=image',
  moon_knight: '/api/heroes/moon_knight/photo?format=image',
  kamala_khan: '/api/heroes/kamala_khan/photo?format=image',
  gamora: '/api/heroes/gamora/photo?format=image',
  drax: '/api/heroes/drax/photo?format=image',
  groot: '/api/heroes/groot/photo?format=image',
  nebula: '/api/heroes/nebula/photo?format=image',
  mantis: '/api/heroes/mantis/photo?format=image',
  namor: '/api/heroes/namor/photo?format=image',
  agatha_harkness: '/api/heroes/agatha_harkness/photo?format=image',
  high_evolutionary: '/api/heroes/high_evolutionary/photo?format=image',
  mister_fantastic: '/api/heroes/mister_fantastic/photo?format=image',
  sentry: '/api/heroes/sentry/photo?format=image',
  ghost: '/api/heroes/ghost/photo?format=image',
  taskmaster: '/api/heroes/taskmaster/photo?format=image',

  // Newly Commissioned Champions, Street-Level Heroes & Tactical Command
  captain_america: '/api/heroes/steve_rogers/photo?format=image',
  scarlet_scarab: '/api/heroes/scarlet_scarab/photo?format=image',
  falcon_joaquin: '/api/heroes/falcon_joaquin/photo?format=image',
  jessica_jones: '/api/heroes/jessica_jones/photo?format=image',
  luke_cage: '/api/heroes/luke_cage/photo?format=image',
  iron_fist: '/api/heroes/iron_fist/photo?format=image',
  punisher: '/api/heroes/punisher/photo?format=image',
  nick_fury: '/api/heroes/nick_fury/photo?format=image',
  wong: '/api/heroes/wong/photo?format=image',
  vision: '/api/heroes/vision/photo?format=image',
  she_hulk: '/api/heroes/she_hulk/photo?format=image',
  wasp: '/api/heroes/wasp/photo?format=image',
  kingpin: '/api/heroes/kingpin/photo?format=image',
};

export const getHeroPhotoUrl = (heroId: string): string => {
  return MCU_HERO_PHOTOS[heroId] || `/api/heroes/${heroId}/photo?format=image`;
};
