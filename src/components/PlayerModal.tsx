import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

interface PlayerModalProps {
    movie: Movie | null;
    onClose: () => void;
}

const getEmbedUrl = (embedId?: string) => {
    if (!embedId) return null;

    if (embedId.startsWith('vi')) {
        return `https://www.imdb.com/video/embed/${embedId}`;
    }

    let youtubeId = embedId;

    if (embedId.includes('youtube.com/watch?v=')) {
        youtubeId = embedId.split('v=')[1]?.split('&')[0];
    } else if (embedId.includes('youtu.be/')) {
        youtubeId = embedId.split('youtu.be/')[1]?.split('?')[0];
    } else if (embedId.includes('youtube.com/embed/')) {
        youtubeId = embedId.split('embed/')[1]?.split('?')[0];
    }

    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
};

export default function PlayerModal({ movie, onClose }: PlayerModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (movie) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [movie]);

    useEffect(() => {
        if (movie) {
            setIsLoading(true);
        }
    }, [movie]);

    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!movie) return null;

    const videoUrl = getEmbedUrl(movie.embedId);

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#121216] border border-white/10 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
            >
                {/* Top Header Panel */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-zinc-900/50">
                    <div className="flex items-center gap-2.5 overflow-hidden pr-4">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0"></span>
                        <h3 className="text-white font-semibold text-sm md:text-base truncate">
                          {movie.title} {(movie as any).year && <span className="text-zinc-500 font-normal text-xs">({(movie as any).year})</span>}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 border border-white/5 text-sm"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Video Area */}
                <div className="relative w-full aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">

                    {/* Spinner*/}
                    {isLoading && videoUrl && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-950 gap-2">
                            <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-medium animate-pulse">Loading...</span>
                        </div>
                    )}

                    {!videoUrl ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 text-xl">
                                🎬
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">Trailer Unavailable</h4>
                            <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                                We couldn't find a trailer link for this movie.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium text-xs transition-all shadow-md shadow-purple-600/30 cursor-pointer active:scale-95"
                            >
                                Go Back
                            </button>
                        </div>
                    ) : (
                        <iframe
                            key={movie.id}
                            src={videoUrl}
                            title={`${movie.title} Trailer`}
                            className="w-full h-full border-0 relative z-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}