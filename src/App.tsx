import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ConvertPage } from './pages/ConvertPage';
import { ImagesCatalogPage } from './pages/ImagesCatalogPage';
import { CbzConverterPage } from './pages/CbzConverterPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useThemeStore } from './store/useThemeStore';

export const App: React.FC = () => {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="images" element={<ImagesCatalogPage />} />
          <Route path="cbz" element={<CbzConverterPage />} />
          <Route path="convert/cbz" element={<CbzConverterPage />} />
          <Route path="convert" element={<Navigate to="/convert/image-to-pdf" replace />} />
          <Route path="convert/:toolId" element={<ConvertPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
