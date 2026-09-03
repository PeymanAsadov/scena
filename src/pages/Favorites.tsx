import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { favorites, removeFavorite } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121216] text-white pt-28 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Your Watchlist</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Please log in or create an account to view and manage your saved movies and series.
          </p>
          <button
            onClick={() => openAuthModal('register')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121216] text-white pt-28 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-zinc-900 to-zinc-900 border border-purple-500/20 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Welcome back, <span className="text-purple-400">{user?.firstName}</span>! ✨
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2 font-light">
              Here are all your saved movies and series ({favorites.length} {favorites.length === 1 ? 'item' : 'items'}).
            </p>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Empty State vs Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl text-center px-4">
            <div className="w-16 h-16 bg-zinc-800 text-zinc-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-1">Your Favorites List is Empty</h3>
            <p className="text-zinc-400 text-xs md:text-sm max-w-sm mb-6">
              You haven't saved any movies or series yet. Browse our catalog and click the heart icon on any card to add it to your watchlist.
            </p>
            <Link
              to="/home"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h2 className="text-lg font-bold text-zinc-200">Your Saved Titles</h2>
              <span className="text-xs font-medium text-purple-400 bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full">
                {favorites.length} Saved
              </span>
            </div>

            {/* Grid of Saved Movies */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {favorites.map((movie) => (
                <div key={movie.id} className="flex flex-col space-y-2 group">
                  <MovieCard movie={movie} className="w-full" />

                  {/* Dedicated Direct Remove Button */}
                  <button
                    onClick={() => removeFavorite(movie.id)}
                    className="w-full py-1.5 px-3 bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-transparent text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                    Unfavorite
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
