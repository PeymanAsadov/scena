import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slideshow } from '../data/slideshow';
import PlayerModal from './PlayerModal';
import type { Movie } from '../pages/home';

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slideshow.length - 1 ? 0 : prevIndex + 1
            );
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const movie = slideshow[currentIndex];

    const handleWatchClick = () => {
        setSelectedMovie({
            id: movie.id,
            title: movie.title,
            poster_path: movie.bgImage,
            vote_average: 9.0,
            embedId: movie.embedId
        });
    };

    const goToDetail = () => {
        if (movie.movieId) {
            navigate(`/movie/${movie.movieId}`);
        }
    };

    return (
        <div className="relative w-full h-[85vh] md:h-[90vh] lg:h-screen text-white bg-zinc-950 overflow-hidden select-none flex items-center">
            {/* Background Image & Gradients */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105"
                style={{ backgroundImage: `url(${movie.bgImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40 md:from-zinc-950 md:via-zinc-950/80 md:to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40"></div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-20 max-w-xl px-6 sm:px-10 md:px-16 lg:px-20 text-left pt-12 flex flex-col items-start">

                {/* Tag Info */}
                <div className="inline-block px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-md mb-4">
                    <p className="text-[10px] sm:text-xs font-semibold text-purple-300/90 tracking-widest uppercase">
                        {movie.info}
                    </p>
                </div>

                
                <h1
                    onClick={goToDetail}
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.15em] sm:tracking-[0.25em] mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-purple-200 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] transition-all duration-300 ${
                        movie.movieId ? 'cursor-pointer hover:from-purple-300 hover:to-indigo-200 hover:scale-[1.01]' : ''
                    }`}
                >
                    {movie.title}
                </h1>

                {/* Description */}
                <p className="text-zinc-300/90 text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-md md:max-w-lg drop-shadow-md font-normal">
                    {movie.description}
                </p>

                {/* Watch Button */}
                <button
                    onClick={handleWatchClick}
                    className="group relative flex items-center gap-2.5 bg-black-600 text-white px-7 py-3.5 rounded-full font-medium transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 active:translate-y-0"
                >
                    <div className="bg-white/20 rounded-full p-1 flex items-center justify-center transition-all duration-300">
                        <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wider text-white">
                        Watch Movie
                    </span>
                </button>
            </div>

            {/* Right Side Stack */}
            <div className="absolute bottom-6 right-6 sm:right-10 md:right-16 z-30 hidden lg:flex flex-col items-end gap-3.5">
                
                {/* Featured Trailer Thumbnails */}
                <div>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-bold mb-2.5 tracking-widest uppercase opacity-90 text-right">
                        Featured Trailers
                    </p>
                    <div className="flex gap-3">
{(movie as any).trailers && (movie as any).trailers.map((trailerImg: string, idx: number) => (                            <div
                                key={idx}
                                onClick={() => setSelectedImage(trailerImg)}
                                className="relative w-28 sm:w-32 md:w-36 h-16 sm:h-18 rounded-xl overflow-hidden border border-white/15 hover:border-purple-500 shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 group"
                            >
                                <img
                                    src={trailerImg}
                                    alt={`Trailer ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex items-center gap-2 pt-1 pr-1">
                    {slideshow.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${
                                currentIndex === idx
                                    ? 'w-8 sm:w-10 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.7)]'
                                    : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-2xl p-4 md:p-10 animate-fade-in">
                    <div className="relative max-w-4xl w-full bg-zinc-900/90 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 p-2">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 z-10 bg-zinc-800/80 hover:bg-purple-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 border border-white/10 hover:scale-110 shadow-lg cursor-pointer"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full Screen Trailer"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mx-auto"
                        />
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            <PlayerModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </div>
    );
}