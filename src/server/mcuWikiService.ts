/**
 * Marvel Cinematic Universe Wiki MediaWiki Action API Service
 * Endpoint: https://marvelcinematicuniverse.fandom.com/api.php
 * 
 * Uses the standard MediaWiki Action API (api.php) to search and retrieve authentic
 * MCU movie canon, character infoboxes, official synopses, powers, and citations.
 */

import type { MCUWikiArticle, MCUWikiInfobox } from '../types';

const MCU_WIKI_API_ENDPOINT = 'https://marvelcinematicuniverse.fandom.com/api.php';
const USER_AGENT = 'SakaarColonyMCUIntel/2.0 (Tactical Multiverse Relay; contact@sakaar.net)';

/**
 * Utility to strip complex wikitext templates, references, and wikilinks into clean readable text
 */
export function cleanWikitext(text: string): string {
  if (!text) return '';
  let cleaned = text
    .replace(/<ref\b[^>]*?\/>/gi, '')
    .replace(/<ref\b[^>]*>([\s\S]*?)<\/ref>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/\{\{DISPLAYTITLE:.*?\}\}/gis, '')
    .replace(/\{\{Citizenship\|(.*?)\}\}/gis, '$1')
    .replace(/\{\{WPS\|.*?\|(.*?)\}\}/gis, '$1')
    .replace(/\{\{wp\|(.*?)\}\}/gis, '$1')
    .replace(/\{\{Ref\|.*?\}\}/gis, '')
    .replace(/\{\{Alias\|.*?codenames\s*=\s*([^|}]+).*?\}\}/gis, '$1')
    .replace(/\[\[:File:[^\]|]+\|([^\]]+)\]\]/gi, '$1')
    .replace(/\[\[File:[^\]]+\]\]/gi, '')
    .replace(/\[\[Image:[^\]]+\]\]/gi, '')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<br\s*\/?>/gi, ', ')
    .replace(/<small>(.*?)<\/small>/gi, '($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/'''(.*?)'''/g, '$1')
    .replace(/''(.*?)''/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Strip dangling wiki brackets if any
  cleaned = cleaned.replace(/^[|{}\s]+|[|{}\s]+$/g, '').trim();
  return cleaned;
}

/**
 * Extract an infobox field value safely from raw wikitext
 * Handles both multiline and single-line pipe-delimited templates, preserving nested wikilinks
 */
function extractField(wikitext: string, fieldName: string): string | undefined {
  if (!wikitext) return undefined;
  // Strip references so pipes/attributes inside refs don't truncate the field
  const preStripped = wikitext
    .replace(/<ref\b[^>]*?\/>/gi, '')
    .replace(/<ref\b[^>]*>([\s\S]*?)<\/ref>/gi, '');

  const regex = new RegExp(`\\|\\s*${fieldName}\\s*=\\s*`, 'i');
  const match = preStripped.match(regex);
  if (!match || match.index === undefined) return undefined;

  const start = match.index + match[0].length;
  let bracketDepth = 0;
  let linkDepth = 0;
  let end = start;

  while (end < preStripped.length) {
    const char = preStripped[end];
    const nextChar = preStripped[end + 1];

    if (char === '[' && nextChar === '[') {
      linkDepth++;
      end += 2;
      continue;
    }
    if (char === ']' && nextChar === ']') {
      if (linkDepth > 0) linkDepth--;
      end += 2;
      continue;
    }
    if (char === '{' && nextChar === '{') {
      bracketDepth++;
      end += 2;
      continue;
    }
    if (char === '}' && nextChar === '}') {
      if (bracketDepth > 0) {
        bracketDepth--;
        end += 2;
        continue;
      } else {
        break;
      }
    }

    // When at top level (not inside [[ ]] or {{ }})
    if (linkDepth === 0 && bracketDepth === 0) {
      if (char === '|') break;
      if (char === '\n' && (nextChar === '|' || nextChar === '}')) break;
    }

    end++;
  }

  const rawVal = preStripped.slice(start, end).trim();
  if (!rawVal) return undefined;
  const cleaned = cleanWikitext(rawVal);
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Extract multiple items separated by commas, br tags, or bullet points
 */
function extractListField(wikitext: string, fieldName: string): string[] | undefined {
  const raw = extractField(wikitext, fieldName);
  if (!raw) return undefined;
  const items = raw
    .split(/,|\n|\*|\u2022/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('{') && !s.endsWith('}'));
  return items.length > 0 ? items : undefined;
}

/**
 * Extracts quotes from wikitext
 */
function extractQuotes(wikitext: string): string[] {
  const quotes: string[] = [];
  const quoteRegex = /\{\{Quote\|(.*?)\|(.*?)(?:\|.*?)*\}\}/gis;
  let match;
  while ((match = quoteRegex.exec(wikitext)) !== null && quotes.length < 3) {
    const quoteText = cleanWikitext(match[1]);
    const speaker = cleanWikitext(match[2] || '');
    if (quoteText.length > 10) {
      quotes.push(speaker ? `«${quoteText}» — ${speaker}` : `«${quoteText}»`);
    }
  }
  return quotes;
}

/**
 * Extract a named section from wikitext (e.g. Synopsis, Plot, Powers)
 */
function extractSectionContent(wikitext: string, sectionHeaderName: string): string | undefined {
  const regex = new RegExp(`==+\\s*${sectionHeaderName}\\s*==+([\\s\\S]*?)(?===+|$)`, 'i');
  const match = wikitext.match(regex);
  if (!match || !match[1]) return undefined;
  const cleaned = cleanWikitext(match[1]);
  return cleaned.length > 15 ? cleaned : undefined;
}

/**
 * Queries the Marvel Cinematic Universe Wiki MediaWiki Action API
 */
export async function searchAndFetchMCUWiki(userQuery: string): Promise<MCUWikiArticle | null> {
  try {
    const cleanQuery = userQuery
      .replace(/insignia|symbol|logo|design/gi, '')
      .trim() || userQuery;

    // 1. MediaWiki Action API Search: action=query&list=search
    const searchUrl = `${MCU_WIKI_API_ENDPOINT}?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&srlimit=8&format=json`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!searchRes.ok) {
      console.warn(`MediaWiki search failed with status: ${searchRes.status}`);
      return null;
    }

    const searchJson = await searchRes.json();
    const searchResults: any[] = searchJson.query?.search || [];

    if (searchResults.length === 0) {
      return null;
    }

    const topHit = searchResults[0];
    const pageId = topHit.pageid;
    const pageTitle = topHit.title;

    // 2. Fetch page info, canonical URL, and thumbnail image
    const infoUrl = `${MCU_WIKI_API_ENDPOINT}?action=query&prop=info|pageimages&piprop=thumbnail|original&pithumbsize=600&inprop=url&pageids=${pageId}&format=json`;
    const infoRes = await fetch(infoUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const infoJson = await infoRes.json();
    const pageData = infoJson.query?.pages?.[pageId] || {};

    const canonicalUrl = pageData.canonicalurl || pageData.fullurl || `https://marvelcinematicuniverse.fandom.com/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
    const imageUrl = pageData.thumbnail?.source || pageData.original?.source || undefined;

    // 3. Fetch full parsed wikitext & sections & categories
    const parseUrl = `${MCU_WIKI_API_ENDPOINT}?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext|sections|categories&format=json`;
    const parseRes = await fetch(parseUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const parseJson = await parseRes.json();
    const wikitext: string = parseJson.parse?.wikitext?.['*'] || '';

    // Determine category
    const isMovie = /\{\{Movie/i.test(wikitext) || /director\s*=/i.test(wikitext);
    const isTV = /\{\{TV/i.test(wikitext) || /showrunners?\s*=/i.test(wikitext) || /channel\s*=/i.test(wikitext) || /series/i.test(pageTitle);
    const isCharacter = /\{\{Character/i.test(wikitext) || /real name\s*=/i.test(wikitext);
    const categoryType = isMovie ? 'movie' : (isTV ? 'tv' : (isCharacter ? 'character' : 'general'));

    // Build infobox
    const infobox: MCUWikiInfobox = {
      category: categoryType,
      imageUrl,
      realName: extractField(wikitext, 'real name') || extractField(wikitext, 'name'),
      actor: extractField(wikitext, 'actor') || extractField(wikitext, 'portrayed by'),
      director: extractField(wikitext, 'director'),
      showrunner: extractField(wikitext, 'showrunners') || extractField(wikitext, 'creator'),
      network: extractField(wikitext, 'channel') || extractField(wikitext, 'network'),
      episodes: extractField(wikitext, 'episodes') || extractField(wikitext, 'no. of episodes'),
      seasons: extractField(wikitext, 'seasons') || extractField(wikitext, 'no. of seasons'),
      writers: extractListField(wikitext, 'writer') || extractListField(wikitext, 'screenplay'),
      producers: extractListField(wikitext, 'producer') || extractListField(wikitext, 'exproducers'),
      release: extractField(wikitext, 'release') || extractField(wikitext, 'released') || extractField(wikitext, 'dates') || extractField(wikitext, 'start') || extractField(wikitext, 'premiere'),
      runtime: extractField(wikitext, 'runtime'),
      boxoffice: extractField(wikitext, 'boxoffice') || extractField(wikitext, 'budget'),
      previousFilm: extractField(wikitext, 'Prev'),
      nextFilm: extractField(wikitext, 'Next'),
      movies: categoryType === 'character' ? (extractListField(wikitext, 'movie') || extractListField(wikitext, 'appearances')) : undefined,
      status: extractField(wikitext, 'status'),
      species: extractField(wikitext, 'species'),
      citizenship: extractField(wikitext, 'citizenship'),
      aliases: extractListField(wikitext, 'alias') || extractListField(wikitext, 'codenames'),
      quote: extractField(wikitext, 'quote'),
    };

    // Extract Quotes
    const quotes = extractQuotes(wikitext);

    // Extract Synopsis or Lead
    const synopsisRaw = extractSectionContent(wikitext, 'Synopsis') || extractSectionContent(wikitext, 'Plot');
    const synopsis = synopsisRaw ? (synopsisRaw.length > 1200 ? synopsisRaw.substring(0, 1200) + '...' : synopsisRaw) : undefined;

    // Extract Powers and Abilities
    const powersRaw = extractSectionContent(wikitext, 'Powers and Abilities') || extractSectionContent(wikitext, 'Powers');
    const powersAndAbilities = powersRaw
      ? powersRaw
          .split(/\n|\*|\u2022/)
          .map(s => s.trim())
          .filter(s => s.length > 5 && s.length < 200 && !s.startsWith('=='))
          .slice(0, 6)
      : undefined;

    // Extract Equipment
    const equipRaw = extractSectionContent(wikitext, 'Equipment') || extractSectionContent(wikitext, 'Weapons');
    const equipment = equipRaw
      ? equipRaw
          .split(/\n|\*|\u2022/)
          .map(s => s.trim())
          .filter(s => s.length > 4 && s.length < 150 && !s.startsWith('=='))
          .slice(0, 6)
      : undefined;

    // Extract Lead Paragraph (before first == section)
    const leadTextRaw = wikitext.split(/==+/)[0];
    const cleanedLead = cleanWikitext(leadTextRaw)
      .split('\n\n')
      .find(p => p.length > 50 && !p.startsWith('{'));
    const leadParagraph = cleanedLead || `${pageTitle} is an official canon asset documented in the Marvel Cinematic Universe Wiki database.`;

    // Related Search Results
    const relatedPages = searchResults.slice(1, 6).map(r => ({
      title: r.title,
      url: `https://marvelcinematicuniverse.fandom.com/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
      snippet: cleanWikitext(r.snippet || ''),
    }));

    // Categories
    const categories: string[] = (parseJson.parse?.categories || [])
      .map((c: any) => c['*'])
      .filter((c: string) => !c.includes('hidden') && !c.includes('stub'))
      .slice(0, 8);

    return {
      pageId,
      title: pageTitle,
      canonicalUrl,
      imageUrl,
      snippet: cleanWikitext(topHit.snippet || ''),
      infobox,
      leadParagraph,
      synopsis,
      powersAndAbilities,
      equipment,
      quotes,
      relatedPages,
      categories,
      apiEndpointUsed: MCU_WIKI_API_ENDPOINT,
      rawApiParams: {
        action: 'query | parse',
        searchEndpoint: searchUrl,
        pageId: String(pageId),
        format: 'json',
      },
    };
  } catch (error) {
    console.error('Error querying Marvel Cinematic Universe Wiki API:', error);
    return null;
  }
}

/**
 * Format an authoritative tactical analysis text from the parsed Wiki Article
 */
export function formatWikiMarkdownAnalysis(wiki: MCUWikiArticle, query: string): string {
  const parts: string[] = [];

  parts.push(`### [MCU Canon Database] ${wiki.title}`);
  parts.push(`*Direct Source: [The Marvel Cinematic Universe Wiki (MediaWiki Action API)](${wiki.canonicalUrl})*\n`);

  if (wiki.quotes && wiki.quotes.length > 0) {
    parts.push(`> ${wiki.quotes[0]}\n`);
  }

  // Quick Canon Metadata
  const info = wiki.infobox;
  if (info) {
    parts.push(`**Official Canon Status:**`);
    if (info.category === 'movie') {
      if (info.director) parts.push(`- **Director:** ${info.director}`);
      if (info.writers && info.writers.length > 0) parts.push(`- **Writers:** ${info.writers.join(', ')}`);
      if (info.release) parts.push(`- **Theatrical Release:** ${info.release}`);
      if (info.runtime) parts.push(`- **Runtime:** ${info.runtime}`);
      if (info.boxoffice) parts.push(`- **Box Office:** ${info.boxoffice}`);
      if (info.previousFilm) parts.push(`- **Preceding Phase Film:** ${info.previousFilm}`);
      if (info.nextFilm) parts.push(`- **Subsequent Film:** ${info.nextFilm}`);
    } else if (info.category === 'tv') {
      if (info.showrunner) parts.push(`- **Showrunner / Creator:** ${info.showrunner}`);
      if (info.network) parts.push(`- **Original Network:** ${info.network}`);
      if (info.release) parts.push(`- **Release / Broadcast Dates:** ${info.release}`);
      if (info.episodes) parts.push(`- **Episodes:** ${info.episodes}`);
      if (info.runtime) parts.push(`- **Total Runtime:** ${info.runtime}`);
      if (info.previousFilm) parts.push(`- **Preceding MCU Entry:** ${info.previousFilm}`);
      if (info.nextFilm) parts.push(`- **Subsequent MCU Entry:** ${info.nextFilm}`);
    } else {
      if (info.realName) parts.push(`- **Identity / Real Name:** ${info.realName}`);
      if (info.actor) parts.push(`- **Portrayed by:** ${info.actor}`);
      if (info.status) parts.push(`- **Multiverse Vital Status:** ${info.status}`);
      if (info.species) parts.push(`- **Species:** ${info.species}`);
      if (info.citizenship) parts.push(`- **Origin / Citizenship:** ${info.citizenship}`);
      if (info.movies && info.movies.length > 0) parts.push(`- **Key Cinematic Appearances:** ${info.movies.join(', ')}`);
    }
    parts.push('');
  }

  // Lead Lore
  if (wiki.leadParagraph) {
    parts.push(`**Cinematic Overview:**\n${wiki.leadParagraph}\n`);
  }

  // Synopsis / Narrative Arc
  if (wiki.synopsis) {
    parts.push(`**Official Narrative & Synopsis:**\n${wiki.synopsis}\n`);
  }

  // Powers or Abilities
  if (wiki.powersAndAbilities && wiki.powersAndAbilities.length > 0) {
    parts.push(`**Documented Superhuman Abilities & Powers:**`);
    wiki.powersAndAbilities.forEach(p => parts.push(`- ${p}`));
    parts.push('');
  }

  // Tactical Equipment
  if (wiki.equipment && wiki.equipment.length > 0) {
    parts.push(`**Tactical Equipment & Combat Armament:**`);
    wiki.equipment.forEach(e => parts.push(`- ${e}`));
    parts.push('');
  }

  // Sakaar Colony Deployment Protocol
  parts.push(`**Sakaar Space Colony Deployment:**`);
  parts.push(
    `Entity / asset ${wiki.title} is registered in the Grandmaster's Multiverse Relay. ` +
    `Utilize specialized energy dampeners, vibranium conduits, or arena combat protocols when deploying to outer orbital sectors or scrap retrieval expeditions.`
  );

  return parts.join('\n');
}
