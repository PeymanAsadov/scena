// src/data/api/tmdb.ts

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface CreditsResponse {
    cast: CastMember[];
}


export async function getMovieCredits(tmdbId: number): Promise<CastMember[]> {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`TMDB credits sorğusu uğursuz oldu: ${response.status}`);
        }

        const data: CreditsResponse = await response.json();
        return data.cast.slice(0, 8);
    } catch (error) {
        console.error("Cast məlumatı çəkilərkən xəta:", error);
        return [];
    }
}

export function getCastImageUrl(profilePath: string | null): string | null {
    if (!profilePath) return null;
    return `${TMDB_IMAGE_BASE}${profilePath}`;
}