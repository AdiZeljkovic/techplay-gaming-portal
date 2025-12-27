// RAWG.io API Service for Games Database
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || '';
const BASE_URL = 'https://api.rawg.io/api';

export interface RawgGame {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    background_image_additional?: string;
    rating: number;
    rating_top: number;
    metacritic?: number;
    playtime?: number;
    description_raw?: string;
    description?: string;
    website?: string;
    genres: { id: number; name: string; slug: string }[];
    parent_platforms: { platform: { id: number; name: string; slug: string } }[];
    platforms: {
        platform: { id: number; name: string; slug: string };
        requirements_en?: { minimum: string; recommended: string };
    }[];
    developers: { id: number; name: string; slug: string }[];
    publishers: { id: number; name: string; slug: string }[];
    stores: { store: { id: number; name: string; domain: string }; url: string }[];
    tags: { id: number; name: string; slug: string }[];
    esrb_rating?: { id: number; name: string };
}

export interface RawgScreenshot {
    id: number;
    image: string;
    width: number;
    height: number;
}

export interface RawgMovie {
    id: number;
    name: string;
    preview: string;
    data: { 480: string; max: string };
}

interface FetchGamesParams {
    page?: number;
    page_size?: number;
    search?: string;
    dates?: string;
    ordering?: string;
    platforms?: string;
    genres?: string;
    parent_platforms?: string;
}

const fetchFromApi = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (API_KEY) {
        url.searchParams.append('key', API_KEY);
    }

    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            url.searchParams.append(key, params[key].toString());
        }
    });

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });

    if (!response.ok) {
        throw new Error(`RAWG API Error: ${response.statusText}`);
    }

    return response.json();
};

export const rawgService = {
    // Get list of games
    async getGames(params: FetchGamesParams) {
        return fetchFromApi<{ count: number; next: string | null; results: RawgGame[] }>('/games', params);
    },

    // Get single game details
    async getGameDetails(idOrSlug: string | number) {
        return fetchFromApi<RawgGame>(`/games/${idOrSlug}`);
    },

    // Get screenshots
    async getGameScreenshots(idOrSlug: string | number) {
        return fetchFromApi<{ count: number; results: RawgScreenshot[] }>(`/games/${idOrSlug}/screenshots`);
    },

    // Get trailers/movies
    async getGameTrailers(idOrSlug: string | number) {
        return fetchFromApi<{ count: number; results: RawgMovie[] }>(`/games/${idOrSlug}/movies`);
    },
};

// Mock data for when API key is not available
export const MOCK_GAMES: RawgGame[] = [
    {
        id: 1,
        slug: 'the-witcher-3-wild-hunt',
        name: 'The Witcher 3: Wild Hunt',
        released: '2015-05-19',
        background_image: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6f6f84.jpg',
        rating: 4.66,
        rating_top: 5,
        metacritic: 92,
        playtime: 46,
        genres: [{ id: 5, name: 'RPG', slug: 'role-playing-games-rpg' }],
        parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
        platforms: [],
        developers: [{ id: 9023, name: 'CD Projekt RED', slug: 'cd-projekt-red' }],
        publishers: [],
        stores: [{ store: { id: 1, name: 'Steam', domain: 'store.steampowered.com' }, url: '' }],
        tags: [{ id: 31, name: 'Singleplayer', slug: 'singleplayer' }],
    },
    {
        id: 2,
        slug: 'elden-ring',
        name: 'Elden Ring',
        released: '2022-02-25',
        background_image: 'https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg',
        rating: 4.37,
        rating_top: 5,
        metacritic: 96,
        playtime: 55,
        genres: [{ id: 5, name: 'RPG', slug: 'role-playing-games-rpg' }, { id: 4, name: 'Action', slug: 'action' }],
        parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
        platforms: [],
        developers: [{ id: 8257, name: 'FromSoftware', slug: 'fromsoftware' }],
        publishers: [],
        stores: [{ store: { id: 1, name: 'Steam', domain: 'store.steampowered.com' }, url: '' }],
        tags: [{ id: 69, name: 'Action-Adventure', slug: 'action-adventure' }],
    },
    {
        id: 3,
        slug: 'cyberpunk-2077',
        name: 'Cyberpunk 2077',
        released: '2020-12-10',
        background_image: 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg',
        rating: 4.14,
        rating_top: 5,
        metacritic: 86,
        playtime: 22,
        genres: [{ id: 5, name: 'RPG', slug: 'role-playing-games-rpg' }],
        parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
        platforms: [],
        developers: [{ id: 9023, name: 'CD Projekt RED', slug: 'cd-projekt-red' }],
        publishers: [],
        stores: [{ store: { id: 1, name: 'Steam', domain: 'store.steampowered.com' }, url: '' }],
        tags: [{ id: 31, name: 'Singleplayer', slug: 'singleplayer' }],
    },
    {
        id: 4,
        slug: 'baldurs-gate-3',
        name: "Baldur's Gate 3",
        released: '2023-08-03',
        background_image: 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg',
        rating: 4.54,
        rating_top: 5,
        metacritic: 96,
        playtime: 99,
        genres: [{ id: 5, name: 'RPG', slug: 'role-playing-games-rpg' }],
        parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
        platforms: [],
        developers: [{ id: 1971, name: 'Larian Studios', slug: 'larian-studios' }],
        publishers: [],
        stores: [{ store: { id: 1, name: 'Steam', domain: 'store.steampowered.com' }, url: '' }],
        tags: [{ id: 31, name: 'Singleplayer', slug: 'singleplayer' }],
    },
    {
        id: 5,
        slug: 'red-dead-redemption-2',
        name: 'Red Dead Redemption 2',
        released: '2018-10-26',
        background_image: 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg',
        rating: 4.59,
        rating_top: 5,
        metacritic: 97,
        playtime: 20,
        genres: [{ id: 4, name: 'Action', slug: 'action' }],
        parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
        platforms: [],
        developers: [{ id: 10, name: 'Rockstar Games', slug: 'rockstar-games' }],
        publishers: [],
        stores: [{ store: { id: 1, name: 'Steam', domain: 'store.steampowered.com' }, url: '' }],
        tags: [{ id: 69, name: 'Action-Adventure', slug: 'action-adventure' }],
    },
    {
        id: 6,
        slug: 'god-of-war-2018',
        name: 'God of War (2018)',
        released: '2018-04-20',
        background_image: 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg',
        rating: 4.58,
        rating_top: 5,
        metacritic: 94,
        playtime: 12,
        genres: [{ id: 4, name: 'Action', slug: 'action' }],
        parent_platforms: [{ platform: { id: 2, name: 'PlayStation', slug: 'playstation' } }],
        platforms: [],
        developers: [{ id: 15, name: 'Santa Monica Studio', slug: 'santa-monica-studio' }],
        publishers: [],
        stores: [{ store: { id: 3, name: 'PlayStation Store', domain: 'store.playstation.com' }, url: '' }],
        tags: [{ id: 69, name: 'Action-Adventure', slug: 'action-adventure' }],
    },
];
