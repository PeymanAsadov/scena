import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 border-t border-zinc-800/60 pt-16 pb-8 overflow-hidden select-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-purple-600/10 via-indigo-600/15 to-purple-600/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16 items-start">

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/home" className="inline-block">
              <span className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]">
                SCÉNA
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm font-normal">
              Discover, stream, and explore your favorite cinema collection with high-definition clarity and smooth cinematic immersion.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-zinc-100 font-bold text-xs uppercase tracking-widest border-b border-purple-500/20 pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/home" className="hover:text-purple-400 transition-colors duration-200 block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-purple-400 transition-colors duration-200 block py-0.5">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/series" className="hover:text-purple-400 transition-colors duration-200 block py-0.5">
                  Series
                </Link>
              </li>
              <li>
                <Link to="/cartoons" className="hover:text-purple-400 transition-colors duration-200 block py-0.5">
                  Cartoons
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box*/}
          <div className="md:col-span-4 space-y-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-md">
            <h3 className="text-zinc-100 font-bold text-xs uppercase tracking-widest">
              Newsletter
            </h3>
            <p className="text-xs text-zinc-400">
              Get notified when new blockbusters and exclusive trailers hit the platform.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-zinc-950/90 border border-zinc-800 focus:border-purple-500/70 text-zinc-100 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-[0.98] cursor-pointer"
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe Now'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800/60 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} SCÉNA. Built with passion for digital cinema.</p>

          {/* Social Links */}
          <div className="flex items-center space-x-6 font-medium mr-6">
            <a
              href="https://github.com/PeymanAsadov"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/peyman-asadov-42a8b8416"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a
              href="mailto:peymanasadovv@gmail.com"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}