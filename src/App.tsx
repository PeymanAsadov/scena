import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/Favorites';
import Movies from './pages/MoviesPage';
import Series from './pages/SeriesPage';
import CartoonsPage from './pages/CartoonsPage';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />

              <Route path="movie/:id" element={<Detail />} />
              <Route path="series/:id" element={<Detail />} />
              <Route path="cartoon/:id" element={<Detail />} />

              <Route path="/cartoons" element={<CartoonsPage />} />
              <Route path="/series" element={<Series />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;