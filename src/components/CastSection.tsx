import type { CastMember } from '../data/api/tmdb';
import { getCastImageUrl } from '../data/api/tmdb';

interface CastSectionProps {
    cast: CastMember[];
    loading: boolean;
}

export default function CastSection({ cast, loading }: CastSectionProps) {
    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold border-b border-zinc-800 pb-3 mb-6">Featured Cast</h2>
                <p className="text-zinc-500 text-sm animate-pulse">Loading...</p>
            </div>
        );
    }

    if (cast.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold border-b border-zinc-800 pb-3 mb-6">Featured Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {cast.map((actor) => {
                    const img = getCastImageUrl(actor.profile_path);
                    return (
                        <div
                            key={actor.id}
                            className="flex-shrink-0 w-32 bg-zinc-900/60 border border-zinc-800/60 rounded-lg overflow-hidden"
                        >
                            {/* Actor profile image container */}
                            <div className="w-full aspect-square bg-zinc-800">
                                {img ? (
                                    <img src={img} alt={actor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-bold text-zinc-100 truncate">{actor.name}</p>
                                <p className="text-[11px] text-zinc-400 truncate">{actor.character}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}