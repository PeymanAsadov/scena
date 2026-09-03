import { useState, useRef, useEffect } from 'react';
import { myCustomMovies } from '../data/myMovies';
import MovieCard from '../components/MovieCard';

export default function MoviesPage() {
    const [selectedGenre, setSelectedGenre] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Crime', 'Comedy', 'Drama'];

    const sortOptions = [
        { value: 'rating', label: 'Top Rated' },
        { value: 'year', label: 'Newest' },
    ];

    const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMovies = myCustomMovies
        .filter((movie) => selectedGenre === 'All' || movie.genres?.includes(selectedGenre))
        .sort((a, b) => {
            if (sortBy === 'rating') {
                return b.vote_average - a.vote_average;
            } else {
                return (b.year || 0) - (a.year || 0);
            }
        });

    return (
        <div className="min-h-screen bg-[#0d0d11] text-white pt-24 px-6 md:px-16 pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <span className="text-purple-400 text-xs font-bold tracking-widest uppercase">Browse</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">MOVIES</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Explore all movies with genre pickers, release sorting, and top ratings.
                    </p>
                </div>

                {/* Filter and Sort Panel */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${selectedGenre === genre
                                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                    : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative self-end sm:self-auto" ref={dropdownRef}>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="font-medium select-none">Sort:</span>

                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center justify-between gap-2.5 bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-700/60 hover:border-purple-500/50 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all cursor-pointer"
                            >
                                <span>{currentSortLabel}</span>
                                <svg
                                    className={`w-3 h-3 text-purple-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-[#121216]/95 border border-zinc-800/80 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value as 'rating' | 'year');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${sortBy === option.value
                                            ? 'bg-purple-600/20 text-purple-300 font-semibold border-l-2 border-purple-500'
                                            : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.value && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            mediaType="movie"
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}