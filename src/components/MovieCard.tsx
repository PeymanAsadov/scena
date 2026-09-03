import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import type { Movie } from '../pages/home';

interface MovieCardProps {
    movie: Movie;
    className?: string;
    mediaType?: 'movie' | 'tv';
    isNew?: boolean;          
    isLandscape?: boolean;    
}

function MovieCard({ movie, className, mediaType = 'movie', isNew, isLandscape }: MovieCardProps) {
    const navigate = useNavigate();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { isAuthenticated, openAuthModal } = useAuth();

    const fav = isFavorite(movie.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal('register');
            return;
        }
        if (fav) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    };

    const handleCardClick = () => {
        const prefix = mediaType === 'tv' ? 'series' : 'movie';
        navigate(`/${prefix}/${movie.id}`);
    };

    const widthClass = className || "w-[165px] sm:w-[195px] md:w-[220px] flex-shrink-0";

    return (
        <div
            onClick={handleCardClick}
            className={`group cursor-pointer ${widthClass}`}
        >
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:shadow-purple-950/40 transition-all duration-300 transform group-hover:-translate-y-2">
                <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Heart Button */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:scale-110 transition-all duration-200 cursor-pointer"
                >
                    <svg
                        className={`w-4.5 h-4.5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'fill-none stroke-white stroke-2'}`}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>

                {/* Hover Play */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="mt-2.5">
                <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors duration-300 truncate">
                    {movie.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 font-medium">
                    <span>{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
                    {movie.vote_average > 0 && (
                        <>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">★ {movie.vote_average.toFixed(1)}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieCard;