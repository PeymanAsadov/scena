import { useState, useEffect } from 'react';
import { myCustomMovies } from '../data/myMovies';
import { myCustomSeries } from '../data/mySeries';
import HeroSlider from '../components/HeroSlider';
import MovieRow from '../components/MovieRow';

export interface Movie {
    id: string | number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average: number;
    embedId?: string;
    release_date?: string;
    genres?: string[];
    mediaType?: 'movie' | 'tv';
}

function Home() {
    const [allContent, setAllContent] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('Trending Now');

    const categories = ['Trending Now', 'Movies', 'Series'];
    const genres = ['Action', 'Adventure', 'Sci-Fi', 'Crime', 'Comedy', 'Drama'];

    useEffect(() => {
        try {
            const formattedMovies: Movie[] = myCustomMovies.map((m: any) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path || m.poster_path,
    vote_average: m.vote_average,
    embedId: m.embedId,
    release_date: m.release_date || String(m.year || ''), 
    genres: m.genres || [],
    mediaType: 'movie'
}));

            const formattedSeries: Movie[] = myCustomSeries.map((s) => ({
                id: s.id,
                title: s.title,
                poster_path: s.poster_path,
                backdrop_path: s.backdrop_path || s.poster_path,
                vote_average: s.vote_average,
                embedId: s.embedId,
                release_date: s.year ? String(s.year) : undefined,
                genres: s.genres || [],
                mediaType: 'tv'
            }));

            setAllContent([...formattedMovies, ...formattedSeries]);
        } catch (error) {
            console.error("Məlumatlar yüklənərkən xəta baş verdi:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTabContent = () => {
        if (activeTab === 'Movies') {
            return allContent.filter((item) => item.mediaType === 'movie');
        } else if (activeTab === 'Series') {
            return allContent.filter((item) => item.mediaType === 'tv');
        }
        return allContent.filter((item) => item.vote_average >= 7.0);
    };

    const currentTabContent = getTabContent();

    const genreRows = genres
        .map((g) => ({
            genre: g,
            movies: currentTabContent.filter((m) => m.genres?.includes(g)).slice(0, 15)
        }))
        .filter((row) => row.movies.length > 0);

    return (
        <div className="min-h-screen bg-[#0d0d11] text-white relative pb-24 overflow-x-hidden">
            <HeroSlider />

            <div className="mt-8 sm:mt-10 px-6 sm:px-10 md:px-14 lg:px-16 max-w-7xl mx-auto mb-8">
                {/* 3 Əsas Tab: Trending Now, Movies, Series */}
                <div className="flex items-center gap-6 sm:gap-8 border-b border-zinc-800/80 pb-3 text-xs sm:text-sm font-semibold overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`cursor-pointer transition-all pb-2 whitespace-nowrap relative ${activeTab === cat
                                    ? 'text-purple-400 font-bold'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            {cat}
                            {activeTab === cat && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto">
                {loading ? (
                    <div className="space-y-8 px-6 sm:px-10 md:px-14 lg:px-16">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full h-64 bg-zinc-900/60 rounded-2xl animate-pulse border border-zinc-800/50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {genreRows.map(({ genre, movies: genreMovies }) => (
                            <MovieRow
                                key={genre}
                                title={`${activeTab === 'Trending Now' ? 'Trending' : activeTab} ${genre}`}
                                movies={genreMovies}
                                
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;