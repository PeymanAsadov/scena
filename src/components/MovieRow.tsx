import { useRef } from 'react';
import type { Movie } from '../pages/home';
import MovieCard from './MovieCard';

interface MovieRowProps {
    title: string;
    movies?: Movie[]; 
    markNewCount?: number;
    landscapeIndexes?: number[];
    onViewAll?: () => void;
}

export default function MovieRow({
    title,
    movies = [],
    markNewCount = 0,
    landscapeIndexes = [],
    onViewAll
}: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.8;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth'
        });
    };

    // Safe length check
    if (!movies || movies.length === 0) return null;

    return (
        <div className="mb-14 relative group/row">
            {/* Title */}
            <div className="flex items-center justify-between px-6 md:px-10 mb-4">
                <div className="relative border-b-2 border-purple-600 pb-1">
                    <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
                </div>
                
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Right side soft Gradient Fade */}
                <div className="pointer-events-none absolute top-0 right-0 bottom-3 w-16 bg-gradient-to-l from-[#121216] via-[#121216]/60 to-transparent z-10" />

                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-3 z-20 w-12 bg-gradient-to-r from-[#121216] via-[#121216]/80 to-transparent flex items-center justify-start px-2 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-3 z-20 w-12 bg-gradient-to-l from-[#121216] via-[#121216]/80 to-transparent flex items-center justify-end px-2 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Grid of cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-7 md:gap-8 overflow-x-auto scroll-smooth px-6 md:px-10 pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-start"
                >
                    {movies.map((movie, idx) => (
                        <MovieCard
                            key={`${title}-${movie.id}-${idx}`}
                            movie={movie}
                            isNew={idx < markNewCount}
                            isLandscape={landscapeIndexes.includes(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}