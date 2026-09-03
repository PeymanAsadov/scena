const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    total_episode_count?: number;
}

export const getMovieCredits = async (movieId: number): Promise<CastMember[]> => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await res.json();
    return data.cast || [];
};

// 1. Popular Series 
export const getPopularSeries = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
    return res.json();
};

// 2. Series Details and Cast
export const getSeriesDetails = async (seriesId: number) => {
    const res = await fetch(
        `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=credits,external_ids`
    );
    return res.json();
};

// 3. Season and Episode Details
export const getSeasonDetails = async (seriesId: number, seasonNumber: number) => {
    const res = await fetch(
        `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}`
    );
    return res.json();
};

// Picture URL helper
export const getCastImageUrl = (path: string | null) => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}${path}`;
};