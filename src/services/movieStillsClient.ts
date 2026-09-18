/**
 * Client-Side Movie Photo Stills Service & Hook
 * Interacts with /api/movie-stills (IMDb API & Movie Database API)
 */
import { useState, useEffect } from 'react';

export interface MovieStillData {
  id: string;
  title: string;
  imdbId?: string;
  imdbUrl?: string;
  stillUrl: string;
  source: 'imdb_api' | 'mcu_wiki_db' | 'wikipedia_api' | 'cinematic_db';
  sourceLabel: string;
  caption?: string;
  releaseYear?: string;
  stars?: string[];
}

// Fallback stills cache in client
const CLIENT_FALLBACK_STILLS: Record<string, MovieStillData> = {
  spider_man_brand_new_day: {
    id: 'spider_man_brand_new_day',
    title: 'Spider-Man: Brand New Day',
    imdbId: 'tt22084616',
    imdbUrl: 'https://www.imdb.com/title/tt22084616/',
    stillUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1920&auto=format&fit=crop',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt22084616)',
    caption: 'Spider-Man street-level patrol in Manhattan',
    releaseYear: '2026'
  },
  avengers_doomsday: {
    id: 'avengers_doomsday',
    title: 'Avengers: Doomsday',
    imdbId: 'tt21357150',
    imdbUrl: 'https://www.imdb.com/title/tt21357150/',
    stillUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt21357150)',
    caption: 'Doctor Doom multiversal convergence',
    releaseYear: '2026'
  },
  avengers_secret_wars: {
    id: 'avengers_secret_wars',
    title: 'Avengers: Secret Wars',
    imdbId: 'tt21361444',
    imdbUrl: 'https://www.imdb.com/title/tt21361444/',
    stillUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt21361444)',
    caption: 'The Battleworld multiversal climax',
    releaseYear: '2027'
  },
  x_men_mcu: {
    id: 'x_men_mcu',
    title: 'X-Men',
    imdbId: 'tt29347085',
    imdbUrl: 'https://www.imdb.com/title/tt29347085/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BNGVkMTFjNDUtYTBhOC00ZjZjLTk5M2ItMWZmYmExNjZhYmMxXkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt29347085)',
    caption: 'Untitled Marvel Studios X-Men Film · Mutant Saga',
    releaseYear: '2028'
  },
  ghost_rider_mcu: {
    id: 'ghost_rider_mcu',
    title: 'Ghost Rider',
    imdbId: 'tt43711959',
    imdbUrl: 'https://www.imdb.com/title/tt43711959/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BOGJlYTk1Y2EtYTFmZi00NjIwLWFhOTMtMjdiNThhYTNlNDY5XkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt43711959)',
    caption: 'Ghost Rider · Spirit of Vengeance',
    releaseYear: '2028'
  },
  black_panther_3: {
    id: 'black_panther_3',
    title: 'Black Panther 3',
    imdbId: 'tt37884905',
    imdbUrl: 'https://www.imdb.com/title/tt37884905/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BNjNhNzIzNWQtMGNiYy00YTM5LWE2YzQtNjBkNTRjNDU4ZjM3XkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt37884905)',
    caption: 'The Kingdom of Wakanda and Golden City high vibranium defense.',
    releaseYear: '2028'
  },
  armor_wars: {
    id: 'armor_wars',
    title: 'Armor Wars',
    imdbId: 'tt13623128',
    imdbUrl: 'https://www.imdb.com/title/tt13623128/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BZjU4OWQwOWEtZjM2Ni00MTE1LTlmMzAtOWY3NWQwYjY2Y2RlXkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt13623128)',
    caption: 'James Rhodes recovers stolen Stark tech across planetary arsenals.',
    releaseYear: 'Coming Soon'
  },
  blade: {
    id: 'blade',
    title: 'Blade',
    imdbId: 'tt10671440',
    imdbUrl: 'https://www.imdb.com/title/tt10671440/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BMmFhYzljNzUtMDcyOC00MTI1LTgwM2YtMjdlOTBiZDU2YTk2XkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt10671440)',
    caption: 'Eric Brooks stalks the supernatural shadows of the MCU underworld.',
    releaseYear: 'Coming Soon'
  },
  nova: {
    id: 'nova',
    title: 'Nova',
    imdbId: 'tt19037048',
    imdbUrl: 'https://www.imdb.com/title/tt19037048/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BMGQ3MzAwZjgtZjA5Yi00YTBkLTgyN2MtYzgwYTQwNjE2ZWE5XkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt19037048)',
    caption: 'Centurion Richard Rider channels the Nova Force across the cosmos.',
    releaseYear: 'Coming Soon'
  },
  daredevil_born_again: {
    id: 'daredevil_born_again',
    title: 'Daredevil: Born Again Season 3',
    imdbId: 'tt18923754',
    imdbUrl: 'https://www.imdb.com/title/tt18923754/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BNDBkMWRhMzEtM2M0Ny00OGZhLThkZGMtMTY1NWUwZWNhODdiXkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt18923754)',
    caption: 'Matt Murdock returns to defend Hell’s Kitchen in Season 3.',
    releaseYear: 'Coming Soon'
  },
  vision_quest: {
    id: 'vision_quest',
    title: 'Vision Quest',
    imdbId: 'tt23112594',
    imdbUrl: 'https://www.imdb.com/title/tt23112594/',
    stillUrl: 'https://m.media-amazon.com/images/M/MV5BY2FlNjIxMDktMGYyZi00NjY3LWI4YjctYTcxNzc2MDUwYjZmXkEyXkFqcGc@._V1_FMjpg_UX1920_.jpg',
    source: 'imdb_api',
    sourceLabel: 'IMDb Photo Still (tt23112594)',
    caption: 'White Vision explores his humanity facing the resurgence of Ultron.',
    releaseYear: '2026'
  }
};

let cachedStills: Record<string, MovieStillData> = { ...CLIENT_FALLBACK_STILLS };
let fetchPromise: Promise<Record<string, MovieStillData>> | null = null;

export async function fetchAllMovieStills(): Promise<Record<string, MovieStillData>> {
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/movie-stills/all');
      if (res.ok) {
        const data = await res.json();
        if (data && data.stills) {
          cachedStills = { ...cachedStills, ...data.stills };
          return cachedStills;
        }
      }
    } catch (e) {
      console.warn('Using client cached stills for ticket backgrounds:', e);
    }
    return cachedStills;
  })();

  return fetchPromise;
}

export function useMovieStills() {
  const [stills, setStills] = useState<Record<string, MovieStillData>>(cachedStills);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchAllMovieStills().then((data) => {
      if (isMounted) {
        setStills(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getStillForMovie = (movieId: string, title?: string): MovieStillData => {
    if (stills[movieId]) return stills[movieId];
    if (CLIENT_FALLBACK_STILLS[movieId]) return CLIENT_FALLBACK_STILLS[movieId];

    return {
      id: movieId,
      title: title || movieId,
      stillUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
      source: 'cinematic_db',
      sourceLabel: 'Cinematic Still Background'
    };
  };

  return { stills, isLoading, getStillForMovie };
}
