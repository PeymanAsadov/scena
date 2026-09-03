import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { myCustomMovies } from '../../data/myMovies';
import { myCustomSeries } from '../../data/mySeries';
import { myCustomCartoons } from "../../data/myCartoons";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const [selectedIndex, setSelectedIndex] = useState(0);
    const resultsContainerRef = useRef<HTMLDivElement>(null);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();
    const { favorites } = useFavorites();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative pb-1.5 border-b-2 transition-colors ${isActive
            ? 'text-purple-400 border-purple-500'
            : 'border-transparent hover:text-purple-400'
        }`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-3 rounded-xl transition-all ${isActive
            ? 'text-purple-400 bg-white/5 border-l-2 border-purple-500'
            : 'hover:text-purple-400 hover:bg-white/5'
        }`;

    const trendingMovies = [
        'JAMES BOND 007 NO TIME TO DIE',
        'The Dark Knight',
        'Interstellar',
        'Dune: Part Two',
        'Spider-Man: No Way Home'
    ];

    const allSearchableContent = [
        ...myCustomMovies.map((m) => ({ ...m, mediaType: 'movie' as const })),
        ...myCustomSeries.map((s) => ({ ...s, mediaType: 'tv' as const })),
        ...myCustomCartoons.map((c) => ({ ...c, mediaType: 'cartoon' as const })),
    ];

    // Handle navbar visibility and background on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 10);

            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
                setIsMobileMenuOpen(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const filteredResults = allSearchableContent.filter((item) => {
        const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || item.genres.includes(activeFilter);
        return matchesQuery && matchesFilter;
    });

    const activeList = searchQuery.trim() !== '' ? filteredResults : trendingMovies;

    // Handle media selection & routing
    const handleMediaSelect = (idOrItem: number | string | { id: number | string; mediaType: 'movie' | 'tv' | 'cartoon' }) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSelectedIndex(0);

        if (typeof idOrItem === 'object' && idOrItem !== null) {
            let prefix = 'movie';
            if (idOrItem.mediaType === 'tv') prefix = 'series';
            else if (idOrItem.mediaType === 'cartoon') prefix = 'cartoon';
            
            navigate(`/${prefix}/${idOrItem.id}`);
        } else if (typeof idOrItem === 'number') {
            navigate(`/movie/${idOrItem}`);
        } else {
            setSearchQuery(idOrItem as string);
        }
    };

    // Handle ESC, arrow keys, Enter, and body scroll lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isSearchOpen) return;

            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsMobileMenuOpen(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev < activeList.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeList.length > 0 && activeList[selectedIndex]) {
                    const selectedItem = activeList[selectedIndex];
                    if (typeof selectedItem === 'object' && selectedItem !== null && 'id' in selectedItem) {
                        handleMediaSelect(selectedItem as { id: number | string; mediaType: 'movie' | 'tv' | 'cartoon' });
                    } else if (typeof selectedItem === 'string') {
                        setSearchQuery(selectedItem);
                    }
                }
            }
        };

        document.body.style.overflow = (isSearchOpen || isMobileMenuOpen) ? 'hidden' : 'unset';

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isSearchOpen, isMobileMenuOpen, selectedIndex, activeList]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery, activeFilter]);

    useEffect(() => {
        if (resultsContainerRef.current) {
            const selectedElement = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHeartClick = () => {
        setIsMobileMenuOpen(false);
        if (!isAuthenticated) {
            openAuthModal('register');
        } else {
            navigate('/favorites');
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    } ${isScrolled
                        ? 'bg-black/75 backdrop-blur-md py-3 shadow-2xl shadow-purple-950/20'
                        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link to="/home" className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 tracking-widest drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]">
                        SCÉNA
                    </Link>

                    {/* Action Icons, Desktop Menu & Profile */}
                    <div className="flex items-center gap-3 sm:gap-5 ml-auto">

                        {/* Desktop Navigation Links */}
                        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-300 mr-3">
                            <li>
                                <NavLink to="/home" className="relative pb-1.5 border-b-2 border-transparent transition-colors hover:text-purple-400">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/movies" className={navLinkClass}>
                                    Movies
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/series" className={navLinkClass}>
                                    Series
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/cartoons" className={navLinkClass}>
                                    Cartoons
                                </NavLink>
                            </li>
                        </ul>

                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search"
                            className="p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Favorites Button */}
                        <button
                            onClick={handleHeartClick}
                            aria-label="Favorites"
                            className="relative p-2.5 rounded-full text-zinc-300 hover:text-red-500 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                        >
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-90" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {favorites.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex items-center justify-center h-4 min-w-[16px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-full shadow-[0_0_12px_rgba(225,29,72,0.8)] border border-black">
                                    {favorites.length}
                                </span>
                            )}
                        </button>

                        {/* User Profile Menu */}
                        <div className="relative hidden sm:block" ref={profileMenuRef}>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-2.5 focus:outline-none cursor-pointer group py-1 px-2 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/30 flex items-center justify-center text-white font-medium text-xs shadow-md">
                                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : <i className="fa-regular fa-user text-xs"></i>}
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors pr-1">
                                            {user?.firstName}
                                        </span>
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 backdrop-blur-xl animate-fadeIn">
                                            <div className="px-4 py-3 border-b border-zinc-900">
                                                <p className="text-xs font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { navigate('/favorites'); setIsProfileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-purple-600/10 hover:text-purple-400 transition-colors cursor-pointer flex items-center justify-between"
                                            >
                                                <span>Saved Favorites</span>
                                                <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{favorites.length}</span>
                                            </button>
                                            <button
                                                onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-0.5 border-t border-zinc-900"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                            className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col pt-28 px-6 pb-8 lg:hidden overflow-y-auto transition-all animate-fadeIn">
                    <div className="flex flex-col gap-2 text-lg font-medium text-zinc-200">
                        <NavLink to="/home" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass}>
                            Movies
                        </NavLink>
                        <NavLink to="/series" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass}>
                            Series
                        </NavLink>
                        <NavLink to="/cartoons" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass}>
                            Cartoons
                        </NavLink>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {isSearchOpen && (
                <div
                    onClick={() => setIsSearchOpen(false)}
                    className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-all duration-300 pt-16 sm:pt-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-xl bg-zinc-950/95 border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden backdrop-blur-2xl ring-1 ring-purple-500/20"
                    >
                        <div className="flex items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10">
                            <svg className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies, action, sci-fi..."
                                className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm focus:outline-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="mr-2 sm:mr-3 text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    Clear
                                </button>
                            )}
                            <button onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded cursor-pointer hover:text-white transition-colors flex-shrink-0">
                                ESC
                            </button>
                        </div>

                        {/* Category Filters */}
                        <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/5 bg-zinc-900/30 text-xs overflow-x-auto scrollbar-none">
                            {['All', 'Action', 'Adventure', 'Sci-Fi', 'Crime', 'Comedy', 'Drama'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium text-[11px] whitespace-nowrap ${activeFilter === filter
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Results List */}
                        <div className="p-4 sm:p-5 max-h-[320px] sm:max-h-[380px] overflow-y-auto">
                            {searchQuery.trim() !== '' ? (
                                <div>
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                        Search Results ({filteredResults.length})
                                    </div>

                                    {filteredResults.length > 0 ? (
                                        <div className="flex flex-col gap-2" ref={resultsContainerRef}>
                                            {filteredResults.map((item, index) => (
                                                <div
                                                    key={`${item.mediaType}-${item.id}`}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    onClick={() => handleMediaSelect(item)}
                                                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${selectedIndex === index
                                                        ? 'bg-white/10 border-purple-500/50 shadow-lg'
                                                        : 'bg-zinc-900/50 hover:bg-white/10 border-white/5'
                                                        }`}
                                                >
                                                    <img src={item.poster_path} alt={item.title} className="w-10 h-14 object-cover rounded-lg shadow-md flex-shrink-0" />
                                                    <div className="flex flex-col justify-center flex-1 min-w-0">
                                                        <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors truncate">
                                                            {item.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.mediaType === 'tv' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                                                {item.mediaType === 'tv' ? 'SERIES' : 'MOVIE'}
                                                            </span>
                                                            <span>{item.year}</span>
                                                            <span>•</span>
                                                            <span className="text-purple-400/90 truncate">{item.genres.join(', ')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 text-[10px] font-bold text-amber-400 border border-zinc-800 flex-shrink-0">
                                                        ★ {item.vote_average}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-xs text-zinc-500">
                                            No movies found for "{searchQuery}".
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                        Trending Searches
                                    </div>
                                    <div className="flex flex-col gap-2" ref={resultsContainerRef}>
                                        {trendingMovies.map((title, index) => (
                                            <button
                                                key={title}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                onClick={() => setSearchQuery(title)}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer group ${selectedIndex === index
                                                    ? 'bg-white/10 border-purple-500/50 text-white'
                                                    : 'bg-zinc-900/50 hover:bg-white/10 border-white/5 text-zinc-300'
                                                    }`}
                                            >
                                                <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span className="truncate">{title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:flex items-center justify-center gap-6 px-5 py-3 bg-zinc-950/80 border-t border-white/5 text-[10px] text-zinc-500 font-mono">
                            <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">↑↓</span>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">↵</span>
                                <span>Select</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">ESC</span>
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}