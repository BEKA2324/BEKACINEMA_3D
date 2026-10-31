import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicPreview } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

function ProtectedHome() {
  const { user, loading } = useAuth();
  if (loading) return <div role="status" className="min-h-screen grid place-items-center">Yuklanmoqda...</div>;
  return user || publicPreview ? <HomePage /> : <Navigate to="/login" replace />;
}
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
