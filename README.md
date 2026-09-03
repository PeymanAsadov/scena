<div align="center">

# 🎬 SCÉNA — Modern Movie & Series Streaming Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)


*A premium cinematic web application inspired by modern streaming services, built with clean architecture, precise type safety, and a sophisticated dark-mode UI.*

</div>

---

## 🚀 About The Project

**SCÉNA** is a production-grade streaming web platform designed to replicate the sleek interface and smooth user experience of modern media services like Netflix. It features dynamic content filtering, interactive watchlist management, custom video trailer modals, and a fully responsive layout tailored for all devices.
---

## ✨ Key Features

- **Multi-Category Discovery:** Seamlessly switch between *Trending*, *Movies*, *Series*, and *Cartoons* with advanced genre filtering.
- **Interactive Watchlist:** Add and remove titles to your personal favorites list instantly, backed by React Context API and persistent state handling.
- **Custom Video Player Modal:** Built-in modal supporting YouTube embeds, direct video links, auto-play features, and error handling.
- **Global Scroll-to-Top Architecture:** Custom router scroll interceptor ensuring seamless layout transitions across pages and tabs.
- **Responsive Dark-Mode UI:** Crafted with Tailwind CSS utilizing custom dark color palettes (`#121216`), glassmorphism effects, and smooth transitions.

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks, Functional Components)
- **Language:** TypeScript (Strict Type Safety)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM (v6)
- **State Management:** React Context API (`AuthContext`, `FavoritesContext`)
- **Build Tool:** Vite

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI building blocks (Navbar, Footer, MovieCard, PlayerModal, etc.)
├── context/             # Global application state (Auth, Favorites)
├── data/                # Local curated datasets & API helpers
├── pages/               # Route views (Home, Detail, Favorites, MoviesPage, SeriesPage, CartoonsPage)
├── App.tsx              # Root component with routing and providers
└── main.tsx             # Application entry point

## 👤 Author

**Peyman Asadov**
- **Role:** Frontend Software Developer
- **Email:** peymanasadovv@gmail.com
- **GitHub:** https://github.com/peyman-asadov
- **Location:** Sumqayit, Azerbaijan