import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { myCustomMovies } from '../data/myMovies';
import { myCustomSeries } from '../data/mySeries';
import { myCustomCartoons } from '../data/myCartoons';
import { getMovieCredits, getSeriesDetails, type CastMember } from '../services/tmdb';
import CastSection from '../components/CastSection';
import MovieCard from '../components/MovieCard';
import type { Movie } from './home';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function MovieDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [movie, setMovie] = useState<any | null>(null);
    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [cast, setCast] = useState<CastMember[]>([]);
    const [castLoading, setCastLoading] = useState<boolean>(true);

    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { isAuthenticated, openAuthModal } = useAuth();
    const gridRef = useRef<HTMLDivElement>(null);

    const isCartoon = location.pathname.includes('/cartoon') || myCustomCartoons.some(m => String(m.id) === String(id));
    const isSeries = location.pathname.includes('/series') || myCustomSeries.some(m => String(m.id) === String(id));

    useEffect(() => {
        setLoading(true);

        const allMedia = [...myCustomMovies, ...myCustomSeries, ...myCustomCartoons];

        let targetList = myCustomMovies;
        if (isCartoon) {
            targetList = myCustomCartoons;
        } else if (isSeries) {
            targetList = myCustomSeries;
        }

        let found = targetList.find((m) => String(m.id) === String(id));

        if (!found) {
            found = allMedia.find((m) => String(m.id) === String(id));
        }

        if (found) {
            setMovie(found);

            let targetList = myCustomMovies;
            if (isCartoon) {
                targetList = myCustomCartoons;
            } else if (isSeries) {
                targetList = myCustomSeries;
            }

            const filtered = targetList.filter((m) => {
                if (String(m.id) === String(id)) return false;

                if (found.genres && m.genres) {
                    return m.genres.some((g: string) => found.genres.includes(g));
                }
                return true;
            });

            setRecommendedMovies(filtered as Movie[]);

        } else {
            setMovie(null);
        }

        setLoading(false);
        window.scrollTo(0, 0);
    }, [id, isCartoon, isSeries]);


    useEffect(() => {
        if (!movie?.tmdbId) {
            setCast([]);
            setCastLoading(false);
            return;
        }

        setCastLoading(true);

        const shouldFetchAsTv = isSeries || isCartoon;

        console.log("Fetching cast for:", movie.title, "TMDB ID:", movie.tmdbId, "Is TV/Series:", shouldFetchAsTv);

        if (shouldFetchAsTv) {
            getSeriesDetails(movie.tmdbId)
                .then((data) => {
                    console.log("TV Details Data received:", data);
                    const castList = data.credits?.cast || data.cast || [];
                    setCast(castList);
                    setCastLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching series details:", err);
                    setCast([]);
                    setCastLoading(false);
                });
        } else {
            getMovieCredits(movie.tmdbId)
                .then((data) => {
                    console.log("Movie Credits Data received:", data);
                    setCast(data || []);
                    setCastLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching movie credits:", err);
                    setCast([]);
                    setCastLoading(false);
                });
        }
    }, [movie?.tmdbId, isSeries, isCartoon]);

    const scrollGrid = (direction: 'left' | 'right') => {
        if (gridRef.current) {
            const { scrollLeft, clientWidth } = gridRef.current;
            const scrollAmount = clientWidth * 0.75; // Ekranın 75%-i qədər sürüşdürür
            gridRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth' // <- Hamar keçidi təmin edən hissə budur!
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center animate-pulse">
                Loading...
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
                Content not found.
            </div>
        );
    }

    const isFav = isFavorite(movie.id);

    const handleToggleFavorite = () => {
        if (!isAuthenticated) {
            openAuthModal('register');
            return;
        }
        if (isFav) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    };

    const posterImg = movie.poster_path?.startsWith('http')
        ? movie.poster_path
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const hasTrailer = Boolean(movie.embedId);
    const embedUrl = movie.embedId?.startsWith('vi')
        ? `https://www.imdb.com/video/embed/${movie.embedId}`
        : `https://www.youtube.com/embed/${movie.embedId}`;

    const getBackPath = () => {
        if (isCartoon) return '/cartoons';
        if (isSeries) return '/series';
        return '/movies';
    };

    const getBackLabel = () => {
        if (isCartoon) return 'Cartoons';
        if (isSeries) return 'Series';
        return 'Movies';
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 px-6 md:px-16 pb-16">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">

                {/* --- BREADCRUMB --- */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400 font-medium">
                    <Link to="/" className="hover:text-purple-400 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link
                        to={getBackPath()}
                        className="hover:text-purple-400 transition-colors"
                    >
                        {getBackLabel()}
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-100 font-semibold truncate max-w-[200px] md:max-w-xs">
                        {movie.title}
                    </span>
                </div>

                {/* Title and Trailer label */}
                <div className="flex items-center justify-between pb-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">{movie.title}</h1>
                    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                        Trailer
                    </span>
                </div>

                {/* Video Player */}
                <div className="relative w-full aspect-video bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex items-center justify-center">
                    {!hasTrailer ? (
                        <div className="text-zinc-500 text-sm font-medium">
                            Bu kontent üçün treyler əlavə olunmayıb.
                        </div>
                    ) : (
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allowFullScreen
                            title={movie.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    )}
                </div>

                {/* Information panel */}
                <div className="flex flex-wrap items-center gap-4 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                    <span className="text-amber-400 font-semibold text-sm flex items-center gap-1.5">
                        ★ {movie.vote_average || "8.0"}
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400 text-sm font-medium">{movie.year || "2025"}</span>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={handleToggleFavorite}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${isFav
                                ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                                }`}
                        >
                            <svg
                                className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'fill-none stroke-current stroke-2'}`}
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {isFav ? 'Remove from My List' : '+ Add to My List'}
                        </button>
                    </div>
                </div>

                {/* Poster and About */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 bg-zinc-950/30 p-5 md:p-6 rounded-2xl border border-zinc-900/80">

    {/* Poster */}
    <div className="md:col-span-2 aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-zinc-900 max-w-[200px] md:max-w-none mx-auto w-full">
        <img
            src={posterImg}
            alt={movie.title}
            className="w-full h-full object-cover"
        />
    </div>

    {/* Movie Info */}
    <div className="md:col-span-4 flex flex-col justify-start pt-2 md:pt-4">
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-100">
            {movie.title}
        </h2>

        <p className="mt-35 text-zinc-400 text-sm md:text-base leading-relaxed font-light max-w-3xl">
            {movie.overview || "Bu kontent haqqında məlumat yerli bazadan oxunur."}
        </p>

    </div>
</div>

                {/* Cast */}
                <CastSection cast={cast} loading={castLoading} />

                {/* Similar / Recommended Content */}
                <div className="mt-6">
                    <div className="flex items-center justify-between pb-3 mb-3">
                        <h2 className="text-base font-bold text-zinc-200">You May Also Like</h2>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scrollGrid('left')}
                                className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 active:scale-95 cursor-pointer text-xs font-medium shadow-sm hover:text-white"
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => scrollGrid('right')}
                                className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 active:scale-95 cursor-pointer text-xs font-medium shadow-sm hover:text-white"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                    <div
                        ref={gridRef}
                        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-3"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {recommendedMovies.map((rec) => (
                            <MovieCard
                                key={rec.id}
                                movie={rec}
                                className="w-[120px] sm:w-[140px] md:w-[160px] flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}