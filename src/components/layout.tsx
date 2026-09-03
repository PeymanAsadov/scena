import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./nav/navbar";
import AuthModal from "./AuthModal";

function Layout() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTopSlow = () => {
    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 1200; 

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animation = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - easeProgress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white relative">
      <Navbar />
      <AuthModal />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Smooth Scroll Button */}
      <button
        onClick={scrollToTopSlow}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 backdrop-blur-md border border-white/20 transition-all duration-500 ease-out cursor-pointer group ${showScrollBtn
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-50 pointer-events-none"
          }`}
      >
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}

export default Layout;