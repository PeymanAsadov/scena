export interface Movie {
    id: string | number;
    title: string;
    poster_path: string;
    vote_average: number;
    embedId?: string;
    release_date?: string;
}