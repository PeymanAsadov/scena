import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type User } from '../context/AuthContext';

export interface CountryOption {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
    phoneMaxLength: number;
    phonePlaceholder: string;
}

const COUNTRIES: CountryOption[] = [
    { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', phoneMaxLength: 9, phonePlaceholder: '50 123 45 67' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', phoneMaxLength: 10, phonePlaceholder: '900 123 45 67' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', phoneMaxLength: 10, phonePlaceholder: '7123 456789' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', phoneMaxLength: 10, phonePlaceholder: '202 555 0143' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', phoneMaxLength: 9, phonePlaceholder: '500 123 456' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', phoneMaxLength: 9, phonePlaceholder: '600 123 456' },
];

export default function AuthModal() {
    const { isAuthModalOpen, initialTab, closeAuthModal, registerUser, loginWithCredentials } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>(initialTab);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isAuthModalOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isAuthModalOpen]);

    useEffect(() => {
        if (isAuthModalOpen) {
            setMode(initialTab);
            setError('');
            setSuccessMessage('');
        }
    }, [isAuthModalOpen, initialTab]);

    if (!isAuthModalOpen) return null;

    const isValidEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address (e.g., name@example.com).');
            return;
        }

        if (mode === 'register') {
            if (!firstName || !lastName || !phoneNumber) {
                setError('First name, last name, and phone number are required for registration.');
                return;
            }

            const cleanDigits = phoneNumber.replace(/\D/g, '');
            if (cleanDigits.length !== selectedCountry.phoneMaxLength) {
                setError(`For ${selectedCountry.name}, the phone number must be exactly ${selectedCountry.phoneMaxLength} digits.`);
                return;
            }

            if (password.length < 4) {
                setError('Password must be at least 4 characters long.');
                return;
            }

            const newUser: User = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: `${selectedCountry.dialCode} ${phoneNumber.trim()}`,
                password: password,
                countryCode: selectedCountry.code,
            };

            registerUser(newUser);
            setSuccessMessage('Registration successful! Please log in.');
            setMode('login');
            setPassword('');
            return;
        }

        const isValid = loginWithCredentials(email, password);

        if (!isValid) {
            setError('Invalid email or password. Please try again.');
            return;
        }

        closeAuthModal();
        navigate('/favorites');
    };

    const handleSelectCountry = (country: CountryOption) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setPhoneNumber('');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= selectedCountry.phoneMaxLength) {
            setPhoneNumber(val);
        }
    };

    const handleTabChange = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity">
            {/* Modal Card */}
            <div
                className="relative w-full max-w-md max-h-[92vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-zinc-800 shrink-0">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                            {mode === 'register' ? 'Sign up to manage your favorite movies' : 'Sign in to access your saved watchlist'}
                        </p>
                    </div>
                    <button
                        onClick={closeAuthModal}
                        aria-label="Close Modal"
                        className="p-2 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab Selector*/}
                <div className="flex bg-zinc-950 p-1 mx-5 sm:mx-6 mt-3.5 rounded-xl border border-zinc-800/60 shrink-0">
                    <button
                        type="button"
                        onClick={() => handleTabChange('register')}
                        className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${mode === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('login')}
                        className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        Login
                    </button>
                </div>

                {/* Form Body*/}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 sm:p-6 space-y-3 overflow-y-auto flex-1 
                        [&::-webkit-scrollbar]:w-1.5 
                        [&::-webkit-scrollbar-track]:bg-transparent 
                        [&::-webkit-scrollbar-thumb]:bg-zinc-700/60 
                        [&::-webkit-scrollbar-thumb]:rounded-full 
                        [&::-webkit-scrollbar-thumb]:hover:bg-purple-500"
                >
                    {successMessage && (
                        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 shadow-lg">
                            <svg className="w-4 h-4 fill-current shrink-0 text-emerald-400" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4 fill-current shrink-0 text-red-400" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {mode === 'register' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-zinc-400 mb-1">
                                    First Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-xs font-medium text-zinc-400 mb-1">
                                    Last Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] sm:text-xs font-medium text-zinc-400 mb-1">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john.doe@example.com"
                            required
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[11px] sm:text-xs font-medium text-zinc-400">
                                    Phone Number <span className="text-red-400">*</span>
                                </label>
                                <span className="text-[10px] text-zinc-500">
                                    ({phoneNumber.length}/{selectedCountry.phoneMaxLength} digits)
                                </span>
                            </div>
                            <div className="relative flex items-center">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-1 px-2.5 py-2 bg-zinc-950 border border-r-0 border-zinc-800 rounded-l-xl text-xs font-medium text-white hover:bg-zinc-800/60 transition-colors focus:outline-none cursor-pointer"
                                    >
                                        <span className="text-sm">{selectedCountry.flag}</span>
                                        <span className="text-[11px] font-semibold text-purple-400">{selectedCountry.dialCode}</span>
                                        <svg
                                            className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl z-50 overflow-hidden py-1 divide-y divide-zinc-800/60">
                                            <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                                Select Country
                                            </div>
                                            <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                                {COUNTRIES.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => handleSelectCountry(country)}
                                                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer ${selectedCountry.code === country.code ? 'bg-purple-600/30 text-purple-400 font-bold' : 'text-zinc-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm">{country.flag}</span>
                                                            <span>{country.name}</span>
                                                        </div>
                                                        <span className="text-zinc-400 font-mono text-[11px]">{country.dialCode}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder={selectedCountry.phonePlaceholder}
                                    required
                                    maxLength={selectedCountry.phoneMaxLength}
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-r-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all font-mono"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] sm:text-xs font-medium text-zinc-400 mb-1">
                            Password <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-1 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                        {mode === 'register' ? 'Register Account' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div className="px-5 sm:px-6 py-3 bg-zinc-950/60 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 shrink-0">
                    By continuing, you agree to SCÉNA's Terms of Service & Privacy Policy.
                </div>
            </div>
        </div>
    );
}